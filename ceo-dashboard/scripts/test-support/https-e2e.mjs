// End-to-end over REAL HTTPS against the REAL Next.js server and REAL PostgreSQL (see run-https-e2e.sh).
// The browser-only owner consent screen needs Supabase Auth and is NOT covered: the post-consent state is
// created with the real SQL function the consent route calls.
import crypto from 'node:crypto';
import pg from 'pg';
const BASE = process.env.E2E_BASE, DB = process.env.E2E_DB, PLAIN = process.env.E2E_PLAIN_HTTP;
const REDIRECT = 'https://claude.ai/api/mcp/auth_callback';
let passed = 0;
const ok = (c, label, extra = '') => { if (!c) { console.error('FAILED:', label, extra); process.exitCode = 1; throw new Error(label); } passed++; console.log('  ok -', label); };
const pool = new pg.Pool({ connectionString: DB, max: 4 });
const b64 = b => Buffer.from(b).toString('base64url');
const sha = s => crypto.createHash('sha256').update(s).digest();
const post = (path, body, headers = {}) => fetch(BASE + path, { method: 'POST', body, headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers } });
const tokenReq = o => post('/api/consensus/oauth/token', new URLSearchParams(o).toString());
const mcp = (token, body) => fetch(BASE + '/api/consensus/mcp', { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(body) });
const call = (token, id, name, args) => mcp(token, { jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
const text = async r => JSON.parse((await r.json()).result.content[0].text);

async function mintCode(subject, scopes) {
  const verifier = b64(crypto.randomBytes(48));
  const code = crypto.randomBytes(32).toString('hex');
  const now = new Date(), exp = new Date(now.getTime() + 300_000);
  await pool.query("select public.issue_ai_consensus_oauth_code_with_consent($1,$2,$3,$4,$5,$6,$7,$8)",
    [crypto.createHash('sha256').update(code).digest('hex'), 'claude', REDIRECT, subject, b64(sha(verifier)), scopes, now.toISOString(), exp.toISOString()]);
  return { code, verifier };
}
const codeGrant = async (subject, scopes = ['consensus.read', 'consensus.write']) => {
  const { code, verifier } = await mintCode(subject, scopes);
  const r = await tokenReq({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT, client_id: 'claude', code_verifier: verifier, resource: BASE + '/api/consensus/mcp' });
  return { r, body: await r.json(), code, verifier };
};

const owner = (await pool.query('insert into auth.users default values returning id')).rows[0].id;
const other = (await pool.query('insert into auth.users default values returning id')).rows[0].id;

console.log('1. TLS + discovery');
const meta = await fetch(BASE + '/.well-known/oauth-authorization-server');
const m = await meta.json();
ok(BASE.startsWith('https://') && meta.status === 200, 'authorization-server metadata served over verified HTTPS');
ok(m.issuer === process.env.E2E_ISSUER && m.grant_types_supported.includes('refresh_token') && m.revocation_endpoint === BASE + '/api/consensus/oauth/revoke', 'metadata advertises refresh_token + revocation endpoint', JSON.stringify(m));
ok(m.authorization_response_iss_parameter_supported === true, 'RFC 9207 iss support advertised (ChatGPT stable redirect URI)');
ok(m.token_endpoint_auth_methods_supported.join() === 'none' && m.code_challenge_methods_supported.join() === 'S256', 'public client + S256 only');
const prm = await (await fetch(BASE + '/.well-known/oauth-protected-resource')).json();
ok(prm.resource === BASE + '/api/consensus/mcp' && prm.authorization_servers[0] === m.issuer, 'protected-resource metadata consistent');
const plain = await fetch(PLAIN + '/.well-known/oauth-authorization-server').then(r => r.status).catch(() => -1);
ok(plain === 503, 'the same server answers 503 when reached over plain HTTP (issuer/origin must be https)', String(plain));
const noAuth = await mcp(null, { jsonrpc: '2.0', id: 1, method: 'ping' });
ok(noAuth.status === 401 && /resource_metadata="https:\/\/localhost:\d+\/\.well-known\/oauth-protected-resource"/.test(noAuth.headers.get('www-authenticate') ?? ''), 'unauthenticated MCP call -> 401 with resource_metadata');

console.log('2. authorization_code -> access + refresh');
const g1 = await codeGrant(owner);
ok(g1.r.status === 200 && g1.body.refresh_token && g1.body.token_type === 'Bearer' && g1.body.expires_in === 600, 'token endpoint issues access + refresh token', JSON.stringify(g1.body));
ok(g1.r.headers.get('cache-control') === 'no-store', 'token response is no-store');
const replay = await tokenReq({ grant_type: 'authorization_code', code: g1.code, redirect_uri: REDIRECT, client_id: 'claude', code_verifier: g1.verifier });
ok(replay.status === 400 && (await replay.json()).error === 'invalid_grant', 'authorization code replay rejected over HTTPS');
const afterReplay = await mcp(g1.body.access_token, { jsonrpc: '2.0', id: 2, method: 'ping' });
ok(afterReplay.status === 401, 'replayed code revoked the grant it produced: its access token is dead');

console.log('3. MCP with a live grant (initialize / list / tools, owner isolation)');
const g2 = await codeGrant(owner);
let access = g2.body.access_token, refresh = g2.body.refresh_token;
ok((await (await mcp(access, { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })).json()).result.protocolVersion === '2025-11-25', 'initialize');
ok((await (await mcp(access, { jsonrpc: '2.0', id: 2, method: 'tools/list' })).json()).result.tools.length === 4, 'tools/list exposes 4 tools');
const q = await text(await call(access, 3, 'submit_question', { question: 'HTTPS e2e question', origin: 'claude', idempotencyKey: 'e2e-key-0001' }));
ok(q.request.id && q.automatedConsensus === false, 'submit_question persisted in real PostgreSQL');
const q2 = await text(await call(access, 4, 'submit_question', { question: 'HTTPS e2e question', origin: 'claude', idempotencyKey: 'e2e-key-0001' }));
ok(q2.request.id === q.request.id, 'idempotent retry returns the same row');
ok((await pool.query('select count(*)::int c from public.ai_consensus_requests where owner_id=$1', [owner])).rows[0].c === 1, 'exactly one row stored');
const rev1 = await text(await call(access, 5, 'submit_review', { requestId: q.request.id, agent: 'claude', content: 'answer' }));
ok(rev1.contribution.provenance === 'user_supplied', 'review stored as unverified user_supplied');
const gOther = await codeGrant(other);
const peek = await (await call(gOther.body.access_token, 6, 'get_result', { requestId: q.request.id })).json();
ok(peek.error && !JSON.stringify(peek).includes('HTTPS e2e question'), 'another user cannot read this owner\'s request');
const ro = await codeGrant(owner, ['consensus.read']);
const roWrite = await call(ro.body.access_token, 7, 'submit_question', { question: 'x', origin: 'claude', idempotencyKey: 'e2e-key-0002' });
ok(roWrite.status === 403 && /insufficient_scope/.test(roWrite.headers.get('www-authenticate') ?? ''), 'read-only grant cannot write (403 insufficient_scope)');
ok((await text(await call(ro.body.access_token, 8, 'get_status', { requestId: q.request.id }))).contributionCount === 1, 'read-only grant can read');

console.log('4. refresh rotation');
const r1 = await tokenReq({ grant_type: 'refresh_token', refresh_token: refresh, client_id: 'claude' });
const r1b = await r1.json();
ok(r1.status === 200 && r1b.refresh_token && r1b.refresh_token !== refresh && r1b.access_token !== access, 'refresh issues a NEW access + refresh pair');
ok((await text(await call(r1b.access_token, 9, 'get_status', { requestId: q.request.id }))).request.id === q.request.id, 'refreshed access token works against MCP');
const wrongClient = await tokenReq({ grant_type: 'refresh_token', refresh_token: r1b.refresh_token, client_id: 'chatgpt' });
ok(wrongClient.status === 400 && (await wrongClient.json()).error === 'invalid_grant', 'another client cannot use this refresh token');
const r2 = await tokenReq({ grant_type: 'refresh_token', refresh_token: r1b.refresh_token, client_id: 'claude' });
const r2b = await r2.json();
ok(r2.status === 200, 'rotation is repeatable (chain of single-use tokens)');
const badGrant = await tokenReq({ grant_type: 'refresh_token', refresh_token: r1b.refresh_token, client_id: 'claude', scope: 'consensus.write' });
ok(badGrant.status === 400 && (await badGrant.json()).error === 'invalid_request', 'scope parameter on refresh refused (no escalation)');

console.log('5. reuse detection');
const stolen = await tokenReq({ grant_type: 'refresh_token', refresh_token: refresh, client_id: 'claude' }); // first token, long consumed
ok(stolen.status === 400 && (await stolen.json()).error === 'invalid_grant', 'replayed (stolen) refresh token rejected');
ok((await tokenReq({ grant_type: 'refresh_token', refresh_token: r2b.refresh_token, client_id: 'claude' })).status === 400, 'legitimate latest refresh token is dead after reuse');
ok((await mcp(r2b.access_token, { jsonrpc: '2.0', id: 10, method: 'ping' })).status === 401, 'newest access token rejected immediately after reuse detection');
const reasons = (await pool.query("select revoke_reason from public.ai_consensus_oauth_grants where subject=$1 and revoke_reason='refresh_reuse'", [owner])).rowCount;
ok(reasons === 1, 'DB records revoke_reason=refresh_reuse');

console.log('6. concurrent double-spend over HTTPS');
const g3 = await codeGrant(owner);
const burst = await Promise.all(Array.from({ length: 12 }, () => tokenReq({ grant_type: 'refresh_token', refresh_token: g3.body.refresh_token, client_id: 'claude' })));
const codes = burst.map(r => r.status);
ok(codes.filter(c => c === 200).length === 1 && codes.every(c => c === 200 || c === 400), 'exactly one of 12 simultaneous refreshes succeeds', codes.join());

console.log('7. RFC 7009 revocation');
const g4 = await codeGrant(owner);
ok((await mcp(g4.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 200, 'grant alive before revoke');
const foreign = await post('/api/consensus/oauth/revoke', new URLSearchParams({ token: g4.body.refresh_token, client_id: 'chatgpt' }).toString());
ok(foreign.status === 200 && (await mcp(g4.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 200, 'revoke by another client is a silent no-op');
const unknown = await post('/api/consensus/oauth/revoke', new URLSearchParams({ token: 'a'.repeat(43), client_id: 'claude' }).toString());
ok(unknown.status === 200, 'unknown token still answers 200');
const done = await post('/api/consensus/oauth/revoke', new URLSearchParams({ token: g4.body.refresh_token, client_id: 'claude', token_type_hint: 'refresh_token' }).toString());
ok(done.status === 200, 'client revocation accepted');
ok((await mcp(g4.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 401, 'access token dead the moment the grant is revoked');
ok((await tokenReq({ grant_type: 'refresh_token', refresh_token: g4.body.refresh_token, client_id: 'claude' })).status === 400, 'refresh token dead after revoke');
const g5 = await codeGrant(owner);
await post('/api/consensus/oauth/revoke', new URLSearchParams({ token: g5.body.access_token, client_id: 'claude', token_type_hint: 'access_token' }).toString());
ok((await mcp(g5.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 401, 'revoking via the access token kills the grant');

console.log('8. owner-side revocation (database function the owner screen calls)');
const g6 = await codeGrant(owner);
const gid = JSON.parse(Buffer.from(g6.body.access_token.split('.')[1], 'base64url')).gid;
const svc = await pool.connect();
await svc.query('set role service_role');
ok((await svc.query('select public.revoke_ai_consensus_oauth_grant($1,$2,$3,null) r', [gid, 'owner', other])).rows[0].r === false, 'someone else cannot revoke it');
ok((await mcp(g6.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 200, 'still alive after the foreign attempt');
ok((await svc.query('select public.revoke_ai_consensus_oauth_grant($1,$2,$3,null) r', [gid, 'owner', owner])).rows[0].r === true, 'owner revokes');
svc.release();
ok((await mcp(g6.body.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 401, 'revoked grant rejected immediately on the next MCP call');

console.log('9. request hygiene');
const wrongRes = await tokenReq({ grant_type: 'refresh_token', refresh_token: 'a'.repeat(43), client_id: 'claude', resource: 'https://evil.example/api/consensus/mcp' });
ok(wrongRes.status === 400 && (await wrongRes.json()).error === 'invalid_target', 'token request for another resource -> invalid_target');
ok((await post('/api/consensus/oauth/token', '{"grant_type":"refresh_token"}', { 'content-type': 'application/json' })).status === 415, 'JSON body refused at /token');
ok((await post('/api/consensus/oauth/token', 'x'.repeat(5000))).status === 413, 'oversized body refused');
ok((await post('/api/consensus/oauth/token', 'grant_type=password&client_id=claude')).status === 400, 'password grant refused');
ok((await post('/api/consensus/oauth/token', 'grant_type=refresh_token&refresh_token=' + 'a'.repeat(43) + '&client_id=claude', { origin: 'https://evil.example' })).status === 403, 'cross-origin token request refused');
console.log('9b. Dynamic Client Registration (RFC 7591) with a registered-by-the-client id');
ok(m.registration_endpoint === BASE + '/api/consensus/oauth/register', 'metadata advertises registration_endpoint when the DCR gate is on');
const jpost = (path, obj) => fetch(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(obj) });
const reg = await jpost('/api/consensus/oauth/register', { client_name: 'Claude', redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none', grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'] });
const regBody = await reg.json();
ok(reg.status === 201 && regBody.client_id.startsWith('dcr1.') && regBody.token_endpoint_auth_method === 'none' && !('client_secret' in regBody), 'registration returns a public client_id and no secret');
const evil = await jpost('/api/consensus/oauth/register', { redirect_uris: ['https://evil.example/cb'] });
ok(evil.status === 400 && (await evil.json()).error === 'invalid_redirect_uri', 'non-official redirect URI refused');
ok((await post('/api/consensus/oauth/register', 'redirect_uris=x')).status === 415, 'non-JSON registration refused');
const dyn = regBody.client_id;
const dverifier = b64(crypto.randomBytes(48)), dcode = crypto.randomBytes(32).toString('hex');
await pool.query('select public.issue_ai_consensus_oauth_code_with_consent($1,$2,$3,$4,$5,$6,$7,$8)',
  [crypto.createHash('sha256').update(dcode).digest('hex'), dyn, REDIRECT, owner, b64(sha(dverifier)), ['consensus.read'], new Date().toISOString(), new Date(Date.now() + 300_000).toISOString()]);
const dtok = await tokenReq({ grant_type: 'authorization_code', code: dcode, redirect_uri: REDIRECT, client_id: dyn, code_verifier: dverifier, resource: BASE + '/api/consensus/mcp' });
const dbody = await dtok.json();
ok(dtok.status === 200 && dbody.refresh_token && dbody.access_token, 'a dynamically registered client completes the code exchange');
ok((await mcp(dbody.access_token, { jsonrpc: '2.0', id: 1, method: 'ping' })).status === 200, 'its access token works on the MCP endpoint');
const dref = await tokenReq({ grant_type: 'refresh_token', refresh_token: dbody.refresh_token, client_id: dyn });
ok(dref.status === 200, 'its refresh token rotates');
const forged = dyn.replace(/\.[^.]+$/, '.' + 'A'.repeat(43));
ok((await tokenReq({ grant_type: 'refresh_token', refresh_token: (await dref.json()).refresh_token, client_id: forged })).status === 400, 'forged client_id cannot use someone else\'s refresh token');
console.log('10. rate limit');
let limited = 0;
for (let i = 0; i < 160 && !limited; i++) {
  const r = await post('/api/consensus/oauth/token', 'grant_type=password&client_id=claude');
  if (r.status === 429) limited = i + 1;
}
ok(limited > 0 && limited <= 121, 'token endpoint answers 429 once the per-IP budget (120/min here) is spent', String(limited));
const logs = (await pool.query("select count(*)::int c from public.ai_consensus_oauth_refresh_tokens where token_digest !~ '^[0-9a-f]{64}$'")).rows[0].c;
ok(logs === 0, 'only 64-hex digests are stored');
console.log(`\nHTTPS end-to-end: ${passed} checks passed`);
await pool.end();

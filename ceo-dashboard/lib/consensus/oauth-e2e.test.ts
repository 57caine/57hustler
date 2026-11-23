import { prepareConsent, decideConsent } from './oauth-authorize-flow';
import { exchangeCodeForBearer } from './oauth-token-flow';
import { verifyOAuthBearer } from './oauth-bearer';
import { scopesPermit, parseRequestedScopes } from './oauth-contract';
import { authorizationCodeDigest, type AtomicCodeStore, type StoredAuthorizationCode } from './oauth-code-exchange';
import type { AuthorizationCodeWriter } from './oauth-code-issuance';
import type { ConsensusStore, RequestRow, ContributionRow } from './mcp-store';
import { runTool } from './mcp-tools';
function assert(ok: unknown, label: string): asserts ok { if (!ok) throw new Error(label); }
const SECRET = 'k'.repeat(40), ISSUER = 'https://dash.example', AUD = ISSUER + '/api/consensus/mcp';
const REDIRECT = 'https://claude.example/callback';
const clients = [{ clientId: 'claude', name: 'Claude', redirectUris: [REDIRECT] }];
const VERIFIER = 'v'.repeat(64);

async function challengeOf(verifier: string) {
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  return Buffer.from(d).toString('base64url');
}
function memCodes(): AuthorizationCodeWriter & AtomicCodeStore {
  const m = new Map<string, StoredAuthorizationCode>();
  return {
    async create(d, r) { if (m.has(d)) return false; m.set(d, r); return true; },
    async consumeOnce(d) { const r = m.get(d) ?? null; m.delete(d); return r; },
  };
}
function memStore(): ConsensusStore {
  const reqs: Array<RequestRow & { owner: string; key: string }> = [];
  const contribs: Array<ContributionRow & { request_id: string }> = [];
  let n = 0;
  const uuid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`;
  const pub = (r: RequestRow & { owner: string; key: string }): RequestRow => ({ id: r.id, origin: r.origin, question: r.question, status: r.status, created_at: r.created_at });
  return {
    async saveQuestion(owner, v) {
      if (reqs.some(r => r.owner === owner && r.key === v.idempotencyKey)) return null;
      const r = { id: uuid(), origin: v.origin, question: v.question, status: 'open', created_at: 'now', owner, key: v.idempotencyKey };
      reqs.push(r); return pub(r);
    },
    async findByKey(owner, k) { const r = reqs.find(x => x.owner === owner && x.key === k); return r ? pub(r) : null; },
    async getRequest(owner, id) { const r = reqs.find(x => x.owner === owner && x.id === id); return r ? pub(r) : null; },
    async listContributions(owner, id) { return reqs.some(x => x.owner === owner && x.id === id) ? contribs.filter(c => c.request_id === id) : []; },
    async addContribution(owner, id, v) {
      if (!reqs.some(x => x.owner === owner && x.id === id)) return 'error';
      const c = { id: uuid(), agent: v.agent, content: v.content, provenance: 'user_supplied', created_at: 'now', request_id: id };
      contribs.push(c); return { id: c.id, agent: c.agent, provenance: c.provenance, created_at: c.created_at };
    },
  };
}
async function authorize(codes: ReturnType<typeof memCodes>, subject: string, scope: string, now: number) {
  const q = new URLSearchParams({
    response_type: 'code', client_id: 'claude', redirect_uri: REDIRECT, state: 'abcdefghijklmnop1234',
    code_challenge: await challengeOf(VERIFIER), code_challenge_method: 'S256', scope,
  });
  const view = await prepareConsent({ query: q, clients, subject, secret: SECRET, nowSeconds: now });
  assert(view, 'consent view');
  const res = await decideConsent({ query: q, clients, subject, secret: SECRET, csrfToken: view.csrf, approve: true, nowSeconds: now, writer: codes });
  assert(res.kind === 'redirect', 'consent redirect');
  const code = new URL(res.location).searchParams.get('code');
  assert(code, 'code issued');
  return code;
}
async function token(codes: ReturnType<typeof memCodes>, code: string, now: number, over: object = {}) {
  return exchangeCodeForBearer({
    code, verifier: VERIFIER, clientId: 'claude', redirectUri: REDIRECT, nowSeconds: now,
    issuer: ISSUER, audience: AUD, signingSecret: SECRET, registeredRedirects: [REDIRECT], ...over,
  }, codes);
}
const verify = (t: string, now: number, revoked: string[] = []) => verifyOAuthBearer(t, {
  issuer: ISSUER, audience: AUD, nowSeconds: now, secret: SECRET, isRevoked: async j => revoked.includes(j),
});

/** In-process E2E: authorize -> consent -> code -> token -> bearer -> scoped MCP tools. */
export async function testOAuthEndToEnd(): Promise<string> {
  const now = 2_000_000, store = memStore(), codes = memCodes();
  const userA = '11111111-1111-4111-8111-111111111111', userB = '22222222-2222-4222-8222-222222222222';

  // happy path with read+write
  const code = await authorize(codes, userA, 'consensus.read consensus.write', now);
  const bearer = await token(codes, code, now + 1);
  assert(bearer, 'bearer issued');
  const claims = await verify(bearer, now + 2);
  assert(claims && claims.sub === userA && claims.client_id === 'claude', 'bearer carries the consenting owner');
  const scopes = parseRequestedScopes(claims.scope)!;
  assert(scopesPermit(scopes, 'submit_question') && scopesPermit(scopes, 'get_result'), 'granted scopes permit tools');
  const submitted = await runTool(store, claims.sub, 1, 'submit_question', { question: 'Q1', origin: 'claude', idempotencyKey: 'key-12345678' });
  assert('result' in submitted, 'submit_question works');
  const reqId = JSON.parse((submitted as { result: { content: [{ text: string }] } }).result.content[0].text).request.id as string;
  const dup = await runTool(store, claims.sub, 2, 'submit_question', { question: 'Q1', origin: 'claude', idempotencyKey: 'key-12345678' });
  assert('result' in dup, 'identical retry is idempotent');
  const reuse = await runTool(store, claims.sub, 3, 'submit_question', { question: 'DIFFERENT', origin: 'claude', idempotencyKey: 'key-12345678' });
  assert('error' in reuse, 'idempotency key reuse with different input rejected');
  assert('result' in await runTool(store, claims.sub, 4, 'submit_review', { requestId: reqId, agent: 'claude', content: 'answer' }), 'submit_review works');
  const got = await runTool(store, claims.sub, 5, 'get_result', { requestId: reqId });
  assert('result' in got, 'get_result works');
  const body = JSON.parse((got as { result: { content: [{ text: string }] } }).result.content[0].text);
  assert(body.automatedConsensus === false && body.verifiedProviderCount === 0 && body.contributions[0].provenance === 'user_supplied', 'get_result shows unverified provenance');

  // another user cannot read, review or reuse
  const otherRead = await runTool(store, userB, 6, 'get_result', { requestId: reqId });
  assert('error' in otherRead && !JSON.stringify(otherRead).includes('Q1'), 'other user cannot read');
  assert('error' in await runTool(store, userB, 7, 'submit_review', { requestId: reqId, agent: 'gpt', content: 'x' }), 'other user cannot write review');
  assert('error' in await runTool(store, userB, 8, 'get_status', { requestId: reqId }), 'other user cannot read status');

  // replay of the same code
  assert((await token(codes, code, now + 3)) === null, 'code replay rejected');
  // wrong verifier / client / redirect (each burns a fresh code)
  const c2 = await authorize(codes, userA, 'consensus.read', now);
  assert((await token(codes, c2, now + 1, { verifier: 'w'.repeat(64) })) === null, 'wrong PKCE verifier rejected');
  const c3 = await authorize(codes, userA, 'consensus.read', now);
  assert((await token(codes, c3, now + 1, { clientId: 'other' })) === null, 'client mismatch rejected');
  const c4 = await authorize(codes, userA, 'consensus.read', now);
  assert((await token(codes, c4, now + 1, { redirectUri: 'https://evil.example/cb', registeredRedirects: ['https://evil.example/cb'] })) === null, 'redirect mismatch rejected');
  const c5 = await authorize(codes, userA, 'consensus.read', now);
  assert((await token(codes, c5, now + 301)) === null, 'expired authorization code rejected');

  // read-only token cannot reach write tools
  const ro = await token(codes, await authorize(codes, userA, 'consensus.read', now), now + 1);
  assert(ro, 'read-only token');
  const roClaims = await verify(ro, now + 2);
  const roScopes = parseRequestedScopes(roClaims!.scope)!;
  assert(scopesPermit(roScopes, 'get_status') && !scopesPermit(roScopes, 'submit_question') && !scopesPermit(roScopes, 'submit_review'), 'read-only scope denies writes');
  assert(!scopesPermit(roScopes, 'unknown_tool'), 'unknown tool denied');

  // expiry, wrong audience/issuer, revocation, tamper, garbage
  assert((await verify(bearer, now + 700)) === null, 'expired access token rejected');
  assert((await verifyOAuthBearer(bearer, { issuer: ISSUER, audience: 'https://other/api', nowSeconds: now + 2, secret: SECRET, isRevoked: async () => false })) === null, 'wrong audience rejected');
  assert((await verifyOAuthBearer(bearer, { issuer: 'https://other.example', audience: AUD, nowSeconds: now + 2, secret: SECRET, isRevoked: async () => false })) === null, 'wrong issuer rejected');
  assert((await verify(bearer, now + 2, [claims.jti])) === null, 'revoked access token rejected');
  assert((await verifyOAuthBearer(bearer, { issuer: ISSUER, audience: AUD, nowSeconds: now + 2, secret: 'j'.repeat(40), isRevoked: async () => false })) === null, 'token signed with another key rejected');
  const parts = bearer.split('.');
  const forged = Buffer.from(JSON.stringify({ ...claims, sub: userB })).toString('base64url');
  assert((await verify(parts[0] + '.' + forged + '.' + parts[2], now + 2)) === null, 'forged subject rejected');
  assert((await verify('garbage', now)) === null && (await verify('a.b.c', now)) === null, 'garbage rejected');
  let backendDown = false;
  try { await verifyOAuthBearer(bearer, { issuer: ISSUER, audience: AUD, nowSeconds: now + 2, secret: SECRET, isRevoked: async () => { throw new Error('down'); } }); }
  catch { backendDown = true; }
  const failClosed = backendDown || (await verifyOAuthBearer(bearer, { issuer: ISSUER, audience: AUD, nowSeconds: now + 2, secret: SECRET, isRevoked: async () => { throw new Error('down'); } })) === null;
  assert(failClosed, 'revocation backend failure never authorizes');
  assert((await authorizationCodeDigest(code)).length === 64, 'digest helper');
  return 'oauth end-to-end checks passed';
}

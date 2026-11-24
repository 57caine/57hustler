import { Pool } from 'pg';
import { pgRpc } from './test-support/pg-rpc';
import { createOAuthCodeStore, type OAuthCodeDatabase } from './oauth-code-store';
import { createConsentCodeWriter, type ConsentIssueDatabase } from './oauth-consent-store';
import { createRefreshStore, newRefreshToken, refreshTokenDigest, type RefreshDatabase } from './oauth-refresh';
import { issueAuthorizationCode } from './oauth-code-issuance';
import { handleRevokeRequest, handleTokenRequest, type TokenDeps } from './oauth-token-endpoint';
import { verifyOAuthBearer } from './oauth-bearer';

function check(value: unknown, label: string): asserts value { if (!value) throw new Error('FAILED: ' + label); }
const ISSUER = 'https://dash.example', SECRET = 's'.repeat(48);
const REDIRECT = 'https://claude.ai/api/mcp/auth_callback';
const clients = [
  { clientId: 'claude', redirectUris: [REDIRECT] },
  { clientId: 'chatgpt', redirectUris: ['https://chatgpt.com/connector_platform_oauth_redirect'] },
];
const VERIFIER = 'v'.repeat(64);
async function challengeOf(v: string) {
  return Buffer.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))).toString('base64url');
}

/** Runs ONLY against a real PostgreSQL (CONSENSUS_TEST_DATABASE_URL) with every migration applied. */
export async function testOAuthRefreshRealDb(): Promise<string> {
  const url = process.env.CONSENSUS_TEST_DATABASE_URL;
  if (!url) return 'SKIPPED: CONSENSUS_TEST_DATABASE_URL is not set (no real database)';
  const pool = new Pool({ connectionString: url, max: 10 }); // fixtures / inspection (superuser)
  // The application path runs as the REAL production role: grants and SECURITY DEFINER are exercised.
  const appPool = new Pool({ connectionString: url, max: 40, options: '-c role=service_role' });
  let n = 0;
  try {
    const rpc = pgRpc(appPool);
    const codes = createOAuthCodeStore(rpc as unknown as OAuthCodeDatabase);
    const refresh = createRefreshStore(rpc as unknown as RefreshDatabase);
    const writer = createConsentCodeWriter(rpc as unknown as ConsentIssueDatabase);
    const q = (sql: string, p: unknown[] = []) => pool.query(sql, p);
    const mkUser = async () => (await q('insert into auth.users default values returning id')).rows[0].id as string;
    const deps = (now: number): TokenDeps => ({ clients, issuer: ISSUER, signingSecret: SECRET, nowSeconds: now, codes, refresh });
    const form = (o: Record<string, string>) => new URLSearchParams(o);
    const dead = async (gid: string) => (await q('select public.ai_consensus_oauth_grant_is_dead($1) as d', [gid])).rows[0].d as boolean;

    /** Real consent path: issue a code through the real atomic SQL function. */
    async function mintCode(subject: string, clientId = 'claude', scopes: ('consensus.read' | 'consensus.write')[] = ['consensus.read', 'consensus.write']) {
      const now = Math.floor(Date.now() / 1000);
      const c = clients.find(x => x.clientId === clientId)!;
      const code = await issueAuthorizationCode({
        subject, clientId, redirectUri: c.redirectUris[0], scopes, challenge: await challengeOf(VERIFIER),
        approvedAtSeconds: now, expiresAtSeconds: now + 300,
      }, c.redirectUris, writer, now);
      check(code, 'authorization code issued through real SQL function');
      return code;
    }
    const exchange = async (code: string, clientId = 'claude') => {
      const c = clients.find(x => x.clientId === clientId)!;
      return handleTokenRequest(form({ grant_type: 'authorization_code', code, redirect_uri: c.redirectUris[0], client_id: clientId, code_verifier: VERIFIER }), deps(Math.floor(Date.now() / 1000)));
    };
    const doRefresh = (token: string, clientId = 'claude') =>
      handleTokenRequest(form({ grant_type: 'refresh_token', refresh_token: token, client_id: clientId }), deps(Math.floor(Date.now() / 1000)));
    const verify = (t: string) => verifyOAuthBearer(t, {
      issuer: ISSUER, audience: ISSUER + '/api/consensus/mcp', nowSeconds: Math.floor(Date.now() / 1000), secret: SECRET,
      isRevoked: async () => false, isGrantDead: refresh.grantIsDead, requireGrant: true,
    });
    const gidOf = (access: string) => JSON.parse(Buffer.from(access.split('.')[1], 'base64url').toString()).gid as string;

    // 1. code -> access + refresh, stored as digest only
    const owner = await mkUser(), stranger = await mkUser();
    const first = await exchange(await mintCode(owner)); n++;
    check(first.status === 200 && typeof first.body.refresh_token === 'string' && typeof first.body.access_token === 'string', 'code exchange issues access + refresh token ' + JSON.stringify(first.body));
    check(first.body.scope === 'consensus.read consensus.write' && first.body.expires_in === 600, 'scope and ttl returned');
    const access1 = first.body.access_token as string, refresh1 = first.body.refresh_token as string, gid = gidOf(access1);
    const claims = await verify(access1); n++;
    check(claims?.sub === owner && claims.gid === gid, 'access token bound to owner and grant');
    const stored = (await q('select token_digest from public.ai_consensus_oauth_refresh_tokens where grant_id=$1', [gid])).rows;
    check(stored.length === 1 && stored[0].token_digest === await refreshTokenDigest(refresh1) && !JSON.stringify(stored).includes(refresh1), 'only the digest is persisted'); n++;

    // 2. rotation: single-use, new pair issued, grant stays alive
    const second = await doRefresh(refresh1); n++;
    check(second.status === 200 && second.body.refresh_token !== refresh1 && second.body.access_token !== access1, 'rotation issues a new pair');
    const refresh2 = second.body.refresh_token as string;
    check(await verify(second.body.access_token as string), 'rotated access token valid'); n++;
    check((await q('select count(*)::int c from public.ai_consensus_oauth_refresh_tokens where grant_id=$1 and rotated_at is not null', [gid])).rows[0].c === 1, 'exactly one consumed token'); n++;

    // 3. reuse detection: replaying the consumed token kills the WHOLE grant, including the successor
    const replay = await doRefresh(refresh1); n++;
    check(replay.status === 400 && replay.body.error === 'invalid_grant', 'replayed refresh token rejected');
    check(await dead(gid), 'reuse revoked the grant');
    check((await q('select revoke_reason r from public.ai_consensus_oauth_grants where grant_id=$1', [gid])).rows[0].r === 'refresh_reuse', 'reason recorded as refresh_reuse'); n++;
    check((await doRefresh(refresh2)).status === 400, 'legitimate successor token dead after theft signal'); n++;
    check((await verify(second.body.access_token as string)) === null, 'outstanding access token dead after reuse'); n++;

    // 4. concurrency: 30 simultaneous refreshes of ONE token -> exactly one winner, grant revoked, no fork
    const c = await exchange(await mintCode(owner));
    const cGid = gidOf(c.body.access_token as string);
    const results = await Promise.all(Array.from({ length: 30 }, () => doRefresh(c.body.refresh_token as string)));
    const winners = results.filter(r => r.status === 200);
    check(winners.length === 1, 'exactly one concurrent refresh wins (got ' + winners.length + ')'); n++;
    check(results.every(r => r.status === 200 || r.status === 400), 'losers get invalid_grant, never a server error');
    check((await q('select count(*)::int c from public.ai_consensus_oauth_refresh_tokens where grant_id=$1', [cGid])).rows[0].c === 2, 'chain did not fork: old + one successor'); n++;
    check(await dead(cGid), 'concurrent double-spend revoked the grant'); n++;
    check((await doRefresh(winners[0].body.refresh_token as string)).status === 400, 'winner token is dead too after the signal'); n++;

    // 5. other client cannot rotate and causes no side effects
    const d = await exchange(await mintCode(owner));
    const dGid = gidOf(d.body.access_token as string);
    check((await doRefresh(d.body.refresh_token as string, 'chatgpt')).status === 400, 'foreign client cannot refresh'); n++;
    check(!(await dead(dGid)), 'foreign attempt does not revoke the legitimate grant'); n++;
    check((await doRefresh(d.body.refresh_token as string)).status === 200, 'legitimate client still refreshes'); n++;

    // 6. expiry: token expiry, grant expiry, and sliding window capped at grant expiry
    const e = await exchange(await mintCode(owner));
    const eGid = gidOf(e.body.access_token as string);
    await q("update public.ai_consensus_oauth_refresh_tokens set expires_at = now() - interval '1 second' where grant_id=$1", [eGid]);
    check((await doRefresh(e.body.refresh_token as string)).status === 400, 'expired refresh token rejected'); n++;
    const f = await exchange(await mintCode(owner));
    const fGid = gidOf(f.body.access_token as string);
    await q("update public.ai_consensus_oauth_grants set expires_at = now() + interval '1 hour' where grant_id=$1", [fGid]);
    const fNext = await doRefresh(f.body.refresh_token as string);
    check(fNext.status === 200, 'refresh within grant lifetime works');
    const capped = (await q('select t.expires_at = g.expires_at as ok from public.ai_consensus_oauth_refresh_tokens t join public.ai_consensus_oauth_grants g using (grant_id) where g.grant_id=$1 and t.rotated_at is null', [fGid])).rows[0].ok;
    check(capped === true, 'new refresh token expiry is capped at the grant expiry (30d window > 1h grant)'); n++;
    await q("update public.ai_consensus_oauth_grants set expires_at = now() + interval '1 second' where grant_id=$1", [fGid]);
    await new Promise(r => setTimeout(r, 1300));
    check((await doRefresh(fNext.body.refresh_token as string)).status === 400 && (await verify(fNext.body.access_token as string)) === null, 'expired grant: no refresh and access token dead'); n++;

    // 7. authorization-code replay revokes what the code produced (OAuth 2.1)
    const codeG = await mintCode(owner);
    const g1 = await exchange(codeG);
    check(g1.status === 200, 'first exchange ok');
    const gGid = gidOf(g1.body.access_token as string);
    check((await exchange(codeG)).status === 400, 'code replay rejected'); n++;
    check(await dead(gGid) && (await doRefresh(g1.body.refresh_token as string)).status === 400, 'replayed code revoked its grant'); n++;
    check((await q('select revoke_reason r from public.ai_consensus_oauth_grants where grant_id=$1', [gGid])).rows[0].r === 'code_reuse', 'reason code_reuse'); n++;

    // 8. RFC 7009 client revocation
    const h = await exchange(await mintCode(owner));
    const hGid = gidOf(h.body.access_token as string);
    const base = { clients, issuer: ISSUER, signingSecret: SECRET, nowSeconds: Math.floor(Date.now() / 1000), refresh };
    check((await handleRevokeRequest(form({ token: h.body.refresh_token as string, client_id: 'chatgpt' }), base)).status === 200 && !(await dead(hGid)), 'foreign client revoke is a silent no-op'); n++;
    check((await handleRevokeRequest(form({ token: 'x'.repeat(43), client_id: 'claude' }), base)).status === 200, 'unknown token answers 200 (no oracle)'); n++;
    check((await handleRevokeRequest(form({ token: h.body.refresh_token as string, client_id: 'claude', token_type_hint: 'refresh_token' }), base)).status === 200 && await dead(hGid), 'client revokes via refresh token'); n++;
    check((await verify(h.body.access_token as string)) === null && (await doRefresh(h.body.refresh_token as string)).status === 400, 'access and refresh dead after revoke'); n++;
    const i = await exchange(await mintCode(owner));
    const iGid = gidOf(i.body.access_token as string);
    check((await handleRevokeRequest(form({ token: i.body.access_token as string, client_id: 'claude', token_type_hint: 'access_token' }), base)).status === 200 && await dead(iGid), 'client revokes via access token'); n++;
    check((await handleRevokeRequest(form({ token: 'x', client_id: 'nobody' }), base)).status === 400, 'unregistered client rejected'); n++;

    // 9. owner revocation is scoped to the owner
    const j = await exchange(await mintCode(owner));
    const jGid = gidOf(j.body.access_token as string);
    check((await refresh.revokeGrant(jGid, 'owner', { subject: stranger })) === false && !(await dead(jGid)), 'another user cannot revoke my grant'); n++;
    check((await refresh.listGrants(stranger)).every(x => x.grantId !== jGid), 'listing never shows other owners'); n++;
    check((await refresh.revokeGrant(jGid, 'owner', { subject: owner })) === true && await dead(jGid), 'owner revokes own grant'); n++;
    check((await refresh.revokeGrant(jGid, 'client')) === false, 'revocation is idempotent');
    check((await q('select revoke_reason r from public.ai_consensus_oauth_grants where grant_id=$1', [jGid])).rows[0].r === 'owner', 'first revoke reason preserved'); n++;
    check((await refresh.listGrants(owner)).some(x => x.grantId === jGid && x.revokedAtSeconds !== null), 'owner sees the revoked grant'); n++;

    // 10. atomicity: a failure midway leaves NOTHING behind
    const k = await exchange(await mintCode(owner));
    const kGid = gidOf(k.body.access_token as string);
    const dupe = await refresh.createGrant({
      grantId: crypto.randomUUID(), tokenDigest: await refreshTokenDigest(k.body.refresh_token as string), subject: owner,
      clientId: 'claude', scopes: ['consensus.read'], originCodeDigest: 'a'.repeat(64),
      tokenExpiresAtSeconds: Math.floor(Date.now() / 1000) + 600, grantExpiresAtSeconds: Math.floor(Date.now() / 1000) + 3600,
    });
    check(dupe === false, 'duplicate token digest rejected'); n++;
    check((await q("select count(*)::int c from public.ai_consensus_oauth_grants where origin_code_digest=$1", ['a'.repeat(64)])).rows[0].c === 0, 'grant insert rolled back with the failed token insert'); n++;
    // rotation whose successor collides with an existing token must NOT consume the old token
    const m = await exchange(await mintCode(owner));
    const mDigest = await refreshTokenDigest(m.body.refresh_token as string);
    let threw = false;
    try { await refresh.rotate({ oldDigest: mDigest, newDigest: await refreshTokenDigest(k.body.refresh_token as string), clientId: 'claude', newExpiresAtSeconds: Math.floor(Date.now() / 1000) + 600 }); }
    catch { threw = true; }
    check(threw, 'storage failure surfaces as an error, not as "invalid"'); n++;
    check((await q('select rotated_at from public.ai_consensus_oauth_refresh_tokens where token_digest=$1', [mDigest])).rows[0].rotated_at === null, 'failed rotation did not consume the old token (atomic)'); n++;
    check((await doRefresh(m.body.refresh_token as string)).status === 200, 'old token still usable after the failed attempt'); n++;

    // 11. database privileges: end-user roles cannot touch any of it; service_role cannot write tables directly
    for (const role of ['anon', 'authenticated']) {
      const cx = await pool.connect();
      try {
        await cx.query('begin'); await cx.query(`set local role ${role}`);
        let denied = 0;
        for (const sql of [
          'select * from public.ai_consensus_oauth_refresh_tokens', 'select * from public.ai_consensus_oauth_grants',
          "select public.rotate_ai_consensus_refresh_token('" + 'a'.repeat(64) + "','" + 'b'.repeat(64) + "','claude', now())",
          "select public.revoke_ai_consensus_oauth_grant('" + crypto.randomUUID() + "','owner')",
          'select * from public.list_ai_consensus_oauth_grants(gen_random_uuid())',
        ]) {
          try { await cx.query('savepoint s'); await cx.query(sql); await cx.query('release savepoint s'); }
          catch { denied++; await cx.query('rollback to savepoint s'); }
        }
        check(denied === 5, role + ' denied on all refresh/grant objects');
      } finally { await cx.query('rollback').catch(() => undefined); cx.release(); }
    }
    n++;
    const sr = await pool.connect();
    try {
      await sr.query('begin'); await sr.query('set local role service_role');
      let blocked = false;
      try { await sr.query("update public.ai_consensus_oauth_grants set revoked_at = null, revoke_reason = null"); } catch { blocked = true; }
      check(blocked, 'service_role cannot un-revoke by direct table write');
    } finally { await sr.query('rollback').catch(() => undefined); sr.release(); }
    n++;

    // 12. housekeeping never resurrects anything
    check(typeof (await q('select public.purge_ai_consensus_oauth_expired() as p')).rows[0].p === 'number', 'purge runs');
    check((await q('select count(*)::int c from public.ai_consensus_oauth_grants where revoked_at is not null')).rows[0].c >= 5, 'revoked grants survive housekeeping'); n++;
    void newRefreshToken;
    return `OAuth refresh real-PostgreSQL ${n} check groups passed`;
  } finally { await appPool.end(); await pool.end(); }
}

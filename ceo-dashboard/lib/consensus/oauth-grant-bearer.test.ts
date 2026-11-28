import { issueOAuthBearer, verifyOAuthBearer } from './oauth-bearer';
import { handleRevokeRequest, handleTokenRequest, type TokenDeps } from './oauth-token-endpoint';
import { newRefreshToken, refreshTokenDigest, validRefreshTokenFormat, type RefreshStore, type RotateResult } from './oauth-refresh';
import { parseAuthorizationRequest } from './oauth-authorization-request';
import { decideConsent, prepareConsent } from './oauth-authorize-flow';
import type { AtomicCodeStore, StoredAuthorizationCode } from './oauth-code-exchange';

function check(v: unknown, label: string): asserts v { if (!v) throw new Error('FAILED: ' + label); }
const ISSUER = 'https://dash.example', AUD = ISSUER + '/api/consensus/mcp', SECRET = 'z'.repeat(48);
const GID = '0b1c7a52-3f1d-4a0e-9a53-2f6c0d5b7e11';
const base = { issuer: ISSUER, audience: AUD, secret: SECRET };

/** Pure-logic checks (no database). The SQL semantics are verified against real PostgreSQL elsewhere. */
export async function testOAuthGrantBearerAndEndpoint(): Promise<string> {
  let n = 0;
  const now = 5_000_000;
  const tok = await issueOAuthBearer({ ...base, subject: 'owner', clientId: 'claude', scopes: ['consensus.read'], nowSeconds: now, grantId: GID });
  check(tok, 'grant-bound token issued'); n++;
  const live = { ...base, nowSeconds: now + 1, isRevoked: async () => false, isGrantDead: async () => false };
  check((await verifyOAuthBearer(tok, live))?.gid === GID, 'gid claim round-trips'); n++;
  check((await verifyOAuthBearer(tok, { ...live, isGrantDead: async () => true })) === null, 'dead grant rejects an otherwise valid token'); n++;
  check((await verifyOAuthBearer(tok, { ...live, isGrantDead: undefined })) === null, 'grant-bound token without a grant checker fails closed'); n++;
  check((await verifyOAuthBearer(tok, { ...live, isGrantDead: async () => { throw new Error('db down'); } })) === null, 'grant store outage denies access (fail closed)'); n++;
  const legacy = await issueOAuthBearer({ ...base, subject: 'owner', clientId: 'claude', scopes: ['consensus.read'], nowSeconds: now });
  check(legacy && (await verifyOAuthBearer(legacy, { ...live, requireGrant: true })) === null, 'requireGrant rejects tokens that cannot be revoked per grant'); n++;
  check(await issueOAuthBearer({ ...base, subject: 'owner', clientId: 'claude', scopes: ['consensus.read'], nowSeconds: now, grantId: 'not-a-uuid' }) === null, 'malformed gid refused at issue'); n++;

  check(validRefreshTokenFormat(newRefreshToken()) && !validRefreshTokenFormat('short') && !validRefreshTokenFormat(tok), 'refresh token format (an access JWT is never a refresh token)'); n++;
  check(newRefreshToken() !== newRefreshToken(), 'refresh tokens are random'); n++;
  const a = await refreshTokenDigest('x'.repeat(43)), b = await refreshTokenDigest('x'.repeat(43));
  check(a === b && /^[0-9a-f]{64}$/.test(a), 'digest deterministic hex'); n++;

  // Endpoint input policy (store is a recording stub that must NOT be reached on bad input).
  const calls: string[] = [];
  const store: RefreshStore = {
    async createGrant() { calls.push('create'); return true; },
    async rotate(): Promise<RotateResult> { calls.push('rotate'); return { status: 'invalid' }; },
    async revokeRefreshToken() { calls.push('revokeRefresh'); return null; },
    async revokeGrant() { calls.push('revokeGrant'); return true; },
    async revokeByCode() { calls.push('revokeByCode'); return true; },
    async grantIsDead() { return false; },
    async listGrants() { return []; },
  };
  const codes: AtomicCodeStore = { async consumeOnce(): Promise<StoredAuthorizationCode | null> { calls.push('consume'); return null; } };
  const deps: TokenDeps = { clients: [{ clientId: 'claude', redirectUris: ['https://claude.ai/api/mcp/auth_callback'] }], issuer: ISSUER, signingSecret: SECRET, nowSeconds: now, codes, refresh: store };
  const f = (o: string) => new URLSearchParams(o);
  const rt = newRefreshToken();
  check((await handleTokenRequest(f('grant_type=password&client_id=claude'), deps)).body.error === 'unsupported_grant_type', 'password grant refused'); n++;
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=claude&scope=consensus.write`), deps)).body.error === 'invalid_request', 'scope escalation parameter refused'); n++;
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&refresh_token=${rt}&client_id=claude`), deps)).body.error === 'invalid_request', 'duplicate parameters refused'); n++;
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=other`), deps)).body.error === 'invalid_client', 'unregistered client refused'); n++;
  check((await handleTokenRequest(f('grant_type=refresh_token&refresh_token=notvalid&client_id=claude'), deps)).body.error === 'invalid_grant', 'malformed refresh token refused'); n++;
  check(calls.length === 0, 'no storage access for malformed requests'); n++;
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=claude`), deps)).body.error === 'invalid_grant' && calls.join() === 'rotate', 'unknown token -> invalid_grant after one rotate attempt'); n++;
  const down: RefreshStore = { ...store, async rotate() { throw new Error('db down'); } };
  const outage = await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=claude`), { ...deps, refresh: down });
  check(outage.status === 503 && outage.body.error === 'temporarily_unavailable', 'storage outage is 503, never invalid_grant (client keeps its token)'); n++;
  const rev = await handleRevokeRequest(f(`token=${rt}&client_id=claude&token_type_hint=id_token`), deps);
  check(rev.status === 400 && rev.body.error === 'unsupported_token_type', 'unsupported token type hint'); n++;
  const revDown = await handleRevokeRequest(f(`token=${rt}&client_id=claude`), { ...deps, refresh: { ...store, async revokeRefreshToken() { throw new Error('db down'); } } });
  check(revDown.status === 503, 'revocation outage is reported, not silently 200'); n++;
  // RFC 8707 resource indicator + RFC 9207 iss, as sent/expected by the official ChatGPT and Claude clients.
  const RES = ISSUER + '/api/consensus/mcp';
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=claude&resource=${encodeURIComponent('https://evil.example/mcp')}`), deps)).body.error === 'invalid_target', 'token request for a foreign resource refused'); n++;
  check((await handleTokenRequest(f(`grant_type=refresh_token&refresh_token=${rt}&client_id=claude&resource=${encodeURIComponent(RES)}`), deps)).body.error === 'invalid_grant', 'token request with OUR resource proceeds'); n++;
  const REDIR = 'https://claude.ai/api/mcp/auth_callback';
  const challenge = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';
  const authQ = (extra: Record<string, string> = {}) => new URLSearchParams({ response_type: 'code', client_id: 'claude', redirect_uri: REDIR, state: 'abcdefghijklmnop1234', code_challenge: challenge, code_challenge_method: 'S256', scope: 'consensus.read', ...extra });
  const regs = [{ clientId: 'claude', name: 'Claude', redirectUris: [REDIR] }];
  check(parseAuthorizationRequest(authQ(), regs, RES) !== null, 'authorization request without resource still accepted'); n++;
  check(parseAuthorizationRequest(authQ({ resource: RES }), regs, RES) !== null, 'authorization request with the MCP resource accepted'); n++;
  check(parseAuthorizationRequest(authQ({ resource: 'https://evil.example/mcp' }), regs, RES) === null, 'authorization request for another resource refused'); n++;
  check(parseAuthorizationRequest(authQ({ resource: RES }), regs) === null, 'resource refused when the server did not declare one (legacy callers)'); n++;
  const dup = authQ({ resource: RES }); dup.append('resource', RES);
  check(parseAuthorizationRequest(dup, regs, RES) === null, 'duplicate resource refused'); n++;
  const q = authQ({ resource: RES });
  const view = await prepareConsent({ query: q, clients: regs, subject: 'owner', secret: SECRET, nowSeconds: now, expectedResource: RES });
  check(view, 'consent prepared for a request carrying resource'); n++;
  const written: string[] = [];
  const decided = await decideConsent({ query: q, clients: regs, subject: 'owner', secret: SECRET, csrfToken: view.csrf, approve: true, nowSeconds: now, expectedResource: RES, issuer: ISSUER, writer: { async create(d) { written.push(d); return true; } } });
  check(decided.kind === 'redirect' && new URL(decided.location).searchParams.get('iss') === ISSUER && new URL(decided.location).searchParams.get('code'), 'approved redirect carries code + iss (RFC 9207)'); n++;
  const denied = await decideConsent({ query: q, clients: regs, subject: 'owner', secret: SECRET, csrfToken: view.csrf, approve: false, nowSeconds: now, expectedResource: RES, issuer: ISSUER, writer: { async create() { return true; } } });
  check(denied.kind === 'redirect' && new URL(denied.location).searchParams.get('error') === 'access_denied' && new URL(denied.location).searchParams.get('iss') === ISSUER, 'denial redirect carries iss too'); n++;
  return `OAuth grant-bound bearer and token endpoint policy ${n} checks passed`;
}

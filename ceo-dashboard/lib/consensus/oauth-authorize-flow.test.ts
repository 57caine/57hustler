import { prepareConsent, decideConsent } from './oauth-authorize-flow';
import { issueConsentCsrf, verifyConsentCsrf } from './oauth-csrf';
import { loadRegisteredClients, safeLocalPath, oauthGatesOpen, clientRedirect } from './oauth-config';
import { createRateLimiter } from './rate-limit';
import { createConsentCodeWriter } from './oauth-consent-store';
import type { AuthorizationCodeWriter } from './oauth-code-issuance';
import { loadRuntime } from './oauth-runtime';
function assert(ok: unknown, label: string): asserts ok { if (!ok) throw new Error(label); }
const SECRET = 's'.repeat(40);
const REDIRECT = 'https://chatgpt.example/callback';
const clients = [{ clientId: 'chatgpt', name: 'ChatGPT', redirectUris: [REDIRECT] }];
const query = () => new URLSearchParams({
  response_type: 'code', client_id: 'chatgpt', redirect_uri: REDIRECT, state: 'abcdefghijklmnop1234',
  code_challenge: 'a'.repeat(43), code_challenge_method: 'S256', scope: 'consensus.read',
});
export async function testOAuthAuthorizeFlow(): Promise<string> {
  // --- config / gates
  assert(!oauthGatesOpen({}), 'gates default closed');
  assert(!oauthGatesOpen({ MCP_BRIDGE_ENABLED: 'true', CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED: 'true' }), 'two of three gates still closed');
  assert(oauthGatesOpen({ MCP_BRIDGE_ENABLED: 'true', CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED: 'true', CONSENSUS_OAUTH_AUTHORIZATION_ENABLED: 'true' }), 'all gates open');
  assert(loadRegisteredClients(undefined) === null && loadRegisteredClients('[]') === null && loadRegisteredClients('{') === null, 'bad client config fails closed');
  assert(loadRegisteredClients('[{"clientId":"a","redirectUris":[]}]') === null, 'empty redirects fail closed');
  assert(loadRegisteredClients('[{"clientId":"a","redirectUris":["https://x/cb"]}]')?.length === 1, 'valid client config');
  assert(safeLocalPath('https://evil.example') === '/home' && safeLocalPath('//evil.example') === '/home' &&
    safeLocalPath('/\\evil') === '/home' && safeLocalPath('/ok?a=1') === '/ok?a=1', 'open-redirect guard on post-login path');

  // --- runtime gate: every flag, https issuer == origin, secret length, clients
  const env = { MCP_BRIDGE_ENABLED: 'true', CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED: 'true', CONSENSUS_OAUTH_AUTHORIZATION_ENABLED: 'true',
    CONSENSUS_OAUTH_ISSUER: 'https://dash.example', CONSENSUS_OAUTH_SIGNING_SECRET: 'x'.repeat(40),
    CONSENSUS_OAUTH_CLIENTS: JSON.stringify([{ clientId: 'c', redirectUris: ['https://c.example/cb'] }]) };
  assert(loadRuntime('https://dash.example', env) !== null, 'runtime loads when fully configured');
  assert(loadRuntime('https://dash.example', {}) === null, 'runtime closed by default');
  assert(loadRuntime('https://other.example', env) === null, 'issuer must equal request origin');
  assert(loadRuntime('http://dash.example', { ...env, CONSENSUS_OAUTH_ISSUER: 'http://dash.example' }) === null, 'issuer must be https');
  assert(loadRuntime('https://dash.example', { ...env, CONSENSUS_OAUTH_SIGNING_SECRET: 'short' }) === null, 'short signing secret rejected');
  assert(loadRuntime('https://dash.example', { ...env, CONSENSUS_OAUTH_AUTHORIZATION_ENABLED: undefined }) === null, 'one closed gate closes everything');

  // --- CSRF binding
  const now = 1_000_000;
  const q = query();
  const tok = await issueConsentCsrf({ secret: SECRET, subject: 'user-a', query: q, nowSeconds: now });
  const v = (o: object = {}) => verifyConsentCsrf({ secret: SECRET, subject: 'user-a', query: q, nowSeconds: now + 1, token: tok, ...o });
  assert(await v(), 'valid csrf');
  assert(!(await v({ subject: 'user-b' })), 'csrf is bound to the user');
  const other = query(); other.set('scope', 'consensus.read consensus.write');
  assert(!(await v({ query: other })), 'csrf is bound to the exact request');
  assert(!(await v({ nowSeconds: now + 601 })), 'csrf expires');
  assert(!(await v({ token: undefined })) && !(await v({ token: 'x.y' })) && !(await v({ token: tok.slice(0, -1) + (tok.endsWith('A') ? 'B' : 'A') })), 'malformed/tampered csrf');
  assert(!(await v({ secret: 'z'.repeat(40) })), 'csrf needs the server secret');

  // --- consent screen preparation
  const view = await prepareConsent({ query: q, clients, subject: 'user-a', secret: SECRET, nowSeconds: now });
  assert(view?.clientName === 'ChatGPT' && view.request.scopes[0] === 'consensus.read', 'consent view shows client and scope');
  const bad = query(); bad.set('redirect_uri', 'https://evil.example/cb');
  assert((await prepareConsent({ query: bad, clients, subject: 'user-a', secret: SECRET, nowSeconds: now })) === null, 'unregistered redirect not shown');
  assert((await prepareConsent({ query: q, clients, subject: '', secret: SECRET, nowSeconds: now })) === null, 'anonymous gets no consent screen');

  // --- decisions
  let written = 0;
  const writer: AuthorizationCodeWriter = { async create() { written++; return true; } };
  const base = { query: q, clients, subject: 'user-a', secret: SECRET, csrfToken: tok, approve: true, nowSeconds: now + 1, writer };
  const ok = await decideConsent(base);
  assert(ok.kind === 'redirect' && ok.location.startsWith(REDIRECT + '?') && /[?&]code=[0-9a-f]{64}/.test(ok.location) &&
    ok.location.includes('state=abcdefghijklmnop1234') && written === 1, 'approval redirects with code+state');
  const denied = await decideConsent({ ...base, approve: false });
  assert(denied.kind === 'redirect' && denied.location.includes('error=access_denied') && !denied.location.includes('code=') && written === 1, 'denial issues no code');
  const noCsrf = await decideConsent({ ...base, csrfToken: undefined });
  assert(noCsrf.kind === 'error' && noCsrf.status === 403 && written === 1, 'missing csrf rejected, no code');
  const wrongUser = await decideConsent({ ...base, subject: 'user-b' });
  assert(wrongUser.kind === 'error' && wrongUser.status === 403 && written === 1, 'csrf from another user rejected');
  const evil = await decideConsent({ ...base, query: bad });
  assert(evil.kind === 'error' && evil.status === 400 && written === 1, 'unregistered redirect never receives a redirect');
  const expired = await decideConsent({ ...base, nowSeconds: now + 5000 });
  assert(expired.kind === 'error' && expired.status === 403, 'expired consent form rejected');
  const failing = await decideConsent({ ...base, writer: { async create() { return false; } } });
  assert(failing.kind === 'redirect' && failing.location.includes('error=server_error') && !failing.location.includes('code='), 'storage failure issues no code');
  assert(clientRedirect(REDIRECT, { state: 'a&b=c' }).includes('state=a%26b%3Dc'), 'redirect params are encoded');

  // --- atomic consent+code adapter
  const calls: unknown[] = [];
  const w = createConsentCodeWriter({ async rpc(name, args) { calls.push([name, args]); return { data: true, error: null }; } });
  const rec = { clientId: 'chatgpt', redirectUri: REDIRECT, subject: 'u', challenge: 'a'.repeat(43), scopes: ['consensus.read' as const], consentedAtSeconds: now, expiresAtSeconds: now + 300 };
  assert(await w.create('f'.repeat(64), rec) && calls.length === 1, 'single RPC writes code and consent');
  assert(!(await w.create('xyz', rec)), 'bad digest rejected');
  assert(!(await createConsentCodeWriter({ async rpc() { return { data: null, error: { message: 'x' } }; } }).create('f'.repeat(64), rec)), 'RPC error => no code');
  assert(!(await createConsentCodeWriter({ async rpc() { return { data: false, error: null }; } }).create('f'.repeat(64), rec)), 'non-true RPC result => no code');

  // --- rate limiting
  const rl = createRateLimiter(3, 1000, 2);
  assert(rl.allow('a', 0) && rl.allow('a', 1) && rl.allow('a', 2) && !rl.allow('a', 3), 'limit enforced');
  assert(rl.allow('a', 1001), 'window resets');
  assert(rl.allow('b', 1001) && !rl.allow('c', 1002), 'key flooding fails closed');
  assert(!rl.allow('', 0) && !rl.allow('a', NaN), 'invalid limiter input denied');
  return 'oauth authorize flow checks passed';
}

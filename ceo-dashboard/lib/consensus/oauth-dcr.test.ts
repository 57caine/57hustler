import { allowedDcrRedirect, clientsFor, registerClient, verifyDynamicClient } from './oauth-dcr';
import { clientIp } from './oauth-http-ip';
import { createSharedLimiter, keyDigest } from './shared-rate-limit';
import { createRateLimiter } from './rate-limit';
import { parseAuthorizationRequest } from './oauth-authorization-request';

function check(v: unknown, label: string): asserts v { if (!v) throw new Error('FAILED: ' + label); }
const SECRET = 'k'.repeat(48);
const CLAUDE = 'https://claude.ai/api/mcp/auth_callback';

/** Pure-logic checks for DCR, client IP selection and the shared-limiter fallback. */
export async function testOAuthDcrAndLimits(): Promise<string> {
  let n = 0;
  const ok = await registerClient({ redirect_uris: [CLAUDE], client_name: 'Claude', token_endpoint_auth_method: 'none' }, SECRET);
  check(ok.ok, 'valid registration'); n++;
  const id = (ok as { ok: true; body: Record<string, unknown> }).body.client_id as string;
  check(id.length <= 256 && id.startsWith('dcr1.'), 'client_id compact'); n++;
  const c = await verifyDynamicClient(id, SECRET);
  check(c && c.redirectUris[0] === CLAUDE && c.name === 'Claude', 'client_id verifies and carries redirect'); n++;
  check(!(await verifyDynamicClient(id, 'x'.repeat(48))), 'other secret rejects'); n++;
  const tampered = id.replace(/\.[^.]+$/, '.' + 'A'.repeat(43));
  check(!(await verifyDynamicClient(tampered, SECRET)), 'bad signature rejects'); n++;
  const parts = id.split('.'); parts[1] = Buffer.from(JSON.stringify({ r: ['https://evil.example/cb'], n: 'x' })).toString('base64url');
  check(!(await verifyDynamicClient(parts.join('.'), SECRET)), 'forged payload rejects'); n++;
  for (const bad of ['https://evil.example/cb', 'http://claude.ai/api/mcp/auth_callback', 'https://claude.ai/api/mcp/auth_callback/', 'https://claude.ai.evil.example/api/mcp/auth_callback', 'https://chatgpt.com/connector/oauth/a/b', 'https://chatgpt.com/connector/oauth/', 'javascript:alert(1)', 'http://127.0.0.1:1/cb']) {
    check(!allowedDcrRedirect(bad), 'redirect denied: ' + bad);
    check(!(await registerClient({ redirect_uris: [bad] }, SECRET)).ok, 'register denies: ' + bad);
  }
  n++;
  for (const good of [CLAUDE, 'https://claude.com/api/mcp/auth_callback', 'https://chatgpt.com/connector_platform_oauth_redirect', 'https://chatgpt.com/connector/oauth/abc_DEF-123']) check(allowedDcrRedirect(good), 'redirect allowed: ' + good);
  n++;
  check(!(await registerClient({ redirect_uris: [CLAUDE], token_endpoint_auth_method: 'client_secret_basic' }, SECRET)).ok, 'secret auth refused'); n++;
  check(!(await registerClient({ redirect_uris: [CLAUDE], grant_types: ['password'] }, SECRET)).ok, 'password grant refused'); n++;
  check(!(await registerClient({ redirect_uris: [CLAUDE, CLAUDE] }, SECRET)).ok, 'duplicate redirect refused'); n++;
  check(!(await registerClient([], SECRET)).ok && !(await registerClient(null, SECRET)).ok, 'non-object refused'); n++;
  const named = await registerClient({ redirect_uris: [CLAUDE], client_name: '<script>alert(1)</script>' + 'x'.repeat(100) }, SECRET);
  check(named.ok && !/[<>]/.test(String(named.body.client_name)) && String(named.body.client_name).length <= 40, 'name sanitized'); n++;

  // wiring: DCR off -> never resolves; on -> resolves; static clients preserved
  const stat = [{ clientId: 'st', redirectUris: [CLAUDE], name: 'st' }];
  check((await clientsFor(stat, id, SECRET, false)).length === 1, 'dcr off ignores dynamic id');
  check((await clientsFor(stat, id, SECRET, true)).length === 2, 'dcr on resolves dynamic id');
  check((await clientsFor(stat, tampered, SECRET, true)).length === 1, 'dcr on ignores forged id'); n++;
  const q = new URLSearchParams({ response_type: 'code', client_id: id, redirect_uri: CLAUDE, state: 's'.repeat(16), code_challenge: 'c'.repeat(43), code_challenge_method: 'S256', scope: 'consensus.read' });
  check(parseAuthorizationRequest(q, await clientsFor(stat, id, SECRET, true)), 'authorization accepts dynamic client');
  q.set('redirect_uri', 'https://claude.com/api/mcp/auth_callback');
  check(!parseAuthorizationRequest(q, await clientsFor(stat, id, SECRET, true)), 'redirect must match the registered one exactly'); n++;

  // client IP: spoofed leftmost x-forwarded-for must not win
  const h = (o: Record<string, string>) => new Headers(o);
  check(clientIp(h({ 'x-forwarded-for': '1.2.3.4, 9.9.9.9' })) === '9.9.9.9', 'uses nearest-proxy (last) entry');
  check(clientIp(h({ 'x-vercel-forwarded-for': '8.8.8.8', 'x-forwarded-for': '1.2.3.4' })) === '8.8.8.8', 'platform header wins');
  check(clientIp(h({ 'x-forwarded-for': '<script>' })) === 'unknown', 'garbage -> unknown');
  check(clientIp(h({ 'x-forwarded-for': 'a'.repeat(200) })) === 'unknown', 'oversize -> unknown');
  check(clientIp(h({})) === 'unknown', 'no header -> unknown'); n++;

  // shared limiter: DB error and absent DB both fall back to the in-memory brake (never unlimited)
  const mem = createRateLimiter(2, 60_000);
  const broken = createSharedLimiter({ rpc: async () => ({ data: null, error: { message: 'down' } }) }, mem, 2, 60);
  const results = [await broken.allow('k', 1), await broken.allow('k', 2), await broken.allow('k', 3)];
  check(results[0] && results[1] && !results[2], 'fallback still limits'); n++;
  const dig = await keyDigest('1.2.3.4');
  check(/^[0-9a-f]{64}$/.test(dig) && !dig.includes('1.2.3.4'), 'key digest hides the address'); n++;
  return `OAuth DCR / client-ip / limiter ${n} check groups passed`;
}

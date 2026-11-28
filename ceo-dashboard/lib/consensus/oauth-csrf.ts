/**
 * Stateless CSRF token bound to the authenticated subject, the exact authorization
 * query and a short expiry. Signed with the server-only signing secret (HMAC-SHA256).
 * An attacker page cannot mint it; a token from one user/request is useless for another.
 */
const encoder = new TextEncoder();
async function hmac(secret: string, message: string): Promise<string> {
  if (typeof secret !== 'string' || encoder.encode(secret).length < 32) throw new Error('secret too short');
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Buffer.from(new Uint8Array(sig)).toString('base64url');
}
function canonical(query: URLSearchParams): string {
  return Array.from(query.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
}
export const CSRF_LIFETIME_SECONDS = 600;
export async function issueConsentCsrf(input: {
  secret: string; subject: string; query: URLSearchParams; nowSeconds: number;
}): Promise<string> {
  const exp = input.nowSeconds + CSRF_LIFETIME_SECONDS;
  const mac = await hmac(input.secret, ['consent', input.subject, String(exp), canonical(input.query)].join('\n'));
  return exp + '.' + mac;
}
export async function verifyConsentCsrf(input: {
  secret: string; subject: string; query: URLSearchParams; nowSeconds: number; token: unknown;
}): Promise<boolean> {
  try {
    if (typeof input.token !== 'string' || input.token.length > 200 ||
        !/^\d{1,12}\.[A-Za-z0-9_-]{43}$/.test(input.token) || !input.subject) return false;
    const [expText, mac] = input.token.split('.');
    const exp = Number(expText);
    if (!Number.isSafeInteger(exp) || exp <= input.nowSeconds ||
        exp - input.nowSeconds > CSRF_LIFETIME_SECONDS) return false;
    const expected = await hmac(input.secret, ['consent', input.subject, String(exp), canonical(input.query)].join('\n'));
    if (expected.length !== mac.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ mac.charCodeAt(i);
    return diff === 0;
  } catch { return false; }
}

import { NextResponse } from 'next/server';
import { createRateLimiter } from './rate-limit';

export const noStore = { 'Cache-Control': 'no-store', Pragma: 'no-cache' };
/** Per-IP requests/minute for OAuth endpoints. Default 30; tests may raise it, nothing may disable it. */
const configured = Number(process.env.CONSENSUS_OAUTH_RATE_LIMIT_PER_MIN);
export const oauthLimiter = createRateLimiter(Number.isInteger(configured) && configured >= 1 && configured <= 1000 ? configured : 30, 60_000);
export const mcpLimiter = createRateLimiter(120, 60_000);

export { loadRuntime, type OAuthRuntime } from './oauth-runtime';

/**
 * The PUBLIC origin of this request. Behind Vercel/any TLS terminator the platform sets
 * x-forwarded-proto/host; `next start` otherwise reports its own bind address as the origin,
 * which is never what the OAuth issuer is. Falls back to Next's origin when not forwarded as https.
 * It is only ever compared against the configured issuer (fail closed on mismatch), never trusted alone.
 */
export function requestOrigin(request: { headers: Headers; nextUrl: { origin: string } }): string {
  const proto = request.headers.get('x-forwarded-proto')?.split(',', 1)[0].trim().toLowerCase();
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host'))?.split(',', 1)[0].trim().toLowerCase();
  if (proto === 'https' && host && /^[a-z0-9.-]{1,253}(:\d{1,5})?$/.test(host)) return 'https://' + host;
  return request.nextUrl.origin;
}

export function clientIp(headers: Headers): string {
  const f = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return f && f.length < 64 ? f : 'unknown';
}
export function jsonError(status: number, name: string) {
  return NextResponse.json({ error: name }, { status, headers: noStore });
}

/** Read an application/x-www-form-urlencoded body with a hard byte cap (never trust Content-Length alone). */
export async function readBoundedForm(request: Request, maxBytes: number): Promise<URLSearchParams | 'too_large' | 'invalid'> {
  const reader = request.body?.getReader();
  if (!reader) return 'invalid';
  const chunks: Buffer[] = [];
  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) { await reader.cancel().catch(() => undefined); return 'too_large'; }
      chunks.push(Buffer.from(value));
    }
    return new URLSearchParams(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
  } catch { return 'invalid'; } finally { reader.releaseLock(); }
}

/** Shared pre-checks for public-client form endpoints (token, revoke). */
export function preflightFormEndpoint(request: { headers: Headers; nextUrl: { origin: string } }, maxBytes: number): ReturnType<typeof jsonError> | null {
  const origin = request.headers.get('origin');
  if (origin && origin !== requestOrigin(request)) return jsonError(403, 'invalid_request');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') return jsonError(415, 'invalid_request');
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) return jsonError(413, 'invalid_request');
  return null;
}

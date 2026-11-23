import { NextResponse } from 'next/server';
import { createRateLimiter } from './rate-limit';

export const noStore = { 'Cache-Control': 'no-store', Pragma: 'no-cache' };
export const oauthLimiter = createRateLimiter(30, 60_000);
export const mcpLimiter = createRateLimiter(120, 60_000);

export { loadRuntime, type OAuthRuntime } from './oauth-runtime';
export function clientIp(headers: Headers): string {
  const f = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return f && f.length < 64 ? f : 'unknown';
}
export function jsonError(status: number, name: string) {
  return NextResponse.json({ error: name }, { status, headers: noStore });
}

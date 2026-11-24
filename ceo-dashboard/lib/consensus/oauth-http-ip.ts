/**
 * Client address for rate limiting. Never trust the FIRST x-forwarded-for entry: a caller can
 * prepend any value. Preference order: Vercel's own header (set by the platform, overwritten on
 * entry), x-real-ip, then the LAST x-forwarded-for entry (appended by the nearest proxy).
 * Anything that is not a plausible IP literal becomes 'unknown' (all such callers share one bucket).
 */
export function clientIp(headers: Headers): string {
  const candidates = [
    headers.get('x-vercel-forwarded-for')?.split(',')[0],
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for')?.split(',').pop(),
  ];
  for (const c of candidates) {
    const v = c?.trim();
    if (v && v.length <= 45 && /^[0-9a-fA-F:.]+$/.test(v) && (v.includes('.') || v.includes(':'))) return v;
  }
  return 'unknown';
}

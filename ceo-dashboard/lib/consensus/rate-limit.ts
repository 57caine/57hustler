/**
 * Fixed-window rate limiter. In-memory: it is per server instance and resets on
 * cold start, so it is a best-effort abuse brake, NOT a billing or security boundary.
 * A shared (DB/Redis) limiter is still required before public production use.
 */
export type RateLimiter = { allow(key: string, nowMs: number): boolean };
export function createRateLimiter(limit: number, windowMs: number, maxKeys = 5000): RateLimiter {
  const buckets = new Map<string, { start: number; count: number }>();
  return {
    allow(key, nowMs) {
      if (!Number.isFinite(nowMs) || typeof key !== 'string' || !key) return false;
      const b = buckets.get(key);
      if (!b || nowMs - b.start >= windowMs) {
        if (buckets.size >= maxKeys) {
          for (const [k, v] of buckets) if (nowMs - v.start >= windowMs) buckets.delete(k);
          if (buckets.size >= maxKeys) return false; // fail closed under key flooding
        }
        buckets.set(key, { start: nowMs, count: 1 });
        return true;
      }
      if (b.count >= limit) return false;
      b.count++;
      return true;
    },
  };
}

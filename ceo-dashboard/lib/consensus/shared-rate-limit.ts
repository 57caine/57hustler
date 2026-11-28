import type { RateLimiter } from './rate-limit';

export type RateLimitRpc = {
  rpc(fn: 'consume_ai_consensus_rate_limit', args: { p_key_digest: string; p_limit: number; p_window_seconds: number }):
    PromiseLike<{ data: unknown; error: unknown }>;
};

export async function keyDigest(key: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('consensus-rl:' + key));
  return Array.from(new Uint8Array(d), b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Database-backed limiter shared by every server instance. If the database is unreachable it
 * falls back to the per-instance limiter (still a brake) rather than blocking all sign-ins.
 * It never fails open to "unlimited".
 */
export function createSharedLimiter(db: RateLimitRpc | null, fallback: RateLimiter, limit: number, windowSeconds: number) {
  return {
    async allow(key: string, nowMs: number): Promise<boolean> {
      if (!db) return fallback.allow(key, nowMs);
      try {
        const { data, error } = await db.rpc('consume_ai_consensus_rate_limit', {
          p_key_digest: await keyDigest(key), p_limit: limit, p_window_seconds: windowSeconds,
        });
        if (error || typeof data !== 'boolean') return fallback.allow(key, nowMs);
        return data;
      } catch { return fallback.allow(key, nowMs); }
    },
  };
}

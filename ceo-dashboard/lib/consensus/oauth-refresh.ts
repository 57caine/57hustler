/**
 * Refresh-token persistence port + Supabase adapter.
 *
 * Security model (OAuth 2.1 §4.3.1 / RFC 9700 §4.14):
 *  - refresh tokens are single-use and rotated on every refresh;
 *  - presenting an already-used token revokes the WHOLE grant (reuse detection);
 *  - rotation, reuse detection and revocation are each ONE SQL transaction
 *    (supabase/migrations/20261124090000_consensus_oauth_refresh_tokens.sql), never a
 *    SELECT-then-UPDATE in application code;
 *  - only SHA-256 digests are stored, and raw tokens are never logged.
 */
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 3600; // sliding
export const GRANT_TTL_SECONDS = 60 * 24 * 3600; // absolute; DB caps it at 90 days
export type GrantRevokeReason = 'owner' | 'client' | 'refresh_reuse' | 'code_reuse' | 'admin';

export type RotateResult =
  | { status: 'rotated'; grantId: string; subject: string; clientId: string; scopes: string[]; tokenExpiresAtSeconds: number }
  | { status: 'reuse_detected'; grantId: string }
  | { status: 'invalid' };

export type GrantView = {
  grantId: string; clientId: string; scopes: string[]; createdAtSeconds: number;
  expiresAtSeconds: number; revokedAtSeconds: number | null; revokeReason: string | null;
};

export type RefreshStore = {
  createGrant(input: {
    grantId: string; tokenDigest: string; subject: string; clientId: string; scopes: string[];
    originCodeDigest: string; tokenExpiresAtSeconds: number; grantExpiresAtSeconds: number;
  }): Promise<boolean>;
  rotate(input: { oldDigest: string; newDigest: string; clientId: string; newExpiresAtSeconds: number }): Promise<RotateResult>;
  /** RFC 7009: revokes the grant owned by `clientId` that this refresh token belongs to. */
  revokeRefreshToken(digest: string, clientId: string): Promise<string | null>;
  revokeGrant(grantId: string, reason: GrantRevokeReason, guard?: { subject?: string; clientId?: string }): Promise<boolean>;
  /** A replayed authorization code revokes whatever grant it produced. */
  revokeByCode(codeDigest: string): Promise<boolean>;
  /** Fail closed: unknown, revoked and expired grants are dead; storage errors THROW. */
  grantIsDead(grantId: string): Promise<boolean>;
  listGrants(subject: string): Promise<GrantView[]>;
};

const REFRESH_TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/;
export function validRefreshTokenFormat(value: unknown): value is string {
  return typeof value === 'string' && REFRESH_TOKEN_FORMAT.test(value);
}
export function newRefreshToken(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
}
/** Domain-separated from authorization-code digests so one can never be replayed as the other. */
export async function refreshTokenDigest(token: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('consensus-refresh:' + token));
  return Array.from(new Uint8Array(d), b => b.toString(16).padStart(2, '0')).join('');
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function validGrantId(value: unknown): value is string { return typeof value === 'string' && UUID.test(value); }
export function newGrantId(): string { return crypto.randomUUID(); }

type RpcResult = PromiseLike<{ data: unknown; error: { message?: string } | null }>;
/** Server-only client with service_role. Never expose it to browsers or MCP callers. */
export type RefreshDatabase = { rpc(name: string, args: Record<string, unknown>): RpcResult };

const iso = (seconds: number) => new Date(seconds * 1000).toISOString();
function secondsOf(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}
function scopesOf(value: unknown): string[] | null {
  return Array.isArray(value) && value.length > 0 && value.every(s => s === 'consensus.read' || s === 'consensus.write')
    ? (value as string[]) : null;
}

export function createRefreshStore(db: RefreshDatabase): RefreshStore {
  return {
    async createGrant(i) {
      if (!validGrantId(i.grantId) || !/^[0-9a-f]{64}$/.test(i.tokenDigest) ||
          !/^[0-9a-f]{64}$/.test(i.originCodeDigest)) return false;
      const { data, error } = await db.rpc('create_ai_consensus_oauth_grant', {
        p_grant_id: i.grantId, p_token_digest: i.tokenDigest, p_subject: i.subject,
        p_client_id: i.clientId, p_scopes: i.scopes, p_origin_code_digest: i.originCodeDigest,
        p_token_expires_at: iso(i.tokenExpiresAtSeconds), p_grant_expires_at: iso(i.grantExpiresAtSeconds),
      });
      return !error && data === true;
    },
    async rotate(i) {
      if (!/^[0-9a-f]{64}$/.test(i.oldDigest) || !/^[0-9a-f]{64}$/.test(i.newDigest)) return { status: 'invalid' };
      const { data, error } = await db.rpc('rotate_ai_consensus_refresh_token', {
        p_old_digest: i.oldDigest, p_new_digest: i.newDigest, p_client_id: i.clientId,
        p_new_expires_at: iso(i.newExpiresAtSeconds),
      });
      // Storage failure is NOT "invalid": the caller must answer 503 and must not guess.
      if (error) throw new Error('refresh store unavailable');
      if (!Array.isArray(data) || data.length !== 1 || !data[0] || typeof data[0] !== 'object') throw new Error('refresh store malformed');
      const row = data[0] as Record<string, unknown>;
      if (row.status === 'rotated') {
        const scopes = scopesOf(row.scopes), exp = secondsOf(row.token_expires_at);
        if (!validGrantId(row.grant_id) || typeof row.subject !== 'string' || typeof row.client_id !== 'string' ||
            !scopes || exp === null) throw new Error('refresh store malformed');
        return { status: 'rotated', grantId: row.grant_id, subject: row.subject, clientId: row.client_id, scopes, tokenExpiresAtSeconds: exp };
      }
      if (row.status === 'reuse_detected' && validGrantId(row.grant_id)) return { status: 'reuse_detected', grantId: row.grant_id };
      return { status: 'invalid' };
    },
    async revokeRefreshToken(digest, clientId) {
      if (!/^[0-9a-f]{64}$/.test(digest)) return null;
      const { data, error } = await db.rpc('revoke_ai_consensus_refresh_token', { p_digest: digest, p_client_id: clientId });
      if (error) throw new Error('refresh store unavailable');
      return validGrantId(data) ? data : null;
    },
    async revokeGrant(grantId, reason, guard) {
      if (!validGrantId(grantId)) return false;
      const { data, error } = await db.rpc('revoke_ai_consensus_oauth_grant', {
        p_grant_id: grantId, p_reason: reason, p_subject: guard?.subject ?? null, p_client_id: guard?.clientId ?? null,
      });
      if (error) throw new Error('refresh store unavailable');
      return data === true;
    },
    async revokeByCode(codeDigest) {
      if (!/^[0-9a-f]{64}$/.test(codeDigest)) return false;
      const { data, error } = await db.rpc('revoke_ai_consensus_grant_by_code', { p_code_digest: codeDigest });
      if (error) throw new Error('refresh store unavailable');
      return data === true;
    },
    async grantIsDead(grantId) {
      if (!validGrantId(grantId)) return true;
      const { data, error } = await db.rpc('ai_consensus_oauth_grant_is_dead', { p_grant_id: grantId });
      if (error || typeof data !== 'boolean') throw new Error('refresh store unavailable');
      return data;
    },
    async listGrants(subject) {
      const { data, error } = await db.rpc('list_ai_consensus_oauth_grants', { p_subject: subject });
      if (error || !Array.isArray(data)) throw new Error('refresh store unavailable');
      const out: GrantView[] = [];
      for (const r of data as Array<Record<string, unknown>>) {
        const created = secondsOf(r.created_at), expires = secondsOf(r.expires_at);
        if (!validGrantId(r.grant_id) || typeof r.client_id !== 'string' || !Array.isArray(r.scopes) ||
            created === null || expires === null) continue;
        out.push({
          grantId: r.grant_id, clientId: r.client_id, scopes: r.scopes as string[],
          createdAtSeconds: created, expiresAtSeconds: expires,
          revokedAtSeconds: secondsOf(r.revoked_at), revokeReason: typeof r.revoke_reason === 'string' ? r.revoke_reason : null,
        });
      }
      return out;
    },
  };
}

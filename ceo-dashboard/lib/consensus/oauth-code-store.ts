import type { AuthorizationCodeWriter } from './oauth-code-issuance';
import type { AtomicCodeStore, StoredAuthorizationCode } from './oauth-code-exchange';

/**
 * Server-only persistence adapter. Pass an explicitly constructed service-role Supabase
 * client from a trusted server handler; NEVER instantiate it in a browser or expose its key.
 * The SQL migration must be applied and its grants/RLS reviewed before use.
 */
export type OAuthCodeDatabase = {
  from(table: 'ai_consensus_oauth_codes'): {
    insert(row: Record<string, unknown>): PromiseLike<{ error: { message?: string } | null }>;
  };
  rpc(name: 'consume_ai_consensus_oauth_code', args: { p_digest: string }): PromiseLike<{
    data: unknown; error: { message?: string } | null;
  }>;
};

function validStoredRecord(row: unknown): row is Record<string, unknown> {
  return row !== null && typeof row === 'object' && !Array.isArray(row);
}
function seconds(iso: unknown): number | null {
  if (typeof iso !== 'string') return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}

export function createOAuthCodeStore(db: OAuthCodeDatabase): AuthorizationCodeWriter & AtomicCodeStore {
  return {
    async create(digest: string, record: StoredAuthorizationCode): Promise<boolean> {
      if (!/^[0-9a-f]{64}$/.test(digest)) return false;
      const { error } = await db.from('ai_consensus_oauth_codes').insert({
        code_digest: digest, client_id: record.clientId, redirect_uri: record.redirectUri,
        subject: record.subject, challenge: record.challenge, scopes: record.scopes,
        consented_at: new Date(record.consentedAtSeconds * 1000).toISOString(),
        expires_at: new Date(record.expiresAtSeconds * 1000).toISOString(),
      });
      return !error;
    },
    async consumeOnce(digest: string): Promise<StoredAuthorizationCode | null> {
      if (!/^[0-9a-f]{64}$/.test(digest)) return null;
      // SQL UPDATE ... RETURNING is atomic. No SELECT-then-UPDATE race.
      const { data, error } = await db.rpc('consume_ai_consensus_oauth_code', { p_digest: digest });
      if (error || !Array.isArray(data) || data.length !== 1 || !validStoredRecord(data[0])) return null;
      const row = data[0];
      const consentedAtSeconds = seconds(row.consented_at);
      const expiresAtSeconds = seconds(row.expires_at);
      if (typeof row.client_id !== 'string' || typeof row.redirect_uri !== 'string' ||
          typeof row.subject !== 'string' || typeof row.challenge !== 'string' ||
          !Array.isArray(row.scopes) || !row.scopes.every(s => s === 'consensus.read' || s === 'consensus.write') ||
          consentedAtSeconds === null || expiresAtSeconds === null) return null;
      return {
        clientId: row.client_id, redirectUri: row.redirect_uri, subject: row.subject,
        challenge: row.challenge, scopes: row.scopes, consentedAtSeconds, expiresAtSeconds,
      };
    },
  };
}

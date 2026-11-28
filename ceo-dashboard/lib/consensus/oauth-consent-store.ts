import type { AuthorizationCodeWriter } from './oauth-code-issuance';
import type { StoredAuthorizationCode } from './oauth-code-exchange';

/** Server-only adapter: code + consent audit row are written by one SQL function (one transaction). */
export type ConsentIssueDatabase = {
  rpc(name: 'issue_ai_consensus_oauth_code_with_consent', args: Record<string, unknown>): PromiseLike<{
    data: unknown; error: { message?: string } | null;
  }>;
};
export function createConsentCodeWriter(db: ConsentIssueDatabase): AuthorizationCodeWriter {
  return {
    async create(digest: string, r: StoredAuthorizationCode): Promise<boolean> {
      if (!/^[0-9a-f]{64}$/.test(digest)) return false;
      const { data, error } = await db.rpc('issue_ai_consensus_oauth_code_with_consent', {
        p_digest: digest, p_client_id: r.clientId, p_redirect_uri: r.redirectUri,
        p_subject: r.subject, p_challenge: r.challenge, p_scopes: r.scopes,
        p_approved_at: new Date(r.consentedAtSeconds * 1000).toISOString(),
        p_expires_at: new Date(r.expiresAtSeconds * 1000).toISOString(),
      });
      return !error && data === true;
    },
  };
}

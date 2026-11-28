import { authorizationCodeDigest, type StoredAuthorizationCode } from './oauth-code-exchange';
import { exactRegisteredRedirect, parseRequestedScopes, validPkceChallenge, type McpScope } from './oauth-contract';

/** Only call after an authenticated owner explicitly approves the displayed client, scopes and redirect URI.
 * This module does NOT provide an approval UI or token endpoint.
 */
export type ApprovedConsent = {
  subject: string; clientId: string; redirectUri: string; scopes: McpScope[];
  challenge: string; approvedAtSeconds: number; expiresAtSeconds: number;
};
export type AuthorizationCodeWriter = {
  /** Must atomically persist digest with unique constraint, not the raw code. */
  create(codeDigest: string, record: StoredAuthorizationCode): Promise<boolean>;
};
export async function issueAuthorizationCode(
  consent: ApprovedConsent, registeredRedirects: readonly string[], store: AuthorizationCodeWriter,
  nowSeconds: number
): Promise<string | null> {
  if (!consent || typeof consent.subject !== 'string' || !consent.subject.trim() ||
      typeof consent.clientId !== 'string' || !consent.clientId.trim() ||
      !exactRegisteredRedirect(consent.redirectUri, registeredRedirects) ||
      !validPkceChallenge('S256', consent.challenge) ||
      !Array.isArray(consent.scopes) || consent.scopes.length === 0 ||
      !consent.scopes.every(s => typeof s === 'string') ||
      parseRequestedScopes(consent.scopes.join(' '))?.length !== consent.scopes.length ||
      !Number.isSafeInteger(nowSeconds) ||
      !Number.isSafeInteger(consent.approvedAtSeconds) ||
      consent.approvedAtSeconds > nowSeconds ||
      !Number.isSafeInteger(consent.expiresAtSeconds) ||
      consent.expiresAtSeconds <= nowSeconds ||
      consent.expiresAtSeconds - nowSeconds > 600) return null;
  // 256-bit CSPRNG code, encoded without secrets in logs. Persist only its SHA-256 digest.
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const code = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  const record: StoredAuthorizationCode = {
    clientId: consent.clientId, redirectUri: consent.redirectUri, subject: consent.subject,
    challenge: consent.challenge, scopes: [...consent.scopes],
    consentedAtSeconds: consent.approvedAtSeconds, expiresAtSeconds: consent.expiresAtSeconds,
  };
  // Fail closed on storage errors. Never return a code that wasn't committed.
  try { return await store.create(await authorizationCodeDigest(code), record) ? code : null; }
  catch { return null; }
}

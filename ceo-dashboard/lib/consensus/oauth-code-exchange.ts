import { exactRegisteredRedirect, parseRequestedScopes, validPkceChallenge, verifyPkceS256, type McpScope } from './oauth-contract';

/** A single-use authorization code must be consumed atomically by persistent storage.
 * This is a fail-closed exchange service, NOT a token issuer or a complete OAuth server.
 * Never use an in-memory Map in production or mint a token before atomic consumption.
 */
export type StoredAuthorizationCode = {
  clientId: string; redirectUri: string; subject: string; challenge: string;
  scopes: McpScope[]; expiresAtSeconds: number; consentedAtSeconds: number;
};
export type AtomicCodeStore = {
  /** Delete/mark used and return the record in ONE database transaction; null if absent/used. */
  consumeOnce(codeDigest: string): Promise<StoredAuthorizationCode | null>;
};
export type CodeExchangeRequest = {
  code: string; verifier: string; clientId: string; redirectUri: string;
  subject: string; nowSeconds: number; registeredRedirects: readonly string[];
};
/** No raw authorization codes should be written to logs or database; store only SHA-256 digest. */
export async function authorizationCodeDigest(code: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
}
export async function exchangeAuthorizationCode(
  request: CodeExchangeRequest, store: AtomicCodeStore
): Promise<{ subject: string; scopes: McpScope[] } | null> {
  if (!request || typeof request.code !== 'string' ||
      !/^[A-Za-z0-9_-]{32,256}$/.test(request.code) ||
      !request.clientId || !request.subject ||
      !Number.isSafeInteger(request.nowSeconds) ||
      !exactRegisteredRedirect(request.redirectUri, request.registeredRedirects)) return null;
  // Fail closed: invalid verifier cannot consume a legitimate code.
  if (typeof request.verifier !== 'string' || !/^[A-Za-z0-9._~-]{43,128}$/.test(request.verifier)) return null;
  const record = await store.consumeOnce(await authorizationCodeDigest(request.code));
  if (!record || record.clientId !== request.clientId ||
      record.redirectUri !== request.redirectUri ||
      record.subject !== request.subject ||
      !Number.isSafeInteger(record.expiresAtSeconds) ||
      record.expiresAtSeconds <= request.nowSeconds ||
      !Number.isSafeInteger(record.consentedAtSeconds) ||
      record.consentedAtSeconds > request.nowSeconds ||
      !validPkceChallenge('S256', record.challenge) ||
      parseRequestedScopes(record.scopes.join(' '))?.length !== record.scopes.length ||
      !(await verifyPkceS256(request.verifier, record.challenge))) return null;
  return { subject: record.subject, scopes: record.scopes };
}

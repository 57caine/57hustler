import { exactRegisteredRedirect, parseRequestedScopes, verifyPkceS256 } from './oauth-contract';
import { authorizationCodeDigest, type AtomicCodeStore } from './oauth-code-exchange';
import { issueOAuthBearer } from './oauth-bearer';

/**
 * Public-client OAuth authorization-code to bearer exchange.
 * The owner identity MUST come from the atomically consumed database record,
 * never from a client-supplied "subject" field.
 * This is a server-side primitive, not a deployed /token HTTP endpoint.
 */
export async function exchangeCodeForBearer(
  input: {
    code: unknown; verifier: unknown; clientId: unknown; redirectUri: unknown;
    nowSeconds: number; issuer: string; audience: string; signingSecret: string;
    registeredRedirects: readonly string[];
  },
  store: AtomicCodeStore,
): Promise<string | null> {
  if (!input || typeof input.code !== 'string' || !/^[A-Za-z0-9_-]{32,256}$/.test(input.code) ||
      typeof input.verifier !== 'string' || !/^[A-Za-z0-9._~-]{43,128}$/.test(input.verifier) ||
      typeof input.clientId !== 'string' || !input.clientId.trim() ||
      typeof input.redirectUri !== 'string' ||
      !Number.isSafeInteger(input.nowSeconds) ||
      !exactRegisteredRedirect(input.redirectUri, input.registeredRedirects)) return null;
  try {
    // Atomic consumption before issuing any token; invalid codes are never retried.
    const stored = await store.consumeOnce(await authorizationCodeDigest(input.code));
    if (!stored || stored.clientId !== input.clientId || stored.redirectUri !== input.redirectUri ||
        !stored.subject || !Number.isSafeInteger(stored.expiresAtSeconds) ||
        stored.expiresAtSeconds <= input.nowSeconds ||
        !Number.isSafeInteger(stored.consentedAtSeconds) ||
        stored.consentedAtSeconds > input.nowSeconds ||
        !Array.isArray(stored.scopes) || stored.scopes.length === 0 ||
        parseRequestedScopes(stored.scopes.join(' '))?.length !== stored.scopes.length ||
        !(await verifyPkceS256(input.verifier, stored.challenge))) return null;
    return await issueOAuthBearer({
      issuer: input.issuer, audience: input.audience, subject: stored.subject,
      clientId: stored.clientId, scopes: stored.scopes,
      nowSeconds: input.nowSeconds, secret: input.signingSecret,
    });
  } catch { return null; }
}

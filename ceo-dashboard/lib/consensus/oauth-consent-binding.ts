import { parseAuthorizationRequest, type AuthorizationRequest } from './oauth-authorization-request';
import type { ApprovedConsent } from './oauth-code-issuance';
import type { McpScope } from './oauth-contract';

/**
 * Bind the user's affirmative approval to the exact request shown in the
 * authenticated consent UI. Neither client nor subject may be taken from POST.
 * The CSRF token must be verified against an HttpOnly SameSite session cookie
 * by the calling route before invoking this function.
 */
export function approveAuthorizationRequest(input: {
  originalQuery: URLSearchParams;
  clients: ReadonlyArray<{clientId:string;redirectUris:readonly string[]}>;
  displayed: AuthorizationRequest;
  authenticatedSubject: string;
  csrfVerified: boolean;
  explicitApproval: boolean;
  nowSeconds: number;
}): ApprovedConsent | null {
  if (!input.csrfVerified || !input.explicitApproval ||
      !input.authenticatedSubject?.trim() ||
      !Number.isSafeInteger(input.nowSeconds)) return null;
  const parsed = parseAuthorizationRequest(input.originalQuery, input.clients);
  if (!parsed || parsed.clientId !== input.displayed.clientId ||
      parsed.redirectUri !== input.displayed.redirectUri ||
      parsed.state !== input.displayed.state ||
      parsed.codeChallenge !== input.displayed.codeChallenge ||
      parsed.scopes.join(' ') !== input.displayed.scopes.join(' ')) return null;
  const scopes: McpScope[] = [...parsed.scopes];
  return {
    subject: input.authenticatedSubject,
    clientId: parsed.clientId,
    redirectUri: parsed.redirectUri,
    challenge: parsed.codeChallenge,
    scopes,
    approvedAtSeconds: input.nowSeconds,
    expiresAtSeconds: input.nowSeconds + 300,
  };
}

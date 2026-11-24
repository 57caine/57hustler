import { parseAuthorizationRequest, type AuthorizationRequest } from './oauth-authorization-request';
import { approveAuthorizationRequest } from './oauth-consent-binding';
import { issueAuthorizationCode, type AuthorizationCodeWriter } from './oauth-code-issuance';
import { issueConsentCsrf, verifyConsentCsrf } from './oauth-csrf';
import { clientRedirect, type RegisteredClient } from './oauth-config';

/** Pure consent-decision service used by the HTTP route; no framework or DB imports. */
export type ConsentDecision =
  | { kind: 'redirect'; location: string }
  | { kind: 'error'; status: number; reason: string };

export async function prepareConsent(input: {
  query: URLSearchParams; clients: readonly RegisteredClient[]; subject: string;
  secret: string; nowSeconds: number; expectedResource?: string;
}): Promise<{ request: AuthorizationRequest; clientName: string; csrf: string } | null> {
  const request = parseAuthorizationRequest(input.query, input.clients, input.expectedResource);
  if (!request || !input.subject) return null;
  const client = input.clients.find(c => c.clientId === request.clientId)!;
  const csrf = await issueConsentCsrf({ secret: input.secret, subject: input.subject, query: input.query, nowSeconds: input.nowSeconds });
  return { request, clientName: client.name, csrf };
}

export async function decideConsent(input: {
  query: URLSearchParams; clients: readonly RegisteredClient[]; subject: string;
  secret: string; csrfToken: unknown; approve: boolean; nowSeconds: number;
  writer: AuthorizationCodeWriter;
  expectedResource?: string;
  /** RFC 9207: returned as `iss` on every authorization response so clients can detect mix-up attacks. */
  issuer?: string;
}): Promise<ConsentDecision> {
  const displayed = parseAuthorizationRequest(input.query, input.clients, input.expectedResource);
  const withIss = (p: Record<string, string>) => (input.issuer ? { ...p, iss: input.issuer } : p);
  // An invalid request must NEVER redirect to the supplied redirect_uri (open-redirect safe).
  if (!displayed || !input.subject) return { kind: 'error', status: 400, reason: 'invalid_request' };
  const csrfOk = await verifyConsentCsrf({
    secret: input.secret, subject: input.subject, query: input.query,
    nowSeconds: input.nowSeconds, token: input.csrfToken,
  });
  if (!csrfOk) return { kind: 'error', status: 403, reason: 'invalid_csrf' };
  if (!input.approve) {
    return { kind: 'redirect', location: clientRedirect(displayed.redirectUri, withIss({ error: 'access_denied', state: displayed.state })) };
  }
  const consent = approveAuthorizationRequest({
    originalQuery: input.query, clients: input.clients, displayed,
    authenticatedSubject: input.subject, csrfVerified: true, explicitApproval: true,
    nowSeconds: input.nowSeconds, expectedResource: input.expectedResource,
  });
  if (!consent) return { kind: 'error', status: 400, reason: 'invalid_request' };
  const client = input.clients.find(c => c.clientId === displayed.clientId)!;
  const code = await issueAuthorizationCode(consent, client.redirectUris, input.writer, input.nowSeconds);
  if (!code) return { kind: 'redirect', location: clientRedirect(displayed.redirectUri, withIss({ error: 'server_error', state: displayed.state })) };
  return { kind: 'redirect', location: clientRedirect(displayed.redirectUri, withIss({ code, state: displayed.state })) };
}

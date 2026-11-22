import { scopesPermit, parseRequestedScopes } from './oauth-contract';
import { verifyOAuthBearer, type OAuthBearerClaims } from './oauth-bearer';

/**
 * Fail-closed resource-server guard for a verified OAuth bearer.
 * Call before any MCP tool or owner-scoped database query. This does not replace
 * persistent revocation or RLS and is not yet wired to the public MCP route.
 */
export async function authorizeMcpTool(input: {
  authorization: string | null;
  toolName: string;
  issuer: string;
  audience: string;
  signingSecret: string;
  nowSeconds: number;
  isRevoked: (jti: string) => Promise<boolean>;
}): Promise<OAuthBearerClaims | null> {
  if (!input || typeof input.authorization !== 'string' ||
      !/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(input.authorization)) return null;
  const claims = await verifyOAuthBearer(input.authorization.slice(7), {
    issuer: input.issuer, audience: input.audience, nowSeconds: input.nowSeconds,
    secret: input.signingSecret, isRevoked: input.isRevoked,
  });
  if (!claims) return null;
  const scopes = parseRequestedScopes(claims.scope);
  if (!scopes || !scopesPermit(scopes, input.toolName)) return null;
  return claims;
}

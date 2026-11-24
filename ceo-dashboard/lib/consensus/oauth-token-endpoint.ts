import { uniqueOAuthClient, parseRequestedScopes, type McpScope } from './oauth-contract';
import type { AtomicCodeStore } from './oauth-code-exchange';
import { consumeAuthorizationCode } from './oauth-token-flow';
import { issueOAuthBearer, verifyOAuthBearer } from './oauth-bearer';
import {
  GRANT_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS, newGrantId, newRefreshToken,
  refreshTokenDigest, validRefreshTokenFormat, type RefreshStore,
} from './oauth-refresh';

/** Framework-free token + revocation endpoint logic so it is testable against a real database. */
export type TokenDeps = {
  clients: ReadonlyArray<{ clientId: string; redirectUris: readonly string[] }>;
  issuer: string; signingSecret: string; nowSeconds: number;
  codes: AtomicCodeStore; refresh: RefreshStore;
};
export type EndpointResponse = { status: number; body: Record<string, unknown> };
const err = (status: number, error: string): EndpointResponse => ({ status, body: { error } });
export const ACCESS_TOKEN_TTL_SECONDS = 600;

const CODE_PARAMS = ['grant_type', 'code', 'redirect_uri', 'client_id', 'code_verifier', 'resource'];
const REFRESH_PARAMS = ['grant_type', 'refresh_token', 'client_id', 'resource'];
function strictParams(form: URLSearchParams, allowed: string[]): boolean {
  return Array.from(form.keys()).every(k => allowed.includes(k)) && allowed.every(k => form.getAll(k).length <= 1);
}

export async function handleTokenRequest(form: URLSearchParams, d: TokenDeps): Promise<EndpointResponse> {
  const grantType = form.get('grant_type');
  const audience = d.issuer + '/api/consensus/mcp';
  const clientId = form.get('client_id');
  const client = clientId ? uniqueOAuthClient(d.clients, clientId) : null;
  // RFC 8707: official MCP clients send resource=<MCP URL>. Only OUR resource is acceptable.
  const resource = form.get('resource');
  if ((grantType === 'authorization_code' || grantType === 'refresh_token') && resource !== null && resource !== audience) {
    return err(400, 'invalid_target');
  }

  if (grantType === 'authorization_code') {
    if (!strictParams(form, CODE_PARAMS)) return err(400, 'invalid_request');
    const code = form.get('code'), redirectUri = form.get('redirect_uri'), verifier = form.get('code_verifier');
    if (!code || !clientId || !redirectUri || !verifier) return err(400, 'invalid_request');
    if (!client) return err(400, 'invalid_client');
    try {
      const consumed = await consumeAuthorizationCode({
        code, verifier, clientId, redirectUri, nowSeconds: d.nowSeconds, registeredRedirects: client.redirectUris,
      }, d.codes);
      if (!('record' in consumed)) {
        // A code that was already used (or never existed) may have leaked: revoke what it produced.
        if (consumed.codeDigest) await d.refresh.revokeByCode(consumed.codeDigest).catch(() => false);
        return err(400, 'invalid_grant');
      }
      const { record, codeDigest } = consumed;
      const grantId = newGrantId();
      const refreshToken = newRefreshToken();
      const stored = await d.refresh.createGrant({
        grantId, tokenDigest: await refreshTokenDigest(refreshToken), subject: record.subject,
        clientId: record.clientId, scopes: record.scopes, originCodeDigest: codeDigest,
        tokenExpiresAtSeconds: d.nowSeconds + REFRESH_TOKEN_TTL_SECONDS,
        grantExpiresAtSeconds: d.nowSeconds + GRANT_TTL_SECONDS,
      });
      if (!stored) return err(503, 'temporarily_unavailable');
      const accessToken = await issueOAuthBearer({
        issuer: d.issuer, audience, subject: record.subject, clientId: record.clientId,
        scopes: record.scopes, nowSeconds: d.nowSeconds, secret: d.signingSecret, grantId,
      });
      if (!accessToken) {
        await d.refresh.revokeGrant(grantId, 'admin').catch(() => false);
        return err(503, 'temporarily_unavailable');
      }
      return tokens(accessToken, refreshToken, record.scopes);
    } catch { return err(503, 'temporarily_unavailable'); }
  }

  if (grantType === 'refresh_token') {
    if (!strictParams(form, REFRESH_PARAMS)) return err(400, 'invalid_request');
    const presented = form.get('refresh_token');
    if (!presented || !clientId) return err(400, 'invalid_request');
    if (!client) return err(400, 'invalid_client');
    if (!validRefreshTokenFormat(presented)) return err(400, 'invalid_grant');
    try {
      const next = newRefreshToken();
      const result = await d.refresh.rotate({
        oldDigest: await refreshTokenDigest(presented), newDigest: await refreshTokenDigest(next),
        clientId, newExpiresAtSeconds: d.nowSeconds + REFRESH_TOKEN_TTL_SECONDS,
      });
      // Both "unknown" and "reuse" look identical to the caller; reuse already revoked the grant.
      if (result.status !== 'rotated') return err(400, 'invalid_grant');
      const accessToken = await issueOAuthBearer({
        issuer: d.issuer, audience, subject: result.subject, clientId: result.clientId,
        scopes: result.scopes as McpScope[], nowSeconds: d.nowSeconds, secret: d.signingSecret, grantId: result.grantId,
      });
      if (!accessToken) return err(503, 'temporarily_unavailable');
      return tokens(accessToken, next, result.scopes as McpScope[]);
    } catch { return err(503, 'temporarily_unavailable'); }
  }
  return err(400, 'unsupported_grant_type');
}

function tokens(accessToken: string, refreshToken: string, scopes: readonly string[]): EndpointResponse {
  return { status: 200, body: {
    access_token: accessToken, token_type: 'Bearer', expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken, scope: scopes.join(' '),
  } };
}

/**
 * RFC 7009 token revocation for public clients. Revoking either token revokes the whole
 * grant (access + every refresh token). Unknown or foreign tokens still answer 200 so the
 * endpoint cannot be used as a token-validity oracle.
 */
export async function handleRevokeRequest(
  form: URLSearchParams, d: Omit<TokenDeps, 'codes'>,
): Promise<EndpointResponse> {
  if (!strictParams(form, ['token', 'token_type_hint', 'client_id'])) return err(400, 'invalid_request');
  const token = form.get('token'), clientId = form.get('client_id');
  if (!token || !clientId || token.length > 4096) return err(400, 'invalid_request');
  const hint = form.get('token_type_hint');
  if (hint !== null && hint !== 'refresh_token' && hint !== 'access_token') return err(400, 'unsupported_token_type');
  if (!uniqueOAuthClient(d.clients, clientId)) return err(400, 'invalid_client');
  try {
    if (validRefreshTokenFormat(token)) {
      await d.refresh.revokeRefreshToken(await refreshTokenDigest(token), clientId);
    } else {
      // Signature/issuer/audience must hold; expiry and revocation state are irrelevant here.
      const claims = await verifyOAuthBearer(token, {
        issuer: d.issuer, audience: d.issuer + '/api/consensus/mcp', nowSeconds: d.nowSeconds,
        secret: d.signingSecret, isRevoked: async () => false, isGrantDead: async () => false,
      });
      if (claims?.gid && claims.client_id === clientId) {
        await d.refresh.revokeGrant(claims.gid, 'client', { clientId });
      }
    }
  } catch { return err(503, 'temporarily_unavailable'); }
  return { status: 200, body: {} };
}
export { parseRequestedScopes };

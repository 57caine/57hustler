/** OAuth 2.1 authorization-request validation primitives; NOT an authorization server.
 * No access tokens are minted here. Never accept wildcard redirect URIs.
 */
export const MCP_SCOPES = ['consensus.read','consensus.write'] as const;
export type McpScope = typeof MCP_SCOPES[number];
export function validPkceChallenge(method:unknown, challenge:unknown):boolean {
  return method === 'S256' && typeof challenge === 'string' && /^[A-Za-z0-9_-]{43}$/.test(challenge);
}
export function validOAuthState(state:unknown):boolean {
  return typeof state === 'string' && state.length >= 16 && state.length <= 256 && /^[A-Za-z0-9_-]+$/.test(state);
}
export function exactRegisteredRedirect(uri:unknown, registered:readonly string[]):boolean {
  if (typeof uri !== 'string' || !registered.includes(uri)) return false;
  try {
    const parsed = new URL(uri);
    if (parsed.username || parsed.password || parsed.hash) return false;
    return parsed.protocol === 'https:' || (parsed.protocol === 'http:' && (parsed.hostname === '127.0.0.1' || parsed.hostname === '[::1]' || parsed.hostname === 'localhost'));
  } catch { return false; }
}
export function parseRequestedScopes(value:unknown):McpScope[] | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parts=value.split(' ');
  if(parts.some(p=>!MCP_SCOPES.includes(p as McpScope)) || new Set(parts).size!==parts.length) return null;
  return parts as McpScope[];
}
export function scopesPermit(granted:readonly McpScope[], tool:string):boolean {
  const needed = tool === 'get_status' || tool === 'get_result' ? 'consensus.read'
    : tool === 'submit_question' || tool === 'submit_review' ? 'consensus.write' : null;
  return needed!==null && granted.includes(needed);
}

/** Policy check only. Call this AFTER a trusted JWT verifier validates signature,
 * algorithm, issuer key, and audience; never decode an unverified JWT as authority.
 * Revocation must also be checked against server-side token state.
 */
export function validVerifiedAccessClaims(
  claims: unknown,
  expected: { issuer: string; audience: string; subject: string; nowSeconds: number; requiredScope: McpScope }
): boolean {
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) return false;
  const c = claims as Record<string, unknown>;
  const audienceOk = c.aud === expected.audience ||
    (Array.isArray(c.aud) && c.aud.length > 0 && c.aud.every(x => typeof x === 'string') && c.aud.includes(expected.audience));
  const scope = parseRequestedScopes(c.scope);
  return c.iss === expected.issuer && audienceOk && c.sub === expected.subject &&
    typeof c.exp === 'number' && Number.isSafeInteger(c.exp) && c.exp > expected.nowSeconds &&
    typeof c.iat === 'number' && Number.isSafeInteger(c.iat) && c.iat <= expected.nowSeconds &&
    (c.nbf === undefined || (typeof c.nbf === 'number' && Number.isSafeInteger(c.nbf) && c.nbf <= expected.nowSeconds)) &&
    scope !== null && scope.includes(expected.requiredScope);
}

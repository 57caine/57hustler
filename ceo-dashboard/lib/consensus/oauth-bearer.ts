import { parseRequestedScopes, type McpScope } from './oauth-contract';

/** Signed, short-lived OAuth bearer primitive. A production token endpoint must first
 * validate one-time authorization-code consumption and explicit owner consent.
 * Key material must come from a server-only secret manager; never NEXT_PUBLIC_*.
 * Revocation and key rotation are mandatory before production use.
 */
export type OAuthBearerClaims = {
  iss: string; aud: string; sub: string; client_id: string;
  iat: number; exp: number; jti: string; scope: string;
  /** Grant (refresh-token family) this access token belongs to. Revoking the grant kills it. */
  gid?: string;
};
const encoder = new TextEncoder();
function b64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}
function decodeJson(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}
function validClaims(c: OAuthBearerClaims, now: number): boolean {
  return typeof c.iss === 'string' && c.iss.startsWith('https://') &&
    typeof c.aud === 'string' && c.aud.length > 0 &&
    typeof c.sub === 'string' && c.sub.length > 0 &&
    typeof c.client_id === 'string' && c.client_id.length > 0 &&
    typeof c.jti === 'string' && /^[0-9a-f]{32}$/.test(c.jti) &&
    Number.isSafeInteger(c.iat) && c.iat <= now &&
    Number.isSafeInteger(c.exp) && c.exp > now && c.exp - c.iat <= 900 &&
    parseRequestedScopes(c.scope) !== null &&
    (c.gid === undefined || (typeof c.gid === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.gid)));
}
async function keyFor(secret: string): Promise<CryptoKey> {
  if (typeof secret !== 'string' || encoder.encode(secret).length < 32) throw new Error('Signing secret too short');
  return crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']);
}
export async function issueOAuthBearer(input: {
  issuer: string; audience: string; subject: string; clientId: string;
  scopes: readonly McpScope[]; nowSeconds: number; secret: string; grantId?: string;
}): Promise<string | null> {
  try {
    if (!Array.isArray(input.scopes) || !input.scopes.length) return null;
    const jti = Array.from(crypto.getRandomValues(new Uint8Array(16)), b=>b.toString(16).padStart(2,'0')).join('');
    const claims: OAuthBearerClaims = {
      iss:input.issuer,aud:input.audience,sub:input.subject,client_id:input.clientId,
      iat:input.nowSeconds,exp:input.nowSeconds+600,jti,scope:input.scopes.join(' '),
      ...(input.grantId ? { gid: input.grantId } : {}),
    };
    if (!validClaims(claims,input.nowSeconds)) return null;
    const key=await keyFor(input.secret);
    const payload=b64url(encoder.encode(JSON.stringify({alg:'HS256',typ:'at+jwt'})))+'.'+
      b64url(encoder.encode(JSON.stringify(claims)));
    const sig=await crypto.subtle.sign('HMAC',key,encoder.encode(payload));
    return payload+'.'+b64url(new Uint8Array(sig));
  } catch { return null; }
}
export async function verifyOAuthBearer(token: unknown, expected: {
  issuer: string; audience: string; nowSeconds: number; secret: string;
  isRevoked: (jti: string) => Promise<boolean>;
  /** Grant-level revocation. Tokens carrying a gid are rejected when this is missing (fail closed). */
  isGrantDead?: (grantId: string) => Promise<boolean>;
  /** Production MCP calls require a grant-bound token so owner/client revocation takes effect at once. */
  requireGrant?: boolean;
}): Promise<OAuthBearerClaims | null> {
  try {
    if (typeof token !== 'string' || token.length > 4096 ||
        !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return null;
    const parts=token.split('.');
    const header=decodeJson(parts[0]);
    if (!header || typeof header !== 'object' || Array.isArray(header) ||
        (header as Record<string,unknown>).alg !== 'HS256' ||
        (header as Record<string,unknown>).typ !== 'at+jwt' ||
        Object.keys(header).length !== 2) return null;
    const key=await keyFor(expected.secret);
    const signature=Buffer.from(parts[2],'base64url');
    // Node's base64url decoder accepts noncanonical trailing pad bits. Reject altered
    // encodings even when they decode to the very same signature bytes.
    if (signature.length!==32 || signature.toString('base64url')!==parts[2] ||
        !(await crypto.subtle.verify('HMAC',key,signature,encoder.encode(parts[0]+'.'+parts[1])))) return null;
    // Reject alternate base64url representations of the signed header/payload too.
    // A cryptographically valid signature must not authorize noncanonical encodings.
    if (Buffer.from(parts[0], 'base64url').toString('base64url') !== parts[0] ||
        Buffer.from(parts[1], 'base64url').toString('base64url') !== parts[1]) return null;
    const claims=decodeJson(parts[1]) as OAuthBearerClaims;
    if (!claims || typeof claims !== 'object' || Array.isArray(claims) ||
        !validClaims(claims,expected.nowSeconds) ||
        claims.iss!==expected.issuer || claims.aud!==expected.audience ||
        !Number.isSafeInteger(expected.nowSeconds) ||
        await expected.isRevoked(claims.jti)) return null;
    if (expected.requireGrant && !claims.gid) return null;
    if (claims.gid) {
      if (!expected.isGrantDead || await expected.isGrantDead(claims.gid)) return null;
    }
    return claims;
  } catch { return null; }
}

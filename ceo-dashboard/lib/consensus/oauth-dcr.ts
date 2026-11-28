import type { RegisteredClient } from './oauth-config';

/**
 * Stateless Dynamic Client Registration (RFC 7591), public clients only.
 *
 * Nothing is stored. The client_id itself carries the registered redirect URIs and an HMAC
 * signature made with the server secret, so a client_id can be verified later but never forged.
 * Analogy: a stamped ticket. The venue keeps no guest list; it only checks the stamp.
 *
 * Abuse resistance: redirect URIs must exactly match an allowlist of the official ChatGPT and
 * Claude callbacks. An attacker may register, but can only ever obtain a client whose redirect
 * goes to chatgpt.com or claude.ai, and every authorization still needs the owner's consent.
 */
const CLAUDE_CALLBACKS = new Set([
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback',
]);
const CHATGPT_FIXED = 'https://chatgpt.com/connector_platform_oauth_redirect';
const CHATGPT_PER_CONNECTOR = /^https:\/\/chatgpt\.com\/connector\/oauth\/[A-Za-z0-9_-]{1,128}$/;
const PREFIX = 'dcr1.';
const enc = new TextEncoder();

export function allowedDcrRedirect(uri: unknown): uri is string {
  return typeof uri === 'string' && uri.length <= 200 &&
    (CLAUDE_CALLBACKS.has(uri) || uri === CHATGPT_FIXED || CHATGPT_PER_CONNECTOR.test(uri));
}

const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', enc.encode('consensus-dcr:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export type DcrResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; error: 'invalid_client_metadata' | 'invalid_redirect_uri' };

/** Validates RFC 7591 metadata (JSON object) and returns the registration response. */
export async function registerClient(meta: unknown, secret: string): Promise<DcrResult> {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return { ok: false, error: 'invalid_client_metadata' };
  const m = meta as Record<string, unknown>;
  const uris = m.redirect_uris;
  if (!Array.isArray(uris) || uris.length < 1 || uris.length > 3) return { ok: false, error: 'invalid_redirect_uri' };
  if (!uris.every(allowedDcrRedirect) || new Set(uris).size !== uris.length) return { ok: false, error: 'invalid_redirect_uri' };
  // Public client only; reject anything that asks for a secret or an unsupported flow.
  const method = m.token_endpoint_auth_method;
  if (method !== undefined && method !== 'none') return { ok: false, error: 'invalid_client_metadata' };
  const grants = m.grant_types;
  if (grants !== undefined && (!Array.isArray(grants) || !grants.every(g => g === 'authorization_code' || g === 'refresh_token'))) return { ok: false, error: 'invalid_client_metadata' };
  const types = m.response_types;
  if (types !== undefined && (!Array.isArray(types) || !types.every(t => t === 'code'))) return { ok: false, error: 'invalid_client_metadata' };
  const rawName = typeof m.client_name === 'string' ? m.client_name : '';
  const name = rawName.replace(/[^\p{L}\p{N} ._()-]/gu, '').trim().slice(0, 40) || 'MCP client';
  const payload = b64url(enc.encode(JSON.stringify({ r: uris, n: name })));
  const clientId = PREFIX + payload + '.' + b64url(await hmac(secret, payload));
  if (clientId.length > 256) return { ok: false, error: 'invalid_redirect_uri' };
  return { ok: true, body: {
    client_id: clientId, client_name: name, redirect_uris: uris,
    token_endpoint_auth_method: 'none', grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'],
  } };
}

/** Verifies a dynamically issued client_id. Constant-structure check; null on any problem. */
export async function verifyDynamicClient(clientId: unknown, secret: string): Promise<RegisteredClient | null> {
  try {
    if (typeof clientId !== 'string' || !clientId.startsWith(PREFIX) || clientId.length > 256) return null;
    const parts = clientId.slice(PREFIX.length).split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expected = b64url(await hmac(secret, payload));
    if (expected.length !== sig.length) return null;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    if (diff !== 0) return null;
    const j = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { r?: unknown; n?: unknown };
    if (!Array.isArray(j.r) || j.r.length < 1 || !j.r.every(allowedDcrRedirect) || new Set(j.r).size !== j.r.length) return null;
    return { clientId, redirectUris: j.r as string[], name: typeof j.n === 'string' ? j.n : 'MCP client' };
  } catch { return null; }
}

/** Static clients plus the (verified) dynamic client named in this request, if any. */
export async function clientsFor(
  staticClients: readonly RegisteredClient[], clientId: string | null | undefined, secret: string, dcrEnabled: boolean,
): Promise<RegisteredClient[]> {
  if (!dcrEnabled || !clientId) return [...staticClients];
  const dyn = await verifyDynamicClient(clientId, secret);
  return dyn ? [...staticClients, dyn] : [...staticClients];
}

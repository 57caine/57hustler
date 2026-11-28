import { uniqueOAuthClient } from './oauth-contract';

/** Shared server-side OAuth configuration. Every flag defaults to disabled. */
export type RegisteredClient = { clientId: string; redirectUris: string[]; name: string };

export function oauthGatesOpen(env: Record<string, string | undefined>): boolean {
  return env.MCP_BRIDGE_ENABLED === 'true' &&
    env.CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED === 'true' &&
    env.CONSENSUS_OAUTH_AUTHORIZATION_ENABLED === 'true';
}

/** Returns null on any malformed configuration (fail closed). */
export function loadRegisteredClients(raw: string | undefined): RegisteredClient[] | null {
  try {
    const parsed: unknown = JSON.parse(raw || 'null');
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 20) return null;
    const out: RegisteredClient[] = [];
    for (const c of parsed) {
      if (!c || typeof c !== 'object') return null;
      const r = c as Record<string, unknown>;
      if (typeof r.clientId !== 'string' || !r.clientId.trim() || r.clientId.length > 256 ||
          !Array.isArray(r.redirectUris) || r.redirectUris.length === 0 ||
          !r.redirectUris.every(u => typeof u === 'string')) return null;
      const name = typeof r.name === 'string' && r.name.trim() ? r.name.slice(0, 80) : r.clientId;
      out.push({ clientId: r.clientId, redirectUris: r.redirectUris as string[], name });
    }
    return out;
  } catch { return null; }
}

export function findClient(clients: readonly RegisteredClient[], clientId: string) {
  return uniqueOAuthClient(clients, clientId);
}

/** Only same-site absolute paths may be used as post-login destinations. */
export function safeLocalPath(value: unknown, fallback = '/home'): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 4096) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') ||
      /[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}

/** Build the redirect back to a client, never reflecting an unregistered URI. */
export function clientRedirect(redirectUri: string, params: Record<string, string>): string {
  const u = new URL(redirectUri);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

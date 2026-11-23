import { loadRegisteredClients, oauthGatesOpen, type RegisteredClient } from './oauth-config';

/** Framework-free so it can be unit-tested without Next.js. */
export type OAuthRuntime = { clients: RegisteredClient[]; issuer: string; secret: string };
/** Returns null (=> 503) unless every gate and every required secret is present. */
export function loadRuntime(origin: string, env: Record<string, string | undefined> = process.env): OAuthRuntime | null {
  if (!oauthGatesOpen(env)) return null;
  const clients = loadRegisteredClients(env.CONSENSUS_OAUTH_CLIENTS);
  const issuer = env.CONSENSUS_OAUTH_ISSUER;
  const secret = env.CONSENSUS_OAUTH_SIGNING_SECRET;
  if (!clients || !issuer || issuer !== origin || !origin.startsWith('https://') ||
      !secret || secret.length < 32) return null;
  return { clients, issuer, secret };
}

import { loadRegisteredClients, oauthGatesOpen, type RegisteredClient } from './oauth-config';

/** Framework-free so it can be unit-tested without Next.js. */
export type OAuthRuntime = { clients: RegisteredClient[]; issuer: string; secret: string; dcr: boolean };
/** Returns null (=> 503) unless every gate and every required secret is present. */
export function loadRuntime(origin: string, env: Record<string, string | undefined> = process.env): OAuthRuntime | null {
  if (!oauthGatesOpen(env)) return null;
  // DCR is a fourth, separate gate (default off). With it on, static clients become optional.
  const dcr = env.CONSENSUS_OAUTH_DCR_ENABLED === 'true';
  const clients = env.CONSENSUS_OAUTH_CLIENTS ? loadRegisteredClients(env.CONSENSUS_OAUTH_CLIENTS) : (dcr ? [] : null);
  const issuer = env.CONSENSUS_OAUTH_ISSUER;
  const secret = env.CONSENSUS_OAUTH_SIGNING_SECRET;
  if (!clients || !issuer || issuer !== origin || !origin.startsWith('https://') ||
      !secret || secret.length < 32) return null;
  return { clients, issuer, secret, dcr };
}

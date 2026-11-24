import { createClient } from '@supabase/supabase-js';
import { createOAuthCodeStore, type OAuthCodeDatabase } from './oauth-code-store';
import { createRefreshStore, type RefreshDatabase } from './oauth-refresh';
import { createRevocationLookup, type RevocationDatabase } from './oauth-revocation-store';

/** Server-only wiring. The service-role key must never reach a browser or an MCP caller. */
export function serverDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  const db = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
  return {
    db,
    codes: createOAuthCodeStore(db as unknown as OAuthCodeDatabase),
    refresh: createRefreshStore(db as unknown as RefreshDatabase),
    isRevoked: createRevocationLookup(db as unknown as RevocationDatabase),
  };
}

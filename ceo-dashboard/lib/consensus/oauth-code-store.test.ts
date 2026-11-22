import { createOAuthCodeStore, type OAuthCodeDatabase } from './oauth-code-store';
import type { StoredAuthorizationCode } from './oauth-code-exchange';

function assert(ok: boolean, message: string) { if (!ok) throw new Error(message); }
const digest = 'a'.repeat(64);
const record: StoredAuthorizationCode = {
  clientId: 'client-1', redirectUri: 'https://client.example/callback',
  subject: '123e4567-e89b-42d3-a456-426614174000', challenge: 'a'.repeat(43),
  scopes: ['consensus.read'], consentedAtSeconds: 100, expiresAtSeconds: 200,
};
export async function testOAuthCodeStore(): Promise<string> {
  let inserted: Record<string, unknown> | null = null;
  let consumed = false;
  const db: OAuthCodeDatabase = {
    from: () => ({ insert: async row => { inserted = row; return { error: null }; } }),
    rpc: async (_name, args) => {
      assert(args.p_digest === digest, 'digest forwarded');
      if (consumed) return { data: [], error: null };
      consumed = true;
      return { data: [{
        client_id: record.clientId, redirect_uri: record.redirectUri, subject: record.subject,
        challenge: record.challenge, scopes: record.scopes,
        consented_at: new Date(100000).toISOString(), expires_at: new Date(200000).toISOString(),
      }], error: null };
    },
  };
  const store = createOAuthCodeStore(db);
  assert(await store.create(digest, record), 'insert accepted');
  assert(inserted !== null && (inserted as unknown as Record<string, unknown>).code_digest === digest, 'digest persisted');
  assert((inserted as unknown as Record<string, unknown>).code === undefined, 'raw code not persisted');
  assert(!(await store.create('invalid', record)), 'invalid digest rejected');
  assert((await store.consumeOnce(digest))?.subject === record.subject, 'atomic result mapped');
  assert((await store.consumeOnce(digest)) === null, 'replay rejected');
  assert((await store.consumeOnce('invalid')) === null, 'invalid consumption digest rejected');
  const failing: OAuthCodeDatabase = {
    from: () => ({ insert: async () => ({ error: { message: 'denied' } }) }),
    rpc: async () => ({ data: null, error: { message: 'denied' } }),
  };
  const denied = createOAuthCodeStore(failing);
  assert(!(await denied.create(digest, record)), 'storage error fails closed');
  assert((await denied.consumeOnce(digest)) === null, 'RPC error fails closed');
  return 'OAuth code storage adapter 8 checks passed';
}

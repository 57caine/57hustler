import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createOAuthCodeStore, type OAuthCodeDatabase } from '@/lib/consensus/oauth-code-store';
import { exchangeCodeForBearer } from '@/lib/consensus/oauth-token-flow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const noStore = { 'Cache-Control': 'no-store', Pragma: 'no-cache' };
function error(status: number, name: string) {
  return NextResponse.json({ error: name }, { status, headers: noStore });
}
/** No secret, OAuth code or access token is ever written to logs. */
export async function POST(request: NextRequest) {
  // All three gates must be enabled only after authorization and resource-server review.
  if (process.env.MCP_BRIDGE_ENABLED !== 'true' ||
      process.env.CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED !== 'true' ||
      process.env.CONSENSUS_OAUTH_AUTHORIZATION_ENABLED !== 'true') {
    return error(503, 'temporarily_unavailable');
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return error(403, 'invalid_request');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !==
      'application/x-www-form-urlencoded') return error(415, 'invalid_request');
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > 4096)) {
    return error(413, 'invalid_request');
  }
  let form: URLSearchParams;
  const reader = request.body?.getReader();
  if (!reader) return error(400, 'invalid_request');
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > 4096) {
        await reader.cancel().catch(() => undefined);
        return error(413, 'invalid_request');
      }
      chunks.push(value);
    }
    const body = Buffer.concat(chunks.map(c => Buffer.from(c))).toString('utf8');
    form = new URLSearchParams(body);
  } catch { return error(400, 'invalid_request'); }
  finally { reader.releaseLock(); }
  const allowed = ['grant_type', 'code', 'redirect_uri', 'client_id', 'code_verifier'];
  if (Array.from(form.keys()).some(k => !allowed.includes(k)) ||
      allowed.some(k => form.getAll(k).length > 1) ||
      form.get('grant_type') !== 'authorization_code') return error(400, 'invalid_request');
  const code = form.get('code'), clientId = form.get('client_id');
  const redirectUri = form.get('redirect_uri'), verifier = form.get('code_verifier');
  if (!code || !clientId || !redirectUri || !verifier) return error(400, 'invalid_request');

  // Only pre-registered public clients; no unrestricted dynamic registration.
  let clients: Array<{ clientId: string; redirectUris: string[] }>;
  try {
    const parsed: unknown = JSON.parse(process.env.CONSENSUS_OAUTH_CLIENTS || 'null');
    if (!Array.isArray(parsed) || !parsed.every(c => c && typeof c === 'object' &&
        typeof c.clientId === 'string' && Array.isArray(c.redirectUris) &&
        c.redirectUris.every((u: unknown) => typeof u === 'string'))) {
      return error(503, 'temporarily_unavailable');
    }
    clients = parsed;
  } catch { return error(503, 'temporarily_unavailable'); }
  const registered = clients.find(c => c.clientId === clientId)?.redirectUris;
  if (!registered) return error(400, 'invalid_client');

  const issuer = process.env.CONSENSUS_OAUTH_ISSUER;
  const signingSecret = process.env.CONSENSUS_OAUTH_SIGNING_SECRET;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!issuer || issuer !== request.nextUrl.origin || !signingSecret || !url || !serviceRole) {
    return error(503, 'temporarily_unavailable');
  }
  // Server-only client: the SQL consume function must be deployed with strict grants.
  const database = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as OAuthCodeDatabase;
  const accessToken = await exchangeCodeForBearer({
    code, verifier, clientId, redirectUri,
    registeredRedirects: registered,
    nowSeconds: Math.floor(Date.now() / 1000),
    issuer, audience: issuer + '/api/consensus/mcp', signingSecret,
  }, createOAuthCodeStore(database));
  if (!accessToken) return error(400, 'invalid_grant');
  return NextResponse.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 600,
    // Reflect the scopes from the locally issued, signed bearer token.
    scope: (JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64url').toString('utf8')) as { scope: string }).scope,
  }, { headers: noStore });
}

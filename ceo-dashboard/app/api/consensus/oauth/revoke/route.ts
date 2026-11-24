import { NextRequest, NextResponse } from 'next/server';
import { handleRevokeRequest } from '@/lib/consensus/oauth-token-endpoint';
import { loadRuntime, clientIp, jsonError, noStore, oauthLimiter, preflightFormEndpoint, readBoundedForm, requestOrigin } from '@/lib/consensus/oauth-http';
import { serverDatabase } from '@/lib/consensus/oauth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** RFC 7009 token revocation for registered public clients. */
export async function POST(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return jsonError(503, 'temporarily_unavailable');
  if (!oauthLimiter.allow('revoke:' + clientIp(request.headers), Date.now())) return jsonError(429, 'rate_limited');
  const bad = preflightFormEndpoint(request, 8192);
  if (bad) return bad;
  const form = await readBoundedForm(request, 8192);
  if (form === 'too_large') return jsonError(413, 'invalid_request');
  if (form === 'invalid') return jsonError(400, 'invalid_request');
  const server = serverDatabase();
  if (!server) return jsonError(503, 'temporarily_unavailable');
  const result = await handleRevokeRequest(form, {
    clients: rt.clients, issuer: rt.issuer, signingSecret: rt.secret,
    nowSeconds: Math.floor(Date.now() / 1000), refresh: server.refresh,
  });
  return NextResponse.json(result.body, { status: result.status, headers: noStore });
}

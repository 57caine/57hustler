import { clientsFor } from '@/lib/consensus/oauth-dcr';
import { NextRequest, NextResponse } from 'next/server';
import { handleTokenRequest } from '@/lib/consensus/oauth-token-endpoint';
import { loadRuntime, clientIp, jsonError, noStore, allowRequest, preflightFormEndpoint, readBoundedForm, requestOrigin } from '@/lib/consensus/oauth-http';
import { serverDatabase } from '@/lib/consensus/oauth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * authorization_code and refresh_token grants. No secret, code or token is ever logged.
 * All three env gates must be enabled, and every one defaults to disabled.
 */
export async function POST(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return jsonError(503, 'temporarily_unavailable');
  if (!(await allowRequest('token:' + clientIp(request.headers)))) return jsonError(429, 'rate_limited');
  const bad = preflightFormEndpoint(request, 4096);
  if (bad) return bad;
  const form = await readBoundedForm(request, 4096);
  if (form === 'too_large') return jsonError(413, 'invalid_request');
  if (form === 'invalid') return jsonError(400, 'invalid_request');
  const server = serverDatabase();
  if (!server) return jsonError(503, 'temporarily_unavailable');
  const result = await handleTokenRequest(form, {
    clients: await clientsFor(rt.clients, form.get('client_id'), rt.secret, rt.dcr), issuer: rt.issuer, signingSecret: rt.secret,
    nowSeconds: Math.floor(Date.now() / 1000), codes: server.codes, refresh: server.refresh,
  });
  return NextResponse.json(result.body, { status: result.status, headers: noStore });
}

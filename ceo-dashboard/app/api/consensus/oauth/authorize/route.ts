import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { parseAuthorizationRequest } from '@/lib/consensus/oauth-authorization-request';
import { clientIp, jsonError, loadRuntime, noStore, oauthLimiter, requestOrigin } from '@/lib/consensus/oauth-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Authorization endpoint (RFC 6749 4.1 + PKCE). Validates the request strictly, requires
 * an authenticated owner session, then hands off to the consent screen. It never issues a
 * code itself and never redirects to an unvalidated redirect_uri.
 */
export async function GET(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return jsonError(503, 'temporarily_unavailable');
  if (!oauthLimiter.allow('authorize:' + clientIp(request.headers), Date.now())) return jsonError(429, 'rate_limited');
  const parsed = parseAuthorizationRequest(request.nextUrl.searchParams, rt.clients, rt.issuer + '/api/consensus/mcp');
  if (!parsed) return jsonError(400, 'invalid_request');
  const user = await getCurrentUser();
  if (!user) {
    // Defense in depth: the proxy normally redirects first; preserve the full request.
    const login = new URL('/login', requestOrigin(request));
    login.searchParams.set('redirectedFrom', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(login, { status: 302, headers: noStore });
  }
  const consent = new URL('/consensus/oauth/consent', requestOrigin(request));
  consent.search = request.nextUrl.search;
  return NextResponse.redirect(consent, { status: 302, headers: noStore });
}

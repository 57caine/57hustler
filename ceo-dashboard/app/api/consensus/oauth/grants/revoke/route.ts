import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { verifyConsentCsrf } from '@/lib/consensus/oauth-csrf';
import { validGrantId } from '@/lib/consensus/oauth-refresh';
import { loadRuntime, jsonError, noStore, oauthLimiter, readBoundedForm, requestOrigin } from '@/lib/consensus/oauth-http';
import { serverDatabase } from '@/lib/consensus/oauth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Owner-operated revocation. Subject comes ONLY from the verified session; the grant must be theirs. */
export async function POST(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return jsonError(503, 'temporarily_unavailable');
  if (request.headers.get('origin') !== requestOrigin(request)) return jsonError(403, 'invalid_request');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') return jsonError(415, 'invalid_request');
  const user = await getCurrentUser();
  if (!user) return jsonError(401, 'login_required');
  if (!oauthLimiter.allow('grant-revoke:' + user.id, Date.now())) return jsonError(429, 'rate_limited');
  const form = await readBoundedForm(request, 2048);
  if (form === 'too_large') return jsonError(413, 'invalid_request');
  if (form === 'invalid') return jsonError(400, 'invalid_request');
  if (Array.from(form.keys()).some(k => k !== 'grant_id' && k !== 'csrf') ||
      form.getAll('grant_id').length !== 1 || form.getAll('csrf').length !== 1) return jsonError(400, 'invalid_request');
  const grantId = form.get('grant_id');
  if (!validGrantId(grantId)) return jsonError(400, 'invalid_request');
  const ok = await verifyConsentCsrf({
    secret: rt.secret, subject: user.id, query: new URLSearchParams({ revoke_grant: grantId }),
    nowSeconds: Math.floor(Date.now() / 1000), token: form.get('csrf'),
  });
  if (!ok) return jsonError(403, 'invalid_request');
  const server = serverDatabase();
  if (!server) return jsonError(503, 'temporarily_unavailable');
  try { await server.refresh.revokeGrant(grantId, 'owner', { subject: user.id }); }
  catch { return jsonError(503, 'temporarily_unavailable'); }
  // Idempotent and non-revealing: same answer whether or not a grant was changed.
  return NextResponse.redirect(new URL('/consensus/oauth/grants', requestOrigin(request)), { status: 303, headers: noStore });
}

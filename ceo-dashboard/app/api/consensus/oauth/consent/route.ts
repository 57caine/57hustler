import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/supabase/auth';
import { decideConsent } from '@/lib/consensus/oauth-authorize-flow';
import { createConsentCodeWriter, type ConsentIssueDatabase } from '@/lib/consensus/oauth-consent-store';
import { clientIp, jsonError, loadRuntime, noStore, oauthLimiter, requestOrigin } from '@/lib/consensus/oauth-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Consent submission. Subject comes ONLY from the verified server session. */
export async function POST(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return jsonError(503, 'temporarily_unavailable');
  // A cross-site form post must fail: Origin is mandatory and must match exactly.
  if (request.headers.get('origin') !== requestOrigin(request)) return jsonError(403, 'invalid_request');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') {
    return jsonError(415, 'invalid_request');
  }
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > 16384)) return jsonError(413, 'invalid_request');
  const user = await getCurrentUser();
  if (!user) return jsonError(401, 'login_required');
  if (!oauthLimiter.allow('consent:' + user.id, Date.now())) return jsonError(429, 'rate_limited');
  let form: URLSearchParams;
  try {
    const text = await request.text();
    if (text.length > 16384) return jsonError(413, 'invalid_request');
    form = new URLSearchParams(text);
  } catch { return jsonError(400, 'invalid_request'); }
  const allowed = ['authorization_query', 'csrf', 'decision'];
  if (Array.from(form.keys()).some(k => !allowed.includes(k)) || allowed.some(k => form.getAll(k).length !== 1)) {
    return jsonError(400, 'invalid_request');
  }
  const decision = form.get('decision');
  if (decision !== 'approve' && decision !== 'deny') return jsonError(400, 'invalid_request');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return jsonError(503, 'temporarily_unavailable');
  const db = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
  const result = await decideConsent({
    query: new URLSearchParams(form.get('authorization_query') ?? ''), clients: rt.clients,
    subject: user.id, secret: rt.secret, csrfToken: form.get('csrf'),
    approve: decision === 'approve', nowSeconds: Math.floor(Date.now() / 1000),
    expectedResource: rt.issuer + '/api/consensus/mcp', issuer: rt.issuer,
    writer: createConsentCodeWriter(db as unknown as ConsentIssueDatabase),
  });
  if (result.kind === 'error') return jsonError(result.status, result.reason);
  return NextResponse.redirect(result.location, { status: 303, headers: noStore });
}

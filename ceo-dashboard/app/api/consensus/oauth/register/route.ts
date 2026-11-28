import { NextRequest, NextResponse } from 'next/server';
import { registerClient } from '@/lib/consensus/oauth-dcr';
import { loadRuntime, clientIp, jsonError, noStore, allowRequest, requestOrigin } from '@/lib/consensus/oauth-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** RFC 7591 Dynamic Client Registration (stateless, public clients, official callbacks only). Off unless CONSENSUS_OAUTH_DCR_ENABLED=true. */
export async function POST(request: NextRequest) {
  const rt = loadRuntime(requestOrigin(request));
  if (!rt || !rt.dcr) return jsonError(503, 'temporarily_unavailable');
  if (!(await allowRequest('register:' + clientIp(request.headers)))) return jsonError(429, 'rate_limited');
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return jsonError(415, 'invalid_client_metadata');
  const text = await request.text();
  if (text.length > 4096) return jsonError(413, 'invalid_client_metadata');
  let meta: unknown;
  try { meta = JSON.parse(text); } catch { return jsonError(400, 'invalid_client_metadata'); }
  const r = await registerClient(meta, rt.secret);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400, headers: noStore });
  return NextResponse.json(r.body, { status: 201, headers: noStore });
}

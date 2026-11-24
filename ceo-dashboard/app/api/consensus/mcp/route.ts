import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PROTOCOL_VERSION, TOOLS, parseRpc, rpcOk, rpcError, parseToolCallParams } from '@/lib/consensus/mcp-contract';
import { parseRequestedScopes, scopesPermit } from '@/lib/consensus/oauth-contract';
import { verifyOAuthBearer } from '@/lib/consensus/oauth-bearer';
import { createRevocationLookup, type RevocationDatabase } from '@/lib/consensus/oauth-revocation-store';
import { createRefreshStore, type RefreshDatabase } from '@/lib/consensus/oauth-refresh';
import { createSupabaseConsensusStore } from '@/lib/consensus/mcp-store';
import { runTool } from '@/lib/consensus/mcp-tools';
import { clientIp, loadRuntime, allowRequest, requestOrigin } from '@/lib/consensus/oauth-http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const heads = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
function respond(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: heads }); }
const fail = (status: number, message: string) => respond({ error: message }, status);
export async function GET() { return fail(405, 'MCP uses POST; SSE not enabled'); }
export async function DELETE() { return fail(405, 'Stateless MCP: no session to delete'); }

/** RFC 9728 / MCP authorization: tell the client where to discover the authorization server. */
function unauthorized(origin: string, error: 'invalid_token' | null) {
  const meta = `resource_metadata="${origin}/.well-known/oauth-protected-resource"`;
  return NextResponse.json({ error: error ?? 'unauthorized' }, {
    status: 401,
    headers: { ...heads, 'WWW-Authenticate': `Bearer ${meta}${error ? `, error="${error}"` : ''}` },
  });
}

export async function POST(request: NextRequest) {
  // Default OFF. All three gates plus issuer/secret/client config must be present.
  const rt = loadRuntime(requestOrigin(request));
  if (!rt) return fail(503, 'MCP connector is disabled pending authorization review');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return fail(503, 'Storage unavailable');

  const origin = request.headers.get('origin');
  if (origin && origin !== requestOrigin(request)) return fail(403, 'Origin not allowed');
  const declaredLength = request.headers.get('content-length');
  if (declaredLength !== null) {
    const bytes = Number(declaredLength);
    if (!Number.isSafeInteger(bytes) || bytes < 0) return fail(400, 'Invalid Content-Length');
    if (bytes > 24000) return fail(413, 'Request too large');
  }
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') return fail(415, 'JSON required');

  // Rate limit before any cryptographic or database work (per IP; per-subject below).
  if (!(await allowRequest('ip:' + clientIp(request.headers), 'mcp'))) return fail(429, 'Rate limit exceeded');

  const db = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
  const auth = request.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(auth)) return unauthorized(rt.issuer, null);
  let claims;
  try {
    claims = await verifyOAuthBearer(auth.slice(7), {
      issuer: rt.issuer, audience: rt.issuer + '/api/consensus/mcp', nowSeconds: Math.floor(Date.now() / 1000),
      secret: rt.secret, isRevoked: createRevocationLookup(db as unknown as RevocationDatabase),
      // Owner/client revocation and refresh-reuse detection take effect on the very next call.
      isGrantDead: createRefreshStore(db as unknown as RefreshDatabase).grantIsDead, requireGrant: true,
    });
  } catch { return fail(503, 'Authorization backend unavailable'); } // revocation lookup failure => deny
  if (!claims) return unauthorized(rt.issuer, 'invalid_token');
  const granted = parseRequestedScopes(claims.scope);
  if (!granted) return unauthorized(rt.issuer, 'invalid_token');
  if (!(await allowRequest('sub:' + claims.sub, 'mcp'))) return fail(429, 'Rate limit exceeded');

  const reader = request.body?.getReader();
  if (!reader) return fail(400, 'Request body required');
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > 24000) { await reader.cancel().catch(() => undefined); return fail(413, 'Request too large'); }
      chunks.push(value);
    }
  } catch { return fail(400, 'Cannot read request body'); } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { bytes.set(c, offset); offset += c.byteLength; }
  let payload: unknown;
  try { payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { return respond(rpcError(null, -32700, 'Parse error')); }
  const rpc = parseRpc(payload);
  if (!rpc) return respond(rpcError(null, -32600, 'Invalid Request'));
  if (rpc.id === undefined) return new NextResponse(null, { status: 202, headers: { 'Cache-Control': 'no-store' } });
  if (rpc.method === 'initialize') return respond(rpcOk(rpc.id, {
    protocolVersion: PROTOCOL_VERSION, capabilities: { tools: { listChanged: false } },
    serverInfo: { name: '57hustler-consensus', version: '0.1.0' },
    instructions: 'This shared workspace stores questions and user-supplied answers only. It does not automatically call GPT, Claude, or Gemini.',
  }));
  if (rpc.method === 'ping') return respond(rpcOk(rpc.id, {}));
  if (rpc.method === 'tools/list') return respond(rpcOk(rpc.id, { tools: TOOLS }));
  if (rpc.method !== 'tools/call') return respond(rpcError(rpc.id, -32601, 'Method not found'));
  const p = parseToolCallParams(rpc.params);
  if (!p) return respond(rpcError(rpc.id, -32602, 'Invalid tool-call params'));
  // Least privilege: a read-only token can never reach a write tool.
  if (!scopesPermit(granted, p.name)) {
    return NextResponse.json({ error: 'insufficient_scope' }, {
      status: 403,
      headers: { ...heads, 'WWW-Authenticate': `Bearer error="insufficient_scope", resource_metadata="${rt.issuer}/.well-known/oauth-protected-resource"` },
    });
  }
  return respond(await runTool(createSupabaseConsensusStore(db), claims.sub, rpc.id, p.name, p.arguments));
}

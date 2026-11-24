import { NextRequest, NextResponse } from 'next/server';
import { requestOrigin } from '@/lib/consensus/oauth-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * RFC 9728 OAuth Protected Resource Metadata for remote MCP clients.
 * This is discovery only, not authorization or proof of connection.
 * Keep the entire surface closed until owner-approved deployment.
 */
export async function GET(request: NextRequest) {
  if (process.env.MCP_BRIDGE_ENABLED !== 'true' ||
      process.env.CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED !== 'true') {
    return NextResponse.json({ error: 'temporarily_unavailable' }, {
      status: 503, headers: { 'Cache-Control': 'no-store' },
    });
  }
  const issuer = process.env.CONSENSUS_OAUTH_ISSUER;
  const origin = requestOrigin(request);
  if (!issuer || issuer !== origin || !origin.startsWith('https://')) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, {
      status: 503, headers: { 'Cache-Control': 'no-store' },
    });
  }
  return NextResponse.json({
    resource: origin + '/api/consensus/mcp',
    authorization_servers: [issuer],
    scopes_supported: ['consensus.read', 'consensus.write'],
    bearer_methods_supported: ['header'],
  }, { headers: { 'Cache-Control': 'no-store' } });
}

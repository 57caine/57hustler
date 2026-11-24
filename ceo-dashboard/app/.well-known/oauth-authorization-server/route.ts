import { NextRequest, NextResponse } from 'next/server';
import { requestOrigin } from '@/lib/consensus/oauth-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * RFC 8414 metadata. Discovery does not imply that user consent or
 * authorization-code issuance is operational. Keep the route gated until
 * authorization, revocation and MCP resource validation pass security review.
 */
export async function GET(request: NextRequest) {
  const origin = requestOrigin(request);
  const issuer = process.env.CONSENSUS_OAUTH_ISSUER;
  const enabled = process.env.MCP_BRIDGE_ENABLED === 'true' &&
    process.env.CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED === 'true' &&
    process.env.CONSENSUS_OAUTH_AUTHORIZATION_ENABLED === 'true';
  if (!enabled || !origin.startsWith('https://') || issuer !== origin) {
    return NextResponse.json({error:'temporarily_unavailable'},{
      status:503,headers:{'Cache-Control':'no-store'},
    });
  }
  return NextResponse.json({
    issuer,
    authorization_endpoint: origin + '/api/consensus/oauth/authorize',
    token_endpoint: origin + '/api/consensus/oauth/token',
    response_types_supported: ['code'],
    // RFC 9207: every authorization response carries `iss`; ChatGPT then uses its stable redirect URI.
    authorization_response_iss_parameter_supported: true,
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    revocation_endpoint: origin + '/api/consensus/oauth/revoke',
    revocation_endpoint_auth_methods_supported: ['none'],
    ...(process.env.CONSENSUS_OAUTH_DCR_ENABLED === 'true' ? { registration_endpoint: origin + '/api/consensus/oauth/register' } : {}),
    scopes_supported: ['consensus.read','consensus.write'],
  },{headers:{'Cache-Control':'no-store'}});
}

import { exactRegisteredRedirect, parseRequestedScopes, validOAuthState, validPkceChallenge, type McpScope } from './oauth-contract';

/** Pure, fail-closed preflight. Never creates consent or a code; owner authentication
 * and a CSRF-bound, explicit approval are mandatory before issuance. */
export type AuthorizationRequest = {
  clientId: string; redirectUri: string; state: string;
  codeChallenge: string; scopes: McpScope[];
};
export function parseAuthorizationRequest(
  params: URLSearchParams,
  clients: ReadonlyArray<{ clientId: string; redirectUris: readonly string[] }>,
): AuthorizationRequest | null {
  const keys = ['response_type','client_id','redirect_uri','state','code_challenge','code_challenge_method','scope'];
  if (Array.from(params.keys()).some(k => !keys.includes(k)) ||
      keys.some(k => params.getAll(k).length !== 1) ||
      params.get('response_type') !== 'code' ||
      params.get('code_challenge_method') !== 'S256') return null;
  const clientId = params.get('client_id')!;
  const redirectUri = params.get('redirect_uri')!;
  const state = params.get('state')!;
  const codeChallenge = params.get('code_challenge')!;
  const scopes = parseRequestedScopes(params.get('scope'));
  // Ambiguous registration must fail closed; never let configuration order select a client.
  const matches = clients.filter(c => c.clientId === clientId);
  if (matches.length !== 1 || !Array.isArray(matches[0].redirectUris) ||
      new Set(matches[0].redirectUris).size !== matches[0].redirectUris.length) return null;
  const client = matches[0];
  if (!exactRegisteredRedirect(redirectUri,client.redirectUris) ||
      !validOAuthState(state) || !validPkceChallenge('S256',codeChallenge) ||
      !scopes || scopes.length === 0) return null;
  return { clientId,redirectUri,state,codeChallenge,scopes };
}

import { approveAuthorizationRequest } from './oauth-consent-binding';
import { parseAuthorizationRequest } from './oauth-authorization-request';
function assert(ok: unknown, label: string): asserts ok { if (!ok) throw new Error(label); }
export function testOAuthConsentBinding(): string {
  const redirectUri='https://client.example/callback';
  const clients=[{clientId:'chatgpt',redirectUris:[redirectUri]}];
  const query=new URLSearchParams({
    response_type:'code',client_id:'chatgpt',redirect_uri:redirectUri,
    state:'1234567890abcdef',code_challenge:'a'.repeat(43),
    code_challenge_method:'S256',scope:'consensus.read',
  });
  const displayed=parseAuthorizationRequest(query,clients)!;
  const input={originalQuery:query,clients,displayed,authenticatedSubject:'owner-123',
    csrfVerified:true,explicitApproval:true,nowSeconds:1000};
  const approved=approveAuthorizationRequest(input);
  assert(approved?.subject==='owner-123','authenticated subject used');
  assert(approved?.expiresAtSeconds===1300,'short code lifetime');
  assert(approved?.scopes.join(' ')==='consensus.read','exact scope');
  assert(approveAuthorizationRequest({...input,csrfVerified:false})===null,'csrf rejection');
  assert(approveAuthorizationRequest({...input,explicitApproval:false})===null,'denial rejection');
  assert(approveAuthorizationRequest({...input,authenticatedSubject:''})===null,'anonymous rejection');
  assert(approveAuthorizationRequest({...input,nowSeconds:NaN})===null,'invalid time rejection');
  assert(approveAuthorizationRequest({...input,displayed:{...displayed,clientId:'attacker'}})===null,'client substitution');
  assert(approveAuthorizationRequest({...input,displayed:{...displayed,redirectUri:'https://evil.example/'}})===null,'redirect substitution');
  assert(approveAuthorizationRequest({...input,displayed:{...displayed,state:'different'}})===null,'state substitution');
  assert(approveAuthorizationRequest({...input,displayed:{...displayed,codeChallenge:'b'.repeat(43)}})===null,'PKCE substitution');
  assert(approveAuthorizationRequest({...input,displayed:{...displayed,scopes:['consensus.write']}})===null,'scope escalation');
  const mutated=new URLSearchParams(query);
  mutated.set('redirect_uri','https://evil.example/');
  assert(approveAuthorizationRequest({...input,originalQuery:mutated})===null,'changed request');
  return 'OAuth consent binding 13 checks passed';
}

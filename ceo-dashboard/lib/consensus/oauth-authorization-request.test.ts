import { parseAuthorizationRequest } from './oauth-authorization-request';
import { uniqueOAuthClient } from './oauth-contract';
function assert(ok: unknown, why: string): asserts ok { if (!ok) throw new Error(why); }
export function testAuthorizationRequest(): string {
  const redirect='https://client.example/callback';
  const clients=[{clientId:'chatgpt',redirectUris:[redirect]}];
  const base=new URLSearchParams({
    response_type:'code',client_id:'chatgpt',redirect_uri:redirect,
    state:'1234567890abcdef',code_challenge:'a'.repeat(43),
    code_challenge_method:'S256',scope:'consensus.read consensus.write',
  });
  assert(parseAuthorizationRequest(base,clients)?.scopes.length===2,'valid request');
  const rejected: Array<[string,(p:URLSearchParams)=>void]>=[
    ['duplicate client',p=>p.append('client_id','chatgpt')],
    ['unregistered redirect',p=>p.set('redirect_uri','https://attacker.example/')],
    ['fragment redirect',p=>p.set('redirect_uri',redirect+'#token')],
    ['missing state',p=>p.delete('state')],
    ['short state',p=>p.set('state','short')],
    ['plain PKCE',p=>p.set('code_challenge_method','plain')],
    ['short challenge',p=>p.set('code_challenge','short')],
    ['unknown scope',p=>p.set('scope','consensus.admin')],
    ['duplicate scope',p=>p.set('scope','consensus.read consensus.read')],
    ['implicit grant',p=>p.set('response_type','token')],
    ['unknown parameter',p=>p.set('owner_id','attacker')],
    ['unknown client',p=>p.set('client_id','other')],
  ];
  for (const [label,mutate] of rejected) {
    const p=new URLSearchParams(base);
    mutate(p);
    assert(parseAuthorizationRequest(p,clients)===null,label);
  }
  assert(parseAuthorizationRequest(base,[...clients,...clients])===null,'duplicate registered client rejected');
  assert(parseAuthorizationRequest(base,[{clientId:'chatgpt',redirectUris:[redirect,redirect]}])===null,
    'duplicate registered redirect rejected');
  assert(parseAuthorizationRequest(base,[{clientId:'other',redirectUris:[redirect]},...clients])?.clientId==='chatgpt',
    'unrelated registered client permitted');
  assert(uniqueOAuthClient(clients,'chatgpt')?.clientId==='chatgpt','token client lookup valid');
  assert(uniqueOAuthClient([...clients,...clients],'chatgpt')===null,'token duplicate client rejected');
  assert(uniqueOAuthClient([{clientId:'chatgpt',redirectUris:[redirect,redirect]}],'chatgpt')===null,
    'token duplicate redirect rejected');
  assert(uniqueOAuthClient([{clientId:'chatgpt',redirectUris:[]}],'chatgpt')===null,
    'token empty redirect registration rejected');
  assert(uniqueOAuthClient(clients,'unknown')===null,'token unknown client rejected');
  return 'OAuth authorization request and token client registration 21 checks passed';
}

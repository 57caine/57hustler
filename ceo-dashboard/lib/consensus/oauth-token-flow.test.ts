import { exchangeCodeForBearer } from './oauth-token-flow';
import { verifyOAuthBearer } from './oauth-bearer';
import type { AtomicCodeStore, StoredAuthorizationCode } from './oauth-code-exchange';

function check(value: unknown, label: string): asserts value { if (!value) throw new Error(label); }
export async function testOAuthTokenFlow(): Promise<string> {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
  const challenge = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';
  const record: StoredAuthorizationCode = {
    clientId:'chatgpt-client',redirectUri:'https://client.example/callback',
    subject:'verified-owner-123',challenge,scopes:['consensus.read'],
    consentedAtSeconds:1000,expiresAtSeconds:1300,
  };
  const opts={code:'a'.repeat(64),verifier,clientId:record.clientId,
    redirectUri:record.redirectUri,nowSeconds:1100,issuer:'https://issuer.example',
    audience:'consensus-mcp',signingSecret:'x'.repeat(48),
    registeredRedirects:[record.redirectUri]};
  let calls=0;
  const store: AtomicCodeStore = {consumeOnce:async()=>{calls++;return calls===1?record:null;}};
  const token=await exchangeCodeForBearer(opts,store);
  check(token,'issued from consumed code');
  const verified=await verifyOAuthBearer(token,{issuer:opts.issuer,audience:opts.audience,
    nowSeconds:1100,secret:opts.signingSecret,isRevoked:async()=>false});
  check(verified?.sub===record.subject,'subject derived from approved code, not browser input');
  check(verified.scope==='consensus.read','consent scopes preserved');
  check((await exchangeCodeForBearer(opts,store))===null,'code replay rejected');
  check(calls===2,'atomic consumption on valid requests');
  const denied: AtomicCodeStore={consumeOnce:async()=>{throw new Error('unavailable')}};
  check((await exchangeCodeForBearer(opts,denied))===null,'storage outage fails closed');
  const before=calls;
  check((await exchangeCodeForBearer({...opts,verifier:'short'},store))===null,'malformed PKCE rejected before storage');
  check((await exchangeCodeForBearer({...opts,redirectUri:'https://attacker.example/'},store))===null,'unregistered redirect rejected');
  check(calls===before,'invalid preflight does not consume code');
  const other: AtomicCodeStore={consumeOnce:async()=>({...record,clientId:'other'})};
  check((await exchangeCodeForBearer(opts,other))===null,'other OAuth client rejected');
  const badVerifier: AtomicCodeStore={consumeOnce:async()=>({...record,challenge:'a'.repeat(43)})};
  check((await exchangeCodeForBearer(opts,badVerifier))===null,'PKCE challenge mismatch rejected');
  return 'OAuth full token exchange 10 checks passed';
}

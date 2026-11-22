import { authorizationCodeDigest, exchangeAuthorizationCode, type StoredAuthorizationCode } from './oauth-code-exchange';
function assert(ok: unknown, message: string) { if (!ok) throw new Error(message); }
export async function testOAuthCodeExchange() {
 const verifier='dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
 const code='0123456789abcdef0123456789abcdef0123456789abcdef';
 const digest=await authorizationCodeDigest(code);
 const record:StoredAuthorizationCode={clientId:'client-a',redirectUri:'https://client.example/callback',subject:'owner-a',challenge:'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',scopes:['consensus.read'],expiresAtSeconds:200,consentedAtSeconds:100};
 const base={code,verifier,clientId:'client-a',redirectUri:record.redirectUri,subject:'owner-a',nowSeconds:150,registeredRedirects:[record.redirectUri]};
 const makeStore=(saved:StoredAuthorizationCode)=>{let used=false;return {consumeOnce:async (d:string)=>{if(used||d!==digest)return null;used=true;return saved;}}};
 const store=makeStore(record);
 assert((await exchangeAuthorizationCode(base,store))?.subject==='owner-a','valid exchange');
 assert(await exchangeAuthorizationCode(base,store)===null,'replay denied');
 assert(await exchangeAuthorizationCode({...base,subject:'owner-b'},makeStore(record))===null,'other subject denied');
 assert(await exchangeAuthorizationCode({...base,clientId:'client-b'},makeStore(record))===null,'other client denied');
 assert(await exchangeAuthorizationCode({...base,redirectUri:'https://evil.example/callback'},makeStore(record))===null,'redirect mismatch denied');
 assert(await exchangeAuthorizationCode({...base,verifier:'x'.repeat(43)},makeStore(record))===null,'wrong PKCE denied');
 assert(await exchangeAuthorizationCode({...base,nowSeconds:200},makeStore(record))===null,'expired denied');
 assert(await exchangeAuthorizationCode(base,makeStore({...record,consentedAtSeconds:151}))===null,'future consent denied');
 assert(await exchangeAuthorizationCode(base,makeStore({...record,scopes:['consensus.read','consensus.read']}))===null,'duplicate scopes denied');
 assert(await exchangeAuthorizationCode({...base,code:'bad'},makeStore(record))===null,'short code denied');
 return 'OAuth code exchange 10 checks passed (mock atomic store only)';
}

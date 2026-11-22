import { issueAuthorizationCode, type ApprovedConsent } from './oauth-code-issuance';
import { authorizationCodeDigest } from './oauth-code-exchange';
function assert(v: unknown, message: string) { if (!v) throw new Error(message); }
export async function testOAuthCodeIssuance() {
 const consent: ApprovedConsent = {subject:'owner-a',clientId:'client-a',redirectUri:'https://client.example/callback',scopes:['consensus.read'],challenge:'a'.repeat(43),approvedAtSeconds:100,expiresAtSeconds:200};
 const redirects=[consent.redirectUri];
 let savedDigest=''; let savedRecord: unknown;
 const store={create:async(digest:string,record:unknown)=>{savedDigest=digest;savedRecord=record;return true;}};
 const code=await issueAuthorizationCode(consent,redirects,store,150);
 assert(typeof code==='string' && /^[a-f0-9]{64}$/.test(code),'CSPRNG code format');
 assert(savedDigest===await authorizationCodeDigest(code!), 'persist digest only');
 assert((savedRecord as {subject:string}).subject==='owner-a','consent persisted');
 assert((await issueAuthorizationCode(consent,redirects,store,150))!==code,'codes unique');
 assert(await issueAuthorizationCode({...consent,scopes:[]},redirects,store,150)===null,'empty scopes denied');
 assert(await issueAuthorizationCode({...consent,scopes:['consensus.read','consensus.read']},redirects,store,150)===null,'duplicate scopes denied');
 assert(await issueAuthorizationCode({...consent,approvedAtSeconds:151},redirects,store,150)===null,'future consent denied');
 assert(await issueAuthorizationCode({...consent,expiresAtSeconds:150},redirects,store,150)===null,'expired consent denied');
 assert(await issueAuthorizationCode({...consent,expiresAtSeconds:751},redirects,store,150)===null,'overlong lifetime denied');
 assert(await issueAuthorizationCode({...consent,redirectUri:'https://evil.example'},redirects,store,150)===null,'unregistered redirect denied');
 assert(await issueAuthorizationCode(consent,redirects,{create:async()=>false},150)===null,'storage refusal denied');
 assert(await issueAuthorizationCode(consent,redirects,{create:async()=>{throw Error('db down');}},150)===null,'storage failure denied');
 return 'OAuth code issuance 12 checks passed (mock persistence only)';
}

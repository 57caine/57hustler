import { issueOAuthBearer, verifyOAuthBearer } from './oauth-bearer';
function assert(ok: unknown, reason: string): asserts ok { if (!ok) throw new Error(reason); }
export async function testOAuthBearer() {
 const now=1795340000, secret='x'.repeat(48);
 const opts={issuer:'https://issuer.example',audience:'consensus-mcp',subject:'owner-1',
  clientId:'client-1',scopes:['consensus.read'] as const,nowSeconds:now,secret};
 const token=await issueOAuthBearer(opts);
 assert(token,'token minted');
 const expected={issuer:opts.issuer,audience:opts.audience,nowSeconds:now,secret,isRevoked:async()=>false};
 const claims=await verifyOAuthBearer(token,expected);
 assert(claims?.sub==='owner-1','valid signature and claims');
 assert(claims?.scope==='consensus.read','scope retained');
 assert(claims?.exp===now+600,'short expiration');
 assert(!(await verifyOAuthBearer(token,{...expected,nowSeconds:now+600})),'expiration enforced');
 assert(!(await verifyOAuthBearer(token,{...expected,audience:'other'})),'audience enforced');
 assert(!(await verifyOAuthBearer(token,{...expected,issuer:'https://other.example'})),'issuer enforced');
 assert(!(await verifyOAuthBearer(token,{...expected,secret:'y'.repeat(48)})),'wrong signing key rejected');
 assert(!(await verifyOAuthBearer(token,{...expected,isRevoked:async()=>true})),'revoked token rejected');
 assert(!(await verifyOAuthBearer(token,{...expected,isRevoked:async()=>{throw new Error('storage down')}})),'revocation outage fails closed');
 // A different final base64url character can decode to the same last byte.
 // The verifier must reject noncanonical pad bits, not only changed HMAC bytes.
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
 const encoded=token!.split('.');
 const final=encoded[2].slice(-1);
 const idx=alphabet.indexOf(final);
 const variant=alphabet[(idx & ~3) | ((idx+1)&3)];
 {
   assert(idx>=0 && variant!==final,'noncanonical test vector generated');
   assert(!(await verifyOAuthBearer(encoded[0]+'.'+encoded[1]+'.'+encoded[2].slice(0,-1)+variant,expected)),
     'noncanonical signature rejected');
 }
 assert(!(await verifyOAuthBearer(token!.slice(0,-1)+'x',expected)),'tampering rejected');
 assert(!(await issueOAuthBearer({...opts,secret:'short'})),'weak secret rejected');
 assert(!(await issueOAuthBearer({...opts,scopes:['unknown'] as never})),'invalid scope rejected');
 assert(!(await issueOAuthBearer({...opts,issuer:'http://issuer.example'})),'insecure issuer rejected');
 return 'OAuth signed bearer 14 checks passed';
}

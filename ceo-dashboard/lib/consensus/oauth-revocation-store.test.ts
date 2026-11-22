import { createRevocationLookup, type RevocationDatabase } from './oauth-revocation-store';
import { issueOAuthBearer } from './oauth-bearer';
import { authorizeMcpTool } from './oauth-resource-authorization';

function assert(value: unknown, name: string): asserts value { if (!value) throw new Error(name); }
function mock(data: {jti:string}|null,error:unknown=null): RevocationDatabase {
  return {from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data,error})})})})};
}
export async function testOAuthRevocationStore(): Promise<string> {
  const id='a'.repeat(32);
  assert(await createRevocationLookup(mock({jti:id}))(id),'revoked jti detected');
  assert(!(await createRevocationLookup(mock(null))(id)),'unrevoked jti allowed');
  let threw=false;
  try { await createRevocationLookup(mock(null,{message:'DB offline'}))(id); } catch { threw=true; }
  assert(threw,'DB failure propagates');
  threw=false;
  try { await createRevocationLookup(mock(null))('invalid'); } catch { threw=true; }
  assert(threw,'invalid jti fails closed');
  const issuer='https://issuer.example',audience=issuer+'/api/consensus/mcp';
  const secret='s'.repeat(48),nowSeconds=1795340000;
  const token=await issueOAuthBearer({issuer,audience,subject:'owner',clientId:'client',
    scopes:['consensus.read'],nowSeconds,secret});
  assert(token,'bearer issued');
  const params={authorization:'Bearer '+token,toolName:'get_result',issuer,audience,
    signingSecret:secret,nowSeconds};
  assert(await authorizeMcpTool({...params,isRevoked:createRevocationLookup(mock(null))}),
    'unrevoked token authorizes');
  const jti=(JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString('utf8')) as {jti:string}).jti;
  assert(!(await authorizeMcpTool({...params,isRevoked:createRevocationLookup(mock({jti}))})),
    'revoked token rejected');
  assert(!(await authorizeMcpTool({...params,isRevoked:createRevocationLookup(mock(null,{message:'offline'}))})),
    'database outage rejects MCP tool');
  return 'OAuth persistent revocation adapter 7 checks passed';
}

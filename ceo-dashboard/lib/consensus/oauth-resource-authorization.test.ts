import { issueOAuthBearer } from './oauth-bearer';
import { authorizeMcpTool } from './oauth-resource-authorization';

function assert(value: unknown, label: string): asserts value { if (!value) throw new Error(label); }
export async function testOAuthResourceAuthorization(): Promise<string> {
  const issuer='https://auth.example',audience='https://auth.example/api/consensus/mcp';
  const secret='s'.repeat(48),nowSeconds=1795340000;
  const base={issuer,audience,subject:'owner-a',clientId:'official-client',
    nowSeconds,secret};
  const read=await issueOAuthBearer({...base,scopes:['consensus.read']});
  const write=await issueOAuthBearer({...base,scopes:['consensus.write']});
  assert(read && write,'tokens issued');
  const verify=(authorization:string|null,toolName:string,other:Record<string,unknown>={})=>
    authorizeMcpTool({authorization,toolName,issuer,audience,signingSecret:secret,
      nowSeconds,isRevoked:async()=>false,...other});
  assert((await verify('Bearer '+read,'get_result'))?.sub==='owner-a','read allowed');
  assert((await verify('Bearer '+read,'get_status'))?.sub==='owner-a','status allowed');
  assert(!(await verify('Bearer '+read,'submit_question')),'read cannot write');
  assert(!(await verify('Bearer '+read,'submit_review')),'read cannot submit review');
  assert((await verify('Bearer '+write,'submit_review'))?.sub==='owner-a','write allowed');
  assert(!(await verify('Bearer '+write,'get_result')),'write cannot read');
  assert(!(await verify('Bearer '+write,'unlisted_tool')),'unknown tool denied');
  assert(!(await verify(null,'get_result')),'missing bearer denied');
  assert(!(await verify('Basic '+read,'get_result')),'wrong scheme denied');
  assert(!(await verify('Bearer '+read,'get_result',{audience:'other'})),'wrong audience denied');
  assert(!(await verify('Bearer '+read,'get_result',{nowSeconds:nowSeconds+600})),'expired denied');
  assert(!(await verify('Bearer '+read,'get_result',{isRevoked:async()=>true})),'revoked denied');
  assert(!(await verify('Bearer '+read,'get_result',{isRevoked:async()=>{throw Error('DB offline')}})),'revocation outage denied');
  return 'OAuth MCP resource authorization 13 checks passed';
}

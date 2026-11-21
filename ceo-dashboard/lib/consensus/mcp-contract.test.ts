import { PROTOCOL_VERSION, TOOLS, parseRpc,parseArgs,rpcOk,rpcError,validKey,validUuid } from './mcp-contract';
function expect(condition:boolean,detail:string){if(!condition)throw new Error(detail);}
export function testMcpContract(){
  expect(PROTOCOL_VERSION==='2025-11-25','protocol version');
  expect(TOOLS.length===4,'four supported tools');
  expect(new Set(TOOLS.map(t=>t.name)).size===4,'unique tool names');
  expect(TOOLS.every(t=>t.inputSchema.additionalProperties===false),'closed schemas');
  expect(parseRpc({jsonrpc:'2.0',id:1,method:'initialize'})?.method==='initialize','initialize');
  expect(parseRpc({jsonrpc:'2.0',id:2,method:'tools/list'})?.id===2,'tools list');
  expect(parseRpc({jsonrpc:'2.0',method:'notifications/initialized'})?.id===undefined,'notification');
  expect(parseRpc({jsonrpc:'1.0',id:1,method:'initialize'})===null,'invalid version');
  expect(parseRpc([{jsonrpc:'2.0',id:1,method:'ping'}])===null,'batch unsupported');
  expect(parseRpc({jsonrpc:'2.0',id:1.5,method:'ping'})===null,'fractional id rejected');
  expect(parseRpc({jsonrpc:'2.0',id:Infinity,method:'ping'})===null,'infinite id rejected');
  expect(parseRpc({jsonrpc:'2.0',id:NaN,method:'ping'})===null,'NaN id rejected');
  expect(parseRpc({jsonrpc:'2.0',id:9007199254740992,method:'ping'})===null,'unsafe integer id rejected');
  expect(parseRpc({jsonrpc:'2.0',id:1,method:''})===null,'empty method rejected');
  expect(parseArgs({requestId:'123'},['requestId'])?.requestId==='123','read args');
  expect(parseArgs({requestId:'123',owner_id:'other'},['requestId'])===null,'no IDOR argument');
  expect(parseArgs({requestId:123},['requestId'])===null,'typed arguments');
  expect(validKey('01234567'),'valid idempotency');
  expect(!validKey('a b c d e'),'invalid idempotency');
  expect(validUuid('123e4567-e89b-42d3-a456-426614174000'),'valid UUID');
  expect(!validUuid('not-a-uuid'),'invalid UUID');
  expect(rpcOk(1,{ok:true}).jsonrpc==='2.0','rpc success shape');
  expect(rpcError(null,-32700,'parse error').error.code===-32700,'rpc failure shape');
  return 'mcp contract 23 checks passed';
}

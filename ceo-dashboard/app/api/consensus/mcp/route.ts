import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PROTOCOL_VERSION,TOOLS,parseRpc,parseArgs,rpcOk,rpcError,validKey,validUuid,resultText,sameIdempotentRequest,parseToolCallParams } from '@/lib/consensus/mcp-contract';

export const dynamic='force-dynamic';
export const runtime='nodejs';
const heads={'Cache-Control':'no-store','Content-Type':'application/json'};
function respond(body:unknown,status=200){return NextResponse.json(body,{status,headers:heads});}
const fail=(status:number,message:string)=>respond({error:message},status);
export async function GET(){return fail(405,'MCP uses POST; SSE not enabled');}
export async function DELETE(){return fail(405,'Stateless MCP: no session to delete');}
export async function POST(request:NextRequest){
 // Intentionally OFF until OAuth2.1/OIDC client authorization is reviewed.
 if(process.env.MCP_BRIDGE_ENABLED!=='true')return fail(503,'MCP connector is disabled pending authorization review');
 const origin=request.headers.get('origin');
 if(origin&&origin!==request.nextUrl.origin)return fail(403,'Origin not allowed');
 // Reject oversized requests before reading the body; keep the post-read check for chunked requests.
 const declaredLength=request.headers.get('content-length');
 if(declaredLength!==null){
   const bytes=Number(declaredLength);
   if(!Number.isSafeInteger(bytes)||bytes<0)return fail(400,'Invalid Content-Length');
   if(bytes>24000)return fail(413,'Request too large');
 }
 const contentType=request.headers.get('content-type')?.split(';',1)[0].trim().toLowerCase();
 if(contentType!=='application/json')return fail(415,'JSON required');
 const auth=request.headers.get('authorization')||'';
 if(!/^Bearer [A-Za-z0-9._~-]+$/.test(auth))return fail(401,'Bearer authentication required');
 const token=auth.slice(7);
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return fail(503,'Identity provider unavailable');
 // The bearer must be a real Supabase user JWT; never use service_role or a shared owner key.
 const db=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:authUser,error:authError}=await db.auth.getUser(token);
 if(authError||!authUser.user)return fail(401,'Token invalid or expired');
 // Bound memory usage even when Content-Length is absent or forged.
 // A post-read byte count alone permits an arbitrarily large chunked body.
 const reader=request.body?.getReader();
 if(!reader)return fail(400,'Request body required');
 const chunks:Uint8Array[]=[];
 let received=0;
 try{
   while(true){
     const {done,value}=await reader.read();
     if(done)break;
     received+=value.byteLength;
     if(received>24000){
       await reader.cancel().catch(()=>undefined);
       return fail(413,'Request too large');
     }
     chunks.push(value);
   }
 }catch{return fail(400,'Cannot read request body');}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(received);
 let offset=0;
 for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 let payload:unknown;
 try{
   payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 }catch{return respond(rpcError(null,-32700,'Parse error'));}
 const rpc=parseRpc(payload);
 if(!rpc)return respond(rpcError(null,-32600,'Invalid Request'));
 if(rpc.id===undefined)return new NextResponse(null,{status:202,headers:{'Cache-Control':'no-store'}});
 if(rpc.method==='initialize')return respond(rpcOk(rpc.id,{
   protocolVersion:PROTOCOL_VERSION,capabilities:{tools:{listChanged:false}},
   serverInfo:{name:'57hustler-consensus',version:'0.1.0'},
   instructions:'This shared workspace stores questions and user-supplied answers only. It does not automatically call GPT, Claude, or Gemini.'
 }));
 if(rpc.method==='ping')return respond(rpcOk(rpc.id,{}));
 if(rpc.method==='tools/list')return respond(rpcOk(rpc.id,{tools:TOOLS}));
 if(rpc.method!=='tools/call')return respond(rpcError(rpc.id,-32601,'Method not found'));
 const p=parseToolCallParams(rpc.params);
 if(!p)return respond(rpcError(rpc.id,-32602,'Invalid tool-call params'));
 const owner=authUser.user.id;
 const input=p.arguments;
 if(p.name==='submit_question'){
   const a=parseArgs(input,['question','origin','idempotencyKey']);
   if(!a||!a.question.trim()||a.question.length>5000||!['chatgpt','claude','gemini','other'].includes(a.origin)||!validKey(a.idempotencyKey))
     return respond(rpcError(rpc.id,-32602,'Invalid question parameters'));
   const {data,error}=await db.from('ai_consensus_requests')
     .upsert({owner_id:owner,origin:a.origin,question:a.question.trim(),idempotency_key:a.idempotencyKey},{onConflict:'owner_id,idempotency_key',ignoreDuplicates:true})
     .select('id,origin,question,status,created_at').maybeSingle();
   if(error)return respond(rpcError(rpc.id,-32000,'Storage unavailable'));
   // An idempotency key must never silently bind to a different question,
   // including when the database returns an existing row from upsert.
   if(data&&(!sameIdempotentRequest(data,a)))
     return respond(rpcError(rpc.id,-32602,'Idempotency key reused for different request'));
   let row=data;
   if(!row){
     const existing=await db.from('ai_consensus_requests')
       .select('id,origin,question,status,created_at').eq('owner_id',owner).eq('idempotency_key',a.idempotencyKey).maybeSingle();
     if(existing.error||!existing.data)return respond(rpcError(rpc.id,-32000,'Cannot retrieve saved request'));
     row=existing.data;
     if(!sameIdempotentRequest(row,a))return respond(rpcError(rpc.id,-32602,'Idempotency key reused for different request'));
   }
   return respond(rpcOk(rpc.id,resultText({request:row,automatedConsensus:false})));
 }
 if(p.name==='get_status'||p.name==='get_result'){
   const a=parseArgs(input,['requestId']);
   if(!a||!validUuid(a.requestId))return respond(rpcError(rpc.id,-32602,'Invalid request id'));
   const q=await db.from('ai_consensus_requests')
     .select('id,origin,question,status,created_at').eq('id',a.requestId).eq('owner_id',owner).maybeSingle();
   if(q.error)return respond(rpcError(rpc.id,-32000,'Storage unavailable'));
   if(!q.data)return respond(rpcError(rpc.id,-32004,'Request not found'));
   const reviews=await db.from('ai_consensus_contributions')
     .select('id,agent,content,provenance,created_at').eq('request_id',a.requestId).order('created_at',{ascending:true});
   if(reviews.error)return respond(rpcError(rpc.id,-32000,'Storage unavailable'));
   const items=reviews.data||[];
   const summary={request:q.data,contributionCount:items.length,verifiedProviderCount:items.filter(x=>x.provenance==='verified_api').length,automatedConsensus:false};
   return respond(rpcOk(rpc.id,resultText(p.name==='get_status'?summary:{...summary,contributions:items})));
 }
 if(p.name==='submit_review'){
   const a=parseArgs(input,['requestId','agent','content']);
   if(!a||!validUuid(a.requestId)||!['gpt','claude','gemini'].includes(a.agent)||!a.content.trim()||a.content.length>16000)
     return respond(rpcError(rpc.id,-32602,'Invalid response parameters'));
   const q=await db.from('ai_consensus_requests').select('id').eq('id',a.requestId).eq('owner_id',owner).maybeSingle();
   if(q.error||!q.data)return respond(rpcError(rpc.id,-32004,'Request not found'));
   const saved=await db.from('ai_consensus_contributions')
     .insert({request_id:q.data.id,agent:a.agent,content:a.content.trim(),provenance:'user_supplied'})
     .select('id,agent,provenance,created_at').single();
   if(saved.error)return respond(rpcError(rpc.id,-32000,'Storage unavailable'));
   return respond(rpcOk(rpc.id,resultText({contribution:saved.data,automatedConsensus:false})));
 }
 return respond(rpcError(rpc.id,-32601,'Tool not found'));
}

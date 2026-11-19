/**
 * Preproduction MCP JSON-RPC contract. External access is separately guarded.
 * No provider models are called. User-submitted reviews are never verified votes.
 */
export const PROTOCOL_VERSION = '2025-11-25';
type Schema={type:'object';properties:Record<string,unknown>;required?:string[];additionalProperties:false};
const str=(description:string,maxLength:number)=>({type:'string',description,maxLength});
const schema=(properties:Record<string,unknown>,required:string[]):Schema=>({type:'object',properties,required,additionalProperties:false});
export const TOOLS=[
 {name:'submit_question',description:'Save a question in the owner-only shared workspace. Does NOT contact other AI models.',inputSchema:schema({
  question:str('Question to save (max 5000 characters)',5000),
  origin:{type:'string',enum:['chatgpt','claude','gemini','other']},
  idempotencyKey:str('Caller-supplied stable idempotency key, 8-128 ASCII characters',128)
 },['question','origin','idempotencyKey']),annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false}},
 {name:'get_status',description:'Read the current status of a shared question. Never reports a completed multi-model review.',inputSchema:schema({requestId:str('UUID of question',36)},['requestId']),annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:'get_result',description:'Read a question and user-supplied responses. These are NOT verified model outputs.',inputSchema:schema({requestId:str('UUID of question',36)},['requestId']),annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:'submit_review',description:'Store a response manually supplied in this chat. The response is unverified, never an autonomous AI consensus.',inputSchema:schema({
  requestId:str('UUID of question',36),agent:{type:'string',enum:['gpt','claude','gemini']},
  content:str('Answer provided by a user or assistant, max 16000 characters',16000)
 },['requestId','agent','content']),annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false}}
] as const;
export type RpcRequest={jsonrpc:'2.0';id?:string|number;method:string;params?:unknown};
export function parseRpc(input:unknown):RpcRequest|null{
 if(!input||typeof input!=='object'||Array.isArray(input))return null;
 const p=input as Record<string,unknown>;
 if(p.jsonrpc!=='2.0'||typeof p.method!=='string'||p.method.length>100)return null;
 if(p.id!==undefined&&(typeof p.id!=='number'&&typeof p.id!=='string'))return null;
 if(typeof p.id==='string'&&p.id.length>100)return null;
 return {jsonrpc:'2.0',id:p.id as string|number|undefined,method:p.method,params:p.params};
}
export function rpcOk(id:string|number,result:unknown){return {jsonrpc:'2.0' as const,id,result};}
export function rpcError(id:string|number|null,code:number,message:string){return {jsonrpc:'2.0' as const,id,error:{code,message}};}
export function parseArgs(value:unknown,required:readonly string[]){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const v=value as Record<string,unknown>;
 if(Object.keys(v).some(k=>!required.includes(k))||required.some(k=>typeof v[k]!=='string'))return null;
 return v as Record<string,string>;
}
export function validKey(value:string){return /^[A-Za-z0-9_-]{8,128}$/.test(value);}
export function validUuid(value:string){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
export function resultText(value:unknown){return {content:[{type:'text' as const,text:JSON.stringify(value)}],isError:false};}

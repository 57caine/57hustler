import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const noStore = {'Cache-Control':'no-store'};
const origins = ['chatgpt','claude','gemini','jarvis','other'];
const agents = ['gpt','claude','gemini'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function error(message: string,status=400){return NextResponse.json({error:message},{status,headers:noStore});}
function sameOrigin(request:NextRequest){
  const origin=request.headers.get('origin');
  return !origin || origin===request.nextUrl.origin;
}
export async function GET(request:NextRequest){
  const user=await getCurrentUser();
  if(!user)return error('認証が必要です',401);
  const db=await createClient();
  const id=request.nextUrl.searchParams.get('id');
  if(id){
    if(!uuid.test(id))return error('ID形式が正しくありません');
    const {data:question,error:questionError}=await db.from('ai_consensus_requests')
      .select('id,origin,question,status,created_at').eq('id',id).eq('owner_id',user.id).maybeSingle();
    if(questionError)return error('相談を取得できません',503);
    if(!question)return error('相談が見つかりません',404);
    const {data:contributions,error:contributionsError}=await db.from('ai_consensus_contributions')
      .select('id,agent,content,provenance,created_at').eq('request_id',id).order('created_at');
    if(contributionsError)return error('回答を取得できません',503);
    // Never describe user-supplied contributions as verified AI execution.
    return NextResponse.json({question,contributions:contributions??[],automatedConsensus:false},{headers:noStore});
  }
  const {data,error:dbError}=await db.from('ai_consensus_requests')
    .select('id,origin,question,status,created_at').eq('owner_id',user.id).order('created_at',{ascending:false}).limit(30);
  if(dbError)return error('相談一覧を取得できません',503);
  return NextResponse.json({questions:data??[]},{headers:noStore});
}
export async function POST(request:NextRequest){
  const user=await getCurrentUser();
  if(!user)return error('認証が必要です',401);
  if(!sameOrigin(request))return error('送信元を確認できません',403);
  if(!request.headers.get('content-type')?.toLowerCase().includes('application/json'))return error('JSON形式が必要です',415);
  let body:unknown;
  try{body=await request.json();}catch{return error('JSONを読み取れません');}
  if(!body||typeof body!=='object')return error('入力を確認できません');
  const b=body as Record<string,unknown>;
  const db=await createClient();
  if(b.action==='create'){
    if(typeof b.question!=='string'||!b.question.trim()||b.question.length>5000)return error('質問は1〜5000文字です');
    if(typeof b.origin!=='string'||!origins.includes(b.origin))return error('入力元を確認できません');
    if(typeof b.idempotencyKey!=='string'||b.idempotencyKey.length<8||b.idempotencyKey.length>128||!/^[a-zA-Z0-9_-]+$/.test(b.idempotencyKey))return error('重複防止キーを確認できません');
    const {data,error:dbError}=await db.from('ai_consensus_requests').upsert({
      owner_id:user.id,question:b.question.trim(),origin:b.origin,idempotency_key:b.idempotencyKey,
    },{onConflict:'owner_id,idempotency_key',ignoreDuplicates:true})
      .select('id,origin,question,status,created_at').maybeSingle();
    if(dbError)return error('相談を保存できません',503);
    if(data)return NextResponse.json({question:data},{status:201,headers:noStore});
    const {data:existing,error:lookupError}=await db.from('ai_consensus_requests')
      .select('id,origin,question,status,created_at').eq('owner_id',user.id).eq('idempotency_key',b.idempotencyKey).maybeSingle();
    if(lookupError||!existing)return error('既存の相談を確認できません',503);
    return NextResponse.json({question:existing,duplicate:true},{headers:noStore});
  }
  if(b.action==='contribute'){
    if(typeof b.requestId!=='string'||!uuid.test(b.requestId))return error('相談IDが正しくありません');
    if(typeof b.agent!=='string'||!agents.includes(b.agent))return error('AI名が正しくありません');
    if(typeof b.content!=='string'||!b.content.trim()||b.content.length>16000)return error('回答は1〜16000文字です');
    // RLS further guarantees owner-only writes. Never allow clients to assert verified_api provenance.
    const {data,error:dbError}=await db.from('ai_consensus_contributions').insert({
      request_id:b.requestId,agent:b.agent,content:b.content.trim(),provenance:'user_supplied',
    }).select('id,agent,provenance,created_at').single();
    if(dbError)return error('回答を保存できません（相談への権限を確認してください）',403);
    return NextResponse.json({contribution:data,automatedConsensus:false},{status:201,headers:noStore});
  }
  return error('未対応の操作です');
}

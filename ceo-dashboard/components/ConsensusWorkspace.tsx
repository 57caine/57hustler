'use client';
import { useEffect, useState, type FormEvent } from 'react';
type RequestRow={id:string;origin:string;question:string;status:string;created_at:string};
type Contribution={id:string;agent:string;content:string;provenance:string;created_at:string};
type Detail={question:RequestRow;contributions:Contribution[];automatedConsensus:false};
async function call<T>(path:string,body?:object):Promise<T>{
  const res=await fetch(path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'}:{cache:'no-store'});
  const data=await res.json() as T & {error?:string};
  if(!res.ok)throw new Error(data.error||'通信に失敗しました');
  return data;
}
export default function ConsensusWorkspace(){
 const [question,setQuestion]=useState('');
 const [requests,setRequests]=useState<RequestRow[]>([]);
 const [detail,setDetail]=useState<Detail|null>(null);
 const [agent,setAgent]=useState('gpt');
 const [answer,setAnswer]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 async function refresh(){
   const data=await call<{questions:RequestRow[]}>('/api/consensus');
   setRequests(data.questions);
 }
 useEffect(()=>{void refresh().catch(()=>setMessage('相談一覧を取得できませんでした'));},[]);
 async function open(id:string){
   setBusy(true);setMessage('');
   try{setDetail(await call<Detail>('/api/consensus?id='+encodeURIComponent(id)));}
   catch(e){setMessage(e instanceof Error?e.message:'取得に失敗しました');}
   finally{setBusy(false)}
 }
 async function create(e:FormEvent){
   e.preventDefault();if(busy||!question.trim())return;
   setBusy(true);setMessage('');
   try{
     const idempotencyKey=crypto.randomUUID();
     const data=await call<{question:RequestRow}>('/api/consensus',{action:'create',question,origin:'other',idempotencyKey});
     setQuestion('');await refresh();setDetail({question:data.question,contributions:[],automatedConsensus:false});
     setMessage('相談を保存しました。各AIへの自動送信はまだ行っていません。');
   }catch(e){setMessage(e instanceof Error?e.message:'保存できませんでした');}
   finally{setBusy(false)}
 }
 async function contribute(e:FormEvent){
   e.preventDefault();if(busy||!detail||!answer.trim())return;
   setBusy(true);setMessage('');
   try{
     await call('/api/consensus',{action:'contribute',requestId:detail.question.id,agent,content:answer});
     setAnswer('');const data=await call<Detail>('/api/consensus?id='+detail.question.id);
     setDetail(data);setMessage('回答を保存しました（AI実行は未検証）。');
   }catch(e){setMessage(e instanceof Error?e.message:'保存できませんでした');}
   finally{setBusy(false)}
 }
 return <div style={{maxWidth:880,margin:'0 auto',padding:'20px 16px',display:'grid',gap:18}}>
   <header><h1 style={{fontSize:26,fontWeight:800}}>3AI 共通協議室</h1>
     <p style={{marginTop:8}}>質問と回答の共有基盤です。ChatGPT・Claude・Geminiへの自動送信や自動協議はまだ未接続です。</p></header>
   <form onSubmit={create} style={{display:'grid',gap:9}}>
     <label htmlFor="consensus-question" style={{fontWeight:700}}>新しい相談</label>
     <textarea id="consensus-question" value={question} onChange={e=>setQuestion(e.target.value)}
       maxLength={5000} rows={4} placeholder="3AIで検討したいことを入力" style={{width:'100%',color:'inherit',background:'transparent',border:'1px solid #64748b',borderRadius:10,padding:12,fontSize:16}}/>
     <button disabled={busy||!question.trim()} type="submit" style={{padding:12,borderRadius:10,background:'#2563eb',color:'white',fontWeight:700}}>相談を保存する</button>
   </form>
   {message?<p role="status">{message}</p>:null}
   <section aria-label="保存済みの相談">
    <h2 style={{fontSize:19,fontWeight:700,marginBottom:10}}>相談履歴</h2>
    <div style={{display:'grid',gap:7}}>{requests.length===0?<p>まだ相談はありません。</p>:requests.map(r=>
      <button key={r.id} onClick={()=>void open(r.id)} disabled={busy} style={{textAlign:'left',padding:12,border:'1px solid #64748b',borderRadius:10}}>
        {r.question.slice(0,110)} <small style={{display:'block',opacity:.7}}>{new Date(r.created_at).toLocaleString('ja-JP')}</small>
      </button>)}</div>
   </section>
   {detail?<section style={{border:'1px solid #64748b',borderRadius:12,padding:14,display:'grid',gap:12}}>
      <h2 style={{fontWeight:800,fontSize:19}}>相談の内容</h2>
      <p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{detail.question.question}</p>
      <p style={{fontSize:12,opacity:.8}}>相談ID: {detail.question.id}</p>
      <h3 style={{fontWeight:700}}>保存された回答（自動検証なし）</h3>
      {detail.contributions.length===0?<p>回答はまだありません。</p>:detail.contributions.map(c=>
       <article key={c.id} style={{padding:12,border:'1px solid #64748b',borderRadius:9}}>
        <strong>{c.agent.toUpperCase()} — 利用者が持ち込んだ回答</strong>
        <p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{c.content}</p>
       </article>)}
      <form onSubmit={contribute} style={{display:'grid',gap:8}}>
       <label htmlFor="consensus-agent">回答元（手動登録）</label>
       <select id="consensus-agent" value={agent} onChange={e=>setAgent(e.target.value)} style={{padding:10,border:'1px solid #64748b',borderRadius:9,background:'transparent',color:'inherit'}}>
         <option value="gpt">GPT</option><option value="claude">Claude</option><option value="gemini">Gemini</option>
       </select>
       <label htmlFor="consensus-answer">回答を追加する</label>
       <textarea id="consensus-answer" value={answer} onChange={e=>setAnswer(e.target.value)} rows={5} maxLength={16000}
         style={{width:'100%',fontSize:16,padding:12,border:'1px solid #64748b',borderRadius:10,color:'inherit',background:'transparent'}}/>
       <button type="submit" disabled={busy||!answer.trim()} style={{padding:12,background:'#2563eb',color:'white',borderRadius:10}}>回答を保存</button>
      </form>
      <p style={{fontSize:12,opacity:.8}}>この画面から3AIへ自動送信する機能はありません。保存した回答は第三者のAIが実際に生成したことを証明しません。</p>
    </section>:null}
 </div>;
}

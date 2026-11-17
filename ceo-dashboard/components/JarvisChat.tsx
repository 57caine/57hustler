'use client';
import { useState, type FormEvent } from 'react';
type Item={role:'user'|'assistant';text:string;sources?:{label:string;url:string}[]};
const suggestions=['今日の収益は？','何を優先する？','本人タスクは？','JARVISの状態は？'];
export default function JarvisChat(){
  const [items,setItems]=useState<Item[]>([{role:'assistant',text:'おかえりなさい。JARVISです。\nいま分かる数字と仕事の状態を、出典付きでお伝えします。実行の指示は既存の自走運用が担当しています。'}]);
  const [value,setValue]=useState('');
  const [busy,setBusy]=useState(false);
  async function send(input:string, triage=false){
    const message=input.trim();
    if(busy||!message||message.length>500)return;
    setBusy(true);setValue('');
    setItems(current=>[...current,{role:'user',text:message}]);
    try{
      const res=await fetch(triage?'/api/jarvis/triage':'/api/jarvis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message}),cache:'no-store'});
      const data=await res.json();
      if(!res.ok)throw new Error(typeof data.error==='string'?data.error:'取得できませんでした');
      const rendered=triage ? `3AI協議の受付準備ができました（実際のAI呼び出しは未実行）。\n受付ID: ${data.id}\n作業ゲート: ${data.gate}\n\nGPT：${data.assignments?.gpt ?? '未作成'}\n\nClaude：${data.assignments?.claude ?? '未作成'}\n\nGemini：${data.assignments?.gemini ?? '未作成'}\n\n残る接続条件：${Array.isArray(data.unresolved)?data.unresolved.join('、'):'未確認'}\n\n※まだ3AIの同意・実行・増収を確認したものではありません。` : typeof data.message==='string'?data.message:'回答を取得できませんでした';
      setItems(current=>[...current,{role:'assistant',text:rendered,sources:!triage&&Array.isArray(data.sources)?data.sources:[]}]);
    }catch(e){
      setItems(current=>[...current,{role:'assistant',text:`通信を確認できませんでした：${e instanceof Error?e.message:'不明なエラー'}。収益や進捗を推測しません。`}]);
    }finally{setBusy(false)}
  }
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();void send(value)}
  return <section className="jv-section jv-chat" aria-label="JARVISに話しかける">
    <div className="jv-chatbar"><h2 className="jv-sectiontitle">JARVISに話しかける</h2><span className="jv-subtle">実データ照会モード</span></div>
    <div className="jv-chatmessages" aria-live="polite" aria-relevant="additions text">
      {items.map((item,i)=><div className={`jv-bubble ${item.role}`} key={i}>
        {item.text}
        {item.sources?.length?<div className="jv-chatlinks">{item.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>)}</div>:null}
      </div>)}
      {busy?<div className="jv-subtle" role="status">記録を確認しています…</div>:null}
    </div>
    <div className="jv-suggestions" aria-label="質問の例">{suggestions.map(q=><button key={q} type="button" disabled={busy} onClick={()=>void send(q)}>{q}</button>)}</div>
    <form onSubmit={submit} className="jv-inputrow">
      <label htmlFor="jarvis-input" className="sr-only">JARVISへの質問</label>
      <input id="jarvis-input" maxLength={500} placeholder="数字や仕事について質問する…" value={value} onChange={e=>setValue(e.target.value)}/>
      <button type="submit" disabled={busy||!value.trim()}>送信 ↗</button>
      <button type="button" disabled={busy||!value.trim()} onClick={()=>void send(value,true)}>3AI協議の準備</button>
    </form>
    <p className="jv-subtle" style={{marginTop:11}}>3AI協議の準備は無課金・実行なしの依頼票作成です。3AIの実接続、相互査読、直接実行はまだ有効化していません。</p>
  </section>
}

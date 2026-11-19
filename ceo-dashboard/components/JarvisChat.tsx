'use client';
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
type Item={role:'user'|'assistant';text:string;sources?:{label:string;url:string}[];assignments?:Record<string,string>};
const suggestions=['今日の収益は？','何を優先する？','本人タスクは？','JARVISの状態は？'];
export default function JarvisChat(){
  const [items,setItems]=useState<Item[]>([{role:'assistant',text:'おかえりなさい。JARVISです。\nいま分かる数字と仕事の状態を、出典付きでお伝えします。実行の指示は既存の自走運用が担当しています。'}]);
  const [value,setValue]=useState('');
  const [busy,setBusy]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({block:'nearest',behavior:'smooth'});},[items,busy]);
  async function send(input:string, triage=false){
    const message=input.trim();
    if(busy||!message||message.length>500)return;
    setBusy(true);setValue('');
    setItems(current=>[...current,{role:'user',text:message}]);
    try{
      const res=await fetch(triage?'/api/jarvis/triage':'/api/jarvis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message}),cache:'no-store'});
      const data=await res.json();
      if(!res.ok)throw new Error(typeof data.error==='string'?data.error:'取得できませんでした');
      const rendered=triage ? typeof data.summary==='string'?data.summary:'3AIへの依頼票を用意しました。実際の送信・協議は未実施です。' : typeof data.message==='string'?data.message:'回答を取得できませんでした';
      setItems(current=>[...current,{role:'assistant',text:rendered,sources:!triage&&Array.isArray(data.sources)?data.sources:[],assignments:triage&&data.assignments&&typeof data.assignments==='object'?data.assignments:undefined}]);
    }catch(e){
      setItems(current=>[...current,{role:'assistant',text:`通信を確認できませんでした：${e instanceof Error?e.message:'不明なエラー'}。収益や進捗を推測しません。`}]);
    }finally{setBusy(false)}
  }
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();void send(value)}
  function onEditorKeyDown(e:KeyboardEvent<HTMLTextAreaElement>){if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(value)}}
  return <section className="jv-section jv-chat" aria-label="JARVISに話しかける">
    <div className="jv-chatbar"><h2 className="jv-sectiontitle">JARVISに話しかける</h2><span className="jv-subtle">実データ照会モード</span></div>
    <div className="jv-chatmessages" aria-live="polite" aria-relevant="additions text">
      {items.map((item,i)=><div className={`jv-bubble ${item.role}`} key={i}>
        {item.text}
        {item.assignments?<details className="jv-subtle" style={{marginTop:9,whiteSpace:'pre-wrap'}}>
          <summary style={{cursor:'pointer'}}>3AIへの依頼文を確認（未送信）</summary>
          {Object.entries(item.assignments).map(([agent,task])=><div key={agent} style={{marginTop:10}}><strong>{agent.toUpperCase()}</strong>{'\n'}{task}</div>)}
        </details>:null}
        {item.sources?.length?<div className="jv-chatlinks">{item.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>)}</div>:null}
      </div>)}
      {busy?<div className="jv-subtle" role="status">記録を確認しています…</div>:null}
      <div ref={bottomRef} aria-hidden="true"/>
    </div>
    <div className="jv-suggestions" aria-label="質問の例">{suggestions.map(q=><button key={q} type="button" disabled={busy} onClick={()=>void send(q)}>{q}</button>)}</div>
    <form onSubmit={submit} className="jv-inputrow">
      <label htmlFor="jarvis-input" className="sr-only">JARVISへの相談内容</label>
      <textarea id="jarvis-input" rows={3} maxLength={500} placeholder="JARVISに相談する… 収益・改善・AI連携など" value={value} onChange={e=>setValue(e.target.value)} onKeyDown={onEditorKeyDown} aria-describedby="jarvis-input-hint"/>
      <div className="jv-inputactions">
        <span id="jarvis-input-hint" className="jv-subtle jv-inputhint">質問を入力してください · {value.length}/500文字</span>
        <button className="jv-send" type="submit" disabled={busy||!value.trim()}>送信 ↗</button>
      </div>
      <button className="jv-triage" type="button" disabled={busy||!value.trim()} onClick={()=>void send(value,true)}>3AI依頼票を作成（まだ未接続）</button>
    </form>
    <p className="jv-subtle" style={{marginTop:11}}>3AI協議の準備は無課金・実行なしの依頼票作成です。3AIの実接続、相互査読、直接実行はまだ有効化していません。</p>
  </section>
}

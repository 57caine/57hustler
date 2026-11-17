'use client';
import { useCallback, useEffect, useState } from 'react';

type Task = { id: string; status: string; owner: string; taskUrl: string | null; updatedAt: string | null; stateUrl: string };
type Status = { available: boolean; fetchedAt?: string; registryUpdatedAt?: string | null; activeTasks?: Task[]; deferredCount?: number | null; completedCount?: number | null; error?: string };
type Metrics = { available: boolean; generatedAt?: string | null; period?: string; lens?: { sessions: number | null; outboundClicks: number | null; a8Clicks: number | null; rakutenClicks: number | null; singleBoxClicks: number | null }; source?: string; error?: string };
type View = 'all' | 'active' | 'approval';
const labels: Record<string,string> = {queued:'待機',implementing:'実装中',verifying:'検証中',ready:'公開準備',awaiting_approval:'判断待ち',publishing:'公開中',observing:'効果を観察',blocked:'要調査',done:'完了',unknown:'状態不明'};
const formatDate = (d?:string|null) => d && !Number.isNaN(Date.parse(d)) ? new Date(d).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '未取得';
const formatNumber = (v?:number|null) => v === null || v === undefined ? '—' : v.toLocaleString('ja-JP');
const link = (task:Task) => task.taskUrl ?? task.stateUrl;

export default function JarvisExecutionStatus(){
  const [status,setStatus]=useState<Status|null>(null);
  const [metrics,setMetrics]=useState<Metrics|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [view,setView]=useState<View>('all');
  const load=useCallback(async()=>{
    setBusy(true);setError('');
    const results=await Promise.allSettled([
      fetch('/api/jarvis/status',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('status');return r.json() as Promise<Status>}),
      fetch('/api/jarvis/metrics',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('metrics');return r.json() as Promise<Metrics>}),
    ]);
    if(results[0].status==='fulfilled')setStatus(results[0].value);else{setStatus(null);setError('タスク状態を取得できませんでした。')}
    if(results[1].status==='fulfilled')setMetrics(results[1].value);else setMetrics(null);
    setBusy(false);
  },[]);
  useEffect(()=>{void load()},[load]);
  const tasks=status?.available?status.activeTasks??[]:[];
  const shown=tasks.filter(task=>view==='all'||(view==='approval'?task.status==='awaiting_approval':task.status!=='awaiting_approval'));
  const approvals=tasks.filter(t=>t.status==='awaiting_approval').length;
  const stale=!!status?.registryUpdatedAt&&Date.now()-new Date(status.registryUpdatedAt).getTime()>48*60*60*1000;

  return <div>
    <section className="jv-section" aria-label="実測指標">
      <div className="jv-sectiontop"><h2 className="jv-sectiontitle">収益に近い数字</h2><span className="jv-subtle">レンズナビ・{metrics?.period??'期間未取得'}</span></div>
      <div className="jv-metrics">
        <div className="jv-metric jv-metric--highlight"><label>確定報酬</label><div className="jv-number">未取得</div><small>ASP確定額はまだ連携していません</small></div>
        <div className="jv-metric"><label>購入先クリック</label><div className="jv-number">{metrics?.available?formatNumber(metrics.lens?.outboundClicks):'—'}<span style={{fontSize:12,marginLeft:4}}>回</span></div><small>A8・楽天の合計イベント</small></div>
        <div className="jv-metric"><label>サイト訪問</label><div className="jv-number">{metrics?.available?formatNumber(metrics.lens?.sessions):'—'}<span style={{fontSize:12,marginLeft:4}}>件</span></div><small>GA4セッション</small></div>
      </div>
      <p className="jv-subtle" style={{marginTop:9}}>データ更新：{formatDate(metrics?.generatedAt)} · 「クリック」は購入・売上ではありません。{!metrics?.available?metrics?.error??'データ取得を確認中':''}</p>
    </section>

    <section className="jv-section" aria-label="自走工程">
      <div className="jv-sectiontop"><h2 className="jv-sectiontitle">自走のしくみ</h2><span className="jv-subtle">3つの工程</span></div>
      <div className="jv-pipeline">
        <div className="jv-stage"><div className="jv-index">STEP 01 / SCAN</div><strong>数字から課題を探す</strong><small>訪問・クリック・確定報酬を区別して調査</small></div>
        <div className="jv-stage"><div className="jv-index">STEP 02 / WORK</div><strong>AIが仕事を進める</strong><small>Claude・GitHubの既存運用で検証と実装</small></div>
        <div className="jv-stage"><div className="jv-index">STEP 03 / VERIFY</div><strong>成果を確かめる</strong><small>公開確認から売上との照合へ</small></div>
      </div>
    </section>

    <section className="jv-section" aria-label="仕事の台帳">
      <div className="jv-sectiontop"><div><h2 className="jv-sectiontitle">仕事の台帳</h2><p className="jv-subtle" style={{marginTop:6}}>1枚のカードが1つの仕事。GitHubの保存記録を表示します。</p></div><button type="button" className="jv-refresh" onClick={()=>void load()} disabled={busy}>{busy?'取得中…':'↻ 更新'}</button></div>
      <div className="jv-toolbar" style={{marginBottom:13}}>
        <div className="jv-tabs" aria-label="仕事の絞り込み">
          <button className="jv-tab" aria-pressed={view==='all'} onClick={()=>setView('all')}>すべて</button>
          <button className="jv-tab" aria-pressed={view==='active'} onClick={()=>setView('active')}>AIの作業</button>
          <button className="jv-tab" aria-pressed={view==='approval'} onClick={()=>setView('approval')}>判断待ち {approvals||''}</button>
        </div>
        <span className="jv-subtle">最終保存 {formatDate(status?.registryUpdatedAt)}{stale?' · 古い記録':''}</span>
      </div>
      {error?<div className="jv-message" role="status">{error}</div>:null}
      {status?.available?<>
        <div className="jv-tasklist">
          {shown.length?shown.map(task=><article className="jv-task" key={task.id}>
            <div className="jv-taskhead">
              <span className="jv-taskname">{task.id} · {task.owner}担当</span>
              <span className={`jv-chip ${task.status==='awaiting_approval'||task.status==='blocked'?'jv-chip--warn':task.status==='unknown'?'jv-chip--quiet':''}`}>{labels[task.status]??'状態不明'}</span>
            </div>
            <p className="jv-subtle">工程の最終記録：{formatDate(task.updatedAt)}</p>
            <a href={link(task)} target="_blank" rel="noopener noreferrer">作業記録を開く ↗</a>
          </article>):<div className="jv-message">この条件の仕事はありません。実際に仕事がゼロとは限りません。</div>}
        </div>
        <p className="jv-subtle" style={{marginTop:11}}>GitHubの記録：{tasks.length}件進行登録 / {status.completedCount??'不明'}件完了登録 / {status.deferredCount??'不明'}件保留登録。現時点の実行状態や売上を保証しません。</p>
      </>:status&&!status.available?<div className="jv-message" role="status">{status.error??'仕事台帳は未取得です。'}</div>:!busy&&!error?<div className="jv-message">仕事の台帳を取得していません。</div>:null}
    </section>
  </div>;
}

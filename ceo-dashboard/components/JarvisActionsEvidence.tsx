'use client';

import { useCallback, useEffect, useState } from 'react';

type Run = {
  id: number;
  name: string;
  state: 'success' | 'failure' | 'cancelled' | 'in_progress' | 'queued' | 'other';
  createdAt: string;
  updatedAt: string | null;
  url: string;
  sha: string | null;
  event: string | null;
};
type Response = {
  available: boolean;
  fetchedAt: string;
  runs: Run[];
  scanned?: number;
  latestAnyRun?: { createdAt: string; url: string } | null;
  error?: string;
};

const labels: Record<Run['state'], string> = {
  success: '処理成功', failure: '処理失敗', cancelled: '取消', in_progress: '実行中', queued: '待機中', other: '未判定',
};
function date(value: string | null | undefined): string {
  if (!value || Number.isNaN(Date.parse(value))) return '未取得';
  return new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}
export default function JarvisActionsEvidence() {
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/jarvis/activity', { cache: 'no-store' });
      if (!response.ok) throw new Error('実行履歴を取得できませんでした');
      const payload: Response = await response.json();
      setData(payload);
    } catch {
      setData(null);
      setError('実行履歴は未取得です。停止や失敗と断定しません。');
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    void load();
    // Refresh only while this tab is in the foreground; no new server-side schedule.
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, 300_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [load]);

  const runs = data?.available ? data.runs : [];
  const failure = runs.find(run => run.state === 'failure');
  return (
    <section className="jv-section" aria-label="自動実行の証拠">
      <div className="jv-sectiontop">
        <div>
          <h2 className="jv-sectiontitle">実際に動いた記録</h2>
          <p className="jv-subtle" style={{ marginTop: 6 }}>GitHub Actionsの実行ログを直接確認。仕事の台帳とは別の記録です。</p>
        </div>
        <button className="jv-refresh" type="button" disabled={busy} onClick={() => void load()}>
          {busy ? '確認中…' : '↻ 更新'}
        </button>
      </div>
      {!data && !error ? <div className="jv-message" role="status">実行記録を照合しています…</div> : null}
      {error ? <div className="jv-message" role="status">{error}</div> : null}
      {data && !data.available ? <div className="jv-message" role="status">{data.error ?? '実行履歴は未取得です'}</div> : null}
      {data?.available ? (
        <>
          <div className="jv-toolbar" style={{ marginBottom: 12 }}>
            <span className="jv-subtle">照会 {date(data.fetchedAt)} · 関連する直近 {runs.length} 件</span>
            {failure ? <span className="jv-chip jv-chip--warn">失敗した処理あり</span> : runs.length ? <span className="jv-chip">Actions照合済み</span> : <span className="jv-chip jv-chip--quiet">関連実行なし</span>}
          </div>
          {runs.length ? (
            <div className="jv-tasklist">
              {runs.map(run => (
                <article key={run.id} className="jv-task">
                  <div className="jv-taskhead">
                    <strong className="jv-taskname">{run.name}</strong>
                    <span className={`jv-chip ${run.state === 'failure' ? 'jv-chip--warn' : run.state === 'other' || run.state === 'cancelled' ? 'jv-chip--quiet' : ''}`}>{labels[run.state]}</span>
                  </div>
                  <p className="jv-subtle">開始 {date(run.createdAt)}{run.sha ? ` · SHA ${run.sha}` : ''}{run.event ? ` · ${run.event}` : ''}</p>
                  <a href={run.url} target="_blank" rel="noopener noreferrer">実行ログを開く ↗</a>
                </article>
              ))}
            </div>
          ) : <div className="jv-message">直近の取得対象に一致するActionsがありません。停止とは限りません。</div>}
          <p className="jv-subtle" style={{ marginTop: 12 }}>
            「処理成功」はActionsの判定です。SNSへの実投稿・Claudeの完了・収益増の証明ではありません。
            ChatGPTのCEO予約タスクはこの一覧に含まれません。
          </p>
        </>
      ) : null}
    </section>
  );
}

'use client';
import { useCallback, useEffect, useState } from 'react';

type Task = { id: string; status: string; owner: string; taskUrl: string | null; updatedAt: string | null; stateUrl: string };
type Payload = {
  available: boolean;
  fetchedAt?: string;
  registryUpdatedAt?: string | null;
  activeTasks?: Task[];
  deferredCount?: number | null;
  completedCount?: number | null;
  source?: string;
  error?: string;
  note?: string;
};

const STATUS: Record<string, string> = {
  queued: '実行待ち',
  implementing: '実装中',
  verifying: '検証中',
  ready: '公開準備完了',
  awaiting_approval: '承認待ち',
  publishing: '公開処理中',
  observing: '効果を観察中',
  blocked: '作業停止・要調査',
  done: '記録上完了',
  unknown: '確認できません',
};
function when(value: string | null | undefined): string {
  if (!value) return '未取得';
  return new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}
export default function JarvisExecutionStatus() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/jarvis/status', { cache: 'no-store' });
      if (!res.ok) throw Error('状態の取得に失敗しました');
      const result: Payload = await res.json();
      setData(result);
    } catch {
      setError('状態は未取得です。自動運用が停止したとは限りません。');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <section className="rounded-2xl border p-4 space-y-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} aria-label="JARVIS自走タスクの進行状況">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">⚙️ 自走タスクの現在地</h2>
          <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>GitHubの作業記録から取得・読み取り専用</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={loading} className="shrink-0 rounded-lg border px-3 py-2 text-xs disabled:opacity-50" style={{ borderColor: 'var(--border)' }}>
          {loading ? '確認中…' : '更新'}
        </button>
      </div>
      {error ? <p className="text-sm" role="status">{error}</p> : null}
      {data?.available ? (
        <>
          <div className="text-xs leading-6">
            <span>進行中の記録：<strong>{data.activeTasks?.length ?? '未取得'}件</strong></span>
            <span className="ml-3">完了記録：{data.completedCount ?? '未取得'}件</span>
            <span className="ml-3">保留記録：{data.deferredCount ?? '未取得'}件</span>
          </div>
          {data.activeTasks?.length ? <ul className="space-y-2">
            {data.activeTasks.map(task => (
              <li key={task.id} className="rounded-xl border p-3 text-xs space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between gap-2">
                  <strong>{task.id} · {STATUS[task.status] ?? '確認できません'}</strong>
                  <span style={{ color: 'var(--muted)' }}>担当 {task.owner}</span>
                </div>
                <p style={{ color: 'var(--muted)' }}>状態の最終記録：{when(task.updatedAt)}</p>
                <a className="underline inline-block py-1" style={{ color: '#b5aaff' }} href={task.taskUrl ?? task.stateUrl} target="_blank" rel="noopener noreferrer">作業の根拠を確認</a>
              </li>
            ))}
          </ul> : <p className="text-xs">進行中として登録されたタスクはありません。実際の自動実行とは別に確認が必要です。</p>}
          <p className="text-[11px] leading-5" style={{ color: 'var(--muted)' }}>レジストリ更新：{when(data.registryUpdatedAt)}／照会：{when(data.fetchedAt)}。古い記録は現在も動いている証拠にはなりません。</p>
        </>
      ) : data && !data.available ? <p className="text-xs" role="status">{data.error ?? '記録は未取得です。'}</p> : !error && !loading ? <p className="text-xs">データを取得していません。</p> : null}
      <p className="text-[11px] leading-5" style={{ color: 'var(--muted)' }}>この表示はGitHubの状態記録です。GitHub Actionsの実行成否、Claudeの作業完了、ASPの収益を保証するものではありません。</p>
    </section>
  );
}

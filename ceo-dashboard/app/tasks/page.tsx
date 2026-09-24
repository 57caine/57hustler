'use client';
// 57caine/57hustlerのオープンPRを一覧表示するタスク一覧タブ（2026-09-24追加）

import { useEffect, useMemo, useState } from 'react';

interface TaskItem {
  number: number;
  title: string;
  url: string;
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  updatedAt: string;
  draft: boolean;
  author: string | null;
  business: string;
}

interface TasksResponse {
  fetchedAt: string;
  tasks: TaskItem[];
}

const BUSINESS_COLOR: Record<string, { color: string; bg: string }> = {
  'lens-navi': { color: '#7c6ef7', bg: 'rgba(124,110,247,0.12)' },
  'school-navi': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'shikaku-navi': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'shop-navi': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'CEOダッシュボード': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  '夜中のおじさん占い': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};
const DEFAULT_BUSINESS_COLOR = { color: '#6b6b8a', bg: 'rgba(107,107,138,0.12)' };

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function TaskCard({ task }: { task: TaskItem }) {
  const waiting = daysSince(task.createdAt);
  const businesses = task.business.split(' / ');
  return (
    <a href={task.url} target="_blank" rel="noopener noreferrer"
      className="block rounded-xl px-4 py-3 transition-colors"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        {task.draft && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(107,107,138,0.15)', color: 'var(--muted)' }}>
            📝 Draft
          </span>
        )}
        {businesses.map(b => {
          const cfg = BUSINESS_COLOR[b] ?? DEFAULT_BUSINESS_COLOR;
          return (
            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: cfg.bg, color: cfg.color }}>
              {b}
            </span>
          );
        })}
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          #{task.number}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto"
          style={{ background: waiting >= 3 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: waiting >= 3 ? '#ef4444' : 'var(--amber)' }}>
          {waiting === 0 ? '本日作成' : `${waiting}日経過`}
        </span>
      </div>

      <p className="text-sm font-medium leading-snug mb-1.5" style={{ color: 'var(--text)' }}>{task.title}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: 'var(--muted)' }}>
        <span className="font-mono">{task.headBranch} → {task.baseBranch}</span>
        {task.author && <span>作成者: {task.author}</span>}
        <span>作成: {fmtDate(task.createdAt)}</span>
      </div>
    </a>
  );
}

export default function TasksPage() {
  const [data, setData] = useState<TasksResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessFilter, setBusinessFilter] = useState<string>('all');

  function load() {
    setLoading(true);
    fetch('/api/tasks', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const businesses = useMemo(() => {
    const set = new Set<string>();
    (data?.tasks ?? []).forEach(t => t.business.split(' / ').forEach(b => set.add(b)));
    return Array.from(set);
  }, [data]);

  const filtered = (data?.tasks ?? []).filter(t =>
    businessFilter === 'all' || t.business.split(' / ').includes(businessFilter));

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>📋 タスク一覧</h1>
      <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <p style={{ color: '#ef4444' }}>取得エラー: {error}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          GITHUB_TOKEN環境変数が設定されているか確認してください。
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Open Pull Requests</div>
            <h1 className="text-xl font-bold mb-1">📋 タスク一覧</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>57caine/57hustlerでオープンになっている全PR（承認・マージ待ち）を表示します。</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold font-mono" style={{ color: (data?.tasks.length ?? 0) > 0 ? '#f59e0b' : '#22c55e' }}>
              {loading ? '—' : data?.tasks.length ?? 0}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>件のオープンPR</div>
          </div>
        </div>
        {data && (
          <div className="flex gap-3 mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
            <span>更新: {fmtDate(data.fetchedAt)}</span>
          </div>
        )}
      </div>

      {/* 事業フィルター */}
      {businesses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setBusinessFilter('all')}
            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{
              background: businessFilter === 'all' ? 'var(--accent-dim)' : 'var(--surface)',
              color: businessFilter === 'all' ? 'var(--accent)' : 'var(--muted)',
              border: '1px solid var(--border)',
            }}>
            すべて
          </button>
          {businesses.map(b => (
            <button key={b} onClick={() => setBusinessFilter(b)}
              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{
                background: businessFilter === b ? 'var(--accent-dim)' : 'var(--surface)',
                color: businessFilter === b ? 'var(--accent)' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}>
              {b}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>読み込み中...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(t => <TaskCard key={t.number} task={t} />)}
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>判断待ちのPRはありません</p>
        </div>
      )}

      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        ※ 事業の推測はPR内の変更ファイルパスに基づく自動判定です。誤っている場合はPR本文で直接ご確認ください。<br />
        ※ 改善レビュー自動修正（auto-fix/*）のPRは、このページと「改善レビュー」画面の両方に表示されます。承認・却下は改善レビュー画面から行ってください。
      </div>
    </div>
  );
}

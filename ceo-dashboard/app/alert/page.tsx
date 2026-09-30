'use client';

import { useEffect, useState } from 'react';
import { buildAlertItems, ReportEntry, TaskItem, FlaggedArticle, RegistryProject, ActivityInfo } from '@/lib/alerts';
import { AlertCategory, CATEGORY_LABEL, CATEGORY_COLOR, PriorityItem } from '@/lib/priority';

const REPORT_LOG_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/report-log.json';
const COLUMN_REVIEW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/column-review.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';

const CATEGORY_ORDER: AlertCategory[] = ['user_decision', 'kpi_degraded', 'ai_waiting', 'stalled', 'stale', 'next_action_unset'];
const CATEGORY_ICON: Record<AlertCategory, string> = {
  user_decision: '🙋', stalled: '🐌', stale: '🕓', kpi_degraded: '📉', next_action_unset: '📋', ai_waiting: '🤖',
};

async function confirmReport(id: string) {
  const res = await fetch('/api/reports/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status: '確認済み' }),
  });
  if (!res.ok) throw new Error(await res.text());
}

function ItemRow({ item, onConfirmReport }: { item: PriorityItem; onConfirmReport: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  const isReport = item.id.startsWith('report-');

  async function handleConfirm() {
    setBusy(true);
    try {
      await confirmReport(item.id.replace('report-', ''));
      onConfirmReport(item.id);
    } catch {
      alert('確認処理に失敗しました');
    } finally {
      setBusy(false);
    }
  }

  const content = (
    <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {item.categories.map(c => (
          <span key={c} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: CATEGORY_COLOR[c].bg, color: CATEGORY_COLOR[c].color }}>
            {CATEGORY_ICON[c]} {CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>
      <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>{item.title}</p>
      {item.detail && <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{item.detail}</p>}
      {isReport && (
        <button onClick={handleConfirm} disabled={busy}
          className="mt-2 text-[11px] font-bold rounded-md px-3 py-1.5"
          style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)', opacity: busy ? 0.6 : 1 }}>
          {busy ? '処理中...' : '✓ 確認済みにする'}
        </button>
      )}
    </div>
  );

  if (item.href && !isReport) {
    return <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block">{content}</a>;
  }
  return content;
}

export default function AlertPage() {
  const [items, setItems] = useState<PriorityItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | 'all'>('all');

  function load() {
    setError(null);
    Promise.all([
      fetch(REPORT_LOG_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/tasks', { cache: 'no-store' }).then(r => r.json()),
      fetch(COLUMN_REVIEW_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch(REGISTRY_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/projects-activity', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ activity: {} })),
    ]).then(([reportLog, tasksRes, columnReview, registry, activityRes]) => {
      const built = buildAlertItems({
        reports: (reportLog.reports ?? []) as ReportEntry[],
        tasks: (tasksRes.tasks ?? []) as TaskItem[],
        flaggedArticles: (columnReview.flaggedArticles ?? []) as FlaggedArticle[],
        projects: (registry.projects ?? []) as RegistryProject[],
        activity: (activityRes.activity ?? {}) as Record<string, ActivityInfo>,
      });
      setItems(built);
    }).catch(e => setError(e.message));
  }

  useEffect(load, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🚨 ALERT</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!items) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  function removeItem(id: string) {
    setItems(prev => prev ? prev.filter(i => i.id !== id) : prev);
  }

  const filtered = categoryFilter === 'all' ? items : items.filter(i => i.categories.includes(categoryFilter));
  const counts = CATEGORY_ORDER.reduce((acc, c) => {
    acc[c] = items.filter(i => i.categories.includes(c)).length;
    return acc;
  }, {} as Record<AlertCategory, number>);

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>ALERT</div>
            <h1 className="text-xl font-bold mb-1">🚨 自動検知　全{items.length}件</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>旧「タスク一覧」「報告一覧」はここに統合。TODAYのTOP3もここから算出しています</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setCategoryFilter('all')}
          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
          style={{
            background: categoryFilter === 'all' ? 'var(--accent-dim)' : 'var(--surface)',
            color: categoryFilter === 'all' ? 'var(--accent)' : 'var(--muted)',
            border: '1px solid var(--border)',
          }}>
          すべて（{items.length}）
        </button>
        {CATEGORY_ORDER.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)}
            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{
              background: categoryFilter === c ? CATEGORY_COLOR[c].bg : 'var(--surface)',
              color: categoryFilter === c ? CATEGORY_COLOR[c].color : 'var(--muted)',
              border: '1px solid var(--border)',
            }}>
            {CATEGORY_ICON[c]} {CATEGORY_LABEL[c]}（{counts[c]}）
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(item => <ItemRow key={item.id} item={item} onConfirmReport={removeItem} />)}
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>該当するアラートはありません</p>
        </div>
      )}
    </div>
  );
}

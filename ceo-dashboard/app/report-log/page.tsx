'use client';

import { useEffect, useMemo, useState } from 'react';

const RAW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/report-log.json';

interface ReportEntry {
  id: string;
  createdAt: string;
  business: string;
  source: string;
  summary: string;
  status: '未確認' | '確認済み';
  confirmedAt?: string;
}

interface ReportLogData {
  generatedAt: string;
  reports: ReportEntry[];
}

const KNOWN_BUSINESSES = ['lens-navi', 'school-navi', 'shikaku-navi', 'shop-navi', 'CEOダッシュボード', 'henkutsu', '雑草おじさん', '夜中のおじさん'];

const BUSINESS_COLOR: Record<string, { color: string; bg: string }> = {
  'lens-navi': { color: '#7c6ef7', bg: 'rgba(124,110,247,0.12)' },
  'school-navi': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'shikaku-navi': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'shop-navi': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'CEOダッシュボード': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  '夜中のおじさん': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};
const DEFAULT_BUSINESS_COLOR = { color: '#6b6b8a', bg: 'rgba(107,107,138,0.12)' };

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function patchStatus(id: string, status: ReportEntry['status']) {
  const res = await fetch('/api/reports/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error((await res.json()).error || '更新に失敗しました');
}

function ReportCard({ report, onChange }: { report: ReportEntry; onChange: (patch: Partial<ReportEntry>) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUnconfirmed = report.status === '未確認';
  const waiting = daysSince(report.createdAt);
  const isStale = isUnconfirmed && waiting >= 1;
  const cfg = BUSINESS_COLOR[report.business] ?? DEFAULT_BUSINESS_COLOR;

  async function toggle() {
    const next = report.status === '未確認' ? '確認済み' : '未確認';
    setSaving(true);
    setError(null);
    try {
      await patchStatus(report.id, next);
      onChange({ status: next, confirmedAt: next === '確認済み' ? new Date().toISOString() : undefined });
    } catch (e) {
      setError(e instanceof Error ? e.message : '失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl px-4 py-3"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isStale ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
        opacity: report.status === '確認済み' ? 0.75 : 1,
      }}>
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{
            background: isUnconfirmed ? (isStale ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)') : 'rgba(34,197,94,0.12)',
            color: isUnconfirmed ? (isStale ? '#ef4444' : 'var(--amber)') : '#22c55e',
          }}>
          {isUnconfirmed ? (isStale ? '🔴 未確認（要対応）' : '🟡 未確認') : '✅ 確認済み'}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: cfg.bg, color: cfg.color }}>
          {report.business}
        </span>
        {isStale && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            {waiting}日経過
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed mb-1.5" style={{ color: 'var(--text)' }}>{report.summary}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] mb-2" style={{ color: 'var(--muted)' }}>
        <span>報告元: {report.source}</span>
        <span>報告日時: {fmtDate(report.createdAt)}</span>
        {report.confirmedAt && <span>確認日時: {fmtDate(report.confirmedAt)}</span>}
      </div>

      {error && <p className="text-[11px] mb-1.5" style={{ color: '#ef4444' }}>{error}</p>}

      <button onClick={toggle} disabled={saving}
        className="text-[11px] font-bold rounded-md px-3 py-1.5"
        style={{
          background: isUnconfirmed ? 'var(--accent)' : 'var(--bg)',
          color: isUnconfirmed ? '#fff' : 'var(--muted)',
          border: isUnconfirmed ? 'none' : '1px solid var(--border)',
          opacity: saving ? 0.6 : 1,
        }}>
        {saving ? '処理中...' : isUnconfirmed ? '✓ 確認済みにする' : '未確認に戻す'}
      </button>
    </div>
  );
}

function AddReportForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [business, setBusiness] = useState(KNOWN_BUSINESSES[0]);
  const [source, setSource] = useState('');
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!summary.trim()) { alert('報告内容を入力してください'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reports/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, source, summary }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSource(''); setSummary('');
      setOpen(false);
      onAdded();
    } catch {
      alert('追加に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full rounded-xl py-3 text-sm font-medium"
        style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
        ＋ 報告を手動追加
      </button>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--accent)' }}>
      <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>報告を手動追加</div>
      <div className="flex gap-2">
        <select value={business} onChange={e => setBusiness(e.target.value)}
          className="text-[12px] rounded-md px-2 py-1.5 flex-1"
          style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          {KNOWN_BUSINESSES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <input value={source} onChange={e => setSource(e.target.value)} placeholder="報告元（例: セッション名・チャット名）"
        className="w-full text-[12px] rounded-md px-2.5 py-1.5"
        style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
      <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="報告内容の要約" rows={3}
        className="w-full text-[12px] rounded-md px-2.5 py-1.5 resize-none"
        style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={submitting}
          className="text-[12px] font-bold rounded-md px-3 py-1.5"
          style={{ background: 'var(--accent)', color: '#fff', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? '追加中...' : '追加'}
        </button>
        <button onClick={() => setOpen(false)}
          className="text-[12px] rounded-md px-3 py-1.5"
          style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default function ReportLogPage() {
  const [data, setData] = useState<ReportLogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [businessFilter, setBusinessFilter] = useState<string>('all');
  const [doneCollapsed, setDoneCollapsed] = useState(true);

  function load() {
    fetch(RAW_URL, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message));
  }

  useEffect(load, []);

  function patchLocal(id: string, patch: Partial<ReportEntry>) {
    setData(d => d ? { ...d, reports: d.reports.map(r => r.id === id ? { ...r, ...patch } : r) } : d);
  }

  const businesses = useMemo(() => {
    const set = new Set(KNOWN_BUSINESSES);
    (data?.reports ?? []).forEach(r => set.add(r.business));
    return Array.from(set);
  }, [data]);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>📮 報告一覧</h1>
      <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <p style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const filtered = businessFilter === 'all' ? data.reports : data.reports.filter(r => r.business === businessFilter);
  const unconfirmed = filtered.filter(r => r.status === '未確認')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const confirmed = filtered.filter(r => r.status === '確認済み')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const staleCount = unconfirmed.filter(r => daysSince(r.createdAt) >= 1).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Report Log</div>
            <h1 className="text-xl font-bold mb-1">📮 報告一覧</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>各コード実装チャットからの作業報告を確認できます。</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold font-mono" style={{ color: unconfirmed.length > 0 ? '#f59e0b' : '#22c55e' }}>
              {unconfirmed.length}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>件の未確認</div>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-[10px]">
          <span style={{ color: staleCount > 0 ? '#ef4444' : 'var(--muted)' }}>🔴 1日以上経過 {staleCount}件</span>
          <span style={{ color: '#22c55e' }}>✅ 確認済み {confirmed.length}件</span>
        </div>
        <div className="flex gap-3 mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
          <span>更新: {fmtDate(data.generatedAt)}</span>
        </div>
      </div>

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

      {unconfirmed.length > 0 ? (
        <div className="space-y-3">
          {unconfirmed.map(r => <ReportCard key={r.id} report={r} onChange={p => patchLocal(r.id, p)} />)}
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>未確認の報告はありません</p>
        </div>
      )}

      {confirmed.length > 0 && (
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.3)' }}
            onClick={() => setDoneCollapsed(c => !c)}>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#22c55e' }}>✅ 確認済み　{confirmed.length}件</span>
            <span className="text-[10px]" style={{ color: '#22c55e' }}>{doneCollapsed ? '▼ 展開' : '▲ 折りたたむ'}</span>
          </button>
          {!doneCollapsed && confirmed.map(r => <ReportCard key={r.id} report={r} onChange={p => patchLocal(r.id, p)} />)}
        </div>
      )}

      <AddReportForm onAdded={load} />
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';

const RAW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/column-review.json';

interface ColumnAnalysis {
  h2Count: number;
  h3Count: number;
  hasAffiliateLinks: boolean;
  ctaCount: number;
  contentChars: number;
}

interface FlaggedArticle {
  path: string;
  slug: string;
  title: string;
  metrics: {
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    affiliateClicks: number;
  };
  flags: string[];
  flagLabels: string[];
  analysis: ColumnAnalysis;
  causes: string[];
  suggestions: string[];
  status?: '未対応' | '対応済み' | '様子見';
  business?: string;
  priority?: 'high' | 'medium' | 'low';
  source?: 'auto-ga4' | 'manual';
}

interface ColumnReviewData {
  generatedAt: string;
  dataDateRange: { start: string; end: string } | null;
  flaggedCount: number;
  flaggedArticles: FlaggedArticle[];
}

const FLAG_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  bounce_rate_over_90pct: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: '高直帰率' },
  avg_session_under_10s:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '滞在短い' },
  no_affiliate_clicks:    { color: '#7c6ef7', bg: 'rgba(124,110,247,0.12)', label: 'クリックゼロ' },
};

const STATUS_CONFIG = {
  '未対応':  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: '🔴', label: '要改善' },
  '様子見':  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '⏳', label: '様子見' },
  '対応済み': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: '✅', label: '対応済み' },
} as const;

const PRIORITY_CONFIG = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: '高', order: 0 },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '中', order: 1 },
  low:    { color: '#6b6b8a', bg: 'rgba(107,107,138,0.12)', label: '低', order: 2 },
} as const;

const KNOWN_BUSINESSES = ['lens-navi', 'school-navi', 'henkutsu', '雑草おじさん', '夜中のおじさん'];

function fmt(sec: number) {
  if (sec < 60) return `${sec.toFixed(0)}秒`;
  return `${(sec / 60).toFixed(1)}分`;
}

async function patchArticle(slug: string, patch: { status?: string; priority?: string; business?: string }) {
  const res = await fetch('/api/column-review/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, ...patch }),
  });
  if (!res.ok) throw new Error(await res.text());
}

function ArticleCard({ article, onChange }: { article: FlaggedArticle; onChange: (patch: Partial<FlaggedArticle>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const status = article.status ?? '未対応';
  const statusCfg = STATUS_CONFIG[status];
  const priority = article.priority ?? 'medium';
  const priorityCfg = PRIORITY_CONFIG[priority];

  async function handleStatusChange(next: FlaggedArticle['status']) {
    if (!next) return;
    setSaving('status');
    try {
      await patchArticle(article.slug, { status: next });
      onChange({ status: next });
    } catch {
      alert('保存に失敗しました');
    } finally {
      setSaving(null);
    }
  }

  async function handlePriorityChange(next: FlaggedArticle['priority']) {
    if (!next) return;
    setSaving('priority');
    try {
      await patchArticle(article.slug, { priority: next });
      onChange({ priority: next });
    } catch {
      alert('保存に失敗しました');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${status === '未対応' ? 'var(--border)' : status === '様子見' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.2)'}`,
        opacity: status === '対応済み' ? 0.75 : 1,
      }}>

      <div className="w-full text-left px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <button className="flex-1 min-w-0 text-left" onClick={() => setIsOpen(o => !o)}>
            <div className="flex flex-wrap items-center gap-1 mb-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}>
                {statusCfg.icon} {statusCfg.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: priorityCfg.bg, color: priorityCfg.color }}>
                優先度:{priorityCfg.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                {article.business ?? 'lens-navi'}
              </span>
              {article.flagLabels.map((label, i) => {
                const key = article.flags[i];
                const cfg = FLAG_CONFIG[key] ?? { color: '#6b6b8a', bg: 'rgba(107,107,138,0.1)' };
                return (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {label}
                  </span>
                );
              })}
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
              {article.title}
            </p>
            {article.path && (
              <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>
                {article.path}
              </p>
            )}
          </button>
          <div className="shrink-0 text-right">
            {article.metrics.sessions > 0 && (
              <div className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                {article.metrics.sessions}セッション
              </div>
            )}
            <button className="text-[10px]" style={{ color: isOpen ? 'var(--accent)' : 'var(--muted)' }}
              onClick={() => setIsOpen(o => !o)}>
              {isOpen ? '▲ 閉じる' : '▼ 詳細'}
            </button>
          </div>
        </div>

        {/* 操作コントロール */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          <label className="text-[10px]" style={{ color: 'var(--muted)' }}>ステータス:</label>
          <select
            value={status}
            disabled={saving === 'status'}
            onChange={e => handleStatusChange(e.target.value as FlaggedArticle['status'])}
            className="text-[11px] rounded-md px-2 py-1"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <option value="未対応">🔴 要改善（未対応）</option>
            <option value="様子見">⏳ 様子見</option>
            <option value="対応済み">✅ 対応済み</option>
          </select>

          <label className="text-[10px] ml-2" style={{ color: 'var(--muted)' }}>優先度:</label>
          <select
            value={priority}
            disabled={saving === 'priority'}
            onChange={e => handlePriorityChange(e.target.value as FlaggedArticle['priority'])}
            className="text-[11px] rounded-md px-2 py-1"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          {saving && <span className="text-[10px]" style={{ color: 'var(--accent)' }}>保存中...</span>}
        </div>
      </div>

      {isOpen && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {article.metrics.sessions > 0 && (
            <div className="px-4 py-3 grid grid-cols-3 gap-3"
              style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
              {[
                { label: 'セッション', value: article.metrics.sessions.toString() },
                { label: '直帰率', value: `${(article.metrics.bounceRate * 100).toFixed(0)}%`, hi: article.metrics.bounceRate >= 0.9 },
                { label: '平均滞在', value: fmt(article.metrics.avgSessionDuration), hi: article.metrics.avgSessionDuration < 10 },
                { label: 'H2見出し', value: article.analysis.h2Count.toString(), lo: article.analysis.h2Count < 3 },
                { label: 'CTAボタン', value: article.analysis.ctaCount.toString(), lo: article.analysis.ctaCount === 0 },
                { label: 'AFFクリック', value: article.metrics.affiliateClicks.toString(), lo: article.metrics.affiliateClicks === 0 && article.metrics.sessions >= 5 },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <div className="text-sm font-bold font-mono"
                    style={{ color: (m as {hi?: boolean}).hi ? '#ef4444' : (m as {lo?: boolean}).lo ? '#f59e0b' : 'var(--text)' }}>
                    {m.value}
                  </div>
                  <div className="text-[9px]" style={{ color: 'var(--muted)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {status === '様子見' && (
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(245,158,11,0.05)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                AFFリンク・CTAは実装済みです。affiliate_clickデータはGA4計測開始後から蓄積されるため、しばらく経過を見てください。
              </p>
            </div>
          )}

          {article.causes.length > 0 && (
            <div className="px-4 py-3" style={{ borderBottom: article.suggestions.length > 0 ? '1px solid var(--border)' : undefined }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#ef4444' }}>🔍 内容・原因</div>
              {article.causes.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="shrink-0 text-[10px] font-mono w-4 text-center" style={{ color: '#ef4444' }}>{i + 1}.</span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {article.suggestions.length > 0 && (
            <div className="px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
                💡 改善案（チャットで「{article.slug} を改善して」と指示）
              </div>
              {article.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="shrink-0 text-[10px]" style={{ color: 'var(--accent)' }}>→</span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddIssueForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [business, setBusiness] = useState(KNOWN_BUSINESSES[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { alert('タイトルを入力してください'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/column-review/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, title, description, priority }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTitle(''); setDescription(''); setPriority('medium');
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
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl py-3 text-sm font-medium"
        style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--muted)' }}
      >
        ＋ 課題を手動追加（school-navi・henkutsu等）
      </button>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--accent)' }}>
      <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>課題を手動追加</div>
      <div className="flex gap-2">
        <select value={business} onChange={e => setBusiness(e.target.value)}
          className="text-[12px] rounded-md px-2 py-1.5 flex-1"
          style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          {KNOWN_BUSINESSES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="text-[12px] rounded-md px-2 py-1.5"
          style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          <option value="high">優先度:高</option>
          <option value="medium">優先度:中</option>
          <option value="low">優先度:低</option>
        </select>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="課題タイトル"
        className="w-full text-[12px] rounded-md px-2.5 py-1.5"
        style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="詳細（任意）" rows={2}
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

export default function ColumnReviewPage() {
  const [data, setData] = useState<ColumnReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [doneCollapsed, setDoneCollapsed] = useState(true);
  const [businessFilter, setBusinessFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'sessions'>('priority');

  function load() {
    fetch(RAW_URL, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message));
  }

  useEffect(load, []);

  function patchLocal(slug: string, patch: Partial<FlaggedArticle>) {
    setData(d => d ? {
      ...d,
      flaggedArticles: d.flaggedArticles.map(a => a.slug === slug ? { ...a, ...patch } : a),
    } : d);
  }

  const businesses = useMemo(() => {
    const set = new Set(KNOWN_BUSINESSES);
    (data?.flaggedArticles ?? []).forEach(a => set.add(a.business ?? 'lens-navi'));
    return Array.from(set);
  }, [data]);

  const sortFn = (a: FlaggedArticle, b: FlaggedArticle) => {
    if (sortBy === 'priority') {
      const pa = PRIORITY_CONFIG[a.priority ?? 'medium'].order;
      const pb = PRIORITY_CONFIG[b.priority ?? 'medium'].order;
      if (pa !== pb) return pa - pb;
    }
    return b.metrics.sessions - a.metrics.sessions;
  };

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📉 コラム改善レビュー</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          GitHub Actions「GA4アナリティクス日次取得」を手動実行してください。
        </p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>
  );

  const updatedAt = new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const filtered = businessFilter === 'all'
    ? data.flaggedArticles
    : data.flaggedArticles.filter(a => (a.business ?? 'lens-navi') === businessFilter);

  const pending  = filtered.filter(a => (a.status ?? '未対応') === '未対応').sort(sortFn);
  const watching = filtered.filter(a => a.status === '様子見').sort(sortFn);
  const done     = filtered.filter(a => a.status === '対応済み').sort(sortFn);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Column Improvement Review</div>
            <h1 className="text-xl font-bold mb-1">📉 改善レビュー</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>lens-naviはGA4データから自動検知。他事業は手動で課題を追加できます。</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold font-mono"
              style={{ color: pending.length > 0 ? '#f59e0b' : '#22c55e' }}>
              {pending.length}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>要改善</div>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-[10px]">
          <span style={{ color: '#ef4444' }}>🔴 未対応 {pending.length}件</span>
          <span style={{ color: '#f59e0b' }}>⏳ 様子見 {watching.length}件</span>
          <span style={{ color: '#22c55e' }}>✅ 対応済み {done.length}件</span>
        </div>
        <div className="flex gap-3 mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
          <span>データ更新: {updatedAt}</span>
        </div>
      </div>

      {/* 事業フィルター */}
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
        <div className="flex-1" />
        <button onClick={() => setSortBy(s => s === 'priority' ? 'sessions' : 'priority')}
          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          並び替え: {sortBy === 'priority' ? '優先度順' : 'セッション数順'}
        </button>
      </div>

      {/* Flag legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(FLAG_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* ===== 未対応 ===== */}
      {pending.length > 0 ? (
        <div className="space-y-3">
          {pending.map(a => <ArticleCard key={a.slug} article={a} onChange={p => patchLocal(a.slug, p)} />)}
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>要改善課題なし</p>
        </div>
      )}

      {/* ===== 様子見 ===== */}
      {watching.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-widest uppercase px-1" style={{ color: '#f59e0b' }}>⏳ 様子見　{watching.length}件</div>
          {watching.map(a => <ArticleCard key={a.slug} article={a} onChange={p => patchLocal(a.slug, p)} />)}
        </div>
      )}

      {/* ===== 対応済み ===== */}
      {done.length > 0 && (
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.3)' }}
            onClick={() => setDoneCollapsed(c => !c)}
          >
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#22c55e' }}>✅ 対応済み　{done.length}件</span>
            <span className="text-[10px]" style={{ color: '#22c55e' }}>{doneCollapsed ? '▼ 展開' : '▲ 折りたたむ'}</span>
          </button>
          {!doneCollapsed && done.map(a => <ArticleCard key={a.slug} article={a} onChange={p => patchLocal(a.slug, p)} />)}
        </div>
      )}

      <AddIssueForm onAdded={load} />

      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        ※ lens-naviの自動検知はGA4データから日次で更新されます。ステータス・優先度はここで直接変更できます。<br />
        ※ 改善の実施自体はCEOチャット経由で都度指示してください。
      </div>
    </div>
  );
}

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
  pendingPr?: { url: string; branch: string; prNumber: number; title: string; body: string; createdAt: string };
  autoFixNote?: { at: string; reason: string };
  autoFixMergedAt?: string;
  autoFixRejected?: { at: string; reason: string };
  execution?: string;
  result?: string;
  nextAction?: string;
}

interface ColumnReviewData {
  generatedAt: string;
  dataDateRange: { start: string; end: string } | null;
  flaggedCount: number;
  flaggedArticles: FlaggedArticle[];
}

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

const KNOWN_BUSINESSES = [
  'lens-navi', '楽旅くん', 'ペット避難', '夜中のおじさん', '出口のノート', '雑草おじさん',
  '資格サイト', '保育士比較サイト', '東京ラーメンマップ', 'Etsy', 'CEOダッシュボード',
];

function fmt(sec: number) {
  if (sec < 60) return `${sec.toFixed(0)}秒`;
  return `${(sec / 60).toFixed(1)}分`;
}

async function patchArticle(slug: string, patch: Record<string, string>) {
  const res = await fetch('/api/column-review/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, ...patch }),
  });
  if (!res.ok) throw new Error(await res.text());
}

function renderPrBodyLines(body: string) {
  return body.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <p key={i} className="text-xs font-bold mt-3 mb-1" style={{ color: 'var(--text)' }}>{line.slice(3)}</p>;
    }
    if (line.startsWith('- ')) {
      return <p key={i} className="text-xs pl-3 leading-relaxed" style={{ color: 'var(--text)' }}>・{line.slice(2)}</p>;
    }
    if (line.trim() === '---') {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />;
    }
    if (line.trim() === '') return <div key={i} style={{ height: 4 }} />;
    return <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{line}</p>;
  });
}

function PrReviewPanel({ article, onChange }: { article: FlaggedArticle; onChange: (patch: Partial<FlaggedArticle>) => void }) {
  const pr = article.pendingPr;
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  if (!pr) return null;

  async function handleApprove() {
    if (!confirm('このPRをマージして本番反映します。よろしいですか？')) return;
    setBusy('approve'); setError(null);
    try {
      const res = await fetch('/api/column-review/approve-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug, prNumber: pr!.prNumber }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'マージに失敗しました');
      onChange({ status: '対応済み', pendingPr: undefined });
    } catch (e) {
      setError(e instanceof Error ? e.message : '失敗しました');
    } finally {
      setBusy(null);
    }
  }

  async function handleReject() {
    setBusy('reject'); setError(null);
    try {
      const res = await fetch('/api/column-review/reject-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug, prNumber: pr!.prNumber, branch: pr!.branch, reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '見送り処理に失敗しました');
      onChange({ pendingPr: undefined, autoFixRejected: { at: new Date().toISOString(), reason: reason.trim() || '(理由の記載なし)' } });
      setRejecting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : '失敗しました');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(124,110,247,0.06)' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>🔀 AIによる自動修正案（レビュー待ち）</div>

      <div className="rounded-lg p-3 mb-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)', maxHeight: 320, overflowY: 'auto' }}>
        <p className="text-xs font-bold mb-2" style={{ color: 'var(--text)' }}>{pr.title}</p>
        {renderPrBodyLines(pr.body)}
      </div>

      {error && <p className="text-[11px] mb-2" style={{ color: '#ef4444' }}>{error}</p>}

      {!rejecting ? (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleApprove} disabled={busy !== null}
            className="text-xs font-bold rounded-md px-3 py-1.5"
            style={{ background: '#22c55e', color: '#fff', opacity: busy ? 0.6 : 1 }}>
            {busy === 'approve' ? '承認・マージ中...' : '✅ 承認してマージ'}
          </button>
          <button onClick={() => setRejecting(true)} disabled={busy !== null}
            className="text-xs font-bold rounded-md px-3 py-1.5"
            style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
            🚫 見送る
          </button>
          <a href={pr.url} target="_blank" rel="noopener noreferrer"
            className="text-[11px] underline" style={{ color: 'var(--muted)' }}>
            GitHubで見る
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="見送る理由（任意）" rows={2}
            className="w-full text-[12px] rounded-md px-2.5 py-1.5 resize-none"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
          <div className="flex gap-2">
            <button onClick={handleReject} disabled={busy !== null}
              className="text-xs font-bold rounded-md px-3 py-1.5"
              style={{ background: '#ef4444', color: '#fff', opacity: busy ? 0.6 : 1 }}>
              {busy === 'reject' ? '処理中...' : 'PRをクローズして見送る'}
            </button>
            <button onClick={() => setRejecting(false)} disabled={busy !== null}
              className="text-xs rounded-md px-3 py-1.5"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PdcaField({
  label, value, placeholder, allowEmpty, onSave,
}: {
  label: string;
  value: string;
  placeholder: string;
  allowEmpty?: boolean;
  onSave: (v: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{label}</span>
        {!editing && (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px]" style={{ color: 'var(--muted)' }}>✏️編集</button>
        )}
      </div>
      {editing ? (
        <div className="space-y-1.5">
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2} placeholder={placeholder}
            className="w-full text-[12px] rounded-md px-2 py-1.5 resize-none"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
          <div className="flex gap-2">
            <button onClick={save} disabled={saving || (!allowEmpty && !draft.trim())}
              className="text-[11px] font-bold rounded-md px-2.5 py-1"
              style={{ background: 'var(--accent)', color: '#fff', opacity: saving ? 0.6 : 1 }}>
              {saving ? '保存中...' : '保存'}
            </button>
            <button onClick={() => setEditing(false)} className="text-[11px] rounded-md px-2.5 py-1"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed" style={{ color: value ? 'var(--text)' : 'var(--muted)' }}>
          {value || placeholder}
        </p>
      )}
    </div>
  );
}

function ArticleCard({ article, onChange }: { article: FlaggedArticle; onChange: (patch: Partial<FlaggedArticle>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const status = article.status ?? '未対応';
  const statusCfg = STATUS_CONFIG[status];
  const priority = article.priority ?? 'medium';
  const priorityCfg = PRIORITY_CONFIG[priority];
  const nextActionUnset = !article.nextAction?.trim();

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
              {article.pendingPr && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(124,110,247,0.15)', color: 'var(--accent)' }}>
                  🔀 AI修正PRレビュー待ち
                </span>
              )}
              {nextActionUnset && status !== '対応済み' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(107,107,138,0.15)', color: '#8b899e' }}>
                  次アクション未設定
                </span>
              )}
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
              {article.title}
            </p>
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

        <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          <label className="text-[10px]" style={{ color: 'var(--muted)' }}>ステータス:</label>
          <select value={status} disabled={saving === 'status'}
            onChange={e => handleStatusChange(e.target.value as FlaggedArticle['status'])}
            className="text-[11px] rounded-md px-2 py-1"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            <option value="未対応">🔴 要改善（未対応）</option>
            <option value="様子見">⏳ 様子見</option>
            <option value="対応済み">✅ 対応済み</option>
          </select>

          <label className="text-[10px] ml-2" style={{ color: 'var(--muted)' }}>優先度:</label>
          <select value={priority} disabled={saving === 'priority'}
            onChange={e => handlePriorityChange(e.target.value as FlaggedArticle['priority'])}
            className="text-[11px] rounded-md px-2 py-1"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
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

          {article.pendingPr && <PrReviewPanel article={article} onChange={onChange} />}

          {/* 仮説→実行→結果→改善案→次のアクション */}
          <div className="px-4 py-3 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>仮説（原因分析）</div>
              {article.causes.length > 0 ? article.causes.map((c, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>・{c}</p>
              )) : <p className="text-xs" style={{ color: 'var(--muted)' }}>未記入</p>}
            </div>

            <PdcaField
              label="実行"
              value={article.execution ?? ''}
              placeholder="実行した内容（AI修正PRが承認されると自動記録されます）"
              allowEmpty
              onSave={async v => { await patchArticle(article.slug, { execution: v }); onChange({ execution: v }); }}
            />

            <PdcaField
              label="結果"
              value={article.result ?? ''}
              placeholder="（空欄可・自動生成しません。振り返ったときに記入してください）"
              allowEmpty
              onSave={async v => { await patchArticle(article.slug, { result: v }); onChange({ result: v }); }}
            />

            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>改善案</div>
              {article.suggestions.length > 0 ? article.suggestions.map((s, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>→ {s}</p>
              )) : <p className="text-xs" style={{ color: 'var(--muted)' }}>未記入</p>}
            </div>

            <PdcaField
              label="次のアクション"
              value={article.nextAction ?? ''}
              placeholder="（空欄のままだとALERT「次のアクション未設定」で検知されます）"
              allowEmpty
              onSave={async v => { await patchArticle(article.slug, { nextAction: v }); onChange({ nextAction: v }); }}
            />
          </div>

          {article.autoFixRejected && !article.pendingPr && (
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(107,107,138,0.06)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>🚫 AI自動修正PRを見送りました</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{article.autoFixRejected.reason}</p>
            </div>
          )}

          {article.autoFixNote && !article.pendingPr && !article.autoFixRejected && (
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(107,107,138,0.06)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>🤖 自動修正は見送りました</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{article.autoFixNote.reason}</p>
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
  const [nextAction, setNextAction] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) { alert('タイトルを入力してください'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/column-review/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, title, description, priority, nextAction }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTitle(''); setDescription(''); setNextAction(''); setPriority('medium');
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
        ＋ PDCAを手動追加
      </button>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--accent)' }}>
      <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>PDCAを手動追加</div>
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
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル"
        className="w-full text-[12px] rounded-md px-2.5 py-1.5"
        style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="仮説（任意）" rows={2}
        className="w-full text-[12px] rounded-md px-2.5 py-1.5 resize-none"
        style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
      <input value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="次のアクション（任意・空欄でも可）"
        className="w-full text-[12px] rounded-md px-2.5 py-1.5"
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

export default function PdcaPage() {
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
      <h1 className="text-xl font-bold mb-4">🔁 PDCA</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const updatedAt = new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const filtered = businessFilter === 'all'
    ? data.flaggedArticles
    : data.flaggedArticles.filter(a => (a.business ?? 'lens-navi') === businessFilter);

  const pending  = filtered.filter(a => (a.status ?? '未対応') === '未対応').sort(sortFn);
  const watching = filtered.filter(a => a.status === '様子見').sort(sortFn);
  const done     = filtered.filter(a => a.status === '対応済み').sort(sortFn);

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>PDCA</div>
            <h1 className="text-xl font-bold mb-1">🔁 仮説→実行→結果→改善案→次のアクション</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>lens-naviはGA4データから自動検知。他プロジェクトは手動で追加できます。「結果」は自動生成しません（空欄可）</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold font-mono" style={{ color: pending.length > 0 ? '#f59e0b' : '#22c55e' }}>{pending.length}</div>
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

      {watching.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-widest uppercase px-1" style={{ color: '#f59e0b' }}>⏳ 様子見　{watching.length}件</div>
          {watching.map(a => <ArticleCard key={a.slug} article={a} onChange={p => patchLocal(a.slug, p)} />)}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.3)' }}
            onClick={() => setDoneCollapsed(c => !c)}>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#22c55e' }}>✅ 対応済み　{done.length}件</span>
            <span className="text-[10px]" style={{ color: '#22c55e' }}>{doneCollapsed ? '▼ 展開' : '▲ 折りたたむ'}</span>
          </button>
          {!doneCollapsed && done.map(a => <ArticleCard key={a.slug} article={a} onChange={p => patchLocal(a.slug, p)} />)}
        </div>
      )}

      <AddIssueForm onAdded={load} />

      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        ※ lens-naviの自動検知はGA4データから日次で更新されます。<br />
        ※ AI自動修正PRが承認・マージされると「実行」欄に承認日時・変更内容が自動記録されます。<br />
        ※ 「結果」欄が空欄のままの項目はALERT「次のアクション未設定」で検知されます。
      </div>
    </div>
  );
}

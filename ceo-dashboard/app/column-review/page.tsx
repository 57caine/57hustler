'use client';

import { useEffect, useState } from 'react';

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

function fmt(sec: number) {
  if (sec < 60) return `${sec.toFixed(0)}秒`;
  return `${(sec / 60).toFixed(1)}分`;
}

export default function ColumnReviewPage() {
  const [data, setData] = useState<ColumnReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/column-review.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📉 コラム改善レビュー</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          GitHub Actions「GA4アナリティクス週次取得」を手動実行してください。
        </p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>
  );

  const updatedAt = new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #0d1830 100%)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Column Improvement Review</div>
            <h1 className="text-xl font-bold mb-1">📉 コラム改善レビュー</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>GA4データから要改善記事を自動検知・分析。実行はチャット経由で指示してください。</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold font-mono"
              style={{ color: data.flaggedCount > 0 ? '#f59e0b' : '#22c55e' }}>
              {data.flaggedCount}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>要改善記事</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 text-[10px]" style={{ color: 'var(--muted)' }}>
          <span>更新: {updatedAt}</span>
          {data.dataDateRange && <span>対象期間: 過去28日</span>}
        </div>
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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
          style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          検知基準: 直帰率≥90% / 滞在&lt;10秒 / 5セッション以上でクリックゼロ
        </div>
      </div>

      {data.flaggedCount === 0 && (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>要改善記事なし</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>すべての計測記事が閾値をクリアしています</p>
        </div>
      )}

      {/* Article list */}
      <div className="space-y-3">
        {data.flaggedArticles.map((article) => {
          const isOpen = expanded === article.slug;
          return (
            <div key={article.slug}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

              {/* Summary row */}
              <button
                className="w-full text-left px-4 py-3"
                onClick={() => setExpanded(isOpen ? null : article.slug)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Flags */}
                    <div className="flex flex-wrap gap-1 mb-1.5">
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
                    <p className="text-sm font-medium leading-snug truncate" style={{ color: 'var(--text)' }}>
                      {article.title}
                    </p>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>
                      {article.path}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                      {article.metrics.sessions}セッション
                    </div>
                    <div className="text-[10px]" style={{ color: isOpen ? 'var(--accent)' : 'var(--muted)' }}>
                      {isOpen ? '▲ 閉じる' : '▼ 詳細'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Detail panel */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {/* Metrics */}
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
                          style={{ color: m.hi ? '#ef4444' : m.lo ? '#f59e0b' : 'var(--text)' }}>
                          {m.value}
                        </div>
                        <div className="text-[9px]" style={{ color: 'var(--muted)' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Content analysis */}
                  <div className="px-4 py-3 flex flex-wrap gap-2 text-[10px]"
                    style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                    <span className="px-2 py-0.5 rounded"
                      style={{ background: article.analysis.hasAffiliateLinks ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)',
                               color: article.analysis.hasAffiliateLinks ? '#22c55e' : '#ef4444' }}>
                      {article.analysis.hasAffiliateLinks ? '✓ AFFリンクあり' : '✗ AFFリンクなし'}
                    </span>
                    <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
                      本文 {article.analysis.contentChars > 0 ? `${Math.round(article.analysis.contentChars / 1000)}KB` : '未取得'}
                    </span>
                  </div>

                  {/* Causes */}
                  {article.causes.length > 0 && (
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#ef4444' }}>
                        🔍 考えられる原因
                      </div>
                      {article.causes.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <span className="shrink-0 text-[10px] font-mono w-4 text-center" style={{ color: '#ef4444' }}>{i + 1}.</span>
                          <span className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
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
        })}
      </div>

      {/* Note */}
      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        ※ 実行ボタンなし。改善の実施はCEOチャット経由で都度指示してください。<br />
        ※ affiliate_clickデータはGA4計測開始後（2026-07-28〜）から蓄積されます。
      </div>
    </div>
  );
}

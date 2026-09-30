'use client';

import { useEffect, useState } from 'react';
import { buildAlertItems, ReportEntry, TaskItem, FlaggedArticle, RegistryProject, ActivityInfo } from '@/lib/alerts';
import { topN, CATEGORY_LABEL, CATEGORY_COLOR, AlertCategory, PriorityItem } from '@/lib/priority';

const REPORT_LOG_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/report-log.json';
const COLUMN_REVIEW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/column-review.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';
const GA4_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ga4-analytics.json';

const CATEGORY_ICON: Record<AlertCategory, string> = {
  user_decision: '🙋', stalled: '🐌', stale: '🕓', kpi_degraded: '📉', next_action_unset: '📋', ai_waiting: '🤖',
};

interface Ga4Site { siteName: string; totalSessions: number; dateRange: { start: string; end: string } }

export default function TodayPage() {
  const [items, setItems] = useState<PriorityItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ga4, setGa4] = useState<Ga4Site[] | null>(null);
  const [activeCount, setActiveCount] = useState<{ active: number; stopped: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(REPORT_LOG_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/tasks', { cache: 'no-store' }).then(r => r.json()),
      fetch(COLUMN_REVIEW_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch(REGISTRY_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/projects-activity', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ activity: {} })),
      fetch(GA4_URL, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]).then(([reportLog, tasksRes, columnReview, registry, activityRes, ga4Res]) => {
      const projects = (registry.projects ?? []) as RegistryProject[];
      const built = buildAlertItems({
        reports: (reportLog.reports ?? []) as ReportEntry[],
        tasks: (tasksRes.tasks ?? []) as TaskItem[],
        flaggedArticles: (columnReview.flaggedArticles ?? []) as FlaggedArticle[],
        projects,
        activity: (activityRes.activity ?? {}) as Record<string, ActivityInfo>,
      });
      setItems(built);
      setActiveCount({
        active: projects.filter(p => p.status === 'active').length,
        stopped: projects.filter(p => p.status === 'stopped').length,
      });
      if (ga4Res?.sites) setGa4(ga4Res.sites as Ga4Site[]);
    }).catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🎯 TODAY</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!items || !activeCount) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const top3 = topN(items, 3);
  const byCategory = (c: AlertCategory) => items.filter(i => i.categories.includes(c));

  const lensNavi = ga4?.find(s => s.siteName === 'lens-navi');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>57hustler CEO Dashboard</div>
        <h1 className="text-xl font-bold">今日やることTOP3</h1>
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
          【フェーズ2】ALERT検知の重複度・深刻度による代理指標で並べています（優先度スコアエンジン完成後に差し替え予定）
        </p>
      </div>

      {top3.length > 0 ? (
        <div className="space-y-2.5">
          {top3.map((item, i) => (
            <a key={item.id} href={item.href ?? '/alert'} target={item.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
              className="block rounded-xl px-4 py-3.5"
              style={{ background: 'var(--surface)', border: '1px solid rgba(124,110,247,0.4)' }}>
              <div className="flex items-start gap-3">
                <div className="text-xl font-extrabold w-6 text-center shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.title}</p>
                  {item.detail && <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{item.detail}</p>}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.categories.map(c => (
                      <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: CATEGORY_COLOR[c].bg, color: CATEGORY_COLOR[c].color }}>
                        {CATEGORY_ICON[c]} {CATEGORY_LABEL[c]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>今日やるべき緊急事項はありません</p>
        </div>
      )}

      {/* サマリー行：ALERT各カテゴリ + 収益 + プロジェクト稼働数 */}
      <div className="grid grid-cols-2 gap-2.5">
        <a href="/alert" className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>🙋 ユーザー判断待ち</div>
          <div className="text-xl font-bold mt-1" style={{ color: byCategory('user_decision').length > 0 ? '#7c6ef7' : 'var(--text)' }}>
            {byCategory('user_decision').length}
          </div>
        </a>
        <a href="/alert" className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>🤖 AI作業待ち</div>
          <div className="text-xl font-bold mt-1" style={{ color: byCategory('ai_waiting').length > 0 ? '#22c55e' : 'var(--text)' }}>
            {byCategory('ai_waiting').length}
          </div>
        </a>
        <a href="/alert" className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>🐌 長期間停滞</div>
          <div className="text-xl font-bold mt-1" style={{ color: byCategory('stalled').length > 0 ? '#f59e0b' : 'var(--text)' }}>
            {byCategory('stalled').length}
          </div>
        </a>
        <a href="/alert" className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>🕓 未更新</div>
          <div className="text-xl font-bold mt-1" style={{ color: byCategory('stale').length > 0 ? '#ef4444' : 'var(--text)' }}>
            {byCategory('stale').length}
          </div>
        </a>
      </div>

      {/* 緊急ALERT（KPI悪化）の詳細行 */}
      {byCategory('kpi_degraded').length > 0 && (
        <a href="/alert" className="block rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div className="text-[10px] font-bold" style={{ color: '#ef4444' }}>📉 緊急ALERT（KPI悪化） {byCategory('kpi_degraded').length}件</div>
          <p className="text-xs mt-1" style={{ color: 'var(--text)' }}>{byCategory('kpi_degraded')[0]?.title}</p>
        </a>
      )}

      {/* 現在の収益状況 */}
      <a href="/money" className="block rounded-xl px-4 py-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>💰 現在の収益状況</div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>今月収益（全プロジェクト）</span>
          <span className="text-sm font-bold" style={{ color: '#5c5a70' }}>収集前</span>
        </div>
        {lensNavi && (
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>レンズナビ 流入（{lensNavi.dateRange.start}）</span>
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--text)' }}>{lensNavi.totalSessions}セッション</span>
          </div>
        )}
        <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>詳細を見る →</div>
      </a>

      <a href="/projects" className="block rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>📁 プロジェクト</div>
        <div className="text-sm font-bold mt-1">
          <span style={{ color: '#22c55e' }}>{activeCount.active}</span> 稼働中 ／
          <span style={{ color: '#5c5a70' }}> {activeCount.stopped}</span> 停止中
        </div>
      </a>

      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        TODAYは「今日決めること」だけ。一覧性はALERT・PROJECTS側で担保します
      </div>
    </div>
  );
}

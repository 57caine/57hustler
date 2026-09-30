'use client';

import { useEffect, useState } from 'react';
import { buildAlertItems, ReportEntry, TaskItem, FlaggedArticle, RegistryProject as BaseRegistryProject, ActivityInfo, daysSince } from '@/lib/alerts';
import { CATEGORY_LABEL, CATEGORY_COLOR, AlertCategory } from '@/lib/priority';

const REPORT_LOG_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/report-log.json';
const COLUMN_REVIEW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/column-review.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';
const GA4_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ga4-analytics.json';

interface RegistryProject extends BaseRegistryProject {
  purpose: string;
  assignedAI: string;
  funnel: { inflow: string; middle: string; cv: string; final: string };
  dataSource: string;
  ga4PropertyId?: string;
}

interface Ga4Site { siteName: string; totalSessions: number; totalPageviews: number }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<RegistryProject[] | null>(null);
  const [alertsBySlug, setAlertsBySlug] = useState<Record<string, AlertCategory[]>>({});
  const [activity, setActivity] = useState<Record<string, ActivityInfo>>({});
  const [ga4, setGa4] = useState<Ga4Site[]>([]);
  const [flagged, setFlagged] = useState<FlaggedArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showStopped, setShowStopped] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(REGISTRY_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch(REPORT_LOG_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/tasks', { cache: 'no-store' }).then(r => r.json()),
      fetch(COLUMN_REVIEW_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/projects-activity', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ activity: {} })),
      fetch(GA4_URL, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]).then(([registry, reportLog, tasksRes, columnReview, activityRes, ga4Res]) => {
      const projs = (registry.projects ?? []) as RegistryProject[];
      const flags = (columnReview.flaggedArticles ?? []) as FlaggedArticle[];
      setProjects(projs);
      setFlagged(flags);
      setActivity((activityRes.activity ?? {}) as Record<string, ActivityInfo>);
      if (ga4Res?.sites) setGa4(ga4Res.sites as Ga4Site[]);

      const items = buildAlertItems({
        reports: (reportLog.reports ?? []) as ReportEntry[],
        tasks: (tasksRes.tasks ?? []) as TaskItem[],
        flaggedArticles: flags,
        projects: projs,
        activity: (activityRes.activity ?? {}) as Record<string, ActivityInfo>,
      });
      const map: Record<string, AlertCategory[]> = {};
      for (const it of items) {
        if (it.projectSlug) map[it.projectSlug] = it.categories;
      }
      setAlertsBySlug(map);
    }).catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📁 PROJECTS</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!projects) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const active = projects.filter(p => p.status === 'active');
  const stopped = projects.filter(p => p.status === 'stopped');

  function ProjectCard({ p }: { p: RegistryProject }) {
    const cats = alertsBySlug[p.slug] ?? [];
    const act = activity[p.slug];
    const site = p.ga4PropertyId ? ga4.find(s => s.siteName === p.slug) : undefined;
    const hasNextAction = flagged.some(a => a.business === p.businessKey && a.nextAction?.trim());
    const nextActionText = flagged.find(a => a.business === p.businessKey && a.nextAction?.trim())?.nextAction;

    return (
      <a href={`/projects/${p.slug}`} className="block rounded-xl px-4 py-3.5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{p.name}</div>
            <div className="text-[10px] mt-0.5" style={{ color: p.status === 'active' ? '#22c55e' : '#5c5a70' }}>
              {p.status === 'active' ? '🟢稼働中' : '⏸停止中'}
            </div>
          </div>
          {cats.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
              {cats.slice(0, 2).map(c => (
                <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap"
                  style={{ background: CATEGORY_COLOR[c].bg, color: CATEGORY_COLOR[c].color }}>
                  {CATEGORY_LABEL[c]}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>該当なし</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <div><span style={{ color: 'var(--muted)' }}>収益: </span><span style={{ color: '#5c5a70' }}>準備中</span></div>
          <div><span style={{ color: 'var(--muted)' }}>流入: </span>
            <span style={{ color: site ? 'var(--text)' : '#5c5a70' }}>{site ? `${site.totalSessions}セッション` : '未取得'}</span>
          </div>
          <div><span style={{ color: 'var(--muted)' }}>CV: </span><span style={{ color: '#5c5a70' }}>未取得</span></div>
          <div><span style={{ color: 'var(--muted)' }}>担当AI: </span><span style={{ color: 'var(--text)' }}>{p.assignedAI}</span></div>
          <div className="col-span-2"><span style={{ color: 'var(--muted)' }}>次のアクション: </span>
            <span style={{ color: hasNextAction ? 'var(--text)' : '#5c5a70' }}>{hasNextAction ? nextActionText : '未設定'}</span>
          </div>
          <div className="col-span-2"><span style={{ color: 'var(--muted)' }}>最終更新: </span>
            <span style={{ color: 'var(--text)' }}>
              {act?.lastRunAt ? `${daysSince(act.lastRunAt)}日前${act.lastRunConclusion === 'failure' ? '（失敗）' : ''}` : 'データなし'}
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>PROJECTS</div>
        <h1 className="text-xl font-bold">全{projects.length}プロジェクト</h1>
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>収益・CVは自動取得できるものだけ表示。取得できないものはダミー値を入れず「未取得」と表示します</p>
      </div>

      <div className="space-y-3">
        <div className="text-[11px] font-bold tracking-widest uppercase px-1" style={{ color: '#22c55e' }}>🟢 稼働中　{active.length}</div>
        {active.map(p => <ProjectCard key={p.slug} p={p} />)}
      </div>

      <div className="space-y-3">
        <button onClick={() => setShowStopped(s => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>⏸ 停止中　{stopped.length}</span>
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{showStopped ? '▲ 折りたたむ' : '▼ 展開'}</span>
        </button>
        {showStopped && stopped.map(p => <ProjectCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { daysSince, ActivityInfo, FlaggedArticle } from '@/lib/alerts';

const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';
const COLUMN_REVIEW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/column-review.json';
const GA4_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ga4-analytics.json';

interface RegistryProject {
  slug: string;
  businessKey: string;
  name: string;
  status: 'active' | 'stopped';
  assignedAI: string;
  purpose: string;
  currentState: string;
  funnel: { inflow: string; middle: string; cv: string; final: string };
  dataSource: string;
  ga4PropertyId?: string;
  workflowFile: string | null;
  notes: string;
}

interface Ga4Site {
  siteName: string;
  totalSessions: number;
  totalPageviews: number;
  dateRange: { start: string; end: string };
  topPages: { path: string; sessions: number }[];
}

function Step({ n, label, color, children }: { n: number; label: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl px-4 py-3.5" style={{ background: 'var(--surface)', border: `1px solid ${color ?? 'var(--border)'}` }}>
      <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: color ?? 'var(--accent)' }}>
        {n}. {label}
      </div>
      {children}
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<RegistryProject | null>(null);
  const [ga4, setGa4] = useState<Ga4Site | null>(null);
  const [pdcaEntries, setPdcaEntries] = useState<FlaggedArticle[]>([]);
  const [activity, setActivity] = useState<ActivityInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(REGISTRY_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch(COLUMN_REVIEW_URL, { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/projects-activity', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ activity: {} })),
      fetch(GA4_URL, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]).then(([registry, columnReview, activityRes, ga4Res]) => {
      const proj = (registry.projects ?? []).find((p: RegistryProject) => p.slug === params.slug) ?? null;
      if (!proj) { setNotFound(true); return; }
      setProject(proj);
      const entries = ((columnReview.flaggedArticles ?? []) as FlaggedArticle[]).filter(a => a.business === proj.businessKey);
      setPdcaEntries(entries);
      setActivity((activityRes.activity ?? {})[proj.slug] ?? null);
      if (proj.ga4PropertyId && ga4Res?.sites) {
        setGa4(ga4Res.sites.find((s: Ga4Site) => s.siteName === proj.slug) ?? null);
      }
    }).catch(e => setError(e.message));
  }, [params.slug]);

  if (error) return (
    <div className="p-6">
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="p-6">
      <a href="/projects" className="text-xs" style={{ color: 'var(--muted)' }}>← プロジェクト一覧</a>
      <p className="text-sm mt-4" style={{ color: 'var(--muted)' }}>該当するプロジェクトが見つかりませんでした（slug: {params.slug}）</p>
    </div>
  );

  if (!project) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const latestNextAction = pdcaEntries.find(e => e.nextAction?.trim())?.nextAction;

  return (
    <div className="space-y-4 pb-10">
      <div>
        <a href="/projects" className="text-[11px]" style={{ color: 'var(--muted)' }}>← プロジェクト一覧</a>
        <div className="flex items-center gap-2 mt-1.5">
          <h1 className="text-xl font-bold">{project.name}</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{
              background: project.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(107,107,138,0.15)',
              color: project.status === 'active' ? '#22c55e' : '#8b899e',
            }}>
            {project.status === 'active' ? '🟢稼働中' : '⏸停止中'}
          </span>
        </div>
      </div>

      <Step n={1} label="目的">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{project.purpose}</p>
      </Step>

      <Step n={2} label="現在の状態">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{project.currentState}</p>
        {activity && (
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--muted)' }}>
            最終活動: {activity.lastRunAt ? `${daysSince(activity.lastRunAt)}日前` : 'データなし'}
            {activity.lastRunConclusion === 'failure' && <span style={{ color: '#ef4444' }}> ・直近の自動実行が失敗</span>}
          </p>
        )}
      </Step>

      <Step n={3} label="KPI">
        {ga4 ? (
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>{ga4.totalSessions}</div><div className="text-[9px]" style={{ color: 'var(--muted)' }}>セッション（{ga4.dateRange.start}）</div></div>
            <div><div className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>{ga4.totalPageviews}</div><div className="text-[9px]" style={{ color: 'var(--muted)' }}>PV</div></div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#5c5a70' }}>未取得（GA4等のデータ連携なし）</p>
        )}
      </Step>

      <Step n={4} label="ファネル（流入→中間→CV→最終）">
        <div className="flex flex-col gap-1.5 text-[12px]">
          <div><span style={{ color: 'var(--accent)' }}>流入</span> <span style={{ color: 'var(--text)' }}>{project.funnel.inflow}</span></div>
          <div style={{ color: 'var(--muted)' }}>↓</div>
          <div><span style={{ color: 'var(--accent)' }}>中間</span> <span style={{ color: 'var(--text)' }}>{project.funnel.middle}</span></div>
          <div style={{ color: 'var(--muted)' }}>↓</div>
          <div><span style={{ color: 'var(--accent)' }}>CV</span> <span style={{ color: 'var(--text)' }}>{project.funnel.cv}</span></div>
          <div style={{ color: 'var(--muted)' }}>↓</div>
          <div><span style={{ color: 'var(--accent)' }}>最終</span> <span style={{ color: 'var(--text)' }}>{project.funnel.final}</span></div>
        </div>
      </Step>

      <Step n={5} label="問題" color="rgba(239,68,68,0.35)">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{project.notes}</p>
      </Step>

      <Step n={6} label="仮説">
        {pdcaEntries.length > 0 ? (
          <div className="space-y-1">
            {pdcaEntries.flatMap(e => e.causes).slice(0, 3).map((c, i) => (
              <p key={i} className="text-xs" style={{ color: 'var(--text)' }}>・{c}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#5c5a70' }}>PDCA記録なし</p>
        )}
      </Step>

      <Step n={7} label="PDCA">
        {pdcaEntries.length > 0 ? (
          <div className="space-y-2">
            {pdcaEntries.map(e => (
              <div key={e.slug} className="text-[11px] rounded-lg px-2.5 py-2" style={{ background: 'var(--bg)' }}>
                <p style={{ color: 'var(--text)' }}>{e.title}</p>
                <p style={{ color: 'var(--muted)' }}>実行: {e.execution || '未実行'} ／ 結果: {e.result || '（空欄）'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#5c5a70' }}>記録なし</p>
        )}
        <a href="/pdca" className="text-[10px] mt-2 inline-block" style={{ color: 'var(--accent)' }}>PDCA画面で編集 →</a>
      </Step>

      <Step n={8} label="次のアクション" color={latestNextAction ? 'var(--border)' : 'rgba(239,68,68,0.35)'}>
        <p className="text-sm leading-relaxed" style={{ color: latestNextAction ? 'var(--text)' : '#ef4444' }}>
          {latestNextAction || '未設定（ALERTで検知されます）'}
        </p>
      </Step>

      <Step n={9} label="担当AI">
        <p className="text-sm" style={{ color: 'var(--text)' }}>{project.assignedAI}</p>
      </Step>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const GA4_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ga4-analytics.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';

interface PageMetrics { path: string; sessions: number; pageviews: number; bounceRate: number }
interface Ga4Site {
  siteName: string;
  label: string;
  dateRange: { start: string; end: string };
  totalSessions: number;
  totalPageviews: number;
  topPages: PageMetrics[];
  affiliateClicksByPage?: Record<string, number>;
}
interface RegistryProject { slug: string; name: string; status: 'active' | 'stopped' }

function fmtPct(n: number) { return `${(n * 100).toFixed(1)}%`; }

export default function MoneyPage() {
  const [sites, setSites] = useState<Ga4Site[] | null>(null);
  const [projects, setProjects] = useState<RegistryProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(GA4_URL, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(REGISTRY_URL, { cache: 'no-store' }).then(r => r.json()),
    ]).then(([ga4, registry]) => {
      setSites(ga4.sites ?? []);
      setProjects(registry.projects ?? []);
    }).catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💰 MONEY</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!sites) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const lensNavi = sites.find(s => s.siteName === 'lens-navi');
  const otherActiveProjects = projects.filter(p => p.status === 'active' && p.slug !== 'lens-navi');

  const totalClicks = lensNavi?.affiliateClicksByPage
    ? Object.values(lensNavi.affiliateClicksByPage).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-5 pb-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>MONEY</div>
        <h1 className="text-xl font-bold">収益ダッシュボード</h1>
      </div>

      <div className="flex gap-2.5">
        <div className="flex-1 rounded-xl p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>今月収益（全プロジェクト）</div>
          <div className="text-xl font-bold mt-1" style={{ color: '#5c5a70' }}>収集前</div>
        </div>
        <div className="flex-1 rounded-xl p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>前月収益</div>
          <div className="text-xl font-bold mt-1" style={{ color: '#5c5a70' }}>収集前</div>
        </div>
      </div>
      <div className="rounded-xl p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>目標との差</div>
        <div className="text-base font-bold mt-1" style={{ color: '#5c5a70' }}>目標未設定</div>
      </div>

      {/* プロジェクト別収益 */}
      <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid rgba(124,110,247,0.3)' }}>
        <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>プロジェクト別収益</div>

        {lensNavi && (
          <div className="pb-3 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>レンズナビ（アフィリエイト）</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div><div className="text-base font-bold font-mono" style={{ color: 'var(--text)' }}>{totalClicks}</div><div className="text-[9px]" style={{ color: 'var(--muted)' }}>クリック</div></div>
              <div><div className="text-base font-bold font-mono" style={{ color: '#5c5a70' }}>未取得</div><div className="text-[9px]" style={{ color: 'var(--muted)' }}>CV</div></div>
              <div><div className="text-base font-bold font-mono" style={{ color: '#5c5a70' }}>—</div><div className="text-[9px]" style={{ color: 'var(--muted)' }}>CVR</div></div>
            </div>
            <p className="text-[9px] mt-2" style={{ color: 'var(--muted)' }}>
              クリック数はaffiliate_clickイベント（rel=&quot;sponsored&quot;リンククリック）の実測値。CV（実際の成約）は各ASP管理画面のレポートと突き合わせる仕組みが未整備
            </p>
          </div>
        )}

        {otherActiveProjects.map(p => (
          <div key={p.slug} className="flex items-center justify-between py-1.5">
            <span className="text-xs" style={{ color: 'var(--text)' }}>{p.name}</span>
            <span className="text-[11px]" style={{ color: '#5c5a70' }}>準備中</span>
          </div>
        ))}
      </div>

      {/* lens-navi ページ別（既存アナリティクス機能を移設） */}
      {lensNavi && (
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>レンズナビ ページ別（上位10）</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  <th className="text-left p-1.5" style={{ color: 'var(--muted)' }}>ページ</th>
                  <th className="text-right p-1.5" style={{ color: 'var(--muted)' }}>セッション</th>
                  <th className="text-right p-1.5" style={{ color: 'var(--muted)' }}>クリック</th>
                </tr>
              </thead>
              <tbody>
                {lensNavi.topPages.slice(0, 10).map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-1.5 font-mono truncate max-w-[160px]" style={{ color: 'var(--text)' }}>{p.path}</td>
                    <td className="p-1.5 text-right" style={{ color: 'var(--text)' }}>{p.sessions}</td>
                    <td className="p-1.5 text-right" style={{ color: 'var(--muted)' }}>{lensNavi.affiliateClicksByPage?.[p.path] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] mt-2" style={{ color: 'var(--muted)' }}>合計セッション数はサイト全体の実数（{lensNavi.totalSessions}）。上表は上位10ページのみの内訳です</p>
        </div>
      )}

      <div className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>
        実装順序: ① GA4集計バグ修正（対応済み・2026-09-30）→ ② 各ASP成果レポートの自動取得 → ③ 目標値の設定
      </div>
    </div>
  );
}

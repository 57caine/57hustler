'use client';
import { useEffect, useState } from 'react';

// public/ga4-analytics.json はビルド時に固定されるため、デプロイが止まっていると
// 古いデータのまま更新されなくなる。常に最新化するため、日次で更新される
// GitHub上のdata/ga4-analytics.jsonをリクエスト時に直接取得する
const RAW_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ga4-analytics.json';

interface PageMetrics {
  path: string;
  sessions: number;
  pageviews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

interface SiteData {
  propertyId: string;
  siteName: string;
  label: string;
  fetchedAt: string;
  dateRange: { start: string; end: string };
  totalSessions: number;
  totalPageviews: number;
  topPages: PageMetrics[];
  weeklyTrend: { date: string; sessions: number }[];
  affiliateClicksByPage?: Record<string, number>;
}

interface AnalyticsData {
  generatedAt: string;
  sites: SiteData[];
}

function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(RAW_URL, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>📊 Analytics</h1>
      <div className="rounded-lg p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <p style={{ color: '#ef4444' }}>データ未取得: {error}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>GitHub Actions「GA4アナリティクス日次取得」を手動実行してください。</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  const last7Days = (site: SiteData) => site.weeklyTrend.slice(-7);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>📊 Analytics</h1>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          更新: {new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </span>
      </div>

      {data.sites.map(site => {
        const clicksByPage = site.affiliateClicksByPage ?? {};
        return (
          <section key={site.siteName} className="rounded-xl p-4" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>{site.label}</h2>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(124,110,247,0.12)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{site.totalSessions.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>セッション数（28日）</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(34,197,94,0.12)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--green)' }}>{site.totalPageviews.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>ページビュー（28日）</div>
              </div>
            </div>

            {/* Weekly trend (last 7 days) */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>直近7日セッション</h3>
              <div className="flex items-end gap-1 h-16">
                {last7Days(site).map(d => {
                  const max = Math.max(...last7Days(site).map(x => x.sessions), 1);
                  const pct = (d.sessions / max) * 100;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{d.sessions}</div>
                      <div className="w-full rounded-t" style={{ height: `${pct}%`, minHeight: '2px', background: 'var(--accent)' }} />
                      <div style={{ fontSize: '8px', color: 'var(--muted)' }}>{d.date.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top pages */}
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>ページ別セッション（上位20）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'var(--bg)' }}>
                      <th className="text-left p-2" style={{ color: 'var(--muted)' }}>ページパス</th>
                      <th className="text-right p-2" style={{ color: 'var(--muted)' }}>セッション</th>
                      <th className="text-right p-2" style={{ color: 'var(--muted)' }}>PV</th>
                      <th className="text-right p-2" style={{ color: 'var(--muted)' }}>直帰率</th>
                      <th className="text-right p-2" style={{ color: 'var(--muted)' }}>クリック数</th>
                      <th className="text-right p-2" style={{ color: 'var(--muted)' }}>クリック率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {site.topPages.map((p, i) => {
                      const isKeyPage = site.siteName === 'lens-navi' &&
                        (p.path.startsWith('/ranking') || p.path.startsWith('/product') || p.path.startsWith('/contact'));
                      const clicks = clicksByPage[p.path] ?? 0;
                      const ctr = p.sessions > 0 ? clicks / p.sessions : null;
                      return (
                        <tr key={i}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: isKeyPage ? 'rgba(245,158,11,0.12)' : 'transparent',
                          }}>
                          <td className="p-2 font-mono text-xs max-w-[200px] truncate" style={{ color: 'var(--text)' }}>
                            {isKeyPage && <span style={{ color: 'var(--amber)' }} className="mr-1">★</span>}
                            {p.path}
                          </td>
                          <td className="p-2 text-right font-medium" style={{ color: 'var(--text)' }}>{p.sessions.toLocaleString()}</td>
                          <td className="p-2 text-right" style={{ color: 'var(--muted)' }}>{p.pageviews.toLocaleString()}</td>
                          <td className="p-2 text-right" style={{ color: 'var(--muted)' }}>{fmtPct(p.bounceRate)}</td>
                          <td className="p-2 text-right font-medium" style={{ color: clicks > 0 ? 'var(--green)' : 'var(--muted)' }}>
                            {clicks.toLocaleString()}
                          </td>
                          <td className="p-2 text-right" style={{ color: clicks > 0 ? 'var(--green)' : 'var(--muted)' }}>
                            {ctr === null ? '—' : fmtPct(ctr)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {site.siteName === 'lens-navi' && (
                <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>★ = 楽天CVR診断対象ページ（ランキング・商品・コンタクト）</p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                クリック数・クリック率は<code>affiliate_click</code>イベント（rel=&quot;sponsored&quot;リンクのクリック）に基づく集計です。
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}

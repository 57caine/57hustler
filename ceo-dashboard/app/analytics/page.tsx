'use client';
import { useEffect, useState } from 'react';

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
}

interface AnalyticsData {
  generatedAt: string;
  sites: SiteData[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/ga4-analytics.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Analytics</h1>
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
        データ未取得: {error}<br />
        <span className="text-sm">GitHub Actions「GA4アナリティクス週次取得」を手動実行してください。</span>
      </div>
    </div>
  );

  if (!data) return <div className="p-6 text-gray-500">読み込み中...</div>;

  const last7Days = (site: SiteData) =>
    site.weeklyTrend.slice(-7);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">📊 Analytics</h1>
        <span className="text-xs text-gray-400">更新: {new Date(data.generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</span>
      </div>

      {data.sites.map(site => (
        <section key={site.siteName} className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">{site.label}</h2>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{site.totalSessions.toLocaleString()}</div>
              <div className="text-xs text-gray-500">セッション数（28日）</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{site.totalPageviews.toLocaleString()}</div>
              <div className="text-xs text-gray-500">ページビュー（28日）</div>
            </div>
          </div>

          {/* Weekly trend (last 7 days) */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">直近7日セッション</h3>
            <div className="flex items-end gap-1 h-16">
              {last7Days(site).map(d => {
                const max = Math.max(...last7Days(site).map(x => x.sessions), 1);
                const pct = (d.sessions / max) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500" style={{ fontSize: '9px' }}>{d.sessions}</div>
                    <div className="w-full bg-blue-400 rounded-t" style={{ height: `${pct}%`, minHeight: '2px' }} />
                    <div style={{ fontSize: '8px' }} className="text-gray-400">{d.date.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top pages */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">ページ別セッション（上位20）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2">ページパス</th>
                    <th className="text-right p-2">セッション</th>
                    <th className="text-right p-2">PV</th>
                    <th className="text-right p-2">直帰率</th>
                  </tr>
                </thead>
                <tbody>
                  {site.topPages.map((p, i) => {
                    const isKeyPage = site.siteName === 'lens-navi' &&
                      (p.path.startsWith('/ranking') || p.path.startsWith('/product') || p.path.startsWith('/contact'));
                    return (
                      <tr key={i} className={`border-b border-gray-100 ${isKeyPage ? 'bg-yellow-50' : ''}`}>
                        <td className="p-2 font-mono text-xs max-w-[200px] truncate">
                          {isKeyPage && <span className="text-yellow-600 mr-1">★</span>}
                          {p.path}
                        </td>
                        <td className="p-2 text-right font-medium">{p.sessions.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-500">{p.pageviews.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-500">{(p.bounceRate * 100).toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {site.siteName === 'lens-navi' && (
              <p className="text-xs text-gray-400 mt-2">★ = 楽天CVR診断対象ページ（ランキング・商品・コンタクト）</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

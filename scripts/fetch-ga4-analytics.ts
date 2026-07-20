/**
 * GA4アナリティクスデータ取得スクリプト
 * lens-navi（520238223）とschool-navi（539527147）のデータを取得し
 * data/ga4-analytics.json と ceo-dashboard/public/ga4-analytics.json に保存
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'fs';
import * as path from 'path';

const PROPERTIES = [
  { id: '520238223', name: 'lens-navi', label: 'lens-navi.jp' },
  { id: '539527147', name: 'school-navi', label: 'school.lens-navi.jp' },
];

const OUTPUT_PATHS = [
  path.join(process.cwd(), 'data', 'ga4-analytics.json'),
  path.join(process.cwd(), 'ceo-dashboard', 'public', 'ga4-analytics.json'),
];

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

async function fetchSiteData(property: typeof PROPERTIES[0], credentials: object): Promise<SiteData> {
  const client = new BetaAnalyticsDataClient({ credentials });
  const propertyId = `properties/${property.id}`;

  // Date range: last 28 days
  const endDate = 'today';
  const startDate = '28daysAgo';

  // Top pages by sessions
  const [pagesResponse] = await client.runReport({
    property: propertyId,
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
    dateRanges: [{ startDate, endDate }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  });

  // Weekly trend (last 28 days by date)
  const [trendResponse] = await client.runReport({
    property: propertyId,
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }],
    dateRanges: [{ startDate, endDate }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  const topPages: PageMetrics[] = (pagesResponse.rows ?? []).map(row => ({
    path: row.dimensionValues?.[0]?.value ?? '',
    sessions: parseInt(row.metricValues?.[0]?.value ?? '0'),
    pageviews: parseInt(row.metricValues?.[1]?.value ?? '0'),
    avgSessionDuration: parseFloat(row.metricValues?.[2]?.value ?? '0'),
    bounceRate: parseFloat(row.metricValues?.[3]?.value ?? '0'),
  }));

  const weeklyTrend = (trendResponse.rows ?? []).map(row => {
    const d = row.dimensionValues?.[0]?.value ?? '';
    return {
      date: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
      sessions: parseInt(row.metricValues?.[0]?.value ?? '0'),
    };
  });

  const totalSessions = topPages.reduce((s, p) => s + p.sessions, 0);
  const totalPageviews = topPages.reduce((s, p) => s + p.pageviews, 0);

  return {
    propertyId: property.id,
    siteName: property.name,
    label: property.label,
    fetchedAt: new Date().toISOString(),
    dateRange: { start: startDate, end: endDate },
    totalSessions,
    totalPageviews,
    topPages,
    weeklyTrend,
  };
}

async function main() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GA4_SERVICE_ACCOUNT_KEY is not set');
  const credentials = JSON.parse(keyJson);

  console.log('GA4データ取得開始...');
  const results: SiteData[] = [];

  for (const property of PROPERTIES) {
    console.log(`  ${property.label} (${property.id}) を取得中...`);
    try {
      const data = await fetchSiteData(property, credentials);
      results.push(data);
      console.log(`  ✓ totalSessions=${data.totalSessions}, topPages=${data.topPages.length}件`);
    } catch (e) {
      console.error(`  ✗ ${property.label}: ${(e as Error).message}`);
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sites: results,
  };

  for (const outputPath of OUTPUT_PATHS) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✓ 保存: ${outputPath}`);
  }

  console.log('完了');
}

main().catch(e => { console.error(e); process.exit(1); });

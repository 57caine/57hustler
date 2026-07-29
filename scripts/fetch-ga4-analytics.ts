/**
 * GA4アナリティクスデータ取得スクリプト
 * lens-navi（520238223）とschool-navi（539527147）のデータを取得し
 * data/ga4-analytics.json と ceo-dashboard/public/ga4-analytics.json に保存
 * あわせて要改善コラムの検知・改善案を data/column-review.json に出力
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'fs';
import * as path from 'path';

// ---- コラム検知・改善案 ----

interface ColumnAnalysis {
  h2Count: number;
  h3Count: number;
  hasAffiliateLinks: boolean;
  ctaCount: number;
  contentChars: number;
}

interface FlaggedColumn {
  path: string;
  slug: string;
  title: string;
  metrics: { sessions: number; bounceRate: number; avgSessionDuration: number; affiliateClicks: number };
  flags: string[];
  flagLabels: string[];
  analysis: ColumnAnalysis;
  causes: string[];
  suggestions: string[];
  status: '未対応' | '対応済み' | '様子見';
}

interface ContentLogEntry {
  slug: string;
  title: string;
  section: string;
}

function readColumnContent(slug: string): string {
  const files = [
    path.join(process.cwd(), 'lib', 'columns.tsx'),
    path.join(process.cwd(), 'lib', 'eye-columns.tsx'),
    path.join(process.cwd(), 'lib', 'karakon-columns.tsx'),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf-8');
    // hand-written: `  'slug': (` | auto-generated: `    "slug": (`
    let startIdx = src.indexOf(`  '${slug}': (`);
    if (startIdx === -1) startIdx = src.indexOf(`    "${slug}": (`);
    if (startIdx === -1) continue;
    const searchFrom = startIdx + slug.length + 8;
    const nextEntryRe = /\n  '[^']+': \(|\n    "[^"]+": \(/g;
    nextEntryRe.lastIndex = searchFrom;
    const nextMatch = nextEntryRe.exec(src);
    const endIdx = nextMatch ? nextMatch.index : src.lastIndexOf('\n};');
    return src.slice(startIdx, endIdx);
  }
  return '';
}

function analyzeContent(content: string): ColumnAnalysis {
  return {
    h2Count: (content.match(/<h2/g) ?? []).length,
    h3Count: (content.match(/<h3/g) ?? []).length,
    hasAffiliateLinks: /px\.a8\.net|hb\.afl\.rakuten/.test(content),
    ctaCount: (content.match(/楽天(市場)?で見る|楽天で(購入|探す)|で見る\s*→|bg-sky-600[^>]*>[^<]*で見る/g) ?? []).length,
    contentChars: content.length,
  };
}

function generateCausesAndSuggestions(
  metrics: { sessions: number; bounceRate: number; avgSessionDuration: number },
  analysis: ColumnAnalysis,
): { causes: string[]; suggestions: string[] } {
  const causes: string[] = [];
  const suggestions: string[] = [];

  if (metrics.avgSessionDuration < 5) {
    causes.push('ページが正常にレンダリングされていない可能性（JSXエラー・白画面等）');
    suggestions.push('本番URLを実際に開いて表示確認をする。エラーがあればビルドログを確認する');
  }

  if (metrics.bounceRate >= 0.9) {
    causes.push('検索意図とコンテンツのミスマッチ（期待した情報が冒頭にない）');
    suggestions.push('冒頭3〜4行で結論・要点を先出しし、読者の疑問に即答する構成にする');
  }

  if (!analysis.hasAffiliateLinks) {
    causes.push('アフィリエイトリンク（楽天・A8）が記事に存在しない');
    suggestions.push('関連する楽天またはA8アフィリエイトリンクを記事内に追加する');
  } else if (analysis.ctaCount === 0) {
    causes.push('リンクはあるがCTAボタンが設置されていない（クリック導線が弱い）');
    suggestions.push('「楽天市場で見る →」ボタンを記事の序盤または中盤に追加する');
  } else if (analysis.ctaCount === 1) {
    causes.push('CTAが1箇所（末尾）のみで、早期離脱ユーザーに訴求できていない');
    suggestions.push('記事序盤のH2直後にもCTAボタンを1つ追加する');
  }

  if (analysis.h2Count < 3) {
    causes.push('見出し構造が不足しており、読者が記事構成を把握しにくい');
    suggestions.push('H2見出しを3〜5個設定し、スキャン読みしやすい構造に改善する');
  }

  return { causes: causes.slice(0, 3), suggestions: suggestions.slice(0, 3) };
}

export function detectFlaggedColumns(
  pages: PageMetrics[],
  contentLog: { columns: ContentLogEntry[] },
  affiliateClicksByPage: Record<string, number> = {},
  existingStatuses: Record<string, string> = {},
): FlaggedColumn[] {
  const columnPages = pages.filter(p => p.path.startsWith('/column/'));
  const flagged: FlaggedColumn[] = [];

  for (const page of columnPages) {
    const flags: string[] = [];
    const flagLabels: string[] = [];

    if (page.bounceRate >= 0.9) {
      flags.push('bounce_rate_over_90pct');
      flagLabels.push(`直帰率${(page.bounceRate * 100).toFixed(0)}%（閾値90%）`);
    }
    if (page.avgSessionDuration < 10) {
      flags.push('avg_session_under_10s');
      flagLabels.push(`平均滞在${page.avgSessionDuration.toFixed(1)}秒（閾値10秒）`);
    }
    const affiliateClicks = affiliateClicksByPage[page.path] ?? 0;
    if (page.sessions >= 5 && affiliateClicks === 0) {
      flags.push('no_affiliate_clicks');
      flagLabels.push(`セッション${page.sessions}件・affiliate_clickゼロ`);
    }

    if (flags.length === 0) continue;

    const slug = page.path.replace('/column/', '');
    const logEntry = contentLog.columns.find(c => c.slug === slug);
    const title = logEntry?.title ?? slug;
    const content = readColumnContent(slug);
    const analysis = analyzeContent(content);
    const { causes, suggestions } = generateCausesAndSuggestions(
      { sessions: page.sessions, bounceRate: page.bounceRate, avgSessionDuration: page.avgSessionDuration },
      analysis,
    );
    if (flags.includes('no_affiliate_clicks') && causes.length === 0) {
      causes.push('affiliate_clickイベントが未計測。GA4計測が最近実装されたためデータ蓄積中の可能性がある');
      suggestions.push('GA4リアルタイムレポートでリンクを1件クリックし、affiliate_clickイベントが記録されるか確認する');
    }

    // ステータス判定:
    //   対応済み = 既存JSONで手動設定済みのもの（再生成でも引き継ぐ）
    //   様子見   = no_affiliate_clicksフラグのみ かつ AFFリンク実装済み（データ蓄積待ち）
    //   未対応   = それ以外
    let status: '未対応' | '対応済み' | '様子見' = '未対応';
    if (existingStatuses[slug] === '対応済み') {
      status = '対応済み';
    } else if (flags.length === 1 && flags[0] === 'no_affiliate_clicks' && analysis.hasAffiliateLinks) {
      status = '様子見';
    }

    flagged.push({
      path: page.path,
      slug,
      title,
      metrics: {
        sessions: page.sessions,
        bounceRate: page.bounceRate,
        avgSessionDuration: page.avgSessionDuration,
        affiliateClicks,
      },
      flags,
      flagLabels,
      analysis,
      causes,
      suggestions,
      status,
    });
  }

  return flagged.sort((a, b) => b.metrics.sessions - a.metrics.sessions);
}

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
  affiliateClicksByPage: Record<string, number>;
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

  // affiliate_click イベント数（ページ別）
  const [clicksResponse] = await client.runReport({
    property: propertyId,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'EXACT', value: 'affiliate_click' },
      },
    },
    dateRanges: [{ startDate, endDate }],
    limit: 100,
  }).catch(() => [{ rows: [] }]);

  const affiliateClicksByPage: Record<string, number> = {};
  for (const row of (clicksResponse?.rows ?? [])) {
    const p = row.dimensionValues?.[0]?.value ?? '';
    affiliateClicksByPage[p] = parseInt(row.metricValues?.[0]?.value ?? '0');
  }

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
    affiliateClicksByPage,
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

  // ---- コラム改善検知 ----
  const contentLogPath = path.join(process.cwd(), 'data', 'lens-navi-content-log.json');
  const contentLog = JSON.parse(fs.readFileSync(contentLogPath, 'utf-8'));
  const lensNaviSite = results.find(s => s.siteName === 'lens-navi');

  const reviewPaths = [
    path.join(process.cwd(), 'data', 'column-review.json'),
    path.join(process.cwd(), 'ceo-dashboard', 'public', 'column-review.json'),
  ];

  // 対応済みステータスを既存JSONから引き継ぐ（手動マークが再生成で消えないよう）
  const existingStatuses: Record<string, string> = {};
  if (fs.existsSync(reviewPaths[0])) {
    try {
      const existing = JSON.parse(fs.readFileSync(reviewPaths[0], 'utf-8'));
      for (const article of (existing.flaggedArticles ?? [])) {
        if (article.status === '対応済み') existingStatuses[article.slug] = '対応済み';
      }
    } catch { /* 既存ファイルが壊れていても続行 */ }
  }

  const flaggedArticles = lensNaviSite
    ? detectFlaggedColumns(lensNaviSite.topPages, contentLog, lensNaviSite.affiliateClicksByPage, existingStatuses)
    : [];

  const columnReview = {
    generatedAt: new Date().toISOString(),
    dataDateRange: lensNaviSite?.dateRange ?? null,
    flaggedCount: flaggedArticles.filter(a => a.status === '未対応').length,
    flaggedArticles,
  };
  for (const rp of reviewPaths) {
    fs.mkdirSync(path.dirname(rp), { recursive: true });
    fs.writeFileSync(rp, JSON.stringify(columnReview, null, 2), 'utf-8');
    console.log(`✓ 保存: ${rp}`);
  }

  console.log(`コラム要改善: ${flaggedArticles.length}件`);
  console.log('完了');
}

main().catch(e => { console.error(e); process.exit(1); });

/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * 眼鏡・サングラス関連記事のうち、GA4セッション数トップ20圏外の記事について
 * 個別にセッション数・PVを取得する。画像カード展開の対象記事一覧をPV順に
 * 整理するための調査用。
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const SLUGS = [
  'pc-megane-bluelight-hikaku-2026',
  'uv-eye-care-sunglasses-uv-drops',
  'sports-eyeglass-slip-prevention-frame',
  'reading-glasses-presbyopia-choose-recommend-2026',
  'megane-online-shopping-compare-2025',
  'uv-sunglasses-eyecare-2026',
  'smartphone-presbyopia-magnifier-eyeglasses',
  'smart-eyewear-functional-goods-2026',
  'contact-megane-dosu-chigai',
];

async function main() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GA4_SERVICE_ACCOUNT_KEY is not set');
  const credentials = JSON.parse(keyJson);
  const client = new BetaAnalyticsDataClient({ credentials });
  const propertyId = 'properties/520238223';
  const paths = SLUGS.map(s => `/column/${s}`);

  const [pageResponse] = await client.runReport({
    property: propertyId,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
    dimensionFilter: {
      filter: { fieldName: 'pagePath', inListFilter: { values: paths } },
    },
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
  });

  const result: Record<string, { sessions: number; pageviews: number }> = {};
  for (const row of pageResponse.rows ?? []) {
    const p = row.dimensionValues?.[0]?.value ?? '';
    result[p] = {
      sessions: parseInt(row.metricValues?.[0]?.value ?? '0'),
      pageviews: parseInt(row.metricValues?.[1]?.value ?? '0'),
    };
  }

  for (const path of paths) {
    const r = result[path] ?? { sessions: 0, pageviews: 0 };
    console.log(`${path} sessions=${r.sessions} pageviews=${r.pageviews}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

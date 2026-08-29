/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * soft-vs-hard-contact-hikaku単体のGA4メトリクス（過去28日）を取得する。
 * この記事はGA4のセッション数トップ20圏外のため、data/ga4-analytics.json の
 * topPagesには含まれておらず、column-review.jsonへの新規エントリ追加に
 * 必要な実データ（sessions・bounceRate・avgSessionDuration・affiliateClicks）
 * を個別に取得する。
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';

async function main() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GA4_SERVICE_ACCOUNT_KEY is not set');
  const credentials = JSON.parse(keyJson);
  const client = new BetaAnalyticsDataClient({ credentials });
  const propertyId = 'properties/520238223';
  const path = '/column/soft-vs-hard-contact-hikaku';

  const [pageResponse] = await client.runReport({
    property: propertyId,
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
    dimensionFilter: {
      filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: path } },
    },
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
  });

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
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
  });

  const row = pageResponse.rows?.[0];
  if (!row) {
    console.log('結果なし（過去28日間このページへのアクセスなし）');
    console.log(JSON.stringify({
      path, sessions: 0, pageviews: 0, avgSessionDuration: 0, bounceRate: 0, affiliateClicks: 0,
    }, null, 2));
    return;
  }

  const sessions = parseInt(row.metricValues?.[0]?.value ?? '0');
  const pageviews = parseInt(row.metricValues?.[1]?.value ?? '0');
  const avgSessionDuration = parseFloat(row.metricValues?.[2]?.value ?? '0');
  const bounceRate = parseFloat(row.metricValues?.[3]?.value ?? '0');

  const clickRow = (clicksResponse.rows ?? []).find(
    r => r.dimensionValues?.[0]?.value === path
  );
  const affiliateClicks = parseInt(clickRow?.metricValues?.[0]?.value ?? '0');

  console.log(JSON.stringify({
    path, sessions, pageviews, avgSessionDuration, bounceRate, affiliateClicks,
  }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });

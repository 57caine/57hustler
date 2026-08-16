/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * 1. Referralチャネルの詳細な参照元（sessionSource/Medium）
 * 2. AI Assistantチャネルの実態（sessionSource別・ページ別）
 * 結果はログ出力のみ。ファイルへの永続化は行わない。
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const PROPERTIES = [
  { id: '520238223', label: 'lens-navi.jp' },
  { id: '539527147', label: 'school.lens-navi.jp' },
];

async function main() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GA4_SERVICE_ACCOUNT_KEY is not set');
  const credentials = JSON.parse(keyJson);
  const client = new BetaAnalyticsDataClient({ credentials });

  const startDate = '28daysAgo';
  const endDate = 'today';

  for (const property of PROPERTIES) {
    const propertyId = `properties/${property.id}`;
    console.log(`\n\n========== ${property.label} (${property.id}) ==========`);

    // 0. チャネルグループ一覧（AI Assistantの正式名称を確認）
    console.log('\n--- チャネルグループ別セッション数 ---');
    const [channelResp] = await client.runReport({
      property: propertyId,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      dateRanges: [{ startDate, endDate }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });
    for (const row of channelResp.rows ?? []) {
      console.log(`  ${row.dimensionValues?.[0]?.value}: ${row.metricValues?.[0]?.value} sessions`);
    }

    // 1. Referralチャネルの詳細参照元
    console.log('\n--- 【対応1】Referralチャネル: source/medium別セッション数 ---');
    const [referralResp] = await client.runReport({
      property: propertyId,
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' }],
      dateRanges: [{ startDate, endDate }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGroup',
          stringFilter: { matchType: 'EXACT', value: 'Referral' },
        },
      },
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 30,
    }).catch(e => { console.log('  ERROR:', e.message); return [{ rows: [] }]; });
    for (const row of referralResp.rows ?? []) {
      console.log(`  source=${row.dimensionValues?.[0]?.value} medium=${row.dimensionValues?.[1]?.value} sessions=${row.metricValues?.[0]?.value} engaged=${row.metricValues?.[1]?.value} bounceRate=${row.metricValues?.[2]?.value}`);
    }

    // 1b. Referralチャネル: 参照元 x 着地ページ
    console.log('\n--- 【対応1】Referralチャネル: source x landingPage ---');
    const [referralLandingResp] = await client.runReport({
      property: propertyId,
      dimensions: [{ name: 'sessionSource' }, { name: 'landingPagePlusQueryString' }],
      metrics: [{ name: 'sessions' }],
      dateRanges: [{ startDate, endDate }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGroup',
          stringFilter: { matchType: 'EXACT', value: 'Referral' },
        },
      },
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 30,
    }).catch(e => { console.log('  ERROR:', e.message); return [{ rows: [] }]; });
    for (const row of referralLandingResp.rows ?? []) {
      console.log(`  source=${row.dimensionValues?.[0]?.value} landing=${row.dimensionValues?.[1]?.value} sessions=${row.metricValues?.[0]?.value}`);
    }

    // 2. AI Assistantチャネル(想定される名称ゆらぎに対応して複数候補で試行)
    const aiChannelCandidates = ['AI Assistant', 'AI Assistants', 'Organic AI Traffic', 'AI'];
    for (const candidate of aiChannelCandidates) {
      console.log(`\n--- 【対応2】AI Assistant候補チャネル "${candidate}": source別 ---`);
      const [aiResp] = await client.runReport({
        property: propertyId,
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        dateRanges: [{ startDate, endDate }],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionDefaultChannelGroup',
            stringFilter: { matchType: 'EXACT', value: candidate },
          },
        },
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 30,
      }).catch(e => { console.log('  ERROR:', e.message); return [{ rows: [] }]; });
      const rows = aiResp.rows ?? [];
      if (rows.length === 0) { console.log('  (該当なし)'); continue; }
      for (const row of rows) {
        console.log(`  source=${row.dimensionValues?.[0]?.value} sessions=${row.metricValues?.[0]?.value}`);
      }

      console.log(`--- 【対応2】AI Assistant候補チャネル "${candidate}": source x pagePath ---`);
      const [aiPageResp] = await client.runReport({
        property: propertyId,
        dimensions: [{ name: 'sessionSource' }, { name: 'pagePath' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
        dateRanges: [{ startDate, endDate }],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionDefaultChannelGroup',
            stringFilter: { matchType: 'EXACT', value: candidate },
          },
        },
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 30,
      }).catch(e => { console.log('  ERROR:', e.message); return [{ rows: [] }]; });
      for (const row of aiPageResp.rows ?? []) {
        console.log(`  source=${row.dimensionValues?.[0]?.value} page=${row.dimensionValues?.[1]?.value} sessions=${row.metricValues?.[0]?.value} pv=${row.metricValues?.[1]?.value}`);
      }
    }
  }

  console.log('\n\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });

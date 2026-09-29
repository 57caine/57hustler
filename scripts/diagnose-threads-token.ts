/**
 * 一時診断スクリプト（investigation用、report-only）
 *
 * THREADS_ACCESS_TOKENが投稿単位・アカウント単位のInsights取得に必要な
 * 権限を持っているかを、実際にAPIを叩いて確認する。読み取りのみ・副作用なし。
 * 確認後は削除する想定（自走改善ループPhase1の本実装ではない）。
 */

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

async function main() {
  if (!USER_ID || !ACCESS_TOKEN) {
    throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');
  }

  console.log('=== Threads Insights 権限診断 ===');

  // 1. アカウント単位のInsights（フォロワー数・閲覧数等）
  console.log('\n--- アカウント単位 Insights (threads_insights) ---');
  const accountUrl = `${THREADS_API_BASE}/${USER_ID}/threads_insights?metric=views,likes,replies,reposts,quotes,followers_count&access_token=${ACCESS_TOKEN}`;
  const accountRes = await fetch(accountUrl);
  const accountBody = await accountRes.text();
  console.log(`HTTP ${accountRes.status}`);
  console.log(accountBody);

  // 2. 直近投稿一覧を取得し、1件だけ投稿単位Insightsも試す
  console.log('\n--- 投稿単位 Insights (media insights) ---');
  const listUrl = `${THREADS_API_BASE}/${USER_ID}/threads?fields=id,timestamp&limit=1&access_token=${ACCESS_TOKEN}`;
  const listRes = await fetch(listUrl);
  const listBody = await listRes.json() as { data?: { id: string; timestamp: string }[] };
  console.log(`投稿一覧取得: HTTP ${listRes.status}`);
  console.log(JSON.stringify(listBody).slice(0, 500));

  if (listBody.data && listBody.data.length > 0) {
    const mediaId = listBody.data[0].id;
    const mediaUrl = `${THREADS_API_BASE}/${mediaId}/insights?metric=views,likes,replies,reposts,quotes,shares&access_token=${ACCESS_TOKEN}`;
    const mediaRes = await fetch(mediaUrl);
    const mediaBody = await mediaRes.text();
    console.log(`\n投稿単位Insights (media_id=${mediaId}): HTTP ${mediaRes.status}`);
    console.log(mediaBody);
  } else {
    console.log('直近投稿が取得できなかったため、投稿単位Insightsのテストはスキップします。');
  }

  console.log('\n=== 診断終了 ===');
}

main().catch(e => { console.error(e); process.exit(1); });

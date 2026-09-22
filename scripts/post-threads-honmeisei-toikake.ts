/**
 * Threads「あなたの本命星は？」コメント促進投稿スクリプト（日曜 22:30 JST のみ）
 *
 * 読者が自分の本命星をコメントで答えやすい問いかけ投稿。
 * コメント数を増やしてアルゴリズムに乗りやすくすることが狙いのため、
 * Claude API呼び出しは行わず、あらかじめ用意した文面を週ごとにローテーションする。
 */

import { getJstDayOfWeek, getJstDateSlug } from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const HASHTAGS = '#九星気学 #本命星 #占い';

const VARIANTS: string[] = [
  `あなたの本命星はなんですか？
生まれた年から調べてみてください。

コメントで教えてもらえると嬉しいです。

${HASHTAGS}`,
  `本命星、パッと言えますか？
生まれた年でひとつに決まります。

自分の星、コメントで教えてください。

${HASHTAGS}`,
  `今夜は聞いてみたいです。
あなたの本命星はなんですか？

わからない方は生まれた年から調べられます。
コメントお待ちしてます。

${HASHTAGS}`,
];

/** 2024-01-07（日）を起点にした週番号でローテーション（日付依存・ランダムではない） */
function selectVariant(dateStr: string): string {
  const diffDays = Math.round((new Date(dateStr).getTime() - new Date('2024-01-07').getTime()) / 86400000);
  const weekNum = Math.floor(diffDays / 7);
  const idx = ((weekNum % VARIANTS.length) + VARIANTS.length) % VARIANTS.length;
  return VARIANTS[idx];
}

async function createThreadsContainer(text: string, topicTag?: string): Promise<string> {
  const params = new URLSearchParams({ media_type: 'TEXT', text, access_token: ACCESS_TOKEN });
  if (topicTag) params.set('topic_tag', topicTag);
  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Container creation failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}

async function publishThread(creationId: string): Promise<string> {
  const params = new URLSearchParams({ creation_id: creationId, access_token: ACCESS_TOKEN });
  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Publish failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const dow = getJstDayOfWeek();
  const DOW_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

  console.log(`=== あなたの本命星は？ 投稿開始（${DOW_NAMES[dow]}曜）${dryRun ? '【DRY RUN】' : ''} ===`);

  if (dow !== 0) {
    console.log('日曜ではないため終了します。');
    return;
  }
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const text = selectVariant(getJstDateSlug());

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text, '占い');
  console.log(`コンテナID: ${creationId}（topic_tag: 占い）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

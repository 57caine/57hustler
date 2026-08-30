/**
 * Threads「今日の吉方位」自動投稿スクリプト（火・木・土 12:30 JST）
 *
 * 個人の本命星を取らない一斉投稿のため、本格的な吉凶判定（個人ごとの吉方位）は行わない。
 * 決定論的に計算できる範囲に絞り、Claude API呼び出しは行わない：
 *   - 各星の当日の回座宮の方位をそのまま表示
 *   - 五黄殺（五黄土星が回座する方位）と暗剣殺（その対冲方位）のみ「凶」として明示
 * 5黄が中央（宮5）に来る日は、対応する方位がないため五黄殺・暗剣殺なしとして扱う。
 */

import { KYUSEI, POSITION_MEANINGS, OPPOSITE_POSITION, getDailyStar, getStarPositionIndex, getJstDayOfWeek } from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

function buildPostText(dateStr: string, dailyStarNum: number): string {
  const goouPosition = getStarPositionIndex(5, dailyStarNum);
  const goouDirection = goouPosition === 5 ? null : POSITION_MEANINGS[goouPosition].direction;
  const kenPosition = OPPOSITE_POSITION[goouPosition];
  const kenDirection = goouPosition === 5 ? null : POSITION_MEANINGS[kenPosition].direction;

  const badDirections = new Set([goouDirection, kenDirection].filter((d): d is string => d !== null));

  const goouLabel = goouDirection ? `五黄殺＝${goouDirection}` : '五黄殺なし（本日は五黄土星が中央）';
  const kenLabel = kenDirection ? `暗剣殺＝${kenDirection}` : '暗剣殺なし';

  const lines = [
    `🧭 今日の吉方位｜${dateStr}`,
    `${KYUSEI[dailyStarNum].name}の日`,
    '',
    `本日の凶方位：${goouLabel}／${kenLabel}`,
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      const s = KYUSEI[n];
      const pos = POSITION_MEANINGS[getStarPositionIndex(n, dailyStarNum)];
      const mark = badDirections.has(pos.direction) ? '（凶）' : '';
      return `${s.emoji}${s.short}｜${pos.direction}${mark}`;
    }),
    '',
    '占いは参考程度にどうぞ。',
    '🌙 #九星気学 #吉方位 #夜中のおじさん',
  ];
  return lines.join('\n');
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

  console.log(`=== 今日の吉方位 投稿開始（${DOW_NAMES[dow]}曜）${dryRun ? '【DRY RUN】' : ''} ===`);

  if (![2, 4, 6].includes(dow)) {
    console.log('対象曜日（火・木・土）ではないため終了します。');
    return;
  }
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStarNum = getDailyStar();
  console.log(`日盤中宮: ${KYUSEI[dailyStarNum].name}`);

  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  });
  const text = buildPostText(dateStr, dailyStarNum);

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text, '九星気学');
  console.log(`コンテナID: ${creationId}（topic_tag: 九星気学）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

/**
 * Threads 九星気学 9星まとめ日次投稿スクリプト
 *
 * 今日の日盤中宮星を表示しつつ、全9星の今日の一言をまとめて1投稿する。
 * 各星の一言はClaude APIで動的生成（10文字以内）。
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const KYUSEI: Record<number, { name: string; short: string; emoji: string; element: string; keywords: string[] }> = {
  1: { name: '一白水星', short: '一白', emoji: '⚪', element: '水', keywords: ['知恵', '流れ', '柔軟', '人脈'] },
  2: { name: '二黒土星', short: '二黒', emoji: '🟤', element: '土', keywords: ['継続', '忍耐', '家庭', '蓄積'] },
  3: { name: '三碧木星', short: '三碧', emoji: '🟢', element: '木', keywords: ['行動', '発展', '革新'] },
  4: { name: '四緑木星', short: '四緑', emoji: '🟢', element: '木', keywords: ['信用', '縁', '商売'] },
  5: { name: '五黄土星', short: '五黄', emoji: '🟡', element: '土', keywords: ['帝王', '変革', '中心'] },
  6: { name: '六白金星', short: '六白', emoji: '⚪', element: '金', keywords: ['権威', '決断', '指導'] },
  7: { name: '七赤金星', short: '七赤', emoji: '🔴', element: '金', keywords: ['喜び', '金運', '交際'] },
  8: { name: '八白土星', short: '八白', emoji: '🟤', element: '土', keywords: ['変革', '蓄積', '基盤'] },
  9: { name: '九紫火星', short: '九紫', emoji: '🔴', element: '火', keywords: ['明晰', '名誉', '学問'] },
};

function getDailyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const diff = Math.round((new Date(jstStr).getTime() - new Date('2024-01-06').getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

async function generateOneLiners(dailyStarNum: number): Promise<Record<number, string>> {
  const client = new Anthropic();
  const dailyStar = KYUSEI[dailyStarNum];
  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Tokyo',
  });

  const starList = Object.entries(KYUSEI)
    .map(([n, s]) => `${n}（${s.name}）: ${s.element}・${s.keywords.join('・')}`)
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: '九星気学に詳しいおじさんです。今日の日盤中宮星を踏まえ、各星への短いメッセージを生成します。',
    messages: [{
      role: 'user',
      content: `今日（${dateStr}）の日盤中宮は「${dailyStar.name}」です。

この日のエネルギーを踏まえて、各星（1〜9）の今日の一言を**10文字以内**で出力してください。
体言止め・命令形・短い行動ヒントのいずれかで。ですます調不要。

各星の特性：
${starList}

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v).slice(0, 10)]));
}

function buildPostText(dailyStarNum: number, oneLiners: Record<number, string>): string {
  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  });

  const lines = [
    `🔯 今日の運勢｜${dateStr}`,
    `${KYUSEI[dailyStarNum].name}の日`,
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      const s = KYUSEI[n];
      return `${s.emoji}${s.short}｜${oneLiners[n] ?? ''}`;
    }),
    '',
    '🌙 #九星気学 #今日の運勢 #夜中のおじさん',
  ];

  return lines.join('\n');
}

async function createThreadsContainer(text: string): Promise<string> {
  const params = new URLSearchParams({ media_type: 'TEXT', text, access_token: ACCESS_TOKEN });
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
  console.log(`=== 九星気学まとめ投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStarNum = getDailyStar();
  console.log(`本日の日盤中宮: ${KYUSEI[dailyStarNum].name}`);

  console.log('Claude API で各星の一言を生成中...');
  const oneLiners = await generateOneLiners(dailyStarNum);
  const text = buildPostText(dailyStarNum, oneLiners);

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text);
  console.log(`コンテナID: ${creationId}`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

/**
 * Threads「今月の注意点」自動投稿スクリプト（毎月1日 07:15 JST のみ）
 *
 * 月盤中宮星（scripts/lib/kyusei-ban.tsの修正済みロジックを使用）を基に、
 * 「今月のテーマ一文」＋各星の「今月の注意点一言」（10文字以内・完結文）を生成する。
 */

import Anthropic from '@anthropic-ai/sdk';
import { KYUSEI, POSITION_MEANINGS, getMonthlyStarForToday, getStarPositionIndex, getJstDateSlug } from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

interface MonthlyContent { theme: string; cautions: Record<number, string>; }

async function generateMonthlyCaution(monthlyStarNum: number): Promise<MonthlyContent> {
  const client = new Anthropic();
  const monthlyStar = KYUSEI[monthlyStarNum];

  const positionInfo = Array.from({ length: 9 }, (_, i) => {
    const k = i + 1;
    const pos = POSITION_MEANINGS[getStarPositionIndex(k, monthlyStarNum)];
    return `  ${KYUSEI[k].short}（${KYUSEI[k].element}）→ ${pos.name}（${pos.direction}）: ${pos.meaning}`;
  }).join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: '九星気学に詳しいおじさんです。月盤中宮星を踏まえた、今月の注意点・避けるべきことを生成します。象意の言い換えは禁止。',
    messages: [{
      role: 'user',
      content: `今月の月盤中宮：${monthlyStar.name}

各星の今月の回座宮：
${positionInfo}

以下の2つを生成してください。

1. 「今月のテーマ」：月盤「${monthlyStar.name}」の意味を踏まえた今月全体のテーマを40文字以内の一文で
2. 各星の「今月の注意点」：具体的な行動・避けるべきことを10文字以内で、意味が必ず完結する文にすること

【厳守（両方に共通）】
- 象意の言い換えは絶対NG。「地盤を固める」「じっくり取り組む」などは禁止
- 途中で切れる文は絶対に生成しない。注意点は助詞（「を」「に」「が」「の」など）で終えてはいけない。動詞か名詞で言い切ること
- 注意点の良い例：「衝動買いを控える」「即決を避ける」「発言前に一呼吸」
- 注意点のNG例：「今月の変化を手帳」（助詞で切れている）「明日のリーダーシ」（単語の途中で切れている）
- 体言止め・動詞終わりのどちらでもよい。ですます調不要
- 10文字（テーマは40文字）に収まらない内容は、要素を削って短くまとめる（尻切れにしない）

以下のJSONのみ出力（前置き不要）：
{"theme":"","cautions":{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as { theme: string; cautions: Record<string, string> };
  return {
    theme: json.theme.slice(0, 40),
    cautions: Object.fromEntries(Object.entries(json.cautions).map(([k, v]) => [Number(k), String(v).slice(0, 10)])),
  };
}

function buildPostText(monthlyStarNum: number, content: MonthlyContent): string {
  const monthLabel = new Date().toLocaleDateString('ja-JP', { month: 'long', timeZone: 'Asia/Tokyo' });

  const lines = [
    `🌙 ${monthLabel}の注意点｜本命星別`,
    '',
    `今月は${KYUSEI[monthlyStarNum].name}の月。`,
    content.theme,
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      const s = KYUSEI[n];
      return `${s.emoji}${s.short}\n${content.cautions[n] ?? ''}`;
    }),
    '',
    '#九星気学 #今月の運勢 #夜中のおじさん',
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
  const dateSlug = getJstDateSlug();
  const dayOfMonth = parseInt(dateSlug.slice(8, 10));

  console.log(`=== 今月の注意点 投稿開始（${dateSlug}）${dryRun ? '【DRY RUN】' : ''} ===`);

  if (dayOfMonth !== 1) {
    console.log('毎月1日ではないため終了します。');
    return;
  }
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const monthlyStarNum = getMonthlyStarForToday();
  console.log(`月盤中宮: ${KYUSEI[monthlyStarNum].name}`);

  console.log('Claude API で今月の注意点を生成中...');
  const content = await generateMonthlyCaution(monthlyStarNum);
  const text = buildPostText(monthlyStarNum, content);

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

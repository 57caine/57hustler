/**
 * Threads「今週のテーマ」自動投稿スクリプト（月曜 07:30 JST のみ）
 *
 * 「週盤」は九星気学の古典的な概念ではないため、
 * このスクリプトが実行される月曜日の日盤中宮星を「今週の中宮星」として扱う。
 * 各星の一言はPR #3で確立した「10文字以内・完結文・助詞で終わらない・改行フォーマット」を踏襲する。
 */

import Anthropic from '@anthropic-ai/sdk';
import { KYUSEI, POSITION_MEANINGS, getDailyStar, getStarPositionIndex, getJstDayOfWeek } from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

async function generateWeeklyThemes(weekStarNum: number): Promise<Record<number, string>> {
  const client = new Anthropic();
  const weekStar = KYUSEI[weekStarNum];

  const positionInfo = Array.from({ length: 9 }, (_, i) => {
    const k = i + 1;
    const pos = POSITION_MEANINGS[getStarPositionIndex(k, weekStarNum)];
    return `  ${KYUSEI[k].short}（${KYUSEI[k].element}）→ ${pos.name}（${pos.direction}）: ${pos.meaning}`;
  }).join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: '九星気学に詳しいおじさんです。週の始まりの中宮星を踏まえた、1週間の行動指針・心がけを生成します。象意の言い換えは禁止。',
    messages: [{
      role: 'user',
      content: `今週の中宮星：${weekStar.name}（月曜の日盤を週の起点として採用）

各星の今週の回座宮：
${positionInfo}

週盤「${weekStar.name}」＋各星の回座宮の組み合わせから、
その星にとって「この1週間、どんな行動指針・心がけで過ごすとよいか」を読み取り、
各星のテーマを10文字以内で、意味が必ず完結する文にすること。

【厳守】
- 象意の言い換えは絶対NG。「地盤を固める」「じっくり取り組む」などは禁止
- 途中で切れる文は絶対に生成しない。助詞（「を」「に」「が」「の」など）で終えてはいけない。動詞か名詞で言い切ること
- 1日単位ではなく「今週全体」のテーマとして書く
  良い例：「新しい縁を育てる週」「守りを固める週」「発信すると伸びる」
  NG例：「今週の変化を手帳」（助詞で切れている）「明日のリーダーシ」（単語の途中で切れている）
- 体言止め・動詞終わりのどちらでもよい。ですます調不要
- 10文字に収まらない内容は、要素を削って短くまとめる（尻切れにしない）

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v).slice(0, 10)]));
}

function buildPostText(weekStarNum: number, themes: Record<number, string>): string {
  const monday = new Date();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo' });
  const rangeStr = `${fmt(monday)}〜${fmt(sunday)}`;

  const lines = [
    `🌙 今週のテーマ｜${rangeStr}`,
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      const s = KYUSEI[n];
      return `${s.emoji}${s.short}\n${themes[n] ?? ''}`;
    }),
    '',
    '#九星気学 #今週の運勢 #夜中のおじさん',
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

  console.log(`=== 今週のテーマ 投稿開始（${DOW_NAMES[dow]}曜）${dryRun ? '【DRY RUN】' : ''} ===`);

  if (dow !== 1) {
    console.log('月曜ではないため終了します。');
    return;
  }
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const weekStarNum = getDailyStar();
  console.log(`今週の中宮星: ${KYUSEI[weekStarNum].name}`);

  console.log('Claude API で今週のテーマを生成中...');
  const themes = await generateWeeklyThemes(weekStarNum);
  const text = buildPostText(weekStarNum, themes);

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

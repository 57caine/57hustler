/**
 * Threads「今日の易経」自動投稿スクリプト（月・水・金 22:30 JST）
 *
 * 日盤中宮星に対応する八卦から、日付ベースで今日の卦を1つ選出。
 * 卦名・読み方・意味は既存の検証済みデータ（scripts/lib/kyusei-ban.ts）をそのまま使用し、
 * Claude APIには「今日の一言」（30文字以内）の生成のみを担わせる。
 */

import Anthropic from '@anthropic-ai/sdk';
import { getDailyStar, getJstDayOfWeek, getJstDateSlug, selectHexagram } from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

async function generateTodayLine(dailyStarNum: number, hex: { num: number; name: string; keyword: string; trigram: string }): Promise<string> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: '易経に詳しいおじさんです。日盤の流れと卦の意味を結びつけた一言を生成します。',
    messages: [{
      role: 'user',
      content: `今日の日盤中宮は${dailyStarNum}（${hex.trigram}に対応）です。
今日の卦：第${hex.num}卦「${hex.name}」
原文キーワード：「${hex.keyword}」

この卦の意味と、今日という日の流れを結びつけた「今日の一言」を生成してください。

【厳守】
- 30文字以内で、意味が必ず完結する文にすること。途中で切れる文は絶対に生成しない
- 助詞（「を」「に」「が」「の」など）で終えてはいけない。動詞か名詞で言い切ること
- 卦の原文キーワードの言い換えではなく、「今日をどう過ごすか」に踏み込むこと
- ですます調不要
- 30文字に収まらない内容は、要素を削って短くまとめる（尻切れにしない）

一言のみ出力（前置き・引用符不要）。`,
    }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  return text.slice(0, 30);
}

function buildPostText(dateStr: string, hex: { num: number; name: string; keyword: string }, todayLine: string): string {
  const lines = [
    `📖 今日の易経｜${dateStr}`,
    '',
    `第${hex.num}卦「${hex.name}」`,
    '',
    hex.keyword,
    '',
    '今日の一言：',
    todayLine,
    '',
    '#易経 #九星気学 #夜中のおじさん',
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

  console.log(`=== 今日の易経 投稿開始（${DOW_NAMES[dow]}曜）${dryRun ? '【DRY RUN】' : ''} ===`);

  if (![1, 3, 5].includes(dow)) {
    console.log('対象曜日（月・水・金）ではないため終了します。');
    return;
  }
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStarNum = getDailyStar();
  const dateSlug = getJstDateSlug();
  const hex = selectHexagram(dailyStarNum, dateSlug);
  console.log(`日盤中宮: ${dailyStarNum} / 卦: 第${hex.num}卦「${hex.name}」`);

  console.log('Claude API で今日の一言を生成中...');
  const todayLine = await generateTodayLine(dailyStarNum, hex);

  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  });
  const text = buildPostText(dateStr, hex, todayLine);

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text, '易経');
  console.log(`コンテナID: ${creationId}（topic_tag: 易経）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

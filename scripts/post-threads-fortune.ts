/**
 * Threads 九星気学 9星まとめ日次投稿スクリプト
 *
 * 今日の日盤中宮星を表示しつつ、全9星の今日の一言をまとめて1投稿する。
 * 各星の一言はClaude APIで動的生成（8〜18文字・意味が完結する文。絵文字＋星名＋一言を1行に収める）。
 *
 * フォーマット全面変更（2026-09-15）:
 * - 星名と一言を改行で分ける2行フォーマットは縦に長く読みづらいため、
 *   「⚪一白｜一言」の1行フォーマットに戻す
 * - 文字切れ対策として、生成後に各行の｜以降の文字数を機械的にチェックし、
 *   18文字を超える場合はslice等で強制的に切らず、まるごと再生成する（最大3回）
 *
 * 文字数上限は当初12文字だったが、Claude Haiku 4.5の実際の出力（13〜17文字が大半）に
 * 対して厳しすぎ、ほぼ毎回3回リトライを使い切って投稿がスキップされ続けていたため
 * 18文字に緩和した（2026-09-25、本番ログで実証）。
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  KYUSEI, POSITION_MEANINGS, getDailyStar, getMonthlyStarForToday, getStarPositionIndex,
  MAX_ONELINER_LENGTH, validateOneLiners, KYUSEI_CONTENT_CAUTION, getSeasonWordCaution,
} from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

// 月盤中宮星ごとの象意・対応卦（月替わりで随時追加していく想定。未登録の月は象意なしで生成する）
const MONTHLY_MEANING: Partial<Record<number, { hexagram: string; keywords: string[] }>> = {
  2: {
    hexagram: '坤為地（易経 第2卦）',
    keywords: [
      '大地・土・受け取る・養育・地道な積み上げ',
      '焦らず、じっくり、根を張る月',
      '新しいことを始めるより積み上げを固める時期',
      '人を助けることで流れが開ける',
    ],
  },
};

async function generateOneLiners(dailyStarNum: number, monthlyStarNum: number): Promise<Record<number, string>> {
  const client = new Anthropic();
  const dailyStar   = KYUSEI[dailyStarNum];
  const monthlyStar = KYUSEI[monthlyStarNum];
  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Tokyo',
  });

  // 各星の日盤回座情報
  const positionInfo = Array.from({ length: 9 }, (_, i) => {
    const k = i + 1;
    const pos = POSITION_MEANINGS[getStarPositionIndex(k, dailyStarNum)];
    return `  ${KYUSEI[k].short}（${KYUSEI[k].element}）→ ${pos.name}（${pos.direction}）: ${pos.meaning}`;
  }).join('\n');

  const monthlyMeaning = MONTHLY_MEANING[monthlyStarNum];
  const monthlyMeaningBlock = monthlyMeaning
    ? `\n今月「${monthlyStar.name}」の象意（対応卦：${monthlyMeaning.hexagram}）：\n${monthlyMeaning.keywords.map(k => `  ・${k}`).join('\n')}\n`
    : '';

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `九星気学に詳しいおじさんです。月盤・日盤の回座宮を踏まえた具体的なアドバイスを生成します。象意の言い換えは禁止。\n${KYUSEI_CONTENT_CAUTION}\n${getSeasonWordCaution()}`,
    messages: [{
      role: 'user',
      content: `今日（${dateStr}）
月盤中宮：${monthlyStar.name}
日盤中宮：${dailyStar.name}
${monthlyMeaningBlock}
各星の本日の日盤回座宮：
${positionInfo}

月盤「${monthlyStar.name}」＋ 各星の回座宮の組み合わせから、
その星が今日「具体的にどんな状況・行動に置かれているか」を読み取り、
各星の一言は8〜18文字で、意味が必ず完結する文にすること。
途中で切れる文は絶対に生成しない。助詞（「を」「に」「が」「の」など）で終えてはいけない。
動詞か体言止めで言い切ること。

【厳守】
- 象意の言い換えは絶対NG。「地盤を固める」「じっくり取り組む」などは禁止
- 行動・場面・注意点で具体的に
  良い例：「静かに受け取る日」「地道が実を結ぶ」「発信より傾聴を」「縁を大切に動く」
  NG例：「信用でコミュニケーシ」（単語の途中で切れている）「中央で変化の核心を動」（助詞で切れている）
- 体言止め・動詞終わりのどちらでもよい。ですます調不要
- 18文字を1文字でも超える内容は、要素を削って短くまとめる（尻切れにしない）

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v)]));
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
    '自分の本命星がわからない方はプロフィールのリンクから調べられます。',
    '🌙 #九星気学 #今日の運勢 #夜中のおじさん #占い #運勢 #開運',
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
  console.log(`=== 九星気学まとめ投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStarNum   = getDailyStar();
  const monthlyStarNum = getMonthlyStarForToday();
  console.log(`本日の日盤中宮: ${KYUSEI[dailyStarNum].name} / 月盤中宮: ${KYUSEI[monthlyStarNum].name}`);

  const MAX_RETRIES = 3;
  let oneLiners: Record<number, string> | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`Claude API で各星の一言を生成中...（試行${attempt}/${MAX_RETRIES}）`);
    const candidate = await generateOneLiners(dailyStarNum, monthlyStarNum);
    if (validateOneLiners(candidate)) {
      oneLiners = candidate;
      break;
    }
    const tooLong = Object.entries(candidate).filter(([, v]) => v.length > MAX_ONELINER_LENGTH);
    console.warn(`⚠️ 試行${attempt}: ${MAX_ONELINER_LENGTH}文字を超える一言を検出（${tooLong.map(([k, v]) => `${k}:「${v}」`).join(', ')}） → 再生成`);
  }

  if (oneLiners === null) {
    console.warn('⚠️ 3回試行しても文字数チェックを通過できなかったため、今回の投稿をスキップします');
    return;
  }

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
  const creationId = await createThreadsContainer(text, '占い');
  console.log(`コンテナID: ${creationId}（topic_tag: 占い）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

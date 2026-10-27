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
 *
 * 重複投稿防止の設計（2026-10-17、CEOコードレビュー対応）:
 * 「本日まだ投稿していないか」のチェックと「本日分を予約済みとしてコミット・push」を、
 * 実際にThreadsへ投稿する前に完了させる（--claim）。予約のpushに失敗したら、その時点で
 * ワークフロー全体を失敗させ、Threadsには一切投稿しない（投稿後に履歴保存だけが失敗して
 * 翌回に再投稿してしまう、という事故を構造的に無くす）。予約が確実にpushできた場合のみ
 * 投稿本体（--post）を実行する。2段階に分けているのは、Node側からgit操作を直接呼ぶより、
 * 既存のワークフローのgitコミットステップ（他スクリプトと同じ仕組み）を再利用するため。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  KYUSEI, POSITION_MEANINGS, getDailyStar, getMonthlyStarForToday, getStarPositionIndex,
  MAX_ONELINER_LENGTH, validateOneLiners, KYUSEI_CONTENT_CAUTION, getSeasonWordCaution, getJstDateSlug,
} from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

// 同日の重複投稿防止（手動実行とスケジュール実行が重なった場合や、GitHub Actionsの
// スケジュールが同日に二重起動した場合の対策。post-threads-column.ts の履歴ファイル方式と同じ設計）。
const HISTORY_PATH = path.join(process.cwd(), 'data', 'yonaka-fortune-history.json');

function hasPostedToday(today: string): boolean {
  if (!fs.existsSync(HISTORY_PATH)) return false;
  const raw = fs.readFileSync(HISTORY_PATH, 'utf-8');
  let data: { lastPostedDate?: string };
  try {
    data = JSON.parse(raw) as { lastPostedDate?: string };
  } catch (e) {
    // 履歴ファイルが壊れている場合、「投稿していない」とみなして進めるのは危険
    // （実際には投稿済みで、壊れた直前に書き損じただけ、という可能性を否定できないため）。
    // 安全側に倒して処理を止める。手動で data/yonaka-fortune-history.json を確認・修復すること。
    throw new Error(`履歴ファイルの読み取りに失敗しました（JSON破損の可能性）: ${HISTORY_PATH}\n` +
      `内容を確認し、問題なければ手動で修復してください。安全のため投稿は行いません。\n原因: ${(e as Error).message}`);
  }
  return data.lastPostedDate === today;
}

function saveLastPostedDate(today: string): void {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ lastPostedDate: today }, null, 2), 'utf-8');
}

// GitHub Actionsの $GITHUB_OUTPUT に書き込む。ローカル実行（$GITHUB_OUTPUT未設定）では
// 何もしない（ローカルでの動作確認を妨げないため）。
function setGithubOutput(key: string, value: string): void {
  const outPath = process.env.GITHUB_OUTPUT;
  if (!outPath) return;
  fs.appendFileSync(outPath, `${key}=${value}\n`, 'utf-8');
}

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
- 行動・場面・注意点で具体的に。方位や宮名（中央・南西・北西など）を一言の本文に書かない。職場・家庭・会話・予定など、今日できる行動を示す
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

// Prevent vague palace/direction language from reaching the daily public post.
// Do not attempt to calculate fortunes here; the existing kyusei-ban library remains authoritative.
const VAGUE_FORTUNE_PATTERNS = [
  /(?:中央|北西|南西|北東|南東|東南|南|北|東|西)で(?:変化|権威|運気|評価|信用|縁|輝き)/,
  /(?:風のように|火の輝き|金運が交わる|天の助けで)/,
  /(?:変化の核心|運気が高まる|幸運が訪れる)/,
];
function validateConcreteAdvice(lines: Record<number, string>): boolean {
  const invalid = Object.entries(lines).filter(([, value]) =>
    VAGUE_FORTUNE_PATTERNS.some(pattern => pattern.test(value))
  );
  if (invalid.length) {
    console.warn('::warning::抽象的な九星コメントを検出。再生成します: ' + invalid.map(([star]) => star).join(','));
    return false;
  }
  return true;
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
    // 日々の占いは無料のまま維持。日曜のみ控えめに11月号へ誘導する。
    // 2026年11月末で自動停止し、古い月号へのリンクを残さない。
    ...(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }).slice(0, 7) === '2026-11'
      && new Date().toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }) === 'Sun'
      ? ['', '11月の詳しい九星別運勢をnoteにまとめました。仕事・お金・人間関係について、今月を心地よく過ごすヒントをお届けします。', 'https://note.com/kobayashi_done/n/n8fab3c4cc51a']
      : []),
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

// --claim: 本日まだ投稿していないかを確認し、未投稿なら予約（履歴ファイルへの記録）だけを
// 行って終了する。実際のThreads投稿はまだ行わない。ワークフロー側はこのステップの直後に
// 履歴ファイルをコミット・pushし、それが確実に成功した場合のみ --post を実行する設計。
function runClaim(): void {
  const today = getJstDateSlug();
  if (hasPostedToday(today)) {
    console.log(`::warning::本日（${today}）は既に投稿済みのためスキップします（重複投稿防止）。` +
      `Actionsの実行自体は成功扱いになりますが、実際の投稿は行っていません。`);
    setGithubOutput('should_post', 'false');
    return;
  }
  saveLastPostedDate(today);
  console.log(`✓ 本日（${today}）分を予約しました。この後コミット・pushが成功した場合のみ投稿します。`);
  setGithubOutput('should_post', 'true');
}

async function runPost(dryRun: boolean): Promise<void> {
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStarNum   = getDailyStar();
  const monthlyStarNum = getMonthlyStarForToday();
  console.log(`本日の日盤中宮: ${KYUSEI[dailyStarNum].name} / 月盤中宮: ${KYUSEI[monthlyStarNum].name}`);

  const MAX_RETRIES = 3;
  let oneLiners: Record<number, string> | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`Claude API で各星の一言を生成中...（試行${attempt}/${MAX_RETRIES}）`);
    const candidate = await generateOneLiners(dailyStarNum, monthlyStarNum);
    if (validateOneLiners(candidate) && validateConcreteAdvice(candidate)) {
      oneLiners = candidate;
      break;
    }
    const tooLong = Object.entries(candidate).filter(([, v]) => v.length > MAX_ONELINER_LENGTH);
    console.warn(`⚠️ 試行${attempt}: ${MAX_ONELINER_LENGTH}文字を超える一言を検出（${tooLong.map(([k, v]) => `${k}:「${v}」`).join(', ')}） → 再生成`);
  }

  if (oneLiners === null) {
    // The day has already been claimed and pushed by the workflow. Do not report
    // a successful run when nothing was posted; an operator must reconcile history.
    throw new Error('3回試行しても品質チェックを通過できず未投稿です。予約済み履歴とThreads実投稿を確認してください（自動再投稿は禁止）。');
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
  // 履歴への記録は --claim 時点で既にコミット・push済み（投稿前に予約する設計のため、
  // ここで改めて保存する必要はない）。
}

// 呼び出し方:
//   --dry-run          ローカル動作確認用。重複チェック・履歴の読み書き・投稿を一切行わない
//   --claim            本日分の予約のみ（投稿なし）。ワークフローはこの直後に履歴をコミット・push
//   --post             実際の生成・投稿のみ（--claim が既に成功している前提）
// 本番ワークフローから呼ぶときは --claim と --post を必ずペアで、間に確実なコミット・pushを挟むこと。
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const claim = process.argv.includes('--claim');
  const post = process.argv.includes('--post');

  console.log(`=== 九星気学まとめ投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);

  if (dryRun) {
    await runPost(true);
    return;
  }
  if (claim === post) {
    // 両方trueも両方falseも誤った呼び出し。本番で重複防止をバイパスしてしまう事故を防ぐため、
    // 曖昧な呼び出しは明示的なエラーで止める（どちらのモードかわからないまま実行しない）。
    throw new Error('--claim または --post のどちらか一方を指定してください（両方・どちらもなしは不可）。' +
      '動作確認のみなら --dry-run を使ってください。');
  }
  if (claim) {
    runClaim();
    return;
  }
  await runPost(false);
}

main().catch(e => { console.error(e); process.exit(1); });

/**
 * Threads コラム・トリビア投稿スクリプト（昼12時・夜23時共用）
 *
 * 使い方:
 *   npx ts-node scripts/post-threads-column.ts [--slot=noon|evening] [--dry-run]
 *
 * スロット別動作:
 *   noon   : 曜日テーマ優先の通常コラム（連作week・問いかけなし）
 *   evening: 連作week / 日曜問いかけ / 曜日テーマを適用
 *
 * 曜日テーマ（優先順位）:
 *   月: 今週の九星気学・運勢系
 *   水: 妖怪・神々
 *   金: 一文考察・掛け合わせ系
 *   日(夜のみ): 問いかけ投稿
 *   火・木・土: ランダム選出
 *
 * 連作week: 各月の最初の月曜日に自動テーマ選出。月・水・金・日の4投稿で連載。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID  = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const HISTORY_PATH        = path.join(process.cwd(), 'data', 'column-history.json');
const YONAKA_HISTORY_PATH = path.join(process.cwd(), 'data', 'yonaka-post-history.json');
const SERIES_PATH         = path.join(process.cwd(), 'data', 'series-week.json');
const HISTORY_KEEP = 100;

const SLOT: 'noon' | 'evening' = process.argv.includes('--slot=noon') ? 'noon' : 'evening';

const CATEGORIES = [
  '気学・易経',
  '日本の妖怪・神々',
  '日常の結界・しきたり（箸・敷居・塩などの所作）',
  '古代ミステリー（シュメール、ピラミッド等）',
  '量子力学・宇宙論',
  '都市伝説・スピリチュアル',
  '宗教の共通項（黄金律、因果応報など）',
  '科学・化学のふしぎ',
];

// 月間目標比率（%）
const CATEGORY_TARGETS: Record<string, number> = {
  '気学・易経':                               0.20,
  '日本の妖怪・神々':                          0.15,
  '日常の結界・しきたり（箸・敷居・塩などの所作）': 0.15,
  '古代ミステリー（シュメール、ピラミッド等）':    0.15,
  '量子力学・宇宙論':                           0.15,
  '宗教の共通項（黄金律、因果応報など）':          0.10,
  '科学・化学のふしぎ':                          0.10,
  '都市伝説・スピリチュアル':                    0.00, // 他スクリプトで担当
};

// 0=日 1=月 2=火 3=水 4=木 5=金 6=土
const DAY_THEMES: Record<number, string | null> = {
  0: null,
  1: '今週の九星気学・運勢系',
  2: null,
  3: '妖怪・神々',
  4: null,
  5: '一文考察・掛け合わせ系',
  6: null,
};

interface ColumnPost { date: string; text: string; category?: string; keywords?: string[]; }
interface SeriesWeek {
  current_month: string;
  theme: string;
  category: string;
  series_week_start: string;
  posts_completed: { monday: boolean; wednesday: boolean; friday: boolean; sunday: boolean };
}

function getJstDateSlug(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

function getJstDayOfWeek(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  return new Date(jstStr + 'T12:00:00Z').getDay();
}

function daysBetween(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}

function loadHistory(): ColumnPost[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    return (JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')) as { posts: ColumnPost[] }).posts ?? [];
  } catch { return []; }
}

function saveHistory(existing: ColumnPost[], newText: string, category?: string, keywords?: string[]): void {
  const today = getJstDateSlug();
  const entry: ColumnPost = { date: today, text: newText.slice(0, 200), ...(category ? { category } : {}), ...(keywords?.length ? { keywords } : {}) };
  const posts = [entry, ...existing].slice(0, HISTORY_KEEP);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ posts }, null, 2), 'utf-8');
}

function appendToYonakaHistory(text: string, category?: string, keywords?: string[]): void {
  try {
    const today = getJstDateSlug();
    const data = fs.existsSync(YONAKA_HISTORY_PATH)
      ? JSON.parse(fs.readFileSync(YONAKA_HISTORY_PATH, 'utf-8')) as { posts: object[] }
      : { posts: [] };
    const entry: object = { date: today, text: text.slice(0, 300), ...(category ? { category } : {}), ...(keywords?.length ? { keywords } : {}) };
    data.posts = [entry, ...data.posts].slice(0, 100);
    fs.writeFileSync(YONAKA_HISTORY_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* 履歴保存失敗は投稿に影響させない */ }
}

// 直近30日のカテゴリ不足を分析し、最も優先すべきカテゴリを返す
function selectCategoryByBalance(history: ColumnPost[], todayPosts: ColumnPost[]): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });

  const recent = history.filter(p => p.date >= cutoffStr && p.category);
  const total = recent.length;

  // 今日すでに投稿したカテゴリは除外候補
  const todayCategories = new Set(todayPosts.map(p => p.category).filter(Boolean));

  if (total === 0) {
    // 履歴なし → 最初は気学・易経から
    return '気学・易経';
  }

  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) counts[cat] = 0;
  for (const post of recent) {
    if (post.category && counts[post.category] !== undefined) counts[post.category]++;
  }

  // 目標比率との差分（不足が大きいほど優先）
  const deficits = CATEGORIES
    .filter(cat => CATEGORY_TARGETS[cat] > 0)                    // 目標0%は除外
    .filter(cat => !todayCategories.has(cat))                    // 当日使用済みは除外（あれば）
    .map(cat => ({ cat, deficit: CATEGORY_TARGETS[cat]! - (counts[cat]! / total) }))
    .sort((a, b) => b.deficit - a.deficit);

  // 除外後に候補がなければ当日フィルターを外す
  if (deficits.length === 0) {
    return CATEGORIES.filter(cat => CATEGORY_TARGETS[cat] > 0)[0] ?? CATEGORIES[0];
  }

  // 上位3候補から疑似ランダム選択（毎回同じにならないよう）
  const topN = deficits.slice(0, 3);
  const idx = new Date().getMinutes() % topN.length;
  return topN[idx]!.cat;
}

// 生成テキストと直近投稿の類似度を軽量チェック（LLMに判定させる）
async function checkSimilarity(client: Anthropic, newText: string, recentTexts: string[]): Promise<boolean> {
  if (recentTexts.length === 0) return false;
  const context = recentTexts.slice(0, 10).map((t, i) => `${i + 1}. ${t.slice(0, 150)}`).join('\n');
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: '類似判定専門家。JSONのみ返す。',
    messages: [{
      role: 'user',
      content: `新しい投稿と直近投稿の類似度が70%以上か判定してください。
新しい投稿：「${newText.slice(0, 200)}」
直近投稿：
${context}
{"similar": true} または {"similar": false} のみ返してください。`,
    }],
  });
  try {
    const raw = (message.content[0] as { type: string; text: string }).text;
    return (JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as { similar: boolean }).similar;
  } catch { return false; }
}

function loadSeriesWeek(): SeriesWeek | null {
  try {
    if (!fs.existsSync(SERIES_PATH)) return null;
    const data = JSON.parse(fs.readFileSync(SERIES_PATH, 'utf-8')) as SeriesWeek;
    return data.current_month ? data : null;
  } catch { return null; }
}

function saveSeriesWeek(data: SeriesWeek): void {
  fs.writeFileSync(SERIES_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function selectSeriesTheme(client: Anthropic, recentPosts: ColumnPost[]): Promise<{ theme: string; category: string }> {
  const recentContext = recentPosts.slice(0, 20).map(p => `- ${p.text}`).join('\n') || '（なし）';

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: '連作weekのテーマ選出専門家です。',
    messages: [{
      role: 'user',
      content: `今月の連作weekテーマを1つ選んでください。
カテゴリ：${CATEGORIES.join('、')}

直近の投稿（重複回避）：
${recentContext}

以下JSONのみ出力：
{"theme":"1週間で深掘りする具体的なテーマ名","category":"上記カテゴリの1つ"}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as { theme: string; category: string };
}

const SERIES_POSITION_LABELS = {
  monday:    '総論（テーマ全体の導入。なぜ今これが面白いのかを伝える）',
  wednesday: '深掘り①（テーマの核心・意外な事実や背景）',
  friday:    '深掘り②（現代・日常との接続。読者が「自分ごと」にできる切り口）',
  sunday:    '問いかけ（「あなたは〜ですか」「〜を考えたことがありますか」で締める）',
};

async function generateSeriesPost(
  client: Anthropic,
  position: keyof typeof SERIES_POSITION_LABELS,
  series: SeriesWeek,
  recentPosts: ColumnPost[],
): Promise<string> {
  const historyContext = recentPosts.length > 0
    ? `\n【直近の投稿（重複を避ける）】\n` + recentPosts.map((p, i) => `${i + 1}. ${p.text}`).join('\n')
    : '';

  const prompt = position === 'sunday'
    ? `連作week「${series.theme}」最終回（問いかけ）を書いてください。
役割：${SERIES_POSITION_LABELS[position]}
${historyContext}

【絶対守ること】
- 500文字以内
- 「あなたは〜ですか」「〜を、考えたことがありますか」の形で終わる
- 一文〜二文
- ですます調
- ハッシュタグなし

投稿文のみ出力。`
    : `連作week「${series.theme}」（カテゴリ：${series.category}）を書いてください。
役割：${SERIES_POSITION_LABELS[position]}
${historyContext}

【絶対守ること】
- 500文字以内
- ですます調（「〜ですよ」「〜ますよ」は使わない）
- ハッシュタグなし
- 「続きはnoteで」「詳細はnoteで」などのURL誘導は禁止
- 末尾に「この話、もう少し深いところまで書いた。」を入れても良い（自然な流れの場合のみ）

投稿文のみ出力。`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: 'あなたは「夜中のおじさん」です。Threadsに連作コラムを投稿します。',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

async function generateQuestionPost(client: Anthropic): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: 'あなたは「夜中のおじさん」です。Threadsに問いかけ投稿をします。',
    messages: [{
      role: 'user',
      content: `九星気学・妖怪・神話・結界・量子論・宗教などのテーマに関連した「問いかけ」を1本書いてください。

【絶対守ること】
- 答えを言わない。読者に考えさせる
- 短く。一文〜二文
- 「あなたは〜ですか」「〜を、考えたことがありますか」の形
- ハッシュタグなし
- 500文字以内

投稿文のみ出力（前置き・説明不要）。`,
    }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

async function generateColumnText(
  client: Anthropic,
  recentPosts: ColumnPost[],
  todayPosts: ColumnPost[],
  dayOfWeek: number,
  forcedCategory?: string,
): Promise<string> {
  const dayTheme = DAY_THEMES[dayOfWeek];
  const themeInstruction = dayTheme
    ? `今日の曜日テーマ：「${dayTheme}」に関連する内容を選ぶこと。`
    : '';

  const categoryInstruction = forcedCategory
    ? `【今回のカテゴリ（厳守）】${forcedCategory}\n上記カテゴリの内容のみで書くこと。`
    : `【カテゴリ（上記から選ぶ）】過去30日間で使用頻度が低いカテゴリを優先すること。`;

  const todayContext = todayPosts.length > 0
    ? `\n【本日すでに投稿した内容（必須：これらと同じテーマ・書き出しフレーズを当日中に繰り返さない）】\n` +
      todayPosts.map((p, i) => `${i + 1}. ${p.text}`).join('\n') + '\n'
    : '';

  const historyContext = recentPosts.filter(p => p.date < getJstDateSlug()).length > 0
    ? `\n【直近30日の投稿（テーマ・キーワードが70%以上重複する場合は再生成が必要）】\n` +
      recentPosts.filter(p => p.date < getJstDateSlug()).slice(0, 20).map((p, i) => `${i + 1}. ${p.date}: ${p.text}`).join('\n')
    : '';

  const prompt = `以下のカテゴリでThreadsコラムを書いてください。

【カテゴリ一覧】
1. 気学・易経
2. 日本の妖怪・神々
3. 日常の結界・しきたり（箸・敷居・塩などの所作）
4. 古代ミステリー（シュメール、ピラミッド等）
5. 量子力学・宇宙論
6. 都市伝説・スピリチュアル
7. 宗教の共通項（黄金律、因果応報など）
8. 科学・化学のふしぎ

${categoryInstruction}
${themeInstruction}
${todayContext}
${historyContext}

【絶対守ること】
- 500文字以内（超えると投稿できない）
- 「〜です」「〜ます」「〜かもしれません」というですます調（「〜ですよ」「〜ますよ」は使わない）
- 怪しい・神秘的すぎる表現はNG。知的好奇心を刺激する読み物にする
- 構成：身近な事実 → 意外な背景・他分野との関連 → 余韻のある一言
- 末尾に「この話、もう少し深いところまで書いた。」を入れても良い（自然な流れの場合のみ）
- ハッシュタグは一切入れない
- 「続きはnoteで」「詳細はnoteで」などのURL誘導は禁止

投稿文のみ出力（前置き・説明は不要）。`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: 'あなたは「夜中のおじさん」というキャラクターで、Threadsにコラムを投稿します。30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、親しみやすいおじさんです。20〜50代の読者に向けて、専門用語を使わず「〜です」「〜ます」というですます調で丁寧に語りかけます。「〜ですよ」「〜ますよ」は使いません。怪しい表現は避け、知的好奇心を刺激する読み物を書きます。',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

async function trySeriesPost(
  client: Anthropic,
  history: ColumnPost[],
  today: string,
  currentMonth: string,
  dayOfWeek: number,
): Promise<{ text: string; series: SeriesWeek } | null> {
  let series = loadSeriesWeek();

  // 月曜かつ新しい月 → 連作テーマ選出
  if (dayOfWeek === 1 && (!series || series.current_month !== currentMonth)) {
    console.log('連作weekテーマを選出中...');
    const newTheme = await selectSeriesTheme(client, history);
    series = {
      current_month: currentMonth,
      theme: newTheme.theme,
      category: newTheme.category,
      series_week_start: today,
      posts_completed: { monday: false, wednesday: false, friday: false, sunday: false },
    };
    saveSeriesWeek(series);
    console.log(`連作week開始: 「${series.theme}」`);
  }

  if (!series || series.current_month !== currentMonth || !series.series_week_start) return null;

  const diff = daysBetween(series.series_week_start, today);
  const positionByDiff: Record<number, keyof typeof SERIES_POSITION_LABELS> = {
    0: 'monday', 2: 'wednesday', 4: 'friday', 6: 'sunday',
  };
  const position = diff >= 0 && diff <= 6 ? positionByDiff[diff] : undefined;
  if (!position || series.posts_completed[position]) return null;

  console.log(`連作week「${series.theme}」- ${position}を生成`);
  const text = await generateSeriesPost(client, position, series, history);
  series.posts_completed[position] = true;
  return { text, series };
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
  const isEvening = SLOT === 'evening';
  const today = getJstDateSlug();
  const currentMonth = today.slice(0, 7);
  const dayOfWeek = getJstDayOfWeek();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  console.log(`=== Threads コラム投稿開始（${SLOT}）${dryRun ? '（DRY RUN）' : ''} ===`);
  console.log(`日付: ${today}（${dayNames[dayOfWeek]}）`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const client = new Anthropic();
  const history = loadHistory();

  // 当日の投稿履歴を抽出（同日重複防止に使用）
  const todayPosts = history.filter(p => p.date === today);
  console.log(`投稿履歴: 全${history.length}件 / 本日${todayPosts.length}件`);

  let text: string;
  let updatedSeries: SeriesWeek | null = null;
  let postLabel = 'コラム';
  let selectedCategory: string | undefined;

  if (isEvening) {
    if (dayOfWeek === 0) {
      console.log('日曜夜 → 問いかけ投稿を生成');
      text = await generateQuestionPost(client);
      postLabel = '問いかけ';
    } else {
      const seriesResult = await trySeriesPost(client, history, today, currentMonth, dayOfWeek);
      if (seriesResult) {
        text = seriesResult.text;
        updatedSeries = seriesResult.series;
        postLabel = '連作week';
        selectedCategory = seriesResult.series.category;
      } else {
        selectedCategory = selectCategoryByBalance(history, todayPosts);
        console.log(`カテゴリ選出（バランス補正）: ${selectedCategory}`);
        text = await generateWithRetry(client, history, todayPosts, dayOfWeek, selectedCategory);
      }
    }
  } else {
    selectedCategory = selectCategoryByBalance(history, todayPosts);
    console.log(`カテゴリ選出（バランス補正）: ${selectedCategory}`);
    text = await generateWithRetry(client, history, todayPosts, dayOfWeek, selectedCategory);
  }

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}（${postLabel}）${selectedCategory ? ` カテゴリ: ${selectedCategory}` : ''}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  // 一文考察（金曜: 一文考察・掛け合わせ系）→ 都市伝説、それ以外 → スピリチュアル
  const topicTag = (dayOfWeek === 5 && postLabel !== '連作week') ? '都市伝説' : 'スピリチュアル';

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text, topicTag);
  console.log(`コンテナID: ${creationId}（topic_tag: ${topicTag}）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);

  saveHistory(history, text, selectedCategory);
  appendToYonakaHistory(text, selectedCategory);
  if (updatedSeries) saveSeriesWeek(updatedSeries);
  console.log('✓ 投稿履歴を保存しました（column-history + yonaka-post-history）');
}

// 最大3回リトライ付き生成（類似度70%超の場合は再生成）
async function generateWithRetry(
  client: Anthropic,
  history: ColumnPost[],
  todayPosts: ColumnPost[],
  dayOfWeek: number,
  forcedCategory?: string,
): Promise<string> {
  const recentTexts = history.slice(0, 30).map(p => p.text);
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Claude API でコラム生成中... (試行${attempt}/3)`);
    const text = await generateColumnText(client, history, todayPosts, dayOfWeek, forcedCategory);
    const isSimilar = await checkSimilarity(client, text, recentTexts);
    if (!isSimilar) {
      if (attempt > 1) console.log(`✓ 類似度OK（${attempt}回目で合格）`);
      return text;
    }
    console.log(`類似度70%超のため再生成（試行${attempt}）`);
  }
  console.log('警告: 3回試行しても類似度が高め。最後の生成を使用します。');
  return await generateColumnText(client, history, todayPosts, dayOfWeek, forcedCategory);
}

main().catch(e => { console.error(e); process.exit(1); });

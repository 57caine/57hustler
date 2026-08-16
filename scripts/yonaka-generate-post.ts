/**
 * 夜中のおじさん Threads自動投稿スクリプト（全面見直し版）
 *
 * 変更点:
 * - 8カテゴリから毎回異なるカテゴリを選出（3日間クールダウン＋重み付け抽選）
 * - 新キーワードブラックリスト追加（夜間参詣・集積・沈積 等）
 * - 文体を「日常の疑問→じゃないでしょうか/ですかね」＋断定回避時の柔らかい言い回しに統一
 * - 5段階チェック（カテゴリ重複・禁止キーワード・文体・事実ベース断定チェック・類似度）
 * - 3回失敗でスキップ（ストックへのフォールバック廃止）
 *
 * カテゴリ優先度調整（品質安定化・優先カテゴリ調整指示）:
 * - 科学・化学のふしぎ / 宗教の共通項 を重み付けで優先選出
 * - 日月神事・神道の祭祀（神社・夜間参詣系）は重みを下げ、週1回以下の頻度目安に抑制
 *
 * 最高反応投稿の型強化（2026-08-15）:
 * - 科学・化学のふしぎ / 量子・宇宙論 カテゴリは「視点反転4ステップ」の型を必須化
 * - 上記2カテゴリの重みをさらに引き上げ（科学・化学5、量子・宇宙論4）
 *
 * 投稿品質強化（2026-08-16）:
 * - 「全てはバランス・陰陽である」という基本思想をシステムプロンプトに追加
 * - チェックを5段階化（禁止キーワード→文体→類似度→事実安全→わかりやすさ）
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const HISTORY_PATH = path.join(process.cwd(), 'data', 'yonaka-post-history.json');
const HISTORY_KEEP = 200; // 6投稿/日 × 30日超をカバー

// ────── 8カテゴリ定義 ──────
const CATEGORIES = [
  '気学・易経の豆知識',
  '日本の妖怪・神々',
  '結界・日常のしきたり',
  '古代ミステリー',
  '量子・宇宙論',
  '宗教の共通項',
  '科学・化学のふしぎ',
  '日月神事・神道の祭祀',
] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_HINTS: Record<Category, string> = {
  '気学・易経の豆知識':
    '九星気学・方位・易経・陰陽五行・干支の豆知識・気づき',
  '日本の妖怪・神々':
    '日本の神話・妖怪・八百万の神々・古事記・日本書紀の話',
  '結界・日常のしきたり':
    '箸・塩・敷居・節分・お守り・数字の縁起など日常に溶け込む結界・しきたり',
  '古代ミステリー':
    'シュメール文明・ピラミッド・古代の天文学・未解明の遺跡・古代数学',
  '量子・宇宙論':
    '量子力学・相対性理論・宇宙の構造・素粒子・ダークマター・多世界解釈',
  '宗教の共通項':
    '黄金律・因果応報・業・カルマ・慈悲など宗教を横断する共通テーマ',
  '科学・化学のふしぎ':
    '日常に潜む化学・物理現象・人体の不思議・生物の進化・脳の仕組み',
  '日月神事・神道の祭祀':
    '日本の祭祀・神道の儀式・神社の作法・天皇祭祀・季節の神事',
};

// ────── カテゴリ優先度（重み付け抽選） ──────
// 反応の良いカテゴリ（科学・化学のふしぎ／宗教の共通項）を優先選出し、
// 反応が薄く突っ込まれやすい神社・夜間参詣系（日月神事・神道の祭祀）は
// 週1回以下程度の頻度に抑える。数値は相対的な重み（絶対数ではない）。
const CATEGORY_WEIGHTS: Record<Category, number> = {
  '科学・化学のふしぎ': 5,
  '量子・宇宙論': 4,
  '宗教の共通項': 2,
  '気学・易経の豆知識': 1,
  '日本の妖怪・神々': 1,
  '結界・日常のしきたり': 1,
  '古代ミステリー': 1,
  '日月神事・神道の祭祀': 0.2,
};

// ────── 視点反転4ステップの型（科学・化学のふしぎ／量子・宇宙論カテゴリ限定） ──────
// 過去最高反応（11いいね・4コメント・1リポスト・表示424回）を獲得した投稿の型を
// 定型化したもの。①身近な事実→②視点反転→③概念の拡張→④問いかけ、の4ステップ構成。
const SCIENCE_TEMPLATE_CATEGORIES: readonly Category[] = ['科学・化学のふしぎ', '量子・宇宙論'];

const SCIENCE_TEMPLATE_BLOCK = `
【この投稿の型 — 科学・化学のふしぎ／量子・宇宙論カテゴリでは必ずこの4ステップで書くこと】
①身近な科学的事実・有名な概念から入る
②「でも考えてみると〜」で視点を反転させる
③「つまり〜ということ」で概念を広げる
④「だとしたら〜じゃないでしょうか」で問いかけて終わる

良い例（この型・トーンをそのまま参考にすること）：
「量子もつれの実験を読んでると思うんですけど、
遠く離れた二つの粒子が『瞬間的に影響し合う』って話ですよね。
でも考えてみると、あれって実は『粒子が個別に存在してない』
という意味だったんじゃないでしょうか。
測定される前は『両方が同時に複数の状態にある』ってわけで、
つまり『距離』という概念そのものが、観測される前には
存在してないのかもしれません。
だとしたら、私たちが『遠い』『近い』と感じてるのって、
実は『観測によって初めて作られた区別』なんじゃないでしょうか。」

この型が機能する理由：
・読者が自分の言葉で語りたくなる問いかけになっている
・専門家が補足コメントをしたくなる余白がある
・「確かに」と思わせる視点の反転がある
・難しい概念を日常の感覚に結びつけている

この型を使う場合、4ステップをすべて含めるため150〜250字程度まで許容する
（通常カテゴリの100〜200字ルールより多少長くてよい）。
`;

// ────── 型定義 ──────
interface HistoryEntry {
  date: string;
  text: string;
  category?: string;
}

// ────── トピック自動判定（キーワード判定） ──────
// 一般層への露出を優先するため、配列の並び順＝優先順位（複数キーワードが該当する場合は先頭が優先）
const TOPIC_KEYWORDS: { topic: string; keywords: string[] }[] = [
  { topic: '暮らし', keywords: ['大安', '仏滅', '六曜', '日取り', '結婚式', '引っ越し'] },
  { topic: '雑学', keywords: ['妖怪', '河童', '天狗', '鬼', '神話', '古事記'] },
  { topic: '日本文化', keywords: ['神社', '神事', 'お祓い', '祭祀'] },
  { topic: 'サイエンス', keywords: ['量子', '宇宙', 'ホログラム', '科学'] },
  { topic: '哲学', keywords: ['宗教', 'キリスト', '仏教', 'イスラム', '因果', '黄金律'] },
  { topic: '九星気学', keywords: ['九星気学', '本命星', '吉方位', '運勢'] },
  { topic: '易経', keywords: ['易経', '卦', '陰陽'] },
];

// 該当キーワードがない場合は topic_tag を付けず、従来通りThreads側の自動分類に委ねる
function determineTopicTag(text: string): string | undefined {
  const matched = TOPIC_KEYWORDS.find(({ keywords }) => keywords.some(kw => text.includes(kw)));
  return matched?.topic;
}

// ────── 禁止キーワード ──────
// 永久禁止（既存）＋30日再利用禁止対象キーワード（今回追加）
const BANNED_KEYWORDS = [
  // 既存禁止
  '脳脊髄液', '逆行', '量子的跳躍', '時間を遡行',
  '周波数に共鳴', '因果の逆流', '宇宙背景放射', '磁気共鳴',
  // 今回追加（繰り返し生成の元凶）
  '夜間参詣', '叶った事例', '集積', '沈積', '地誌に記録', '石段を踏んだ痕跡',
];

// ────── ヒストリ管理 ──────
function loadHistory(): HistoryEntry[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const data = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')) as { posts: HistoryEntry[] };
    return data.posts ?? [];
  } catch { return []; }
}

function saveHistory(existing: HistoryEntry[], newEntry: HistoryEntry): void {
  const posts = [newEntry, ...existing].slice(0, HISTORY_KEEP);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ posts }, null, 2), 'utf-8');
}

// ────── カテゴリ選出（3日間クールダウン） ──────
function getRecentCategories(history: HistoryEntry[]): Set<string> {
  const today = new Date();
  today.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const cutoff = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }));
  cutoff.setDate(cutoff.getDate() - 3);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return new Set(
    history
      .filter(e => e.date >= cutoffStr && e.category)
      .map(e => e.category!)
  );
}

function weightedPick(pool: Category[]): Category {
  const totalWeight = pool.reduce((sum, c) => sum + CATEGORY_WEIGHTS[c], 0);
  let r = Math.random() * totalWeight;
  for (const c of pool) {
    r -= CATEGORY_WEIGHTS[c];
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
}

function pickCategory(history: HistoryEntry[]): Category {
  const recentCats = getRecentCategories(history);
  const available = (CATEGORIES as readonly Category[]).filter(c => !recentCats.has(c));
  // 全カテゴリが3日以内に使用済みの場合は全解放
  const pool = available.length > 0 ? available : ([...CATEGORIES] as Category[]);
  return weightedPick(pool);
}

// ────── Claude API チェック群 ──────
async function checkStyle(text: string, client: Anthropic): Promise<boolean> {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: `以下の投稿文が、指定スタイルに合致しているか YES / NO だけ答えてください。

合致の条件（両方満たすこと）：
1. 日常的な疑問・気づき・ふとした発見から書き出している
2. 以下のいずれかの言い回しで終わっている：
   「じゃないでしょうか」「ですかね」
   「という見方もできるかもしれません」
   「と感じるのは私だけでしょうか」
   「なのかな、とふと思いました」`,
    messages: [{ role: 'user', content: text }],
  });
  const answer = (res.content[0] as { type: string; text: string }).text.trim().toUpperCase();
  return answer.startsWith('YES');
}

async function checkFactSafety(text: string, client: Anthropic): Promise<boolean> {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: `以下の投稿文について判定してください。

「この投稿は事実として断定的すぎる表現を含んでおり、
専門家が読んだら『それは違います』と指摘できる余地があるか？」

該当する場合は YES、該当しない（事実ベースであるか、
断定ではなく問いかけ・考察のトーンに収まっている）場合は NO とだけ答えてください。`,
    messages: [{ role: 'user', content: text }],
  });
  const answer = (res.content[0] as { type: string; text: string }).text.trim().toUpperCase();
  return answer.startsWith('YES');
}

async function checkSimilarity(text: string, history: HistoryEntry[], client: Anthropic): Promise<boolean> {
  const recent = history.slice(0, 30);
  if (recent.length === 0) return false;
  const historyText = recent.map((p, i) => `${i + 1}. ${p.text}`).join('\n');
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: '新しい投稿が過去の投稿のいずれかと70%以上類似していれば YES、そうでなければ NO とだけ答えてください。',
    messages: [{ role: 'user', content: `新しい投稿:\n${text}\n\n過去の投稿:\n${historyText}` }],
  });
  const answer = (res.content[0] as { type: string; text: string }).text.trim().toUpperCase();
  return answer.startsWith('YES');
}

async function checkReadability(text: string, client: Anthropic): Promise<boolean> {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: `以下の投稿文について判定してください。

「この投稿は、専門知識のない読者が初見で一度読んだだけで意味がわかるか？」

わかる場合は YES、専門用語が説明なく使われている・
文の構造が複雑で読み返さないと意味が取れない、
などでわかりにくい場合は NO とだけ答えてください。`,
    messages: [{ role: 'user', content: text }],
  });
  const answer = (res.content[0] as { type: string; text: string }).text.trim().toUpperCase();
  return answer.startsWith('YES');
}

// ────── 生成 ──────
async function generatePost(category: Category, history: HistoryEntry[], client: Anthropic): Promise<string> {
  const recentTexts = history.slice(0, 30).map(p => `- ${p.text}`).join('\n') || '（履歴なし）';
  const templateBlock = SCIENCE_TEMPLATE_CATEGORIES.includes(category) ? SCIENCE_TEMPLATE_BLOCK : '';

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `あなたは「夜中のおじさん」です。知的好奇心旺盛な中年男性が、ふと思ったことをつぶやくスタイルで投稿を書いてください。

【コンテンツの根底にある思想】
「全てはバランス・陰陽である」
良いものも悪いものもどちらも必要で、重要なのはそのバランス。
どちらかが10割ではいけない。
この思想を投稿の随所に自然に混ぜること（毎回明示的に語る必要はない。断定を避け、両面を意識した視点として滲ませる程度でよい）。

【必須スタイル — 以下の良い例と同じ形式で書くこと】

良い例：
「九星気学で言う『気』と量子論の『波動』って、
結局同じものを違う言語で説明してるんじゃないでしょうか。
もし本当にそうなら、古い結界の配置と量子の確率分布って
関係あるんですかね。」

スタイルルール：
・日常的な疑問・気づき・ふとした発見から書き始める
・100〜200字程度。短く・わかりやすく・余白がある
・難解な専門用語は使わない。読んだ人が「確かに…」と思える内容

【文末表現】
基本は「じゃないでしょうか」「ですかね」で締める。
ただし、内容が断定に近い言い切りになりそうな場合は、
必ず以下のいずれかに置き換えて、表現を柔らかくすること：
・「〜という見方もできるかもしれません」
・「〜と感じるのは私だけでしょうか」
・「〜なのかな、とふと思いました」

【絶対禁止】
・主語が長い文
・「証左」「沈積」「集積」「夜間参詣」「地誌に記録」「叶った事例」などの繰り返しテーマ・難語
・事実として断言する科学的に根拠のない主張
・専門家が読んで「それは違います」と指摘できるような断定表現
（該当しそうな内容は、上記の柔らかい文末表現を使って言い切りを避けること）
・ハッシュタグ
・ですます調以外の一人称禁止（私は〜ではなく、客観的な問いかけスタイルで）

【今回のカテゴリ】
${category}

【テーマヒント】
${CATEGORY_HINTS[category]}
${templateBlock}
【過去30日の投稿（これと被らないこと）】
${recentTexts}`,
    messages: [{ role: 'user', content: `【${category}】で投稿を1件生成してください。` }],
  });

  return (res.content[0] as { type: string; text: string }).text.trim();
}

// ────── Threads API ──────
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

// ────── メイン ──────
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`=== 夜中のおじさん投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) {
    throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');
  }

  const history = loadHistory();
  console.log(`投稿履歴: 直近${history.length}件を参照`);

  const client = new Anthropic();
  const MAX_RETRIES = 3;
  let finalText: string | null = null;
  let finalCategory: Category | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    // カテゴリ選出（3日間クールダウン適用）
    const category = pickCategory(history);
    console.log(`\n試行${attempt}/${MAX_RETRIES}: カテゴリ「${category}」で生成中...`);

    // 生成
    let candidate: string;
    try {
      candidate = await generatePost(category, history, client);
    } catch (e) {
      console.warn(`⚠️ 試行${attempt}: API生成失敗 → ${(e as Error).message}`);
      continue;
    }
    console.log(`生成テキスト:\n${candidate}`);

    // チェック1: キーワードブラックリスト
    if (BANNED_KEYWORDS.some(kw => candidate.includes(kw))) {
      const hit = BANNED_KEYWORDS.find(kw => candidate.includes(kw));
      console.warn(`⚠️ チェック1失敗: 禁止キーワード「${hit}」検出 → 再生成`);
      continue;
    }

    // チェック2: 文体チェック（Claude判定）
    const styleOk = await checkStyle(candidate, client);
    if (!styleOk) {
      console.warn(`⚠️ チェック2失敗: 指定の文末表現スタイルに合致しない → 再生成`);
      continue;
    }

    // チェック3: 類似度チェック（Claude判定 vs 直近30投稿・70%以上類似でNG）
    const tooSimilar = await checkSimilarity(candidate, history, client);
    if (tooSimilar) {
      console.warn(`⚠️ チェック3失敗: 直近30投稿と70%以上類似 → 再生成`);
      continue;
    }

    // チェック4: 事実ベース・断定表現チェック（専門家に指摘される余地がないか）
    const tooAssertive = await checkFactSafety(candidate, client);
    if (tooAssertive) {
      console.warn(`⚠️ チェック4失敗: 専門家に指摘される余地のある断定表現を検出 → 再生成`);
      continue;
    }

    // チェック5: わかりやすさチェック（初見で一度読んで意味がわかるか）
    const readable = await checkReadability(candidate, client);
    if (!readable) {
      console.warn(`⚠️ チェック5失敗: 初見でわかりにくい表現を検出 → 再生成`);
      continue;
    }

    // 全チェック通過
    finalText = candidate;
    finalCategory = category;
    console.log(`\n✓ 全チェック通過（試行${attempt}）カテゴリ:「${category}」`);
    break;
  }

  // 3回失敗 → スキップ（ストックにフォールバックしない）
  if (finalText === null) {
    console.warn('\n⚠️ 3回試行後も全チェックを通過できなかったため、今回の投稿をスキップします');
    process.exit(0);
  }

  // 40%の確率でnote.comリンクを追加（チェック通過後に付与）
  let postText = finalText;
  if (Math.random() < 0.4) {
    postText += '\n\nこの話、もう少し深いところまで書いた。\nhttps://note.com/kobayashi_done';
  }

  const topicTag = determineTopicTag(finalText);

  console.log('\n--- 最終テキスト ---');
  console.log(postText);
  console.log(`文字数: ${postText.length}`);
  console.log(`topic_tag: ${topicTag ?? '（該当キーワードなし → Threads側の自動分類）'}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(postText, topicTag);
  console.log(`コンテナID: ${creationId}`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  saveHistory(history, { date: today, text: finalText, category: finalCategory! });
  console.log('✓ 投稿履歴を保存しました');
}

main().catch(e => { console.error(e); process.exit(1); });

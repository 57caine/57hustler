/**
 * Threads 夜21時自動投稿スクリプト
 *
 * 月・水・金: 本命星別・一言占い（夜・就寝前）
 * 火・木・土: 一文考察
 * 日:         問いかけ投稿
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID  = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

// ─── 九星気学マスターデータ ───────────────────────────────────
const KYUSEI: Record<number, { short: string; emoji: string; element: string }> = {
  1: { short: '一白', emoji: '⚪', element: '水' },
  2: { short: '二黒', emoji: '🟤', element: '土' },
  3: { short: '三碧', emoji: '🟢', element: '木' },
  4: { short: '四緑', emoji: '🟢', element: '木' },
  5: { short: '五黄', emoji: '🟡', element: '土' },
  6: { short: '六白', emoji: '⚪', element: '金' },
  7: { short: '七赤', emoji: '🔴', element: '金' },
  8: { short: '八白', emoji: '🟤', element: '土' },
  9: { short: '九紫', emoji: '🔴', element: '火' },
};

const POSITION_MEANINGS: Record<number, { name: string; direction: string; meaning: string }> = {
  1: { name: '坎宮', direction: '北',   meaning: '苦難の中の知恵・真の才能が試される・水の流れに乗る' },
  2: { name: '坤宮', direction: '南西', meaning: '忍耐・地道な積み重ね・縁の下の力持ち' },
  3: { name: '震宮', direction: '東',   meaning: '動く・始める・積極行動が吉・発言が力になる' },
  4: { name: '巽宮', direction: '東南', meaning: '縁・信用・コミュニケーション・風のように広がる' },
  5: { name: '中宮', direction: '中央', meaning: '影響力最大・変化の核心・動きが大きく出る' },
  6: { name: '乾宮', direction: '北西', meaning: '権威・天の助け・完成期・リーダーシップ発揮' },
  7: { name: '兌宮', direction: '西',   meaning: '喜び・交際・金運・口から縁が生まれる' },
  8: { name: '艮宮', direction: '北東', meaning: '内に蓄える・変革の準備期・山のように待つ' },
  9: { name: '離宮', direction: '南',   meaning: '火の輝き・表現・名誉・発信が実を結ぶ' },
};

// ─── 日盤・月盤計算 ──────────────────────────────────────────
function getDailyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const diff = Math.round((new Date(jstStr).getTime() - new Date('2024-01-06').getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

function getYearlyStar(year: number): number {
  return ((4 - 1 - (year - 2024) % 9 + 900) % 9) + 1;
}

function getMonthlyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const year  = parseInt(jstStr.slice(0, 4));
  const month = parseInt(jstStr.slice(5, 7));
  const febStar = [8, 5, 2][(getYearlyStar(year) - 1) % 3];
  const offset = month >= 2 ? month - 2 : month + 10;
  return ((febStar - 1 - offset + 900) % 9) + 1;
}

function getStarPositionIndex(k: number, dailyStar: number): number {
  return ((k - dailyStar + 13) % 9) + 1;
}

// ─── 曜日取得 ─────────────────────────────────────────────────
function getJstDayOfWeek(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  return new Date(jstStr + 'T12:00:00Z').getDay();
}

type PostType = 'horoscope' | 'ikkouiku' | 'toikake';

function getPostType(dow: number): PostType {
  if (dow === 1 || dow === 3 || dow === 5) return 'horoscope'; // 月・水・金
  if (dow === 0) return 'toikake';                              // 日
  return 'ikkouiku';                                            // 火・木・土
}

// ─── 禁止キーワードフィルター ────────────────────────────────
const BANNED_KEYWORDS = [
  '脳脊髄液', '逆行', '量子的跳躍', '時間を遡行',
  '周波数に共鳴', '因果の逆流', '宇宙背景放射', '磁気共鳴',
];

function containsBannedKeyword(text: string): boolean {
  return BANNED_KEYWORDS.some(kw => text.includes(kw));
}

// ─── 夜占い生成（月・水・金）─────────────────────────────────
async function generateNightHoroscope(dailyStarNum: number, monthlyStarNum: number): Promise<Record<number, string>> {
  const client = new Anthropic();

  const positionInfo = Array.from({ length: 9 }, (_, i) => {
    const k = i + 1;
    const pos = POSITION_MEANINGS[getStarPositionIndex(k, dailyStarNum)];
    return `  ${KYUSEI[k].short}（${KYUSEI[k].element}）→ ${pos.name}（${pos.direction}）: ${pos.meaning}`;
  }).join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: '九星気学に詳しいおじさんです。月盤・日盤の回座宮を踏まえた就寝前・夜の一言アドバイスを生成します。',
    messages: [{
      role: 'user',
      content: `月盤中宮：${KYUSEI[monthlyStarNum].short}
日盤中宮：${KYUSEI[dailyStarNum].short}

各星の本日の日盤回座宮：
${positionInfo}

月盤＋各星の回座宮の組み合わせから、
「今夜・就寝前」の時間帯に合わせた一言を生成してください。

【ルール】
- 朝の全体運投稿と内容が被らないようにする
- 夜・就寝前という時間帯を意識した内容
  （今夜やること・明日の準備・眠りの前に意識すること）
- 各星の一言は8文字以内・体言止め
- 象意の言い換えは禁止（「地盤を固める」など不可）
  良い例：「手帳を閉じて」「明日の服を決めて」「窓を開けて眠れ」

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v).slice(0, 8)]));
}

function buildHoroscopeText(oneLiners: Record<number, string>): string {
  const lines = [
    '🌙 今夜の本命星別',
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return `${KYUSEI[n].emoji}${KYUSEI[n].short}｜${oneLiners[n] ?? ''}`;
    }),
    '',
    '#九星気学 #今夜の運勢 #夜中のおじさん',
  ];
  return lines.join('\n');
}

// ─── 易経：日盤中宮星 → 八卦 → 卦マッピング ──────────────
const STAR_TO_TRIGRAM: Record<number, string> = {
  1: '坎（水）', 2: '坤（地）', 3: '震（雷）', 4: '巽（風）',
  5: '坤（地）', 6: '乾（天）', 7: '兌（沢）', 8: '艮（山）', 9: '離（火）',
};

// 各八卦の代表的な卦（番号・名・易経原文キーワード）
const TRIGRAM_HEXAGRAMS: Record<string, { num: number; name: string; keyword: string }[]> = {
  '坎（水）': [
    { num: 29, name: '坎為水（かんいすい）', keyword: '重なる険難。水は低きに流れ、止まらず進む。誠実さが険を超える。' },
    { num: 47, name: '沢水困（たくすいこん）', keyword: '包囲と困窮。君子は困しても志を曲げない。' },
    { num: 48, name: '水風井（すいふうせい）', keyword: '井戸は変わらぬ恵み。本質は動かない。' },
  ],
  '坤（地）': [
    { num: 2,  name: '坤為地（こんいち）', keyword: '大地は万物を育む。柔順にして広大、従うことで功を成す。' },
    { num: 15, name: '地山謙（ちさんけん）', keyword: '謙（けん）は亨る。君子は有終あり。' },
    { num: 46, name: '地風升（ちふうしょう）', keyword: '南に征くは吉。積み重ねが上昇を生む。' },
  ],
  '震（雷）': [
    { num: 51, name: '震為雷（しんいらい）', keyword: '雷鳴に驚いても笑いが戻る。震えつつ粛然として失わず。' },
    { num: 16, name: '地雷豫（ちらいよ）', keyword: '楽しみに備える。動かす時を得れば天地も従う。' },
    { num: 40, name: '雷水解（らいすいかい）', keyword: '険難が解ける。西南に往けば吉。' },
  ],
  '巽（風）': [
    { num: 57, name: '巽為風（そんいふう）', keyword: '風は重ねて吹く。柔順に繰り返すことで志が通る。' },
    { num: 53, name: '風山漸（ふうさんぜん）', keyword: '女が嫁ぐ漸進。鴻が磐（いわ）に到る。焦らぬことが正道。' },
    { num: 20, name: '風地観（ふうちかん）', keyword: '観る。手を洗い祭りを前にした敬けんな静けさ。' },
  ],
  '乾（天）': [
    { num: 1,  name: '乾為天（けんいてん）', keyword: '龍の徳。潜み、現れ、跳び、飛ぶ。時節を見て動く。' },
    { num: 14, name: '火天大有（かてんたいゆう）', keyword: '大いに有つ。柔中にして上に応じ、文明・剛健。元いに亨る。' },
    { num: 43, name: '沢天夬（たくてんかい）', keyword: '決断。王庭に揚ぐ。独り走らず、衆に告げよ。' },
  ],
  '兌（沢）': [
    { num: 58, name: '兌為沢（だいたく）', keyword: '喜ぶ。友と講習すれば朋来たる。内に誠を持ち外に柔らか。' },
    { num: 31, name: '沢山咸（たくさんかん）', keyword: '感応。天地感じて万物化生す。女を取るは吉。' },
    { num: 54, name: '雷沢帰妹（らいたくきまい）', keyword: '帰妹（きまい）。征けば凶。得るものなし。分を知る。' },
  ],
  '艮（山）': [
    { num: 52, name: '艮為山（ごんいさん）', keyword: '止まる。動かぬべき時は動かぬ。その身を失わず。' },
    { num: 22, name: '山火賁（さんかひ）', keyword: '飾る。文明以て止まる。賁は亨る、小事に往くは吉。' },
    { num: 26, name: '山天大畜（さんてんたいちく）', keyword: '大いに蓄える。剛健・篤実・輝き。日に徳を新にす。' },
  ],
  '離（火）': [
    { num: 30, name: '離為火（りいか）', keyword: '麗す（つく）。柔が中を得て正に麗す。牝牛を畜うは吉。' },
    { num: 35, name: '火地晋（かちしん）', keyword: '晋む（すすむ）。康侯（こうこう）は馬を賜わり昼三たび接す。' },
    { num: 21, name: '火雷噬嗑（からいぜいこう）', keyword: '噬嗑（かみあわせ）。獄を用うるは吉。障害を取り除く決断。' },
  ],
};

function selectHexagram(dailyStar: number, dateStr: string): { num: number; name: string; keyword: string; trigram: string } {
  const trigram = STAR_TO_TRIGRAM[dailyStar];
  const hexagrams = TRIGRAM_HEXAGRAMS[trigram];
  // 日付から決定論的に選択（ランダムではなく日付依存）
  const dayNum = parseInt(dateStr.slice(8, 10));
  const hex = hexagrams[dayNum % hexagrams.length];
  return { ...hex, trigram };
}

// ─── 一文考察・問いかけ生成（火・木・土・日）────────────────
async function generateShortPost(isSunday: boolean, dailyStarNum?: number): Promise<string> {
  const client = new Anthropic();

  const ABSOLUTE_BAN = `【絶対禁止ルール・最優先】
以下は絶対に生成してはいけない。
・科学用語を組み合わせた存在しない説・現象の創作
・「という説がある」「とも言われている」を使いながら実際には存在しない説を作ること
・根拠のないスピリチュアル的主張を事実のように書くこと
・「それっぽく聞こえる」だけで裏付けのない文章

【使用禁止ワード（以下を含む文章は出力禁止）】
脳脊髄液 / 逆行 / 量子的跳躍 / 時間を遡行 / 周波数に共鳴 / 因果の逆流 / 宇宙背景放射 / 磁気共鳴

【許可テーマ】
- 歴史的記録・史料に基づく神事・民俗・伝承
- 実在する神話・説話・民間伝承の解説
- 査読済み研究・学術的知見
- 神社・神事・易経・九星気学の伝統的解釈

【禁止テーマ】
- 科学用語を組み合わせた創作理論
- 存在しない儀式・作法・効果の説明
- 根拠のない行為と結果の因果関係

【「という説がある」が使える条件（いずれかのみ）】
1. 実際に研究者・学者が発表した説
2. 歴史的記録・史料に残る伝承
3. 査読済みの論文・研究報告
4. 民間伝承として記録されているもの

【出力前の自己チェック（内部処理）】
□ この投稿に書いた「説」は実在するか
□ 禁止ワードが含まれていないか
□ 「という説がある」の根拠は何か
　→ 引っかかった場合は生成し直す。`;

  const [system, userPrompt] = isSunday
    ? [
        `あなたは「夜中のおじさん」です。Threadsに問いかけ投稿をします。
${ABSOLUTE_BAN}`,
        `日本の神事・神話・伝承・民俗に関連した「問いかけ」を1本書いてください。

【ルール】
- 答えを言わない。読者に考えさせる
- 短く。一文〜二文
- 「あなたは〜ですか」「〜を、考えたことがありますか」の形が望ましい
- ハッシュタグなし
- 500文字以内厳守

【参考トーン】
「柏手を打つ時、あなたは何を考えていますか。」
「あなたの地元に、妖怪はいますか。」

投稿文のみ出力（説明・前置き不要）。`,
      ]
    : (() => {
        const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
        const star = dailyStarNum ?? getDailyStar();
        const hex = selectHexagram(star, jstStr);
        const trigramLabel = STAR_TO_TRIGRAM[star];

        return [
          `あなたは「夜中のおじさん」です。Threadsに一文考察を投稿します。
${ABSOLUTE_BAN}`,
          `今日の日盤中宮は${star}（${trigramLabel}に対応）です。
易経の第${hex.num}卦「${hex.name}」を今日の卦として選びました。
原文キーワード：「${hex.keyword}」

この卦の解釈・象意・歴史的背景を踏まえた「一文考察」を1本書いてください。

【ルール】
- 易経の原文・伝統的解釈に基づいていること（創作・拡大解釈禁止）
- 一文〜三文以内。短いほど良い
- 難しい漢字にはルビまたは読み仮名を添える
- ハッシュタグなし
- 500文字以内厳守
- 卦の番号・名前を冒頭に書く必要はない（内容で示す）

【良い例（粒度・トーンの基準）】
「坤（地）の卦は、龍が現れても野に潜んで争わないと説く。目立たぬことが、最大の守りだという発想だ。」
「謙（けん）の卦では、満ちたものは損なわれ、謙ったものは益を受けると説く。易経が2500年前に書いた、最古の逆張り論かもしれない。」
「震（雷）の卦は、雷鳴に震えながらも笑いが戻ると描く。驚きを経てこそ、本当の落ち着きが生まれるという構造だ。」

投稿文のみ出力（説明・前置き不要）。`,
        ];
      })();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

// ─── Threads投稿 ──────────────────────────────────────────────
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

// ─── メイン ──────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const dow = getJstDayOfWeek();
  const postType = getPostType(dow);
  const DOW_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

  console.log(`=== 夜21時投稿開始（${DOW_NAMES[dow]}曜・${postType}）${dryRun ? '【DRY RUN】' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  let text: string;

  if (postType === 'horoscope') {
    const dailyStarNum   = getDailyStar();
    const monthlyStarNum = getMonthlyStar();
    console.log(`日盤中宮: ${KYUSEI[dailyStarNum].short} / 月盤中宮: ${KYUSEI[monthlyStarNum].short}`);
    console.log('Claude API で夜占いを生成中...');
    const oneLiners = await generateNightHoroscope(dailyStarNum, monthlyStarNum);
    text = buildHoroscopeText(oneLiners);
  } else {
    const isSunday = postType === 'toikake';
    const dailyStarNum = getDailyStar();
    const trigramLabel = STAR_TO_TRIGRAM[dailyStarNum];
    console.log(`日盤中宮: ${KYUSEI[dailyStarNum].short}（${trigramLabel}）`);
    const MAX_RETRIES = 3;
    let generated: string | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`Claude API で${isSunday ? '問いかけ' : '一文考察（易経）'}を生成中...（試行${attempt}/${MAX_RETRIES}）`);
      const candidate = await generateShortPost(isSunday, dailyStarNum);
      if (!containsBannedKeyword(candidate)) {
        generated = candidate;
        break;
      }
      console.warn(`⚠️ 試行${attempt}回目: 禁止キーワード検出 → 再生成`);
    }
    if (generated === null) {
      console.warn('⚠️ 3回連続で禁止キーワード検出。今回の投稿をスキップします');
      return;
    }
    text = generated;
  }

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

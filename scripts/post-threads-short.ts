/**
 * Threads 夜21時自動投稿スクリプト
 *
 * 月・水・金: 本命星別・一言占い（夜・就寝前）
 * 火・木・土: 一文考察
 * 日:         問いかけ投稿
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  KYUSEI, POSITION_MEANINGS, getDailyStar, getMonthlyStarForToday, getStarPositionIndex,
  getJstDayOfWeek, STAR_TO_TRIGRAM, selectHexagram,
} from './lib/kyusei-ban';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID  = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

type PostType = 'horoscope' | 'ikkouiku' | 'toikake';

function getPostType(dow: number): PostType {
  if (dow === 1 || dow === 3 || dow === 5) return 'horoscope'; // 月・水・金
  if (dow === 0) return 'toikake';                              // 日
  return 'ikkouiku';                                            // 火・木・土
}

const STYLE_GUIDE = `投稿文は以下のスタイルで書くこと。

【良い書き方】
・日常的な疑問や気づきから入る
・「〜じゃないでしょうか」「〜ですかね」「〜かもしれませんね」など、読者に問いかける形で終わる
・難しい概念は身近な言葉に置き換える
・読んだ人が「確かに」と思える切り口を選ぶ
・短文・余白・改行を意識する

【やってはいけない書き方】
・主語が長い文
・「証左」「沈積」「集積」など難解な表現
・結論を押しつける断定文
・読者が入り込む余地のない一方的な文章`;

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
- 各星の一言は10文字以内で、意味が必ず完結する文にすること。途中で切れる文は絶対に生成しない。
  助詞（「を」「に」「が」「の」など）で終えてはいけない。動詞か名詞で言い切ること
- 体言止め・動詞終わりのどちらでもよい
- 象意の言い換えは禁止（「地盤を固める」など不可）
  良い例：「手帳を閉じて眠る」「明日の服を決めて」「窓を開けて眠れ」
  NG例：「今日の変化を手帳」（助詞で切れている）「明日のリーダーシ」（単語の途中で切れている）
- 10文字に収まらない内容は、要素を削って短くまとめる（尻切れにしない）

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v).slice(0, 10)]));
}

function buildHoroscopeText(oneLiners: Record<number, string>): string {
  const lines = [
    '🌙 今夜の本命星別',
    '',
    ...Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return `${KYUSEI[n].emoji}${KYUSEI[n].short}\n${oneLiners[n] ?? ''}`;
    }),
    '',
    '#九星気学 #今夜の運勢 #夜中のおじさん',
  ];
  return lines.join('\n');
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
${ABSOLUTE_BAN}
${STYLE_GUIDE}`,
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
${ABSOLUTE_BAN}
${STYLE_GUIDE}`,
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
    const monthlyStarNum = getMonthlyStarForToday();
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

  const TOPIC_TAG: Record<PostType, string> = {
    horoscope: '九星気学',
    ikkouiku:  '易経',
    toikake:   'スピリチュアル',
  };
  const topicTag = TOPIC_TAG[postType];

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text, topicTag);
  console.log(`コンテナID: ${creationId}（topic_tag: ${topicTag}）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

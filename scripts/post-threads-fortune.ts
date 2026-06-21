/**
 * Threads 九星気学 日次自動投稿スクリプト
 *
 * 本日の日盤中宮星を算出し、星の特性に基づく運勢をClaude APIで生成してThreadsに投稿する。
 * 全てのコンテンツは九星気学の原則・五行理論に基づく。
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

// 九星データベース（五行・方位・特性・各運勢の傾向）
const KYUSEI: Record<number, {
  name: string; element: string; direction: string; color: string;
  birthYears: string;
  keywords: string[];
  fortune: { overall: string; money: string; love: string; work: string; caution: string };
}> = {
  1: {
    name: '一白水星', element: '水', direction: '北', color: '白・黒',
    birthYears: '1973・1982・1991・2000・2009年生まれ',
    keywords: ['知恵', '流れ', '柔軟', '人脈', '縁'],
    fortune: { overall: '流れに乗ることで道が開ける', money: '情報や人脈が収益に繋がる', love: '感情を素直に表現する日', work: '情報収集・ネットワークが吉', caution: '優柔不断に注意' },
  },
  2: {
    name: '二黒土星', element: '土', direction: '南西', color: '黄・茶',
    birthYears: '1972・1981・1990・1999・2008年生まれ',
    keywords: ['継続', '忍耐', '家庭', '母性', '蓄積'],
    fortune: { overall: '地道な積み重ねが最大の力', money: 'コツコツ貯める・節約が正解', love: '家庭運◎ 相手を支える姿勢が○', work: '縁の下の力持ち役が評価される', caution: '無理な拡大は避けて' },
  },
  3: {
    name: '三碧木星', element: '木', direction: '東', color: '碧・緑',
    birthYears: '1971・1980・1989・1998・2007年生まれ',
    keywords: ['行動', '発展', '若さ', '革新', '音'],
    fortune: { overall: '動いた分だけ運気が上がる日', money: '積極的な行動が収入を生む', love: '先手必勝。思いを伝えて', work: '新しい挑戦・提案が吉', caution: '衝動的な判断に注意' },
  },
  4: {
    name: '四緑木星', element: '木', direction: '東南', color: '緑',
    birthYears: '1970・1979・1988・1997・2006年生まれ',
    keywords: ['信用', '縁', '旅', '風', '商売'],
    fortune: { overall: '縁と信用が広がる日', money: '人脈・紹介から収益が生まれる', love: '自然な出会い・縁に期待', work: '評判・口コミが力になる', caution: '八方美人にならないよう注意' },
  },
  5: {
    name: '五黄土星', element: '土', direction: '中央', color: '黄',
    birthYears: '1969・1978・1987・1996・2005年生まれ',
    keywords: ['帝王', '変革', '破壊と創造', '強力', '中心'],
    fortune: { overall: '大きな力が動く。慎重に構えて', money: '大きく動く日。焦らず判断を', love: '強い縁が動く可能性あり', work: '決断力が問われる重要な日', caution: '無理・暴走は禁物' },
  },
  6: {
    name: '六白金星', element: '金', direction: '北西', color: '白・金',
    birthYears: '1968・1977・1986・1995・2004年生まれ',
    keywords: ['権威', '決断', '正義', '天', '指導'],
    fortune: { overall: '実力と権威が輝く日', money: '実力が正当に評価される', love: 'リードする姿勢が魅力になる', work: '決断・指導力を発揮する場面', caution: '高圧的にならないよう注意' },
  },
  7: {
    name: '七赤金星', element: '金', direction: '西', color: '赤・白',
    birthYears: '1967・1976・1985・1994・2003年生まれ',
    keywords: ['喜び', '口', '金運', '交際', '楽しみ'],
    fortune: { overall: '喜びと社交運が高まる日', money: '出費も多いが収入の縁も来る', love: '楽しい会話が縁を結ぶ', work: 'プレゼン・交渉・接待が吉', caution: '散財・口の軽さに注意' },
  },
  8: {
    name: '八白土星', element: '土', direction: '東北', color: '白・黄',
    birthYears: '1966・1975・1984・1993・2002年生まれ',
    keywords: ['変革', '山', '相続', '継承', '蓄積'],
    fortune: { overall: '基盤を固める・見直す好機', money: '貯蓄・固定資産に向く日', love: '安定した絆を深める日', work: '組織の基盤整備・引き継ぎが吉', caution: '変化への抵抗は損になる' },
  },
  9: {
    name: '九紫火星', element: '火', direction: '南', color: '紫・赤',
    birthYears: '1965・1974・1983・1992・2001年生まれ',
    keywords: ['明晰', '礼節', '名誉', '火', '学問'],
    fortune: { overall: '才能と知性が輝く日', money: '名声・評判が収益に繋がる', love: '外見・センスが魅力を増す', work: '発表・公表・SNS発信が吉', caution: '見栄の張りすぎに注意' },
  },
};

/** 年盤の中宮星 (2024=四緑基準、逆行) */
function getYearlyStar(year: number): number {
  return ((4 - 1 - (year - 2024) % 9 + 900) % 9) + 1;
}

/** 日盤の中宮星 (2024-01-06=一白基準、逆行、JST日付基準) */
function getDailyStar(): number {
  const now = new Date();
  const jstStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }); // 'YYYY-MM-DD'
  const jstDate = new Date(jstStr);
  const ref = new Date('2024-01-06');
  const diff = Math.round((jstDate.getTime() - ref.getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

async function generateFortuneText(): Promise<string> {
  const client = new Anthropic();

  const today = new Date();
  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    timeZone: 'Asia/Tokyo',
  });

  const year = today.getFullYear();
  const yearlyStar = KYUSEI[getYearlyStar(year)];
  const dailyStar = KYUSEI[getDailyStar()];

  const context = `
【今日の日付】${dateStr}
【今日の日盤の星】${dailyStar.name}（${dailyStar.birthYears}）
【年間の流れ】${yearlyStar.name}（${yearlyStar.element}・${yearlyStar.direction}）
【今日のキーワード】${dailyStar.keywords.join('・')}
【今日の各運勢傾向】
  全体: ${dailyStar.fortune.overall}
  金運: ${dailyStar.fortune.money}
  恋愛: ${dailyStar.fortune.love}
  仕事: ${dailyStar.fortune.work}
  注意: ${dailyStar.fortune.caution}
【吉方位】${dailyStar.direction}
【ラッキーカラー】${dailyStar.color}
`;

  const prompt = `以下のデータをもとに、Threads投稿文を作ってください。

${context}

【絶対守ること】
- 全体480文字以内（超えると投稿できない）
- 冒頭：🔯 今日の運勢【${dateStr}】
- 2行目：今日の星：${dailyStar.name}（${dailyStar.birthYears}）※必ず入れる
- 「九星気学」「日盤」「五行」などの専門用語は使わない
- 「〜です」「〜ます」「〜してみてください」というですます調で丁寧で温かい口調（「〜ですよ」「〜ますよ」は使わない）
- 各運勢（全体・お金・恋愛・仕事）を絵文字つきで1行ずつ、短く
- 末尾の文章は本文の締めのみ。「詳細はnoteで」「#ハッシュタグ」は一切入れない
- ポジティブで、でも少し深みのある言葉を使う

本文のみ出力（前置き不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: '30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、親しみやすいおじさん占い師です。九星気学と易経を日常生活に役立てることを大切にしています。20〜50代の占い初心者の方に向けて、専門用語は使わず「〜です」「〜ます」「〜してみてください」というですます調で丁寧に語りかけます。「〜ですよ」「〜ますよ」のような語尾は使いません。怪しい・神秘的すぎる表現は避け、読者が明日からすぐ試せる具体的な言葉を心がけます。',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
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
  console.log(`=== 九星気学 Threads投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const dailyStar = getDailyStar();
  console.log(`本日の日盤中宮: ${KYUSEI[dailyStar].name}`);

  console.log('Claude API で運勢テキスト生成中...');
  const text = await generateFortuneText();
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

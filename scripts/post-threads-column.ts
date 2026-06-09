/**
 * Threads 夜間コラム自動投稿スクリプト
 *
 * 九星気学・易経・量子力学をテーマに、読んで楽しいコラム記事をThreadsに投稿する。
 * 毎晩19:00 JST に投稿。テーマは日付から自動ローテーション。
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

// テーマローテーション（14テーマ = 2週間サイクル）
const COLUMN_THEMES = [
  {
    title: '一白水星ってどんな星？',
    prompt: `一白水星（水の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
読んでいて「へ〜！」と思えるエピソードや豆知識も入れてください。`,
  },
  {
    title: '易経って何？3000年前の人生攻略本',
    prompt: `易経とは何か、占い初心者に向けて面白く解説してください。
中国で3000年以上前に生まれた背景、64卦の考え方、現代のビジネスや人生に使える点を紹介。
「古いのに今も使えるのはなぜか」という視点で書いてください。`,
  },
  {
    title: '二黒土星ってどんな星？',
    prompt: `二黒土星（大地の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「縁の下の力持ち」的な魅力を伝えてください。`,
  },
  {
    title: '吉方位参拝って本当に効くの？',
    prompt: `九星気学の「吉方位参拝」について、占い初心者に向けて面白く解説してください。
なぜ方位が重要なのか、実際にどう行動するのか、どんな変化が期待できるか。
自分が30歳で人生逆転したきっかけとして体験談を交えて書いてください。怪しさを感じさせない科学的な補足も入れてください。`,
  },
  {
    title: '三碧木星ってどんな星？',
    prompt: `三碧木星（雷の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「行動力と革新性」の魅力を伝えてください。`,
  },
  {
    title: '量子力学と運命は関係ある？',
    prompt: `量子力学の「観測問題」「重ね合わせ」「エンタングルメント」を、
九星気学や易経と結びつけて、占い好きな読者に面白く解説してください。
「見ることで現実が変わる」という考え方を軸に。難しい数式は一切使わず、日常の例えで説明してください。`,
  },
  {
    title: '四緑木星ってどんな星？',
    prompt: `四緑木星（風の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「縁・信用・旅」がキーワードの星の魅力を伝えてください。`,
  },
  {
    title: '年盤・月盤・日盤の違いって何？',
    prompt: `九星気学の「年盤・月盤・日盤」の概念を、占い初心者にわかりやすく解説してください。
それぞれが何を表すのか、どう組み合わせて読むのか、実生活への活かし方を具体的に。
「運気の波には3つの周期がある」という視点で書いてください。`,
  },
  {
    title: '五黄土星ってどんな星？',
    prompt: `五黄土星（帝王の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「最強だけど最も注意が必要」という二面性の魅力を伝えてください。`,
  },
  {
    title: '易経「乾為天」──天の力を借りる日',
    prompt: `易経の第1卦「乾為天（けんいてん）」について、占い初心者向けに面白く解説してください。
どんな意味を持つか、どんな時に出やすいか、実生活でどう活かすか。
「天の気が満ちる時にどう行動すべきか」をわかりやすく。`,
  },
  {
    title: '六白金星ってどんな星？',
    prompt: `六白金星（天の星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「決断力と権威」の魅力を伝えてください。`,
  },
  {
    title: '運気の流れは本当に9年周期？',
    prompt: `九星気学の「9年周期」の概念について、占い初心者に向けて面白く解説してください。
なぜ9年なのか、各年にはどんな意味があるのか、自分の今の年回りの確認方法。
「人生に波がある理由」を九星気学で読み解く視点で書いてください。`,
  },
  {
    title: '七赤金星ってどんな星？',
    prompt: `七赤金星（悦びの星）について、占い初心者向けに面白く解説してください。
特徴・性格・得意なこと・苦手なこと・有名人の例を含めて。
「金運・社交・楽しみ」の星の魅力を伝えてください。`,
  },
  {
    title: '八白土星ってどんな星？九紫火星ってどんな星？',
    prompt: `八白土星（山の星）と九紫火星（火の星）について、占い初心者向けに面白く解説してください。
それぞれの特徴・性格・有名人の例を含めて。
「変革と知性」という対照的なようで共通する魅力を伝えてください。`,
  },
];

function getThemeForToday(): typeof COLUMN_THEMES[number] {
  const now = new Date();
  const jstStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const jstDate = new Date(jstStr);
  const ref = new Date('2026-01-01');
  const dayDiff = Math.floor((jstDate.getTime() - ref.getTime()) / 86400000);
  return COLUMN_THEMES[((dayDiff % COLUMN_THEMES.length) + COLUMN_THEMES.length) % COLUMN_THEMES.length];
}

async function generateColumnText(): Promise<string> {
  const client = new Anthropic();
  const theme = getThemeForToday();

  const prompt = `以下のテーマで、Threads投稿文を書いてください。

テーマ: ${theme.title}
内容の方向性: ${theme.prompt}

【絶対守ること】
- 全体500文字以内（超えると投稿できない）
- 冒頭: 📖【${theme.title}】
- 「〜ですね」「〜ですよ」「〜かもしれません」という丁寧で温かい口調
- 読んで「へ〜！」「面白い！」と思えるエピソードや豆知識を1つ入れる
- スピリチュアル・宇宙的な怪しい表現は避ける
- 末尾: 「続きはnoteで📝 #九星気学 #易経 #占い」

本文のみ出力（前置き不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: '30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、親しみやすいおじさん占い師です。九星気学・易経・量子力学を日常生活に活かすことを大切にしています。20〜50代の占い初心者の方に向けて、専門用語は使わず「〜ですね」「〜ですよ」「〜してみてください」という丁寧で温かい口調で語りかけます。怪しい表現は避け、知的好奇心を刺激する読み物を書きます。',
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
  console.log('=== Threads 夜間コラム投稿開始 ===');
  if (!USER_ID || !ACCESS_TOKEN) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const theme = getThemeForToday();
  console.log(`今日のテーマ: ${theme.title}`);

  console.log('Claude API でコラムテキスト生成中...');
  const text = await generateColumnText();
  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

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

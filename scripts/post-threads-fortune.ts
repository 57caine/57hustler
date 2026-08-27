/**
 * Threads 九星気学 9星まとめ日次投稿スクリプト
 *
 * 今日の日盤中宮星を表示しつつ、全9星の今日の一言をまとめて1投稿する。
 * 各星の一言はClaude APIで動的生成（20文字以内・意味が完結する文）。
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const KYUSEI: Record<number, { name: string; short: string; emoji: string; element: string; keywords: string[] }> = {
  1: { name: '一白水星', short: '一白', emoji: '⚪', element: '水', keywords: ['知恵', '流れ', '柔軟', '人脈'] },
  2: { name: '二黒土星', short: '二黒', emoji: '🟤', element: '土', keywords: ['継続', '忍耐', '家庭', '蓄積'] },
  3: { name: '三碧木星', short: '三碧', emoji: '🟢', element: '木', keywords: ['行動', '発展', '革新'] },
  4: { name: '四緑木星', short: '四緑', emoji: '🟢', element: '木', keywords: ['信用', '縁', '商売'] },
  5: { name: '五黄土星', short: '五黄', emoji: '🟡', element: '土', keywords: ['帝王', '変革', '中心'] },
  6: { name: '六白金星', short: '六白', emoji: '⚪', element: '金', keywords: ['権威', '決断', '指導'] },
  7: { name: '七赤金星', short: '七赤', emoji: '🔴', element: '金', keywords: ['喜び', '金運', '交際'] },
  8: { name: '八白土星', short: '八白', emoji: '🟤', element: '土', keywords: ['変革', '蓄積', '基盤'] },
  9: { name: '九紫火星', short: '九紫', emoji: '🔴', element: '火', keywords: ['明晰', '名誉', '学問'] },
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

function getDailyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const diff = Math.round((new Date(jstStr).getTime() - new Date('2024-01-06').getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

function getYearlyStar(year: number): number {
  // 2024年＝三碧木星年が起点（複数の気学サイトで確認済み。旧実装は四緑木星年を起点にしており1年ずれていた）
  return ((3 - 1 - (year - 2024) % 9 + 900) % 9) + 1;
}

function getMonthlyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const year  = parseInt(jstStr.slice(0, 4));
  const month = parseInt(jstStr.slice(5, 7));
  // 寅月（2月）の月盤中宮: 年盤1,4,7→8 / 2,5,8→5 / 3,6,9→2
  const febStar = [8, 5, 2][(getYearlyStar(year) - 1) % 3];
  // 月オフセット（2月=0, 3月=1, …, 1月=11）
  const offset = month >= 2 ? month - 2 : month + 10;
  return ((febStar - 1 - offset + 900) % 9) + 1;
}

// 日盤で星kが入る宮のインデックス（1-9）
function getStarPositionIndex(k: number, dailyStar: number): number {
  return ((k - dailyStar + 13) % 9) + 1;
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
    system: '九星気学に詳しいおじさんです。月盤・日盤の回座宮を踏まえた具体的なアドバイスを生成します。象意の言い換えは禁止。',
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
各星の一言は20文字以内で、意味が必ず完結する文にすること。
途中で切れる文は絶対に生成しない。

【厳守】
- 象意の言い換えは絶対NG。「地盤を固める」「じっくり取り組む」などは禁止
- 行動・場面・注意点で具体的に
  良い例：「午後に動くと吉」「メモを惜しまず取っておくと後で役立つ」「頼む前に一度整理しておく」
- 体言止め・動詞終わりのどちらでもよい。ですます調不要
- 20文字を超えそうな内容は、要素を削って短くまとめる（尻切れにしない）

以下のJSONのみ出力（前置き不要）：
{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":""}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Record<string, string>;
  return Object.fromEntries(Object.entries(json).map(([k, v]) => [Number(k), String(v).slice(0, 20)]));
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
    '🌙 #九星気学 #今日の運勢 #夜中のおじさん',
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
  const monthlyStarNum = getMonthlyStar();
  console.log(`本日の日盤中宮: ${KYUSEI[dailyStarNum].name} / 月盤中宮: ${KYUSEI[monthlyStarNum].name}`);

  console.log('Claude API で各星の一言を生成中...');
  const oneLiners = await generateOneLiners(dailyStarNum, monthlyStarNum);
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
  const creationId = await createThreadsContainer(text, '九星気学');
  console.log(`コンテナID: ${creationId}（topic_tag: 九星気学）`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });

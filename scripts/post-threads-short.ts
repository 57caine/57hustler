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

// ─── 一文考察・問いかけ生成（火・木・土・日）────────────────
async function generateShortPost(isSunday: boolean): Promise<string> {
  const client = new Anthropic();

  const [system, userPrompt] = isSunday
    ? [
        'あなたは「夜中のおじさん」です。Threadsに問いかけ投稿をします。',
        `九星気学・妖怪・神話・結界・量子論・宗教などのテーマに関連した「問いかけ」を1本書いてください。

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
    : [
        'あなたは「夜中のおじさん」です。Threadsに一文考察を投稿します。',
        `日本の伝統・儀式・文化・妖怪・神話・宗教と、量子力学・現代科学・宇宙論・心理学を掛け合わせた「一文考察」を1本書いてください。

【ルール】
- 一文〜三文以内。短いほど良い
- 断言せず「とも言われている」「のかもしれない」で余韻を残す
- 難しい専門用語は使わない
- 読んだ人が「え、そうなの？」と思う切り口を選ぶ
- ハッシュタグなし
- 500文字以内厳守

【参考トーン】
「大祓詞の音韻は、量子もつれと同じ原理で現実を書き換えるとも言われている。」
「易経の64卦は、DNAの64コドンと同じ数だ。偶然だと言い切れる人は、まだ少ない。」

【サンプル（粒度・トーンの基準）】
＜結界・しきたり系＞
「玄関に傘立てを置くのは、外の「気」を家に持ち込まないための境界装置だという説がある。」
「鏡を布で覆う風習は、鏡が「異界への入口」になるのを防ぐためだとも言われている。」
「引っ越し後に盛り塩をするのは、前の住人の「気」をリセットする儀式だという説がある。」
「箸を立てて供えるのは、死者の世界への橋を作るためだとも言われている。」
「家の中心（大黒柱）に神が宿るという発想は、世界中の建築文化に共通している。」
「夜に爪を切ってはいけないという禁忌は、暗闇で刃物を扱う危険への警告が起源という説がある。」
「新年に初詣に行くのは、年神様を迎えに行く「出迎え」の儀式だという説がある。」
「財布を寝かせると金が増えるという発想は、種を土に埋める農耕文化の記憶かもしれない。」

＜妖怪・神々系＞
「狐が稲荷神の使いとされるのは、狐が害獣（ネズミ）を食べて農作物を守るからという説がある。」
「鬼の金棒は、疫病を祓う祭具が武器に変化したものだという説がある。」
「天狗の長い鼻は、山伏の装束に使う「高下駄」が誇張されて描かれたものだという説がある。」
「妖怪「ぬりかべ」は、夜道で方向感覚を失う霧や闇の現象を擬人化したものかもしれない。」
「日本の龍は水を司り、中国の龍は天を司る。同じ龍でも、土地によって役割が変わる。」
「八百万の神という発想は、自然現象すべてに意識があるというアニミズムと完全に一致する。」
「河童の「皿」は、水辺に近づくなという警告が、妖怪の特徴として定着したものかもしれない。」
「座敷童子が去ると家が滅びるという伝承は、子供の笑い声が絶えた家の衰退を表しているのかもしれない。」

＜古代ミステリー系＞
「シュメールの粘土板に記された医学知識の一部は、現代の解剖学と一致しているという指摘がある。」
「ピラミッドの内部温度は、外気温に関わらず常に20度前後に保たれているという計測報告がある。」
「古代マヤの球技場の設計は、音の反響を計算して作られているという説がある。」
「ナスカの地上絵は、上空からしか見えない。それを誰のために描いたのかは、まだわかっていない。」
「古代エジプトの「カー」（魂）という概念は、量子力学の「情報は消えない」という原理と似ている。」
「世界中の洪水神話に「生き残った一人の人間」が登場する。記憶の共通性が、偶然とは言い切れない。」
「出雲大社の古代の高さは48メートルだったという説がある。当時の建築技術では、不可能に近い高さだ。」
「ストーンヘンジの石は、80キロ離れた採石場から運ばれている。当時の技術でどう運んだかは未解明だ。」

＜量子・宇宙論系＞
「宇宙の大規模構造（銀河フィラメント）の形は、人間の神経ネットワークの形と酷似している。」
「量子力学では、粒子は観測されるまで「すべての場所に同時に存在する」とされている。」
「宇宙の95%は、正体不明の暗黒物質と暗黒エネルギーで構成されているとされている。」
「光の速度は宇宙のどこで測っても同じだ。なぜそうなのかは、まだ完全には説明されていない。」
「人間の体を構成する原子の大部分は、かつて星の内部で作られたものだという説がある。」
「時間は過去から未来へ一方向に流れるように見えるが、物理法則の多くは時間の向きを区別しない。」

＜宗教共通項系＞
「イスラム教の礼拝方向（メッカ）と、神道の吉方位参拝は、同じ「方角に意味を見出す」発想から来ている。」
「キリスト教の「アーメン」、仏教の「オーム」、神道の「アワ」。語尾の音韻が世界の祈りに共通する。」
「断食という行為は、キリスト教・イスラム教・仏教・神道、すべての宗教に存在する。」
「「天国」「極楽」「黄泉」。死後の世界の描写は文化によって違うが、「別の場所がある」という発想は共通だ。」
「世界中の宗教に「沈黙の修行」がある。言葉を止めることで、何かが見えてくるという発想だ。」
「「今ここにいる」という発想は、禅・マインドフルネス・ストア哲学、すべてに共通する核心だ。」
「巡礼という行為は、イスラム教のハッジ、キリスト教のサンティアゴ、仏教の四国遍路、世界中にある。」
「「徳を積む」という発想は、儒教・仏教・キリスト教・イスラム教、すべての宗教に形を変えて存在する。」

＜科学・化学系＞
「人間の腸内細菌の数は、体の細胞数とほぼ同じだ。私たちは半分、別の生き物でできているのかもしれない。」

投稿文のみ出力（説明・前置き不要）。`,
      ];

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
    console.log(`Claude API で${isSunday ? '問いかけ' : '一文考察'}を生成中...`);
    text = await generateShortPost(isSunday);
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

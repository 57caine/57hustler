/**
 * note記事 週次自動生成スクリプト（九星気学×易経 占いマガジン版）
 *
 * Threads(@westin_lab)の日次投稿と連動した週間鑑定記事を生成。
 * 有料マガジン・個別相談への出口戦略を記事内に組み込む。
 * 出力: note-drafts/YYYY-MM-DD.md
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// 九星データベース
const KYUSEI: Record<number, { name: string; element: string; direction: string; color: string; theme: string; birthYears: string }> = {
  1: { name: '一白水星', element: '水', direction: '北', color: '白・黒', theme: '知恵・流れ・人脈', birthYears: '1973・1982・1991・2000・2009年生まれ' },
  2: { name: '二黒土星', element: '土', direction: '南西', color: '黄・茶', theme: '継続・家庭・忍耐', birthYears: '1972・1981・1990・1999・2008年生まれ' },
  3: { name: '三碧木星', element: '木', direction: '東', color: '碧・緑', theme: '行動・革新・若さ', birthYears: '1971・1980・1989・1998・2007年生まれ' },
  4: { name: '四緑木星', element: '木', direction: '東南', color: '緑', theme: '信用・縁・旅', birthYears: '1970・1979・1988・1997・2006年生まれ' },
  5: { name: '五黄土星', element: '土', direction: '中央', color: '黄', theme: '変革・破壊と創造・帝王', birthYears: '1969・1978・1987・1996・2005年生まれ' },
  6: { name: '六白金星', element: '金', direction: '北西', color: '白・金', theme: '権威・決断・正義', birthYears: '1968・1977・1986・1995・2004年生まれ' },
  7: { name: '七赤金星', element: '金', direction: '西', color: '赤・白', theme: '喜び・金運・交際', birthYears: '1967・1976・1985・1994・2003年生まれ' },
  8: { name: '八白土星', element: '土', direction: '東北', color: '白・黄', theme: '変革・蓄積・継承', birthYears: '1966・1975・1984・1993・2002年生まれ' },
  9: { name: '九紫火星', element: '火', direction: '南', color: '紫・赤', theme: '明晰・名誉・学問', birthYears: '1965・1974・1983・1992・2001年生まれ' },
};

// 易経 主要64卦（週番号から選択）
const ICHING_HEXAGRAMS: Array<{ number: number; name: string; kanji: string; meaning: string; guidance: string }> = [
  { number: 1, name: '乾為天', kanji: '乾', meaning: '創造・天・積極性', guidance: '天の力が満ちる。創造的な行動を起こす好機。自信を持って前進せよ。' },
  { number: 2, name: '坤為地', kanji: '坤', meaning: '受容・大地・母性', guidance: '大地のように受け入れ、育てる時。焦らず着実に歩を進めよ。' },
  { number: 3, name: '水雷屯', kanji: '屯', meaning: '初期の困難・萌芽', guidance: '始まりの困難は成長の種。急がず、助けを借りて進め。' },
  { number: 11, name: '地天泰', kanji: '泰', meaning: '繁栄・調和・交流', guidance: '天地の気が交わり繁栄する。人との交流を大切にせよ。' },
  { number: 14, name: '火天大有', kanji: '大有', meaning: '大いなる所有・豊かさ', guidance: '大きな恵みが訪れる時。謙虚さを忘れなければ幸運続く。' },
  { number: 17, name: '澤雷随', kanji: '随', meaning: '追随・柔軟性・順応', guidance: '流れに従うことで道が開ける。固執を手放せ。' },
  { number: 24, name: '地雷復', kanji: '復', meaning: '回帰・再生・転換点', guidance: '陽気が戻り始める。新しいサイクルの始まり。原点に返れ。' },
  { number: 30, name: '離為火', kanji: '離', meaning: '明晰・輝き・付着', guidance: '知性と明晰さが輝く時。美しいものに寄り添い、光を放て。' },
  { number: 31, name: '澤山咸', kanji: '咸', meaning: '感応・縁・引き合い', guidance: '心が動く縁の時。素直に感じ、動け。人との絆が運を開く。' },
  { number: 40, name: '雷水解', kanji: '解', meaning: '解放・解消・前進', guidance: 'しがらみや悩みが解放される時。過去を手放し軽やかに進め。' },
  { number: 48, name: '水風井', kanji: '井', meaning: '井戸・供給・尽きない源', guidance: '深い知恵と資源がある。与え続けることで運が巡る。' },
  { number: 58, name: '兌為澤', kanji: '兌', meaning: '喜び・悦び・語らい', guidance: '喜びが満ちる。人と語らい、楽しみを分かち合え。' },
  { number: 63, name: '水火既済', kanji: '既済', meaning: '完成・達成・安定', guidance: '一段落を迎える時。成果を確認し、次への準備を怠るな。' },
  { number: 64, name: '火水未済', kanji: '未済', meaning: '未完成・可能性・移行期', guidance: '完成直前の時。あと一歩を慎重に。可能性は無限大だ。' },
];

// 豆知識ストック（事実確認済み・週次ローテーション）
const TRIVIA_POOL = [
  {
    category: '易経×物理学',
    fact: 'ノーベル物理学賞受賞者のニールス・ボーアは1947年、デンマーク最高位の勲章を受章した際に自ら家紋を設計しました。その中央に選んだのが**陰陽図（太極図）**。量子力学の「相補性原理」（光は波でもあり粒子でもある）が易経の陰陽思想と同じ構造だと確信していたためです。',
  },
  {
    category: '洛書とマジックスクエア',
    fact: '九星気学の原型「洛書（らくしょ）」は、縦・横・斜めどの列も合計が**15**になる3×3の魔方陣です。約4000年前、夏王朝の禹王が黄河の支流・洛水に現れた亀の甲羅から発見したとされます。この同じ魔方陣は古代インド・イスラム世界でも独立して発見され、人類が普遍的に惹かれる数の神秘といえます。',
  },
  {
    category: '易経×心理学',
    fact: '心理学者カール・ユングは1949年、易経の英訳版（リヒャルト・ヴィルヘルム訳）に序文を寄稿。「偶然の一致には意味がある」という**共時性（シンクロニシティ）**の概念を易経から着想したと語っています。「筮竹を投げて出た卦は、その瞬間の宇宙の状態を映している」という考え方が、ユングの無意識論と共鳴したのです。',
  },
  {
    category: '易経×2進数',
    fact: '易経の64卦は陰（−−）と陽（—）の組み合わせで構成されます。これを0と1に置き換えると、**2進数の0〜63**と完全に一致します。2進数の父と呼ばれるライプニッツ（17世紀）は易経の卦を見て「自分の発明と同じ原理だ！」と驚き、中国の宣教師に手紙を送った記録が残っています。',
  },
  {
    category: '九星と世界の数秘術',
    fact: '九星気学の「9」という数字は特別です。1〜9の全ての数字を足すと45（4+5=9）。どんな数字でも各桁の和を繰り返し求めると最終的に1〜9のどれかになります（数秘術の「数字の根」）。古代ギリシャのピタゴラス、ユダヤのカバラ、インドの占星術でも9は「完成・終わりと始まり」を象徴する特別な数とされています。',
  },
  {
    category: '吉方位と行動科学',
    fact: '「特定の方角に出かけると運気が変わる」という吉方位参拝。現代の行動科学的に見ると、**意図を持った行動が自己効力感（やればできる感）を高め**、実際の行動量・出会いの数が増えることで現実が変化すると説明できます。プラシーボ効果の研究でも「信じて行動すること」が測定可能な変化をもたらすことが示されています。',
  },
  {
    category: '易経の成立',
    fact: '易経は3段階で完成したとされます。①伏羲（ふくぎ）が8つの三爻卦（8卦）を作る（紀元前3000年頃）→②周の文王が64卦に拡張・卦辞を書く（紀元前1000年頃）→③孔子が十翼（解説書）を著す（紀元前500年頃）。約2500年かけて完成した「最長プロジェクト」ともいえます。',
  },
  {
    category: '五行と現代医学',
    fact: '五行（木・火・土・金・水）は単なる自然現象の分類ではなく、中医学では**臓器・感情・季節・色**が全て対応しています。例えば「木＝肝臓＝怒り＝春＝緑」。現代の統合医療でも、感情と臓器の関係（ストレスと肝機能など）は科学的に研究されており、五行の枠組みは意外と侮れません。',
  },
];

/** 今週の易経の卦（週番号から選択） */
function getWeeklyHexagram(): typeof ICHING_HEXAGRAMS[number] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return ICHING_HEXAGRAMS[weekNum % ICHING_HEXAGRAMS.length];
}

/** 今週の豆知識（週番号から選択・六角形とは別にローテーション） */
function getWeeklyTrivia(): typeof TRIVIA_POOL[number] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return TRIVIA_POOL[(weekNum + 3) % TRIVIA_POOL.length];
}

/** 年盤の中宮星（2024=四緑基準、逆行） */
function getYearlyStar(year: number): number {
  return ((4 - 1 - (year - 2024) % 9 + 900) % 9) + 1;
}

/** 月盤の中宮星 */
function getMonthlyStar(yearStar: number, month: number): number {
  const TABLE: number[][] = [
    [8,7,6,5,4,3,2,1,9,8,7,6],
    [5,4,3,2,1,9,8,7,6,5,4,3],
    [2,1,9,8,7,6,5,4,3,2,1,9],
    [8,7,6,5,4,3,2,1,9,8,7,6],
    [5,4,3,2,1,9,8,7,6,5,4,3],
    [2,1,9,8,7,6,5,4,3,2,1,9],
    [8,7,6,5,4,3,2,1,9,8,7,6],
    [5,4,3,2,1,9,8,7,6,5,4,3],
    [2,1,9,8,7,6,5,4,3,2,1,9],
  ];
  const monthIdx = (month - 2 + 12) % 12;
  return TABLE[yearStar - 1][monthIdx];
}

async function generateArticle(): Promise<string> {
  const client = new Anthropic();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const yearlyStarNum = getYearlyStar(year);
  const monthlyStarNum = getMonthlyStar(yearlyStarNum, month);
  const yearlyStar = KYUSEI[yearlyStarNum];
  const monthlyStar = KYUSEI[monthlyStarNum];
  const hexagram = getWeeklyHexagram();
  const trivia = getWeeklyTrivia();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekRange = `${weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}〜${weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}`;

  const allStarsText = Object.entries(KYUSEI)
    .map(([, s]) => `${s.name}（${s.element}行・${s.direction}）テーマ：${s.theme} ／ ${s.birthYears}`)
    .join('\n');

  const prompt = `30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した、ちょっと不思議なおじさん占い師として、noteの週間鑑定記事を書いてください。

【正確な鑑定データ（必ずこのデータを使うこと。独自に年号・星を変えないこと）】
現在の年: ${year}年
現在の月: ${month}月
記事対象期間: ${weekRange}
${year}年の年盤: ${yearlyStar.name}（${yearlyStar.element}行・方位：${yearlyStar.direction}・テーマ：${yearlyStar.theme}）
${year}年${month}月の月盤: ${monthlyStar.name}（${monthlyStar.element}行・方位：${monthlyStar.direction}・テーマ：${monthlyStar.theme}）
今週の易経: 第${hexagram.number}卦「${hexagram.name}」（${hexagram.meaning}）
易経の指針: ${hexagram.guidance}

【九星データ（生年・テーマは変更不可）】
${allStarsText}

【今週の豆知識素材（このトリビアを記事に自然に組み込むこと）】
カテゴリ: ${trivia.category}
内容: ${trivia.fact}

【記事の要件】
文字数: 3500〜4500字（読みやすさ優先。冗長にならず、各セクションをコンパクトに）
対象読者: 占いが好きな20〜50代の方。九星気学や易経を知らない初心者。読んで「へ〜！」と感じてほしい。

【構成（この順番で書くこと）】

1. タイトル
   - 形式：「【${year}年${month}月第◯週】〈キャッチコピー〉〜サブタイトル〜」
   - キャッチコピーの例：「動く人に運が来る」「今週は"待つ"が正解」「直感を信じていい週」
   - 読者が「これ私のこと！」「気になる…」と思えるような一言を選ぶ
   - 今週の星・易経のメッセージを凝縮すること

2. 今週の流れ（300字程度）
   - ${year}年の年盤「${yearlyStar.name}」と${month}月の月盤「${monthlyStar.name}」の組み合わせで今週をわかりやすく解説
   - ※年号は必ず「${year}年」と書くこと。他の年号は絶対に書かない
   - 今週の行動ヒントを1つ

3. 九星別 今週の運勢（全9星、各100〜120字）
   - 「▷ ${KYUSEI[1].name}（${KYUSEI[1].birthYears}）」形式でヘッダー
   - 仕事・恋愛・金運を1〜2行ずつ絵文字つきで
   - 締めに「今週の一言」を添える

4. 今週の豆知識コーナー（400字程度）
   - 第${hexagram.number}卦「${hexagram.name}」の今週への活かし方（150字）
   - 以下のトリビアを自然に組み込む（そのまま使ってよい）:
     「${trivia.fact}」
   - 「実は〜」「意外にも〜」の書き出しで引きを作る

5. 今週の行動アドバイス（3項目、各80字程度）
   - 「〜してみてください」口調
   - 九星気学・易経の根拠を一言添える

6. CV・Threads連携（自然な流れで、3か所に分散させること）
   【CV①：九星別運勢の後】
   「自分の本命星がわからない方は、生年月日から無料で確認できます。詳しくは有料マガジンの「星早見表」をどうぞ📖」
   【CV②：豆知識の後】
   「吉方位の具体的な日程・方位は有料マガジン『westin_labの九星気学鑑定』で毎週公開中。月500円で読み放題💫」
   【CV③：記事末尾】
   「毎朝7時の運勢はThreads @westin_lab で無料配信中🌟 フォローして今日から使える九星気学をどうぞ。より深く知りたい方は有料マガジンへ。」

【文章ルール】
- 年号は必ず「${year}年」。2025年・2024年などと書かない（厳守）
- 専門用語は必ず補足（例：月盤＝その月の気のエネルギー）
- 口調: 「〜ですね」「〜ですよ」「〜してみてください」。丁寧で温かく
- スピリチュアル・神秘的すぎる表現は避ける
- 形式: マークダウン（## 見出し、**太字**、絵文字を適度に）

記事本文のみ出力（前置き不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: '30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、親しみやすいおじさん占い師です。九星気学と易経を日常生活に活かすことを大切にしています。20〜50代の占い初心者の方に向けて、専門用語は使わず「〜ですね」「〜ですよ」「〜してみてください」という丁寧で温かい口調で語りかけます。怪しい表現や神秘的すぎる言葉は避け、読者が実際に行動できる具体的なアドバイスを心がけます。Threads(@westin_lab)との連動を意識した一貫した世界観を維持します。',
    messages: [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as { type: string; text: string }).text;
}

async function main() {
  console.log('=== note 九星気学×易経 記事生成開始 ===');

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const yearlyStarNum = getYearlyStar(year);
  const monthlyStarNum = getMonthlyStar(yearlyStarNum, month);
  console.log(`年盤: ${KYUSEI[yearlyStarNum].name} / 月盤: ${KYUSEI[monthlyStarNum].name}`);

  const hexagram = getWeeklyHexagram();
  console.log(`今週の易経: 第${hexagram.number}卦「${hexagram.name}」`);

  console.log('Claude API で記事生成中...');
  const article = await generateArticle();

  const date = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'note-drafts');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${date}.md`);
  const header = `---
生成日: ${date}
ジャンル: 九星気学×易経 週間鑑定
年盤: ${KYUSEI[getYearlyStar(new Date().getFullYear())].name}
月盤: ${KYUSEI[getMonthlyStar(getYearlyStar(new Date().getFullYear()), new Date().getMonth() + 1)].name}
今週の易経: ${hexagram.name}
ステータス: 下書き（未公開）
公開手順: note.comにコピーして公開。有料マガジンのURL設定を確認すること。
---

`;
  fs.writeFileSync(outputPath, header + article, 'utf-8');

  console.log(`\n✓ 記事を保存しました: ${outputPath}`);
  console.log('次のステップ:');
  console.log('  1. note.com で有料マガジン「westin_labの九星気学鑑定」を作成');
  console.log('  2. 記事をコピーしてマガジンに追加・有料設定（¥200〜500/記事 or マガジン月額¥500）');
  console.log('  3. 個別相談受付はnoteコメント or DM で受付開始を告知');
}

main().catch(e => { console.error(e); process.exit(1); });

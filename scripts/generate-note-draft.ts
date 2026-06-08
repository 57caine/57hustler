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

/** 今週の易経の卦（週番号から選択） */
function getWeeklyHexagram(): typeof ICHING_HEXAGRAMS[number] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return ICHING_HEXAGRAMS[weekNum % ICHING_HEXAGRAMS.length];
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

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekRange = `${weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}〜${weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}`;

  // 九星データを全て渡す
  const allStarsText = Object.entries(KYUSEI)
    .map(([num, s]) => `${s.name}（${s.element}・${s.direction}）テーマ：${s.theme} ／ ${s.birthYears}`)
    .join('\n');

  const prompt = `30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した、ちょっと不思議なおじさん占い師として、noteの週間鑑定記事を書いてください。

【今週の鑑定データ】
期間: ${weekRange}
年のエネルギー: ${yearlyStar.name}（${yearlyStar.element}・テーマ：${yearlyStar.theme}）
今月のエネルギー: ${monthlyStar.name}（${monthlyStar.element}・テーマ：${monthlyStar.theme}）
今週の易経: 第${hexagram.number}卦「${hexagram.name}」（${hexagram.meaning}）
易経の指針: ${hexagram.guidance}

【九星一覧（今週の各星の運勢ベースに使用）】
${allStarsText}

【記事の要件】
文字数: 2500〜3500字
対象読者: 占いが好きな20〜50代の女性。九星気学や易経を知らない初心者。
構成:
1. タイトル: 「今週の運勢まとめ〜${weekRange}〜✨」形式で、読者が思わず開きたくなる一言を添える
2. 今週のエネルギー解説（今週はどんな週か、難しい言葉なしに300字で解説。宇宙や自然のリズムというニュアンスを少し入れる）
3. 九星別 今週の運勢（全9星、各150字程度。恋愛・仕事・金運の3軸で。「〇〇星（XX・XX年生まれの方）は〜ですね」のように生年を必ず入れて、読者が自分の星を探しながら読めるように）
4. 易経コーナー:「今週、宇宙はこう言っています」という切り口で第${hexagram.number}卦「${hexagram.name}」を身近な言葉で解説（400字）
5. 今週の開運アクション（3項目、「〜してみてください」という口調で。理由も一言添える）
6. Threads連携：「毎日の運勢は @westin_lab（Threads）で毎朝7時に無料でお届けしています。ぜひフォローしてみてください🌟」
7. 締めのCTA（以下を自然に組み込む）:
   【有料マガジン誘導】「より深く知りたい方は、有料マガジン『westin_labの九星気学鑑定』へどうぞ。吉方位・月間カレンダーも毎週更新しています。月500円で読み放題です💫」

口調: 「〜ですね」「〜ですよ」「〜かもしれません」「〜してみてください」。丁寧だけど距離が近い温かさ。
専門用語が出てきたときは必ずやさしい言葉で補足する。
量子力学的なニュアンス（観測・波・エネルギー・共鳴など）を自然に少し織り交ぜると深みが出ます。
形式: マークダウン（## 見出し、**太字**、絵文字を適度に使用）

記事本文のみ出力（前置き不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 5000,
    system: '30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、ちょっと不思議なおじさん占い師です。量子力学と九星気学・易経を結びつけて世界の仕組みを理解しようとしています。20〜50代の占い初心者の方に向けて、専門用語は使わず「〜ですね」「〜ですよ」「〜してみてください」という丁寧で温かい口調で語りかけます。押しつけがましくなく、でも少しだけ深みと宇宙観のある言葉を大切にします。Threads(@westin_lab)との連動を意識した一貫した世界観を維持します。',
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

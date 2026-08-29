/**
 * 九星気学「動く盤」共通ロジック（日盤・月盤・年盤の中宮星、回座宮、易経の八卦対応）。
 *
 * scripts/post-threads-*.ts の複数スクリプトから共通で参照する。
 * 年盤中宮星の起点は2024年＝三碧木星（base=3）。複数の気学サイトで確認済みの値で、
 * 旧実装（base=4）は1年ずれていたため、この値を変更する場合は必ず出典を確認すること。
 */

export const KYUSEI: Record<number, { name: string; short: string; emoji: string; element: string; keywords: string[] }> = {
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

export const POSITION_MEANINGS: Record<number, { name: string; direction: string; meaning: string }> = {
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

// 対冲（正反対）の宮インデックス。暗剣殺（五黄殺の反対方位）の算出に使う
export const OPPOSITE_POSITION: Record<number, number> = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 };

/** 今日（JST）の日盤中宮星 */
export function getDailyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const diff = Math.round((new Date(jstStr).getTime() - new Date('2024-01-06').getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

/** 年盤中宮星（2024年＝三碧木星が起点） */
export function getYearlyStar(year: number): number {
  // 2024年＝三碧木星年が起点（複数の気学サイトで確認済み。旧実装は四緑木星年を起点にしており1年ずれていた）
  return ((3 - 1 - (year - 2024) % 9 + 900) % 9) + 1;
}

/** 年盤星と月から月盤中宮星を求める純粋関数 */
export function monthlyStarFromYearly(yearlyStarNum: number, month: number): number {
  // 寅月（2月）の月盤中宮: 年盤1,4,7→8 / 2,5,8→5 / 3,6,9→2
  const febStar = [8, 5, 2][(yearlyStarNum - 1) % 3];
  // 月オフセット（2月=0, 3月=1, …, 1月=11）
  const offset = month >= 2 ? month - 2 : month + 10;
  return ((febStar - 1 - offset + 900) % 9) + 1;
}

/** 今日（JST）の月盤中宮星 */
export function getMonthlyStarForToday(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const year  = parseInt(jstStr.slice(0, 4));
  const month = parseInt(jstStr.slice(5, 7));
  return monthlyStarFromYearly(getYearlyStar(year), month);
}

/** 中宮星が centerStar のとき、星kが入る宮のインデックス（1-9） */
export function getStarPositionIndex(k: number, centerStar: number): number {
  return ((k - centerStar + 13) % 9) + 1;
}

/** JST基準の曜日（0=日 ... 6=土） */
export function getJstDayOfWeek(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  return new Date(jstStr + 'T12:00:00Z').getDay();
}

/** JST基準の日付スラグ（YYYY-MM-DD） */
export function getJstDateSlug(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

// ─── 易経：日盤中宮星 → 八卦 → 卦マッピング ──────────────
export const STAR_TO_TRIGRAM: Record<number, string> = {
  1: '坎（水）', 2: '坤（地）', 3: '震（雷）', 4: '巽（風）',
  5: '坤（地）', 6: '乾（天）', 7: '兌（沢）', 8: '艮（山）', 9: '離（火）',
};

// 各八卦の代表的な卦（番号・名・易経原文キーワード）
export const TRIGRAM_HEXAGRAMS: Record<string, { num: number; name: string; keyword: string }[]> = {
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

/** 日盤中宮星と日付から、日付依存（ランダムではない）で今日の卦を1つ選ぶ */
export function selectHexagram(dailyStar: number, dateStr: string): { num: number; name: string; keyword: string; trigram: string } {
  const trigram = STAR_TO_TRIGRAM[dailyStar];
  const hexagrams = TRIGRAM_HEXAGRAMS[trigram];
  const dayNum = parseInt(dateStr.slice(8, 10));
  const hex = hexagrams[dayNum % hexagrams.length];
  return { ...hex, trigram };
}

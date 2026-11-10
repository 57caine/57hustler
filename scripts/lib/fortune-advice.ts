// Shared generation guidance and rejection feedback. No API calls or history writes.
export const CONCRETE_ADVICE_EXAMPLES = [
  '気になる人へ短く声をかける', '返事を急がずひと呼吸置く',
  '頼まれごとを一つ断る', '使った場所をそっと整える',
];
export const FORBIDDEN_ADVICE = [
  '地盤を固める', 'じっくり取り組む', '風のように', '火の輝き',
  '金運が交わる', '天の助けで', '変化の核心', '運気が高まる', '幸運が訪れる',
];
const VAGUE_FORTUNE_PATTERNS = [
  /(?:中央|北西|南西|北東|南東|東南|南|北|東|西)で(?:変化|権威|運気|評価|信用|縁|輝き)/,
  /(?:風のように|火の輝き|金運が交わる|天の助けで)/,
  /(?:変化の核心|運気が高まる|幸運が訪れる)/,
];

export function invalidAdviceStars(lines: Record<number, string>): string[] {
  return Object.entries(lines)
    .filter(([, value]) => VAGUE_FORTUNE_PATTERNS.some(pattern => pattern.test(value)))
    .map(([star]) => star);
}

export function buildAdviceGuidance(): string {
  return '読み手の暮らしが浮かぶ一言にする。仕事の確認作業だけに偏らず、人との距離・休息・家の中の小さな行動も、回座宮に合う場合に取り入れる。9星を同じ助言の言い換えで埋めない。責める口調・不安を煽る予言・購入や幸運の保証は避ける。例文の固定コピーをせず今日の回座宮から書く。\n' +
    `具体例：${CONCRETE_ADVICE_EXAMPLES.map(value => `「${value}」`).join('、')}\n` +
    `禁止表現：${FORBIDDEN_ADVICE.join('、')}。方位・宮名を本文に書かない。`;
}

export function buildRetryFeedback(lengthStars: number[], adviceStars: string[], allNine: boolean, previous: Record<number, string> = {}): string {
  return [
    '前回の出力は不合格です。次の理由を修正して全9星のJSONを再生成してください。',
    ...(!allNine ? ['キーは1〜9を過不足なく1回ずつ出力する。'] : []),
    ...(lengthStars.length ? [`文字数・欠落NG星：${lengthStars.join(',')}。空欄を避け、10〜14文字を目標に、18文字以内の完結した文にする。理由や効果を削り、行動一つだけに書き直す。`] : []),
    ...lengthStars.map(star => {
      const value = previous[star];
      return typeof value === 'string'
        ? `星${star}の前回値（${value.length}文字）：${JSON.stringify(value)}。途中で切らず短文へ書き直す。`
        : `星${star}は文字列が欠落。完結した短文を補う。`;
    }),
    ...(adviceStars.length ? [`抽象表現NG星：${adviceStars.join(',')}。象意・運気の説明をやめ、職場・家庭などの具体的な行動に書き換える。`] : []),
  ].join('\n');
}

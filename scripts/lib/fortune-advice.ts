// Shared generation guidance and rejection feedback. No API calls or history writes.
export const CONCRETE_ADVICE_EXAMPLES = [
  '会議の前に資料を見直す', '返信する前に宛先を確認',
  '予定を一つ減らして休む', '買い物前に残高を確認',
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
  return `具体例：${CONCRETE_ADVICE_EXAMPLES.map(value => `「${value}」`).join('、')}\n` +
    `禁止表現：${FORBIDDEN_ADVICE.join('、')}。方位・宮名を本文に書かない。`;
}

export function buildRetryFeedback(lengthStars: number[], adviceStars: string[], allNine: boolean): string {
  return [
    '前回の出力は不合格です。次の理由を修正して全9星のJSONを再生成してください。',
    ...(!allNine ? ['キーは1〜9を過不足なく1回ずつ出力する。'] : []),
    ...(lengthStars.length ? [`文字数・欠落NG星：${lengthStars.join(',')}。空欄を避け、18文字以内の完結した文にする。`] : []),
    ...(adviceStars.length ? [`抽象表現NG星：${adviceStars.join(',')}。象意・運気の説明をやめ、職場・家庭などの具体的な行動に書き換える。`] : []),
  ].join('\n');
}

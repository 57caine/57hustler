// 九星気学の算出ロジック

export const STAR_NAMES = [
  '',
  '一白水星',
  '二黒土星',
  '三碧木星',
  '四緑木星',
  '五黄土星',
  '六白金星',
  '七赤金星',
  '八白土星',
  '九紫火星',
] as const;

export type StarNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type StarName = typeof STAR_NAMES[StarNumber];

export const STAR_INFO: Record<StarNumber, { element: string; direction: string; nature: string }> = {
  1: { element: '水', direction: '北', nature: '流れ・知恵・柔軟性' },
  2: { element: '土', direction: '南西', nature: '勤勉・慈愛・堅実' },
  3: { element: '木', direction: '東', nature: '行動力・情熱・革新' },
  4: { element: '木', direction: '東南', nature: '調和・繊細・縁' },
  5: { element: '土', direction: '中央', nature: '中心・強さ・変化' },
  6: { element: '金', direction: '北西', nature: '誠実・完璧主義・高潔' },
  7: { element: '金', direction: '西', nature: '喜び・美・社交' },
  8: { element: '土', direction: '北東', nature: '蓄積・変革・粘り' },
  9: { element: '火', direction: '南', nature: '直感・明晰・美意識' },
};

// 十二支 — year % 12 でのインデックス
// 2024 % 12 = 8 → 辰(龍)、2016 % 12 = 0 → 申(猿) を基準に設定
const JUNISHI = [
  { kanji: '申', reading: '申（さる）' },
  { kanji: '酉', reading: '酉（とり）' },
  { kanji: '戌', reading: '戌（いぬ）' },
  { kanji: '亥', reading: '亥（いのしし）' },
  { kanji: '子', reading: '子（ね）' },
  { kanji: '丑', reading: '丑（うし）' },
  { kanji: '寅', reading: '寅（とら）' },
  { kanji: '卯', reading: '卯（うさぎ）' },
  { kanji: '辰', reading: '辰（たつ）' },
  { kanji: '巳', reading: '巳（へび）' },
  { kanji: '午', reading: '午（うま）' },
  { kanji: '未', reading: '未（ひつじ）' },
] as const;

// 十干 — (year - 4) % 10 でのインデックス
// 2024: (2024-4)%10=0 → 甲  2023: (2023-4)%10=9 → 癸
const JIKKAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

function isBeforeRisshun(month: number, day: number): boolean {
  // 立春は例年2月4日前後。2月3日以前（1月含む）は前年扱い
  return month === 1 || (month === 2 && day <= 3);
}

// 各桁を1桁になるまで足し合わせた数（デジタルルート）。9の倍数は9とする。
function digitalRoot(n: number): number {
  const r = Math.abs(n) % 9;
  return r === 0 ? 9 : r;
}

export function calcHonmeisei(year: number, month: number, day: number): StarNumber {
  const y = isBeforeRisshun(month, day) ? year - 1 : year;
  const dr = digitalRoot(y);
  const raw = 11 - dr; // 2〜10
  return (raw === 10 ? 1 : raw) as StarNumber;
}

export function calcEto(year: number, month: number, day: number): {
  junishi: string;
  junishiReading: string;
  jikkan: string;
  eto: string;
} {
  const y = isBeforeRisshun(month, day) ? year - 1 : year;
  const junishiIdx = ((y % 12) + 12) % 12;
  const jikkanIdx = (((y - 4) % 10) + 10) % 10;
  const j = JUNISHI[junishiIdx];
  return {
    junishi: j.kanji,
    junishiReading: j.reading,
    jikkan: JIKKAN[jikkanIdx],
    eto: JIKKAN[jikkanIdx] + j.kanji,
  };
}

export interface KyuseiResult {
  starNumber: StarNumber;
  starName: StarName;
  element: string;
  direction: string;
  nature: string;
  junishi: string;
  junishiReading: string;
  eto: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
}

export function calcKyusei(year: number, month: number, day: number): KyuseiResult {
  const starNumber = calcHonmeisei(year, month, day);
  const starName = STAR_NAMES[starNumber] as StarName;
  const info = STAR_INFO[starNumber];
  const eto = calcEto(year, month, day);
  return {
    starNumber,
    starName,
    element: info.element,
    direction: info.direction,
    nature: info.nature,
    junishi: eto.junishi,
    junishiReading: eto.junishiReading,
    eto: eto.eto,
    birthYear: year,
    birthMonth: month,
    birthDay: day,
  };
}

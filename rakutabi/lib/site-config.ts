/**
 * サイト構成の定義（テーマ・地方・エリア・掛け合わせページ・特集・絞り込み条件・季節）。
 * scripts/fetch-hotels.ts（データ取得）とページ表示の両方から参照する。
 *
 * コンテンツ設計の方針（2026-09-26 オーナー指示）:
 * 「楽天トラベル おすすめ」のような大きなキーワードは狙わず、
 * 「地域名＋悩み＋旅行」「子連れ＋旅行＋ホテル＋地域名」のような具体的な組み合わせで検索されるページ
 * （エリア×テーマの掛け合わせページ /area/[area]/[theme]）を軸にする。
 */

export const SITE_NAME = '落旅くん';
export const SITE_CATCH = '知らない景色に、会いに行こう。';
export const SITE_DESCRIPTION =
  '週末旅行・温泉旅行・子連れ旅行・カップル旅行・一人旅。エリアとテーマの組み合わせから、楽天トラベル掲載の宿を比較できます。';
// 新ドメイン取得後に差し替える（未取得のため仮の値）
export const SITE_URL = 'https://rakutabi.example.com';

// ───────── テーマ ─────────

export type ThemeSlug = 'weekend' | 'onsen' | 'family' | 'couple' | 'solo';

export interface Theme {
  slug: ThemeSlug;
  name: string;
  icon: string;
  lead: string;
  /** 掛け合わせページで使う「悩み・目的」の一文 */
  worry: string;
  /** 掛け合わせページのタイトル（「子連れ 旅行 ホテル 箱根」のような検索語を自然に含む形） */
  comboTitle: (areaName: string) => string;
  /** このテーマに該当する宿を、どういう基準で選んだか（ページ上に明記する） */
  criteria: string;
}

export const THEMES: Theme[] = [
  {
    slug: 'weekend',
    name: '週末旅行',
    icon: '🗓',
    lead: '次の土曜日に空室がある宿を集めました。思い立ったらすぐ行ける週末旅に。',
    worry: '週末に思い立って、1泊でどこかへ出かけたい',
    comboTitle: (a) => `${a}へ週末旅行｜次の土曜日に泊まれるホテル・旅館`,
    criteria: '楽天トラベルの空室検索で、次の土曜日（1泊・大人2名）に空室があった宿',
  },
  {
    slug: 'onsen',
    name: '温泉旅行',
    icon: '♨',
    lead: '温泉のある宿だけを集めました。日帰りでは味わえない、泊まりの温泉旅に。',
    worry: '日帰りではなく、泊まりでゆっくり温泉を楽しみたい',
    comboTitle: (a) => `${a}の温泉旅行におすすめの温泉宿`,
    criteria: '楽天トラベルの空室検索で「温泉」の条件に該当した宿',
  },
  {
    slug: 'family',
    name: '子連れ旅行',
    icon: '👪',
    lead: '施設紹介文に、子ども向けの設備・サービスの記載がある宿を集めました。',
    worry: '小さな子どもがいても、気兼ねなく泊まれる宿を探したい',
    comboTitle: (a) => `${a}で子連れ旅行におすすめのホテル・旅館`,
    criteria: '楽天トラベルの施設紹介文に「キッズ」「お子様」「ファミリー」等の記載がある宿（目安）',
  },
  {
    slug: 'couple',
    name: 'カップル旅行',
    icon: '💑',
    lead: '施設紹介文に、記念日・カップル向けの記載がある宿を集めました。',
    worry: '記念日やふたり旅で、少し特別な宿に泊まりたい',
    comboTitle: (a) => `${a}のカップル旅行・記念日におすすめの宿`,
    criteria: '楽天トラベルの施設紹介文に「カップル」「記念日」「おふたり」等の記載がある宿（目安）',
  },
  {
    slug: 'solo',
    name: '一人旅',
    icon: '🎒',
    lead: '大人1名で予約できる空室がある宿を集めました。',
    worry: '一人でも予約しやすく、気軽に泊まれる宿を探したい',
    comboTitle: (a) => `${a}の一人旅におすすめ｜1名で泊まれる宿`,
    criteria: '楽天トラベルの空室検索で、次の土曜日に大人1名で空室があった宿',
  },
];

export function getTheme(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slug === slug);
}

// ───────── 地方・エリア ─────────

export type RegionSlug = 'hokkaido' | 'kanto' | 'tokai' | 'kansai' | 'kyushu';

export interface Region {
  slug: RegionSlug;
  name: string;
  lead: string;
}

export const REGIONS: Region[] = [
  { slug: 'hokkaido', name: '北海道', lead: '登別・函館など、北海道の温泉地・観光地の宿。' },
  { slug: 'kanto', name: '関東', lead: '箱根・草津・鬼怒川など、首都圏から行きやすい宿。' },
  { slug: 'tokai', name: '東海', lead: '熱海・伊東・下呂など、東海エリアの温泉地の宿。' },
  { slug: 'kansai', name: '関西', lead: '有馬・城崎・白浜など、関西の温泉地の宿。' },
  { slug: 'kyushu', name: '九州', lead: '別府・由布院など、九州の温泉地の宿。' },
];

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

/**
 * 取得対象エリア。コードは楽天トラベルの地区コード（GetAreaClass API）。
 * 楽天の地区区分は温泉地単位とは限らないため、name は楽天側の区分名に合わせている。
 * コードが実在するかは scripts/test-connection.ts で GetAreaClass と突き合わせて確認する。
 */
export interface Area {
  key: string;
  name: string;
  prefecture: string;
  region: RegionSlug;
  middleClassCode: string;
  smallClassCode: string;
}

export const AREAS: Area[] = [
  { key: 'noboribetsu', name: '登別', prefecture: '北海道', region: 'hokkaido', middleClassCode: 'hokkaido', smallClassCode: 'noboribetsu' },
  { key: 'hakodate', name: '函館', prefecture: '北海道', region: 'hokkaido', middleClassCode: 'hokkaido', smallClassCode: 'hakodate' },
  { key: 'hakone', name: '箱根', prefecture: '神奈川県', region: 'kanto', middleClassCode: 'kanagawa', smallClassCode: 'hakone' },
  { key: 'kusatsu', name: '草津', prefecture: '群馬県', region: 'kanto', middleClassCode: 'gunma', smallClassCode: 'kusatsu' },
  { key: 'kinugawa', name: '鬼怒川', prefecture: '栃木県', region: 'kanto', middleClassCode: 'tochigi', smallClassCode: 'kinugawa' },
  { key: 'atami', name: '熱海', prefecture: '静岡県', region: 'tokai', middleClassCode: 'shizuoka', smallClassCode: 'atami' },
  { key: 'ito', name: '伊東', prefecture: '静岡県', region: 'tokai', middleClassCode: 'shizuoka', smallClassCode: 'ito' },
  { key: 'gero', name: '下呂', prefecture: '岐阜県', region: 'tokai', middleClassCode: 'gihu', smallClassCode: 'gero' },
  // 楽天の地区区分では有馬単独の区分はなく「神戸・有馬温泉・六甲山」（kobe）にまとまっている（2026-09-26 GetAreaClassで確認）
  { key: 'arima', name: '神戸・有馬', prefecture: '兵庫県', region: 'kansai', middleClassCode: 'hyogo', smallClassCode: 'kobe' },
  // 同様に城崎は「城崎温泉・豊岡・出石・神鍋」（kita）
  { key: 'kinosaki', name: '城崎・豊岡', prefecture: '兵庫県', region: 'kansai', middleClassCode: 'hyogo', smallClassCode: 'kita' },
  { key: 'shirahama', name: '白浜', prefecture: '和歌山県', region: 'kansai', middleClassCode: 'wakayama', smallClassCode: 'shirahama' },
  { key: 'beppu', name: '別府', prefecture: '大分県', region: 'kyushu', middleClassCode: 'ooita', smallClassCode: 'beppu' },
  { key: 'yufuin', name: '由布院', prefecture: '大分県', region: 'kyushu', middleClassCode: 'ooita', smallClassCode: 'yufuin' },
];

export function getArea(key: string): Area | undefined {
  return AREAS.find((a) => a.key === key);
}

/** 掛け合わせページ（/area/[area]/[theme]）を生成する最低件数。少なすぎる薄いページは作らない */
export const COMBO_MIN_HOTELS = 3;

// ───────── 出発地起点の特集（/feature/[slug]） ─────────

export interface Feature {
  slug: string;
  title: string;
  lead: string;
  areaKeys: string[];
  theme: ThemeSlug;
}

export const FEATURES: Feature[] = [
  {
    slug: 'tokyo-onsen',
    title: '東京から行ける温泉宿',
    lead: '箱根・草津・鬼怒川・熱海・伊東など、東京から電車や車で行きやすい温泉地の宿です。',
    areaKeys: ['hakone', 'kusatsu', 'kinugawa', 'atami', 'ito'],
    theme: 'onsen',
  },
  {
    slug: 'tokyo-weekend',
    title: '東京発・週末に行ける宿',
    lead: '東京近郊の人気エリアで、次の土曜日に空室がある宿です。',
    areaKeys: ['hakone', 'kusatsu', 'kinugawa', 'atami', 'ito'],
    theme: 'weekend',
  },
  {
    slug: 'nagoya-onsen',
    title: '名古屋から行ける温泉宿',
    lead: '下呂・熱海・伊東など、名古屋から行きやすい温泉地の宿です。',
    areaKeys: ['gero', 'atami', 'ito'],
    theme: 'onsen',
  },
  {
    slug: 'osaka-onsen',
    title: '大阪から行ける温泉宿',
    lead: '有馬・城崎・白浜など、関西から行きやすい温泉地の宿です。',
    areaKeys: ['arima', 'kinosaki', 'shirahama'],
    theme: 'onsen',
  },
  {
    slug: 'fukuoka-onsen',
    title: '福岡から行ける温泉宿',
    lead: '別府・由布院など、福岡から行きやすい温泉地の宿です。',
    areaKeys: ['beppu', 'yufuin'],
    theme: 'onsen',
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

// ───────── 絞り込み条件 ─────────

/**
 * source: 'api' は楽天トラベルAPIの検索条件で確認できたもの、
 * source: 'text' は施設紹介文（API取得）のキーワードから判定したもの（目安）。
 */
export type ConditionKey = 'onsen' | 'meal' | 'breakfast' | 'station' | 'room' | 'view' | 'kids';
export type ConditionGroup = '食事' | '温泉' | '客室' | '親子' | '立地・景色';

export interface Condition {
  key: ConditionKey;
  label: string;
  group: ConditionGroup;
  source: 'api' | 'text';
  keywords?: RegExp;
}

export const CONDITIONS: Condition[] = [
  { key: 'meal', label: '2食付きプランあり', group: '食事', source: 'api' },
  { key: 'breakfast', label: '朝食付きプランあり', group: '食事', source: 'api' },
  { key: 'onsen', label: '温泉あり', group: '温泉', source: 'api' },
  { key: 'room', label: '露天風呂付客室など', group: '客室', source: 'text', keywords: /露天風呂付|客室露天|スイート|和洋室|離れ/ },
  { key: 'kids', label: '子連れ向け', group: '親子', source: 'text', keywords: /キッズ|お子様|子供|子ども|ファミリー|赤ちゃん|ベビー/ },
  { key: 'station', label: '駅から徒歩圏', group: '立地・景色', source: 'text', keywords: /駅(から|より)?\s*徒歩\s*[0-9０-９]{1,2}\s*分/ },
  { key: 'view', label: '景色・眺望', group: '立地・景色', source: 'text', keywords: /眺望|一望|絶景|オーシャンビュー|夜景|景色/ },
];

export const COUPLE_KEYWORDS = /カップル|記念日|ご夫婦|おふたり|二人|プロポーズ|大人の/;

/** 価格帯（楽天トラベル掲載の1名あたり最低料金） */
export interface PriceBand {
  key: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BANDS: PriceBand[] = [
  { key: 'u10k', label: '〜1万円', min: 0, max: 10000 },
  { key: '10-20k', label: '1万〜2万円', min: 10000, max: 20000 },
  { key: '20-30k', label: '2万〜3万円', min: 20000, max: 30000 },
  { key: 'o30k', label: '3万円〜', min: 30000, max: Infinity },
];

// ───────── 季節 ─────────

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonalFeature {
  season: Season;
  label: string;
  title: string;
  lead: string;
  href: string;
}

export const SEASONAL_FEATURES: SeasonalFeature[] = [
  { season: 'spring', label: '春', title: '桜の季節の週末旅行', lead: '過ごしやすい季節は、週末の1泊旅行に。', href: '/theme/weekend' },
  { season: 'summer', label: '夏', title: '夏休みの子連れ旅行', lead: '家族旅行に向く宿を、エリア別に探す。', href: '/theme/family' },
  { season: 'autumn', label: '秋', title: '紅葉と温泉の旅', lead: '涼しくなってきたら、温泉宿でゆっくり。', href: '/feature/tokyo-onsen' },
  { season: 'winter', label: '冬', title: '雪見と温泉の宿', lead: '寒い季節こそ、北海道の温泉地へ。', href: '/region/hokkaido' },
];

/** 日本時間の月から季節を判定する（ビルド時点。データ更新のたびに再ビルドされる） */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', month: 'numeric' }).format(date),
  );
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

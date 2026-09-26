/**
 * サイト構成の定義（テーマ・エリア・地域×テーマ特集・絞り込み条件・季節特集）。
 * scripts/fetch-hotels.ts（データ取得）とページ表示の両方から参照する。
 */

export const SITE_NAME = '落旅くん';
export const SITE_DESCRIPTION =
  '週末旅行・温泉・子連れ・カップル・一人旅など、テーマ別に楽天トラベル掲載の宿を比較・案内するサイトです。';
// 新ドメイン取得後に差し替える（未取得のため仮の値）
export const SITE_URL = 'https://rakutabi.example.com';

export type ThemeSlug = 'weekend' | 'onsen' | 'family' | 'couple' | 'solo';

export interface Theme {
  slug: ThemeSlug;
  name: string;
  lead: string;
  emoji: string;
}

export const THEMES: Theme[] = [
  { slug: 'weekend', name: '週末旅行', emoji: '🗓', lead: '次の土曜日に空室がある宿を集めました。思い立ったらすぐ行ける週末旅に。' },
  { slug: 'onsen', name: '温泉宿', emoji: '♨', lead: '温泉のある宿だけを集めました。日帰りでは味わえない、泊まりの温泉旅に。' },
  { slug: 'family', name: '子連れ旅行', emoji: '👪', lead: '施設紹介文に子ども向けの設備・サービスの記載がある宿を集めました。' },
  { slug: 'couple', name: 'カップル旅行', emoji: '💑', lead: '施設紹介文に記念日・カップル向けの記載がある宿を集めました。' },
  { slug: 'solo', name: '一人旅', emoji: '🎒', lead: '大人1名で予約できる空室がある宿を集めました。' },
];

export function getTheme(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slug === slug);
}

/**
 * 取得対象エリア。コードは楽天トラベルの地区コード（GetAreaClass API）。
 * コードが実在するかは scripts/test-connection.ts で GetAreaClass と突き合わせて確認する。
 */
export interface Area {
  key: string;
  name: string;
  prefecture: string;
  middleClassCode: string;
  smallClassCode: string;
}

export const AREAS: Area[] = [
  { key: 'hakone', name: '箱根', prefecture: '神奈川県', middleClassCode: 'kanagawa', smallClassCode: 'hakone' },
  { key: 'atami', name: '熱海', prefecture: '静岡県', middleClassCode: 'shizuoka', smallClassCode: 'atami' },
  { key: 'kusatsu', name: '草津', prefecture: '群馬県', middleClassCode: 'gunma', smallClassCode: 'kusatsu' },
  { key: 'kinugawa', name: '鬼怒川', prefecture: '栃木県', middleClassCode: 'tochigi', smallClassCode: 'kinugawa' },
  // 楽天の地区区分では有馬単独の区分はなく「神戸・有馬温泉・六甲山」（kobe）にまとまっている（2026-09-26 GetAreaClassで確認）
  { key: 'arima', name: '神戸・有馬', prefecture: '兵庫県', middleClassCode: 'hyogo', smallClassCode: 'kobe' },
  // 同様に城崎は「城崎温泉・豊岡・出石・神鍋」（kita）
  { key: 'kinosaki', name: '城崎・豊岡', prefecture: '兵庫県', middleClassCode: 'hyogo', smallClassCode: 'kita' },
  { key: 'shirahama', name: '白浜', prefecture: '和歌山県', middleClassCode: 'wakayama', smallClassCode: 'shirahama' },
];

/** 地域×テーマの掛け合わせ特集（/area/[slug]） */
export interface AreaFeature {
  slug: string;
  title: string;
  lead: string;
  areaKeys: string[];
  theme: ThemeSlug;
}

export const AREA_FEATURES: AreaFeature[] = [
  {
    slug: 'tokyo-onsen',
    title: '東京から行きやすい温泉宿',
    lead: '箱根・熱海・草津・鬼怒川など、東京から電車や車で行きやすい温泉地の宿です。',
    areaKeys: ['hakone', 'atami', 'kusatsu', 'kinugawa'],
    theme: 'onsen',
  },
  {
    slug: 'tokyo-weekend',
    title: '東京発・週末に行ける宿',
    lead: '東京近郊の人気エリアで、次の土曜日に空室がある宿です。',
    areaKeys: ['hakone', 'atami', 'kusatsu', 'kinugawa'],
    theme: 'weekend',
  },
  {
    slug: 'osaka-onsen',
    title: '大阪から行きやすい温泉宿',
    lead: '有馬・城崎・白浜など、関西から行きやすい温泉地の宿です。',
    areaKeys: ['arima', 'kinosaki', 'shirahama'],
    theme: 'onsen',
  },
];

export function getAreaFeature(slug: string): AreaFeature | undefined {
  return AREA_FEATURES.find((f) => f.slug === slug);
}

/**
 * 一覧ページの絞り込み条件。
 * source: 'api' は楽天トラベルAPIの検索条件で確認できたもの、
 * source: 'text' は施設紹介文（API取得）のキーワードから判定したもの（目安）。
 */
export type ConditionKey = 'onsen' | 'meal' | 'station' | 'room' | 'view' | 'kids';

export interface Condition {
  key: ConditionKey;
  label: string;
  source: 'api' | 'text';
  keywords?: RegExp;
}

export const CONDITIONS: Condition[] = [
  { key: 'onsen', label: '温泉あり', source: 'api' },
  { key: 'meal', label: '2食付きプランあり', source: 'api' },
  { key: 'station', label: '駅から徒歩圏', source: 'text', keywords: /駅(から|より)?\s*徒歩\s*[0-9０-９]{1,2}\s*分/ },
  { key: 'room', label: '客室にこだわり', source: 'text', keywords: /露天風呂付|客室露天|スイート|和洋室|離れ/ },
  { key: 'view', label: '景色・眺望', source: 'text', keywords: /眺望|一望|絶景|オーシャンビュー|夜景|景色/ },
  { key: 'kids', label: '子連れ向け', source: 'text', keywords: /キッズ|お子様|子供|子ども|ファミリー|赤ちゃん|ベビー/ },
];

export const COUPLE_KEYWORDS = /カップル|記念日|ご夫婦|おふたり|二人|プロポーズ|大人の/;

/** 季節ごとのおすすめ特集（トップページ）。ビルド時点の月（日本時間）で切り替わる */
export interface SeasonalFeature {
  title: string;
  lead: string;
  href: string;
}

export function getSeasonalFeature(date: Date = new Date()): SeasonalFeature {
  const month = Number(
    new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric' }).format(date).replace('月', ''),
  );
  if (month >= 3 && month <= 5) {
    return { title: '春の週末旅行', lead: '過ごしやすい季節は、週末の1泊旅行に。', href: '/theme/weekend' };
  }
  if (month >= 6 && month <= 8) {
    return { title: '夏休みの子連れ旅行', lead: '夏休みの家族旅行に向く宿を探す。', href: '/theme/family' };
  }
  if (month >= 9 && month <= 11) {
    return { title: '秋の温泉旅', lead: '涼しくなってきたら、温泉宿でゆっくり。', href: '/area/tokyo-onsen' };
  }
  return { title: '冬の温泉宿', lead: '寒い季節こそ、温泉地の宿へ。', href: '/theme/onsen' };
}

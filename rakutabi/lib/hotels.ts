import hotelsData from '@/data/hotels.json';
import {
  AREAS,
  COMBO_MIN_HOTELS,
  THEMES,
  type Area,
  type ConditionKey,
  type RegionSlug,
  type Theme,
  type ThemeSlug,
} from '@/lib/site-config';

export interface Plan {
  planName: string;
  roomName: string;
  /** 検索条件の大人人数（料金はこの人数での1泊合計） */
  adults: number;
  total: number | null;
  withBreakfast: boolean;
  withDinner: boolean;
  /** 楽天トラベルの予約URL（affiliateId付きで取得した場合はアフィリエイトURL） */
  reserveUrl: string;
}

export interface Ratings {
  service: number | null;
  location: number | null;
  room: number | null;
  equipment: number | null;
  bath: number | null;
  meal: number | null;
}

export interface DetailItem {
  label: string;
  value: string;
}

export interface Hotel {
  hotelNo: number;
  name: string;
  kana: string;
  areaKey: string;
  address: string;
  access: string;
  nearestStation: string;
  special: string;
  imageUrl: string;
  roomImageUrl: string;
  /** 楽天トラベルの施設ページURL（affiliateId付きで取得した場合はアフィリエイトURL） */
  informationUrl: string;
  /** 楽天トラベルの宿泊プラン一覧URL（同上） */
  planListUrl: string;
  /** 楽天トラベルの口コミページURL（同上） */
  reviewUrl: string;
  /** 楽天トラベル掲載の最低料金（1名あたり、円） */
  minCharge: number | null;
  reviewAverage: number | null;
  reviewCount: number | null;
  /** 楽天トラベルに掲載されている最新の口コミ抜粋 */
  userReview: string;
  ratings: Ratings | null;
  /** 施設情報API（responseType=large）から取得した詳細項目 */
  details: DetailItem[];
  plans: Plan[];
  themes: ThemeSlug[];
  conditions: ConditionKey[];
}

export interface HotelsFile {
  fetchedAt: string | null;
  checkinDate: string | null;
  hotels: Hotel[];
}

// 旧形式のデータ（ratings/plans等が無い）でも表示が壊れないよう、欠けている項目を補う
const data: HotelsFile = {
  ...(hotelsData as HotelsFile),
  hotels: ((hotelsData as HotelsFile).hotels ?? []).map((h) => ({
    kana: '',
    reviewUrl: '',
    userReview: '',
    ratings: null,
    details: [],
    plans: [],
    ...h,
  })),
};

export function getAllHotels(): Hotel[] {
  return data.hotels;
}

export function getFetchedAt(): string | null {
  return data.fetchedAt;
}

export function getCheckinDate(): string | null {
  return data.checkinDate;
}

export function getHotel(hotelNo: number): Hotel | undefined {
  return data.hotels.find((h) => h.hotelNo === hotelNo);
}

const byReview = (a: Hotel, b: Hotel) => (b.reviewAverage ?? 0) - (a.reviewAverage ?? 0);

export function getHotelsByTheme(theme: ThemeSlug, areaKeys?: string[]): Hotel[] {
  return data.hotels
    .filter((h) => h.themes.includes(theme))
    .filter((h) => !areaKeys || areaKeys.includes(h.areaKey))
    .sort(byReview);
}

export function getHotelsByArea(areaKeys: string[]): Hotel[] {
  return data.hotels.filter((h) => areaKeys.includes(h.areaKey)).sort(byReview);
}

export function getAreasInRegion(region: RegionSlug): Area[] {
  return AREAS.filter((a) => a.region === region);
}

/** 掛け合わせページ（エリア×テーマ）のうち、一定件数以上の宿があって生成するもの */
export function getComboPages(): { area: Area; theme: Theme; count: number }[] {
  const out: { area: Area; theme: Theme; count: number }[] = [];
  for (const area of AREAS) {
    for (const theme of THEMES) {
      const count = getHotelsByTheme(theme.slug, [area.key]).length;
      if (count >= COMBO_MIN_HOTELS) out.push({ area, theme, count });
    }
  }
  return out;
}

export function hasComboPage(areaKey: string, theme: ThemeSlug): boolean {
  return getHotelsByTheme(theme, [areaKey]).length >= COMBO_MIN_HOTELS;
}

/** 検索窓用。宿名・よみがな・エリア名・住所・最寄り駅で部分一致 */
export function searchHotels(query: string): Hotel[] {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return data.hotels
    .filter((h) => {
      const area = AREAS.find((a) => a.key === h.areaKey);
      const text = `${h.name} ${h.kana} ${area?.name ?? ''} ${area?.prefecture ?? ''} ${h.address} ${h.nearestStation}`;
      return words.every((w) => text.includes(w));
    })
    .sort(byReview);
}

/**
 * 楽天アフィリエイト経由のURLかどうか。
 * アフィリエイトタグのないリンクは本番に出さないルールのため、予約ボタンはこれがtrueのときだけ表示する。
 */
export function isAffiliateUrl(url: string): boolean {
  try {
    return new URL(url).hostname === 'hb.afl.rakuten.co.jp';
  } catch {
    return false;
  }
}

/** 予約ボタンに使うURL（プラン一覧 → 施設ページの順）。アフィリエイトURLでなければnull */
export function getReserveUrl(hotel: Hotel): string | null {
  if (isAffiliateUrl(hotel.planListUrl)) return hotel.planListUrl;
  if (isAffiliateUrl(hotel.informationUrl)) return hotel.informationUrl;
  return null;
}

export function formatYen(n: number | null): string {
  return n == null ? '—' : `¥${n.toLocaleString('ja-JP')}`;
}

/**
 * おすすめポイント（箇条書き）。取得データから言える事実だけを並べる（独自の評価・誇張はしない）
 */
export function getHighlights(hotel: Hotel): string[] {
  const points: string[] = [];
  if (hotel.reviewAverage != null && hotel.reviewCount) {
    points.push(`楽天トラベルの口コミ評価 ${hotel.reviewAverage.toFixed(2)}（${hotel.reviewCount.toLocaleString('ja-JP')}件）`);
  }
  if (hotel.ratings) {
    const labels: [keyof Ratings, string][] = [
      ['bath', '風呂'], ['meal', '食事'], ['service', 'サービス'], ['room', '部屋'], ['location', '立地'], ['equipment', '設備・アメニティ'],
    ];
    const top = labels
      .map(([k, l]) => ({ l, v: hotel.ratings?.[k] ?? null }))
      .filter((x): x is { l: string; v: number } => x.v != null)
      .sort((a, b) => b.v - a.v)[0];
    if (top) points.push(`項目別の口コミ評価では「${top.l}」が最も高い（${top.v.toFixed(2)}）`);
  }
  if (hotel.conditions.includes('onsen')) points.push('温泉あり（楽天トラベルの検索条件で確認）');
  if (hotel.conditions.includes('meal')) points.push('夕食・朝食付きのプランあり');
  else if (hotel.conditions.includes('breakfast')) points.push('朝食付きのプランあり');
  if (hotel.nearestStation) points.push(`最寄り駅は${hotel.nearestStation}駅`);
  if (hotel.conditions.includes('kids')) points.push('施設紹介文に子ども向けの設備・サービスの記載あり');
  return points;
}

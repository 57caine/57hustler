import hotelsData from '@/data/hotels.json';
import type { ConditionKey, ThemeSlug } from '@/lib/site-config';

export interface Hotel {
  hotelNo: number;
  name: string;
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
  /** 楽天トラベル掲載の最低料金（1名あたり、円） */
  minCharge: number | null;
  reviewAverage: number | null;
  reviewCount: number | null;
  themes: ThemeSlug[];
  conditions: ConditionKey[];
}

export interface HotelsFile {
  fetchedAt: string | null;
  checkinDate: string | null;
  hotels: Hotel[];
}

const data = hotelsData as HotelsFile;

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

export function getHotelsByTheme(theme: ThemeSlug, areaKeys?: string[]): Hotel[] {
  return data.hotels
    .filter((h) => h.themes.includes(theme))
    .filter((h) => !areaKeys || areaKeys.includes(h.areaKey))
    .sort((a, b) => (b.reviewAverage ?? 0) - (a.reviewAverage ?? 0));
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

export function formatYen(n: number | null): string {
  return n == null ? '—' : `¥${n.toLocaleString('ja-JP')}`;
}

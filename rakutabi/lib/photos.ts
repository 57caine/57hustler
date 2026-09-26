import photosData from '@/data/photos.json';
import type { Photo, PhotoKey } from '@/lib/photo-keys';
import { getAreasInRegion, getHotelsByArea, getHotelsByTheme, type Hotel } from '@/lib/hotels';
import type { RegionSlug, ThemeSlug } from '@/lib/site-config';

const photos = photosData as Partial<Record<PhotoKey, Photo>>;

function fromHotel(h: Hotel | undefined): Photo | null {
  if (!h?.imageUrl) return null;
  return { url: h.imageUrl, alt: h.name, credit: h.name };
}

/** 口コミ件数が多い（＝楽天トラベルで実績のある）宿を代表写真に使う */
function representative(hotels: Hotel[]): Hotel | undefined {
  return [...hotels].filter((h) => h.imageUrl).sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))[0];
}

/**
 * 風景写真を返す。Unsplash の写真（scripts/fetch-photos.ts で取得）が無い場合は、
 * 関連する楽天トラベル掲載宿の写真で代用する。どちらも無ければ null（表示側はグラデーション）
 */
export function getPhoto(key: PhotoKey): Photo | null {
  const p = photos[key];
  if (p) return p;
  if (key.startsWith('theme-')) return fromHotel(representative(getHotelsByTheme(key.slice(6) as ThemeSlug)));
  if (key.startsWith('region-')) {
    const areas = getAreasInRegion(key.slice(7) as RegionSlug).map((a) => a.key);
    return fromHotel(representative(getHotelsByArea(areas)));
  }
  const seasonArea: Record<string, string[]> = {
    'season-spring': ['hakone', 'atami'],
    'season-summer': ['shirahama', 'ito'],
    'season-autumn': ['kinugawa', 'kusatsu'],
    'season-winter': ['noboribetsu', 'hakodate'],
    hero: ['hakone'],
    banner: ['atami'],
  };
  return fromHotel(representative(getHotelsByTheme('onsen', seasonArea[key] ?? ['hakone'])));
}

export function getAreaPhoto(areaKey: string): Photo | null {
  return fromHotel(representative(getHotelsByArea([areaKey])));
}

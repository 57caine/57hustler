/** 風景写真のキーと Unsplash の検索語（scripts/fetch-photos.ts と lib/photos.ts で共用） */

export interface Photo {
  url: string;
  alt: string;
  /** 撮影者名（Unsplashのクレジット表示用。楽天の宿の写真で代用した場合は宿名） */
  credit: string;
  creditUrl?: string;
}

export const PHOTO_QUERIES = {
  hero: 'japan onsen sunset lake',
  banner: 'mount fuji lake',
  'theme-weekend': 'japanese ryokan',
  'theme-onsen': 'japanese hot spring',
  'theme-family': 'family travel japan',
  'theme-couple': 'couple sunset japan',
  'theme-solo': 'solo traveler japan lake',
  'season-spring': 'cherry blossom japan',
  'season-summer': 'tropical beach japan',
  'season-autumn': 'japan autumn leaves',
  'season-winter': 'japan snow onsen',
  'region-hokkaido': 'hokkaido lavender',
  'region-kanto': 'tokyo skyline',
  'region-tokai': 'hot spring japan town',
  'region-kansai': 'kyoto pagoda',
  'region-kyushu': 'kyushu nature',
} as const;

export type PhotoKey = keyof typeof PHOTO_QUERIES;

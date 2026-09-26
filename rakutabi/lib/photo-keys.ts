/** 風景写真のキーと Unsplash の検索語（scripts/fetch-photos.ts と lib/photos.ts で共用） */

export interface Photo {
  url: string;
  alt: string;
  /** 撮影者名（Unsplashのクレジット表示用。楽天の宿の写真で代用した場合は宿名） */
  credit: string;
  creditUrl?: string;
}

export const PHOTO_QUERIES = {
  hero: 'lake ashi hakone',
  banner: 'mount fuji lake',
  'theme-weekend': 'japanese ryokan',
  'theme-onsen': 'onsen ryokan japan',
  'theme-family': 'family vacation',
  'theme-couple': 'couple sunset japan',
  'theme-solo': 'solo traveler japan lake',
  'season-spring': 'cherry blossom japan',
  'season-summer': 'okinawa beach',
  'season-autumn': 'japan autumn leaves',
  'season-winter': 'japan snow onsen',
  'region-hokkaido': 'hokkaido lavender',
  'region-kanto': 'tokyo skyline',
  'region-tokai': 'hot spring japan town',
  'region-kansai': 'kyoto temple',
  'region-kyushu': 'kyushu nature',
} as const;

export type PhotoKey = keyof typeof PHOTO_QUERIES;

/**
 * 特定の写真だけ、複数の検索語で候補を集め、写真の説明文（Unsplashの alt / description）で絞り込んでから選ぶ。
 * 1語の検索では雰囲気の違う写真（例：温泉旅行に高層ビル横のプール）が選ばれたため（2026-09-26 オーナー指摘）
 */
export interface PhotoRule {
  queries: string[];
  /** 説明文にこのいずれかを含む写真だけを候補にする */
  include: RegExp;
  /** 説明文にこのいずれかを含む写真は除外する */
  exclude?: RegExp;
  /**
   * 写真の内容を表す説明文（alt_description）にこれを含む写真を優先する。
   * 補足説明（description）は地名・施設名（例「〇〇温泉の旅館」）を含むことがあり、写真の中身と一致しないため対象外
   */
  prefer?: RegExp;
}

export const PHOTO_RULES: Partial<Record<PhotoKey, PhotoRule>> = {
  'theme-onsen': {
    queries: ['露天風呂', '和風旅館', 'onsen ryokan japan', 'japanese outdoor hot spring bath', 'rotenburo'],
    include: /onsen|hot spring|hotspring|rotenburo|open-air bath|outdoor bath|bath|ryokan|japanese|温泉|露天|旅館|和風/i,
    prefer: /hot spring|onsen|rotenburo|open-air bath|outdoor bath|温泉|露天/i,
    exclude: /swimming pool|\bpool\b|tall building|skyscraper|city|hotel room|bathroom|bathtub in|toilet|people|person|woman|man\b/i,
  },
};

// Unsplash Search API から、カテゴリーページのヒーロー画像を取得する。
// ビルド時（Vercel等、外部ネットワークに到達できる環境）に一度だけ呼ばれる想定。
// UNSPLASH_ACCESS_KEY が未設定、またはAPI呼び出しに失敗した場合は null を返し、
// 呼び出し側は既存のグラデーション背景にフォールバックする。
//
// 【キャッシュ化】data/unsplash-cache.json に取得結果を永続化する。Next.jsの
// fetchキャッシュ（next: { revalidate: false }）はビルド環境によっては次回
// ビルドに引き継がれないことがあり、その場合デプロイのたびにUnsplash APIを
// 叩き直してレート制限（デモアプリ: 50リクエスト/時間）に達する恐れがある。
// ファイルキャッシュにヒットすればAPIを一切呼ばず、ミスした場合のみAPIを
// 呼んでキャッシュに書き戻す。一度取得したクエリ・Photo IDは、キャッシュ
// ファイルがリポジトリにコミットされている限り、以後のビルドで再取得されない。

import * as fs from 'fs';
import * as path from 'path';

interface UnsplashCacheFile {
  heroImages: Record<string, string | null>;
  photos: Record<string, UnsplashFixedPhoto | null>;
}

const CACHE_PATH = path.join(process.cwd(), 'data', 'unsplash-cache.json');

let cache: UnsplashCacheFile | null = null;

function loadCache(): UnsplashCacheFile {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
    cache = JSON.parse(raw) as UnsplashCacheFile;
  } catch {
    cache = { heroImages: {}, photos: {} };
  }
  return cache;
}

// 複数ページが並行してビルドされても最新の状態を尊重できるよう、書き込み時に
// ディスク上の最新内容を読み直してからマージする。読み書きに失敗しても
// （読み取り専用環境など）呼び出し元の処理は継続する。
function persistCache(mutate: (c: UnsplashCacheFile) => void) {
  try {
    let onDisk: UnsplashCacheFile;
    try {
      onDisk = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) as UnsplashCacheFile;
    } catch {
      onDisk = { heroImages: {}, photos: {} };
    }
    mutate(onDisk);
    cache = onDisk;
    fs.writeFileSync(CACHE_PATH, JSON.stringify(onDisk, null, 2) + '\n', 'utf-8');
  } catch {
    // 書き込み不可（読み取り専用のサーバーレス環境等）でも致命的ではないため無視する
  }
}

interface UnsplashPhoto {
  urls: { regular: string; full: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

export interface UnsplashFixedPhoto {
  url: string;
  photographerName: string;
  // Unsplash APIガイドライン準拠のクレジット表示用リンク（utm_source/utm_medium付き）
  photographerCreditUrl: string;
  unsplashCreditUrl: string;
}

// 特定のPhoto IDを指定して1枚を固定取得する（検索クエリと違い、ビルドごとに
// 同じ写真が返る）。Unsplash APIガイドラインに従い、クレジット表示用のURLも返す。
export async function getPhotoById(photoId: string): Promise<UnsplashFixedPhoto | null> {
  const cached = loadCache().photos[photoId];
  if (cached !== undefined) return cached;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const url = `https://api.unsplash.com/photos/${photoId}`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: false },
    });
    if (!res.ok) return null;

    const photo = (await res.json()) as UnsplashPhoto;
    if (!photo.urls?.regular) return null;

    const utm = 'utm_source=lens-navi&utm_medium=referral';
    const result: UnsplashFixedPhoto = {
      url: photo.urls.regular,
      photographerName: photo.user.name,
      photographerCreditUrl: `${photo.user.links.html}?${utm}`,
      unsplashCreditUrl: `https://unsplash.com/?${utm}`,
    };
    persistCache(c => { c.photos[photoId] = result; });
    return result;
  } catch {
    return null;
  }
}

// page: 同じqueryでも複数記事で使い回す際に、Unsplashの検索結果ページを
// ずらして取得するための指定（1始まり）。同じ写真の量産感を避けるために使う。
export async function getHeroImage(query: string, page: number = 1): Promise<string | null> {
  const cacheKey = `${query}::${page}`;
  const cached = loadCache().heroImages[cacheKey];
  if (cached !== undefined) return cached;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&page=${page}&orientation=landscape&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      // ビルド時に一度取得すれば十分。サイトの再デプロイごとに更新される。
      next: { revalidate: false },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as UnsplashSearchResponse;
    const imageUrl = data.results[0]?.urls.regular ?? null;
    if (imageUrl) persistCache(c => { c.heroImages[cacheKey] = imageUrl; });
    return imageUrl;
  } catch {
    return null;
  }
}

// slug文字列から安定した小さな整数を作る（写真バリエーション選択に使用）
export function stableIndex(slug: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return (hash % mod) + 1;
}

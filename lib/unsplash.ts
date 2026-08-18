// Unsplash Search API から、カテゴリーページのヒーロー画像を取得する。
// ビルド時（Vercel等、外部ネットワークに到達できる環境）に一度だけ呼ばれる想定。
// UNSPLASH_ACCESS_KEY が未設定、またはAPI呼び出しに失敗した場合は null を返し、
// 呼び出し側は既存のグラデーション背景にフォールバックする。

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
    return {
      url: photo.urls.regular,
      photographerName: photo.user.name,
      photographerCreditUrl: `${photo.user.links.html}?${utm}`,
      unsplashCreditUrl: `https://unsplash.com/?${utm}`,
    };
  } catch {
    return null;
  }
}

// page: 同じqueryでも複数記事で使い回す際に、Unsplashの検索結果ページを
// ずらして取得するための指定（1始まり）。同じ写真の量産感を避けるために使う。
export async function getHeroImage(query: string, page: number = 1): Promise<string | null> {
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
    return data.results[0]?.urls.regular ?? null;
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

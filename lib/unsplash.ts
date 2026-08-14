// Unsplash Search API から、カテゴリーページのヒーロー画像を取得する。
// ビルド時（Vercel等、外部ネットワークに到達できる環境）に一度だけ呼ばれる想定。
// UNSPLASH_ACCESS_KEY が未設定、またはAPI呼び出しに失敗した場合は null を返し、
// 呼び出し側は既存のグラデーション背景にフォールバックする。

interface UnsplashPhoto {
  urls: { regular: string; full: string };
  alt_description: string | null;
  user: { name: string };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

export async function getHeroImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`;
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

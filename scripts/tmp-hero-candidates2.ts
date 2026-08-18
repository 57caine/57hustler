/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * トップページのヒーロー画像候補（親しみやすさ重視）を複数クエリで取得し、
 * メタ情報とサムネイルをbase64でログに出力する。
 * 結果はログ出力のみ。ファイルへの永続化は行わない。
 */

interface UnsplashPhoto {
  urls: { regular: string; small: string };
  alt_description: string | null;
  description: string | null;
  user: { name: string };
  width: number;
  height: number;
  likes: number;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

const CANDIDATES = [
  'woman smiling glasses',
  'person eye exam happy',
  'eye care smile',
];

async function searchTop3(query: string, accessKey: string): Promise<UnsplashPhoto[]> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
  if (!res.ok) {
    console.log(`  ERROR: ${res.status} ${await res.text()}`);
    return [];
  }
  const data = (await res.json()) as UnsplashSearchResponse;
  return data.results;
}

async function downloadThumbnailBase64(smallUrl: string): Promise<string> {
  const thumbUrl = `${smallUrl}${smallUrl.includes('?') ? '&' : '?'}w=300&q=60`;
  const res = await fetch(thumbUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('base64');
}

async function main() {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY is not set');

  for (const query of CANDIDATES) {
    console.log(`\n\n========== クエリ: "${query}" ==========`);
    const photos = await searchTop3(query, accessKey);
    if (photos.length === 0) {
      console.log('  結果なし');
      continue;
    }
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      console.log(`\n--- 候補${i + 1} ---`);
      console.log(`alt_description: ${p.alt_description ?? '(なし)'}`);
      console.log(`description: ${p.description ?? '(なし)'}`);
      console.log(`撮影者: ${p.user.name}`);
      console.log(`サイズ: ${p.width}x${p.height} / いいね数: ${p.likes}`);
      console.log(`regular URL: ${p.urls.regular}`);
      const b64 = await downloadThumbnailBase64(p.urls.small);
      console.log(`THUMBNAIL_BASE64_START[${query.replace(/\s+/g, '_')}_${i + 1}]`);
      console.log(b64);
      console.log(`THUMBNAIL_BASE64_END[${query.replace(/\s+/g, '_')}_${i + 1}]`);
    }
  }

  console.log('\n\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });

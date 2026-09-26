/**
 * トップのヒーロー・テーマ・季節・エリア・バナーに使う風景写真を Unsplash から取得し、data/photos.json に保存する。
 * GitHub Actions 上で実行する（UNSPLASH_ACCESS_KEY が必要）。
 *
 * - 一度取得した写真は photos.json に残し、再取得しない（Unsplashのデモ枠は1時間50リクエストのため）
 * - キーが無い・取得に失敗した場合は何もしない。表示側（lib/photos.ts）が楽天の宿の写真で代用する
 * - Unsplash の利用規約に従い、撮影者名・プロフィールURLを保存して表示時にクレジットを出す
 *   （Unsplash API ガイドラインにより download_location へのアクセスも行う）
 */
import fs from 'node:fs';
import path from 'node:path';
import { PHOTO_QUERIES, type Photo } from '../lib/photo-keys';

const OUT = path.join(__dirname, '..', 'data', 'photos.json');
const UTM = 'utm_source=rakutabi&utm_medium=referral';

interface UnsplashSearch {
  results?: {
    id: string;
    likes: number;
    alt_description: string | null;
    urls: { raw: string };
    links: { download_location: string };
    user: { name: string; links: { html: string } };
  }[];
}

async function main() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const photos: Record<string, Photo> = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  if (!key) {
    console.log('UNSPLASH_ACCESS_KEY が未設定のため、写真の取得をスキップします（楽天の宿の写真で代用表示）');
    return;
  }
  let added = 0;
  for (const [photoKey, query] of Object.entries(PHOTO_QUERIES)) {
    if (photos[photoKey]) continue;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5&content_filter=high`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } });
    if (!res.ok) {
      console.log(`  ${photoKey}（${query}）: 失敗 HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
      if (res.status === 401 || res.status === 403) break;
      continue;
    }
    // 上位5件のうち「いいね」が最も多い写真を使う（1件目がテーマから外れていることがあるため）
    const results = ((await res.json()) as UnsplashSearch).results ?? [];
    const first = [...results].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))[0];
    if (!first) {
      console.log(`  ${photoKey}（${query}）: 該当なし`);
      continue;
    }
    // Unsplash API ガイドライン: 写真を使うときは download_location を呼ぶ
    await fetch(first.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => undefined);
    photos[photoKey] = {
      url: `${first.urls.raw}&w=1600&q=75&auto=format&fit=crop`,
      alt: first.alt_description ?? '',
      credit: first.user.name,
      creditUrl: `${first.user.links.html}?${UTM}`,
    };
    added++;
    console.log(`  ${photoKey}（${query}）: 取得 by ${first.user.name}`);
  }
  fs.writeFileSync(OUT, JSON.stringify(photos, null, 2) + '\n');
  console.log(`写真: 新規${added}件 / 合計${Object.keys(photos).length}件`);
}

main().catch((e) => { console.error(e); process.exit(0); });

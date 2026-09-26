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
import { PHOTO_QUERIES, PHOTO_RULES, type Photo, type PhotoKey, type PhotoRule } from '../lib/photo-keys';

const OUT = path.join(__dirname, '..', 'data', 'photos.json');
const UTM = 'utm_source=rakutabi&utm_medium=referral';

type Result = NonNullable<UnsplashSearch['results']>[number];

interface UnsplashSearch {
  results?: {
    id: string;
    likes: number;
    description: string | null;
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
  for (const [photoKey, query] of Object.entries(PHOTO_QUERIES) as [PhotoKey, string][]) {
    if (photos[photoKey]) continue;
    const rule = PHOTO_RULES[photoKey];
    // サイト内の別の場所ですでに使っている写真は選ばない（同じ写真が2か所に出ないように）
    const used = new Set(Object.values(photos).map((p) => photoId(p.url)));
    const first = rule ? await pickByRule(photoKey, rule, key, used) : await pickMostLiked(photoKey, query, key);
    if (first === 'stop') break;
    if (!first) continue;
    // Unsplash API ガイドライン: 写真を使うときは download_location を呼ぶ
    await fetch(first.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => undefined);
    photos[photoKey] = {
      url: `${first.urls.raw}&w=1600&q=75&auto=format&fit=crop`,
      alt: first.alt_description ?? '',
      credit: first.user.name,
      creditUrl: `${first.user.links.html}?${UTM}`,
    };
    added++;
    console.log(`  ${photoKey}: 採用「${first.alt_description ?? ''}」 by ${first.user.name}`);
  }
  fs.writeFileSync(OUT, JSON.stringify(photos, null, 2) + '\n');
  console.log(`写真: 新規${added}件 / 合計${Object.keys(photos).length}件`);
}



async function search(query: string, key: string, perPage: number): Promise<Result[] | 'stop' | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${perPage}&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } });
  if (!res.ok) {
    console.log(`  （${query}）: 失敗 HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.status === 401 || res.status === 403 ? 'stop' : null;
  }
  return ((await res.json()) as UnsplashSearch).results ?? [];
}

/** 上位5件のうち「いいね」が最も多い写真（1件目がテーマから外れていることがあるため） */
async function pickMostLiked(photoKey: string, query: string, key: string): Promise<Result | 'stop' | null> {
  const results = await search(query, key, 5);
  if (results === 'stop') return 'stop';
  const best = [...(results ?? [])].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))[0];
  if (!best) console.log(`  ${photoKey}（${query}）: 該当なし`);
  return best ?? null;
}

/** 複数の検索語で候補を集め、説明文の条件を満たすものの中から「いいね」が最も多い写真 */
/** images.unsplash.com/photo-xxxx?... の photo-xxxx 部分 */
function photoId(url: string): string {
  return url.match(/photo-[^?]+/)?.[0] ?? url;
}

async function pickByRule(photoKey: string, rule: PhotoRule, key: string, used: Set<string>): Promise<Result | 'stop' | null> {
  const seen = new Map<string, Result>();
  for (const q of rule.queries) {
    const results = await search(q, key, 10);
    if (results === 'stop') return 'stop';
    for (const r of results ?? []) seen.set(r.id, r);
  }
  const passed: Result[] = [];
  for (const r of seen.values()) {
    const text = `${r.alt_description ?? ''} ${r.description ?? ''}`;
    const dup = used.has(photoId(r.urls.raw));
    const ok = !dup && rule.include.test(text) && !(rule.exclude?.test(text) ?? false);
    const preferred = ok && (rule.prefer?.test(r.alt_description ?? '') ?? false);
    console.log(`    候補 ${ok ? (preferred ? '◎' : '○') : '×'}${dup ? '（使用済み）' : ''} likes=${r.likes} 「${text.trim().slice(0, 90)}」`);
    if (ok) passed.push(r);
  }
  // 写真の内容そのものが条件に合うもの（◎）を優先し、その中で「いいね」が多い順
  const isPreferred = (r: Result) => (rule.prefer?.test(r.alt_description ?? '') ? 1 : 0);
  const best = passed.sort((a, b) => isPreferred(b) - isPreferred(a) || (b.likes ?? 0) - (a.likes ?? 0))[0];
  console.log(`  ${photoKey}: 候補${seen.size}件中、条件を満たすもの${passed.length}件（うち写真の内容が合うもの${passed.filter(isPreferred).length}件）`);
  return best ?? null;
}

main().catch((e) => { console.error(e); process.exit(0); });

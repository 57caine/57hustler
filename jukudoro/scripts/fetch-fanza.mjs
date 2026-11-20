// 熟ドロ: DMMアフィリエイトAPI（v3 ItemList）からFANZAの作品情報を取得し、
// jukudoro/dist/data/fanza.json に保存する。GitHub Actionsから実行する想定。
//
// 必要な環境変数（GitHub Secrets）:
//   DMM_API_ID       … DMMアフィリエイトのAPI ID（ページには出さない）
//   DMM_AFFILIATE_ID … API用のアフィリエイトID（末尾 -990〜-999）。未設定なら nsplot-990
//
// 方針:
//   - 動画ファイルは保存しない。サンプルはFANZAが提供するプレイヤーURLだけを保存する
//   - 価格・セールは取得した値をそのまま使う（推定・加工はしない）
//   - 取得に失敗したら既存ファイルを残して終了コード1（壊れたデータで上書きしない）
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ID = process.env.DMM_API_ID;
const AFFILIATE_ID = process.env.DMM_AFFILIATE_ID || 'nsplot-990';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/data/fanza.json');
const ENDPOINT = 'https://api.dmm.com/affiliate/v3/ItemList';

// カテゴリはNTRを先頭に、人妻・熟女がメイン（2026-11-20 オーナー指示）
const QUERIES = [
  { cat: 'NTR', keyword: '寝取り・寝取られ' },
  { cat: '人妻', keyword: '人妻' },
  { cat: '熟女', keyword: '熟女' },
];
const HITS = 20;

if (!API_ID) {
  console.error('DMM_API_ID が設定されていません。GitHub の Settings > Secrets and variables > Actions に登録してください。');
  process.exit(1);
}
if (!/-99\d$/.test(AFFILIATE_ID)) {
  console.error(`アフィリエイトID「${AFFILIATE_ID}」はAPI用（末尾 -990〜-999）ではありません。`);
  process.exit(1);
}

async function fetchItems({ cat, keyword }) {
  const params = new URLSearchParams({
    api_id: API_ID, affiliate_id: AFFILIATE_ID, site: 'FANZA', service: 'digital', floor: 'videoa',
    hits: String(HITS), sort: 'rank', keyword, output: 'json',
  });
  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`${cat}: HTTP ${res.status}`);
  const body = await res.json();
  const result = body?.result;
  if (!result || String(result.status) !== '200') throw new Error(`${cat}: APIエラー ${JSON.stringify(result?.message ?? result ?? body).slice(0, 200)}`);
  return (result.items ?? []).map((it) => toWork(it, cat));
}

function pickMovie(m) {
  if (!m) return null;
  return m.size_720_480 || m.size_644_414 || m.size_560_360 || m.size_476_306 || null;
}

function toWork(it, cat) {
  const info = it.iteminfo ?? {};
  const names = (arr) => (arr ?? []).map((x) => x.name).filter(Boolean);
  return {
    id: it.content_id,
    title: it.title,
    prov: 'FANZA',
    cat,
    url: it.affiliateURL,                        // アフィリエイトID入りのリンク（APIが生成）
    image: it.imageURL?.large || it.imageURL?.list || null,
    sampleImages: it.sampleImageURL?.sample_s?.image?.slice(0, 6) ?? [],
    sampleMovie: pickMovie(it.sampleMovieURL),  // FANZAのプレイヤーURL（iframeで表示する）
    price: it.prices?.price ?? null,             // 例: "1980~"
    listPrice: it.prices?.list_price ?? null,
    campaign: it.campaign?.[0] ? { title: it.campaign[0].title, end: it.campaign[0].date_end } : null,
    actresses: names(info.actress),
    maker: names(info.maker)[0] ?? null,
    tags: names(info.genre).slice(0, 8),
    date: it.date ?? null,
    review: it.review ? { count: it.review.count, average: it.review.average } : null,
  };
}

try {
  const seen = new Set();
  const works = [];
  const counts = {};
  for (const q of QUERIES) {
    const items = await fetchItems(q);
    counts[q.cat] = items.length;
    for (const w of items) {
      if (!w.id || seen.has(w.id)) continue; // 複数カテゴリに出る作品は先に出たカテゴリ（NTR優先）に入れる
      seen.add(w.id);
      works.push(w);
    }
  }
  if (works.length === 0) throw new Error('作品が1件も取得できませんでした');
  await mkdir(dirname(OUT), { recursive: true });
  const out = { fetchedAt: new Date().toISOString(), source: 'DMM Affiliate API v3 ItemList (FANZA videoa)', counts, works };
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  const withMovie = works.filter((w) => w.sampleMovie).length;
  const withSale = works.filter((w) => w.campaign).length;
  console.log(`保存: ${works.length}作品（取得件数 ${JSON.stringify(counts)}）サンプル動画あり ${withMovie}・セール中 ${withSale}`);
  console.log('例:', works.slice(0, 3).map((w) => `${w.id} ${w.title.slice(0, 30)} ${w.price ?? ''}`).join(' | '));
} catch (e) {
  let kept = false;
  try { await readFile(OUT); kept = true; } catch {}
  console.error(`取得失敗: ${e.message}${kept ? '（既存データを残しました）' : ''}`);
  process.exit(1);
}

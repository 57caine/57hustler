// 一時調査: 楽天アフィリエイト新規ニッチ候補（A: ペット防災 / B: サイズ悩み系の靴）の市場集計。
// 楽天市場の商品検索API・ランキングAPI・ジャンル検索APIを叩き、結果をActionsログに出すだけ（サイト・データは変更しない）。
// 開発環境から楽天に直接アクセスできないため GitHub Actions 上で実行する。調査完了後に削除する。
import https from 'node:https';

const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = '5567171b.a80702dc.5567171c.a1d1b6fc'; // lens-navi と共通
const REFERER = 'https://lens-navi.jp/';
if (!APP_ID || !ACCESS_KEY) throw new Error('RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY is not set');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Referer: REFERER, Origin: REFERER.replace(/\/$/, '') } }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

async function call(base, params) {
  const qs = new URLSearchParams({ applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, format: 'json', formatVersion: '2', ...params });
  for (let attempt = 0; attempt < 4; attempt++) {
    await sleep(1100);
    const { status, body } = await get(`${base}?${qs}`);
    if (status === 429) { await sleep(3000 * (attempt + 1)); continue; }
    let data; try { data = JSON.parse(body); } catch { data = { raw: body.slice(0, 300) }; }
    return { status, data };
  }
  return { status: 429, data: { error: 'rate limited' } };
}

// --- エンドポイントの確認（新旧バージョンを順に試す） ---
const SEARCH_CANDIDATES = ['20260701', '20220601'].map((v) => `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/${v}`);
const RANKING_CANDIDATES = ['20220601'].map((v) => `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/${v}`);
const GENRE_CANDIDATES = ['20260401', '20170711', '20140222'].flatMap((v) => [
  `https://openapi.rakuten.co.jp/ichibagt/api/IchibaGenre/Search/${v}`,
  `https://openapi.rakuten.co.jp/ichibams/api/IchibaGenre/Search/${v}`,
]);

async function pick(label, candidates, params) {
  for (const base of candidates) {
    const r = await call(base, params);
    const ok = r.status === 200 && !r.data.error;
    console.log(`[endpoint] ${label} ${base} -> HTTP ${r.status}${ok ? '' : ' ' + JSON.stringify(r.data).slice(0, 200)}`);
    if (ok) return { base, sample: r.data };
  }
  return null;
}

const items = (d) => (d.Items || d.items || []).map((x) => x.Item || x);

const search = await pick('Search', SEARCH_CANDIDATES, { keyword: '犬 防災', hits: '3' });
const ranking = await pick('Ranking', RANKING_CANDIDATES, { genreId: '101213' });
const genre = await pick('Genre', GENRE_CANDIDATES, { genreId: '0' });
if (!search) throw new Error('商品検索APIに接続できませんでした');

const s0 = items(search.sample)[0] || {};
console.log('[fields] Search item keys:', Object.keys(s0).join(','));
console.log('[fields] Search affiliateRate sample:', s0.affiliateRate, 'itemPrice:', s0.itemPrice, 'pointRate:', s0.pointRate);
if (ranking) {
  const r0 = items(ranking.sample)[0] || {};
  console.log('[fields] Ranking item keys:', Object.keys(r0).join(','));
  console.log('[fields] Ranking affiliateRate sample:', r0.affiliateRate, 'title:', ranking.sample.title);
}

// --- ジャンルID（ペット・靴配下の子ジャンルを名前で特定） ---
const genreIds = { pet: '101213', shoes: '558885' };
async function children(id) {
  if (!genre) return [];
  const r = await call(genre.base, { genreId: id });
  const ch = r.data.children || [];
  if (id === '101213') console.log('[genre raw]', JSON.stringify(r.data).slice(0, 600));
  const list = ch.map((c) => c.child || c).map((c) => ({ id: String(c.genreId ?? c.id), name: c.genreName ?? c.name ?? c.nameJa ?? JSON.stringify(c).slice(0, 80) }));
  console.log(`[genre] ${id} ${JSON.stringify(r.data.current?.genreName || r.data.current || '')} children:`, list.map((c) => `${c.name}(${c.id})`).join(' / '));
  return list;
}
const petChildren = await children(genreIds.pet);
const shoeChildren = await children(genreIds.shoes);
for (const c of shoeChildren) await children(c.id); // レディース靴・メンズ靴 などの下位を確認
const findGenre = (list, re) => list.find((c) => re.test(c.name))?.id;
const dogGenre = findGenre(petChildren, /^犬/);
const catGenre = findGenre(petChildren, /^猫/);
const smallGenre = findGenre(petChildren, /小動物/);
const dogCh = dogGenre ? await children(dogGenre) : [];
const catCh = catGenre ? await children(catGenre) : [];
const smallCh = smallGenre ? await children(smallGenre) : [];

// --- 集計 ---
const BANDS = [[0, 1000], [1000, 3000], [3000, 5000], [5000, 10000], [10000, 20000], [20000, Infinity]];
const bandLabel = ([a, b]) => (b === Infinity ? `${a}円以上` : `${a}〜${b - 1}円`);
const median = (arr) => { if (!arr.length) return null; const s = [...arr].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const round = (n, d = 2) => (n == null ? null : Math.round(n * 10 ** d) / 10 ** d);

function summarize(label, list, totalCount) {
  const prices = list.map((i) => Number(i.itemPrice)).filter((n) => n > 0);
  const reviews = list.map((i) => Number(i.reviewCount) || 0);
  const withRev = list.filter((i) => Number(i.reviewCount) > 0);
  const avgs = withRev.map((i) => Number(i.reviewAverage));
  const rates = list.map((i) => Number(i.affiliateRate)).filter((n) => !Number.isNaN(n));
  const rateHist = {};
  for (const r of rates) rateHist[r] = (rateHist[r] || 0) + 1;
  const modeRate = Number(Object.entries(rateHist).sort((a, b) => b[1] - a[1])[0]?.[0]);
  const rewards = list.map((i) => Math.min(Math.floor(Number(i.itemPrice) * Number(i.affiliateRate) / 100), 1000)).filter((n) => !Number.isNaN(n));
  const up = list.filter((i) => Number(i.affiliateRate) > modeRate);
  const out = {
    label,
    totalCount: totalCount ?? null,
    sampled: list.length,
    priceMedian: median(prices),
    priceMin: prices.length ? Math.min(...prices) : null,
    priceMax: prices.length ? Math.max(...prices) : null,
    priceBands: Object.fromEntries(BANDS.map((b) => [bandLabel(b), prices.filter((p) => p >= b[0] && p < b[1]).length])),
    reviewCountMedian: median(reviews),
    reviewCountSum: reviews.reduce((a, b) => a + b, 0),
    itemsWithReviews: withRev.length,
    reviewAverageMean: avgs.length ? round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : null,
    affiliateRateHist: rateHist,
    rewardMedian: median(rewards),
    rewardMean: rewards.length ? Math.round(rewards.reduce((a, b) => a + b, 0) / rewards.length) : null,
    rewardCapped: rewards.filter((r) => r >= 1000).length,
    rateUpCount: up.length,
    rateUpExamples: up.slice(0, 3).map((i) => `${i.affiliateRate}% ${Number(i.itemPrice)}円 ${String(i.itemName).slice(0, 40)}`),
    top3: list.slice(0, 3).map((i) => `${Number(i.itemPrice)}円 レビュー${i.reviewCount}件(${i.reviewAverage}) 料率${i.affiliateRate}% ${String(i.itemName).slice(0, 40)}`),
  };
  console.log(`[summary] ${JSON.stringify(out)}`);
  return out;
}

async function searchSample(keyword, genreId, pages = 3) {
  const all = []; let count = null;
  for (let page = 1; page <= pages; page++) {
    const params = { hits: '30', page: String(page), sort: '-reviewCount', availability: '1' };
    if (keyword) params.keyword = keyword;
    if (genreId) params.genreId = genreId;
    const r = await call(search.base, params);
    if (r.status !== 200) { console.log(`[warn] search ${keyword} p${page} HTTP ${r.status} ${JSON.stringify(r.data).slice(0, 150)}`); break; }
    count = r.data.count ?? count;
    const got = items(r.data);
    all.push(...got);
    if (got.length < 30) break;
  }
  return summarize(`検索「${keyword || '(キーワードなし)'}」${genreId ? `(genre ${genreId})` : ''}`, all, count);
}

async function rankingSample(label, genreId, pages = 2) {
  if (!ranking) return null;
  const all = [];
  for (let page = 1; page <= pages; page++) {
    const r = await call(ranking.base, { genreId, page: String(page) });
    if (r.status !== 200) { console.log(`[warn] ranking ${genreId} p${page} HTTP ${r.status} ${JSON.stringify(r.data).slice(0, 150)}`); break; }
    all.push(...items(r.data));
  }
  return summarize(`ランキング ${label}(genre ${genreId})`, all, null);
}

async function countOnly(keyword, genreId) {
  const params = { keyword, hits: '1' };
  if (genreId) params.genreId = genreId;
  const r = await call(search.base, params);
  console.log(`[kw] ${keyword}\t${r.status === 200 ? r.data.count : 'HTTP ' + r.status}`);
}


console.log('\n===== A. 犬・猫・小動物別ランキング =====');
if (dogGenre) await rankingSample('犬用品', dogGenre);
if (catGenre) await rankingSample('猫用品', catGenre);
if (smallGenre) await rankingSample('小動物用品', smallGenre);

console.log('\n----- A. 備蓄消耗品（犬・猫・小動物別、ジャンル内の商品数と価格帯） -----');
const pickAll = (list, re) => list.filter((c) => re.test(c.name));
const stockTargets = [
  ['犬', dogCh], ['猫', catCh], ['小動物', smallCh],
];
for (const [animal, list] of stockTargets) {
  for (const [kind, re] of [['フード', /フード|ペレット|牧草|餌/], ['トイレ用品', /トイレ|床材|砂|シーツ|衛生/]]) {
    for (const g of pickAll(list, re)) {
      console.log(`[stock] ${animal} ${kind}: ${g.name}(${g.id})`);
      await searchSample('', g.id);
    }
  }
}
// 小動物は下位ジャンルがフード・トイレに分かれていない場合があるため、動物別の下位ジャンル名も出す
for (const g of smallCh) await children(g.id);

console.log('\n===== B. 靴 レディース・メンズ別ランキング =====');
for (const c of shoeChildren.filter((c) => /レディース|メンズ/.test(c.name))) await rankingSample(c.name, c.id);

console.log('\n===== 料率アップ商品の有無（APIの affiliateRate が4%以外になることがあるかの確認） =====');
const rateHist = {}; const highs = [];
async function rateScan(label, params) {
  for (let page = 1; page <= 3; page++) {
    const r = await call(search.base, { hits: '30', page: String(page), ...params });
    if (r.status !== 200) break;
    for (const i of items(r.data)) {
      const k = String(Number(i.affiliateRate)); rateHist[k] = (rateHist[k] || 0) + 1;
      if (Number(i.affiliateRate) > 4) highs.push(`${label}: ${i.affiliateRate}% ${Number(i.itemPrice)}円 ${i.shopName} ${String(i.itemName).slice(0, 40)}`);
    }
  }
}
for (const kw of ['ペット 防災', 'ペット キャリー', '犬 ケージ', 'ペットシーツ', 'キャットフード', '猫砂', 'ドッグフード', 'うさぎ 牧草', 'ハムスター 床材', 'パンプス 幅広', 'スニーカー 4E', '大きいサイズ 靴', '小さいサイズ 靴']) {
  await rateScan(kw, { keyword: kw, sort: '-affiliateRate' });
}
for (const kw of ['ペット', '靴']) await rateScan(`${kw}(標準順)`, { keyword: kw });
console.log('[rate] 料率の分布', JSON.stringify(rateHist));
console.log('[rate] 4%超の商品', highs.length ? '\n' + [...new Set(highs)].slice(0, 30).join('\n') : 'なし');
console.log('\n[done]');

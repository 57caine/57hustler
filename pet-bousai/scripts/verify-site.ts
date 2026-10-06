/**
 * 公開URL（またはローカルの next start）に実際にアクセスして、全ページを機械チェックする。
 *   npx tsx scripts/verify-site.ts <baseUrl> [--expect-index] [--expect-products]
 * 既定は「noindex であること」を確認する（--expect-index は独自ドメインでの公開承認後に使う）。
 * 1件でも問題があれば終了コード1。
 */

import { ARTICLES, INFO_PAGES } from '../lib/pages';

const base = (process.argv[2] ?? '').replace(/\/$/, '');
const expectIndex = process.argv.includes('--expect-index');
/** 公開環境では商品が実際に表示されていることも確認する */
const expectProducts = process.argv.includes('--expect-products');
if (!base) {
  console.error('usage: tsx scripts/verify-site.ts <baseUrl> [--expect-index]');
  process.exit(2);
}

/** 当サイトの文章として使わない表現（商品名は取得時に除外済みのため、ページ全体で確認する） */
const FORBIDDEN = ['効く', '防ぐ', '改善', 'No.1', 'NO.1', '1位', '１位', 'ランキング', '絶対', '必ず', 'これがないと', '人気', '最強', '必須'];

const problems: string[] = [];
const ng = (path: string, msg: string) => problems.push(`${path}: ${msg}`);

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ');
}

async function get(path: string) {
  const res = await fetch(base + path, { redirect: 'manual' });
  return { res, body: await res.text() };
}

async function checkPage(path: string, isArticle: boolean) {
  const { res, body } = await get(path);
  if (res.status !== 200) return ng(path, `HTTP ${res.status}`);

  const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g) ?? [];
  if (h1.length !== 1) ng(path, `h1 が ${h1.length} 個`);
  const robotsMeta = body.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  const xRobots = res.headers.get('x-robots-tag') ?? '';
  const canonical = body.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';

  if (expectIndex) {
    if (!/^index/.test(robotsMeta)) ng(path, `robots meta が index になっていない（${robotsMeta}）`);
    if (!canonical) ng(path, 'canonical がない');
  } else {
    if (!/noindex/.test(robotsMeta)) ng(path, `robots meta に noindex がない（${robotsMeta || 'なし'}）`);
    if (!/noindex/.test(xRobots)) ng(path, `X-Robots-Tag に noindex がない（${xRobots || 'なし'}）`);
  }
  if (/vercel\.app/.test(canonical)) ng(path, `canonical が vercel.app を指している（${canonical}）`);
  // GA4: gtag.js の先読み指定が1件、初期化（config）が1件であること（実際に読み込まれる数はスマホ確認で数える）
  const gaTags = (body.match(/<link rel="preload" href="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-KPE1LBHFW7"/g) ?? []).length;
  const gaConfig = (body.match(/gtag\('config','G-KPE1LBHFW7'\)/g) ?? []).length;
  if (gaTags !== 1 || gaConfig !== 1) ng(path, `GA4タグ（G-KPE1LBHFW7）: gtag.js ${gaTags}件・config ${gaConfig}件（各1件であるべき）`);

  if (path !== '/about' && path !== '/privacy' && path !== '/sources' && !body.includes('data-ad-notice')) ng(path, '広告表記がない');
  if (isArticle) {
    if (!body.includes('data-official-info')) ng(path, '公的情報の枠がない');
    if (!body.includes('https://www.env.go.jp/')) ng(path, '環境省の出典リンクがない');
    if (!body.includes('data-localgov-notice')) ng(path, '自治体差の注意がない');
  }

  // 楽天リンク: アフィリエイトURL（hb.afl）のみ・属性がそろっていること
  const anchors = body.match(/<a [^>]*href="https:\/\/[^"]*rakuten\.co\.jp[^"]*"[^>]*>/g) ?? [];
  let affiliate = 0;
  for (const a of anchors) {
    const href = a.match(/href="([^"]*)"/)?.[1] ?? '';
    if (href.startsWith('https://privacy.rakuten.co.jp/')) continue;
    if (!href.startsWith('https://hb.afl.rakuten.co.jp/')) { ng(path, `アフィリエイトでない楽天リンク: ${href.slice(0, 80)}`); continue; }
    affiliate++;
    const rel = a.match(/rel="([^"]*)"/)?.[1].split(/\s+/) ?? [];
    for (const r of ['sponsored', 'nofollow', 'noopener', 'noreferrer']) if (!rel.includes(r)) ng(path, `rel に ${r} がない: ${href.slice(0, 60)}`);
    if (!/target="_blank"/.test(a)) ng(path, 'target="_blank" がない');
    if (!/data-product-name="[^"]+"/.test(a)) ng(path, 'data-product-name がない');
    if (!/data-product-category="[^"]+"/.test(a)) ng(path, 'data-product-category がない');
  }

  if (expectProducts && body.includes('data-product-section')) {
    if (body.includes('data-products-empty')) ng(path, '商品が表示されていないグループがある');
    if (affiliate === 0) ng(path, '楽天リンクが0件');
    if (!body.includes('data-products-fetched')) ng(path, '商品情報の取得日の表示がない');
  }

  const text = visibleText(body);
  for (const w of FORBIDDEN) if (text.includes(w)) ng(path, `禁止表現「${w}」を含む`);
  if (/[￥¥]\s?\d|\d[\d,]*円/.test(text)) ng(path, '価格表示を含む');

  console.log(`OK? ${path.padEnd(20)} HTTP ${res.status} | robots="${robotsMeta}" | X-Robots-Tag="${xRobots}" | canonical="${canonical || 'なし'}" | GA4タグ ${gaTags}件 | 楽天リンク ${affiliate}件`);
}

async function main() {
  for (const p of ['/', ...ARTICLES.map((a) => a.path)]) await checkPage(p, p !== '/');
  for (const p of INFO_PAGES.map((a) => a.path)) await checkPage(p, false);

  const robots = await get('/robots.txt');
  console.log(`--- robots.txt (HTTP ${robots.res.status})\n${robots.body.trim()}`);
  if (!/Allow: \//.test(robots.body)) ng('/robots.txt', 'Allow: / がない');
  if (/Disallow: \/\s*$/m.test(robots.body)) ng('/robots.txt', '全体を Disallow している（noindex が読まれなくなる）');
  if (!expectIndex && /Sitemap:/i.test(robots.body)) ng('/robots.txt', 'noindex 中なのに Sitemap を記載している');

  const sm = await get('/sitemap.xml');
  const urls = sm.body.match(/<loc>[^<]*<\/loc>/g) ?? [];
  console.log(`--- sitemap.xml (HTTP ${sm.res.status}) URL ${urls.length}件`);
  urls.forEach((u) => console.log('  ' + u));
  if (urls.some((u) => /vercel\.app/.test(u))) ng('/sitemap.xml', 'vercel.app の URL を含む');
  if (expectIndex && urls.length !== ARTICLES.length + INFO_PAGES.length + 1) ng('/sitemap.xml', `URL数が想定と違う（${urls.length}）`);

  const nf = await get('/this-page-does-not-exist');
  if (nf.res.status !== 404) ng('/this-page-does-not-exist', `存在しないページが HTTP ${nf.res.status}`);

  console.log(problems.length ? `\n問題 ${problems.length}件:\n- ${problems.join('\n- ')}` : '\n問題なし');
  process.exit(problems.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

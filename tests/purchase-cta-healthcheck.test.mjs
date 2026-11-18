import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectPurchaseCtas, hasColumnComparisonLink, hasVerifiedColumnRevenuePath } from '../scripts/lib/inspect-purchase-ctas.mjs';
const label = 'このショップで1箱の価格を確認 →';
test('inactive serialized URLs and generic search links are not purchase CTAs', () => {
  assert.deepEqual(inspectPurchaseCtas(`<script>{"url":"https://px.a8.net/test","label":"${label}"}</script><a href="https://hb.afl.rakuten.co.jp/test" rel="sponsored">楽天で検索</a>`), {a8:0,rakuten:0});
});
test('mobile and desktop A8 anchors count, without accepting spoofed hosts or unsponsored links', () => {
  const html = `<a href="https://px.a8.net/test?a=1&amp;b=2" rel="noopener sponsored nofollow">${label}</a><a rel='sponsored' href='https://px.a8.net/test'>2箱セットの販売価格を確認 →</a><a href="https://px.a8.net.evil.test/" rel="sponsored">${label}</a><a href="https://px.a8.net/test">${label}</a>`;
  assert.deepEqual(inspectPurchaseCtas(html), {a8:2,rakuten:0});
});
test('detects accidentally enabled Rakuten purchase CTA', () => {
  assert.deepEqual(inspectPurchaseCtas(`<a href="https://hb.afl.rakuten.co.jp/test" rel="sponsored">${label}</a>`), {a8:0,rakuten:1});
});

test('article comparison detection accepts new labels and markup at the expected destination', () => {
  for (const href of ['/category/1day', 'https://www.lens-navi.jp/category/1day?utm_source=test']) {
    assert.equal(hasColumnComparisonLink('<article><a href="'+href+'"><span>ワンデーの価格を比較する →</span></a></article>'), true);
  }
});
test('missing, unrelated or spoofed links and navigation-only anchors fail', () => {
  for (const html of [
    '<nav><a href="/category/1day">比較</a></nav><article>リンクなし</article>',
    '<article><script>const x = \'<a href="/category/1day">比較</a>\';</script></article>',
    '<article><!-- <a href="/category/1day">比較</a> --></article>',
    ...['#','/category/2week','https://evil.test/category/1day','https://www.lens-navi.jp.evil.test/category/1day','http://www.lens-navi.jp/category/1day'].map(href=>'<article><a href="'+href+'">比較</a></article>'),
    '<article><a>比較</a><a href="/category/1day"></a></article>',
    '<article>自分に合うコンタクトレンズを比較する 掲載商品を比較する</article>'
  ]) assert.equal(hasColumnComparisonLink(html), false, html);
});

const article = '<article><a href="/category/1day">ワンデーの価格を比較する</a></article>';
const destination = (anchor) => ({ http: 200, html: '<html><script>affiliate_click</script>' + anchor + '</html>' });
const affiliateAnchor = '<a href="https://px.a8.net/test" rel="sponsored noopener">販売価格を確認</a>';
test('approved article flow reaches rendered sponsored A8 or Rakuten anchors without a direct article affiliate link', () => {
  for (const host of ['px.a8.net', 'hb.afl.rakuten.co.jp', 'afl.rakuten.co.jp']) {
    assert.equal(hasVerifiedColumnRevenuePath(article, destination(affiliateAnchor.replace('px.a8.net', host))), true);
  }
});
test('comparison route requires successful HTML, tracking, affiliate anchor and article link', () => {
  const good = destination(affiliateAnchor);
  for (const bad of [
    undefined, { ...good, http: undefined }, { ...good, http: NaN },
    ...[199, 301, 403, 404, 500].map(http => ({ ...good, http })),
    { http: 200, html: undefined }, { ...good, html: good.html.replace('<html>', '') },
    { ...good, html: good.html.replace('affiliate_click', '') }, destination(''),
  ]) assert.equal(hasVerifiedColumnRevenuePath(article, bad), false);
  assert.equal(hasVerifiedColumnRevenuePath('<nav><a href="/category/1day">比較</a></nav><article>なし</article>', good), false);
});
test('serialized, commented, spoofed, insecure and unsponsored affiliate anchors cannot establish revenue path', () => {
  for (const anchor of [
    '<script>' + affiliateAnchor + '</script>', '<!--' + affiliateAnchor + '-->',
    affiliateAnchor.replace('px.a8.net', 'px.a8.net.evil.test'),
    affiliateAnchor.replace('https:', 'http:'),
    affiliateAnchor.replace('px.a8.net', 'user@px.a8.net'),
    affiliateAnchor.replace('px.a8.net', 'px.a8.net:8443'),
    affiliateAnchor.replace('sponsored noopener', 'noopener'),
    affiliateAnchor.replace('販売価格を確認', ''),
  ]) assert.equal(hasVerifiedColumnRevenuePath(article, destination(anchor)), false, anchor);
});

test('live checker wiring passes comparison flow but fails unavailable or affiliate-less destinations', async () => {
  const { spawnSync } = await import('node:child_process');
  const checker = new URL('../scripts/check-lens-revenue-path.mjs', import.meta.url).href;
  for (const scenario of ['healthy', 'unavailable', 'serialized-only']) {
    const fixture = {
      article: '<html><script>affiliate_click</script>' + article + '</html>',
      category: destination(scenario === 'serialized-only' ? '<script>' + affiliateAnchor + '</script>' : affiliateAnchor).html,
      other: '<html><script>affiliate_click</script>' + affiliateAnchor + '購入前に確認すること 商品比較</html>',
      bc: '<html>https://www.lens-navi.jp/bc/8.4 価格を比較 <a href="/product/test">商品</a> BC8.4という数字だけで商品を決めず</html>',
    };
    const source = 'const fixture = ' + JSON.stringify(fixture) + ';' +
      'globalThis.fetch = async input => { const url = new URL(input);' +
      'if (url.origin !== "https://lens-navi.jp") throw new Error("unexpected external request");' +
      'const path = url.pathname; const isCategory = path === "/category/1day";' +
      'const status = isCategory && ' + JSON.stringify(scenario) + ' === "unavailable" ? 503 : 200;' +
      'return { status, ok: status === 200, text: async () => isCategory ? fixture.category : path.startsWith("/column/") ? fixture.article : path.startsWith("/bc/") ? fixture.bc : fixture.other }; };' +
      'await import(' + JSON.stringify(checker) + ');';
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      encoding: 'utf8', env: { ...process.env, LENS_BASE_URL: 'https://lens-navi.jp', GITHUB_STEP_SUMMARY: '' },
    });
    assert.equal(result.status, scenario === 'healthy' ? 0 : 1, result.stdout + result.stderr);
    assert.equal(result.stdout.includes('COMPARISON_REVENUE_PATH:'), scenario !== 'healthy');
  }
});

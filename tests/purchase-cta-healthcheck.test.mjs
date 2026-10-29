import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectPurchaseCtas, hasColumnComparisonLink } from '../scripts/lib/inspect-purchase-ctas.mjs';
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

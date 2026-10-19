import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectPurchaseCtas } from '../scripts/lib/inspect-purchase-ctas.mjs';
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

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const root = process.cwd();
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  cache.set(file, module.exports);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(id => {
    if (!id.startsWith('@/')) return require(id);
    const target = path.join(root, id.slice(2));
    return target.endsWith('.json') ? JSON.parse(readFileSync(target, 'utf8')) : load(target + '.ts');
  }, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
const { getPricesForProduct } = load(path.join(root, 'lib/products.ts'));
const Component = load(path.join(root, 'components/ProductAnnualCost.tsx')).default;
function render(storeId, productId = 'acuvue-moist-1day-astig') {
  const offer = getPricesForProduct(productId).find(p => p.storeId === storeId);
  assert.ok(offer, `${productId}/${storeId} fixture exists`);
  return { offer, html: renderToStaticMarkup(React.createElement(Component, {
    prices: [offer], category: '1day', productName: '検証商品',
  })) };
}
test('unverified Rakuten search retains estimate but has no purchase anchor', () => {
  const { html } = render('rakuten');
  assert.match(html, /購入リンクは確認中/);
  assert.match(html, /12か月総額目安/);
  assert.doesNotMatch(html, /<a\b/);
});
test('verified A8 detail preserves the exact existing destination and sponsored attribute', () => {
  const { html, offer } = render('at-lens');
  assert.match(html, /販売価格・購入条件を確認/);
  assert.ok(html.includes((offer.url + offer.store.affiliateParam).replaceAll('&', '&amp;')));
  assert.match(html, /rel="noopener noreferrer sponsored nofollow"/);
  assert.doesNotMatch(html, /購入リンクは確認中/);
});
test('existing tracked annual bundle remains available', () => {
  const { html } = render('at-lens', 'acuvue-oasys-1day');
  assert.match(html, /360日分セットの販売価格を確認/);
  assert.match(html, /K_JJ_OA90Z0_08_H/);
  assert.match(html, /365日使う場合は不足分/);
  assert.doesNotMatch(html, /購入リンクは確認中/);
});

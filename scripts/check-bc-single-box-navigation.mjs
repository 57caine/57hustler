#!/usr/bin/env node
// Static guard for BC comparison's single-box navigation. No network or purchases.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const bc = fs.readFileSync('app/bc/[value]/page.tsx', 'utf8');
const product = fs.readFileSync('app/product/[slug]/page.tsx', 'utf8');
assert.match(bc, /singleBoxOffers\.length > 0 && \(/, 'Single-box CTA must only appear when single-box offers exist');
assert.match(bc, /1箱の価格を見る/, 'Single-box CTA label missing');
assert.match(bc, /#price-comparison/, 'Single-box CTA must target price comparison');
assert.match(product, /id="price-comparison"/, 'Product price comparison target missing');
assert.match(bc, /annual-cost/, 'Existing annual comparison must remain');
console.log('BC single-box navigation static checks passed');

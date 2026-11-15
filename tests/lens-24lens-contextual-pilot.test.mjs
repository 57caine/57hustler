import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('../app/column/[slug]/page.tsx',import.meta.url),'utf8');
test('24lens pilot appears only on high-intent contact buying guides',()=>{
  assert.match(source,/\['contact-tsuuhan-shohosen-nashi-kanzen-guide', 'contact-net-kounyu-guide'\]\.includes\(slug\)/);
  assert.match(source,/24lens-order-check\/\?utm_source=lens_navi/);
  assert.match(source,/utm_content=\$\{slug\}/);
});
test('preserve existing purchase comparison calls to action',()=>{
  assert.match(source,/<Link href="\/category\/1day" data-growth-event="comparison_navigation" data-growth-source="column_purchase_guide"/);
  assert.match(source,/2ウィークを比較/);
});
test('pilot is editorial navigation and does not directly rewrite affiliate links',()=>{
  assert.match(source,/data-growth-event="comparison_navigation"/);
  assert.match(source,/data-growth-source="24lens_contextual_guide"/);
  assert.match(source,/rel="noopener noreferrer"/);
  const pilot=source.match(/<aside aria-label="24レンズの送料・購入条件ガイド"[\s\S]*?<\/aside>/)?.[0];
  assert.ok(pilot);
  assert.doesNotMatch(pilot,/px\.a8\.net|rel="[^"]*sponsored/);
});

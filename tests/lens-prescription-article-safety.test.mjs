import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../lib/columns.tsx',import.meta.url),'utf8');
const start=src.indexOf("  'contact-tsuuhan-shohosen-nashi-kanzen-guide': (");
const end=src.indexOf("  'lenszero-kaigai-tsuuhan-guide-2026': (",start);
const body=src.slice(start,end);
test('prescription article no longer recommends bypassing eye care or inferring lens power',()=>{
 assert.ok(start>0 && end>start);
 for(const term of ['重要な抜け穴','眼鏡の度数が-3.00Dの場合','翌日配送に対応','度数情報さえあれば購入に問題']) assert.ok(!body.includes(term),term);
 assert.match(body,/眼科医の診断と指示/);
 assert.match(body,/眼科で適した製品と規格/);
});
test('preserve comparison and cite primary medical and store sources',()=>{
 for(const fragment of ['/category/1day','/category/2week','https://www.jcla.gr.jp/purchase/','https://www.24lens.jp/howto/payment/','https://www.24lens.jp/howto/kounyu/']) assert.ok(body.includes(fragment),fragment);
 assert.match(body,/税込550円/);assert.match(body,/税込10,000円/);
});
test('metadata updated while preserving indexed path',()=>{
 assert.match(src,/slug: 'contact-tsuuhan-shohosen-nashi-kanzen-guide'/);
 assert.match(src,/updatedAt: '2026-11-15'/);
});

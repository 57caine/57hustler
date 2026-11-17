import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const hero=readFileSync('components/home/HeroSection.tsx','utf8');
test('home hero presents concrete price-comparison value and two trusted comparison routes',()=>{
 assert.match(hero,/1箱の価格・年間コスト・購入先で比較/);
 assert.match(hero,/href="\/category\/1day"/);
 assert.match(hero,/href="\/category\/2week"/);
 assert.match(hero,/ワンデーの1箱価格・購入先を比較/);
 assert.match(hero,/2ウィークの価格も比較/);
 assert.match(hero,/眼科で確認した製品/);
 assert.doesNotMatch(hero,/今すぐ購入|必ず安く|最安値保証/);
});

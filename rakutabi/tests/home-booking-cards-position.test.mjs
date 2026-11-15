import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
test('hotel choices appear before general theme and season navigation',()=>{
 const offers=code.indexOf('写真とクチコミから温泉宿を選ぶ');
 const themes=code.indexOf('{/* 人気のテーマ */}');
 const seasons=code.indexOf('{/* 季節のおすすめ特集 */}');
 assert.ok(offers>0 && offers<themes && themes<seasons);
});
test('keep existing hotel reservation cards and pricing safeguards',()=>{
 assert.match(code,/getHotelsByTheme\('onsen'\)\.filter/);
 assert.match(code,/pickup\.map\(\(h\) => <HotelCard key={h.hotelNo} hotel={h} \/>\)/);
 assert.match(code,/宿泊料金・空室状況は予約先で確認してください/);
 assert.equal((code.match(/写真とクチコミから温泉宿を選ぶ/g)||[]).length,1);
 assert.match(code,/TravelTopButton label="楽天トラベルで予約する"/);
});

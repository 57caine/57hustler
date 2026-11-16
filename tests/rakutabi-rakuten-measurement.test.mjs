import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {validateHotelBookingLink,measurementRow} from '../scripts/lib/rakutabi-rakuten-measurement.mjs';
const posts=JSON.parse(readFileSync('data/rakutabi-threads-hotel-posts.json','utf8')).posts.filter(p=>p.day>=25&&p.day<=39);
test('every December hotel booking points to its own canonical Rakuten Travel hotel',()=>{
 assert.equal(posts.length,15);
 const ids=new Set();
 for(const p of posts){
  assert.equal(validateHotelBookingLink(p.bookingUrl,p.hotelNo),p.bookingUrl);
  const row=measurementRow(p);
  assert.equal(row.officialIdStatus,'not_verified');
  assert.match(row.proposedMeasurementId,/^rkt(2[5-9]|3[0-9])$/);
  assert.ok(!ids.has(row.proposedMeasurementId));
  ids.add(row.proposedMeasurementId);
 }
});
test('cannot attribute an unrelated hotel or a modified external URL',()=>{
 const p=posts[0];
 for(const [url,id] of [
  [p.bookingUrl,p.hotelNo+1],
  [p.bookingUrl.replace('hb.afl.rakuten.co.jp','evil.example.com'),p.hotelNo],
  [p.bookingUrl.replace('travel.rakuten.co.jp','evil.example.com'),p.hotelNo],
  [p.bookingUrl.split('?')[0],p.hotelNo],
  [p.bookingUrl.replace('https://hb.afl','http://hb.afl'),p.hotelNo]
 ])assert.throws(()=>validateHotelBookingLink(url,id));
});
test('audit does not claim an official measurement ID has been created',()=>{
 const r=spawnSync(process.execPath,['scripts/audit-rakutabi-rakuten-links.mjs'],{encoding:'utf8',env:{PATH:process.env.PATH}});
 assert.equal(r.status,0,r.stderr);
 const data=JSON.parse(r.stdout);
 assert.equal(data.status,'official_tracking_ids_not_yet_issued_or_verified');
 assert.equal(data.hotelCount,15);
 assert.equal(data.validExistingAffiliateLinks,15);
 assert.equal(data.proposedIds.length,15);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {matchRakutabiPost,parseMediaInsights} from '../scripts/lib/rakutabi-insights.mjs';
const posts=JSON.parse(readFileSync('data/rakutabi-threads-hotel-posts.json','utf8')).posts;
test('all 15 December captions map to a distinct campaign without internal marker',()=>{
 const x=posts.filter(p=>p.day>=25&&p.day<=39);
 assert.equal(x.length,15);
 for(const p of x){
  const matched=matchRakutabiPost({text:'【PR】 '+p.caption},posts);
  assert.equal(matched?.day,p.day);
  assert.equal(matched?.hotelNo,p.hotelNo);
 }
 assert.equal(matchRakutabiPost({text:'Unknown'},posts),null);
 assert.equal(matchRakutabiPost({text:'【PR】 unrelated'},posts),null);
});
test('old-format marker still matches previously published campaigns',()=>{
 const p=posts.find(p=>p.day===16);
 assert.equal(matchRakutabiPost({text:'【PR】 '+p.caption+'\\n【宿番号 '+p.hotelNo+'・企画'+p.day+'】'},posts)?.day,16);
});
test('missing metrics remain unknown rather than fabricated zeros',()=>{
 const v=parseMediaInsights({data:[{name:'views',values:[{value:10}]},{name:'likes',values:[{value:0}]}]});
 assert.equal(v.views,10);
 assert.equal(v.likes,0);
 assert.equal(v.replies,null);
 assert.equal(v.shares,null);
 assert.throws(()=>parseMediaInsights({}));
});
test('no credentials results in an explicit no-data snapshot, never a post',()=>{
 const r=spawnSync(process.execPath,['scripts/rakutabi-threads-insights.mjs'],{encoding:'utf8',env:{PATH:process.env.PATH,RAKUTABI_INSIGHTS_OUTPUT:'/tmp/rakutabi-insights-test-'+process.pid+'.json'}});
 assert.equal(r.status,0,r.stderr);
 assert.match(r.stdout,/"status":"not_configured"/);
 assert.doesNotMatch(r.stdout,/access_token|Bearer /);
});

test('new disclosure format matches campaign and planned slot without inventing affiliate results',async()=>{
 const {measurementForPost}=await import('../scripts/lib/threads-slot-measurement.mjs');
 for(const p of posts){assert.equal(matchRakutabiPost({text:p.caption+'\n\n【広告】'},posts)?.day,p.day);}
 assert.equal(matchRakutabiPost({text:'Unknown\n\n【広告】'},posts),null);
 const row=measurementForPost('rakutabi',24);
 assert.equal(row.slot,'lunch');assert.equal(row.plannedJst,'12:30');assert.equal(row.date,'2026-11-29');
 assert.equal(measurementForPost('rakutabi',25).plannedJst,'20:30');
 assert.equal(measurementForPost('lens',18).plannedJst,'12:15');assert.equal(measurementForPost('lens',19).plannedJst,'21:15');
 assert.equal(row.confirmedCommissionJPY,null);assert.equal(row.orders,null);assert.equal(row.affiliateClicks,null);
});

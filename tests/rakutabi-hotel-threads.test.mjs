import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const run=(day,...args)=>spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day',String(day),...args],{encoding:'utf8',env:{...process.env,ENABLE_ORGANIC_THREADS_PUBLISH:'false'}});
test('day16 has three independently licensed photos and booking reply content',()=>{
 const r=run(16);
 assert.equal(r.status,0,r.stderr);
 const v=JSON.parse(r.stdout);
 assert.equal(v.mode,'dry-run');
 assert.equal(v.hotelNo,2013);
 assert.equal(v.photos.length,3);
 assert.deepEqual(v.photos.map(p=>p.rights.owner),['Volfgang','Kounosu','Morio']);
 assert.ok(v.photos.every(p=>p.rights.license && p.rights.proofUrl && p.rights.scope.includes('Threads')));
 assert.ok(v.photoCredits.some(text=>text.includes('Kounosu')));
 assert.ok(v.photoCredits.every(text=>text.length<=500));
 assert.match(v.reply,/【PR】.*ホテルニューグランド/);
 assert.match(v.reply,/hb\.afl\.rakuten\.co\.jp/);
 assert.ok(v.photos.every(p=>p.url.includes('upload.wikimedia.org')));
 assert.equal(v.nearbySources.length,2);
});
test('publishing remains disabled without authorized credentials',()=>{
 const r=run(16,'--publish');
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/Publish not authorized/);
});
test('day17 refuses old text-only fallback when no hotel campaign is verified',()=>{
 const r=run(17);
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/No verified hotel-image campaign/);
 assert.doesNotMatch(r.stdout,/荷物を預けて/);
});

test('photo counts: zero skips, one is IMAGE, two through six are CAROUSEL, seven rejected',async()=>{
 const {selectPhotoMedia}=await import('../scripts/lib/rakutabi-photo-policy.mjs');
 assert.equal(selectPhotoMedia([]),'SKIP');
 assert.equal(selectPhotoMedia([1]),'IMAGE');
 for(const n of [2,3,4,5,6]) assert.equal(selectPhotoMedia(Array(n).fill(1)),'CAROUSEL');
 assert.throws(()=>selectPhotoMedia(Array(7).fill(1)),/Maximum 6/);
 assert.throws(()=>selectPhotoMedia(null),/array/);
});

test('six photos fit in multiple copyright replies when required',async()=>{
 const {photoCreditMessages}=await import('../scripts/lib/rakutabi-photo-policy.mjs');
 const photos=Array.from({length:6},(_,i)=>({
  rights:{owner:'Photographer '+i,license:'CC BY-SA 4.0',proofUrl:'https://commons.wikimedia.org/wiki/File:Hotel_photo_'+i+'.jpg',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}
 }));
 const replies=photoCreditMessages(photos);
 assert.ok(replies.length>=2);
 assert.ok(replies.every(reply=>reply.length<=500));
 for(let i=0;i<6;i++)assert.ok(replies.some(reply=>reply.includes('Photographer '+i)));
});

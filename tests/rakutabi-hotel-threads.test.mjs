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

test('day18 Tokyo Station Hotel has three licensed station-area photographs and direct booking reply',()=>{
 const r=run(18);
 assert.equal(r.status,0,r.stderr);
 const v=JSON.parse(r.stdout);
 assert.equal(v.mode,'dry-run');
 assert.equal(v.hotelNo,137869);
 assert.equal(v.mediaType,'CAROUSEL');
 assert.equal(v.photos.length,3);
 assert.deepEqual(v.photos.map(p=>p.rights.owner),['Kakidai','MaedaAkihiko','RuinDig / Yuki Uchida']);
 assert.ok(v.photos.every(p=>p.rights.scope.includes('Threads') && p.rights.proofUrl.startsWith('https://commons.wikimedia.org/wiki/File:')));
 assert.ok(v.photos.every(p=>p.url.startsWith('https://upload.wikimedia.org/wikipedia/commons/')));
 assert.ok(v.photoCredits.every(p=>p.length<=500));
 assert.match(v.caption,/客室写真ではありません/);
 assert.match(v.reply,/東京ステーションホテル/);
 assert.match(v.reply,/HOTEL%2F137869%2F137869.html/);
 assert.equal(v.nearbySources.length,2);
});
test('day18 does not publish when authorization flag is absent',()=>{
 const r=run(18,'--publish');
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/Publish not authorized/);
});

test('day17 Fujiya Hotel has licensed 3-photo carousel and affiliate hotel reply',()=>{
 const r=run(17);
 assert.equal(r.status,0,r.stderr);
 const v=JSON.parse(r.stdout);
 assert.equal(v.mode,'dry-run');
 assert.equal(v.hotelNo,1727);
 assert.equal(v.photos.length,3);
 assert.equal(v.mediaType,'CAROUSEL');
 assert.ok(v.photos.every(p=>p.rights.proofUrl && p.rights.licenseUrl && p.rights.scope.includes('Threads')));
 assert.match(v.caption,/現在の客室や宿泊プランを示す画像ではありません/);
 assert.match(v.reply,/HOTEL%2F1727%2F1727.html/);
 assert.ok(v.photoCredits.every(c=>c.length<=500));
});

test('public hotel captions do not expose internal identifiers or verbose photo rights boilerplate',()=>{
 for(const day of [16,17,18]){
  const r=run(day);
  assert.equal(r.status,0,r.stderr);
  const v=JSON.parse(r.stdout);
  assert.doesNotMatch(v.caption,/【宿番号\\s*\\d+・企画\\d+】/);
  assert.doesNotMatch(v.caption,/写真3枚の撮影者・出典と利用条件は予約案内の返信に記載/);
  assert.ok(v.photoCredits.length>=1);
  assert.ok(v.photoCredits.some(x=>x.includes('写真出典・ライセンス')));
 }
});

test('all fifteen December hotel posts have distinct destinations, rights-backed media and valid booking replies', () => {
 const ids=new Set();
 const photos=new Set();
 for(let day=25;day<=39;day++){
  const r=run(day);
  assert.equal(r.status,0,'day '+day+' '+r.stderr);
  const v=JSON.parse(r.stdout);
  assert.equal(v.mode,'dry-run');
  assert.ok(Number.isInteger(v.hotelNo));
  assert.ok(!ids.has(v.hotelNo),'duplicate hotel '+v.hotelNo);
  ids.add(v.hotelNo);
  assert.ok(v.photos.length>=1&&v.photos.length<=6);
  assert.equal(v.mediaType,v.photos.length===1?'IMAGE':'CAROUSEL');
  assert.match(v.caption,/^【PR】 /);
  assert.doesNotMatch(v.caption,/【宿番号|企画\d+|撮影者・出典と利用条件は予約案内/);
  assert.match(v.reply,/hb\.afl\.rakuten\.co\.jp/);
  assert.match(decodeURIComponent(v.reply),new RegExp('HOTEL/'+v.hotelNo+'/'+v.hotelNo+'\\.html'));
  assert.ok(v.nearbySources.length>=2);
  assert.ok(v.photos.every(p=>p.rights.scope.includes('Threads')&&p.rights.proofUrl.startsWith('https://commons.wikimedia.org/wiki/File:')&&p.rights.licenseUrl.startsWith('https://creativecommons.org/')));
  assert.ok(v.photos.every(p=>p.url.startsWith('https://upload.wikimedia.org/wikipedia/commons/')&&/\.(jpg|jpeg|JPG|JPEG)$/i.test(p.url)));
  assert.ok(v.photos.every(p=>p.rights.owner&&p.rights.changes));
  assert.ok(v.photoCredits.length>=1&&v.photoCredits.every(s=>s.length<=500));
  for(const p of v.photos){assert.ok(!photos.has(p.url));photos.add(p.url);}
 }
 assert.equal(ids.size,15);
});
test('Dec 2, 16 and 30 scheduled posts remain fail-closed without authorized posting credentials',()=>{
 for(const day of [25,32,39]){
  const r=run(day,'--publish');
  assert.notEqual(r.status,0);
  assert.match(r.stderr,/Publish not authorized/);
 }
});

test('five redesigned December slots feature boutique / apartment-style stays, never business chains',async()=>{
 const doc=JSON.parse((await import('node:fs')).readFileSync('data/rakutabi-threads-hotel-posts.json','utf8'));
 const wanted=[27,29,32,35,39];
 for(const day of wanted){
  const post=doc.posts.find(p=>p.day===day);
  assert.equal(post.experimentGroup,'design_stay');
  assert.doesNotMatch(post.hotelName,/スーパーホテル|アパホテル|ドーミーイン/);
  assert.ok(post.caption.length<460);
  assert.ok(post.photos.length>=1&&post.photos.length<=6);
  assert.ok(post.nearbySources.some(s=>s.url.includes('travel.rakuten.co.jp')));
  const r=run(day);
  assert.equal(r.status,0,r.stderr);
  const v=JSON.parse(r.stdout);
  assert.equal(v.photos.length,post.photos.length);
  assert.match(decodeURIComponent(v.reply),new RegExp('HOTEL/'+post.hotelNo+'/'+post.hotelNo+'\\.html'));
 }
 assert.equal(doc.posts.filter(p=>p.day>=25&&p.day<=39).length,15);
});
test('all December posts meet the owner room-first editorial criteria; no generic business chains or prestige-first labels',async()=>{
 const {readFileSync}=await import('node:fs');
 const posts=JSON.parse(readFileSync('data/rakutabi-threads-hotel-posts.json','utf8')).posts.filter(p=>p.day>=25&&p.day<=39);
 assert.equal(posts.length,15);
 assert.equal(posts.filter(p=>p.experimentGroup==='design_stay').length,15);
 const ids=new Set(posts.map(p=>p.hotelNo));assert.equal(ids.size,15);
 const revised=[25,26,28,30,31,33,34,36,37,38];
 for(const day of revised){
  const p=posts.find(p=>p.day===day);
  assert.ok(p.designFocus==='room_first'||p.designFocus==='interior_common_space');
  assert.doesNotMatch(p.hotelName,/スーパーホテル|アパホテル|ドーミーイン|ホテルニューオータニ|The Okura Tokyo|日光金谷ホテル/);
  assert.ok(p.photos.length>=1&&p.photos.length<=6);
  const res=run(day);assert.equal(res.status,0,res.stderr);
  const v=JSON.parse(res.stdout);
  assert.equal(v.hotelNo,p.hotelNo);
  assert.equal(v.photos.length,p.photos.length);
  assert.match(decodeURIComponent(v.reply),new RegExp('HOTEL/'+p.hotelNo+'/'+p.hotelNo+'\\.html'));
 }
});

test('all December captions discuss the stay without photo metadata or management notes',async()=>{
 const {readFileSync}=await import('node:fs');
 const posts=JSON.parse(readFileSync('data/rakutabi-threads-hotel-posts.json','utf8')).posts.filter(p=>p.day>=25&&p.day<=39);
 assert.equal(posts.length,15);
 for(const p of posts){
   assert.doesNotMatch(p.caption,/📷|写真は|撮影|客室.*ではありません|著作者|ライセンス|【宿番号|企画\\d+/);
   assert.ok(p.caption.length>=65&&p.caption.length<460);
   const out=run(p.day);
   assert.equal(out.status,0,out.stderr);
   const pub=JSON.parse(out.stdout);
   assert.doesNotMatch(pub.caption,/📷|撮影|著作者|ライセンス|【宿番号/);
   assert.ok(pub.photoCredits.length>=1,'credits remain in separate replies');
   assert.ok(pub.reply.includes('https://hb.afl.rakuten.co.jp/'));
 }
});

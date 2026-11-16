import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateImageResponse,validateMediaSource} from '../scripts/lib/rakutabi-media-preflight.mjs';
const data=JSON.parse(readFileSync('data/rakutabi-threads-hotel-posts.json','utf8'));
test('all December hotel images have a valid independent host and attribution metadata',()=>{
 const posts=data.posts.filter(x=>x.day>=25&&x.day<=39);
 assert.equal(posts.length,15);
 assert.equal(posts.reduce((n,p)=>n+p.photos.length,0),31);
 for(const p of posts)for(const photo of p.photos)assert.ok(validateMediaSource(photo).startsWith('https://upload.wikimedia.org/wikipedia/commons/'));
});
test('a missing image response is never silently treated as good',()=>{
 for(const [status,mime,expected] of [[200,'image/jpeg','ok'],[206,'image/jpeg','ok'],[200,'text/html','unavailable'],[404,'image/jpeg','unavailable'],[429,'text/plain','unavailable'],[200,null,'unavailable']])assert.equal(evaluateImageResponse(status,mime),expected);
});
test('only expected image host accepted',()=>{
 const valid=data.posts.find(x=>x.day===25).photos[0];
 for(const url of ['https://upload.wikimedia.org.evil.test/wikipedia/commons/a.jpg','http://upload.wikimedia.org/wikipedia/commons/a.jpg','https://upload.wikimedia.org/fake/a.jpg']){
  assert.throws(()=>validateMediaSource({...valid,url}));
 }
});

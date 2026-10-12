import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const posts=JSON.parse(readFileSync('data/organic-threads-posts-20261013.json','utf8')).posts;
test('six safe and unique organic drafts',()=>{
 assert.equal(posts.length,6);
 assert.equal(new Set(posts.map(p=>p.brand+':'+p.day)).size,6);
 for(const p of posts){
  assert.ok(['rakutabi','lens'].includes(p.brand));
  assert.ok([1,2,3].includes(p.day));
  assert.ok(p.text.length>0 && p.text.length<=500);
  assert.ok(!p.text.includes('http'));
  assert.ok(!p.text.includes('【PR】'));
 }
});
test('all six drafts dry-run without credentials',()=>{
 for(const p of posts){
  const r=spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand',p.brand,'--day',String(p.day)],{encoding:'utf8',env:{}});
  assert.equal(r.status,0,r.stderr);
  const out=JSON.parse(r.stdout);
  assert.equal(out.mode,'dry-run');
  assert.equal(out.message,p.text);
 }
});
test('publish is disabled without explicit switch',()=>{
 const r=spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day','1','--publish'],{encoding:'utf8',env:{}});
 assert.notEqual(r.status,0);
 assert.ok(r.stderr.includes('Publishing not authorized'));
});

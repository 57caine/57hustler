import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {buildOrganicMessage,isOrganicDuplicate} from '../scripts/lib/organic-threads-message.mjs';
const posts=JSON.parse(readFileSync('data/organic-threads-posts-20261013.json','utf8')).posts;
test('safe and unique organic drafts',()=>{
 assert.equal(posts.length,22);
 assert.equal(new Set(posts.map(p=>p.text)).size,posts.length);
 assert.equal(new Set(posts.map(p=>p.brand+':'+p.day)).size,posts.length);
 for(const p of posts){
  assert.ok(['rakutabi','lens'].includes(p.brand));
  assert.ok(Number.isInteger(p.day) && p.day>=1 && p.day<=11);
  assert.ok(p.text.length>0 && p.text.length<=500);
  assert.ok(!p.text.includes('http'));
  assert.ok(!p.text.includes('【PR】'));
 }
});
test('all drafts dry-run without credentials',()=>{
 for(const p of posts){
  const r=spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand',p.brand,'--day',String(p.day)],{encoding:'utf8',env:{}});
  assert.equal(r.status,0,r.stderr);
  const out=JSON.parse(r.stdout);
  assert.equal(out.mode,'dry-run');
  if(p.url){assert.ok(out.message.startsWith('【PR】\n'));assert.ok(out.message.includes(p.text));assert.ok(out.message.endsWith(p.url));assert.ok(out.message.length<=500);}else{assert.equal(out.message,p.text);}
 }
});
test('publish is disabled without explicit switch',()=>{
 const r=spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day','1','--publish'],{encoding:'utf8',env:{}});
 assert.notEqual(r.status,0);
 assert.ok(r.stderr.includes('Publishing not authorized'));
});
test('scheduled extension has valid unique drafts and preserves alternate-day cadence',()=>{
 const workflow=readFileSync('.github/workflows/brand-threads-organic-pilot.yml','utf8');
 const rows=[...workflow.matchAll(/(2026-\d{2}-\d{2})\) BRAND=(lens|rakutabi); DAY=(\d+) ;;/g)]
  .map(([,date,brand,day])=>({date,brand,day:Number(day)}));
 assert.equal(new Set(rows.map(x=>x.date)).size,rows.length);
 assert.equal(new Set(rows.map(x=>x.brand+':'+x.day)).size,rows.length);
 for(const row of rows) assert.ok(posts.some(p=>p.brand===row.brand&&p.day===row.day),JSON.stringify(row));
 const extension=rows.filter(x=>x.date>='2026-10-28');
 assert.equal(extension.length,9);
 assert.equal(extension.at(-1).date,'2026-11-05');
 for(const brand of ['lens','rakutabi']){
  const days=extension.filter(x=>x.brand===brand).map(x=>Date.parse(x.date));
  for(let i=1;i<days.length;i++) assert.equal(days[i]-days[i-1],2*86400000);
 }
 assert.match(workflow,/cron: '15 1,4,7,10 \* \* \*'/);
 assert.match(workflow,/\*\) echo "No scheduled content for \$TODAY"; exit 0/);
});
test('Lens article links are disclosed and tagged without changing other brands',()=>{
 const linked=posts.filter(p=>p.url);
 assert.deepEqual(linked.map(p=>p.brand+':'+p.day),['lens:7','lens:8','lens:9','lens:10','lens:11']);
 for(const p of linked){
  const message=buildOrganicMessage(p,p.brand);
  assert.ok(message.startsWith('【PR】\n'));
  const url=new URL(p.url);
  assert.equal(url.origin,'https://www.lens-navi.jp');
  assert.equal(url.searchParams.get('utm_content'),'lens_day_'+p.day);
  assert.equal(p.previousTexts.length,1);
 }
 assert.ok(posts.filter(p=>p.brand==='rakutabi').every(p=>!p.url));
});
test('unsafe destinations and broken attribution fail before publishing',()=>{
 const p=posts.find(p=>p.brand==='lens'&&p.day===7);
 for(const url of [p.url.replace('www.lens-navi.jp','www.lens-navi.jp.evil.test'),p.url.replace('https:','http:'),p.url+'&access_token=unexpected',p.url.replace('lens_day_7','lens_day_8'),p.url.replace('/column/','/api/')]){
  assert.throws(()=>buildOrganicMessage({...p,url},'lens'));
 }
 assert.throws(()=>buildOrganicMessage(p,'rakutabi'));
 assert.throws(()=>buildOrganicMessage({...p,text:'あ'.repeat(500)},'lens'),/500/);
});
test('changed copy and earlier unlinked copy cannot republish the same Lens campaign',()=>{
 const p=posts.find(p=>p.brand==='lens'&&p.day===7);
 const message=buildOrganicMessage(p,'lens');
 for(const text of [message,p.text,p.previousTexts[0],'前の文章\n\n'+p.url]){
  assert.equal(isOrganicDuplicate({text},p,message),true);
 }
 assert.equal(isOrganicDuplicate({text:'別の投稿'},p,message),false);
 assert.equal(isOrganicDuplicate({},p,message),false);
});

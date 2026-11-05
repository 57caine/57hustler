import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {buildOrganicMessage,isOrganicDuplicate} from '../scripts/lib/organic-threads-message.mjs';
const posts=JSON.parse(readFileSync('data/organic-threads-posts-20261013.json','utf8')).posts;
test('safe and unique organic drafts',()=>{
 assert.equal(posts.length,35);
 assert.equal(new Set(posts.map(p=>p.text)).size,posts.length);
 assert.equal(new Set(posts.map(p=>p.brand+':'+p.day)).size,posts.length);
 for(const p of posts){
  assert.ok(['rakutabi','lens'].includes(p.brand));
  assert.ok(Number.isInteger(p.day) && p.day>=1 && p.day<=(p.brand==='rakutabi'?18:17));
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
 assert.equal(extension.length,22);
 assert.equal(extension.at(-1).date,'2026-11-18');
 for(const brand of ['lens','rakutabi']){
  const days=extension.filter(x=>x.brand===brand).map(x=>Date.parse(x.date));
  for(let i=1;i<days.length;i++) assert.equal(days[i]-days[i-1],2*86400000);
 }
 assert.match(workflow,/cron: '15 1,4,7,10 \* \* \*'/);
 assert.match(workflow,/\*\) echo "No scheduled content for \$TODAY"; exit 0/);
});
test('Lens article links retain disclosure and attribution',()=>{
 const linked=posts.filter(p=>p.url&&p.brand==='lens');
 assert.deepEqual(linked.map(p=>p.brand+':'+p.day),['lens:7','lens:8','lens:9','lens:10','lens:11']);
 for(const p of linked){
  const message=buildOrganicMessage(p,p.brand);
  assert.ok(message.startsWith('【PR】\n'));
  const url=new URL(p.url);
  assert.equal(url.origin,'https://www.lens-navi.jp');
  assert.equal(url.searchParams.get('utm_content'),'lens_day_'+p.day);
  assert.equal(p.previousTexts.length,1);
 }
 assert.ok(posts.filter(p=>p.brand==='rakutabi'&&p.day!==9).every(p=>!p.url));
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

test('Ito pilot is disclosed, scoped, attributed and deduplicates the earlier draft',()=>{
 const p=posts.find(p=>p.brand==='rakutabi'&&p.day===9);
 const message=buildOrganicMessage(p,'rakutabi');
 assert.ok(message.startsWith('【PR】\n'));
 assert.ok(message.endsWith(p.url));
 assert.ok(message.length<=500);
 assert.equal(new URL(p.url).pathname,'/area/ito');
 assert.equal(p.previousTexts.length,1);
 for(const text of [message,p.text,p.previousTexts[0],'旧文面\n'+p.url])
  assert.equal(isOrganicDuplicate({text},p,message),true);
 for(const url of [p.url.replace('/area/ito','/area/atami'),p.url.replace('rakutabi-nine.vercel.app','rakutabi-nine.vercel.app.evil.test'),p.url.replace('https:','http:'),p.url.replace('rakutabi_day_9','rakutabi_day_10'),p.url+'&access_token=bad',p.url.replace('rakutabi_ito_202610','other'),p.url+'&utm_source=threads']){
  assert.throws(()=>buildOrganicMessage({...p,url},'rakutabi'));
 }
 assert.throws(()=>buildOrganicMessage({...p,day:10},'rakutabi'));
 assert.throws(()=>buildOrganicMessage(p,'lens'));
 assert.throws(()=>buildOrganicMessage(p,'mitama'));
});

test('scheduled Rakutabi slots use audience windows without affecting Lens or earlier dates',t=>{
 const dir=mkdtempSync(join(tmpdir(),'organic-slots-'));
 t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const output=join(dir,'output');
 const workflow=readFileSync('.github/workflows/brand-threads-organic-pilot.yml','utf8');
 const plan=workflow.split('        run: |\n')[1].split('\n      - name:')[0]
  .replace('TODAY="$(date -u +%F)"','TODAY="$TEST_DATE"')
  .replace('UTC_HOUR="$(date -u +%H)"','UTC_HOUR="$TEST_HOUR"');
 const regular='15 1,4,7,10 * * *';
 const sunday='15 6,8 * * 0';
 const evening='15 12,13 * * 2,4';
 for(const [date,hour,cron,expected] of [
  ['2026-11-06','01',regular,'rakutabi'],
  ['2026-11-08','04',regular,null],
  ['2026-11-08','06',sunday,'rakutabi'],
  ['2026-11-08','08',sunday,'rakutabi'],
  ['2026-11-08','09',sunday,null],
  ['2026-11-10','10',regular,null],
  ['2026-11-10','12',evening,'rakutabi'],
  ['2026-11-10','13',evening,'rakutabi'],
  ['2026-11-10','15',evening,null],
  ['2026-11-05','12',evening,null],
  ['2026-11-05','01',regular,'lens'],
  ['2026-11-12','10',regular,null],
  ['2026-11-12','12',evening,'rakutabi'],
  ['2026-11-12','15',evening,null],
  ['2026-11-15','06',sunday,null],
  ['2026-11-15','04',regular,'lens'],
  ['2026-11-18','10',regular,'rakutabi'],
  ['2026-11-19','12',evening,null],
 ]){
  writeFileSync(output,'');
  const result=spawnSync('bash',['-c',plan],{encoding:'utf8',env:{
   PATH:process.env.PATH,EVENT_NAME:'schedule',SCHEDULE_CRON:cron,
   TEST_DATE:date,TEST_HOUR:hour,GITHUB_OUTPUT:output,
  }});
  assert.equal(result.status,0,result.stderr);
  assert.equal(readFileSync(output,'utf8').match(/^brand=(\w+)$/m)?.[1]??null,expected,date+' '+hour);
 }
 for(const day of [12,13,14]){
  const p=posts.find(p=>p.brand==='rakutabi'&&p.day===day);
  assert.equal(p.previousTexts.length,1);
  assert.ok(isOrganicDuplicate({text:p.previousTexts[0]},p,buildOrganicMessage(p,p.brand)));
 }
});

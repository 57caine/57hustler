// Read-only rolling 14-day inventory report; missing material is not fabricated.
import {readFileSync} from 'node:fs';
import {slots,planSlot} from './lib/threads-daily-slots.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8')).posts;
const now=process.argv[2]??new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(new Date());
if(!/^\d{4}-\d{2}-\d{2}$/.test(now)||!Number.isFinite(Date.parse(now))||new Date(now).toISOString().slice(0,10)!==now)throw Error('Invalid JST date');
const lens=read('data/organic-threads-posts-20261013.json').filter(p=>p.brand==='lens');
const travel=read('data/rakutabi-threads-hotel-posts.json');
const mitama=read('data/mitama-threads-posts.json');
const start=Math.max(Date.parse(now),Date.parse('2026-11-29'));
const reports=Object.fromEntries(['lens','rakutabi','mitama'].map(brand=>[brand,{brand,required:brand==='mitama'?14:28,ready:0,pendingReview:0,missing:[]}]));
for(let i=0;i<14;i++){
 const date=new Date(start+i*86400000).toISOString().slice(0,10);
 for(const slot of slots){
  const p=planSlot(date,slot.cron,slot.brand==='lens'?lens:travel);
  const report=reports[slot.brand];
  if(p?.status==='ready')report.ready++;
  else report.missing.push({date,slot:slot.slot,day:p?.day});
 }
 const day=46+(Date.parse(date)-Date.parse('2026-11-29'))/86400000;
 const p=mitama.find(p=>p.day===day);
 if(p?.status==='draft_pending_editorial_review')reports.mitama.pendingReview++;
 reports.mitama.missing.push({date,day,reason:p?'not authorized by current date gate':'missing draft'});
}
for(const r of Object.values(reports)){
 console.log(JSON.stringify({asOf:now,...r}));
 if(r.missing.length)console.warn('::warning::'+r.brand+' needs verified replenishment; no automatic publication or replay');
}

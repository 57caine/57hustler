// Read-only inventory check. Never publishes, generates drafts or accesses credentials.
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8')).posts;
const now=process.argv[2]??new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(new Date());
if(!/^\d{4}-\d{2}-\d{2}$/.test(now)||!Number.isFinite(Date.parse(now))||new Date(now).toISOString().slice(0,10)!==now)throw Error('Invalid JST date');
const wf=readFileSync(new URL('../.github/workflows/brand-threads-organic-pilot.yml',import.meta.url),'utf8');
const rows=[...wf.matchAll(/(\d{4}-\d{2}-\d{2})\) BRAND=(lens|rakutabi); DAY=(\d+) ;;/g)].map(([,date,brand,day])=>({date,brand,day:Number(day)}));
const lens=read('data/organic-threads-posts-20261013.json').filter(p=>p.brand==='lens');
const travel=read('data/rakutabi-threads-hotel-posts.json');
for(const [brand,posts] of [['lens',lens],['rakutabi',travel]]){
 const upcoming=rows.filter(r=>r.brand===brand&&r.date>=now).sort((a,b)=>a.date.localeCompare(b.date));
 const missing=upcoming.filter(r=>!posts.some(p=>p.day===r.day&&(brand==='lens'?p.text?.trim():p.photos?.length>0)));
 const last=upcoming.at(-1)?.date??null;
 const days=last?Math.round((Date.parse(last)-Date.parse(now))/86400000):-1;
 console.log(JSON.stringify({brand,asOf:now,remainingSlots:upcoming.length,last,days,missing:missing.map(r=>r.date)}));
 if(days<=7||missing.length)console.warn('::warning::'+brand+' approved content inventory needs replenishment; no automatic publication or replay');
}

import {readFileSync,appendFileSync} from 'node:fs';
import {planSlot} from './lib/threads-daily-slots.mjs';
const cron=process.env.SCHEDULE_CRON;
const now=new Date();
const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(now);
const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8')).posts;
const lens=read('data/organic-threads-posts-20261013.json').filter(p=>p.brand==='lens');
const travel=read('data/rakutabi-threads-hotel-posts.json');
const posts=cron==='15 3 * * *'||cron==='15 12 * * *'?lens:travel;
const plan=planSlot(date,cron,posts);
if(!plan)process.exit(0);
const mins=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
const delay=mins(time)-mins(plan.time);
if(delay<0||delay>90){console.warn('::warning::Outside same-day slot window; no replay');process.exit(0);}
if(plan.status!=='ready'){console.warn('::warning::Missing approved draft '+plan.brand+' '+plan.day);process.exit(0);}
console.log(JSON.stringify({date,...plan,actualJst:time}));
appendFileSync(process.env.GITHUB_OUTPUT,'brand='+plan.brand+'\nday='+plan.day+'\nslot='+plan.slot+'\npublish=true\n');

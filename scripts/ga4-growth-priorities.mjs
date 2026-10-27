#!/usr/bin/env node
// Evidence-based read-only growth priorities from existing daily GA4 snapshot.
// No model, paid API, PR generation, or production modifications.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const raw = JSON.parse(await readFile('data/ga4-analytics.json','utf8'));
const age = (Date.now()-Date.parse(raw.generatedAt))/3600000;
if (!Number.isFinite(age) || age < -1 || age > 48) throw Error('GA4 stale: refuse to rank opportunities');
const site = raw.sites?.find(x=>x.siteName==='lens-navi');
if (!site || site.affiliateClicksStatus!=='ok') throw Error('Verified Lens affiliate events unavailable');
const rows = (site.topPages||[]).filter(x=>x.path?.startsWith('/') && Number.isFinite(x.sessions));
const clickMap=site.affiliateClicksByPage||{};
const priorities=rows.filter(x=>x.sessions>=10).map(x=>({
 path:x.path,sessions:x.sessions,affiliateClickEvents:Number.isFinite(clickMap[x.path])?clickMap[x.path]:null,
 priorityScore:x.sessions*(x.path.startsWith('/column/')?1.2:1),
 next:x.path.startsWith('/column/')?'Inspect article-to-comparison CTA and exact product relevance':'Verify price comparison and outbound CTA clarity'
})).sort((a,b)=>b.priorityScore-a.priorityScore).slice(0,12);
const result={generatedAt:new Date().toISOString(),sourceGeneratedAt:raw.generatedAt,window:site.dateRange,siteSessions:site.totalSessions,affiliateClickEventsTotal:site.affiliateClicksTotal,priorities,limitations:['GA4 topPages truncated; rankings are heuristics, not conversion rates','Affiliate click events are not purchases','No attribution of sales or causal uplift']};
await mkdir('growth-reports',{recursive:true});
await writeFile('growth-reports/ga4-priorities.json',JSON.stringify(result,null,2)+'\n');
const issue=['## GA4 verified growth opportunities','Snapshot: '+raw.generatedAt,'Lens sessions: '+site.totalSessions+'; affiliate click events: '+site.affiliateClicksTotal,'','| Page | Sessions | Affiliate click events | Next check |','|---|---:|---:|---|',...priorities.map(x=> '| '+x.path+' | '+x.sessions+' | '+(x.affiliateClickEvents??'unknown')+' | '+x.next+' |'),'','**Interpretation:** events are not sales; unknown is not zero. No auto-publication or paid API calls.'].join('\n');
await writeFile('growth-reports/ga4-priorities.md',issue+'\n');
console.log('GA4 priority report generated ('+priorities.length+' pages)');

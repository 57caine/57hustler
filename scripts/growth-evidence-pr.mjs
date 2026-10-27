#!/usr/bin/env node
// Build a review-only Markdown evidence report from verified GA4 snapshot.
// This file is safe to submit as a PR: it cannot change production behavior.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const raw=JSON.parse(await readFile('data/ga4-analytics.json','utf8'));
const age=(Date.now()-Date.parse(raw.generatedAt))/3600000;
if(!Number.isFinite(age)||age < -1||age>48) throw Error('Stale GA4 snapshot');
const site=raw.sites?.find(s=>s.siteName==='lens-navi');
if(!site||site.affiliateClicksStatus!=='ok') throw Error('Unverified affiliate_click query');
const rows=(site.topPages||[]).filter(p=>p.path?.startsWith('/')&&Number.isFinite(p.sessions)).sort((a,b)=>b.sessions-a.sessions).slice(0,8);
const text=['# Lens Navi growth evidence (automated)','', 'Generated from verified daily GA4 export; this PR is **review-only**.','',
'Source timestamp: '+raw.generatedAt,'Window: '+JSON.stringify(site.dateRange),'Total sessions: '+site.totalSessions,'Affiliate click events: '+site.affiliateClicksTotal,'',
'| Page | Sessions | Affiliate click events |','|---|---:|---:|',
...rows.map(p=>'| '+p.path.replaceAll('|','\\|')+' | '+p.sessions+' | '+(Number.isFinite(site.affiliateClicksByPage?.[p.path])?site.affiliateClicksByPage[p.path]:'unknown')+' |'),
'','## Suggested next engineering task',
'Review the highest-traffic relevant article for clear comparison links and validate exact product/offer destinations before making changes.',
'','## Limits',
'- Event counts are not orders or commissions.',
'- Top pages are truncated and cannot establish site-wide conversion.',
'- No source code or production pages are modified by this automated PR.',
'- An actual engineering fix still requires a separate reviewed implementation PR.',''].join('\n');
await mkdir('docs/automated',{recursive:true});
await writeFile('docs/automated/lens-growth-evidence.md',text);

#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const paths=['.github/workflows/growth-autonomous-triage.yml','.github/workflows/ga4-growth-priorities.yml','.github/workflows/growth-evidence-pr.yml'];
for(const path of paths){
 const s=await readFile(path,'utf8');
 assert.match(s,/workflow_dispatch:/,path+' missing manual trigger');
 assert.match(s,/schedule:/,path+' missing schedule');
 assert.doesNotMatch(s,/--force(?:-with-lease)?(?:\s|$)/m,path+' unsafe force push');
 assert.doesNotMatch(s,/gh pr merge|gh release create|vercel --prod/,path+' unsafe production action');
}
const ga=await readFile('scripts/ga4-growth-priorities.mjs','utf8');
assert.match(ga,/affiliateClicksStatus!=='ok'/,'GA4 missing verification');
assert.match(ga,/age > 48|age>48/,'GA4 missing freshness guard');
const ev=await readFile('scripts/growth-evidence-pr.mjs','utf8');
assert.match(ev,/affiliateClicksStatus!=='ok'/,'PR evidence missing verification');
console.log('Growth automation static guardrails passed');

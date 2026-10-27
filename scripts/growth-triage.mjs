#!/usr/bin/env node
// Converts read-only diagnostic data into a scoped, auditable next action.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = JSON.parse(await readFile('growth-reports/latest.json', 'utf8'));
const failures = source.results.filter(r => !r.ok);
const missing = source.results.filter(r => r.site === 'lens' && r.path === '/' && r.ok && r.comparisonLinkPresent === false);
const actions = [
  ...failures.map(r => ({ priority: 'P0', site: r.site, problem: r.path + ' is unavailable', evidence: r, next: 'Inspect deployment and HTTP failure; create a narrowly scoped fix PR after reproducing', ownerDecision: false })),
  ...missing.map(r => ({ priority: 'P1', site: r.site, problem: 'Homepage comparison CTA not found', evidence: r, next: 'Confirm deployed SHA and HTML; inspect comparison navigation before code changes', ownerDecision: false })),
];
if (!actions.length) actions.push({ priority: 'P1', site: 'lens', problem: 'Public pages respond but traffic/conversion outcomes are unknown', next: 'Review verified GSC and GA4 reports; select a high-impression low-CTR page and prepare a focused SEO PR', ownerDecision: false });
const report = { generatedAt: new Date().toISOString(), diagnosticAt: source.generatedAt, actions, limitations: ['This is deterministic triage, not an AI model', 'No code PR automatically created', 'No sales data or traffic uplift established'] };
await mkdir('growth-reports', { recursive: true });
await writeFile('growth-reports/triage.json', JSON.stringify(report, null, 2) + '\n');
const body = ['## Automated growth triage', 'Diagnostic: ' + source.generatedAt, '', ...actions.map((a,i) => (i+1)+'. **'+a.priority+' / '+a.site+'** '+a.problem+'\n   - Next: '+a.next), '', 'No verified GA4/GSC conversion impact. No paid AI agents invoked. Do not claim PR or production fix completed.'].join('\n');
await writeFile('growth-reports/triage-issue.md', body + '\n');
console.log(body);

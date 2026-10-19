#!/usr/bin/env node
// Read-only baseline for Lens Navi revenue-path experiments.
// No traffic splitting, affiliate URL rewrites, GA4 mutation, or publication.
import fs from 'node:fs';

const path = process.env.GA4_REPORT_PATH || 'data/ga4-analytics.json';
const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
const site = (raw.sites ?? []).find(s => s.siteName === 'lens-navi');
if (!site || site.affiliateClicksStatus !== 'ok' || !site.affiliateClicksByPage) {
  throw new Error('Verified Lens Navi affiliate click data unavailable; do not interpret as zero');
}
const ageHours = (Date.now() - Date.parse(raw.generatedAt)) / 3600000;
if (!Number.isFinite(ageHours) || ageHours < -1 || ageHours > 48) {
  throw new Error('GA4 data stale or invalid; fetch fresh data before comparing');
}
const sessions = new Map((site.topPages ?? []).map(p => [p.path, p.sessions]));
const clicks = site.affiliateClicksByPage;
const paths = [
  '/category/1day',
  '/ranking',
  '/bc/8.4',
  '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide',
  '/column/contact-dosu-shohosen-mikata-kanzen-2026',
  '/product/acuvue-oasys-1day',
  '/product/acuvue-oasys-2week',
];
const lines = [
  '# Lens Navi revenue experiment — baseline',
  '',
  'Read-only opportunity scan. Counts are GA4 events, not purchases or unique people.',
  `Generated: ${raw.generatedAt}; GA4 period: ${site.dateRange?.start ?? '?'}–${site.dateRange?.end ?? '?'}`,
  '',
  '| Page | GA4 affiliate_click events | Sessions (top pages only) | Next hypothesis |',
  '|---|---:|---:|---|',
];
for (const p of paths) {
  const n = clicks[p];
  const session = sessions.get(p);
  const hypothesis = p.startsWith('/column/') ? 'Test a clearer product-comparison entry point' : p.startsWith('/product/') ? 'Verify exact offer and purchase CTA' : 'Inspect comparison visibility and CTA clarity';
  lines.push(`| ${p} | ${Number.isFinite(n) ? n : 'unavailable'} | ${Number.isFinite(session) ? session : 'unavailable'} | ${hypothesis} |`);
}
lines.push('', 'Do not calculate purchase conversion or claim uplift from clicks/sessions: GA4 event counts and sessions have different denominators, and topPages is truncated.');
lines.push('Experiment protocol: (1) capture same-window baseline; (2) change ONE CTA/entry-point only after link and copy review; (3) observe at least 14 days or sufficient sample; (4) compare GA4 events and page traffic separately; (5) confirm actual commissions in A8/Rakuten reports before declaring revenue lift.');
lines.push('Guardrails: no automatic random A/B traffic split, no affiliate URL parameter modification, no new spend, no live deployment without approval. Small samples are inconclusive.');
console.log(lines.join('\n'));

#!/usr/bin/env node
// Revenue evidence report: GA4 clicks are NOT orders or attributed commissions.
// Read-only: no external requests, purchases, API keys or commits.
import fs from 'node:fs';
const file = process.env.GA4_REPORT_PATH || 'data/ga4-analytics.json';
const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
const site = (raw.sites ?? []).find(s => s.siteName === 'lens-navi');
if (!site) throw new Error('lens-navi GA4 data missing; do not report zero');
const clicks = site.affiliateClicksByPage;
if (site.affiliateClicksStatus === 'error' || !clicks || typeof clicks !== 'object') {
  throw new Error('affiliate_click data missing or failed; do not report zero');
}
const generated = Date.parse(raw.generatedAt);
if (!Number.isFinite(generated)) throw new Error('Invalid GA4 generatedAt');
const ageHours = (Date.now() - generated) / 3600000;
const stale = ageHours > 48 || ageHours < -1;
const top = Object.entries(clicks).filter(([, n]) => Number.isFinite(n) && n > 0).sort((a, b) => b[1] - a[1]).slice(0, 12);
const total = Object.values(clicks).reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0);
const lines = [
  '# Affiliate revenue evidence — lens-navi',
  '',
  `- GA4 fetched: ${raw.generatedAt} (${ageHours.toFixed(1)} hours old)`,
  `- GA4 data freshness: ${stale ? 'STALE — do not use for current decisions' : 'within 48 hours'}`,
  `- GA4 period: ${site.dateRange?.start ?? 'unknown'} to ${site.dateRange?.end ?? 'unknown'}`,
  `- Click fetch status: ${site.affiliateClicksStatus ?? 'unknown (legacy data; completeness not verified)'}`,
  `- Sessions: ${site.totalSessions ?? 'unknown'}`,
  `- Recorded affiliate_click events by page (sum): ${total}`,
  '',
  '| Page | Recorded affiliate_click |',
  '|---|---:|',
  ...top.map(([path, n]) => `| ${path.replaceAll('|', '\\|')} | ${n} |`),
  '',
  '**Commission and attribution: NOT VERIFIED.** GA4 click events cannot prove Rakuten/A8 orders, confirmed commissions, or which project generated a sale.',
  'A zero in this report is never a substitute for merchant conversion data. The date range may overlap previous reports; do not add rolling-window totals.',
  '',
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
if (stale) process.exitCode = 1;

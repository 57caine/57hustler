#!/usr/bin/env node
// Revenue evidence report: GA4 clicks are NOT orders or attributed commissions.
// Read-only: no external requests, purchases, API keys or commits.
import fs from 'node:fs';
const file = process.env.GA4_REPORT_PATH || 'data/ga4-analytics.json';
const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
const site = (raw.sites ?? []).find(s => s.siteName === 'lens-navi');
if (!site) throw new Error('lens-navi GA4 data missing; do not report zero');
const clicks = site.affiliateClicksByPage;
if (site.affiliateClicksStatus !== 'ok' || !clicks || typeof clicks !== 'object') {
  throw new Error('affiliate_click data missing or failed; do not report zero');
}
const generated = Date.parse(raw.generatedAt);
if (!Number.isFinite(generated)) throw new Error('Invalid GA4 generatedAt');
const ageHours = (Date.now() - generated) / 3600000;
const stale = ageHours > 48 || ageHours < -1;
const top = Object.entries(clicks).filter(([, n]) => Number.isFinite(n) && n > 0).sort((a, b) => b[1] - a[1]).slice(0, 12);
const pageCounts = Object.values(clicks);
if (pageCounts.some(n => !Number.isSafeInteger(n) || n < 0)) {
  throw new Error('Invalid page click counts; refuse to report a partial total');
}
const pageSubtotal = pageCounts.reduce((sum, n) => sum + n, 0);
const total = site.affiliateClicksTotal;
if (!Number.isSafeInteger(total) || total < 0) {
  throw new Error('GA4 ungrouped affiliate_click total unavailable; do not substitute page subtotal or zero');
}
if (pageSubtotal > total) {
  throw new Error('Page click subtotal exceeds GA4 ungrouped total; reconcile reports before use');
}
// Prioritize existing proven click paths; page sessions are available only for GA4 topPages.
// Event counts are not unique visitors, orders, or click-through rates.
const pageSessions = new Map((site.topPages ?? []).map(p => [p.path, p.sessions]));
const opportunities = top.slice(0, 5).map(([path, clicks]) => ({ path, clicks, sessions: pageSessions.get(path) }));
const platformStatus = site.affiliateClicksPlatformStatus ?? 'unknown';
const platformData = site.affiliateClicksByPlatform ?? {};
const lines = [
  '# Affiliate revenue evidence — lens-navi',
  '',
  `- GA4 fetched: ${raw.generatedAt} (${ageHours.toFixed(1)} hours old)`,
  `- GA4 data freshness: ${stale ? 'STALE — do not use for current decisions' : 'within 48 hours'}`,
  `- GA4 period: ${site.dateRange?.start ?? 'unknown'} to ${site.dateRange?.end ?? 'unknown'}`,
  `- Click fetch status: ${site.affiliateClicksStatus ?? 'unknown (legacy data; completeness not verified)'}`,
  `- Sessions: ${site.totalSessions ?? 'unknown'}`,
  `- Recorded affiliate_click events (GA4 ungrouped total): ${total}`,
  `- Listed page subtotal (up to 100 pages; not the overall total): ${pageSubtotal}`,
  `- Affiliate platform breakdown: ${platformStatus} (not proof of merchant sales)`,
  ...(platformStatus === 'ok' ? Object.entries(platformData).map(([name, n]) => `  - ${name}: ${n} events`) : ['- Platform-level clicks unavailable; do not assume Rakuten/A8 split.']),
  '',
  '| Page | Recorded affiliate_click |',
  '|---|---:|',
  ...top.map(([path, n]) => `| ${path.replaceAll('|', '\\|')} | ${n} |`),
  '',
  '## Priority: pages with recorded affiliate intent',
  '',
  '| Page | Affiliate click events | Page sessions (if in GA4 top 20) |',
  '|---|---:|---:|',
  ...opportunities.map(({ path, clicks, sessions }) => `| ${path.replaceAll('|', '\\\\|')} | ${clicks} | ${Number.isFinite(sessions) ? sessions : 'not available'} |`),
  '',
  'Action: check offer availability, outbound URL and purchase-intent clarity on these pages first; do not add more articles solely based on sessions.',
  'Event counts can include multiple clicks by one person; page sessions and clicks are different measures and their ratio is not a conversion rate.',
  '',
  '**Commission and attribution: NOT VERIFIED.** GA4 click events cannot prove Rakuten/A8 orders, confirmed commissions, or which project generated a sale.',
  'A zero in this report is never a substitute for merchant conversion data. The date range may overlap previous reports; do not add rolling-window totals.',
  '',
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
if (stale) process.exitCode = 1;

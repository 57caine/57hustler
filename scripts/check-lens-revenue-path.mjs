#!/usr/bin/env node
// Read-only live smoke test for the revenue path. No secrets, clicks, or purchases.
const base = process.env.LENS_BASE_URL || 'https://lens-navi.jp';
const paths = ['/ranking', '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide', '/column/contact-dosu-shohosen-mikata-kanzen-2026'];
const results = [];
let failed = false;
for (const path of paths) {
  const url = new URL(path, base);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'follow', headers: { 'User-Agent': '57hustler-revenue-healthcheck/1.0' } });
    const html = await response.text();
    const hasAffiliate = /hb\.afl\.rakuten\.co\.jp|afl\.rakuten\.co\.jp|px\.a8\.net/.test(html);
    const hasTracking = /affiliate_click|AffiliateClickTracker|googletagmanager\.com\/gtag/.test(html);
    const ok = response.ok && html.includes('<html') && hasAffiliate;
    if (!ok) failed = true;
    results.push({ path, http: response.status, hasAffiliate, hasTracking, ok });
  } catch (error) {
    failed = true;
    results.push({ path, ok: false, error: String(error) });
  }
}
const lines = [
  '# Lens-navi revenue path: read-only healthcheck',
  '',
  '| Page | HTTP | Affiliate link present | Tracking marker present | Result |',
  '|---|---:|---|---|---|',
  ...results.map(r => `| ${r.path} | ${r.http ?? '-'} | ${r.hasAffiliate ? 'yes' : 'no'} | ${r.hasTracking ? 'yes' : 'no'} | ${r.ok ? 'PASS' : 'FAIL'} |`),
  '',
  'This checks HTML availability and affiliate URL presence only. It does NOT prove click tracking, attribution, or sales.',
  '',
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import('node:fs');
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
}
if (failed) process.exitCode = 1;

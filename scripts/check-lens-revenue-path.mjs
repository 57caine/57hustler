#!/usr/bin/env node
// Read-only live smoke test for the revenue path. No secrets, clicks, or purchases.
const base = process.env.LENS_BASE_URL || 'https://lens-navi.jp';
const paths = ['/ranking', '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide', '/column/contact-dosu-shohosen-mikata-kanzen-2026'];
const results = [];
const diagnoses = [];
function diagnose({ path, http, hasAffiliate, hasTracking, error }) {
  if (error) return `NETWORK: ${path} - check DNS/TLS/timeout and GitHub Actions logs. ${error}`;
  if (http === 404) return `NOT_FOUND: ${path} - check route generation, slug and deployed commit.`;
  if (http === 401 || http === 403) return `ACCESS: ${path} - check firewall and deployment protection.`;
  if (http >= 500) return `SERVER: ${path} - check Vercel runtime logs.`;
  if (http >= 300) return `HTTP: ${path} - unexpected response (${http}).`;
  if (!hasAffiliate) return `AFFILIATE_MISSING: ${path} - inspect rendered CTA and affiliate URL.`;
  if (!hasTracking) return `TRACKING_UNVERIFIED: ${path} - no HTML marker; inspect client-side GA4 separately.`;
  return null;
}
let failed = false;
for (const path of paths) {
  const url = new URL(path, base);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'follow', headers: { 'User-Agent': '57hustler-revenue-healthcheck/1.0' } });
    const html = await response.text();
    const hasAffiliate = /hb\.afl\.rakuten\.co\.jp|afl\.rakuten\.co\.jp|px\.a8\.net/.test(html);
    const hasTracking = /affiliate_click|AffiliateClickTracker|googletagmanager\.com\/gtag/.test(html);
    // Ranking copy assertions validate the PR #38 production page, not merely a 200 response.
    const rankingCopyOk = path !== '/ranking' || (
      html.includes('購入前に確認すること') &&
      html.includes('商品比較') &&
      !html.includes('注目の新規ショップ')
    );
    const ok = response.ok && html.includes('<html') && hasAffiliate && rankingCopyOk;
    if (!ok) failed = true;
    results.push({ path, http: response.status, hasAffiliate, hasTracking, rankingCopyOk, ok });
    if (!rankingCopyOk) diagnoses.push(`STALE_CONTENT: ${path} - expected PR #38 copy missing or old generic shop CTA present.`);
    const diagnosis = diagnose({ path, http: response.status, hasAffiliate, hasTracking });
    if (diagnosis) diagnoses.push(diagnosis);
  } catch (error) {
    failed = true;
    results.push({ path, ok: false, error: String(error) });
    diagnoses.push(diagnose({ path, error: String(error) }));
  }
}
const lines = [
  '# Lens-navi revenue path: read-only healthcheck',
  '',
  '| Page | HTTP | Affiliate link present | Tracking marker present | PR #38 copy | Result |',
  '|---|---:|---|---|---|',
  ...results.map(r => `| ${r.path} | ${r.http ?? '-'} | ${r.hasAffiliate ? 'yes' : 'no'} | ${r.hasTracking ? 'yes' : 'no'} | ${r.rankingCopyOk === undefined ? '-' : r.rankingCopyOk ? 'yes' : 'no'} | ${r.ok ? 'PASS' : 'FAIL'} |`),
  '',
  '## Automatic diagnostic hints',
  '',
  ...(diagnoses.length ? diagnoses.map(d => `- ${d}`) : ['- No obvious issue found in the HTML checks.']),
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

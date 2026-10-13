#!/usr/bin/env node
// Read-only live smoke test for the revenue path. No secrets, clicks, or purchases.
const base = process.env.LENS_BASE_URL || 'https://lens-navi.jp';
// PR #60 pilot: this one product must render the officially-generated
// Rakuten tracked link (trackingId "lensnavi", code below), not the
// generic per-product search-link fallback. See data/rakuten-official-links.json.
const PILOT_PRODUCT_PATH = '/product/acuvue-oasys-1day';
const PILOT_TRACKING_CODE = '_RTLink150145';
const paths = ['/category/1day', '/ranking', '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide', '/column/contact-dosu-shohosen-mikata-kanzen-2026', PILOT_PRODUCT_PATH];
const results = [];
const BC_PATH = '/bc/8.4';
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
    const columnCopyOk = !path.startsWith('/column/contact-') || (
      html.includes('自分に合うコンタクトレンズを比較する') &&
      html.includes('掲載商品を比較する')
    );
    // PR #60: verify the EXACT officially-issued tracked link renders on
    // the pilot product page, not merely "some" Rakuten affiliate link.
    const officialLinkOk = path !== PILOT_PRODUCT_PATH || html.includes(PILOT_TRACKING_CODE);
    const ok = response.ok && html.includes('<html') && hasAffiliate && rankingCopyOk && columnCopyOk && officialLinkOk;
    if (!ok) failed = true;
    results.push({ path, http: response.status, hasAffiliate, hasTracking, rankingCopyOk, columnCopyOk, officialLinkOk, ok });
    if (!columnCopyOk) diagnoses.push(`STALE_CONTENT: ${path} - expected PR #40 article CTA copy missing.`);
    if (!rankingCopyOk) diagnoses.push(`STALE_CONTENT: ${path} - expected PR #38 copy missing or old generic shop CTA present.`);
    if (path === PILOT_PRODUCT_PATH && !officialLinkOk) {
      diagnoses.push(`RAKUTEN_PILOT_LINK_MISSING: ${path} - expected PR #60 official tracked link ` +
        `(trackingId lensnavi, code ${PILOT_TRACKING_CODE}) not found; page may be serving the generic ` +
        `fallback Rakuten search link instead. This does NOT check Rakuten's own click attribution - ` +
        `see data/rakuten-official-links.json and CLAUDE.md for why that remains a manual check.`);
    }
    const diagnosis = diagnose({ path, http: response.status, hasAffiliate, hasTracking });
    if (diagnosis) diagnoses.push(diagnosis);
  } catch (error) {
    failed = true;
    results.push({ path, ok: false, error: String(error) });
    diagnoses.push(diagnose({ path, error: String(error) }));
  }
}
// Validate the highest-traffic GSC landing page without requiring an affiliate link
// on this informational comparison page. Check the actual product comparison path.
try {
  const response = await fetch(new URL(BC_PATH, base), { signal: AbortSignal.timeout(20000), redirect: 'follow', headers: { 'User-Agent': '57hustler-revenue-healthcheck/1.0' } });
  const html = await response.text();
  const canonicalOk = html.includes('https://www.lens-navi.jp/bc/8.4');
  const comparisonOk = html.includes('価格を比較') && html.includes('href="/product/');
  const safetyOk = html.includes('BC8.4という数字だけで商品を決めず');
  const ok = response.ok && canonicalOk && comparisonOk && safetyOk;
  if (!ok) failed = true;
  results.push({ path: BC_PATH, http: response.status, hasAffiliate: 'n/a', hasTracking: 'n/a', canonicalOk, comparisonOk, safetyOk, ok });
  if (!ok) diagnoses.push(`BC_LANDING_PAGE: ${BC_PATH} - verify canonical, comparison product links and medical safety notice.`);
} catch (error) {
  failed = true;
  results.push({ path: BC_PATH, ok: false, error: String(error) });
  diagnoses.push(`BC_LANDING_PAGE: ${BC_PATH} - ${String(error)}`);
}
const lines = [
  '# Lens-navi revenue path: read-only healthcheck',
  '',
  '| Page | HTTP | Affiliate link present | Tracking marker present | PR #38 copy | PR #40 column copy | PR #60 official link | Result |',
  '|---|---:|---|---|---|---|---|---|',
  ...results.map(r => `| ${r.path} | ${r.http ?? '-'} | ${r.hasAffiliate === 'n/a' ? 'n/a' : r.hasAffiliate ? 'yes' : 'no'} | ${r.hasTracking === 'n/a' ? 'n/a' : r.hasTracking ? 'yes' : 'no'} | ${r.rankingCopyOk === undefined ? '-' : r.rankingCopyOk ? 'yes' : 'no'} | ${r.columnCopyOk === undefined ? '-' : r.columnCopyOk ? 'yes' : 'no'} | ${r.officialLinkOk === undefined ? '-' : r.officialLinkOk ? 'yes' : 'no'} | ${r.ok ? 'PASS' : 'FAIL'} |`),
  '',
  '## Automatic diagnostic hints',
  '',
  ...(diagnoses.length ? diagnoses.map(d => `- ${d}`) : ['- No obvious issue found in the HTML checks.']),
  '',
  'This checks HTML availability and affiliate URL presence only. It does NOT prove click tracking, attribution, or sales.',
  '',
  '**Rakuten click data by tracking ID (lensnavi): not checked here, and cannot be automated.** ' +
    'No official Rakuten Affiliate API for per-tracking-ID click reports was found (confirmed via web search; ' +
    'direct fetch of the Rakuten affiliate/developer sites is blocked from this kind of sandbox). ' +
    'Check the Rakuten affiliate dashboard manually for attributed clicks. See CLAUDE.md.',
  '',
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import('node:fs');
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
}
if (failed) process.exitCode = 1;

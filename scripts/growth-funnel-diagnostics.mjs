#!/usr/bin/env node
// Read-only: never request affiliate destinations or simulate purchases.
import { mkdir, writeFile } from 'node:fs/promises';
const sites = [
  { name: 'lens', base: 'https://www.lens-navi.jp', paths: ['/', '/category/1day', '/ranking', '/sitemap.xml', '/robots.txt'] },
  { name: 'rakutabi', base: 'https://rakutabi-nine.vercel.app', paths: ['/', '/stats', '/robots.txt'] },
];
const results = [];
for (const site of sites) for (const path of site.paths) {
  try {
    const res = await fetch(new URL(path, site.base), { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': '57hustler-growth-check/1.0' } });
    const html = await res.text();
    const result = { site: site.name, path, status: res.status, ok: res.ok };
    if (site.name === 'lens' && path === '/') result.comparisonLinkPresent = /href=["']\/category\/1day["']/.test(html);
    if (path === '/robots.txt') result.robotsPreview = html.slice(0, 300);
    results.push(result);
  } catch (e) { results.push({ site: site.name, path, ok: false, error: String(e) }); }
}
const report = { generatedAt: new Date().toISOString(), results, limitations: ['No sales or GA4/GSC data', 'No affiliate clicks', 'No automated production edits'] };
await mkdir('growth-reports', { recursive: true });
await writeFile('growth-reports/latest.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (results.some(r => !r.ok)) process.exitCode = 1;

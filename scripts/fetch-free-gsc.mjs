#!/usr/bin/env node
// Read-only Google Search Console API using existing GA4 service-account secret.
// No third-party paid connector; never log credentials or private query data.
import { google } from 'googleapis';
import { mkdir, writeFile } from 'node:fs/promises';
const key = process.env.GA4_SERVICE_ACCOUNT_KEY;
if (!key) { console.error('Missing existing GA4_SERVICE_ACCOUNT_KEY secret'); process.exit(2); }
const credentials = JSON.parse(key);
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const client = google.searchconsole({ version: 'v1', auth });
const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:lens-navi.jp';
const end = new Date(Date.now() - 4 * 86400000);
const start = new Date(end.getTime() - 27 * 86400000);
const date = d => d.toISOString().slice(0, 10);
try {
  const data = await client.searchanalytics.query({
    siteUrl, requestBody: { startDate: date(start), endDate: date(end), dimensions: ['page'], rowLimit: 250 },
  });
  const rows = (data.data.rows || []).map(row => ({ page: row.keys?.[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
  const opportunities = rows.filter(r => r.impressions >= 30 && r.position <= 20).sort((a,b) => b.impressions * (1-b.ctr) - a.impressions * (1-a.ctr)).slice(0, 20);
  await mkdir('growth-reports', { recursive: true });
  await writeFile('growth-reports/gsc-lens.json', JSON.stringify({ generatedAt: new Date().toISOString(), siteUrl, range: { start: date(start), end: date(end) }, rowCount: rows.length, opportunities, caveat: 'Top 250 pages only; query privacy filtering applies; no claims of revenue impact' }, null, 2) + '\n');
  console.log('GSC page report saved: ' + rows.length + ' rows');
} catch (error) {
  const code = error?.code || error?.response?.status || 'unknown';
  console.error('GSC API failed (status ' + code + '). Check site permission and Search Console API enablement; no paid subscription required.');
  process.exit(1);
}

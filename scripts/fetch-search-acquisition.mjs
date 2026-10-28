// Read-only diagnostics. Uses the existing Google credential; never submits URLs.
import { google } from 'googleapis';
import { mkdir, writeFile } from 'node:fs/promises';

const report = { generatedAt: new Date().toISOString(), host: 'www.lens-navi.jp', gsc: { status: 'not_requested' }, ga4: { status: 'not_requested' } };
const end = new Date(); end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end); start.setUTCDate(start.getUTCDate() - 27);
const day = d => d.toISOString().slice(0, 10);
const range = { startDate: day(start), endDate: day(end) };
report.range = range;
const safeError = e => ({ httpStatus: e.response?.status ?? null, reason: e.response?.data?.error?.errors?.[0]?.reason ?? e.code ?? 'unknown' });
const key = process.env.GA4_SERVICE_ACCOUNT_KEY;
if (!key) {
  report.gsc = { status: 'missing_existing_credential' };
  report.ga4 = { status: 'missing_existing_credential' };
} else {
  const credentials = JSON.parse(key);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly'],
  });
  const gsc = google.searchconsole({ version: 'v1', auth });
  try {
    const listed = (await gsc.sites.list()).data.siteEntry ?? [];
    // Report only this project's properties; do not disclose other sites.
    const sites = listed.filter(s => ['sc-domain:lens-navi.jp', 'https://www.lens-navi.jp/', 'https://lens-navi.jp/'].includes(s.siteUrl));
    const site = sites.find(s => s.siteUrl === 'sc-domain:lens-navi.jp' && s.permissionLevel !== 'siteUnverifiedUser')
      ?? sites.find(s => s.siteUrl === 'https://www.lens-navi.jp/' && s.permissionLevel !== 'siteUnverifiedUser');
    report.gsc = { status: site ? 'reading' : 'property_access_missing', properties: sites,
      // Account identifier only: never include the credential object or private key.
      ...(!site ? { requiredReaderEmail: credentials.client_email, requiredProperty: 'sc-domain:lens-navi.jp', nextAction: 'Add this service account as a restricted reader in Search Console; do not create a new key.' } : {}),
    };
    if (site) {
      const query = async dimensions => (await gsc.searchanalytics.query({
        siteUrl: site.siteUrl,
        requestBody: { ...range, type: 'web', dataState: 'final', dimensions, rowLimit: 25000,
          dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'includingRegex', expression: '^https://www\\.lens-navi\\.jp/' }] }] },
      })).data;
      const [totals, pages, queries, sitemaps] = await Promise.all([
        query([]), query(['page']), query(['query']), gsc.sitemaps.list({ siteUrl: site.siteUrl }).then(r => r.data),
      ]);
      const inspections = [];
      for (const path of ['/category/1day', '/product/acuvue-oasys-1day', '/column/contact-tsuuhan-shohosen-nashi-kanzen-guide']) {
        try {
          const data = (await gsc.urlInspection.index.inspect({ requestBody: { siteUrl: site.siteUrl, inspectionUrl: 'https://www.lens-navi.jp' + path } })).data;
          inspections.push({ path, indexStatus: data.inspectionResult?.indexStatusResult });
        } catch (e) { inspections.push({ path, status: 'unavailable', ...safeError(e) }); }
      }
      report.gsc = { status: 'ok', siteUrl: site.siteUrl, properties: sites, totals, pages, queries, sitemaps, inspections,
        note: 'Query rows omit anonymized queries. Do not sum query rows for site totals. A 25000-row response may be truncated. URL inspection reads the indexed version, not a live test.' };
    }
  } catch (e) { report.gsc = { status: 'unavailable', ...safeError(e) }; }

  try {
    const analytics = google.analyticsdata({ version: 'v1beta', auth });
    const read = async (dimensions, metrics, eventName) => (await analytics.properties.runReport({
      property: 'properties/520238223',
      requestBody: { dateRanges: [range], dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })),
        dimensionFilter: { andGroup: { expressions: [
          { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: report.host } } },
          ...(eventName ? [{ filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: eventName } } }] : [])] } },
        limit: '10000' },
    })).data;
    const [sessions, affiliateClicks, comparisons, shareIntent] = await Promise.all([
      read(['sessionSourceMedium'], ['sessions']),
      read(['sessionSourceMedium'], ['eventCount'], 'affiliate_click'),
      read(['pagePath'], ['eventCount'], 'comparison_navigation'),
      read(['pagePath'], ['eventCount'], 'share_intent'),
    ]);
    report.ga4 = { status: 'ok', sessions, affiliateClicks, comparisons, shareIntent, affiliateCommission: { status: 'not_connected', note: 'Clicks are not orders or approved commission. Reconcile ASP confirmed reports separately.' } };
  } catch (e) { report.ga4 = { status: 'unavailable', ...safeError(e) }; }
}
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/search-acquisition.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

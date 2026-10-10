const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('scripts/fetch-ga4-analytics.ts', 'utf8');

test('GA4 script transpiles without syntax diagnostics', () => {
  const result = ts.transpileModule(source, {
    fileName: 'fetch-ga4-analytics.ts',
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  assert.deepEqual((result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).map(d => d.messageText), []);
});

test('API errors are explicitly tracked and not treated as zero clicks', () => {
  assert.match(source, /affiliateClicksStatus = 'error'/);
  assert.match(source, /affiliateClicksStatus === 'ok'/);
  assert.match(source, /autoReviewStale: !clickDataReady/);
});

test('old automatic findings and manual findings survive error fallback', () => {
  assert.match(source, /previousAutoArticles = \(existing\.flaggedArticles \?\? \[\]\)\.filter/);
  assert.match(source, /: previousAutoArticles;/);
  assert.match(source, /flaggedArticles = \[\.\.\.autoArticles, \.\.\.manualArticles\]/);
  assert.match(source, /dataDateRange: clickDataReady \? lensNaviSite\?\.dateRange \?\? null : previousReviewDateRange/);
});

const vm = require('node:vm');

// Exercise the real TypeScript decision block using transpilation and an isolated
// context. No GA4 credentials, network calls, or production writes are required.
const blockStart = source.indexOf('  const clickDataReady =');
const blockEnd = source.indexOf('  for (const rp of reviewPaths)', blockStart);
assert.ok(blockStart >= 0 && blockEnd > blockStart, 'review decision block is present');
const decisionBlock = ts.transpileModule(source.slice(blockStart, blockEnd), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

function evaluateReview(site, oldAuto, manual, oldRange) {
  const context = {
    lensNaviSite: site,
    previousAutoArticles: oldAuto,
    manualArticles: manual,
    previousReviewDateRange: oldRange,
    contentLog: { columns: [] },
    existingStatuses: {},
    existingPriorities: {},
    detectFlaggedColumns: () => [{ source: 'auto-ga4', slug: 'new', status: '未対応' }],
    console: { warn() {} },
    Date,
  };
  return JSON.parse(vm.runInNewContext(decisionBlock + '\nJSON.stringify(columnReview)', context));
}

test('GA4 click failure keeps previous automatic and manual findings and date range', () => {
  const result = evaluateReview(
    { affiliateClicksStatus: 'error', dateRange: { start: 'new', end: 'new' } },
    [{ source: 'auto-ga4', slug: 'old', status: '様子見' }],
    [{ source: 'manual', slug: 'manual', status: '未対応' }],
    { start: 'old-start', end: 'old-end' },
  );
  assert.deepEqual(result.flaggedArticles.map(a => a.slug), ['old', 'manual']);
  assert.deepEqual(result.dataDateRange, { start: 'old-start', end: 'old-end' });
  assert.equal(result.affiliateClicksStatus, 'error');
  assert.equal(result.autoReviewStale, true);
});

test('missing lens-navi site also keeps old findings', () => {
  const result = evaluateReview(
    undefined,
    [{ source: 'auto-ga4', slug: 'old', status: '様子見' }],
    [{ source: 'manual', slug: 'manual', status: '未対応' }],
    { start: 'old-start', end: 'old-end' },
  );
  assert.deepEqual(result.flaggedArticles.map(a => a.slug), ['old', 'manual']);
  assert.equal(result.autoReviewStale, true);
});

test('successful click fetch refreshes automatic findings but retains manual findings', () => {
  const result = evaluateReview(
    { affiliateClicksStatus: 'ok', dateRange: { start: 'fresh-start', end: 'fresh-end' }, topPages: [], affiliateClicksByPage: {} },
    [{ source: 'auto-ga4', slug: 'old', status: '様子見' }],
    [{ source: 'manual', slug: 'manual', status: '未対応' }],
    { start: 'old-start', end: 'old-end' },
  );
  assert.deepEqual(result.flaggedArticles.map(a => a.slug), ['new', 'manual']);
  assert.deepEqual(result.dataDateRange, { start: 'fresh-start', end: 'fresh-end' });
  assert.equal(result.affiliateClicksStatus, 'ok');
  assert.equal(result.autoReviewStale, false);
});

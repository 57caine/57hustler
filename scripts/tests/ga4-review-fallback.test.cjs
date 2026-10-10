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

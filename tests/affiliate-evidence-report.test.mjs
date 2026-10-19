import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function report(overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'lens-evidence-'));
  try {
    const path = join(dir, 'ga4.json');
    writeFileSync(path, JSON.stringify({ generatedAt: new Date().toISOString(), sites: [{
      siteName: 'lens-navi', affiliateClicksStatus: 'ok',
      affiliateClicksByPage: { '/category/1day': 12 }, affiliateClicksTotal: 81,
      ...overrides,
    }] }));
    const env = { ...process.env, GA4_REPORT_PATH: path };
    delete env.GITHUB_STEP_SUMMARY;
    return spawnSync(process.execPath, ['scripts/report-affiliate-evidence.mjs'], { env, encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('truncated page list does not undercount the full GA4 total', () => {
  const result = report();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /GA4 ungrouped total\): 81/);
  assert.match(result.stdout, /Listed page subtotal.*: 12/);
  assert.match(result.stdout, /Commission and attribution: NOT VERIFIED/);
});
test('verified zero is valid', () => {
  const result = report({ affiliateClicksTotal: 0, affiliateClicksByPage: {} });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /GA4 ungrouped total\): 0/);
});
test('missing or invalid totals never fall back to subtotal or zero', () => {
  for (const total of [undefined, null, -1, 1.5, '81']) {
    const result = report({ affiliateClicksTotal: total });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ungrouped affiliate_click total unavailable/);
  }
});
test('inconsistent or malformed page counts fail explicitly', () => {
  for (const counts of [{ '/': 82 }, { '/': -1 }, { '/': '12' }, { '/': 1.5 }]) {
    const result = report({ affiliateClicksByPage: counts });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /subtotal exceeds|Invalid page click counts/);
  }
});

test('comparison intent is displayed separately from affiliate clicks and sales', () => {
  const result = report({singleBoxComparisonClicks:{status:'ok',total:7}});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1day single-box comparison events: 7/);
  assert.match(result.stdout, /GA4 ungrouped total\): 81/);
  assert.match(result.stdout, /Comparison events are not outbound clicks/);
});
test('comparison query failure and legacy snapshots are unavailable, never zero', () => {
  for (const comparison of [undefined, {status:'error',total:null}, {status:'ok',total:-1}]) {
    const result = report({singleBoxComparisonClicks:comparison});
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1day single-box comparison events: unavailable/);
  }
});

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Production smoke test using only the existing dedicated RLS test account.
// Never print credentials, cookies, tokens, IDs, page HTML or account data.
const base = 'https://ceo-dashboard-alpha-livid.vercel.app';
const required = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'RLS_TEST_USER1_EMAIL', 'RLS_TEST_USER1_PASSWORD'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required secret: ${key}`);
}
const supabase = process.env.SUPABASE_URL.replace(/\/$/, '');
const marker = `CEO_HOME_E2E_${process.env.GITHUB_RUN_ID ?? Date.now()}_${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`;
const headers = { apikey: process.env.SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' };
let stage = 'test-account authentication';
let token;
let owner;
let browser;
let fixtureId;
let failed = false;

async function api(path, options = {}) {
  const response = await fetch(`${supabase}${path}`, {
    ...options,
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    signal: AbortSignal.timeout(30000),
  });
  assert.ok(response.ok, 'Supabase request failed');
  return response.status === 204 ? null : response.json();
}
const pass = (label) => console.log(`PASS: ${label}`);
const money = (value) => `¥${value.toLocaleString('ja-JP')}`;

try {
  const session = await api('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email: process.env.RLS_TEST_USER1_EMAIL, password: process.env.RLS_TEST_USER1_PASSWORD }),
  });
  token = session.access_token;
  owner = session.user.id;
  // Safety gate: a mistakenly configured owner account containing real data stops
  // the test before any browser writes. Existing marked test records are allowed.
  stage = 'fixture safety gate';
  const assets = await api(`/rest/v1/net_worth_items?select=id,label,kind,value_jpy&owner_id=eq.${owner}`);
  const properties = await api(`/rest/v1/real_estate_properties?select=id&owner_id=eq.${owner}`);
  assert.equal(properties.length, 0, 'Test account must have no property data');
  assert.ok(assets.every((row) => /^(RLS_TEST_TEMP|CEO_HOME_E2E_)/.test(row.label)), 'Test account contains non-test assets');
  const baseline = assets.reduce((sum, row) => sum + (row.kind === 'asset' ? Number(row.value_jpy) : -Number(row.value_jpy)), 0);
  pass('dedicated test-account safety gate');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  stage = 'unauthenticated protection';
  for (const path of ['/home', '/assets', '/assets/new']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/login');
  }
  pass('HOME and asset routes reject unauthenticated access');

  stage = 'browser login';
  await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[name="email"]').fill(process.env.RLS_TEST_USER1_EMAIL);
  await page.locator('input[name="password"]').fill(process.env.RLS_TEST_USER1_PASSWORD);
  // Wait for hydration before submitting the Server Action form.
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/home', { timeout: 45000 });
  await page.getByRole('heading', { name: 'CEO HOME', exact: true }).waitFor();
  pass('browser login opens HOME');

  stage = 'mobile navigation';
  await page.getByRole('link', { name: '🏠 HOME', exact: true }).waitFor();
  const logout = page.getByRole('button', { name: '🚪 ログアウト', exact: true });
  assert.ok(await logout.isVisible());
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.getByRole('link', { name: '今日やることを見る →', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/today');
  await page.getByRole('link', { name: '🏠 HOME', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/home');
  pass('mobile HOME/TODAY navigation and visible logout');

  stage = 'asset registration';
  await page.goto(`${base}/assets/new`, { waitUntil: 'networkidle' });
  await page.locator('[name="label"]').fill(marker);
  await page.locator('[name="category"]').selectOption('cash');
  await page.locator('[name="kind"]').selectOption('asset');
  await page.locator('[name="value_jpy"]').fill('12345');
  await page.locator('[name="as_of_date"]').fill('2026-10-12');
  await page.locator('[name="source"]').selectOption('assumption');
  await page.getByRole('button', { name: '登録する', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/assets');
  await page.getByText(marker, { exact: true }).waitFor();
  const created = await api(`/rest/v1/net_worth_items?select=id,value_jpy&owner_id=eq.${owner}&label=eq.${encodeURIComponent(marker)}`);
  assert.equal(created.length, 1);
  fixtureId = created[0].id;
  assert.equal(Number(created[0].value_jpy), 12345);
  pass('UI registration persists exactly one test asset');

  async function homeReflects(amount) {
    await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
    const wealth = page.locator('div.rounded-xl').filter({ has: page.getByText('💰 TOTAL WEALTH', { exact: true }) });
    await wealth.getByText(money(baseline + amount), { exact: true }).waitFor();
  }
  stage = 'HOME after registration';
  await homeReflects(12345);
  pass('HOME reflects registered asset');

  stage = 'asset edit';
  await page.goto(`${base}/assets/${fixtureId}/edit`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[name="label"]').inputValue(), marker);
  await page.locator('[name="value_jpy"]').fill('23456');
  await page.getByRole('button', { name: '更新する', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/assets');
  const updated = await api(`/rest/v1/net_worth_items?select=value_jpy&owner_id=eq.${owner}&id=eq.${fixtureId}`);
  assert.equal(Number(updated[0].value_jpy), 23456);
  await homeReflects(23456);
  pass('UI edit persists and HOME reflects changed amount');

  stage = 'asset delete';
  await page.goto(`${base}/assets/${fixtureId}/delete`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: '削除の確認', exact: true }).waitFor();
  await page.getByText(marker, { exact: true }).waitFor();
  await page.getByRole('button', { name: '削除する', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/assets' && url.searchParams.get('deleted') === '1');
  assert.equal(await page.getByText(marker, { exact: true }).count(), 0);
  const deleted = await api(`/rest/v1/net_worth_items?select=id&owner_id=eq.${owner}&label=eq.${encodeURIComponent(marker)}`);
  assert.equal(deleted.length, 0);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  if (assets.length === 0) await page.getByText('資産・不動産データがまだ登録されていません', { exact: true }).waitFor();
  else await homeReflects(0);
  pass('UI delete removes test asset and restores HOME baseline');

  stage = 'logout';
  await page.getByRole('button', { name: '🚪 ログアウト', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/login');
  await page.goto(`${base}/assets`, { waitUntil: 'networkidle' });
  assert.equal(new URL(page.url()).pathname, '/login');
  pass('logout restores authentication protection');
} catch {
  failed = true;
  console.error(`FAIL: ${stage} (sensitive diagnostics intentionally omitted)`);
} finally {
  // Cleanup only this run's unique marker under this authenticated test owner.
  if (token && owner) {
    try {
      await api(`/rest/v1/net_worth_items?owner_id=eq.${owner}&label=eq.${encodeURIComponent(marker)}`, { method: 'DELETE' });
      const remaining = await api(`/rest/v1/net_worth_items?select=id&owner_id=eq.${owner}&label=eq.${encodeURIComponent(marker)}`);
      assert.equal(remaining.length, 0);
      pass('cleanup verified: no test fixture remains');
    } catch {
      failed = true;
      console.error('FAIL: fixture cleanup');
    }
  }
  if (browser) await browser.close();
}
console.log(`RESULT: ${failed ? 'FAIL' : 'PASS'}`);
process.exitCode = failed ? 1 : 0;

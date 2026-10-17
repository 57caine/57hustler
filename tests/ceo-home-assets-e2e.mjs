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
let settingsCreated = false;

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
  for (const table of ['family_members', 'education_costs', 'future_expenses', 'income_streams', 'owner_settings']) {
    const rows = await api(`/rest/v1/${table}?select=*&owner_id=eq.${owner}`);
    assert.equal(rows.length, 0, 'Test account must have no existing personal records');
  }
  pass('dedicated test-account safety gate');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  stage = 'unauthenticated protection';
  for (const path of ['/home', '/assets', '/assets/new', ...['family', 'education', 'expenses', 'income', 'properties', 'settings'].map((section) => `/home/manage/${section}`)]) {
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

  // Wait for this code's production deployment before exercising the new forms.
  stage = 'management UI deployment readiness';
  for (let attempt = 0; attempt < 36; attempt++) {
    await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
    if (await page.getByRole('heading', { name: '🕊️ 自由への距離', exact: true }).count()) break;
    if (attempt === 35) throw new Error('Management UI not deployed');
    await page.waitForTimeout(5000);
  }
  await page.getByText('生活費または収入が未入力です', { exact: true }).waitFor();
  pass('missing input is not shown as zero income');

  stage = 'mobile navigation';
  await page.getByRole('link', { name: '🏠 ホーム', exact: true }).waitFor();
  const logout = page.getByRole('button', { name: '🚪 ログアウト', exact: true });
  assert.ok(await logout.isVisible());
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.getByRole('link', { name: '今日やることを見る →', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/today');
  await page.getByRole('link', { name: '🏠 ホーム', exact: true }).click();
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
    const wealth = page.locator('div.rounded-xl').filter({ has: page.getByText('💰 純資産', { exact: true }) });
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
  await page.goto(`${base}/assets/${fixtureId}/edit`, { waitUntil: 'networkidle' });
  await page.locator('[name="value_jpy"]').fill('0');
  await page.getByRole('button', { name: '更新する', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/assets');
  await homeReflects(0);
  pass('a registered zero-value asset remains visible as zero');

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
  if (assets.length === 0) await page.getByText('現在の資産・負債がまだ登録されていません', { exact: true }).waitFor();
  else await homeReflects(0);
  pass('UI delete removes test asset and restores HOME baseline');


  async function manage(section, fields, id) {
    await page.goto(`${base}/home/manage/${section}${id ? `?edit=${id}` : ''}`, { waitUntil: 'networkidle' });
    for (const [name, value] of Object.entries(fields)) {
      const input = page.locator(`[name="${name}"]`);
      if (await input.evaluate((el) => el.tagName === 'SELECT')) await input.selectOption(String(value));
      else await input.fill(String(value));
    }
    const button = page.getByRole('button', { name: id ? '更新する' : '登録する', exact: true });
    await button.click();
    await page.getByRole('status').getByText('保存しました', { exact: true }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }
  async function ownRow(table, key = 'label') {
    const rows = await api(`/rest/v1/${table}?select=*&owner_id=eq.${owner}&${key}=eq.${encodeURIComponent(marker)}`);
    assert.equal(rows.length, 1);
    return rows[0];
  }
  async function removeRecord(section, id) {
    await page.goto(`${base}/home/manage/${section}?delete=${id}`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: '削除の確認', exact: true }).waitFor();
    await page.getByRole('button', { name: '削除する', exact: true }).click();
    await page.getByRole('status').getByText('削除しました', { exact: true }).waitFor();
  }
  stage = 'family and education forms';
  await manage('family', { name: marker, birth_year: 2018 });
  const member = await ownRow('family_members', 'name');
  await manage('family', { name: marker, birth_year: 2019 }, member.id);
  assert.equal((await ownRow('family_members', 'name')).birth_year, 2019);
  await manage('education', { family_member_id: member.id, label: marker, estimated_jpy: 300000, target_year: 2033 });
  const education = await ownRow('education_costs');
  await manage('education', { estimated_jpy: 400000 }, education.id);
  assert.equal(Number((await ownRow('education_costs')).estimated_jpy), 400000);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('準備済み ¥0 ／ 必要額 ¥400,000', { exact: true }).waitFor();
  await manage('education', { estimated_jpy: 0 }, education.id);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('教育費の必要額が0円のため、準備率は表示していません', { exact: true }).waitFor();
  await removeRecord('education', education.id);
  await manage('education', { family_member_id: member.id, label: marker, estimated_jpy: 100000 });
  await page.goto(`${base}/home/manage/family?delete=${member.id}`, { waitUntil: 'networkidle' });
  await page.getByText('この家族に登録した教育費も一緒に削除されます（1件）。', { exact: true }).waitFor();
  await page.getByRole('button', { name: '削除する', exact: true }).click();
  await page.getByRole('status').getByText('削除しました', { exact: true }).waitFor();
  assert.equal((await api(`/rest/v1/education_costs?select=id&owner_id=eq.${owner}&label=eq.${encodeURIComponent(marker)}`)).length, 0);
  pass('family and education CRUD, HOME totals and cascade warning');

  stage = 'future expense forms';
  await manage('expenses', { label: marker, category: 'housing', estimated_jpy: 500000, target_year: 2030 });
  const expense = await ownRow('future_expenses');
  await manage('expenses', { estimated_jpy: 600000 }, expense.id);
  assert.equal(Number((await ownRow('future_expenses')).estimated_jpy), 600000);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText(`${marker}：¥600,000（2030年）`, { exact: true }).waitFor();
  await removeRecord('expenses', expense.id);
  pass('future expense CRUD and HOME reflection');

  stage = 'living cost and income forms';
  settingsCreated = true;
  await manage('settings', { living_cost_monthly_jpy: 100000 });
  await manage('settings', { living_cost_monthly_jpy: 120000 }, 'settings');
  const settings = await api(`/rest/v1/owner_settings?select=living_cost_monthly_jpy&owner_id=eq.${owner}`);
  assert.equal(Number(settings[0].living_cost_monthly_jpy), 120000);
  await manage('income', { label: marker, type: 'automated', monthly_jpy: 60000, automation_level: 'full', stability: 'stable' });
  const income = await ownRow('income_streams');
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('50.00%', { exact: true }).waitFor();
  await manage('income', { monthly_jpy: 72000 }, income.id);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('60.00%', { exact: true }).waitFor();
  await manage('income', { monthly_jpy: 0 }, income.id);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('0.00%', { exact: true }).waitFor();
  await page.getByText('給与以外の収入が0円のため、割合は表示していません', { exact: true }).waitFor();
  await manage('settings', { living_cost_monthly_jpy: 0 }, 'settings');
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('生活費が0円のため、達成率は表示していません', { exact: true }).waitFor();
  pass('zero education, income and living costs have distinct explanations');
  await removeRecord('income', income.id);
  await removeRecord('settings', 'settings');
  settingsCreated = false;
  pass('living cost and income CRUD and freedom calculation');

  stage = 'property forms';
  await manage('properties', { name: marker, property_value_jpy: 2000000, loan_balance_jpy: 500000, data_type: 'plan', as_of_date: '2026-10-12' });
  const property = await ownRow('real_estate_properties', 'name');
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  await page.getByText('現在の資産・負債がまだ登録されていません', { exact: true }).waitFor();
  await manage('properties', { data_type: 'actual' }, property.id);
  await page.goto(`${base}/home`, { waitUntil: 'networkidle' });
  const wealth = page.locator('div.rounded-xl').filter({ has: page.getByText('💰 純資産', { exact: true }) });
  await wealth.getByText(money(baseline + 1500000), { exact: true }).waitFor();
  await removeRecord('properties', property.id);
  pass('property CRUD: future plans excluded, current net worth reflected');

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
      for (const [table, key] of [['education_costs', 'label'], ['family_members', 'name'], ['future_expenses', 'label'], ['income_streams', 'label'], ['real_estate_properties', 'name']]) {
        await api(`/rest/v1/${table}?owner_id=eq.${owner}&${key}=eq.${encodeURIComponent(marker)}`, { method: 'DELETE' });
        const rows = await api(`/rest/v1/${table}?select=id&owner_id=eq.${owner}&${key}=eq.${encodeURIComponent(marker)}`);
        assert.equal(rows.length, 0);
      }
      if (settingsCreated) {
        await api(`/rest/v1/owner_settings?owner_id=eq.${owner}`, { method: 'DELETE' });
        assert.equal((await api(`/rest/v1/owner_settings?select=owner_id&owner_id=eq.${owner}`)).length, 0);
      }
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

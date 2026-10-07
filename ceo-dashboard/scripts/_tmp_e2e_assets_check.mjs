// 一時スクリプト: STEP5-1 /assets のE2E動作確認(架空データのみ)。
// 確認後に削除する(本番コードには含めない)。
// ブラウザ(Playwright)で実際のログイン→/assets/new→編集→削除の一連の操作を
// 本物のUI経由で行い、REST(PostgREST)直叩きで事前/事後のDB状態も確認する。
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const EMAIL = process.env.RLS_TEST_USER1_EMAIL;
const PASSWORD = process.env.RLS_TEST_USER1_PASSWORD;
const MARKER = 'E2E_ASSETS_TEMP';

let FAIL = 0;
function check(name, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) FAIL++;
}
function mask(v) {
  if (v) console.log(`::add-mask::${v}`);
}

async function restLogin() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const json = await res.json();
  mask(json.access_token);
  mask(json.user?.id);
  return json.access_token;
}

async function restCleanup(token) {
  await fetch(`${SUPABASE_URL}/rest/v1/net_worth_items?label=eq.${MARKER}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
}

async function restCount(token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/net_worth_items?label=eq.${MARKER}&select=id`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return Array.isArray(json) ? json.length : -1;
}

(async () => {
  const token = await restLogin();
  if (!token) {
    console.log('FATAL: REST経由のログインに失敗しました');
    process.exit(2);
  }
  await restCleanup(token); // 前回実行の残留があれば先に除去

  const browser = await chromium.launch();

  // I. 未認証では/assetsへアクセス不可(未ログインの別コンテキスト)
  const unauthCtx = await browser.newContext();
  const unauthPage = await unauthCtx.newPage();
  await unauthPage.goto(`${BASE_URL}/assets`, { waitUntil: 'domcontentloaded' });
  check('I. 未認証で/assetsへアクセス→/loginへリダイレクト', unauthPage.url().includes('/login'));
  await unauthCtx.close();

  const page = await browser.newPage();

  // 実際の/loginフォームからログイン(本物のUI経由)
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[name=email]', EMAIL);
  await page.fill('input[name=password]', PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForLoadState('networkidle');
  check('ログイン後、/loginから離脱している', !page.url().includes('/login'));

  // A. /assets正常表示
  await page.goto(`${BASE_URL}/assets`);
  const bodyBefore = await page.textContent('body');
  check('A. /assetsページが表示される(見出し確認)', bodyBefore.includes('ASSETS'));

  // B. 架空資産1件をUIから登録
  await page.goto(`${BASE_URL}/assets/new`);
  await page.fill('input[name=label]', MARKER);
  await page.fill('input[name=category]', 'テスト用カテゴリ');
  await page.selectOption('select[name=kind]', 'asset');
  await page.fill('input[name=value_jpy]', '1234567');
  await page.fill('input[name=as_of_date]', '2026-10-07');
  await page.selectOption('select[name=source]', 'user_input');
  await page.click('button[type=submit]');
  await page.waitForURL('**/assets', { timeout: 10000 });

  // C. 一覧へ反映
  const listText1 = await page.textContent('body');
  check('B/C. 登録した資産が一覧に反映される(ラベル)', listText1.includes(MARKER));
  check('B/C. 登録した資産が一覧に反映される(金額)', listText1.includes('1,234,567'));

  // D. /home TOTAL WEALTHへ反映
  await page.goto(`${BASE_URL}/home`);
  const homeText1 = await page.textContent('body');
  check('D. /home TOTAL WEALTHに反映される', homeText1.includes('1,234,567'));

  // E. UIから金額を編集
  await page.goto(`${BASE_URL}/assets`);
  const editHref = await page.locator('a:has-text("編集")').first().getAttribute('href');
  check('編集リンクを取得できる', !!editHref);
  await page.goto(`${BASE_URL}${editHref}`);
  await page.fill('input[name=value_jpy]', '2000000');
  await page.click('button[type=submit]');
  await page.waitForURL('**/assets', { timeout: 10000 });

  // F. 変更が一覧と/homeへ反映
  const listText2 = await page.textContent('body');
  check('F-1. 編集後の金額が一覧に反映される', listText2.includes('2,000,000'));
  await page.goto(`${BASE_URL}/home`);
  const homeText2 = await page.textContent('body');
  check('F-2. 編集後の金額が/homeへ反映される', homeText2.includes('2,000,000'));

  // G. UIから削除(確認ページ経由)
  await page.goto(`${BASE_URL}/assets`);
  const deleteHref = await page.locator('a:has-text("削除")').first().getAttribute('href');
  check('削除リンクを取得できる', !!deleteHref);
  await page.goto(`${BASE_URL}${deleteHref}`);
  const confirmText = await page.textContent('body');
  check('削除確認ページに対象データの内容が表示される', confirmText.includes(MARKER));
  await page.click('button:has-text("削除する")');
  await page.waitForURL('**/assets*', { timeout: 10000 });

  // H. 削除後0件(UI上)
  const listText3 = await page.textContent('body');
  check('H. 削除後、一覧にマーカーが残っていない', !listText3.includes(MARKER));

  await browser.close();

  // J. cleanup後0件(DB直接確認)
  const remaining = await restCount(token);
  check('J. cleanup後、DB上もマーカー付きデータが0件', remaining === 0);
  if (remaining !== 0) await restCleanup(token); // 保険

  console.log('');
  console.log('===== SUMMARY =====');
  console.log(`FAIL_COUNT=${FAIL}`);
  process.exit(FAIL > 0 ? 1 : 0);
})().catch((e) => {
  console.log('FATAL: ' + (e && e.message ? e.message : String(e)));
  process.exit(2);
});

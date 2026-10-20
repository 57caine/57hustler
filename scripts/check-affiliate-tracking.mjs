// Production-build browser check. External requests are blocked; GA4 calls are
// captured locally. These test clicks must never be reported as customer activity.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:3124';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3124'], { stdio: 'pipe' });
let log = '';
server.stdout.on('data', x => { log += x; });
server.stderr.on('data', x => { log += x; });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw Error(log);
    try { ready = (await fetch(base)).ok; } catch {}
    if (ready) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  assert.ok(ready, log);
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.route('**/*', r => new URL(r.request().url()).origin === base ? r.continue() : r.abort());
    await page.goto(`${base}/category/1day`);
    await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('a[href*="example.com"]').count(), 0, 'No placeholder purchase destinations');
    await page.evaluate(() => { window.__events = []; window.gtag = (...a) => window.__events.push(a); });
    const comparison = page.getByRole('link', { name: '1箱の価格・購入先を確認する →', exact: true }).first();
    const href = await comparison.getAttribute('href');
    await comparison.click();
    await page.waitForURL(`${base}${href}`);
    assert.ok(await page.locator('#price-comparison').isVisible());
    const comparisons = await page.evaluate(() => window.__events.filter(a => a[1] === 'single_box_comparison_click'));
    assert.equal(comparisons.length, 1);
    assert.equal(comparisons[0][2].source, 'category_1day');
    assert.equal(comparisons[0][2].product_id, 'acuvue-moist-1day');
    // Keep the real DOM's handlers but prevent merchant navigation.
    await page.evaluate(() => {
      window.__events = []; window.gtag = (...a) => window.__events.push(a);
      document.addEventListener('click', e => { if (e.target.closest?.('a[rel~="sponsored"]')) e.preventDefault(); }, true);
    });
    const purchase = viewport.width < 768
      ? page.getByRole('link', { name: 'このショップで1箱の価格を確認 →', exact: true }).first()
      : page.getByRole('link', { name: '価格を確認する →', exact: true }).first();
    const destination = await purchase.getAttribute('href');
    assert.equal(new URL(destination).hostname, 'px.a8.net');
    assert.ok(new URL(destination).searchParams.get('a8ejpredirect'));
    assert.equal(await purchase.getAttribute('data-affiliate-platform'), 'a8');
    await purchase.click();
    const out = await page.evaluate(() => window.__events.filter(a => a[1] === 'affiliate_click'));
    assert.equal(out.length, 1);
    assert.equal(out[0][2].affiliate_platform, 'a8');
    assert.equal(out[0][2].link_url, destination);
    for (const slug of ['contact-tsuuhan-shohosen-nashi-kanzen-guide', 'contact-dosu-shohosen-mikata-kanzen-2026']) {
      await page.goto(`${base}/column/${slug}`);
      const entry = page.getByRole('link', { name: 'ワンデーの1箱価格・購入先を比較 →', exact: true });
      assert.equal(await entry.getAttribute('href'), '/category/1day');
      await entry.click();
      await page.waitForURL(`${base}/category/1day`);
      assert.ok(await page.getByRole('link', { name: '1箱の価格・購入先を確認する →', exact: true }).first().isVisible());
    }
    console.log(`PASS ${viewport.width}px: guide → category → price table; one comparison event; one A8 event with exact destination; no placeholder links`);
    await page.close();
  }
} finally { await browser?.close(); server.kill('SIGTERM'); }

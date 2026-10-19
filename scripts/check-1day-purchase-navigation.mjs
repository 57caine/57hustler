// Local production-build check. Blocks all external requests and never clicks affiliate links.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:3123';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3123'], { stdio: 'pipe' });
let serverLog = '';
server.stdout.on('data', chunk => { serverLog += chunk; });
server.stderr.on('data', chunk => { serverLog += chunk; });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Local server stopped: ${serverLog}`);
    try { ready = (await fetch(`${base}/category/1day`)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, `Local server not ready: ${serverLog}`);
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.goto(`${base}/category/1day`);
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => typeof window.gtag === 'function');
    const cta = page.getByRole('link', { name: '1箱の価格・購入先を確認する →', exact: true }).first();
    await cta.waitFor({ state: 'visible' });
    const href = await cta.getAttribute('href');
    assert.match(href, /^\/product\/[^/#]+#price-comparison$/);
    await page.evaluate(() => { window.__comparisonEvents = []; window.gtag = (...args) => window.__comparisonEvents.push(args); });
    await cta.click();
    await page.waitForURL(`${base}${href}`);
    await page.locator('#price-comparison').waitFor({ state: 'visible' });
    const events = await page.evaluate(() => window.__comparisonEvents.filter(args => args[1] === 'single_box_comparison_click'));
    assert.equal(events.length, 1, `One comparison click must produce one comparison event: ${JSON.stringify(await page.evaluate(() => window.__comparisonEvents))}`);
    assert.equal(events[0][2].source, 'category_1day');
    assert.ok(events[0][2].product_id);
    assert.ok(await page.getByText('このショップで1箱の価格を確認 →', { exact: true }).count(), 'Destination must offer a single-box purchase CTA');
    for (const category of ['2week', 'monthly', 'color']) {
      await page.goto(`${base}/category/${category}`);
      assert.equal(await page.getByRole('link', { name: '1箱の価格・購入先を確認する →', exact: true }).count(), 0);
    }
    console.log(`PASS: ${viewport.width}px — 1day CTA, price anchor, one GA4 comparison event, other-category scope`);
    await page.close();
  }
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

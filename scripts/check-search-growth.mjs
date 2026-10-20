// Browser regression: no live GA4, ASP or Pinterest requests.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:3125';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3125'], { stdio: 'pipe' });
let logs = ''; server.stdout.on('data', x => logs += x); server.stderr.on('data', x => logs += x);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw Error(logs);
    try { ready = (await fetch(base)).ok; } catch {}
    if (ready) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  assert.ok(ready, logs);
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.goto(base + '/column/acuvue-zenkindai-hikaku');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      window.__events = []; window.gtag = (...args) => window.__events.push(args);
      document.addEventListener('click', e => { if (e.target.closest?.('a[data-growth-event="share_intent"]')) e.preventDefault(); }, true);
    });
    const pin = page.getByRole('link', { name: 'Pinterestに保存' });
    const pinUrl = new URL(await pin.getAttribute('href'));
    assert.equal(new URL(pinUrl.searchParams.get('url')).searchParams.get('utm_source'), 'pinterest');
    assert.equal(new URL(pinUrl.searchParams.get('media')).protocol, 'https:');
    await pin.click();
    let events = await page.evaluate(() => window.__events);
    assert.equal(events.filter(e => e[1] === 'share_intent').length, 1);
    assert.equal(events.filter(e => e[1] === 'affiliate_click').length, 0);
    const entry = page.getByRole('link', { name: 'ワンデーの1箱価格・購入先を比較 →', exact: true });
    await entry.click(); await page.waitForURL(base + '/category/1day');
    events = await page.evaluate(() => window.__events);
    assert.equal(events.filter(e => e[1] === 'comparison_navigation').length, 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://www.lens-navi.jp/category/1day');
    const comparison = page.getByRole('link', { name: '1箱の価格・購入先を確認する →', exact: true }).first();
    await comparison.click(); await page.waitForURL(/product/);
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /^https:\/\/www\.lens-navi\.jp\/product\//);
    assert.ok(await page.locator('#price-comparison').isVisible());
    console.log('PASS growth browser ' + width + 'px: share intent separated, UTM, article → category → single box, canonicals');
    await page.close();
  }
} finally { await browser?.close(); server.kill('SIGTERM'); }

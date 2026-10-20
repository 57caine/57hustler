// Local build only. Mock the recording endpoint and block merchants so these
// synthetic browser clicks never enter real sendout counts or commissions.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:3125';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3125'], { cwd: 'rakutabi', stdio: 'pipe' });
let log = ''; let browser;
server.stdout.on('data', x => { log += x; }); server.stderr.on('data', x => { log += x; });
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
  for (const scenario of [
    { query: '', ref: 'https://l.threads.com/', expected: 'threads' },
    { query: '?utm_source=instagram', ref: 'https://l.threads.com/', expected: 'instagram' },
    { query: '', ref: undefined, expected: 'unattributed' },
  ]) {
    const context = await browser.newContext(); const page = await context.newPage(); let payload;
    await page.route('**/*', async route => {
      const u = new URL(route.request().url());
      if (u.origin !== base) return route.abort();
      if (u.pathname === '/api/click') { payload = JSON.parse(route.request().postData()); return route.fulfill({ status: 204 }); }
      return route.continue();
    });
    await page.goto(`${base}/${scenario.query}`, { referer: scenario.ref });
    await page.waitForLoadState('networkidle');
    await page.locator('a[href="/theme/onsen"]').first().click();
    await page.waitForURL(`${base}/theme/onsen`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.addEventListener('click', e => { if (e.target.closest?.('a[rel~="sponsored"]')) e.preventDefault(); }, true));
    const request = page.waitForRequest(r => new URL(r.url()).pathname === '/api/click');
    await page.locator('a[rel~="sponsored"][data-hotel-no][data-placement]').first().click();
    await request;
    for (let i = 0; !payload && i < 20; i++) await new Promise(r => setTimeout(r, 50));
    assert.equal(payload?.trafficSource, scenario.expected);
    assert.ok(payload?.page.startsWith('/theme/'));
    console.log(`PASS: ${scenario.expected} attribution survives internal navigation; one mocked beacon`);
    await context.close();
  }
} finally { await browser?.close(); server.kill('SIGTERM'); }

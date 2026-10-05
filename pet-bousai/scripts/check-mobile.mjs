/**
 * 公開URLをスマホ幅（390x844）の実ブラウザで開いて確認する（GitHub Actions 上で実行）。
 *   node scripts/check-mobile.mjs <baseUrl>
 * - 横方向のはみ出し、12px未満の文字、ページエラー
 * - 商品画像（楽天APIの画像URL）が実際に読み込めているか
 * - 楽天リンクのクリックで GA4 イベント affiliate_click が正しいパラメータで1回送られるか
 *   （GA4 は未導入のため window.gtag を差し替えて記録する。楽天への遷移はテスト中は遮断する）
 * 問題があれば終了コード1。playwright はワークフロー内で一時的にインストールする（package.json には入れない）。
 */
import { chromium } from 'playwright';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
const PAGES = ['/', '/dog', '/cat', '/rabbit-guinea-pig', '/dog/carrier', '/cat/carrier', '/cat/toilet', '/bousai-set', '/checklist', '/about', '/privacy', '/sources'];

(async () => {
  const problems = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ja-JP' });
  await ctx.addInitScript(() => { window.__events = []; window.gtag = (...a) => window.__events.push(a); });
  await ctx.route('https://hb.afl.rakuten.co.jp/**', (r) => r.fulfill({ status: 200, body: 'blocked in test' }));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    // 遅延読み込みの画像を読ませるため最下部までスクロール
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
    await page.waitForLoadState('networkidle');
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1).map((el) => el.tagName);
      const small = [...document.querySelectorAll('p,li,a,span,td,th')].filter((el) => el.offsetParent && parseFloat(getComputedStyle(el).fontSize) < 12).length;
      const imgs = [...document.querySelectorAll('[data-product-section] img')];
      const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.src.slice(0, 80));
      const names = [...document.querySelectorAll('a[data-affiliate]')].map((a) => a.dataset.productName || '');
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, over: over.length, small, imgs: imgs.length, broken, emptyNames: names.filter((n) => !n.trim()).length };
    });
    console.log(`${p.padEnd(20)} 幅 ${r.scrollW}/${r.clientW} はみ出し${r.over} 12px未満${r.small} 商品画像 ${r.imgs - r.broken.length}/${r.imgs}件 読込OK`);
    if (r.scrollW > r.clientW) problems.push(`${p}: 横スクロールが発生（${r.scrollW}px）`);
    if (r.small) problems.push(`${p}: 12px未満の文字 ${r.small}件`);
    if (r.broken.length) problems.push(`${p}: 読み込めない商品画像 ${r.broken.length}件 ${r.broken.join(' ')}`);
    if (r.emptyNames) problems.push(`${p}: 商品名が空のリンク ${r.emptyNames}件`);
  }

  await page.goto(BASE + '/cat/carrier', { waitUntil: 'networkidle' });
  const link = page.locator('a[rel~="sponsored"]').first();
  const expected = await link.evaluate((a) => ({ name: a.dataset.productName, cat: a.dataset.productCategory, href: a.href }));
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
  await popup.close();
  const events = await page.evaluate(() => window.__events.filter((e) => e[0] === 'event' && e[1] === 'affiliate_click'));
  console.log('クリックした楽天リンク:', expected.href.slice(0, 90));
  console.log('affiliate_click:', JSON.stringify(events));
  const ev = events[0]?.[2];
  if (events.length !== 1 || !ev || ev.page_path !== '/cat/carrier' || ev.product_name !== expected.name || ev.product_category !== expected.cat || ev.destination !== 'rakuten') {
    problems.push('affiliate_click が期待どおりに送られていない');
  }
  if (errors.length) problems.push(`ページエラー: ${errors.join(' / ')}`);
  await browser.close();
  console.log(problems.length ? `\n問題 ${problems.length}件:\n- ${problems.join('\n- ')}` : '\nスマホ表示・計測チェック: 問題なし');
  process.exit(problems.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

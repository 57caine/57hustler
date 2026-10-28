/**
 * 公開URLをスマホ幅（390x844）の実ブラウザで開いて確認する（GitHub Actions 上で実行）。
 *   node scripts/check-mobile.mjs <baseUrl>
 * - 横方向のはみ出し、12px未満の文字、ページエラー
 * - 商品画像（楽天APIの画像URL）が実際に読み込めているか
 * - GA4（G-KPE1LBHFW7）: 各ページの表示で page_view が1回だけ送られるか（重複計測がないか）
 * - 楽天リンクのクリックで affiliate_click が正しいパラメータで1回送られるか
 *   GA4 への送信（/g/collect）はブラウザ内で捕まえて中身を確認し、Google には届けない（確認作業で実データを汚さないため）。
 *   楽天への遷移もテスト中は遮断する
 * 問題があれば終了コード1。playwright はワークフロー内で一時的にインストールする（package.json には入れない）。
 */
import { chromium } from 'playwright';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
const PAGES = ['/', '/dog', '/dog/evacuation-carrier', '/dog/water-food', '/dog/toilet', '/dog/checklist', '/cat', '/rabbit-guinea-pig', '/cat/carrier', '/cat/toilet', '/bousai-set', '/checklist', '/about', '/privacy', '/sources'];

(async () => {
  const problems = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ja-JP' });
  await ctx.route('https://hb.afl.rakuten.co.jp/**', (r) => r.fulfill({ status: 200, body: 'blocked in test' }));
  // GA4 の送信を捕まえる（1リクエストに複数イベントがまとめて入る場合は本文の各行が1イベント）
  const hits = [];
  await ctx.route(/google-analytics\.com\/g\/collect/, (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const base = Object.fromEntries(url.searchParams);
    const lines = (req.postData() || '').split('\n').filter(Boolean);
    if (lines.length === 0) hits.push(base);
    for (const line of lines) hits.push({ ...base, ...Object.fromEntries(new URLSearchParams(line)) });
    route.fulfill({ status: 204, body: '' });
  });
  const waitFor = async (pred, ms) => {
    for (let t = 0; t < ms; t += 250) { if (hits.some(pred)) return true; await new Promise((r) => setTimeout(r, 250)); }
    return hits.some(pred);
  };
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  for (const p of PAGES) {
    hits.length = 0;
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const isPv = (h) => h.en === 'page_view' && h.tid === 'G-KPE1LBHFW7' && new URL(h.dl || 'http://x/').pathname === p;
    await waitFor(isPv, 8000);
    await new Promise((r) => setTimeout(r, 1000)); // 重複送信がないかを見るため少し待つ
    const pv = hits.filter(isPv).length;
    const gaScripts = await page.evaluate(() => document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-KPE1LBHFW7"]').length);
    if (gaScripts !== 1) problems.push(`${p}: GA4スクリプトが ${gaScripts} 個読み込まれている（1個であるべき）`);
    console.log(`${p.padEnd(20)} GA4スクリプト ${gaScripts}個 / page_view ${pv}件（tid=G-KPE1LBHFW7）`);
    if (pv !== 1) problems.push(`${p}: page_view が ${pv} 件（1件であるべき）`);
    // 遅延読み込みの画像を読ませるため最下部までスクロール
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
    await page.waitForLoadState('networkidle');
    // 商品画像は1枚ずつ読み込み完了（最大15秒）を待ってから判定する
    await page.evaluate(() =>
      Promise.all(
        [...document.querySelectorAll('[data-product-section] img')].map((img) =>
          img.complete && img.naturalWidth > 0
            ? null
            : new Promise((resolve) => {
                img.loading = 'eager';
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, 15000);
              }),
        ),
      ),
    );
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

  const CLICK_PAGE = '/dog/evacuation-carrier';
  await page.goto(BASE + CLICK_PAGE, { waitUntil: 'networkidle' });
  await waitFor((h) => h.en === 'page_view', 8000);

  // 比較表の並べ替え（全列）が実際に動くか
  const table = page.locator('[data-comparison-table]').first();
  const firstNames = async () => table.locator('tbody tr td:nth-child(2) a').evaluateAll((as) => as.map((a) => a.dataset.itemId));
  const before = await firstNames();
  for (const key of ['name', 'type', 'shop', 'order']) {
    await table.locator(`button[data-sort-key="${key}"]`).click();
    const sortAttr = await table.locator(`button[data-sort-key="${key}"]`).evaluate((b) => b.closest('th').getAttribute('aria-sort'));
    if (sortAttr !== 'ascending') problems.push(`比較表: ${key} 列の並べ替えで aria-sort が ${sortAttr}`);
  }
  await table.locator('button[data-sort-key="order"]').click(); // 掲載順の降順
  const desc = await firstNames();
  console.log(`比較表の並べ替え: 掲載順(昇順)先頭=${before[0]} / 掲載順(降順)先頭=${desc[0]} / 行数=${before.length}`);
  if (before.length > 1 && (desc[0] !== before[before.length - 1])) problems.push('比較表: 掲載順の降順が正しくない');
  await table.locator('button[data-sort-key="order"]').click(); // 昇順に戻す

  // 比較表へのリンク → product_compare_click
  hits.length = 0;
  await page.locator('a[data-compare-link]').first().click();
  const isCompare = (h) => h.en === 'product_compare_click' && h.tid === 'G-KPE1LBHFW7';
  await waitFor(isCompare, 10000);
  const compares = hits.filter(isCompare);
  console.log('product_compare_click（GA4への送信内容）:', JSON.stringify(compares.map((h) => ({ en: h.en, page: new URL(h.dl || 'http://x/').pathname, link_location: h['ep.link_location'] }))));
  if (compares.length !== 1) problems.push(`product_compare_click が ${compares.length} 件（1件であるべき）`);

  // 比較表の楽天リンク → affiliate_click（商品ID・位置つき）
  hits.length = 0;
  const link = table.locator('a[rel~="sponsored"]').first();
  const expected = await link.evaluate((a) => ({ name: a.dataset.productName, cat: a.dataset.productCategory, id: a.dataset.itemId, pos: a.dataset.position, href: a.href }));
  const pageCount = ctx.pages().length;
  if (await link.getAttribute('target') === '_blank') problems.push('商品リンクが別タブ設定');
  await Promise.all([page.waitForURL(expected.href), link.click()]);
  if (ctx.pages().length !== pageCount) problems.push('商品クリックで余分なタブが開いた');
  const isClick = (h) => h.en === 'affiliate_click' && h.tid === 'G-KPE1LBHFW7';
  await waitFor(isClick, 10000);
  await new Promise((r) => setTimeout(r, 1500));
  const clicks = hits.filter(isClick);
  console.log('クリックした楽天リンク:', expected.href.slice(0, 90));
  // page_path は gtag の予約パラメータで独自項目としては送られないため、どのページのクリックかは
  // GA4 が全イベントに自動で付ける page_location（dl）で判定する（GA4 の「ページパス」はここから作られる）
  const pathOf = (h) => h['ep.page_path'] || (h.dp ?? '') || new URL(h.dl || 'http://x/').pathname;
  console.log('affiliate_click（GA4への送信内容）:', JSON.stringify(clicks.map((h) => ({ en: h.en, tid: h.tid, page: pathOf(h), item_id: h['ep.item_id'], position: h['ep.position'], product_name: h['ep.product_name'], product_category: h['ep.product_category'], destination: h['ep.destination'] }))));
  const ev = clicks[0];
  if (clicks.length !== 1 || pathOf(ev) !== CLICK_PAGE || ev['ep.item_id'] !== expected.id || ev['ep.position'] !== 'table' || ev['ep.product_name'] !== expected.name || ev['ep.product_category'] !== expected.cat || ev['ep.destination'] !== 'rakuten') {
    problems.push(`affiliate_click が期待どおりに送られていない（${clicks.length}件）`);
  }
  await page.goBack({ waitUntil: 'networkidle' });
  if (new URL(page.url()).pathname !== CLICK_PAGE) problems.push('戻る操作で比較記事に戻れない');

  // カードの購入導線も、外部通信を遮断して同じタブでの遷移・戻る・計測を確認。
  await page.goto(BASE + '/dog', { waitUntil: 'networkidle' });
  hits.length = 0;
  const card = page.locator('a[data-position="card"]').first();
  const cardExpected = await card.evaluate(a => ({ href: a.href, id: a.dataset.itemId }));
  const cardPageCount = ctx.pages().length;
  await Promise.all([page.waitForURL(cardExpected.href), card.click()]);
  await waitFor(isClick, 10000);
  const cardClicks = hits.filter(isClick);
  if (ctx.pages().length !== cardPageCount) problems.push('カードで余分なタブが開いた');
  if (cardClicks.length !== 1 || cardClicks[0]['ep.item_id'] !== cardExpected.id || cardClicks[0]['ep.position'] !== 'card') {
    problems.push(`カードのaffiliate_clickが期待どおりでない（${cardClicks.length}件）`);
  }
  await page.goBack({ waitUntil: 'networkidle' });
  if (new URL(page.url()).pathname !== '/dog') problems.push('戻る操作でカードの記事に戻れない');

  // 広告以外のリンク（環境省の出典）では送られないこと
  hits.length = 0;
  const src = page.locator('a[href^="https://www.env.go.jp"]').first();
  await src.evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()));
  await src.click();
  await new Promise((r) => setTimeout(r, 3000));
  const wrong = hits.filter((h) => h.en === 'affiliate_click').length;
  console.log(`出典リンククリック時の affiliate_click: ${wrong}件`);
  if (wrong) problems.push('広告以外のリンクで affiliate_click が送られた');
  if (errors.length) problems.push(`ページエラー: ${errors.join(' / ')}`);
  await browser.close();
  console.log(problems.length ? `\n問題 ${problems.length}件:\n- ${problems.join('\n- ')}` : '\nスマホ表示・計測チェック: 問題なし');
  process.exit(problems.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

/**
 * A8.net アフィリエイトリンク自動取得スクリプト
 * media-console.a8.net 対応版
 *
 * 環境変数: A8_EMAIL, A8_PASSWORD
 */

import { chromium, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ────────────────────────────────────────────
// プログラム名 → ストアID マッピング
// ────────────────────────────────────────────
const PROGRAM_MAP: Record<string, string> = {
  'レンズクイック':     'lensquick',
  'lensquick':          'lensquick',
  'スマイルコンタクト': 'smile',
  'smilecl':            'smile',
  'smile contact':      'smile',
  'アイシティ':          'eyecity',
  'eyecity':            'eyecity',
  'レンズアップ':        'lensclub',
  'lensup':             'lensclub',
  'プライムコンタクト':  'prime',
  'prime contact':      'prime',
};

interface StoreLink {
  storeId: string;
  programName: string;
  programId: string;
  affiliateUrl: string;
}

// ── ログイン ──────────────────────────────────────────────
async function login(page: Page, email: string, password: string): Promise<boolean> {
  console.log('A8.net にログイン中...');
  await page.goto('https://www.a8.net/a8v2/login.f8', { waitUntil: 'networkidle', timeout: 20000 });

  // ログイン済みならスキップ
  if (page.url().includes('media-console.a8.net') || page.url().includes('mypage')) {
    console.log('✅ 既にログイン済み');
    return true;
  }

  await page.fill('input[name="login_id"], input[type="email"], #login_id, input[id*="mail"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }),
    page.click('input[type="submit"], button[type="submit"], button:has-text("ログイン")'),
  ]);

  if (page.url().includes('login')) {
    console.error('❌ ログイン失敗');
    return false;
  }
  console.log('✅ ログイン成功:', page.url());
  return true;
}

// ── 参加中プログラム一覧からリンクを取得 ─────────────────
async function fetchLinks(context: BrowserContext): Promise<StoreLink[]> {
  const page = await context.newPage();
  const results: StoreLink[] = [];

  // 参加中プログラム一覧（新コンソール）
  console.log('\n参加中プログラムを取得中...');
  await page.goto(
    'https://media-console.a8.net/program/list/partnered?pageNo=1&pageSize=50&sortKey=APPROVED_DATE&sortOrder=DESC',
    { waitUntil: 'networkidle', timeout: 20000 }
  );

  // 全プログラムのIDとプログラム名を取得
  const programs = await page.evaluate(() => {
    const items: { programId: string; name: string }[] = [];

    // 「広告リンク作成」ボタンのhref からprogramIdを取得
    document.querySelectorAll('a[href*="create-link"]').forEach((el) => {
      const href = (el as HTMLAnchorElement).href;
      const m = href.match(/programId=([^&]+)/);
      if (!m) return;
      const programId = m[1];

      // 同じカード内のプログラム名を探す
      const card = el.closest('[class*="program"], [class*="card"], tr, li, article, section')
                   || el.parentElement?.parentElement;
      const name = card?.textContent?.trim().slice(0, 50) || '';
      items.push({ programId, name });
    });
    return items;
  });

  console.log(`  ${programs.length}件のプログラムを検出`);

  for (const prog of programs) {
    // プログラム名からストアIDを判定
    let matchedStoreId: string | null = null;
    let matchedKeyword = '';
    const lowerName = prog.name.toLowerCase();

    for (const [keyword, storeId] of Object.entries(PROGRAM_MAP)) {
      if (lowerName.includes(keyword.toLowerCase())) {
        matchedStoreId = storeId;
        matchedKeyword = keyword;
        break;
      }
    }
    if (!matchedStoreId) continue;

    // 既に取得済みならスキップ
    if (results.find((r) => r.storeId === matchedStoreId)) continue;

    console.log(`  → ${matchedKeyword} (${matchedStoreId}) のリンクを取得中...`);

    // 広告リンク作成ページへ
    const linkPage = await context.newPage();
    try {
      await linkPage.goto(
        `https://media-console.a8.net/program/create-link?programId=${prog.programId}`,
        { waitUntil: 'networkidle', timeout: 15000 }
      );

      // px.a8.netのURLを抽出
      const a8Url = await linkPage.evaluate((): string | null => {
        // リンクのhref
        for (const a of Array.from(document.querySelectorAll('a[href*="px.a8.net"]'))) {
          return (a as HTMLAnchorElement).href;
        }
        // テキストフィールドやコード表示内
        const texts = [
          ...Array.from(document.querySelectorAll('input, textarea, [class*="code"], [class*="link-url"]')),
        ];
        for (const el of texts) {
          const val = (el as HTMLInputElement).value || el.textContent || '';
          const m = val.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
          if (m) return m[1];
        }
        // ページ全体のテキストから正規表現で探す
        const m = document.body.innerText.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
        return m ? m[1] : null;
      });

      if (a8Url) {
        // a8ejpredirect より前の部分だけ保持
        const baseUrl = a8Url.split('&a8ejpredirect')[0];
        results.push({
          storeId: matchedStoreId,
          programName: matchedKeyword,
          programId: prog.programId,
          affiliateUrl: baseUrl,
        });
        console.log(`  ✅ 取得: ${baseUrl.slice(0, 70)}...`);
      } else {
        console.warn(`  ⚠️  URLが見つかりませんでした（${matchedKeyword}）`);
      }
    } catch (e) {
      console.warn(`  ⚠️  エラー: ${e}`);
    } finally {
      await linkPage.close();
    }
  }

  await page.close();
  return results;
}

// ── products.json を更新 ───────────────────────────────────
function updateProductsJson(links: StoreLink[]): void {
  if (links.length === 0) return;
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const store of data.stores) {
    const found = links.find((l) => l.storeId === store.id);
    if (found) {
      store.url = found.affiliateUrl;
      store.affiliateParam = '';
      store.affiliateUpdatedAt = new Date().toISOString();
      console.log(`  stores[${store.id}].url → ${found.affiliateUrl.slice(0, 60)}...`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ data/products.json 更新完了');
}

// ── prices.json を更新 ────────────────────────────────────
function updatePricesJson(links: StoreLink[]): void {
  if (links.length === 0) return;
  const filePath = path.join(process.cwd(), 'data', 'prices.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let updated = 0;
  for (const price of data.prices) {
    const found = links.find((l) => l.storeId === price.storeId);
    if (found) {
      price.url = found.affiliateUrl;
      updated++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ data/prices.json 更新完了（${updated}件）`);
}

// ── メイン ────────────────────────────────────────────────
(async () => {
  const email    = process.env.A8_EMAIL;
  const password = process.env.A8_PASSWORD;
  if (!email || !password) {
    throw new Error('環境変数 A8_EMAIL と A8_PASSWORD が必要です');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });

  try {
    const page = await context.newPage();
    const ok = await login(page, email, password);
    await page.close();
    if (!ok) process.exit(1);

    console.log('\n=== アフィリエイトリンク取得開始 ===');
    const links = await fetchLinks(context);
    console.log(`\n取得結果: ${links.length}件`);
    links.forEach((l) => console.log(`  ${l.storeId}: ${l.affiliateUrl.slice(0, 60)}...`));

    if (links.length > 0) {
      console.log('\n=== データ更新 ===');
      updateProductsJson(links);
      updatePricesJson(links);
    }

    console.log('\n=== 完了 ===');
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });

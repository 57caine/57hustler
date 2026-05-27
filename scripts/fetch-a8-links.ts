/**
 * A8.net アフィリエイトリンク自動取得スクリプト
 *
 * GitHub Actionsから実行。
 * 環境変数: A8_EMAIL, A8_PASSWORD
 *
 * 処理フロー:
 *  1. A8.netにログイン
 *  2. 承認済みプログラムのテキストリンクを取得
 *  3. data/products.json の各ショップURLを更新
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ────────────────────────────────────────────
// 設定：A8プログラム名 → 当サイトのストアID マッピング
// A8の「プログラム名」に含まれるキーワードで対応
// ────────────────────────────────────────────
const PROGRAM_MAP: Record<string, string> = {
  'スマイルコンタクト': 'smile',
  'smilecl':           'smile',
  'smile contact':     'smile',
  'アイシティ':         'eyecity',
  'eyecity':           'eyecity',
  'レンズアップクラブ': 'lensclub',
  'lensup':            'lensclub',
  'プライムコンタクト': 'prime',
  'prime contact':     'prime',
};

interface StoreLink {
  storeId: string;
  programName: string;
  affiliateUrl: string; // px.a8.net ベースURL
}

async function fetchA8Links(): Promise<StoreLink[]> {
  const email    = process.env.A8_EMAIL;
  const password = process.env.A8_PASSWORD;

  if (!email || !password) {
    throw new Error('環境変数 A8_EMAIL と A8_PASSWORD が必要です');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });
  const page = await context.newPage();
  const results: StoreLink[] = [];

  try {
    // ── 1. ログイン ──────────────────────────────────────
    console.log('A8.net にログイン中...');
    await page.goto('https://www.a8.net/a8v2/login.f8', { waitUntil: 'networkidle' });

    await page.fill('input[name="login_id"], input[type="email"], #login_id', email);
    await page.fill('input[name="password"], input[type="password"], #password', password);
    await page.click('input[type="submit"], button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });

    const url = page.url();
    if (url.includes('login')) {
      throw new Error('ログイン失敗。メールアドレスまたはパスワードを確認してください。');
    }
    console.log('✅ ログイン成功');

    // ── 2. 承認済みプログラム一覧ページへ ────────────────
    console.log('承認済みプログラムを取得中...');
    await page.goto(
      'https://www.a8.net/a8v2/asDetail.f8?type=1', // 参加中プログラム一覧
      { waitUntil: 'networkidle', timeout: 20000 }
    );

    // ── 3. 各プログラムのリンクを取得 ───────────────────
    // A8はページネーションがある場合があるため、全ページを走査
    let hasNextPage = true;
    while (hasNextPage) {
      const rows = await page.$$('table.program-list tr, .program-item, [class*="program"]');

      for (const row of rows) {
        const text = (await row.innerText().catch(() => '')).toLowerCase();

        // マッピングされたショップかチェック
        let matchedStoreId: string | null = null;
        let matchedProgramName = '';
        for (const [keyword, storeId] of Object.entries(PROGRAM_MAP)) {
          if (text.includes(keyword.toLowerCase())) {
            matchedStoreId = storeId;
            matchedProgramName = keyword;
            break;
          }
        }
        if (!matchedStoreId) continue;

        // 「広告リンク」ページへのリンクを探す
        const linkEl = await row.$('a[href*="asLink"], a[href*="ad_link"], a:has-text("広告リンク"), a:has-text("リンク取得")');
        if (!linkEl) continue;

        const href = await linkEl.getAttribute('href');
        if (!href) continue;

        const linkPageUrl = href.startsWith('http') ? href : `https://www.a8.net${href}`;

        // 広告リンクページを新タブで開く
        const linkPage = await context.newPage();
        try {
          await linkPage.goto(linkPageUrl, { waitUntil: 'networkidle', timeout: 15000 });

          // テキストリンク or バナーリンクからpx.a8.netのURLを抽出
          const a8Url = await linkPage.evaluate((): string | null => {
            // テキストリンクのhrefを探す
            const anchors = Array.from(document.querySelectorAll('a[href*="px.a8.net"]'));
            if (anchors.length > 0) {
              return (anchors[0] as HTMLAnchorElement).href;
            }
            // inputやtextareaのvalue内のURLを探す
            const inputs = Array.from(
              document.querySelectorAll('input[value*="px.a8.net"], textarea')
            );
            for (const el of inputs) {
              const val = (el as HTMLInputElement).value;
              const m = val.match(/(https:\/\/px\.a8\.net[^\s"'<>]+)/);
              if (m) return m[1];
            }
            return null;
          });

          if (a8Url) {
            // a8ejpredirect以降を除き、ベースURLのみ保存
            const baseUrl = a8Url.split('&a8ejpredirect')[0];
            results.push({
              storeId: matchedStoreId,
              programName: matchedProgramName,
              affiliateUrl: baseUrl,
            });
            console.log(`  ✅ ${matchedProgramName} (${matchedStoreId}): ${baseUrl.slice(0, 60)}...`);
          }
        } catch (e) {
          console.warn(`  ⚠️  ${matchedProgramName} のリンク取得に失敗: ${e}`);
        } finally {
          await linkPage.close();
        }
      }

      // 次ページへ
      const nextBtn = await page.$('a:has-text("次へ"), a[rel="next"], .pagination .next');
      if (nextBtn) {
        await nextBtn.click();
        await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      } else {
        hasNextPage = false;
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

function buildAffiliateUrl(baseA8Url: string, destinationUrl: string): string {
  return `${baseA8Url}&a8ejpredirect=${encodeURIComponent(destinationUrl)}`;
}

async function updateProductsJson(links: StoreLink[]): Promise<void> {
  if (links.length === 0) {
    console.log('更新するリンクがありませんでした。');
    return;
  }

  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  // stores配列のaffiliateparamを更新
  for (const store of data.stores) {
    const found = links.find((l) => l.storeId === store.id);
    if (found) {
      // affiliateParam → 実際はURLに付与するパラメータではなくベースURLを保存
      store.affiliateBaseUrl = found.affiliateUrl;
      store.affiliateUpdatedAt = new Date().toISOString();
      console.log(`  stores.${store.id} を更新しました`);
    }
  }

  fs.writeFileSync(productsPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ data/products.json を更新しました（${links.length}件）`);
}

async function updatePricesJson(links: StoreLink[]): Promise<void> {
  if (links.length === 0) return;

  const pricesPath  = path.join(process.cwd(), 'data', 'prices.json');
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const pricesData  = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  // 各storeのデフォルトURLを取得
  const storeBaseUrls: Record<string, string> = {};
  for (const store of productsData.stores) {
    storeBaseUrls[store.id] = store.url;
  }

  for (const price of pricesData.prices) {
    const link = links.find((l) => l.storeId === price.storeId);
    if (link && price.url) {
      price.url = buildAffiliateUrl(link.affiliateUrl, price.url.split('?')[0]);
    }
  }

  fs.writeFileSync(pricesPath, JSON.stringify(pricesData, null, 2), 'utf-8');
  console.log(`✅ data/prices.json のURLをアフィリエイトリンクに更新しました`);
}

// ── メイン実行 ──────────────────────────────────────────
(async () => {
  try {
    console.log('=== A8.net アフィリエイトリンク自動取得 開始 ===');
    const links = await fetchA8Links();
    console.log(`\n取得結果: ${links.length}件`);

    await updateProductsJson(links);
    await updatePricesJson(links);

    console.log('\n=== 完了 ===');
    process.exit(0);
  } catch (err) {
    console.error('エラー:', err);
    process.exit(1);
  }
})();

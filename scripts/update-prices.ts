/**
 * 価格データ自動更新スクリプト（実スクレイパー版）
 *
 * product-url-map.json に登録された商品個別URLを直接スクレイピングして
 * 実際の価格を取得する。取得失敗時は既存価格を保持する。
 * Amazon / 楽天 は独自の仕組みのためスキップし、既存価格を維持。
 */

import { chromium, type BrowserContext, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface PriceRecord {
  productId: string;
  storeId: string;
  price: number;
  pricePerBox: number;
  boxes: number;
  lensCount: number;
  url: string;
  inStock: boolean;
  lastUpdated: string;
}

interface PricesData {
  updatedAt: string;
  prices: PriceRecord[];
}

// スキップするストア（スクレイピング非対応）
const SKIP_STORES = new Set(['amazon', 'rakuten']);

// 税込価格を文字列から抽出する（税込明示パターンを優先）
function extractPrice(text: string): number | null {
  if (!text) return null;

  // 優先パターン: 税込と明示されているもの
  const taxPatterns = [
    /(\d{1,2},\d{3})\s*円\s*[\(（]\s*税込[^\)）]*[\)）]/g,
    /(\d{3,5})\s*円\s*[\(（]\s*税込[^\)）]*[\)）]/g,
    /税込[^\d]*(\d{1,2},\d{3})/g,
    /税込[^\d]*(\d{3,5})/g,
    /[¥￥]\s*(\d{1,2},\d{3})\s*[\(（]\s*税込/g,
    /[¥￥]\s*(\d{3,5})\s*[\(（]\s*税込/g,
  ];
  for (const re of taxPatterns) {
    re.lastIndex = 0;
    const m = re.exec(text);
    if (m) {
      const val = parseInt((m[1] ?? '').replace(/,/g, ''), 10);
      if (val >= 500 && val <= 30000) return val;
    }
  }

  // フォールバック: ¥記号付きの価格（最初の一致）
  const yenPatterns = [
    /[¥￥]\s*(\d{1,2},\d{3})/,
    /[¥￥]\s*(\d{3,5})/,
    /(\d{1,2},\d{3})\s*円/,
  ];
  for (const re of yenPatterns) {
    const m = re.exec(text);
    if (m) {
      const val = parseInt((m[1] ?? '').replace(/,/g, ''), 10);
      if (val >= 500 && val <= 30000) return val;
    }
  }

  return null;
}

function getSelectorsForUrl(url: string): string[] {
  // PIDシステム (lensup/lenson/24lens/lensfine)
  if (
    url.includes('lensup.jp') || url.includes('lenson.jp') ||
    url.includes('24lens.jp') || url.includes('lensfine.jp')
  ) {
    return [
      '.item-price__tax', '.item-price', '.price__tax', '.tax-price',
      '[class*="tax-price"]', '[class*="item-price"]', '.price',
    ];
  }
  // GCシステム (lenszero/lensmode)
  if (url.includes('lenszero.com') || url.includes('lensmode.com')) {
    return ['.item_price', '.goods-price', '[class*="price"]', '.price'];
  }
  // 商品コードシステム (atlens/lensquick/atnetstyle)
  if (
    url.includes('atlens.jp') || url.includes('lensquick.jp') ||
    url.includes('atnetstyle.com')
  ) {
    return [
      '.item-price-block', '[class*="tax-price"]', '[class*="item-price"]',
      '[class*="tax"]', '[class*="price"]',
    ];
  }
  // lensmarche / lensbomber / tiara (shop_menu or lens-1day slug)
  if (
    url.includes('lensmarche.jp') || url.includes('lensbomber.biz') ||
    url.includes('tealla.jp')
  ) {
    return [
      '.price-box', '[class*="tax-price"]', '[class*="item-price"]',
      '[class*="price"]', '.price',
    ];
  }
  // lenschampion
  if (url.includes('lenschampion.jp')) {
    return ['[class*="price"]', '.price', '#price'];
  }
  // clearcontact (kurikon)
  if (url.includes('kurikon.co.jp')) {
    return [
      '.price_actual', '[class*="price_actual"]', '[class*="tax"]',
      '[class*="price"]', '.price',
    ];
  }
  // shopdetailシステム (famille/famiru, lensya/c-lensya)
  if (url.includes('famiru.com') || url.includes('c-lensya.com')) {
    return ['.price', '[class*="price"]', '#price'];
  }
  // aredz
  if (url.includes('aredz.com')) {
    return ['[class*="price"]', '.price', '#price'];
  }
  // eyelifecontact / e-scl (ilife / shonan)
  if (url.includes('eyelifecontact.com') || url.includes('e-scl.jp')) {
    return ['[class*="price"]', '[class*="tax"]', '.price'];
  }
  return ['[class*="tax-price"]', '[class*="item-price"]', '[class*="price"]', '.price', '#price'];
}

async function scrapePriceFromPage(page: Page, url: string): Promise<number | null> {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(600);

    for (const sel of getSelectorsForUrl(url)) {
      try {
        const count = await page.locator(sel).count();
        if (count > 0) {
          const text = await page.locator(sel).first().textContent();
          const price = extractPrice(text ?? '');
          if (price) return price;
        }
      } catch {}
    }

    // フォールバック: 税込を含む短い要素から優先的に抽出
    const snippets: string = await page.evaluate(() => {
      // 税込明示の要素を最優先
      const taxEls = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const t = el.textContent ?? '';
          return t.includes('税込') && t.length < 200 && el.children.length < 3;
        })
        .map(el => el.textContent ?? '');
      if (taxEls.length > 0) return taxEls.join('\n');

      // ¥記号のある短い要素
      return Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const t = el.textContent ?? '';
          return (t.includes('¥') || t.includes('￥')) && t.length < 100 && el.children.length < 3;
        })
        .map(el => el.textContent ?? '')
        .join('\n');
    });
    return extractPrice(snippets);
  } catch (e) {
    console.warn(`  ⚠ ${url.slice(0, 60)}: ${(e as Error).message?.slice(0, 80)}`);
    return null;
  }
}

async function scrapeAllPrices(
  urlMap: Record<string, Record<string, string>>,
): Promise<Map<string, number>> {
  const older = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
    (fs.existsSync(older) ? older : undefined);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    ...(executablePath ? { executablePath } : {}),
  });
  const context: BrowserContext = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });

  const priceResults = new Map<string, number>();
  const CONCURRENCY = 4;
  let totalOk = 0;
  let totalFail = 0;

  for (const [storeId, products] of Object.entries(urlMap)) {
    if (SKIP_STORES.has(storeId)) continue;

    const entries = Object.entries(products);
    if (entries.length === 0) continue;

    console.log(`\n[${storeId}] ${entries.length}商品...`);

    for (let i = 0; i < entries.length; i += CONCURRENCY) {
      const batch = entries.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(async ([productId, url]) => {
          const page = await context.newPage();
          try {
            return { productId, price: await scrapePriceFromPage(page, url) };
          } finally {
            await page.close();
          }
        }),
      );
      for (const { productId, price } of results) {
        if (price !== null) {
          priceResults.set(`${storeId}::${productId}`, price);
          console.log(`  ✓ ${productId}: ¥${price.toLocaleString()}`);
          totalOk++;
        } else {
          console.log(`  ✗ ${productId}: 取得失敗`);
          totalFail++;
        }
      }
    }
  }

  await browser.close();
  console.log(`\n取得: 成功 ${totalOk}件 / 失敗 ${totalFail}件`);
  return priceResults;
}

async function main(): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  const pricesPath = path.join(dataDir, 'prices.json');
  const urlMapPath = path.join(dataDir, 'product-url-map.json');

  const currentData: PricesData = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));
  const urlMap: Record<string, Record<string, string>> = JSON.parse(
    fs.readFileSync(urlMapPath, 'utf-8'),
  );

  console.log(`=== 価格スクレイピング開始: ${new Date().toISOString()} ===`);
  const scraped = await scrapeAllPrices(urlMap);

  const now = new Date().toISOString();
  let updated = 0;
  let kept = 0;

  const updatedPrices: PriceRecord[] = currentData.prices.map((record) => {
    if (SKIP_STORES.has(record.storeId)) {
      return { ...record, lastUpdated: now };
    }

    const newPrice = scraped.get(`${record.storeId}::${record.productId}`);
    if (!newPrice) {
      kept++;
      return { ...record, lastUpdated: now };
    }

    // 極端な異常値のみ除外（extractPrice で 500〜30000 は保証済み）
    // 10倍超かつ新価格が5000円超の場合のみ疑わしいと判断して保持
    const changeRatio = newPrice / record.price;
    if (record.price > 0 && changeRatio > 10 && newPrice > 5000) {
      console.warn(
        `  ⚠ 疑わしい値: ${record.storeId}/${record.productId} ¥${record.price}→¥${newPrice} (${changeRatio.toFixed(1)}x) → 保持`,
      );
      kept++;
      return { ...record, lastUpdated: now };
    }

    updated++;
    const pricePerBox = record.boxes > 1 ? Math.round(newPrice / record.boxes) : newPrice;
    console.log(`  更新: ${record.storeId}/${record.productId} ¥${record.price}→¥${newPrice}`);
    return { ...record, price: newPrice, pricePerBox, inStock: true, lastUpdated: now };
  });

  fs.writeFileSync(
    pricesPath,
    JSON.stringify({ updatedAt: now, prices: updatedPrices }, null, 2),
    'utf-8',
  );
  console.log(`\n=== 更新完了: 更新 ${updated}件 / 保持 ${kept}件 ===`);
}

main().catch((e) => { console.error(e); process.exit(1); });

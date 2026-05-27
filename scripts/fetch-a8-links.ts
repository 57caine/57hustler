/**
 * A8.net アフィリエイトリンク自動取得スクリプト（クッキー認証版）
 *
 * GitHub Actionsから実行。
 * 環境変数: A8_JSESSIONID
 *
 * JSESSIONIDはA8.netのmedia-consoleにログイン後、
 * 開発者ツール → Application → Cookies から取得。
 */

import { chromium } from 'playwright';
import type { Page } from 'playwright';
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
  'スマイル':           'smile',
  'アイシティ':          'eyecity',
  'eyecity':            'eyecity',
  'レンズアップ':        'lensclub',
  'lensup':             'lensclub',
  'プライムコンタクト':  'prime',
  'prime contact':      'prime',
  'チャームコンタクト':  'charm',
  'charm':              'charm',
  'コンタクトレンズ21': 'cl21',
  'コンタクト通販':     'lensquick',
};

interface StoreLink {
  storeId: string;
  programName: string;
  programId: string;
  affiliateUrl: string;
}

// ── クッキーを使ってページを認証 ─────────────────────────
async function getAuthenticatedPage(jsessionId: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });

  // JSESSIONIDをセット
  await context.addCookies([
    {
      name: 'JSESSIONID',
      value: jsessionId,
      domain: 'media-console.a8.net',
      path: '/',
      httpOnly: true,
      secure: true,
    },
  ]);

  return { browser, context };
}

// ── 参加中プログラム一覧からリンクを取得 ─────────────────
async function fetchLinks(jsessionId: string): Promise<StoreLink[]> {
  const { browser, context } = await getAuthenticatedPage(jsessionId);
  const results: StoreLink[] = [];

  try {
    const page = await context.newPage();

    console.log('参加中プログラム一覧を取得中...');
    await page.goto(
      'https://media-console.a8.net/program/list/partnered?pageNo=1&pageSize=50&sortKey=APPROVED_DATE&sortOrder=DESC',
      { waitUntil: 'networkidle', timeout: 30000 }
    );

    // ログインページにリダイレクトされたら認証失敗
    if (page.url().includes('login') || page.url().includes('signin')) {
      console.error('❌ 認証失敗: JSESSIONIDが無効または期限切れです');
      console.error('   A8.netに再ログインして新しいJSESSIONIDをGitHub Secretsに設定してください');
      process.exit(1);
    }

    console.log('✅ 認証成功:', page.url());

    // 広告リンク作成ページへのリンクからprogramIdを収集
    const programIds = await page.evaluate(() => {
      const ids: string[] = [];
      document.querySelectorAll('a[href*="create-link"]').forEach((el) => {
        const href = (el as HTMLAnchorElement).href;
        const m = href.match(/programId=([^&\s]+)/);
        if (m && !ids.includes(m[1])) ids.push(m[1]);
      });
      return ids;
    });

    console.log(`${programIds.length}件のプログラムを検出`);

    // 各create-linkページにアクセスして、プログラム名とリンクを両方取得
    for (const programId of programIds) {
      const linkPage = await context.newPage();
      try {
        await linkPage.goto(
          `https://media-console.a8.net/program/create-link?programId=${programId}`,
          { waitUntil: 'networkidle', timeout: 20000 }
        );

        // ページからプログラム名とpx.a8.net URLを同時に取得
        const { programName, a8Url } = await linkPage.evaluate((): { programName: string; a8Url: string | null } => {
          // プログラム名を取得（ページタイトルやh1/h2から）
          const titleEl = document.querySelector('h1, h2, [class*="title"], [class*="program-name"], [class*="merchant"]');
          const programName = titleEl?.textContent?.trim()
            ?? document.title.replace(/広告リンク作成.*/, '').trim()
            ?? '';

          // px.a8.net URLを取得
          let a8Url: string | null = null;
          for (const a of Array.from(document.querySelectorAll('a[href*="px.a8.net"]'))) {
            a8Url = (a as HTMLAnchorElement).href; break;
          }
          if (!a8Url) {
            for (const el of Array.from(document.querySelectorAll('input, textarea'))) {
              const val = (el as HTMLInputElement).value || '';
              const m = val.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
              if (m) { a8Url = m[1]; break; }
            }
          }
          if (!a8Url) {
            const m = document.body.innerText.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
            if (m) a8Url = m[1];
          }
          return { programName, a8Url };
        });

        // a8ejpredirectの遷移先URLからショップを特定
        let matchedStoreId: string | null = null;
        let matchedKeyword = '';

        // 1. プログラム名でマッチング
        const lowerName = programName.toLowerCase();
        for (const [keyword, storeId] of Object.entries(PROGRAM_MAP)) {
          if (lowerName.includes(keyword.toLowerCase())) {
            matchedStoreId = storeId;
            matchedKeyword = keyword;
            break;
          }
        }

        // 2. リダイレクト先URLでマッチング
        if (!matchedStoreId && a8Url) {
          const redirectUrl = decodeURIComponent(a8Url).toLowerCase();
          const urlMap: Record<string, string> = {
            'smilecl.jp': 'smile', 'smile': 'smile',
            'eyecity.jp': 'eyecity',
            'lensupclub.com': 'lensclub', 'lensup': 'lensclub',
            'lensquick': 'lensquick',
            'primecontact': 'prime',
          };
          for (const [urlKey, storeId] of Object.entries(urlMap)) {
            if (redirectUrl.includes(urlKey)) {
              matchedStoreId = storeId;
              matchedKeyword = urlKey;
              break;
            }
          }
        }

        console.log(`  [${programId}] "${programName.slice(0, 30)}" → ${matchedStoreId ?? '未マッチ'}`);

        if (matchedStoreId && a8Url && !results.find((r) => r.storeId === matchedStoreId)) {
          const baseUrl = a8Url.split('&a8ejpredirect')[0];
          results.push({ storeId: matchedStoreId, programName: matchedKeyword, programId, affiliateUrl: baseUrl });
          console.log(`    ✅ 取得: ${baseUrl.slice(0, 70)}`);
        }
      } catch (e) {
        console.warn(`  [${programId}] ⚠️ エラー: ${e}`);
      } finally {
        await linkPage.close();
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }

  return results;
}

// ── products.json 更新 ────────────────────────────────────
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
      console.log(`  stores[${store.id}] 更新: ${found.affiliateUrl.slice(0, 60)}`);
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ data/products.json 更新完了');
}

// ── prices.json 更新 ──────────────────────────────────────
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
  const jsessionId = process.env.A8_JSESSIONID;
  if (!jsessionId) {
    console.error('環境変数 A8_JSESSIONID が必要です');
    process.exit(1);
  }

  console.log('=== A8.net アフィリエイトリンク自動取得（クッキー認証版） ===\n');
  const links = await fetchLinks(jsessionId);
  console.log(`\n取得結果: ${links.length}件`);

  if (links.length > 0) {
    console.log('\n=== データ更新 ===');
    updateProductsJson(links);
    updatePricesJson(links);
  }

  console.log('\n=== 完了 ===');
})().catch((e) => { console.error(e); process.exit(1); });

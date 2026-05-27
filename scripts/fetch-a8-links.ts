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
    const programs = await page.evaluate(() => {
      const items: { programId: string; name: string }[] = [];
      document.querySelectorAll('a[href*="create-link"]').forEach((el) => {
        const href = (el as HTMLAnchorElement).href;
        const m = href.match(/programId=([^&\s]+)/);
        if (!m) return;
        const programId = m[1];
        // 最も近い親要素のテキストをプログラム名として使用
        let el2: Element | null = el;
        let name = '';
        for (let i = 0; i < 8; i++) {
          el2 = el2?.parentElement ?? null;
          if (!el2) break;
          const t = el2.textContent?.replace(/\s+/g, ' ').trim() ?? '';
          if (t.length > 5 && t.length < 200) { name = t; break; }
        }
        if (!items.find((x) => x.programId === programId)) {
          items.push({ programId, name: name.slice(0, 60) });
        }
      });
      return items;
    });

    console.log(`${programs.length}件のプログラムを検出`);
    programs.forEach((p) => console.log(`  - [${p.programId}] ${p.name.slice(0, 40)}`));

    // 各プログラムのリンクを取得
    for (const prog of programs) {
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
      if (results.find((r) => r.storeId === matchedStoreId)) continue;

      console.log(`\n→ ${matchedKeyword} (${matchedStoreId}) のリンクを取得中...`);

      const linkPage = await context.newPage();
      try {
        await linkPage.goto(
          `https://media-console.a8.net/program/create-link?programId=${prog.programId}`,
          { waitUntil: 'networkidle', timeout: 20000 }
        );

        // px.a8.netのURLを抽出
        const a8Url = await linkPage.evaluate((): string | null => {
          // <a href="https://px.a8.net/...">
          for (const a of Array.from(document.querySelectorAll('a[href*="px.a8.net"]'))) {
            return (a as HTMLAnchorElement).href;
          }
          // テキストフィールド内
          for (const el of Array.from(document.querySelectorAll('input, textarea'))) {
            const val = (el as HTMLInputElement).value || '';
            const m = val.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
            if (m) return m[1];
          }
          // ページテキスト全体
          const m = document.body.innerText.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
          return m ? m[1] : null;
        });

        if (a8Url) {
          const baseUrl = a8Url.split('&a8ejpredirect')[0];
          results.push({ storeId: matchedStoreId, programName: matchedKeyword, programId: prog.programId, affiliateUrl: baseUrl });
          console.log(`  ✅ 取得: ${baseUrl.slice(0, 70)}`);
        } else {
          console.warn(`  ⚠️  URLが見つかりませんでした`);
          // ページのテキストをデバッグ出力
          const pageText = await linkPage.evaluate(() => document.body.innerText.slice(0, 500));
          console.log('  ページ内容:', pageText.replace(/\n/g, ' '));
        }
      } catch (e) {
        console.warn(`  ⚠️  エラー: ${e}`);
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

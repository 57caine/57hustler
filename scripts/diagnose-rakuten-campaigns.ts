/**
 * 楽天キャンペーン情報の取得可否を調査する診断スクリプト（1回限りの手動実行用）
 *
 * event.rakuten.co.jp / calendar.rakuten.co.jp 等の実HTML構造を
 * ネット接続可能な環境（GitHub Actions runner）から確認するために使う。
 * データ更新は行わず、調査結果をコンソールに出力するだけ。
 */

import { chromium, type Page } from 'playwright';

const CANDIDATE_URLS = [
  'https://www.rakuten.co.jp/',
  'https://event.rakuten.co.jp/',
  'https://event.rakuten.co.jp/marathon/',
  'https://event.rakuten.co.jp/rakuten-super-sale/',
  'https://calendar.rakuten.co.jp/cal/8607',
];

const KEYWORDS = ['マラソン', 'スーパーSALE', 'スーパーセール', 'キャンペーン', '買いまわり', 'エントリー'];

async function checkRobots(baseUrl: string): Promise<string> {
  try {
    const res = await fetch(new URL('/robots.txt', baseUrl).toString());
    if (!res.ok) return `(robots.txt: HTTP ${res.status})`;
    const text = await res.text();
    return text.slice(0, 2000);
  } catch (e) {
    return `(robots.txt取得失敗: ${(e as Error).message})`;
  }
}

async function inspectPage(page: Page, url: string) {
  console.log(`\n${'='.repeat(80)}\n[URL] ${url}\n${'='.repeat(80)}`);

  let status: number | null = null;
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    status = res?.status() ?? null;
  } catch (e) {
    console.log(`  goto失敗: ${(e as Error).message}`);
    return;
  }
  console.log(`  HTTPステータス: ${status}`);
  console.log(`  最終URL(リダイレクト後): ${page.url()}`);
  console.log(`  title: ${await page.title()}`);

  await page.waitForTimeout(1000);

  // meta / link 要素からRSS・ICS・canonical等を検出
  const headInfo = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link')).map((l) => ({
      rel: l.getAttribute('rel'),
      type: l.getAttribute('type'),
      href: l.getAttribute('href'),
    }));
    const jsonLdBlocks = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ).map((s) => (s.textContent ?? '').slice(0, 500));
    const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null;
    return { links, jsonLdBlocks, metaRobots };
  });
  console.log(`  meta robots: ${headInfo.metaRobots}`);
  const notableLinks = headInfo.links.filter(
    (l) => l.type?.includes('rss') || l.type?.includes('calendar') || l.rel === 'alternate' || l.href?.includes('.ics'),
  );
  console.log(`  RSS/ICS/alternate系リンク: ${notableLinks.length > 0 ? JSON.stringify(notableLinks) : 'なし'}`);
  console.log(`  JSON-LDブロック数: ${headInfo.jsonLdBlocks.length}`);
  headInfo.jsonLdBlocks.forEach((b, i) => console.log(`    [${i}] ${b}`));

  // フッター等からサイト運営者情報を推測
  const footerText = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    return (footer?.textContent ?? '').replace(/\s+/g, ' ').slice(0, 300);
  });
  console.log(`  footer抜粋: ${footerText || '(footer要素なし)'}`);

  // キーワードを含む要素を抽出（開催日程らしきテキストを探す）
  const hits = await page.evaluate((keywords: string[]) => {
    const results: { tag: string; className: string; text: string; href: string | null }[] = [];
    const elements = Array.from(document.querySelectorAll('a, li, div, section, h1, h2, h3, p'));
    for (const el of elements) {
      const text = (el.textContent ?? '').trim();
      if (text.length === 0 || text.length > 200) continue;
      if (keywords.some((k) => text.includes(k))) {
        results.push({
          tag: el.tagName.toLowerCase(),
          className: (el as HTMLElement).className?.toString().slice(0, 80) ?? '',
          text: text.slice(0, 120),
          href: el.tagName.toLowerCase() === 'a' ? (el as HTMLAnchorElement).href : null,
        });
      }
      if (results.length >= 25) break;
    }
    return results;
  }, KEYWORDS);
  console.log(`  キーワード一致要素: ${hits.length}件`);
  hits.forEach((h, i) => console.log(`    [${i}] <${h.tag} class="${h.className}"> ${h.text} ${h.href ? `(href=${h.href})` : ''}`));

  // 日付パターン（9/19 や 9月19日 のような表記）を含むテキストを抽出
  const dateLikeTexts = await page.evaluate(() => {
    const re = /\d{1,2}[\/月]\d{1,2}日?/;
    const out: string[] = [];
    const elements = Array.from(document.querySelectorAll('li, p, span, div'));
    for (const el of elements) {
      const text = (el.textContent ?? '').trim();
      if (text.length > 0 && text.length < 100 && re.test(text)) {
        out.push(text);
        if (out.length >= 15) break;
      }
    }
    return out;
  });
  console.log(`  日付らしきテキスト: ${dateLikeTexts.length}件`);
  dateLikeTexts.forEach((t, i) => console.log(`    [${i}] ${t}`));
}

async function main() {
  console.log(`=== 楽天キャンペーン構造調査開始: ${new Date().toISOString()} ===`);

  console.log('\n--- robots.txt ---');
  for (const base of ['https://www.rakuten.co.jp', 'https://event.rakuten.co.jp', 'https://calendar.rakuten.co.jp']) {
    console.log(`\n[${base}/robots.txt]`);
    console.log(await checkRobots(base));
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });

  for (const url of CANDIDATE_URLS) {
    const page = await context.newPage();
    try {
      await inspectPage(page, url);
    } catch (e) {
      console.log(`  調査中にエラー: ${(e as Error).message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n=== 調査完了 ===`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

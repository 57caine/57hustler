/**
 * 楽天お買い物マラソンの開催期間を自動更新するスクレイパー
 *
 * event.rakuten.co.jp/campaign/point-up/marathon/ は固定の恒久URL
 * （BreadcrumbListのJSON-LDで確認済み）で、開催期間が変わるたびに
 * 同じURL上でテキストが更新される。エントリー期間・ポイントアップ期間の
 * 見出しラベル直後の日時テキストを正規表現で抽出する。
 *
 * 取得失敗時・パース失敗時は既存データを保持する（scripts/update-prices.ts と同じ方針）。
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const MARATHON_URL = 'https://event.rakuten.co.jp/campaign/point-up/marathon/';

interface Campaign {
  id: string;
  platform: 'rakuten';
  type: 'marathon' | 'super-sale' | 'other';
  name: string;
  entryStartAt?: string;
  startAt: string;
  endAt: string;
  entryRequired: boolean;
  entryUrl?: string;
  officialUrl: string;
  note: string;
  confidence: 'confirmed' | 'predicted';
}

interface CampaignsData {
  updatedAt: string;
  source: string;
  campaigns: Campaign[];
}

// "2026年9月17日(木)10:00" のような1時点の日時文字列をISO(+09:00)に変換
function parseJstDateTime(text: string): string | null {
  const m = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\([^)]+\)\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const pad = (n: string) => n.padStart(2, '0');
  return `${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${mi}:00+09:00`;
}

// "2026年9月17日(木)10:00～2026年9月24日(木)01:59" のような範囲を2つの日時に分割
function parseJstDateRange(text: string): { start: string; end: string } | null {
  const parts = text.split(/[～〜]/);
  if (parts.length !== 2) return null;
  const start = parseJstDateTime(parts[0]);
  const end = parseJstDateTime(parts[1]);
  if (!start || !end) return null;
  return { start, end };
}

async function scrapeMarathon(page: Page): Promise<Campaign | null> {
  await page.goto(MARATHON_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1500);

  const bodyText: string = await page.evaluate(() => document.body.innerText);

  const entryMatch = bodyText.match(/エントリー期間\s*([\d年月日() 月火水木金土日:～〜]+)/);
  const pointUpMatch = bodyText.match(/ポイントアップ期間\s*([\d年月日() 月火水木金土日:～〜]+)/);
  if (!entryMatch || !pointUpMatch) {
    console.warn('  ⚠ エントリー期間/ポイントアップ期間のテキストが見つからない（ページ構成が変わった可能性）');
    return null;
  }

  const entryRange = parseJstDateRange(entryMatch[1].trim());
  const pointUpRange = parseJstDateRange(pointUpMatch[1].trim());
  if (!entryRange || !pointUpRange) {
    console.warn('  ⚠ 日時のパースに失敗');
    return null;
  }

  const entryHref = await page
    .locator('a.mrt-kanban__entry-button, a[href*="/apply/ic/marathon/"]')
    .first()
    .getAttribute('href')
    .catch(() => null);

  // エントリーURLに含まれるセッションIDをキャンペーンIDに使う（例: 20260919efhmz）
  const sessionIdMatch = entryHref?.match(/marathon\/(\w+)\//);
  const id = sessionIdMatch ? `rakuten-marathon-${sessionIdMatch[1]}` : `rakuten-marathon-${pointUpRange.start.slice(0, 10)}`;

  return {
    id,
    platform: 'rakuten',
    type: 'marathon',
    name: '楽天お買い物マラソン',
    entryStartAt: entryRange.start,
    startAt: pointUpRange.start,
    endAt: pointUpRange.end,
    entryRequired: true,
    entryUrl: entryHref ?? undefined,
    officialUrl: MARATHON_URL,
    note: '税込1000円以上の買い物をしたショップ数に応じてポイント倍率が上がる（買いまわり）',
    confidence: 'confirmed',
  };
}

async function main(): Promise<void> {
  const dataPath = path.join(process.cwd(), 'data', 'campaigns.json');
  const current: CampaignsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`=== 楽天お買い物マラソン更新開始: ${new Date().toISOString()} ===`);

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
  const page = await context.newPage();

  let scraped: Campaign | null = null;
  try {
    scraped = await scrapeMarathon(page);
  } catch (e) {
    console.warn(`  ⚠ 取得失敗: ${(e as Error).message}`);
  } finally {
    await browser.close();
  }

  const now = new Date().toISOString();

  if (!scraped) {
    console.log('取得できなかったため、既存データを保持します。');
    fs.writeFileSync(dataPath, JSON.stringify({ ...current, updatedAt: now }, null, 2), 'utf-8');
    return;
  }

  console.log(`  ✓ ${scraped.name}`);
  console.log(`    エントリー開始: ${scraped.entryStartAt}`);
  console.log(`    ポイントアップ期間: ${scraped.startAt} 〜 ${scraped.endAt}`);

  // 同じマラソンを既に持っていれば更新、なければ追加。過去の開催情報は残す。
  const others = current.campaigns.filter((c) => c.type !== 'marathon' || c.id !== scraped!.id);
  const updated: CampaignsData = {
    updatedAt: now,
    source: `${MARATHON_URL} を自動スクレイピング（scripts/update-campaigns.ts）`,
    campaigns: [...others, scraped],
  };

  fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
  console.log('=== 更新完了 ===');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * henkutsuリサーチbot
 * Kickstarter / Product Hunt / Reddit r/shutupandtakemymoney から
 * 日本未上陸のニッチ商品を自動収集し data/henkutsu-candidates.json に追記する。
 * GitHub Actions で月・水・金 JST 09:00 に実行。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';

interface RawItem {
  title: string;
  description: string;
  url: string;
  source: 'kickstarter' | 'producthunt' | 'reddit';
  price?: string;
}

interface HenkutsuCandidate {
  id: string;
  title: string;
  source: 'kickstarter' | 'producthunt' | 'reddit';
  url: string;
  description: string;
  category: string;
  price?: string;
  score: number;
  reason: string;
  addedAt: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
}

interface CandidatesFile {
  lastUpdated: string;
  candidates: HenkutsuCandidate[];
}

// ── Reddit (JSON API) ─────────────────────────────────────────────────────────

async function fetchReddit(): Promise<RawItem[]> {
  try {
    const res = await fetch(
      'https://www.reddit.com/r/shutupandtakemymoney/hot.json?limit=40',
      { headers: { 'User-Agent': '57hustler-henkutsu-bot/1.0' } }
    );
    if (!res.ok) { console.warn('Reddit fetch failed:', res.status); return []; }

    const json = await res.json() as {
      data: { children: { data: { title: string; selftext: string; url: string; permalink: string } }[] }
    };

    return json.data.children
      .filter(c => c.data.url && !c.data.url.includes('reddit.com'))
      .map(c => ({
        title: c.data.title,
        description: c.data.selftext?.slice(0, 300) || c.data.title,
        url: c.data.url,
        source: 'reddit' as const,
      }));
  } catch (e) {
    console.warn('Reddit error:', e);
    return [];
  }
}

// ── Product Hunt (Playwright) ─────────────────────────────────────────────────

async function fetchProductHunt(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<RawItem[]> {
  const page = await browser.newPage();
  try {
    await page.goto('https://www.producthunt.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const items = await page.evaluate(() => {
      const results: { title: string; description: string; url: string }[] = [];
      // Product Hunt product cards typically have data-test or specific class patterns
      const cards = document.querySelectorAll('[data-test="product-item"], .styles_item__Dk_nz, [class*="product"]');
      cards.forEach(card => {
        const titleEl = card.querySelector('a[data-test="product-name"], h3, h2');
        const descEl  = card.querySelector('p, [class*="tagline"]');
        const linkEl  = card.querySelector('a[href*="/posts/"]');
        if (titleEl && linkEl) {
          results.push({
            title: titleEl.textContent?.trim() || '',
            description: descEl?.textContent?.trim() || '',
            url: 'https://www.producthunt.com' + (linkEl.getAttribute('href') || ''),
          });
        }
      });
      return results.slice(0, 20);
    });

    return items
      .filter(i => i.title)
      .map(i => ({ ...i, source: 'producthunt' as const }));
  } catch (e) {
    console.warn('Product Hunt error:', e);
    return [];
  } finally {
    await page.close();
  }
}

// ── Kickstarter (Playwright) ──────────────────────────────────────────────────

async function fetchKickstarter(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<RawItem[]> {
  const page = await browser.newPage();
  try {
    await page.goto(
      'https://www.kickstarter.com/discover/advanced?sort=newest&seed=2357161&page=1',
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    );
    await page.waitForTimeout(3000);

    const items = await page.evaluate(() => {
      const results: { title: string; description: string; url: string; price?: string }[] = [];
      const cards = document.querySelectorAll('[class*="project-card"], .ProjectCard');
      cards.forEach(card => {
        const titleEl = card.querySelector('h3, h2, [class*="title"]');
        const descEl  = card.querySelector('p, [class*="description"], [class*="blurb"]');
        const linkEl  = card.querySelector('a[href*="/projects/"]');
        const goalEl  = card.querySelector('[class*="goal"], [class*="money"]');
        if (titleEl && linkEl) {
          results.push({
            title: titleEl.textContent?.trim() || '',
            description: descEl?.textContent?.trim() || '',
            url: linkEl.getAttribute('href') || '',
            price: goalEl?.textContent?.trim(),
          });
        }
      });
      return results.slice(0, 20);
    });

    return items
      .filter(i => i.title)
      .map(i => ({
        ...i,
        url: i.url.startsWith('http') ? i.url : `https://www.kickstarter.com${i.url}`,
        source: 'kickstarter' as const,
      }));
  } catch (e) {
    console.warn('Kickstarter error:', e);
    return [];
  } finally {
    await page.close();
  }
}

// ── Claude フィルタリング ─────────────────────────────────────────────────────

interface ClaudeItem {
  index: number;
  score: number;
  category: string;
  reason: string;
  keep: boolean;
}

async function filterWithClaude(items: RawItem[]): Promise<ClaudeItem[]> {
  if (items.length === 0) return [];

  const client = new Anthropic();
  const itemList = items.map((item, i) =>
    `[${i}] ${item.source.toUpperCase()} | ${item.title}\n    ${item.description?.slice(0, 150)}`
  ).join('\n');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `あなたは日本の越境EC・ガジェットバイヤー「henkutsu」の商品リサーチャーです。
以下の海外商品リストから、日本未上陸でhenkutsuの投稿候補になりそうなものを選別してください。

選定基準：
- 日本のAmazon/楽天に「まだない」または「なじみの薄い」ニッチ商品
- ガジェット・日用品・アウトドア・ライフスタイル系
- 価格帯 $20-$300 が理想（外れてもよい）
- 「これ何？」「面白い！」と思わせる独自性がある
- 物議を醸すもの・成人向けは除外

【商品リスト】
${itemList}

以下のJSON配列のみ出力（前置き不要）：
[
  {
    "index": 0,
    "score": 8,
    "category": "ガジェット",
    "reason": "日本未上陸の磁気充電ケーブル。独自形状で差別化あり",
    "keep": true
  }
]

スコア10点満点。5点以上かつkeep:trueのみ採用。全${items.length}件に対して必ず配列を返すこと。`,
    }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text;
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as ClaudeItem[];
}

// ── メイン ────────────────────────────────────────────────────────────────────

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function main() {
  console.log('=== henkutsuリサーチ開始 ===');

  const dataPath = path.join(process.cwd(), 'data', 'henkutsu-candidates.json');
  const existing: CandidatesFile = fs.existsSync(dataPath)
    ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    : { lastUpdated: new Date().toISOString(), candidates: [] };

  const existingUrls = new Set(existing.candidates.map(c => c.url));

  console.log('Reddit 取得中...');
  const redditItems = await fetchReddit();
  console.log(`  Reddit: ${redditItems.length}件`);

  const browser = await chromium.launch({ headless: true });
  let phItems: RawItem[] = [];
  let ksItems: RawItem[] = [];

  try {
    console.log('Product Hunt 取得中...');
    phItems = await fetchProductHunt(browser);
    console.log(`  Product Hunt: ${phItems.length}件`);

    console.log('Kickstarter 取得中...');
    ksItems = await fetchKickstarter(browser);
    console.log(`  Kickstarter: ${ksItems.length}件`);
  } finally {
    await browser.close();
  }

  const allItems = [...redditItems, ...phItems, ...ksItems]
    .filter(item => item.title && item.url && !existingUrls.has(item.url));

  console.log(`新規候補: ${allItems.length}件（重複除外済み）`);

  if (allItems.length === 0) {
    console.log('新規アイテムなし。終了。');
    return;
  }

  console.log('Claude でフィルタリング中...');
  const results = await filterWithClaude(allItems);

  const now = new Date().toISOString();
  let addedCount = 0;

  results.forEach(r => {
    if (!r.keep || r.score < 5) return;
    const raw = allItems[r.index];
    if (!raw) return;

    existing.candidates.unshift({
      id: makeId(),
      title: raw.title,
      source: raw.source,
      url: raw.url,
      description: raw.description?.slice(0, 300) || '',
      category: r.category,
      price: raw.price,
      score: r.score,
      reason: r.reason,
      addedAt: now,
      status: 'new',
    });
    addedCount++;
  });

  // 最大200件まで保持
  existing.candidates = existing.candidates.slice(0, 200);
  existing.lastUpdated = now;

  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`✓ ${addedCount}件の新候補を追加（合計: ${existing.candidates.length}件）`);
  console.log(`  出力: ${dataPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });

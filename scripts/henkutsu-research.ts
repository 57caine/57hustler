/**
 * henkutsuリサーチbot
 * Kickstarter / Product Hunt / Reddit r/shutupandtakemymoney から
 * 日本未上陸のニッチ商品を自動収集し data/henkutsu-candidates.json に追記する。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

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
  descriptionJa: string;
  postDraft: string;
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

// ── Reddit (Playwright でbot検知を回避) ───────────────────────────────────────

async function fetchReddit(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<RawItem[]> {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': UA });
  try {
    // JSON APIをブラウザ経由でアクセス（GitHub ActionsのIPでもblockされにくい）
    await page.goto(
      'https://www.reddit.com/r/shutupandtakemymoney/hot.json?limit=40&raw_json=1',
      { waitUntil: 'domcontentloaded', timeout: 25000 }
    );
    await page.waitForTimeout(1500);

    const text = await page.evaluate(() => {
      const pre = document.querySelector('pre');
      return pre ? pre.textContent : document.body.innerText;
    });

    if (text) {
      const json = JSON.parse(text.trim()) as {
        data: { children: { data: { title: string; selftext: string; url: string } }[] }
      };
      const items = (json.data?.children ?? [])
        .filter(c => c.data?.url && !c.data.url.includes('reddit.com') && !c.data.url.includes('imgur.com') && c.data.url.startsWith('http'))
        .slice(0, 25)
        .map(c => ({
          title: c.data.title,
          description: (c.data.selftext || c.data.title).slice(0, 300),
          url: c.data.url,
          source: 'reddit' as const,
        }));
      console.log(`  Reddit JSON API: ${items.length}件`);
      if (items.length > 0) return items;
    }
  } catch (e) {
    console.warn('  Reddit JSON APIフォールバックへ:', (e as Error).message);
  }

  // フォールバック: 実際のページをスクレイピング
  try {
    await page.goto('https://www.reddit.com/r/shutupandtakemymoney/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    const items = await page.evaluate(() => {
      const results: { title: string; description: string; url: string; source: string }[] = [];
      const seen = new Set<string>();

      // 新Reddit: shreddit-post コンポーネント
      document.querySelectorAll('shreddit-post').forEach(el => {
        const title = el.getAttribute('post-title') || el.querySelector('h2, h3')?.textContent?.trim() || '';
        const permalink = el.getAttribute('permalink') || '';
        const url = el.getAttribute('content-href') || (permalink ? `https://www.reddit.com${permalink}` : '');
        if (title && url && !seen.has(url)) {
          seen.add(url);
          results.push({ title, description: title, url, source: 'reddit' });
        }
      });

      if (results.length === 0) {
        // 旧Reddit / その他レイアウト
        document.querySelectorAll('[data-testid="post-container"], article, .Post').forEach(el => {
          const titleEl = el.querySelector('h3, [data-testid="post-title"]');
          const linkEl = el.querySelector('a[href*="/comments/"]');
          const title = titleEl?.textContent?.trim() || '';
          const href = linkEl?.getAttribute('href') || '';
          if (title && href && !seen.has(href)) {
            seen.add(href);
            const url = href.startsWith('http') ? href : `https://www.reddit.com${href}`;
            results.push({ title, description: title, url, source: 'reddit' });
          }
        });
      }

      return results.slice(0, 20);
    });

    console.log(`  Reddit scrape fallback: ${items.length}件`);
    return items.filter(i => i.title) as RawItem[];
  } catch (e) {
    console.warn('  Reddit scrape error:', (e as Error).message);
    return [];
  } finally {
    await page.close();
  }
}

// ── Product Hunt ──────────────────────────────────────────────────────────────

async function fetchProductHunt(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<RawItem[]> {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': UA });
  try {
    await page.goto('https://www.producthunt.com/', { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(5000);

    const items = await page.evaluate(() => {
      const results: { title: string; description: string; url: string; source: string }[] = [];
      const seen = new Set<string>();

      // /posts/ へのリンクを全収集して親要素からタイトルを取得
      document.querySelectorAll('a[href^="/posts/"]').forEach(link => {
        const href = link.getAttribute('href') || '';
        const pathPart = href.split('?')[0];
        if (!pathPart || seen.has(pathPart)) return;
        seen.add(pathPart);

        // 最大5階層上を探索してテキストを取得
        let el: Element | null = link;
        let title = '';
        let desc  = '';
        for (let i = 0; i < 6 && !title; i++) {
          el = el?.parentElement || null;
          if (!el) break;
          const h = el.querySelector('h2, h3, [class*="name"], [class*="title"]');
          if (h?.textContent?.trim()) title = h.textContent.trim();
          const p = el.querySelector('p, [class*="tagline"]');
          if (p?.textContent?.trim()) desc = p.textContent.trim();
        }
        if (!title) title = link.textContent?.trim() || '';
        if (title && title.length > 3) {
          results.push({
            title,
            description: desc || title,
            url: `https://www.producthunt.com${pathPart}`,
            source: 'producthunt',
          });
        }
      });

      return results.slice(0, 20);
    });

    console.log(`  Product Hunt: ${items.length}件`);
    return items as RawItem[];
  } catch (e) {
    console.warn('  Product Hunt error:', (e as Error).message);
    return [];
  } finally {
    await page.close();
  }
}

// ── Kickstarter ───────────────────────────────────────────────────────────────

async function fetchKickstarter(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<RawItem[]> {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': UA });
  try {
    // 新着ガジェット系プロジェクトをページ
    await page.goto(
      'https://www.kickstarter.com/discover/advanced?category_id=16&sort=newest&seed=12345',
      { waitUntil: 'networkidle', timeout: 35000 }
    );
    await page.waitForTimeout(4000);

    const items = await page.evaluate(() => {
      const results: { title: string; description: string; url: string; price?: string; source: string }[] = [];
      const seen = new Set<string>();

      // キックスターターの現行HTML: /projects/ へのaタグ
      document.querySelectorAll('a[href*="/projects/"]').forEach(link => {
        const href = link.getAttribute('href') || '';
        const base = href.split('?')[0].replace(/\/$/, '');
        if (!base.includes('/projects/') || seen.has(base)) return;
        seen.add(base);

        const url = base.startsWith('http') ? base : `https://www.kickstarter.com${base}`;

        // 親要素からタイトルと説明を取得
        let el: Element | null = link;
        let title = '';
        let desc  = '';
        let price = '';
        for (let i = 0; i < 6; i++) {
          el = el?.parentElement || null;
          if (!el) break;
          const h = el.querySelector('h3, h2, [class*="name"], [class*="title"]');
          if (h?.textContent?.trim()) title = title || h.textContent.trim();
          const p = el.querySelector('p, [class*="blurb"], [class*="description"]');
          if (p?.textContent?.trim()) desc = desc || p.textContent.trim();
          const m = el.querySelector('[class*="money"], [class*="goal"], [class*="pledge"]');
          if (m?.textContent?.trim()) price = price || m.textContent.trim();
        }
        if (!title) title = link.textContent?.trim() || '';
        if (title && title.length > 3) {
          results.push({ title, description: desc || title, url, price: price || undefined, source: 'kickstarter' });
        }
      });

      return results.slice(0, 20);
    });

    console.log(`  Kickstarter: ${items.length}件`);
    return items as RawItem[];
  } catch (e) {
    console.warn('  Kickstarter error:', (e as Error).message);
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
  descriptionJa: string;
  postDraft: string;
  reason: string;
  keep: boolean;
}

async function filterWithClaude(items: RawItem[]): Promise<ClaudeItem[]> {
  if (items.length === 0) return [];

  const client = new Anthropic();
  const itemList = items.map((item, i) =>
    `[${i}] ${item.source.toUpperCase()} | ${item.title}\n    ${item.description?.slice(0, 150) || ''}`
  ).join('\n');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `あなたは日本の越境EC・ガジェットバイヤー「henkutsu」の商品リサーチャーです。
以下の海外商品リストから、日本未上陸でhenkutsuの投稿候補になりそうなものを選別してください。

選定基準：
- 日本のAmazon/楽天に「まだない」または「なじみの薄い」ニッチ商品
- ガジェット・日用品・アウトドア・ライフスタイル系
- 価格帯 $20〜$300 が理想（外れてもよい）
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
    "descriptionJa": "日本にまだないマグネット式充電ケーブル。向きを気にせずパチッとはまる",
    "postDraft": "これ、日本にまだないんだけど…\\n\\n磁気でパチってくっつく充電ケーブル。\\n向きとか関係ない。\\nKickstarterで話題🔥",
    "reason": "日本未上陸の磁気充電ケーブル。独自形状で差別化あり",
    "keep": true
  }
]

スコア10点満点。5点以上かつkeep:trueのみ採用。全${items.length}件に対して必ず配列を返すこと。
postDraftはhenkutsu（海外ニッチ商品紹介）らしいThreads投稿文（100〜150字、改行あり）。`,
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

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let allItems: RawItem[] = [];

  try {
    console.log('Reddit 取得中...');
    const redditItems = await fetchReddit(browser);

    console.log('Product Hunt 取得中...');
    const phItems     = await fetchProductHunt(browser);

    console.log('Kickstarter 取得中...');
    const ksItems     = await fetchKickstarter(browser);

    allItems = [...redditItems, ...phItems, ...ksItems]
      .filter(item => item.title && item.url && !existingUrls.has(item.url));

    console.log(`新規候補合計: ${allItems.length}件（重複除外済み）`);
  } finally {
    await browser.close();
  }

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
      descriptionJa: r.descriptionJa || '',
      postDraft: r.postDraft || '',
      category: r.category,
      price: raw.price,
      score: r.score,
      reason: r.reason,
      addedAt: now,
      status: 'new',
    });
    addedCount++;
  });

  existing.candidates = existing.candidates.slice(0, 200);
  existing.lastUpdated = now;

  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`✓ ${addedCount}件の新候補を追加（合計: ${existing.candidates.length}件）`);
}

main().catch(e => { console.error(e); process.exit(1); });

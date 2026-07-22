/**
 * 雑草おじさん DMMアフィリ自動ストックジェネレーター
 *
 * DMMアフィリエイトAPIから売れ筋商品を取得し、
 * 昭和スポーツ新聞風コメントを生成してストックする。
 *
 * 実行: npx ts-node scripts/zassou-stock-generator.ts [--dry-run]
 * 環境変数: DMM_API_ID, DMM_AFFILIATE_ID, ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

// ─── 環境変数 ────────────────────────────────────────────────
const DMM_API_ID       = process.env.DMM_API_ID!;
const DMM_AFFILIATE_ID = process.env.DMM_AFFILIATE_ID!;

const GENRES = ['熟女', '人妻', 'NTR', '若妻', 'フェラ'] as const;
type Genre = typeof GENRES[number];

const HITS_PER_GENRE = 5;

// ─── DMM API 型定義 ───────────────────────────────────────────
interface DMMItem {
  content_id: string;
  title: string;
  URL: string;
  affiliateURL: string;
  imageURL: { large: string; small: string };
  sampleMovieURL?: {
    size_720_480?: string;
    size_560_360?: string;
    size_476_306?: string;
  };
  iteminfo?: {
    actress?: { id: number; name: string }[];
    genre?: { id: number; name: string }[];
  };
}

interface DMMResponse {
  result: {
    status: number;
    message?: string;
    total_count: string;
    first_position: number;
    count: number;
    items?: DMMItem[];
  };
}

// ─── ストックデータ型 ─────────────────────────────────────────
interface StockItem {
  zId: string;        // Z001, Z002... 連番ID
  id: string;         // DMMのcontent_id（重複チェック用）
  genre: Genre;
  title: string;
  actressName: string;
  imageUrl: string;   // 商品サムネイル（大）
  comment: string;
  sampleUrl: string;
  affiliateUrl: string;
  posted: boolean;
  addedAt: string;
}

interface StockFile {
  updatedAt: string;
  totalCount: number;
  items: StockItem[];
  note: string;
}

interface PostedFile {
  postedIds: string[];
  note: string;
}

// ─── ファイルパス ─────────────────────────────────────────────
const STOCK_PATH  = path.join(ROOT, 'data/zassou-stock.json');
const POSTED_PATH = path.join(ROOT, 'data/zassou-posted.json');
const CSV_PATH    = path.join(ROOT, 'data/zassou-stock.csv');

// ─── DMM API 呼び出し ─────────────────────────────────────────
async function fetchDMMItems(genre: Genre): Promise<DMMItem[]> {
  const params = new URLSearchParams({
    api_id:       DMM_API_ID,
    affiliate_id: DMM_AFFILIATE_ID,
    site:         'FANZA',
    service:      'digital',
    floor:        'videoa',
    keyword:      genre,
    sort:         'rank',
    hits:         String(HITS_PER_GENRE),
    output:       'json',
  });

  const url = `https://api.dmm.com/affiliate/v3/ItemList?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DMM API error: ${res.status} ${await res.text()}`);

  const data = (await res.json()) as DMMResponse;

  if (data.result.status !== 200) {
    throw new Error(`DMM API status error: ${data.result.status} ${data.result.message ?? ''}`);
  }

  return data.result.items ?? [];
}

// ─── サンプルURL取得 ──────────────────────────────────────────
function pickSampleUrl(item: DMMItem): string {
  const s = item.sampleMovieURL;
  if (!s) return '';
  return s.size_720_480 ?? s.size_560_360 ?? s.size_476_306 ?? '';
}

// ─── 女優名取得 ───────────────────────────────────────────────
function pickActressName(item: DMMItem): string {
  const actresses = item.iteminfo?.actress;
  if (!actresses || actresses.length === 0) return '謎の熟女嬢';
  return actresses.map(a => a.name).join('・');
}

// ─── 昭和コメント生成 ─────────────────────────────────────────
async function generateComment(
  client: Anthropic,
  title: string,
  actressName: string,
  genre: Genre,
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: `あなたは「雑草おじさん」というキャラクターです。
元AV業界勤務・業界経験者の目利きという設定。
昭和平成のスポーツ新聞風俗ページのライターの文体で一言コメントを生成してください。

ルール：
- 「〇〇嬢の演技、小生の愚息も辛抱タマラン・・・！！」のスタイル
- 作品・出演者の特徴を一言で表現
- 昭和レトロな表現を使う（タマラン・小生・嬢・一品・絶品・貫禄 など）
- 30文字以内
- ハッシュタグなし
- コメントのみ出力（前置き不要）`,
    messages: [{
      role: 'user',
      content: `以下の作品に一言コメントをつけてください。
ジャンル：${genre}
タイトル：${title}
出演者：${actressName}`,
    }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  return text.slice(0, 50);
}

// ─── 連番ID生成 ───────────────────────────────────────────────
function nextZId(existingItems: StockItem[]): string {
  const maxNum = existingItems.reduce((max, item) => {
    const n = parseInt(item.zId?.replace('Z', '') ?? '0', 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return `Z${String(maxNum + 1).padStart(3, '0')}`;
}

// ─── CSV行生成 ────────────────────────────────────────────────
function toCsvRow(item: StockItem): string {
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return [
    escape(item.zId),
    escape(item.genre),
    escape(item.title),
    escape(item.actressName),
    escape(item.comment),
    escape(item.imageUrl),
    escape(item.sampleUrl),
    escape(item.affiliateUrl),
    item.posted ? '済' : '',
  ].join(',');
}

// ─── メイン ──────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`=== 雑草おじさん ストックジェネレーター${dryRun ? ' [DRY RUN]' : ''} ===`);

  if (!DMM_API_ID || !DMM_AFFILIATE_ID) {
    throw new Error('DMM_API_ID と DMM_AFFILIATE_ID を環境変数に設定してください');
  }

  const client = new Anthropic();

  // 既存ストック読み込み
  const stock: StockFile = fs.existsSync(STOCK_PATH)
    ? JSON.parse(fs.readFileSync(STOCK_PATH, 'utf-8'))
    : { updatedAt: '', totalCount: 0, items: [], note: '' };

  const posted: PostedFile = fs.existsSync(POSTED_PATH)
    ? JSON.parse(fs.readFileSync(POSTED_PATH, 'utf-8'))
    : { postedIds: [], note: '' };

  const existingIds = new Set([
    ...stock.items.map(i => i.id),
    ...posted.postedIds,
  ]);

  const newItems: StockItem[] = [];

  for (const genre of GENRES) {
    console.log(`\n▼ ${genre} の商品取得中...`);

    let items: DMMItem[];
    try {
      items = await fetchDMMItems(genre);
    } catch (e) {
      console.error(`  DMM APIエラー（${genre}）:`, e);
      continue;
    }

    console.log(`  ${items.length}件取得`);

    for (const item of items) {
      if (existingIds.has(item.content_id)) {
        console.log(`  スキップ（重複）: ${item.content_id}`);
        continue;
      }

      const sampleUrl  = pickSampleUrl(item);
      const actressName = pickActressName(item);

      console.log(`  生成中: ${item.title.slice(0, 30)}...`);

      let comment = '';
      try {
        comment = await generateComment(client, item.title, actressName, genre);
      } catch (e) {
        console.error('  コメント生成エラー:', e);
        comment = `${actressName}嬢の${genre}、小生タマラン・・・！！`;
      }

      const allSoFar = [...stock.items, ...newItems];
      const stockItem: StockItem = {
        zId:          nextZId(allSoFar),
        id:           item.content_id,
        genre,
        title:        item.title,
        actressName,
        imageUrl:     item.imageURL.large,
        comment,
        sampleUrl,
        affiliateUrl: item.affiliateURL,
        posted:       false,
        addedAt:      new Date().toISOString(),
      };

      newItems.push(stockItem);
      existingIds.add(item.content_id);

      console.log(`  ✓ [${genre}] ${comment}`);

      // APIレート制限対策
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n新規追加: ${newItems.length}件`);

  if (dryRun) {
    console.log('--- DRY RUN: ファイル書き込みスキップ ---');
    console.log(JSON.stringify(newItems.slice(0, 2), null, 2));
    return;
  }

  // ストックに追記
  stock.items.unshift(...newItems);
  stock.totalCount = stock.items.length;
  stock.updatedAt  = new Date().toISOString();
  stock.note       = 'zassou-stock-generator.tsにより毎日9:00 JSTに自動更新';

  fs.writeFileSync(STOCK_PATH, JSON.stringify(stock, null, 2));
  console.log(`✓ ${STOCK_PATH} を更新（合計 ${stock.totalCount}件）`);

  // CSV更新
  const csvHeader = 'ID,ジャンル,作品名,出演者,一言コメント,画像URL,サンプルURL,アフィリリンク,投稿済み';
  const csvRows   = stock.items.map(toCsvRow);
  fs.writeFileSync(CSV_PATH, [csvHeader, ...csvRows].join('\n'), 'utf-8');
  console.log(`✓ ${CSV_PATH} を更新`);
}

main().catch(e => { console.error(e); process.exit(1); });

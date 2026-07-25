/**
 * 雑草おじさん DMMアフィリ自動ストックジェネレーター
 *
 * DMMアフィリエイトAPIから売れ筋商品を取得し、
 * 昭和スポーツ新聞風の2段投稿（親投稿＋リプライ）テキストを生成してストックする。
 *
 * 実行: npx ts-node scripts/zassou-stock-generator.ts [--dry-run]
 * 環境変数: DMM_API_ID, DMM_AFFILIATE_ID(=nsplot-003), ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// ─── 環境変数 ────────────────────────────────────────────────
const DMM_API_ID       = process.env.DMM_API_ID!;
const DMM_AFFILIATE_ID = process.env.DMM_AFFILIATE_ID!; // nsplot-003

// VRは意図的に除外（フロア指定でも混入する場合はアイテム単位でフィルタ）
const GENRES = ['熟女', '人妻', 'NTR', '若妻', 'フェラ'] as const;
type Genre = typeof GENRES[number] | 'サブスク';

// 熟女を4〜5割に調整（10件 / 合計22件 ≒ 45%）
const HITS_PER_GENRE: Record<typeof GENRES[number], number> = {
  '熟女': 10,
  '人妻': 3,
  'NTR':  3,
  '若妻': 3,
  'フェラ': 3,
};

const SUBSCRIPTION_CTA_URL = 'https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fsvod%2F&af_id=nsplot-003&ch=toolbar&ch_id=link';

const CTA_TEXTS = [
  '小生、先月から月額見放題に切り替えた次第である。単品より圧倒的にコスパが良い。',
  '月2000円足らずで見放題である。愚息の維持費より安いとは恐れ入った次第である。',
  '小生、月額契約後は単品購入を一切やめた次第である。賢者タイムに学んだ合理性である。',
];

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
  zId: string;          // Z001, Z002... 連番ID
  id: string;           // DMMのcontent_id（重複チェック用）
  genre: Genre;
  title: string;
  actressName: string;
  imageUrl: string;     // 商品サムネイル（大）
  sampleUrl: string;    // サンプル動画URL（720x480優先）
  affiliateUrl: string; // アフィリエイトリンク（nsplot-003）
  comment: string;      // 内部メモ用一言（30文字）
  parentPost: string;   // 親投稿本文（sampleUrl末尾付き）
  replyPost: string;    // リプライ本文（affiliateUrl末尾付き）
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
async function fetchDMMItems(genre: typeof GENRES[number], hits: number): Promise<DMMItem[]> {
  const params = new URLSearchParams({
    api_id:       DMM_API_ID,
    affiliate_id: DMM_AFFILIATE_ID,
    site:         'FANZA',
    service:      'digital',
    floor:        'videoa',
    keyword:      genre,
    sort:         'rank',
    hits:         String(hits),
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

// ─── サンプルURL取得（高解像度優先） ──────────────────────────
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

// ─── 拒否レスポンス検知 ──────────────────────────────────────
const REFUSAL_PREFIXES = [
  "I can't", "I cannot", "I'm not", "I'm unable",
  "I don't ", "I appreciate", "I apologize", "I'm sorry",
  "申し訳", "できません", "お断り", "お役に立て",
  "This request", "Unfortunately",
];

function isRefusal(text: string): boolean {
  const firstLine = text.split('\n')[0].trim();
  return REFUSAL_PREFIXES.some(p => firstLine.startsWith(p));
}

function fallbackComment(actressName: string, genre: Genre): string {
  return `${actressName}嬢の${genre}、小生タマラン・・・！！`;
}

function fallbackParentPost(actressName: string, genre: Genre, sampleUrl: string): string {
  const body = `【新作入荷】${actressName}嬢の${genre}作品`;
  return sampleUrl ? `${body}\n${sampleUrl}` : body;
}

function fallbackReplyPost(actressName: string, genre: Genre, affiliateUrl: string): string {
  return `${actressName}嬢の新作${genre}。詳細・購入はこちら↓\n${affiliateUrl}`;
}

// ─── 内部メモ用一言（30文字） ─────────────────────────────────
async function generateComment(
  client: Anthropic,
  title: string,
  actressName: string,
  genre: Genre,
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    system: `あなたは「雑草おじさん」というキャラクターです。
昭和平成のスポーツ新聞風俗ページのライターの文体で一言メモを30文字以内で生成してください。
「〇〇嬢の演技、小生の愚息も辛抱タマラン・・・！！」のスタイル。
コメントのみ出力。`,
    messages: [{
      role: 'user',
      content: `ジャンル：${genre} / 出演者：${actressName} / タイトル（抜粋）：${title.slice(0, 30)}`,
    }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  if (isRefusal(text)) {
    console.warn('  ⚠ comment: 拒否検知 → フォールバック');
    return fallbackComment(actressName, genre);
  }
  return text.slice(0, 50);
}

// ─── 親投稿生成（1行キャッチコピー） ────────────────────────
async function generateParentPost(
  client: Anthropic,
  title: string,
  actressName: string,
  genre: Genre,
  sampleUrl: string,
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    system: `あなたは「雑草おじさん」というキャラクターです。
昭和のエロ本ライター風・「小生」を一人称に使う年配男性キャラクター。
「〜である」「〜次第である」調の言い切り文体。
下ネタは下品になりすぎず、自虐・大げさな比喩でユーモラスに落とす。

Xへの「親投稿（メインツイート）」を1文で生成してください。

【文字数】
1行、25〜35文字程度

【型】
「(女優名か作品の一言紹介)。小生の(愚息/老眼鏡/血圧 等の自虐・大げさな一言オチ)である。」

【良い例（このトーン・長さで）】
- 篠田ゆう16時間ベスト。小生の愚息、開始5分で臨戦態勢である。
- 長澤史華の熟女ボディ。小生、老眼鏡を外して二度見した次第である。
- 美乃すずめの8K初VR。小生の愚息もついに8K対応である。

ルール：
- 命令形（「観ておけ」など）だけで終わらせない
- 女優名か作品の特徴を前半に1つ絡め、後半は自虐オチ
- 絵文字・ハッシュタグなし
- 1文のみ出力（前置き・説明一切不要）`,
    messages: [{
      role: 'user',
      content: `ジャンル：${genre}
出演者：${actressName}
タイトル（抜粋）：${title.slice(0, 40)}`,
    }],
  });

  const body = (message.content[0] as { type: string; text: string }).text.trim();
  if (isRefusal(body)) {
    console.warn('  ⚠ parentPost: 拒否検知 → フォールバック');
    return fallbackParentPost(actressName, genre, sampleUrl);
  }
  // 1行目のみ抽出して35文字上限（URL別）
  const oneLine = body.split('\n')[0].slice(0, 40);
  return sampleUrl ? `${oneLine}\n${sampleUrl}` : oneLine;
}

// ─── リプライ生成（商品紹介＋アフィリリンク） ────────────────
async function generateReplyPost(
  client: Anthropic,
  title: string,
  actressName: string,
  genre: Genre,
  affiliateUrl: string,
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: `あなたは「雑草おじさん」というキャラクターです。
元AV業界勤務・業界経験者の目利きという設定。
Xのリプライ欄に投稿する「商品紹介文」を生成してください。

ルール：
- 作品の魅力・特徴・見どころを具体的に紹介
- 最後は購入リンクへの誘導文（「全編・詳細はこちら↓」「お買い求めはこちら↓」系）
- 100文字以内（URLを末尾に追加するためスペースが必要）
- 絵文字・ハッシュタグなし
- 本文のみ出力（前置き・説明一切不要）`,
    messages: [{
      role: 'user',
      content: `ジャンル：${genre}
出演者：${actressName}
タイトル（抜粋）：${title.slice(0, 40)}`,
    }],
  });

  const body = (message.content[0] as { type: string; text: string }).text.trim();
  if (isRefusal(body)) {
    console.warn('  ⚠ replyPost: 拒否検知 → フォールバック');
    return fallbackReplyPost(actressName, genre, affiliateUrl);
  }
  return `${body.slice(0, 120)}\n${affiliateUrl}`;
}

// ─── 既存ストックの親投稿を全件再生成 ────────────────────────
async function repairParentPosts(client: Anthropic, items: StockItem[]): Promise<void> {
  console.log(`\n▼ 全${items.length}件の親投稿を新プロンプトで再生成中...`);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`  [${i + 1}/${items.length}] ${item.zId} ${item.actressName}`);
    try {
      item.parentPost = await generateParentPost(
        client, item.title, item.actressName, item.genre, item.sampleUrl
      );
      console.log(`    → ${item.parentPost.split('\n')[0]}`);
    } catch (e) {
      console.error(`  エラー (${item.zId}):`, e);
      item.parentPost = fallbackParentPost(item.actressName, item.genre, item.sampleUrl);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

// ─── 既存ストックの拒否テキスト修復 ──────────────────────────
async function repairRefusedItems(client: Anthropic, items: StockItem[]): Promise<number> {
  let repaired = 0;
  for (const item of items) {
    const needsParent = isRefusal(item.parentPost);
    const needsReply  = isRefusal(item.replyPost);
    const needsComment = isRefusal(item.comment);
    if (!needsParent && !needsReply && !needsComment) continue;

    console.log(`  修復中: ${item.zId} (${item.actressName}) parent=${needsParent} reply=${needsReply}`);
    try {
      const [newParent, newReply, newComment] = await Promise.all([
        needsParent
          ? generateParentPost(client, item.title, item.actressName, item.genre, item.sampleUrl)
          : Promise.resolve(item.parentPost),
        needsReply
          ? generateReplyPost(client, item.title, item.actressName, item.genre, item.affiliateUrl)
          : Promise.resolve(item.replyPost),
        needsComment
          ? generateComment(client, item.title, item.actressName, item.genre)
          : Promise.resolve(item.comment),
      ]);
      item.parentPost = newParent;
      item.replyPost  = newReply;
      item.comment    = newComment;
    } catch (e) {
      console.error(`  修復エラー (${item.zId}):`, e);
      if (needsParent)  item.parentPost = fallbackParentPost(item.actressName, item.genre, item.sampleUrl);
      if (needsReply)   item.replyPost  = fallbackReplyPost(item.actressName, item.genre, item.affiliateUrl);
      if (needsComment) item.comment    = fallbackComment(item.actressName, item.genre);
    }
    repaired++;
    await new Promise(r => setTimeout(r, 300));
  }
  return repaired;
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
    escape(item.parentPost),
    escape(item.replyPost),
    item.posted ? '済' : '',
  ].join(',');
}

// ─── 月額サブスクCTA生成 ──────────────────────────────────────
function buildSubscriptionCta(ctaIndex: number, allItems: StockItem[]): StockItem {
  const body = CTA_TEXTS[ctaIndex % CTA_TEXTS.length];
  return {
    zId:          nextZId(allItems),
    id:           `sub-cta-${ctaIndex}`,
    genre:        'サブスク' as Genre,
    title:        'FANZA動画見放題チャンネルライト',
    actressName:  '',
    imageUrl:     '',
    sampleUrl:    '',
    affiliateUrl: SUBSCRIPTION_CTA_URL,
    comment:      '月額サブスク誘導',
    parentPost:   body,
    replyPost:    `FANZA動画見放題チャンネルライト 詳細・登録はこちら↓\n${SUBSCRIPTION_CTA_URL}`,
    posted:       false,
    addedAt:      new Date().toISOString(),
  };
}

// ─── メイン ──────────────────────────────────────────────────
async function main() {
  const dryRun        = process.argv.includes('--dry-run');
  const repairParents = process.argv.includes('--repair-parents');
  console.log(`=== 雑草おじさん ストックジェネレーター${dryRun ? ' [DRY RUN]' : ''}${repairParents ? ' [REPAIR PARENTS]' : ''} ===`);

  if (!repairParents && (!DMM_API_ID || !DMM_AFFILIATE_ID)) {
    throw new Error('DMM_API_ID と DMM_AFFILIATE_ID を環境変数に設定してください');
  }

  const client = new Anthropic();

  const stock: StockFile = fs.existsSync(STOCK_PATH)
    ? JSON.parse(fs.readFileSync(STOCK_PATH, 'utf-8'))
    : { updatedAt: '', totalCount: 0, items: [], note: '' };

  // --repair-parents: 親投稿のみ全件再生成して終了
  if (repairParents) {
    await repairParentPosts(client, stock.items);
    stock.updatedAt = new Date().toISOString();
    if (!dryRun) {
      fs.writeFileSync(STOCK_PATH, JSON.stringify(stock, null, 2));
      const csvHeader = 'ID,ジャンル,作品名,出演者,内部メモ,画像URL,サンプル動画URL,アフィリリンク,親投稿本文,リプライ本文,投稿済み';
      const csvRows = stock.items.map(toCsvRow);
      fs.writeFileSync(CSV_PATH, [csvHeader, ...csvRows].join('\n'), 'utf-8');
      console.log(`\n✓ ${STOCK_PATH} を更新`);
    } else {
      console.log('\n--- DRY RUN: ファイル書き込みスキップ ---');
      stock.items.slice(0, 3).forEach(i => console.log(`${i.zId}: ${i.parentPost.split('\n')[0]}`));
    }
    return;
  }

  const posted: PostedFile = fs.existsSync(POSTED_PATH)
    ? JSON.parse(fs.readFileSync(POSTED_PATH, 'utf-8'))
    : { postedIds: [], note: '' };

  const existingIds = new Set([
    ...stock.items.map(i => i.id),
    ...posted.postedIds,
  ]);

  // 既存ストックの拒否テキスト修復
  console.log('\n▼ 既存ストックの拒否レスポンス修復チェック...');
  const repairedCount = await repairRefusedItems(client, stock.items);
  console.log(`  修復: ${repairedCount}件`);

  const newItems: StockItem[] = [];

  for (const genre of GENRES) {
    const hitsForGenre = HITS_PER_GENRE[genre];
    console.log(`\n▼ ${genre} の商品取得中（${hitsForGenre}件）...`);

    let items: DMMItem[];
    try {
      items = await fetchDMMItems(genre, hitsForGenre);
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

      // VRジャンルを除外
      const genreNames = item.iteminfo?.genre?.map(g => g.name) ?? [];
      if (genreNames.some(n => n.includes('VR') || n.includes('バーチャルリアリティ'))) {
        console.log(`  スキップ（VR）: ${item.content_id}`);
        continue;
      }

      const sampleUrl   = pickSampleUrl(item);
      const actressName = pickActressName(item);

      console.log(`  生成中: ${item.title.slice(0, 30)}...`);

      let comment    = '';
      let parentPost = '';
      let replyPost  = '';

      try {
        // 3つのテキストを並列生成
        [comment, parentPost, replyPost] = await Promise.all([
          generateComment(client, item.title, actressName, genre),
          generateParentPost(client, item.title, actressName, genre, sampleUrl),
          generateReplyPost(client, item.title, actressName, genre, item.affiliateURL),
        ]);
      } catch (e) {
        console.error('  テキスト生成エラー:', e);
        comment    = `${actressName}嬢の${genre}、小生タマラン・・・！！`;
        parentPost = `${actressName}嬢の${genre}作品、これは観ておけ・・・！！${sampleUrl ? '\n' + sampleUrl : ''}`;
        replyPost  = `${actressName}嬢の新作。全編・詳細はこちら↓\n${item.affiliateURL}`;
      }

      const allSoFar = [...stock.items, ...newItems];
      const stockItem: StockItem = {
        zId:          nextZId(allSoFar),
        id:           item.content_id,
        genre,
        title:        item.title,
        actressName,
        imageUrl:     item.imageURL.large,
        sampleUrl,
        affiliateUrl: item.affiliateURL,
        comment,
        parentPost,
        replyPost,
        posted:       false,
        addedAt:      new Date().toISOString(),
      };

      newItems.push(stockItem);
      existingIds.add(item.content_id);

      console.log(`  ✓ [${genre}] ${comment}`);
      console.log(`    親: ${parentPost.slice(0, 40)}...`);
      console.log(`    返: ${replyPost.slice(0, 40)}...`);

      await new Promise(r => setTimeout(r, 300));
    }
  }

  // サブスクCTAを10件に1件の割合で挿入
  const ctaCount = Math.max(1, Math.floor(newItems.length / 10));
  const existingCtaCount = stock.items.filter(i => i.genre === 'サブスク').length;
  for (let i = 0; i < ctaCount; i++) {
    const insertAt = (i + 1) * 10 + i; // 10, 21, 32... の位置に挿入
    const cta = buildSubscriptionCta(existingCtaCount + i, [...stock.items, ...newItems]);
    newItems.splice(Math.min(insertAt, newItems.length), 0, cta);
  }

  const regularCount = newItems.filter(i => i.genre !== 'サブスク').length;
  const ctaAdded     = newItems.filter(i => i.genre === 'サブスク').length;
  const joshiCount   = newItems.filter(i => i.genre === '熟女').length;
  console.log(`\n新規追加: ${newItems.length}件（通常: ${regularCount}件, CTA: ${ctaAdded}件）`);
  console.log(`ジャンル内訳: 熟女 ${joshiCount}件（${Math.round(joshiCount / regularCount * 100)}%）, CTA ${ctaAdded}件`);
  GENRES.forEach(g => {
    const c = newItems.filter(i => i.genre === g).length;
    if (c > 0) console.log(`  ${g}: ${c}件`);
  });

  if (dryRun) {
    console.log('--- DRY RUN: ファイル書き込みスキップ ---');
    // CTA投稿サンプル表示
    const ctaSample = newItems.find(i => i.genre === 'サブスク');
    if (ctaSample) {
      console.log('\n[サブスクCTAサンプル]');
      console.log(`  親: ${ctaSample.parentPost}`);
      console.log(`  返: ${ctaSample.replyPost}`);
    }
    console.log(JSON.stringify(newItems.slice(0, 3), null, 2));
    return;
  }

  stock.items.unshift(...newItems);
  stock.totalCount = stock.items.length;
  stock.updatedAt  = new Date().toISOString();
  stock.note       = 'zassou-stock-generator.tsにより1日3回(9:00/15:00/21:00 JST)自動更新';

  fs.writeFileSync(STOCK_PATH, JSON.stringify(stock, null, 2));
  console.log(`✓ ${STOCK_PATH} を更新（合計 ${stock.totalCount}件）`);

  const csvHeader = 'ID,ジャンル,作品名,出演者,内部メモ,画像URL,サンプル動画URL,アフィリリンク,親投稿本文,リプライ本文,投稿済み';
  const csvRows   = stock.items.map(toCsvRow);
  fs.writeFileSync(CSV_PATH, [csvHeader, ...csvRows].join('\n'), 'utf-8');
  console.log(`✓ ${CSV_PATH} を更新`);
}

main().catch(e => { console.error(e); process.exit(1); });

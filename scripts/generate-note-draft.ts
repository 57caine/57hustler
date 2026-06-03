/**
 * note記事 週次自動生成スクリプト
 *
 * prices.json + products.json から今週の最安値ランキングを集計し、
 * Claude API で読み物として面白いnote記事の下書きを生成する。
 * 出力: note-drafts/YYYY-MM-DD.md
 *
 * GitHub Actions で週1回実行 → オーナーがnoteにコピーして公開するだけ
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

interface PriceRecord {
  productId: string;
  storeId: string;
  price: number;
  inStock: boolean;
  lastUpdated: string;
}

interface Product {
  id: string;
  name: string;
  brandName: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  description: string;
  waterContent?: string;
  popularity: number;
}

interface Store {
  id: string;
  name: string;
  shipping: number;
  freeShippingMin: number;
}

function calcTotal(price: number, store: Store): number {
  const free = store.freeShippingMin === 0 || price >= store.freeShippingMin;
  return free ? price : price + store.shipping;
}

function buildRankingData() {
  const pricesData = JSON.parse(fs.readFileSync('data/prices.json', 'utf-8'));
  const productsData = JSON.parse(fs.readFileSync('data/products.json', 'utf-8'));

  const products = new Map<string, Product>(productsData.products.map((p: Product) => [p.id, p]));
  const stores = new Map<string, Store>(productsData.stores.map((s: Store) => [s.id, s]));

  // 商品ごとの最安値（送料込み）を集計
  const cheapestByProduct = new Map<string, { price: number; total: number; storeName: string; productName: string; category: string }>();

  for (const record of pricesData.prices as PriceRecord[]) {
    if (!record.inStock) continue;
    const store = stores.get(record.storeId);
    const product = products.get(record.productId);
    if (!store || !product) continue;

    const total = calcTotal(record.price, store);
    const existing = cheapestByProduct.get(record.productId);
    if (!existing || total < existing.total) {
      cheapestByProduct.set(record.productId, {
        price: record.price,
        total,
        storeName: store.name,
        productName: product.name,
        category: product.category,
      });
    }
  }

  // popularity順にソートして上位10件
  const ranked = Array.from(cheapestByProduct.entries())
    .map(([id, data]) => ({
      id,
      popularity: products.get(id)?.popularity ?? 0,
      ...data,
    }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  // カテゴリ別最安
  const categories: Record<string, { name: string; cheapest: number; storeName: string }> = {};
  for (const [, data] of cheapestByProduct) {
    const cat = data.category;
    if (!categories[cat] || data.total < categories[cat].cheapest) {
      const catName = productsData.categories.find((c: { slug: string; name: string }) => c.slug === cat)?.name ?? cat;
      categories[cat] = { name: catName, cheapest: data.total, storeName: data.storeName };
    }
  }

  return { ranked, categories, updatedAt: pricesData.updatedAt };
}

async function generateArticle(rankingData: ReturnType<typeof buildRankingData>): Promise<string> {
  const client = new Anthropic();

  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const rankingText = rankingData.ranked
    .map((item, i) =>
      `${i + 1}. ${item.productName}（${item.category}）: ¥${item.total.toLocaleString()}送料込 @ ${item.storeName}（商品価格¥${item.price.toLocaleString()}）`
    )
    .join('\n');

  const categoryText = Object.values(rankingData.categories)
    .map(c => `・${c.name}: 最安¥${c.cheapest.toLocaleString()}送料込（${c.storeName}）`)
    .join('\n');

  const prompt = `あなたはコンタクトレンズ情報を発信するnoteクリエイターです。
今週のコンタクトレンズ価格データをもとに、読者が思わず保存したくなるnote記事を書いてください。

【今日の日付】
${today}

【人気商品ランキング（送料込み最安値）】
${rankingText}

【カテゴリ別最安値】
${categoryText}

【記事の要件】
- 文字数: 1500〜2000字
- トーン: 親しみやすく・情報が濃い・信頼できる
- 構成:
  1. 見出し（タイトル）: 読者が「これは読まなきゃ」と感じるもの。数字を入れる。
  2. リード文（3〜4行）: 今週の価格トレンドを一言で
  3. 今週のMVP商品: 1位の商品をフィーチャーして詳しく解説
  4. カテゴリ別おすすめ: 各カテゴリのベストバイを解説
  5. 節約ポイント: 読者がすぐ使える購入タイミング・比較のコツ
  6. まとめ + CTA: lens-navi（https://lens-navi.jp）で最新比較をチェック、と促す
- 数字・金額は必ず具体的に記載すること
- 専門的すぎず、コンタクトを普段使いしている人が読んで「ためになった」と思える内容
- マークダウン形式で出力（## 見出し、**太字** など使用可）

記事本文のみ出力してください（前置き・解説は不要）。`;

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3000,
    system: 'あなたはコンタクトレンズ情報の専門ライターです。読者の役に立つ、保存されやすいnote記事を書きます。',
    messages: [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as { type: string; text: string }).text;
}

async function main() {
  console.log('=== note記事生成開始 ===');

  const rankingData = buildRankingData();
  console.log(`価格データ読み込み完了: ${rankingData.ranked.length}商品`);

  console.log('Claude API で記事生成中...');
  const article = await generateArticle(rankingData);

  const date = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'note-drafts');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${date}.md`);
  const header = `---
生成日: ${date}
価格データ更新日時: ${rankingData.updatedAt}
ステータス: 下書き（未公開）
公開手順: このファイルの内容をnote.comにコピーして公開
---

`;
  fs.writeFileSync(outputPath, header + article, 'utf-8');

  console.log(`\n✓ 記事を保存しました: ${outputPath}`);
  console.log('次のステップ: note.com にログインしてコピー&ペーストで公開してください');
}

main().catch(e => { console.error(e); process.exit(1); });

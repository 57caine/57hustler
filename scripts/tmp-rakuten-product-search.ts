/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * 楽天市場商品検索APIで、megane-facial-shape-frame-2026の残り4カテゴリー分の
 * 商品候補（商品名・画像URL・商品ページURL）を取得する。
 * かんたんリンクコードの発行は含まない（もしもアフィリエイト側で手動対応）。
 */

interface RakutenItem {
  Item: {
    itemName: string;
    itemUrl: string;
    mediumImageUrls: { imageUrl: string }[];
    shopName: string;
    itemPrice: number;
  };
}

interface RakutenSearchResponse {
  Items: RakutenItem[];
  error?: string;
  error_description?: string;
}

const CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: '四角顔向け', keywords: ['ボストン メガネ', 'オーバル メガネ'] },
  { label: '菱形顔向け', keywords: ['ボストン ウェリントン メガネ'] },
  { label: '逆三角形顔向け', keywords: ['ウェリントン メガネ'] },
  { label: 'まとめ用（汎用）', keywords: ['定番 メガネフレーム'] },
];

async function searchItems(keyword: string, appId: string, hits: number): Promise<RakutenItem[]> {
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?applicationId=${appId}&keyword=${encodeURIComponent(keyword)}&hits=${hits}&sort=-reviewCount&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  ERROR (${keyword}): ${res.status} ${await res.text()}`);
    return [];
  }
  const data = (await res.json()) as RakutenSearchResponse;
  if (data.error) {
    console.log(`  API ERROR (${keyword}): ${data.error} - ${data.error_description}`);
    return [];
  }
  return data.Items ?? [];
}

async function main() {
  const appId = process.env.RAKUTEN_APP_ID;
  if (!appId) throw new Error('RAKUTEN_APP_ID is not set');

  for (const category of CATEGORIES) {
    console.log(`\n\n========== ${category.label} ==========`);
    for (const keyword of category.keywords) {
      console.log(`\n--- キーワード: "${keyword}" ---`);
      const items = await searchItems(keyword, appId, 5);
      if (items.length === 0) {
        console.log('  結果なし');
        continue;
      }
      items.forEach((entry, i) => {
        const item = entry.Item;
        console.log(`\n候補${i + 1}:`);
        console.log(`  商品名: ${item.itemName}`);
        console.log(`  ショップ: ${item.shopName}`);
        console.log(`  価格: ¥${item.itemPrice}`);
        console.log(`  画像URL: ${item.mediumImageUrls?.[0]?.imageUrl ?? '(なし)'}`);
        console.log(`  商品ページURL: ${item.itemUrl}`);
      });
    }
  }

  console.log('\n\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });

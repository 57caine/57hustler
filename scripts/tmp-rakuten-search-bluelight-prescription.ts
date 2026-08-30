/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * blue-light-megane-koukaのパターンA再構成で使う「度ありブルーライトカット眼鏡」
 * の商品候補を、楽天市場Web Service APIで検索する。
 * 既存3商品（mujinaブランド）とはブランドを分散させるため、mujina以外の
 * 商品を優先的に探す。かんたんリンクコードの発行は含まない
 * （もしもアフィリエイト側で手動対応）。
 */
import https from 'node:https';

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

const KEYWORDS = [
  'ブルーライトカット 度付き メガネ',
  '度付き PCメガネ ブルーライトカット',
];

function requestOnce(url: string, headers: Record<string, string>): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body }));
    });
    req.on('error', reject);
  });
}

function searchItems(keyword: string, appId: string, accessKey: string, hits: number): Promise<RakutenItem[]> {
  const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?applicationId=${appId}&accessKey=${accessKey}&keyword=${encodeURIComponent(keyword)}&hits=${hits}&sort=-reviewCount&format=json`;
  const headers = { Referer: 'https://lens-navi.jp/', Origin: 'https://lens-navi.jp' };
  return requestOnce(url, headers).then(({ statusCode, body }) => {
    if (statusCode !== 200) {
      console.log(`  ERROR (${keyword}): ${statusCode} ${body}`);
      return [];
    }
    const data = JSON.parse(body) as RakutenSearchResponse;
    if (data.error) {
      console.log(`  API ERROR (${keyword}): ${data.error} - ${data.error_description}`);
      return [];
    }
    return data.Items ?? [];
  }).catch((e) => {
    console.log(`  REQUEST ERROR (${keyword}): ${e.message}`);
    return [];
  });
}

async function main() {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId) throw new Error('RAKUTEN_APP_ID is not set');
  if (!accessKey) throw new Error('RAKUTEN_ACCESS_KEY is not set');

  let isFirst = true;
  for (const keyword of KEYWORDS) {
    if (!isFirst) await new Promise(r => setTimeout(r, 2000));
    isFirst = false;
    console.log(`\n--- キーワード: "${keyword}" ---`);
    const items = await searchItems(keyword, appId, accessKey, 5);
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

  console.log('\n\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });

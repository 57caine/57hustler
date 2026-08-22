/**
 * 一時調査スクリプト（実装ではなく調査目的）
 * 楽天市場商品検索APIで、megane-facial-shape-frame-2026の残り4カテゴリー分の
 * 商品候補（商品名・画像URL・商品ページURL）を取得する。
 * かんたんリンクコードの発行は含まない（もしもアフィリエイト側で手動対応）。
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

const CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: '四角顔向け', keywords: ['ボストン メガネ', 'オーバル メガネ'] },
  { label: '菱形顔向け', keywords: ['ボストン ウェリントン メガネ'] },
  { label: '逆三角形顔向け', keywords: ['ウェリントン メガネ'] },
  { label: 'まとめ用（汎用）', keywords: ['定番 メガネフレーム'] },
];

// 2026年2月の楽天ウェブサービスAPI仕様変更に対応（新ドメイン・accessKey必須・Refererヘッダー必須）。
// 【注意】この環境からは楽天の公式ドキュメントに直接アクセスできず、Web検索のスニペット情報のみを
// 根拠にしているため、正確性は保証できない。失敗した場合は具体的なエラー内容を報告する。
//
// 【重要】fetch()のheadersに"Referer"を指定しても、Fetch仕様上のforbidden
// request headerに該当し実際には送信されない。RequestInitのreferrer/
// referrerPolicyオプションを使っても、Node.jsのfetch実装（undici）は
// ブラウジングコンテキストを持たないためReferer送信を行わず、同じエラーが
// 再発した。この制限を回避するため、node:https で直接リクエストを組み立て、
// 任意のヘッダーとしてRefererを設定する。
function searchItems(keyword: string, appId: string, accessKey: string, hits: number): Promise<RakutenItem[]> {
  return new Promise((resolve) => {
    const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?applicationId=${appId}&accessKey=${accessKey}&keyword=${encodeURIComponent(keyword)}&hits=${hits}&sort=-reviewCount&format=json`;
    const req = https.get(url, { headers: { Referer: 'https://lens-navi.jp/' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log(`  ERROR (${keyword}): ${res.statusCode} ${body}`);
          resolve([]);
          return;
        }
        const data = JSON.parse(body) as RakutenSearchResponse;
        if (data.error) {
          console.log(`  API ERROR (${keyword}): ${data.error} - ${data.error_description}`);
          resolve([]);
          return;
        }
        resolve(data.Items ?? []);
      });
    });
    req.on('error', (e) => {
      console.log(`  REQUEST ERROR (${keyword}): ${e.message}`);
      resolve([]);
    });
  });
}

async function main() {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId) throw new Error('RAKUTEN_APP_ID is not set');
  if (!accessKey) throw new Error('RAKUTEN_ACCESS_KEY is not set');

  let isFirst = true;
  for (const category of CATEGORIES) {
    console.log(`\n\n========== ${category.label} ==========`);
    for (const keyword of category.keywords) {
      if (!isFirst) {
        // レート制限回避のため、リクエスト間隔を空ける
        await new Promise(r => setTimeout(r, 2000));
      }
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
  }

  console.log('\n\n調査完了');
}

main().catch(e => { console.error(e); process.exit(1); });

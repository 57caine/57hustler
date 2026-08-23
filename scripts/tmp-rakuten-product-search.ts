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
// 楽天ウェブサービス管理画面の「許可されたWebサイト」には lens-navi.jp / *.lens-navi.jp
// が登録済みと確認済み。それでも REQUEST_CONTEXT_BODY_HTTP_REFERRER_MISSING が
// 続いたため、Refererの値の形式（末尾スラッシュ有無）・Originヘッダー同時送信の
// 有無で候補を複数用意し、順番に試す。
interface RefererCombo {
  label: string;
  headers: Record<string, string>;
}

const REFERER_COMBOS: RefererCombo[] = [
  { label: 'Referer末尾スラッシュあり + Origin', headers: { Referer: 'https://lens-navi.jp/', Origin: 'https://lens-navi.jp' } },
  { label: 'Referer末尾スラッシュなし + Origin', headers: { Referer: 'https://lens-navi.jp', Origin: 'https://lens-navi.jp' } },
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

// 複数のReferer/Origin候補を順番に試し、最初に成功した組み合わせで
// 以降のリクエストも継続する。全て失敗した場合は各候補のエラーを報告する。
async function findWorkingCombo(appId: string, accessKey: string): Promise<RefererCombo | null> {
  const probeUrl = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?applicationId=${appId}&accessKey=${accessKey}&keyword=${encodeURIComponent('ボストン メガネ')}&hits=1&format=json`;
  for (let i = 0; i < REFERER_COMBOS.length; i++) {
    const combo = REFERER_COMBOS[i];
    if (i > 0) await new Promise(r => setTimeout(r, 2000));
    console.log(`\n[候補${i + 1}: ${combo.label}] 送信ヘッダー: ${JSON.stringify(combo.headers)}`);
    try {
      const { statusCode, body } = await requestOnce(probeUrl, combo.headers);
      if (statusCode === 200) {
        const data = JSON.parse(body) as RakutenSearchResponse;
        if (!data.error) {
          console.log(`  → 成功。この組み合わせを採用する。`);
          return combo;
        }
        console.log(`  → API ERROR: ${data.error} - ${data.error_description}`);
      } else {
        console.log(`  → ERROR: ${statusCode} ${body}`);
      }
    } catch (e) {
      console.log(`  → REQUEST ERROR: ${(e as Error).message}`);
    }
  }
  return null;
}

function searchItems(keyword: string, appId: string, accessKey: string, hits: number, headers: Record<string, string>): Promise<RakutenItem[]> {
  const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?applicationId=${appId}&accessKey=${accessKey}&keyword=${encodeURIComponent(keyword)}&hits=${hits}&sort=-reviewCount&format=json`;
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

  console.log('=== Referer/Origin候補の事前チェック ===');
  const workingCombo = await findWorkingCombo(appId, accessKey);
  if (!workingCombo) {
    console.log('\n\n全ての候補で失敗しました。ヘッダーの送信方法以外に原因がある可能性が高いです。');
    return;
  }

  await new Promise(r => setTimeout(r, 2000));

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
      const items = await searchItems(keyword, appId, accessKey, 5, workingCombo.headers);
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

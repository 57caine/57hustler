/**
 * 楽天市場 商品検索API から、ページに表示する商品を取得して data/products.json に書き出す。
 * GitHub Actions の公開ワークフローからのみ実行する（開発環境からは楽天APIに届かないため）。
 *
 * 楽天トラベルAPI（楽旅くん）との違い（2026-10-05 Actions上の実レスポンスで確認）:
 * - エンドポイント: /ichibams/api/IchibaItem/Search/20260701（トラベルは /engine/api/Travel/...）
 * - レスポンス: formatVersion=2 で Items が商品オブジェクトの配列（トラベルは hotels[].hotel[] の入れ子）
 * - アフィリエイトURL: affiliateUrl に hb.afl.rakuten.co.jp/hgc/{ショップごとに変換されたID}/?pc=... の形で返る。
 *   渡したアフィリエイトIDそのものは URL に現れないため、IDを付けずに取得した場合と比較して、
 *   IDを渡したことでアフィリエイトURLが付くことを毎回確認する（verifyAffiliateAttribution）
 * - 画像: mediumImageUrls（128x128 の URL 文字列の配列）。加工せず先頭の1枚をそのまま使う
 * 共通点（lens-navi・楽旅くんで確認済みの仕様）: accessKey 必須、Referer/Origin ヘッダー必須
 * （値は楽天ウェブサービスの「許可されたWebサイト」に登録済みのドメイン）、Node標準 fetch は Referer を送らないため node:https を使う。
 *
 * 失敗時は終了コード1で止める（公開ワークフローもそこで止まり、前回の公開内容がそのまま残る）。
 */

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCT_GROUPS } from '../lib/product-groups';
import { displayName, isExcludedName } from '../lib/product-filter';
import { RAKUTEN_AFFILIATE_ID } from '../lib/site';
import type { Product, ProductsFile } from '../lib/products';

const ENDPOINT = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701';
/** ペット・ペットグッズ（楽天市場のジャンルID） */
const PET_GENRE_ID = '101213';
const REFERER = process.env.RAKUTEN_API_REFERER || 'https://lens-navi.jp/';
const OUT = path.join(__dirname, '..', 'data', 'products.json');

interface RawItem {
  itemName: string;
  itemCode: string;
  itemUrl: string;
  affiliateUrl?: string;
  shopName: string;
  mediumImageUrls?: (string | { imageUrl: string })[];
  availability?: number;
}

function requestJson(url: string): Promise<{ status: number; data: unknown }> {
  const origin = new URL(REFERER).origin;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Referer: REFERER, Origin: origin } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode ?? 0, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode ?? 0, data: { parseError: body.slice(0, 200) } });
        }
      });
    });
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function search(keyword: string, page: number, withAffiliate = true): Promise<RawItem[]> {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId || !accessKey) throw new Error('RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が設定されていません');
  const q = new URLSearchParams({
    applicationId: appId,
    accessKey,
    keyword,
    genreId: PET_GENRE_ID,
    hits: '30',
    page: String(page),
    availability: '1',
    imageFlag: '1',
    formatVersion: '2',
    format: 'json',
  });
  if (withAffiliate) q.set('affiliateId', RAKUTEN_AFFILIATE_ID);
  // 連続リクエストはレート制限に掛かるため、毎回間隔を空ける
  await sleep(1500);
  const { status, data } = await requestJson(`${ENDPOINT}?${q}`);
  const d = data as { Items?: RawItem[]; error?: string; error_description?: string; errors?: unknown };
  if (status !== 200 || d.error || d.errors || !Array.isArray(d.Items)) {
    throw new Error(`楽天API エラー（${keyword}）: HTTP ${status} ${JSON.stringify(data).slice(0, 300)}`);
  }
  return d.Items;
}

function firstImage(item: RawItem): string | null {
  const first = item.mediumImageUrls?.[0];
  if (!first) return null;
  return typeof first === 'string' ? first : first.imageUrl;
}

/** 商品ページ（item.rakuten.co.jp）への楽天アフィリエイトURLか */
function isAffiliateItemUrl(url: string | undefined): url is string {
  if (!url || !url.startsWith('https://hb.afl.rakuten.co.jp/')) return false;
  const pc = new URL(url).searchParams.get('pc') ?? '';
  return pc.startsWith('https://item.rakuten.co.jp/');
}

/**
 * IDを渡したときだけアフィリエイトURLが付くことを確認する。
 * 付かない（＝IDと無関係に同じURLが返る）なら、収益が当アカウントに付かない可能性があるため停止する。
 */
async function verifyAffiliateAttribution(): Promise<string> {
  const kw = PRODUCT_GROUPS[0].keywords[0];
  const withId = (await search(kw, 1, true))[0];
  const withoutId = (await search(kw, 1, false))[0];
  const a = withId?.affiliateUrl ?? '';
  const b = withoutId?.affiliateUrl ?? '';
  const lines = [
    `アフィリエイトID あり: affiliateUrl=${a.slice(0, 70)}…`,
    `アフィリエイトID なし: affiliateUrl=${b ? b.slice(0, 70) + '…' : '（空）'} / itemUrl=${(withoutId?.itemUrl ?? '').slice(0, 50)}`,
  ];
  if (!isAffiliateItemUrl(a)) throw new Error(`アフィリエイトIDを渡してもアフィリエイトURLが返りません\n${lines.join('\n')}`);
  if (b && b === a) throw new Error(`アフィリエイトIDの有無で affiliateUrl が変わりません（当アカウントに紐づいていない可能性）\n${lines.join('\n')}`);
  return lines.join('\n');
}

async function main() {
  console.log('=== アフィリエイトIDの紐づけ確認 ===');
  const attribution = await verifyAffiliateAttribution();
  console.log(attribution);

  const used = new Set<string>(); // 同じ商品を複数ページに載せない
  const usedNames = new Set<string>(); // 同じ商品の別ショップ出品を重ねて載せない
  const groups: ProductsFile['groups'] = {};
  const stats: string[] = [];

  for (const group of PRODUCT_GROUPS) {
    const picked: Product[] = [];
    let seen = 0;
    let excluded = 0;
    for (const keyword of group.keywords) {
      for (let page = 1; page <= 3 && picked.length < group.limit; page++) {
        const items = await search(keyword, page);
        for (const it of items) {
          if (picked.length >= group.limit) break;
          seen++;
          const image = firstImage(it);
          const nameKey = displayName(it.itemName).slice(0, 24);
          if (!isAffiliateItemUrl(it.affiliateUrl) || !image || it.availability === 0) { excluded++; continue; }
          if (isExcludedName(it.itemName)) { excluded++; continue; }
          if (!group.mustMatch.test(it.itemName)) { excluded++; continue; }
          if (used.has(it.itemCode) || usedNames.has(nameKey)) continue;
          used.add(it.itemCode);
          usedNames.add(nameKey);
          picked.push({
            itemCode: it.itemCode,
            name: displayName(it.itemName),
            shopName: it.shopName,
            url: it.affiliateUrl as string,
            imageUrl: image,
          });
        }
      }
    }
    groups[group.id] = picked;
    stats.push(`${group.id}: ${picked.length}/${group.limit}件（確認${seen}件・除外${excluded}件）`);
    if (picked.length === 0) throw new Error(`商品が1件も残りませんでした: ${group.id}`);
  }

  const out: ProductsFile = { fetchedAt: new Date().toISOString(), attribution, groups };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('=== 取得結果 ===');
  console.log(stats.join('\n'));
  for (const g of PRODUCT_GROUPS) {
    console.log(`--- ${g.label}`);
    for (const p of groups[g.id]) console.log(`  ${p.name.slice(0, 60)} | ${p.shopName}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

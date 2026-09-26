/**
 * 楽天トラベルAPIの接続確認（テスト取得）スクリプト。
 * GitHub Actions（.github/workflows/rakutabi-api-test.yml）上で実行する。
 * この開発環境からは rakuten.co.jp に直接アクセスできないため、実際の疎通確認はActions上で行う。
 *
 * 確認内容:
 *   1. 地区コードAPI（GetAreaClass）: site-config.ts の AREAS のコードが実在するか
 *   2. 施設検索API（SimpleHotelSearch）: 箱根の施設を3件取得できるか
 *   3. 空室検索API（VacantHotelSearch）: 次の土曜日に空室がある温泉宿を取得できるか
 *   4. 施設情報API（HotelDetailSearch）: 施設番号指定で詳細を取得できるか
 *
 * アプリID・アクセスキーはログに出さない。
 */

import { AREAS } from '../lib/site-config';
import { callApi, credentialsFromEnv, ENDPOINTS, flattenHotels, GET_AREA_CLASS_CANDIDATES, sleep, type ApiResult } from '../lib/rakuten-travel';
import { nextSaturdayJst } from './lib/dates';

type Row = { api: string; result: string; detail: string };
const summary: Row[] = [];

function collectAreaCodes(node: unknown, middle: string | null, out: Set<string>) {
  if (Array.isArray(node)) {
    for (const n of node) collectAreaCodes(n, middle, out);
    return;
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    let current = middle;
    if (typeof obj.middleClassCode === 'string') current = obj.middleClassCode;
    // middleClass は [{ middleClassCode, ... }, { smallClasses }] の形なので、配列内の兄弟にもコードを伝える
    if (Array.isArray(obj.middleClass)) {
      const codeHolder = obj.middleClass.find(
        (x) => x && typeof x === 'object' && typeof (x as Record<string, unknown>).middleClassCode === 'string',
      ) as Record<string, unknown> | undefined;
      if (codeHolder) current = codeHolder.middleClassCode as string;
    }
    if (typeof obj.smallClassCode === 'string' && current) out.add(`${current}/${obj.smallClassCode}`);
    for (const v of Object.values(obj)) collectAreaCodes(v, current, out);
  }
}

/** 指定した都道府県（middleClass）配下の小地区・詳細地区のコードと名称を列挙する（生JSONを文字列として検索） */
function describeMiddleClass(data: unknown, middleCode: string): string[] {
  const json = JSON.stringify(data);
  const start = json.indexOf(`"middleClassCode":"${middleCode}"`);
  if (start < 0) return [];
  const next = json.indexOf('"middleClassCode"', start + 1);
  const chunk = json.slice(start, next < 0 ? undefined : next);
  const lines: string[] = [];
  const re = /"(small|detail)ClassCode":"([^"]*)","\1ClassName":"([^"]*)"|"(small|detail)ClassName":"([^"]*)","\4ClassCode":"([^"]*)"/g;
  for (const m of chunk.matchAll(re)) {
    const kind = m[1] ?? m[4];
    const code = m[2] ?? m[6];
    const name = m[3] ?? m[5];
    lines.push(`${kind === 'detail' ? '  └ detail ' : ''}${code}: ${name}`);
  }
  return lines.length ? lines : [chunk.slice(0, 1500)];
}

async function main() {
  const cred = credentialsFromEnv();
  console.log(`Referer: ${cred.referer}`);
  console.log(`アフィリエイトID: ${cred.affiliateId ? '設定あり' : '未設定（予約ボタンのURLはアフィリエイトリンクにならない）'}`);

  // 1. GetAreaClass
  console.log('\n=== 1. 地区コードAPI (GetAreaClass) ===');
  let area: ApiResult = { ok: false, statusCode: 0, error: '未実行' };
  for (const endpoint of GET_AREA_CLASS_CANDIDATES) {
    area = await callApi(endpoint, {}, cred);
    console.log(`  ${endpoint.split('/').pop()}: ${area.ok ? '成功' : `失敗 HTTP ${area.statusCode} ${area.error}`}`);
    if (area.ok) break;
    await sleep(1500);
  }
  if (area.ok) {
    const codes = new Set<string>();
    collectAreaCodes(area.data, null, codes);
    console.log(`取得した小地区コード数: ${codes.size}`);
    const missing: string[] = [];
    for (const a of AREAS) {
      const key = `${a.middleClassCode}/${a.smallClassCode}`;
      const found = codes.has(key);
      console.log(`  ${found ? 'OK ' : 'NG '} ${a.name}（${key}）`);
      if (!found) {
        missing.push(a.name);
        const candidates = [...codes].filter((c) => c.startsWith(`${a.middleClassCode}/`));
        console.log(`      → ${a.middleClassCode} 配下の実在コード: ${candidates.join(', ')}`);
        // 地区名・詳細地区（detailClass）も含めて表示し、正しいコードを選べるようにする
        for (const line of describeMiddleClass(area.data, a.middleClassCode)) console.log(`        ${line}`);
      }
    }
    summary.push({ api: 'GetAreaClass', result: 'OK', detail: missing.length ? `コード不一致: ${missing.join('・')}` : '全エリアのコード一致' });
  } else {
    console.log(`  失敗: HTTP ${area.statusCode} ${area.error}`);
    summary.push({ api: 'GetAreaClass', result: 'NG', detail: `HTTP ${area.statusCode} ${area.error}` });
  }
  await sleep(1500);

  // 2. SimpleHotelSearch
  console.log('\n=== 2. 施設検索API (SimpleHotelSearch) 箱根 3件 ===');
  const simple = await callApi(ENDPOINTS.simpleHotelSearch, {
    largeClassCode: 'japan', middleClassCode: 'kanagawa', smallClassCode: 'hakone', hits: 3,
  }, cred);
  let sampleHotelNo: number | null = null;
  if (simple.ok) {
    const hotels = flattenHotels(simple.data);
    for (const h of hotels) {
      const b = h.hotelBasicInfo ?? {};
      sampleHotelNo ??= Number(b.hotelNo);
      console.log(`  - [${b.hotelNo}] ${b.hotelName} / 最低料金 ¥${b.hotelMinCharge} / 評価 ${b.reviewAverage}（${b.reviewCount}件）`);
      console.log(`    施設URL: ${b.hotelInformationUrl}`);
      console.log(`    画像: ${b.hotelImageUrl}`);
    }
    summary.push({ api: 'SimpleHotelSearch', result: 'OK', detail: `${hotels.length}件取得` });
  } else {
    console.log(`  失敗: HTTP ${simple.statusCode} ${simple.error}`);
    summary.push({ api: 'SimpleHotelSearch', result: 'NG', detail: `HTTP ${simple.statusCode} ${simple.error}` });
  }
  await sleep(1500);

  // 3. VacantHotelSearch
  const { checkin, checkout } = nextSaturdayJst();
  console.log(`\n=== 3. 空室検索API (VacantHotelSearch) 箱根 ${checkin}泊 大人2名 温泉あり 3件 ===`);
  const vacant = await callApi(ENDPOINTS.vacantHotelSearch, {
    largeClassCode: 'japan', middleClassCode: 'kanagawa', smallClassCode: 'hakone',
    checkinDate: checkin, checkoutDate: checkout, adultNum: 2, squeezeCondition: 'onsen', hits: 3,
  }, cred);
  if (vacant.ok) {
    const hotels = flattenHotels(vacant.data);
    for (const h of hotels) {
      const b = h.hotelBasicInfo ?? {};
      const charges = (h.roomInfo ?? []).map((r) => Number(r.dailyCharge?.total)).filter((n) => n > 0);
      console.log(`  - [${b.hotelNo}] ${b.hotelName} / 空室プラン${h.roomInfo?.length ?? 0}件 / 合計料金の最安 ¥${charges.length ? Math.min(...charges) : '-'}`);
      console.log(`    プラン一覧URL: ${b.planListUrl}`);
      const room = h.roomInfo?.[0];
      if (room) console.log(`    roomBasicInfoの項目: ${Object.keys(room.roomBasicInfo ?? {}).join(', ')}`);
    }
    summary.push({ api: 'VacantHotelSearch', result: 'OK', detail: `${hotels.length}件取得（${checkin}泊）` });
  } else {
    console.log(`  失敗: HTTP ${vacant.statusCode} ${vacant.error}`);
    summary.push({ api: 'VacantHotelSearch', result: 'NG', detail: `HTTP ${vacant.statusCode} ${vacant.error}` });
  }
  await sleep(1500);

  // 4. HotelDetailSearch
  console.log('\n=== 4. 施設情報API (HotelDetailSearch) ===');
  if (sampleHotelNo) {
    const detail = await callApi(ENDPOINTS.hotelDetailSearch, { hotelNo: sampleHotelNo, responseType: 'large' }, cred);
    if (detail.ok) {
      const h = flattenHotels(detail.data)[0];
      const b = h?.hotelBasicInfo ?? {};
      console.log(`  - [${b.hotelNo}] ${b.hotelName}`);
      console.log(`    アクセス: ${b.access}`);
      console.log(`    紹介文: ${String(b.hotelSpecial ?? '').slice(0, 120)}`);
      summary.push({ api: 'HotelDetailSearch', result: 'OK', detail: `施設番号${sampleHotelNo}を取得` });
    } else {
      console.log(`  失敗: HTTP ${detail.statusCode} ${detail.error}`);
      summary.push({ api: 'HotelDetailSearch', result: 'NG', detail: `HTTP ${detail.statusCode} ${detail.error}` });
    }
  } else {
    console.log('  施設検索APIが失敗したため、施設番号が得られずスキップ');
    summary.push({ api: 'HotelDetailSearch', result: 'SKIP', detail: '施設番号なし' });
  }

  // 5. 施設検索API（複数施設番号・responseType=large）: fetch-hotels.ts が使う詳細項目の構造確認
  console.log('\n=== 5. 施設検索API 複数施設・responseType=large ===');
  await sleep(1500);
  const large = await callApi(ENDPOINTS.simpleHotelSearch, { hotelNo: '84721,19684', responseType: 'large' }, cred);
  if (large.ok) {
    const hotels = flattenHotels(large.data);
    const h = hotels[0] ?? {};
    for (const [section, value] of Object.entries(h)) {
      if (section === 'roomInfo') continue;
      const keys = Object.keys((value ?? {}) as Record<string, unknown>);
      console.log(`  ${section}: ${keys.join(', ')}`);
    }
    const b = h.hotelBasicInfo ?? {};
    console.log(`  口コミURL: ${b.reviewUrl}`);
    console.log(`  最新口コミ: ${String(b.userReview ?? '').slice(0, 80)}`);
    console.log(`  評価: ${JSON.stringify(h.hotelRatingInfo)}`);
    console.log(`  施設設備(生データ抜粋): ${JSON.stringify(h.hotelFacilitiesInfo ?? {}).slice(0, 400)}`);
    summary.push({ api: 'SimpleHotelSearch(large)', result: 'OK', detail: `${hotels.length}件取得` });
  } else {
    console.log(`  失敗: HTTP ${large.statusCode} ${large.error}`);
    summary.push({ api: 'SimpleHotelSearch(large)', result: 'NG', detail: `HTTP ${large.statusCode} ${large.error}` });
  }

  console.log('\n=== まとめ ===');
  console.table(summary);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const fs = await import('node:fs');
    const md = ['| API | 結果 | 内容 |', '|---|---|---|', ...summary.map((r) => `| ${r.api} | ${r.result} | ${r.detail} |`)].join('\n');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## 楽天トラベルAPI 接続確認\n\n${md}\n`);
  }

  if (summary.every((r) => r.result !== 'OK')) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * 楽天トラベルAPIから宿泊施設データを取得し、data/hotels.json を更新する。
 * GitHub Actions上で実行する（この開発環境からは rakuten.co.jp に直接アクセスできないため）。
 *
 * エリアごとに空室検索API（次の土曜日1泊）を条件違いで4回呼び、結果を施設番号で統合する:
 *   - 大人2名（条件なし）  → テーマ「週末旅行」
 *   - 大人2名＋温泉        → テーマ「温泉宿」・条件「温泉あり」
 *   - 大人2名＋朝食・夕食  → 条件「2食付きプランあり」
 *   - 大人1名              → テーマ「一人旅」
 * 子連れ・カップル・駅近・客室・景色は、施設紹介文（API取得）のキーワードで判定する（目安）。
 *
 * 取得に全面的に失敗した場合は既存の data/hotels.json を保持する（update-prices.ts と同じ方針）。
 */

import fs from 'node:fs';
import path from 'node:path';
import { AREAS, CONDITIONS, COUPLE_KEYWORDS, type ConditionKey, type ThemeSlug } from '../lib/site-config';
import { callApi, credentialsFromEnv, ENDPOINTS, flattenHotels, sleep, type RawHotel } from '../lib/rakuten-travel';
import type { Hotel, HotelsFile } from '../lib/hotels';
import { nextSaturdayJst } from './lib/dates';

const OUT = path.join(__dirname, '..', 'data', 'hotels.json');
const HITS = 30;

interface Query {
  label: string;
  params: Record<string, string | number>;
  themes: ThemeSlug[];
  conditions: ConditionKey[];
}

const QUERIES: Query[] = [
  { label: '大人2名', params: { adultNum: 2 }, themes: ['weekend'], conditions: [] },
  { label: '大人2名・温泉', params: { adultNum: 2, squeezeCondition: 'onsen' }, themes: ['onsen'], conditions: ['onsen'] },
  { label: '大人2名・2食付き', params: { adultNum: 2, squeezeCondition: 'breakfast,dinner' }, themes: [], conditions: ['meal'] },
  { label: '大人1名', params: { adultNum: 1 }, themes: ['solo'], conditions: [] },
];

const str = (v: unknown) => (v == null ? '' : String(v));
const num = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));

function toHotel(raw: RawHotel, areaKey: string): Hotel | null {
  const b = raw.hotelBasicInfo;
  if (!b || !b.hotelNo) return null;
  return {
    hotelNo: Number(b.hotelNo),
    name: str(b.hotelName),
    areaKey,
    address: `${str(b.address1)}${str(b.address2)}`,
    access: str(b.access),
    nearestStation: str(b.nearestStation),
    special: str(b.hotelSpecial),
    imageUrl: str(b.hotelImageUrl),
    roomImageUrl: str(b.roomImageUrl),
    informationUrl: str(b.hotelInformationUrl),
    planListUrl: str(b.planListUrl),
    minCharge: num(b.hotelMinCharge),
    reviewAverage: num(b.reviewAverage),
    reviewCount: num(b.reviewCount),
    themes: [],
    conditions: [],
  };
}

function addUnique<T>(arr: T[], items: T[]) {
  for (const i of items) if (!arr.includes(i)) arr.push(i);
}

async function main() {
  const cred = credentialsFromEnv();
  const { checkin, checkout } = nextSaturdayJst();
  console.log(`チェックイン ${checkin} / アフィリエイトID ${cred.affiliateId ? '設定あり' : '未設定'}`);

  const byNo = new Map<number, Hotel>();
  let success = 0;
  let failure = 0;

  for (const area of AREAS) {
    for (const q of QUERIES) {
      await sleep(1200);
      const res = await callApi(ENDPOINTS.vacantHotelSearch, {
        largeClassCode: 'japan',
        middleClassCode: area.middleClassCode,
        smallClassCode: area.smallClassCode,
        checkinDate: checkin,
        checkoutDate: checkout,
        hits: HITS,
        ...q.params,
      }, cred);
      if (!res.ok) {
        // 「該当施設なし」は楽天APIではエラー（not_found）として返るため、失敗と区別する
        if (res.statusCode === 404) {
          console.log(`  ${area.name} / ${q.label}: 該当なし`);
          success++;
        } else {
          console.log(`  ${area.name} / ${q.label}: 失敗 HTTP ${res.statusCode} ${res.error}`);
          failure++;
        }
        continue;
      }
      success++;
      const raws = flattenHotels(res.data);
      console.log(`  ${area.name} / ${q.label}: ${raws.length}件`);
      for (const raw of raws) {
        const h = toHotel(raw, area.key);
        if (!h) continue;
        const existing = byNo.get(h.hotelNo) ?? h;
        addUnique(existing.themes, q.themes);
        addUnique(existing.conditions, q.conditions);
        byNo.set(h.hotelNo, existing);
      }
    }
  }

  if (byNo.size === 0) {
    console.log(`\n施設を1件も取得できませんでした（成功${success}回・失敗${failure}回）。既存データを保持します。`);
    process.exit(failure > 0 ? 1 : 0);
  }

  // 施設紹介文・アクセス情報のキーワードで判定する条件・テーマ
  for (const h of byNo.values()) {
    const text = `${h.special} ${h.access}`;
    for (const c of CONDITIONS) {
      if (c.source === 'text' && c.keywords?.test(text)) addUnique(h.conditions, [c.key]);
    }
    if (h.conditions.includes('kids')) addUnique(h.themes, ['family']);
    if (COUPLE_KEYWORDS.test(h.special)) addUnique(h.themes, ['couple']);
  }

  const out: HotelsFile = {
    fetchedAt: new Date().toISOString(),
    checkinDate: checkin,
    hotels: [...byNo.values()].sort((a, b) => a.hotelNo - b.hotelNo),
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\n${out.hotels.length}施設を保存しました（成功${success}回・失敗${failure}回）`);
}

main().catch((e) => { console.error(e); process.exit(1); });

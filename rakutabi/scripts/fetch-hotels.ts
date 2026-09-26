/**
 * 楽天トラベルAPIから宿泊施設データを取得し、data/hotels.json を更新する。
 * GitHub Actions上で実行する（この開発環境からは rakuten.co.jp に直接アクセスできないため）。
 *
 * 1. エリアごとに空室検索API（次の土曜日1泊）を条件違いで5回呼び、結果を施設番号で統合する:
 *    - 大人2名（条件なし）  → テーマ「週末旅行」
 *    - 大人2名＋温泉        → テーマ「温泉旅行」・条件「温泉あり」
 *    - 大人2名＋朝食・夕食  → 条件「2食付きプランあり」
 *    - 大人2名＋朝食        → 条件「朝食付きプランあり」
 *    - 大人1名              → テーマ「一人旅」
 *    あわせて、空室のあったプラン（プラン名・部屋名・合計料金・予約URL）を保存する。
 * 2. 施設検索API（responseType=large、15施設ずつ）で、項目別評価・最新口コミ・施設詳細を補う。
 * 3. 子連れ・カップル・駅近・客室・景色は、施設紹介文（API取得）のキーワードで判定する（目安）。
 *
 * 取得に全面的に失敗した場合は既存の data/hotels.json を保持する（update-prices.ts と同じ方針）。
 */

import fs from 'node:fs';
import path from 'node:path';
import { AREAS, CONDITIONS, COUPLE_KEYWORDS, type ConditionKey, type ThemeSlug } from '../lib/site-config';
import { callApi, credentialsFromEnv, ENDPOINTS, flattenHotels, sleep, type RawHotel } from '../lib/rakuten-travel';
import type { DetailItem, Hotel, HotelsFile, Plan, Ratings } from '../lib/hotels';
import { stripHtml } from '../lib/hotel-text';
import { nextSaturdayJst } from './lib/dates';

const OUT = path.join(__dirname, '..', 'data', 'hotels.json');
const HITS = 30;
const MAX_PLANS = 6;
const DETAIL_BATCH = 15;

interface Query {
  label: string;
  params: Record<string, string | number>;
  adults: number;
  themes: ThemeSlug[];
  conditions: ConditionKey[];
}

const QUERIES: Query[] = [
  { label: '大人2名', params: { adultNum: 2 }, adults: 2, themes: ['weekend'], conditions: [] },
  { label: '大人2名・温泉', params: { adultNum: 2, squeezeCondition: 'onsen' }, adults: 2, themes: ['onsen'], conditions: ['onsen'] },
  { label: '大人2名・2食付き', params: { adultNum: 2, squeezeCondition: 'breakfast,dinner' }, adults: 2, themes: [], conditions: ['meal'] },
  { label: '大人2名・朝食付き', params: { adultNum: 2, squeezeCondition: 'breakfast' }, adults: 2, themes: [], conditions: ['breakfast'] },
  { label: '大人1名', params: { adultNum: 1 }, adults: 1, themes: ['solo'], conditions: [] },
];

const str = (v: unknown) => (v == null ? '' : String(v).trim());
const num = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));

function toHotel(raw: RawHotel, areaKey: string): Hotel | null {
  const b = raw.hotelBasicInfo;
  if (!b || !b.hotelNo) return null;
  return {
    hotelNo: Number(b.hotelNo),
    name: str(b.hotelName),
    kana: str(b.hotelKanaName),
    areaKey,
    address: `${str(b.address1)}${str(b.address2)}`,
    access: str(b.access),
    nearestStation: str(b.nearestStation),
    special: str(b.hotelSpecial),
    imageUrl: str(b.hotelImageUrl),
    roomImageUrl: str(b.roomImageUrl),
    informationUrl: str(b.hotelInformationUrl),
    planListUrl: str(b.planListUrl),
    reviewUrl: str(b.reviewUrl),
    minCharge: num(b.hotelMinCharge),
    reviewAverage: num(b.reviewAverage),
    reviewCount: num(b.reviewCount),
    userReview: stripHtml(str(b.userReview)),
    ratings: null,
    details: [],
    plans: [],
    themes: [],
    conditions: [],
  };
}

function toPlans(raw: RawHotel, adults: number): Plan[] {
  return (raw.roomInfo ?? [])
    .map((r) => {
      const rb = r.roomBasicInfo ?? {};
      const dc = r.dailyCharge ?? {};
      return {
        planName: str(rb.planName),
        roomName: str(rb.roomName),
        adults,
        total: num(dc.total),
        withBreakfast: str(rb.withBreakfastFlag) === '1',
        withDinner: str(rb.withDinnerFlag) === '1',
        reserveUrl: str(rb.reserveUrl),
      };
    })
    .filter((p) => p.planName);
}

function toRatings(r: Record<string, unknown> | undefined): Ratings | null {
  if (!r) return null;
  return {
    service: num(r.serviceAverage),
    location: num(r.locationAverage),
    room: num(r.roomAverage),
    equipment: num(r.equipmentAverage),
    bath: num(r.bathAverage),
    breakfast: num(r.breakfastAverage),
    dinner: num(r.dinnerAverage),
    cleanliness: num(r.cleanlinessAverage),
  };
}

/** 施設詳細（responseType=large）のうち、ページに表示する項目と見出し */
const DETAIL_LABELS: [keyof RawHotel, string, string][] = [
  ['hotelDetailInfo', 'checkinTime', 'チェックイン'],
  ['hotelDetailInfo', 'lastCheckinTime', '最終チェックイン'],
  ['hotelDetailInfo', 'checkoutTime', 'チェックアウト'],
  ['hotelFacilitiesInfo', 'hotelRoomNum', '客室数'],
  ['hotelFacilitiesInfo', 'aboutBath', 'お風呂について'],
  ['hotelFacilitiesInfo', 'aboutMealPlace', '食事場所'],
  ['hotelFacilitiesInfo', 'hotelFacilities', '館内設備'],
  ['hotelFacilitiesInfo', 'roomFacilities', '客室設備'],
  ['hotelFacilitiesInfo', 'aboutLeisure', 'レジャー'],
  ['hotelFacilitiesInfo', 'handicappedFacilities', 'バリアフリー'],
  ['hotelBasicInfo', 'parkingInformation', '駐車場'],
];

/** 値が [{ item: 'xx' }, ...] のような配列でも文字列にまとめる */
function flattenValue(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(flattenValue).filter(Boolean).join('、');
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(flattenValue).filter(Boolean).join('、');
  return String(v).trim();
}

function toDetails(raw: RawHotel): DetailItem[] {
  const out: DetailItem[] = [];
  for (const [section, key, label] of DETAIL_LABELS) {
    const value = flattenValue((raw[section] as Record<string, unknown> | undefined)?.[key]);
    if (value) out.push({ label, value: key === 'hotelRoomNum' ? `${value}室` : value });
  }
  return out;
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

  // 1. 空室検索
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
        // 「該当施設なし」は楽天APIではエラー（not_found, HTTP 404）として返るため、失敗と区別する
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
        for (const p of toPlans(raw, q.adults)) {
          if (!existing.plans.some((x) => x.planName === p.planName && x.roomName === p.roomName && x.adults === p.adults)) {
            existing.plans.push(p);
          }
        }
        byNo.set(h.hotelNo, existing);
      }
    }
  }

  if (byNo.size === 0) {
    console.log(`\n施設を1件も取得できませんでした（成功${success}回・失敗${failure}回）。既存データを保持します。`);
    process.exit(failure > 0 ? 1 : 0);
  }

  // 2. 施設詳細（15施設ずつ）
  const numbers = [...byNo.keys()];
  let detailOk = 0;
  for (let i = 0; i < numbers.length; i += DETAIL_BATCH) {
    await sleep(1200);
    const batch = numbers.slice(i, i + DETAIL_BATCH);
    const res = await callApi(ENDPOINTS.simpleHotelSearch, { hotelNo: batch.join(','), responseType: 'large' }, cred);
    if (!res.ok) {
      console.log(`  施設詳細 ${i + 1}〜${i + batch.length}件目: 失敗 HTTP ${res.statusCode} ${res.error}`);
      continue;
    }
    for (const raw of flattenHotels(res.data)) {
      const no = Number(raw.hotelBasicInfo?.hotelNo);
      const h = byNo.get(no);
      if (!h) continue;
      h.ratings = toRatings(raw.hotelRatingInfo);
      h.details = toDetails(raw);
      const b = raw.hotelBasicInfo ?? {};
      h.userReview ||= stripHtml(str(b.userReview));
      h.reviewUrl ||= str(b.reviewUrl);
      h.kana ||= str(b.hotelKanaName);
      detailOk++;
    }
  }
  console.log(`施設詳細: ${detailOk}/${numbers.length}件取得`);

  // 3. キーワード判定・整形
  for (const h of byNo.values()) {
    const text = `${h.special} ${h.access}`;
    for (const c of CONDITIONS) {
      if (c.source === 'text' && c.keywords?.test(text)) addUnique(h.conditions, [c.key]);
    }
    if (h.conditions.includes('kids')) addUnique(h.themes, ['family']);
    if (COUPLE_KEYWORDS.test(h.special)) addUnique(h.themes, ['couple']);
    h.plans = h.plans
      .sort((a, b) => a.adults - b.adults || (a.total ?? Infinity) - (b.total ?? Infinity))
      .slice(0, MAX_PLANS);
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

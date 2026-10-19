import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import HotelCard, { HotelRow } from '../components/HotelCard';
import { Price } from '../components/ui';
import { getAllHotels, getReserveUrl } from '../lib/hotels';

// Missing and malformed API prices must never become a fabricated amount.
for (const value of [null, undefined, 0, -1, NaN, Infinity, '9900']) {
  const html = renderToStaticMarkup(<Price value={value as number | null} />);
  assert.match(html, /料金は楽天トラベルで確認/);
  assert.doesNotMatch(html, /円〜/);
}
const hotels = getAllHotels();
assert.ok(hotels.length > 0);
for (const hotel of hotels) {
  for (const Card of [HotelCard, HotelRow]) {
    const html = renderToStaticMarkup(<Card hotel={hotel} />);
    assert.match(html, /※最新の宿泊料金は楽天トラベルで確認/);
    assert.ok(html.includes(`${hotel.minCharge?.toLocaleString('ja-JP')}円〜`));
    assert.match(html, /1部屋1泊・税／サービス料込み/);
    const href = getReserveUrl(hotel);
    assert.ok(href, `Missing affiliate link: ${hotel.hotelNo}`);
    const target = new URL(new URL(href).searchParams.get('pc')!);
    assert.equal(target.searchParams.get('f_no') ?? target.searchParams.get('f_hotel_no'), String(hotel.hotelNo));
    assert.ok(html.includes(`href="${href.replaceAll('&', '&amp;')}"`));
    assert.match(html, /nofollow sponsored/);
    assert.ok(html.includes(`data-hotel-no="${hotel.hotelNo}" data-placement="card"`));
  }
}
for (const Card of [HotelCard, HotelRow]) {
  const html = renderToStaticMarkup(<Card hotel={{ ...hotels[0], minCharge: null, planListUrl: '', informationUrl: '' }} />);
  assert.match(html, /料金は楽天トラベルで確認/);
  assert.doesNotMatch(html, /円〜/);
  assert.match(html, /宿の詳細を見る/);
  assert.ok(html.includes(`href="/hotel/${hotels[0].hotelNo}"`));
}
console.log(`PASS: missing/invalid price handling, both card variants, ${hotels.length} hotel destinations and affiliate tracking attributes`);

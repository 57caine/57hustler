import { isBlobConfigured, PLACEMENTS, recordClick, type Placement } from '@/lib/click-log';
import { getHotel } from '@/lib/hotels';

/** 送客ボタンのクリックを1件記録する（components/ClickTracker.tsx から sendBeacon で呼ばれる） */
export async function POST(request: Request) {
  let payload: { hotelNo?: unknown; placement?: unknown; page?: unknown };
  try {
    payload = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const hotelNo = Number(payload.hotelNo);
  const placement = String(payload.placement) as Placement | 'healthcheck';
  // 実在する施設番号・想定したボタン位置以外は記録しない（いたずら・誤送信で集計が汚れないように）。
  // healthcheck は公開後の動作確認用で、集計対象外の場所に保存される
  if (!getHotel(hotelNo) || !(placement === 'healthcheck' || PLACEMENTS.includes(placement))) {
    return new Response(null, { status: 400 });
  }
  const page = String(payload.page ?? '').slice(0, 200);

  if (!isBlobConfigured()) {
    console.log(`[click] Blob未接続のため記録をスキップ hotelNo=${hotelNo} placement=${placement} page=${page}`);
    return new Response(null, { status: 204, headers: { 'X-Click-Recorded': '0' } });
  }
  try {
    await recordClick(hotelNo, placement, page);
  } catch (e) {
    console.error('[click] 記録に失敗', e);
    return new Response(null, { status: 500, headers: { 'X-Click-Recorded': '0' } });
  }
  return new Response(null, { status: 204, headers: { 'X-Click-Recorded': '1' } });
}

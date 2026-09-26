import { getCheckinDate, getFetchedAt } from '@/lib/hotels';

/** データの取得日時と、空室検索の対象日を表示する */
export default function DataNotice() {
  const fetchedAt = getFetchedAt();
  const checkin = getCheckinDate();
  if (!fetchedAt) {
    return (
      <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
        宿泊施設データはまだ取得されていません（楽天トラベルAPIからの自動取得を準備中です）。
      </p>
    );
  }
  const at = new Date(fetchedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return (
    <p className="text-xs text-gray-500 mb-6">
      楽天トラベルAPIより {at} 時点で取得{checkin && `（${checkin}チェックイン・1泊で空室検索）`}。
      料金・空室は変動するため、予約先でご確認ください。
    </p>
  );
}

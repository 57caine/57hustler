import { getCheckinDate, getFetchedAt } from '@/lib/hotels';

/** データの取得日時・空室検索の対象日・掲載基準を表示する */
export default function DataNotice({ criteria }: { criteria?: string }) {
  const fetchedAt = getFetchedAt();
  const checkin = getCheckinDate();
  if (!fetchedAt) {
    return (
      <p className="text-sm text-gray-500 bg-white ring-1 ring-black/5 rounded-xl px-4 py-3 mb-6">
        宿泊施設データはまだ取得されていません（楽天トラベルAPIからの自動取得を準備中です）。
      </p>
    );
  }
  const at = new Date(fetchedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return (
    <div className="text-xs text-gray-500 mb-6 space-y-1">
      {criteria && <p>掲載基準：{criteria}</p>}
      <p>
        楽天トラベルAPIより {at} 時点で取得{checkin && `（${checkin}チェックイン・1泊で空室検索）`}。
        料金・空室は変動するため、予約先でご確認ください。
      </p>
    </div>
  );
}

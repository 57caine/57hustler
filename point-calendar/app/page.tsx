import { getSortedCampaignStatuses, formatDateRange, campaignsUpdatedAt } from '@/lib/campaigns';

const TYPE_LABEL: Record<string, string> = {
  marathon: 'お買い物マラソン',
  'super-sale': 'スーパーセール',
  other: 'キャンペーン',
};

export default function HomePage() {
  const statuses = getSortedCampaignStatuses();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-1">開催中・開催予定</h2>
        <p className="text-sm text-gray-500">
          最終更新: {new Date(campaignsUpdatedAt).toLocaleDateString('ja-JP')} ／ 表示は日本時間（JST）
        </p>
      </section>

      {statuses.length === 0 && (
        <p className="text-gray-500 text-sm">現在表示できるキャンペーン情報がありません。</p>
      )}

      <ul className="space-y-4">
        {statuses.map(({ campaign, phase, daysUntilStart, daysUntilEnd }) => {
          const now = new Date();
          const entryOpen = campaign.entryStartAt ? now >= new Date(campaign.entryStartAt) : false;
          const isEntryPeriod = entryOpen && phase === 'upcoming';

          return (
            <li
              key={campaign.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-2 py-0.5 rounded">
                  {TYPE_LABEL[campaign.type] ?? campaign.type}
                </span>
                {phase === 'ongoing' && (
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                    開催中・残り{daysUntilEnd}日
                  </span>
                )}
                {phase === 'upcoming' && (
                  <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded">
                    あと{daysUntilStart}日で開始
                  </span>
                )}
                {isEntryPeriod && (
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">
                    エントリー受付中
                  </span>
                )}
                {campaign.confidence === 'predicted' && (
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
                    日程は予想（未確定）
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold mb-1">{campaign.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                ポイントアップ期間: {formatDateRange(campaign.startAt, campaign.endAt)}
              </p>
              {campaign.entryStartAt && (
                <p className="text-sm text-gray-500 mb-2">
                  エントリー開始: {formatDateRange(campaign.entryStartAt, campaign.entryStartAt).split(' 〜')[0]}〜
                </p>
              )}
              <p className="text-sm text-gray-500 mb-3">{campaign.note}</p>

              <a
                href={campaign.entryUrl ?? campaign.officialUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
              >
                楽天市場でエントリーする（※現在は非アフィリエイトのURL・要差し替え）
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

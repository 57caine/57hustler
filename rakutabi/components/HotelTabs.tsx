'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import type { DetailItem, Plan, Ratings } from '@/lib/hotels';

type TabKey = 'features' | 'plans' | 'photos' | 'reviews';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'features', label: '施設の特徴' },
  { key: 'plans', label: 'プラン・料金' },
  { key: 'photos', label: '写真' },
  { key: 'reviews', label: 'クチコミ' },
];

const RATING_LABELS: [keyof Ratings, string][] = [
  ['service', 'サービス'],
  ['location', '立地'],
  ['room', '部屋'],
  ['equipment', '設備・アメニティ'],
  ['bath', '風呂'],
  ['breakfast', '朝食'],
  ['dinner', '夕食'],
  ['cleanliness', '清潔感'],
];

/** 個別宿泊施設ページのタブ（施設の特徴／プラン料金／写真／口コミ） */
export default function HotelTabs({
  highlights,
  hotelNo,
  hotelName,
  special,
  access,
  details,
  plans,
  planUrls,
  checkinDate,
  photos,
  ratings,
  reviewAverage,
  reviewCount,
  userReview,
  reviewUrl,
}: {
  /** この宿のおすすめポイント（lib/hotels.ts の getHighlights、取得データから言える事実のみ） */
  highlights: string[];
  hotelNo: number;
  hotelName: string;
  special: string;
  access: string;
  details: DetailItem[];
  plans: Plan[];
  /** プランごとの予約URL（アフィリエイトURLのときのみ。そうでなければnull） */
  planUrls: (string | null)[];
  checkinDate: string | null;
  photos: { src: string; alt: string }[];
  ratings: Ratings | null;
  reviewAverage: number | null;
  reviewCount: number | null;
  userReview: string;
  /** 口コミページURL（アフィリエイトURLのときのみ） */
  reviewUrl: string | null;
}) {
  const [tab, setTab] = useState<TabKey>('features');

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5">
      <div role="tablist" className="flex border-b border-black/5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 min-w-24 px-4 py-3 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-ink text-ink font-bold' : 'border-transparent text-gray-500 hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6 text-sm leading-relaxed" role="tabpanel">
        {tab === 'features' && (
          <div className="space-y-5">
            {highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-ink mb-3">この宿のおすすめポイント</h3>
                <ul className="space-y-2">
                  {highlights.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Icon name="check" className="w-5 h-5 shrink-0 text-season" strokeWidth={2.4} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-2">※楽天トラベルAPIから取得した情報をもとに記載しています。</p>
              </div>
            )}
            {special && (
              <div>
                <p className="whitespace-pre-line">{special}</p>
                <p className="text-xs text-gray-400 mt-1">※楽天トラベルに掲載されている施設の紹介文です。</p>
              </div>
            )}
            <dl className="grid grid-cols-[7.5rem_1fr] gap-y-2 gap-x-3">
              {access && (
                <>
                  <dt className="text-gray-500">アクセス</dt>
                  <dd>{access}</dd>
                </>
              )}
              {details.map((d) => (
                <div key={d.label} className="contents">
                  <dt className="text-gray-500">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {tab === 'plans' && (
          <div>
            {plans.length === 0 ? (
              <p className="text-gray-500">空室のあるプラン情報は取得できていません。</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  {checkinDate}チェックイン・1泊の空室検索で見つかったプランです（料金は表示人数での1泊合計・税込）。
                </p>
                <ul className="divide-y divide-black/5">
                  {plans.map((p, i) => (
                    <li key={`${p.planName}-${p.roomName}-${p.adults}`} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{p.planName}</p>
                        <p className="text-xs text-gray-500">
                          {p.roomName}・大人{p.adults}名
                          {p.withDinner && '・夕食付き'}
                          {p.withBreakfast && '・朝食付き'}
                        </p>
                      </div>
                      <p className="font-bold text-base whitespace-nowrap">{p.total != null ? `¥${p.total.toLocaleString('ja-JP')}` : '—'}</p>
                      {planUrls[i] && (
                        <a href={planUrls[i]!} target="_blank" rel="noopener noreferrer nofollow sponsored" data-hotel-no={hotelNo} data-placement="plan" className="bg-cta hover:bg-cta-hover text-white font-bold rounded-lg px-4 py-2 text-center whitespace-nowrap">
                          このプランを予約
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {tab === 'photos' && (
          photos.length === 0 ? (
            <p className="text-gray-500">写真は取得できていません。</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.src} src={p.src} alt={p.alt} className="w-full aspect-[4/3] object-cover rounded-xl bg-season-soft" loading="lazy" />
              ))}
            </div>
          )
        )}

        {tab === 'reviews' && (
          <div className="space-y-5">
            <p>
              楽天トラベルの口コミ評価：
              <span className="font-bold text-lg">{reviewAverage != null ? reviewAverage.toFixed(2) : '—'}</span>
              <span className="text-gray-500">（{(reviewCount ?? 0).toLocaleString('ja-JP')}件）</span>
            </p>
            {ratings && (
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {RATING_LABELS.map(([k, label]) => {
                  const v = ratings[k];
                  return (
                    <li key={k} className="flex items-center gap-3">
                      <span className="w-28 text-gray-600">{label}</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <span className="block h-full bg-season" style={{ width: `${((v ?? 0) / 5) * 100}%` }} />
                      </span>
                      <span className="w-10 text-right font-medium">{v != null ? v.toFixed(2) : '—'}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            {userReview && (
              <blockquote className="bg-season-soft/60 rounded-xl p-4">
                <p className="whitespace-pre-line">{userReview}</p>
                <p className="text-xs text-gray-500 mt-2">※楽天トラベルに投稿された{hotelName}の口コミの一部です。</p>
              </blockquote>
            )}
            {reviewUrl && (
              <a href={reviewUrl} target="_blank" rel="noopener noreferrer nofollow sponsored" data-hotel-no={hotelNo} data-placement="review" className="inline-block text-season underline">
                {hotelName}の口コミをすべて見る（楽天トラベル）
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

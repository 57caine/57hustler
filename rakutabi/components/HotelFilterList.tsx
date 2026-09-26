'use client';

import { useState } from 'react';
import HotelCard from '@/components/HotelCard';
import { AREAS, CONDITIONS, type ConditionKey } from '@/lib/site-config';
import type { Hotel } from '@/lib/hotels';

type SortKey = 'review' | 'priceAsc' | 'reviewCount';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'review', label: '評価が高い順' },
  { key: 'priceAsc', label: '最低料金が安い順' },
  { key: 'reviewCount', label: '口コミ件数が多い順' },
];

export default function HotelFilterList({ hotels }: { hotels: Hotel[] }) {
  const [selected, setSelected] = useState<ConditionKey[]>([]);
  const [areaKey, setAreaKey] = useState('');
  const [sort, setSort] = useState<SortKey>('review');

  const areaOptions = AREAS.filter((a) => hotels.some((h) => h.areaKey === a.key));

  const visible = hotels
    .filter((h) => selected.every((c) => h.conditions.includes(c)))
    .filter((h) => !areaKey || h.areaKey === areaKey)
    .sort((a, b) => {
      if (sort === 'priceAsc') return (a.minCharge ?? Infinity) - (b.minCharge ?? Infinity);
      if (sort === 'reviewCount') return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      return (b.reviewAverage ?? 0) - (a.reviewAverage ?? 0);
    });

  const toggle = (key: ConditionKey) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">条件で絞り込む</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => {
              const on = selected.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggle(c.key)}
                  aria-pressed={on}
                  className={`text-sm rounded-full border px-3 py-1 ${on ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            「温泉あり」「2食付きプランあり」は楽天トラベルの検索条件による判定、それ以外は施設紹介文のキーワードによる目安です。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {areaOptions.length > 1 && (
            <label className="flex items-center gap-2">
              エリア
              <select value={areaKey} onChange={(e) => setAreaKey(e.target.value)} className="border border-gray-300 rounded px-2 py-1 bg-white">
                <option value="">すべて</option>
                {areaOptions.map((a) => (
                  <option key={a.key} value={a.key}>{a.name}</option>
                ))}
              </select>
            </label>
          )}
          <label className="flex items-center gap-2">
            並び順
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="border border-gray-300 rounded px-2 py-1 bg-white">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{visible.length}件</p>
      {visible.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">条件に合う宿が見つかりませんでした。</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((h) => (
            <HotelCard key={h.hotelNo} hotel={h} />
          ))}
        </div>
      )}
    </div>
  );
}

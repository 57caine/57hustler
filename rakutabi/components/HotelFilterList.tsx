'use client';

import { useState } from 'react';
import HotelCard from '@/components/HotelCard';
import { AREAS, CONDITIONS, PRICE_BANDS, type ConditionGroup, type ConditionKey } from '@/lib/site-config';
import type { Hotel } from '@/lib/hotels';

type SortKey = 'review' | 'reviewCount' | 'priceAsc' | 'priceDesc';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'review', label: '評価が高い順' },
  { key: 'reviewCount', label: '口コミ件数が多い順' },
  { key: 'priceAsc', label: '料金が安い順' },
  { key: 'priceDesc', label: '料金が高い順' },
];

const GROUPS: ConditionGroup[] = ['食事', '温泉', '客室', '親子', '立地・景色'];

/**
 * 宿泊施設の一覧（絞り込み・並び替え付き）。
 * 絞り込み：エリア・価格帯・食事・温泉・客室・親子・立地・景色
 */
export default function HotelFilterList({ hotels, showArea = true }: { hotels: Hotel[]; showArea?: boolean }) {
  const [selected, setSelected] = useState<ConditionKey[]>([]);
  const [areaKey, setAreaKey] = useState('');
  const [band, setBand] = useState('');
  const [sort, setSort] = useState<SortKey>('review');

  const areaOptions = AREAS.filter((a) => hotels.some((h) => h.areaKey === a.key));
  const priceBand = PRICE_BANDS.find((b) => b.key === band);

  const visible = hotels
    .filter((h) => selected.every((c) => h.conditions.includes(c)))
    .filter((h) => !areaKey || h.areaKey === areaKey)
    .filter((h) => !priceBand || (h.minCharge != null && h.minCharge >= priceBand.min && h.minCharge < priceBand.max))
    .sort((a, b) => {
      if (sort === 'priceAsc') return (a.minCharge ?? Infinity) - (b.minCharge ?? Infinity);
      if (sort === 'priceDesc') return (b.minCharge ?? -Infinity) - (a.minCharge ?? -Infinity);
      if (sort === 'reviewCount') return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      return (b.reviewAverage ?? 0) - (a.reviewAverage ?? 0);
    });

  const toggle = (key: ConditionKey) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const reset = () => { setSelected([]); setAreaKey(''); setBand(''); };

  const chip = (on: boolean) =>
    `text-sm rounded-full border px-3 py-1 transition-colors ${on ? 'bg-season border-season text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-season'}`;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="bg-white rounded-2xl ring-1 ring-black/5 p-5 space-y-5 h-fit lg:sticky lg:top-20">
        <div className="flex items-center justify-between">
          <p className="font-serif font-bold">条件で絞り込む</p>
          <button type="button" onClick={reset} className="text-xs text-gray-500 underline">クリア</button>
        </div>

        {showArea && areaOptions.length > 1 && (
          <FilterBlock title="エリア">
            <select value={areaKey} onChange={(e) => setAreaKey(e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm">
              <option value="">すべて</option>
              {areaOptions.map((a) => (
                <option key={a.key} value={a.key}>{a.prefecture}・{a.name}</option>
              ))}
            </select>
          </FilterBlock>
        )}

        <FilterBlock title="価格帯（1名あたり最低料金）">
          <div className="flex flex-wrap gap-2">
            {PRICE_BANDS.map((b) => (
              <button key={b.key} type="button" aria-pressed={band === b.key} onClick={() => setBand(band === b.key ? '' : b.key)} className={chip(band === b.key)}>
                {b.label}
              </button>
            ))}
          </div>
        </FilterBlock>

        {GROUPS.map((g) => (
          <FilterBlock key={g} title={g}>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.filter((c) => c.group === g).map((c) => (
                <button key={c.key} type="button" aria-pressed={selected.includes(c.key)} onClick={() => toggle(c.key)} className={chip(selected.includes(c.key))}>
                  {c.label}
                </button>
              ))}
            </div>
          </FilterBlock>
        ))}

        <p className="text-xs text-gray-500 leading-relaxed">
          「温泉あり」「食事」は楽天トラベルの検索条件による判定、「客室」「親子」「立地・景色」は施設紹介文のキーワードによる目安です。
        </p>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600"><span className="font-bold text-ink text-lg">{visible.length}</span> 件</p>
          <label className="text-sm flex items-center gap-2">
            並び順
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
        {visible.length === 0 ? (
          <p className="text-gray-500 py-16 text-center bg-white rounded-2xl">条件に合う宿が見つかりませんでした。条件を減らしてお試しください。</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((h) => <HotelCard key={h.hotelNo} hotel={h} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">{title}</p>
      {children}
    </div>
  );
}

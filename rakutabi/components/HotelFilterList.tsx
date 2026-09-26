'use client';

import { useState } from 'react';
import Icon, { type IconKey } from '@/components/Icon';
import { HotelRow } from '@/components/HotelCard';
import { AREAS, CONDITIONS, PRICE_BANDS, type ConditionGroup, type ConditionKey } from '@/lib/site-config';
import type { Hotel } from '@/lib/hotels';

type SortKey = 'recommend' | 'reviewCount' | 'priceAsc' | 'priceDesc';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recommend', label: 'おすすめ順（評価が高い順）' },
  { key: 'reviewCount', label: 'クチコミ件数が多い順' },
  { key: 'priceAsc', label: '料金が安い順' },
  { key: 'priceDesc', label: '料金が高い順' },
];

type PanelKey = 'area' | 'price' | ConditionGroup;

/** デザイン案の絞り込みボタン列（エリア・価格帯・食事・温泉・客室・景色・子連れ向け） */
const PANELS: { key: PanelKey; label: string; icon: IconKey }[] = [
  { key: 'area', label: 'エリア', icon: 'pin' },
  { key: 'price', label: '価格帯', icon: 'yen' },
  { key: '食事', label: '食事', icon: 'meal' },
  { key: '温泉', label: '温泉', icon: 'onsen' },
  { key: '客室', label: '客室', icon: 'bed' },
  { key: '立地・景色', label: '立地・景色', icon: 'mountain' },
  { key: '親子', label: '子連れ向け', icon: 'family' },
];

/**
 * 宿泊施設の一覧（絞り込み・並び替え付き）
 * showArea=false のページ（エリア別など）ではエリアの絞り込みを出さない
 */
export default function HotelFilterList({ hotels, showArea = true }: { hotels: Hotel[]; showArea?: boolean }) {
  const [selected, setSelected] = useState<ConditionKey[]>([]);
  const [areaKey, setAreaKey] = useState('');
  const [band, setBand] = useState('');
  const [sort, setSort] = useState<SortKey>('recommend');
  const [open, setOpen] = useState<PanelKey | null>(null);

  const areaOptions = AREAS.filter((a) => hotels.some((h) => h.areaKey === a.key));
  const priceBand = PRICE_BANDS.find((b) => b.key === band);
  const panels = PANELS.filter((p) => p.key !== 'area' || (showArea && areaOptions.length > 1));

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

  const chips: { label: string; remove: () => void }[] = [
    ...(areaKey ? [{ label: AREAS.find((a) => a.key === areaKey)?.name ?? areaKey, remove: () => setAreaKey('') }] : []),
    ...(priceBand ? [{ label: priceBand.label, remove: () => setBand('') }] : []),
    ...CONDITIONS.filter((c) => selected.includes(c.key)).map((c) => ({ label: c.short ?? c.label, remove: () => toggle(c.key) })),
  ];

  const option = (on: boolean) =>
    `text-sm rounded-full border px-3 py-1.5 transition-colors ${on ? 'bg-ink border-ink text-white' : 'bg-white border-gray-300 text-ink hover:border-ink'}`;

  const isActive = (p: PanelKey) =>
    p === 'area' ? Boolean(areaKey) : p === 'price' ? Boolean(band) : CONDITIONS.some((c) => c.group === p && selected.includes(c.key));

  return (
    <div>
      {/* 絞り込みボタン列 */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {panels.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-expanded={open === p.key}
            onClick={() => setOpen(open === p.key ? null : p.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
              open === p.key || isActive(p.key) ? 'border-ink bg-ink text-white' : 'border-gray-200 bg-white text-ink hover:border-ink'
            }`}
          >
            <Icon name={p.icon} className="w-4 h-4" />
            {p.label}
            <Icon name="chevron" className={`w-3.5 h-3.5 transition-transform ${open === p.key ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>

      {open && (
        <div className="mt-2 bg-white rounded-2xl ring-1 ring-black/10 shadow-sm p-4 flex flex-wrap gap-2">
          {open === 'area' &&
            areaOptions.map((a) => (
              <button key={a.key} type="button" aria-pressed={areaKey === a.key} onClick={() => setAreaKey(areaKey === a.key ? '' : a.key)} className={option(areaKey === a.key)}>
                {a.prefecture}・{a.name}
              </button>
            ))}
          {open === 'price' &&
            PRICE_BANDS.map((b) => (
              <button key={b.key} type="button" aria-pressed={band === b.key} onClick={() => setBand(band === b.key ? '' : b.key)} className={option(band === b.key)}>
                {b.label}
              </button>
            ))}
          {open !== 'area' && open !== 'price' &&
            CONDITIONS.filter((c) => c.group === open).map((c) => (
              <button key={c.key} type="button" aria-pressed={selected.includes(c.key)} onClick={() => toggle(c.key)} className={option(selected.includes(c.key))}>
                {c.label}
              </button>
            ))}
          {open !== 'area' && open !== 'price' && CONDITIONS.find((c) => c.group === open)?.source === 'text' && (
            <p className="w-full text-xs text-gray-500">※施設紹介文のキーワードから判定した目安です。</p>
          )}
        </div>
      )}

      {/* 選択中の条件 */}
      <div className="mt-4 bg-season-surface rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-ink">絞り込み条件</p>
          {chips.length > 0 && (
            <button type="button" onClick={reset} className="text-xs text-gray-500 underline">条件をクリア</button>
          )}
        </div>
        {chips.length === 0 ? (
          <p className="text-xs text-gray-500">上のボタンから条件を追加できます。</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={c.remove} className="inline-flex items-center gap-1 text-xs bg-white rounded-full pl-3 pr-2 py-1 ring-1 ring-black/10">
                {c.label}
                <Icon name="close" className="w-3.5 h-3.5 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 my-5">
        <p className="text-sm text-ink">該当施設 <span className="font-bold text-lg">{visible.length.toLocaleString('ja-JP')}</span> 件</p>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="並び順" className="border border-gray-200 rounded-full px-3 py-1.5 bg-white text-sm">
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="text-gray-500 py-16 text-center bg-white rounded-2xl ring-1 ring-black/5">条件に合う宿が見つかりませんでした。条件を減らしてお試しください。</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((h) => <HotelRow key={h.hotelNo} hotel={h} />)}
        </div>
      )}
    </div>
  );
}

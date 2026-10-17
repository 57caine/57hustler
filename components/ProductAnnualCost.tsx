'use client';

import { useState } from 'react';
import type { Price, Store } from '@/lib/products';
import annualBundleMap from '@/data/annual-bundle-url-map.json';

type Offer = Price & { store: Store };
type BundleTarget = { url: string; label: string };
type PeriodMonths = 3 | 6 | 12;

const periodDays: Record<PeriodMonths, number> = { 3: 91, 6: 183, 12: 365 };

export default function ProductAnnualCost({ prices, category, productName }: { prices: Offer[]; category: string; productName: string }) {
  const eligible = prices.filter(p => p.inStock && p.price > 0 && p.lensCount > 0 && p.boxes > 0 && p.url && !p.url.startsWith('#'));
  const [storeId, setStoreId] = useState(eligible[0]?.storeId ?? '');
  const [period, setPeriod] = useState<PeriodMonths>(12);
  const [days, setDays] = useState(365);
  const [care, setCare] = useState(0);
  const selected = eligible.find(p => p.storeId === storeId) ?? eligible[0];
  if (!selected || !['1day', '2week'].includes(category)) return null;

  const effectiveDays = category === '1day' ? days : periodDays[period];
  const lenses = category === '1day'
    ? effectiveDays * 2
    : Math.ceil(effectiveDays / 14) * 2;

  const estimateFor = (item: Offer) => {
    const lensesPerListedSet = item.lensCount * item.boxes;
    if (lensesPerListedSet <= 0) return null;
    const listedSetsNeeded = Math.ceil(lenses / lensesPerListedSet);
    const productCost = listedSetsNeeded * item.price;
    const careCost = category === '2week' ? care * period : 0;
    return { listedSetsNeeded, total: productCost + careCost, productCost, careCost };
  };

  const selectedEstimate = estimateFor(selected)!;
  const ranked = eligible
    .map(item => ({ item, estimate: estimateFor(item) }))
    .filter((x): x is { item: Offer; estimate: NonNullable<ReturnType<typeof estimateFor>> } => x.estimate != null)
    .sort((a, b) => a.estimate.total - b.estimate.total);
  const cheapest = ranked[0];
  const savingsVsCheapest = cheapest ? selectedEstimate.total - cheapest.estimate.total : 0;
  const monthly = Math.round(selectedEstimate.total / period);

  const productBundles = (annualBundleMap as Record<string, Record<string, BundleTarget>>)[selected.productId];
  const annualTarget = period === 12 ? productBundles?.[selected.storeId] : undefined;
  const fallbackLink = selected.url + selected.store.affiliateParam;
  // Direct bundles are shown only when they can retain the A8 tracking hop.
  const trackedBundle = annualTarget && selected.store.url.includes('px.a8.net') ? annualTarget : undefined;
  const destinationLink = trackedBundle
    ? `${selected.store.url}&a8ejpredirect=${encodeURIComponent(trackedBundle.url)}${selected.store.affiliateParam}`
    : fallbackLink;

  const selectPeriod = (months: PeriodMonths) => {
    setPeriod(months);
    if (category === '1day') setDays(periodDays[months]);
  };

  return <section id="annual-cost" className="scroll-mt-6 bg-sky-50 rounded-xl border border-sky-200 p-5 sm:p-6 mb-8">
    <h2 className="text-xl font-bold text-slate-900 mb-2">{productName}、まとめ買いならいくら？</h2>
    <p className="text-sm text-slate-600 mb-4">3・6・12か月で必要量と総額を比較。ショップを変えると差額もすぐ分かります。</p>

    <div className="mb-5">
      <p className="text-sm font-medium mb-2">購入期間</p>
      <div className="grid grid-cols-3 gap-2">
        {([3, 6, 12] as PeriodMonths[]).map(months => (
          <button key={months} type="button" onClick={() => selectPeriod(months)} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${period === months ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            {months}か月分
          </button>
        ))}
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <label className="text-sm font-medium">購入するショップ
        <select className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" value={storeId} onChange={e => setStoreId(e.target.value)}>
          {eligible.map(p => <option key={p.storeId} value={p.storeId}>{p.store.name}（{p.price.toLocaleString('ja-JP')}円／掲載セット）</option>)}
        </select>
      </label>

      {category === '1day' ? <label className="text-sm font-medium">実際に使う日数
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" inputMode="numeric" min="1" max={periodDays[period]} value={days} onChange={e => setDays(Math.max(1, Math.min(periodDays[period], Number(e.target.value) || 1)))} />
        <span className="block text-xs font-normal text-slate-500 mt-1">毎日使わない人はここだけ調整できます。</span>
      </label> : <label className="text-sm font-medium">ケア用品代（月額・円）
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" inputMode="numeric" min="0" max="100000" value={care} onChange={e => setCare(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} />
      </label>}
    </div>

    <div className="bg-white rounded-xl p-5 border border-sky-100">
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div><p className="text-xs text-slate-500">必要量</p><p className="text-xl font-bold">約{selectedEstimate.listedSetsNeeded}掲載セット</p></div>
        <div><p className="text-xs text-slate-500">{period}か月総額目安</p><p className="text-2xl font-bold text-slate-900">{selectedEstimate.total.toLocaleString('ja-JP')}円</p></div>
        <div><p className="text-xs text-slate-500">月あたり換算</p><p className="text-xl font-bold">約{monthly.toLocaleString('ja-JP')}円</p></div>
      </div>

      {cheapest && selected.storeId === cheapest.item.storeId ? (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-semibold">この条件では掲載ショップ内の最安目安です。</div>
      ) : savingsVsCheapest > 0 && cheapest ? (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          掲載最安目安は <strong>{cheapest.item.store.name}</strong>。このショップとの差は約<strong>{savingsVsCheapest.toLocaleString('ja-JP')}円</strong>です。
        </div>
      ) : null}

      <p className="text-sm text-slate-600 mb-4">計算：{selected.price.toLocaleString('ja-JP')}円 × 約{selectedEstimate.listedSetsNeeded}掲載セット{category === '2week' && care > 0 ? ` ＋ ケア用品 ${selectedEstimate.careCost.toLocaleString('ja-JP')}円` : ''}</p>
      {trackedBundle && <p className="text-sm font-medium text-sky-800 mb-3">このショップは {trackedBundle.label} に直接移動できます。</p>}
      <a onClick={() => { if (typeof window !== 'undefined' && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === 'function') (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'annual_bundle_click', { product_id: selected.productId, store_id: selected.storeId, period_months: period, is_bundle_link: Boolean(trackedBundle) }); }} href={destinationLink} target="_blank" rel="noopener noreferrer sponsored nofollow" className="block text-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3">
        {trackedBundle ? `${selected.store.name}の約1年分セットを見る →` : `${selected.store.name}で${period}か月分の購入条件を確認する →`}
      </a>
      <p className="text-xs text-slate-500 mt-2">※ 総額はレンズナビ掲載価格からの目安です。まとめ買い価格・送料・クーポン等はリンク先の最新表示を優先してください。</p>
    </div>

    <p className="text-xs text-slate-600 mt-4">※ 掲載価格の更新日：{selected.lastUpdated?.slice(0, 10) ?? '不明'}。2weekは装用しない日も含めて原則14日ごとに交換。実際のレンズ選択は眼科でご相談ください。</p>
  </section>;
}

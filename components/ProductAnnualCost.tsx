'use client';

import { useState } from 'react';
import type { Price, Store } from '@/lib/products';
import annualBundleMap from '@/data/annual-bundle-url-map.json';

type Offer = Price & { store: Store };
type BundleTarget = { url: string; label: string };

export default function ProductAnnualCost({ prices, category, productName }: { prices: Offer[]; category: string; productName: string }) {
  const eligible = prices.filter(p => p.inStock && p.price > 0 && p.lensCount > 0 && p.boxes > 0 && p.url && !p.url.startsWith('#'));
  const [storeId, setStoreId] = useState(eligible[0]?.storeId ?? '');
  const [days, setDays] = useState(365);
  const [care, setCare] = useState(0);
  const selected = eligible.find(p => p.storeId === storeId) ?? eligible[0];
  if (!selected || !['1day', '2week'].includes(category)) return null;

  const lenses = category === '1day' ? days * 2 : 52;
  const lensesPerListedSet = selected.lensCount * selected.boxes;
  const listedSetsNeeded = Math.ceil(lenses / lensesPerListedSet);
  const yearlyProductCost = listedSetsNeeded * selected.price;
  const yearlyCareCost = category === '2week' ? care * 12 : 0;
  const yearly = yearlyProductCost + yearlyCareCost;
  const monthly = Math.round(yearly / 12);

  const productBundles = (annualBundleMap as Record<string, Record<string, BundleTarget>>)[selected.productId];
  const annualTarget = productBundles?.[selected.storeId];
  const fallbackLink = selected.url + selected.store.affiliateParam;
  const annualLink = annualTarget
    ? (selected.store.url.includes('px.a8.net')
        ? `${selected.store.url}&a8ejpredirect=${encodeURIComponent(annualTarget.url)}${selected.store.affiliateParam}`
        : annualTarget.url)
    : fallbackLink;

  return <section id="annual-cost" className="scroll-mt-6 bg-sky-50 rounded-xl border border-sky-200 p-5 sm:p-6 mb-8">
    <h2 className="text-xl font-bold text-slate-900 mb-2">{productName}を1年使うといくら？</h2>
    <p className="text-sm text-slate-600 mb-4">ショップを選ぶだけで、現在掲載している価格から年間コストと必要量を自動計算します。</p>

    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <label className="text-sm font-medium">購入するショップ
        <select className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" value={storeId} onChange={e => setStoreId(e.target.value)}>
          {eligible.map(p => <option key={p.storeId} value={p.storeId}>{p.store.name}（{p.price.toLocaleString('ja-JP')}円／掲載セット）</option>)}
        </select>
      </label>

      {category === '1day' ? <label className="text-sm font-medium">年間で使う日数
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" inputMode="numeric" min="1" max="365" value={days} onChange={e => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} />
      </label> : <label className="text-sm font-medium">ケア用品代（月額・円）
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" inputMode="numeric" min="0" max="100000" value={care} onChange={e => setCare(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} />
      </label>}
    </div>

    <div className="bg-white rounded-xl p-5 border border-sky-100">
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div><p className="text-xs text-slate-500">1年に必要</p><p className="text-xl font-bold">約{listedSetsNeeded}掲載セット</p></div>
        <div><p className="text-xs text-slate-500">年間コスト目安</p><p className="text-2xl font-bold text-slate-900">{yearly.toLocaleString('ja-JP')}円</p></div>
        <div><p className="text-xs text-slate-500">月あたり換算</p><p className="text-xl font-bold">約{monthly.toLocaleString('ja-JP')}円</p></div>
      </div>
      <p className="text-sm text-slate-600 mb-4">計算：{selected.price.toLocaleString('ja-JP')}円 × 約{listedSetsNeeded}掲載セット{category === '2week' && care > 0 ? ` ＋ ケア用品 ${yearlyCareCost.toLocaleString('ja-JP')}円/年` : ''}</p>
      {annualTarget && <p className="text-sm font-medium text-sky-800 mb-3">このショップは {annualTarget.label} に直接移動できます。</p>}
      <a href={annualLink} target="_blank" rel="noopener noreferrer sponsored nofollow" className="block text-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3">
        {annualTarget ? `${selected.store.name}の約1年分セットを見る →` : `${selected.store.name}でまとめ買い条件を確認する →`}
      </a>
      <p className="text-xs text-slate-500 mt-2">※ 年間コストはレンズナビ掲載価格からの目安です。まとめ買い価格・送料・クーポン等はリンク先の最新表示を優先してください。</p>
    </div>

    <p className="text-xs text-slate-600 mt-4">※ 掲載価格の更新日：{selected.lastUpdated?.slice(0, 10) ?? '不明'}。2weekは装用しない日も含めて原則14日ごとに交換。実際のレンズ選択は眼科でご相談ください。</p>
  </section>;
}

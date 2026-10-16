'use client';

import { useState } from 'react';
import type { Price, Store } from '@/lib/products';

type Offer = Price & { store: Store };

export default function ProductAnnualCost({ prices, category, productName }: { prices: Offer[]; category: string; productName: string }) {
  const eligible = prices.filter(p => p.inStock && p.price > 0 && p.lensCount > 0 && p.boxes > 0 && p.url && !p.url.startsWith('#'));
  const [storeId, setStoreId] = useState(eligible[0]?.storeId ?? '');
  const [days, setDays] = useState(365);
  const [care, setCare] = useState(0);
  const [shipping, setShipping] = useState(0);
  const selected = eligible.find(p => p.storeId === storeId) ?? eligible[0];
  if (!selected || !['1day', '2week'].includes(category)) return null;
  // Prices can be multi-box bundles: use the full bundle's lensCount, not an assumed 30/6 lenses.
  // 2week lenses expire on a 14-day cycle even when not worn.
  const lenses = category === '1day' ? days * 2 : 52;
  const bundles = Math.ceil(lenses / selected.lensCount);
  const yearly = bundles * selected.price + bundles * shipping + (category === '2week' ? care * 12 : 0);
  const link = selected.url + selected.store.affiliateParam;
  return <section id="annual-cost" className="scroll-mt-6 bg-sky-50 rounded-xl border border-sky-200 p-5 sm:p-6 mb-8">
    <h2 className="text-xl font-bold text-slate-900 mb-2">この商品の年間コストを見てみる</h2>
    <p className="text-sm text-slate-600 mb-4">ショップを選ぶと、掲載価格から両眼分の1年間の費用を概算します。</p>
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <label className="text-sm font-medium">ショップ
        <select className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" value={storeId} onChange={e => setStoreId(e.target.value)}>
          {eligible.map(p => <option key={p.storeId} value={p.storeId}>{p.store.name}（{p.price.toLocaleString('ja-JP')}円／掲載セット）</option>)}
        </select>
      </label>
      {category === '1day' ? <label className="text-sm font-medium">年間の使用日数
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" min="0" max="365" value={days} onChange={e => setDays(Math.max(0, Math.min(365, Number(e.target.value) || 0)))} />
      </label> : <label className="text-sm font-medium">ケア用品代（月額・円）
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" min="0" max="100000" value={care} onChange={e => setCare(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} />
      </label>}
      <label className="text-sm font-medium">送料（1回の注文あたり・円）
        <input className="block w-full border border-slate-300 rounded-lg p-3 bg-white mt-1" type="number" min="0" max="100000" value={shipping} onChange={e => setShipping(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} />
      </label>
    </div>
    <div className="bg-white rounded-xl p-4 border border-sky-100">
      <p className="text-sm text-slate-600">必要量：両眼{lenses}枚／掲載セット{selected.lensCount}枚・約{bundles}セット</p>
      <p className="text-3xl font-bold text-slate-900 my-2">{yearly.toLocaleString('ja-JP')}円 <span className="text-sm font-normal">／年（概算）</span></p>
      <p className="text-xs text-slate-500 mb-4">購入時は度数・BC・左右の箱数・在庫・送料・セット条件を確認してください。まとめ買い割引や同梱送料は計算に反映していません。</p>
      <a href={link} target="_blank" rel="noopener noreferrer sponsored nofollow" className="block text-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3">{selected.store.name}で必要数の購入条件を確認する →</a>
      <p className="text-xs text-slate-500 mt-2">※ カートへの自動追加は行いません。数量を確認してから購入してください。</p>
    </div>
    <p className="text-xs text-slate-600 mt-4">※ 掲載価格の更新日：{selected.lastUpdated?.slice(0, 10) ?? '不明'}。2weekは装用しない日も含めて原則14日ごとに交換。実際のレンズ選択は眼科でご相談ください。</p>
    <p className="text-xs mt-3"><a href="/annual-cost" className="text-sky-700 underline">ワンデーと2weekを横断比較する →</a></p>
  </section>;
}

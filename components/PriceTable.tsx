'use client';

import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Price, Store, hasProductDetailDestination } from '@/lib/products';
import productsData from '@/data/products.json';

type SortKey = 'store' | 'prescription' | 'annual' | 'box';
type SortDir = 'asc' | 'desc';

type PriceTableProps = {
  prices: (Price & { store: Store })[];
  productName: string;
};

export default function PriceTable({ prices, productName }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('annual');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  if (prices.length === 0) {
    return <p className="text-gray-500 text-sm p-4">価格情報がありません</p>;
  }

  const product = productsData.products.find(p => p.id === prices[0]?.productId);
  const annualLensNeed = product?.category === '1day' ? 730 : product?.category === '2week' ? 52 : null;
  const annualEstimate = (item: Price & { store: Store }) => {
    if (!annualLensNeed || item.lensCount <= 0 || item.boxes <= 0 || item.price <= 0 || !item.inStock) return null;
    const lensesPerListedSet = item.lensCount * item.boxes;
    return Math.ceil(annualLensNeed / lensesPerListedSet) * item.price;
  };

  const boxPrice = (item: Price & { store: Store }) => item.price > 0 && item.boxes > 0 && item.inStock ? item.price / item.boxes : null;
  const boxValues = prices.map(boxPrice).filter((v): v is number => v != null);
  const cheapestBox = boxValues.length ? Math.min(...boxValues) : null;

  const annualValues = prices.map(annualEstimate).filter((v): v is number => v != null);
  const cheapestAnnual = annualValues.length > 0 ? Math.min(...annualValues) : null;

  const sorted = [...prices].sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    let diff = 0;
    if (sortKey === 'store') diff = a.store.name.localeCompare(b.store.name, 'ja');
    else if (sortKey === 'prescription') diff = (a.store.prescriptionFree ? 0 : 1) - (b.store.prescriptionFree ? 0 : 1);
    else if (sortKey === 'box') diff = (boxPrice(a) ?? Number.MAX_SAFE_INTEGER) - (boxPrice(b) ?? Number.MAX_SAFE_INTEGER);
    else if (sortKey === 'annual') diff = (annualEstimate(a) ?? Number.MAX_SAFE_INTEGER) - (annualEstimate(b) ?? Number.MAX_SAFE_INTEGER);
    return sortDir === 'asc' ? diff : -diff;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-slate-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const isRakuten = (id: string) => id === 'rakuten';

  return (
    <div>
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-3 text-sm text-yellow-800">
        <TriangleAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          初期表示は両眼で1年使った場合の総額目安順です。1箱あたりの換算価格でも並べ替えられます。最新のまとめ買い価格・送料・クーポンはリンク先でご確認ください。
        </span>
      </div>
      {/* On phones, keep each store, both prices and the purchase action together. */}
      <div className="md:hidden space-y-3 px-3 pb-4">
        {sorted.map((item, index) => {
          const annual = annualEstimate(item);
          const perBox = boxPrice(item);
          const verifiedProductLink = hasProductDetailDestination(item.productId, item.storeId) &&
            item.url.startsWith('https://');
          return (
            <div key={`mobile-${item.storeId}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-bold text-slate-900 break-words min-w-0">{item.store.name}</span>
                {annual != null && annual === cheapestAnnual && <span className="text-xs font-semibold text-emerald-700">年間最安目安</span>}
                {item.store.prescriptionFree && <span className="text-xs text-green-700">処方箋不要</span>}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600 mb-1">1箱あたり</p>
                  <p className="font-bold text-slate-900 whitespace-nowrap">{perBox == null ? '—' : `${Math.round(perBox).toLocaleString('ja-JP')}円`}</p>
                  {item.boxes > 1 && <p className="text-[11px] text-slate-500">{item.boxes}箱セット換算</p>}
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600 mb-1">1年分目安</p>
                  <p className="font-bold text-slate-900 whitespace-nowrap">{annual == null ? '—' : `約${annual.toLocaleString('ja-JP')}円`}</p>
                </div>
              </div>
              {!item.inStock ? <p className="text-center text-sm text-slate-500">在庫なし</p> :
                verifiedProductLink ? (
                  <a href={item.url + item.store.affiliateParam} target="_blank" rel="noopener noreferrer sponsored nofollow"
                    className="block w-full rounded-lg bg-sky-700 px-4 py-3 text-center font-bold text-white hover:bg-sky-800">
                    {item.boxes === 1 ? 'このショップで1箱の価格を確認 →' : `${item.boxes}箱セットの販売価格を確認 →`}
                  </a>
                ) : <p className="rounded-lg border border-slate-200 p-3 text-center text-sm text-slate-500">購入先確認中</p>}
            </div>
          );
        })}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">
                <button onClick={() => handleSort('store')} className="flex items-center hover:text-slate-900">
                  ショップ<SortIcon col="store" />
                </button>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">
                <button onClick={() => handleSort('box')} className="flex items-center justify-center w-full hover:text-slate-900 whitespace-nowrap">1箱あたり<SortIcon col="box" /></button>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">
                <button onClick={() => handleSort('annual')} className="flex items-center justify-center w-full hover:text-slate-900 whitespace-nowrap">
                  1年分目安<SortIcon col="annual" />
                </button>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
                <button onClick={() => handleSort('prescription')} className="flex items-center justify-center w-full hover:text-slate-900">
                  処方箋<SortIcon col="prescription" />
                </button>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">最新価格を確認</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => {
              const annual = annualEstimate(item);
              const perBox = boxPrice(item);
              const isCheapestBox = perBox != null && cheapestBox != null && perBox === cheapestBox;
              const isCheapest = annual != null && cheapestAnnual != null && annual === cheapestAnnual;
              const difference = annual != null && cheapestAnnual != null ? annual - cheapestAnnual : null;
              // Do not claim a direct product price check for an unverified affiliate redirect.
              const verifiedProductLink = hasProductDetailDestination(item.productId, item.storeId) &&
                item.url.startsWith('https://');
              return <tr key={`${item.storeId}-${index}`} className={[
                'border-b border-gray-100 transition-colors hover:bg-slate-50',
                isCheapest ? 'bg-emerald-50/50' : '',
                !item.inStock ? 'opacity-50 bg-gray-50' : '',
              ].filter(Boolean).join(' ')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isRakuten(item.storeId) && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">楽天</span>
                    )}
                    {isCheapest && <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">年間最安目安</span>}
                    {!isRakuten(item.storeId) && item.store.url && !item.store.url.startsWith('#') ? (
                      <a href={item.store.url} target="_blank" rel="noopener noreferrer nofollow sponsored" className={`font-medium ${!item.inStock ? 'text-gray-400' : 'text-sky-600 hover:underline'}`}>
                        {item.store.name}
                      </a>
                    ) : (
                      <span className={`font-medium ${!item.inStock ? 'text-gray-400' : 'text-gray-800'}`}>{item.store.name}</span>
                    )}
                    {item.store.prescriptionFree && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">処方箋不要</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {perBox != null ? <><span className="font-bold text-slate-900">{Math.round(perBox).toLocaleString('ja-JP')}円</span>{isCheapestBox && <span className="block text-[11px] font-semibold text-emerald-700">1箱最安目安</span>}{item.boxes > 1 && <span className="block text-[11px] text-gray-500">{item.boxes}箱セット換算</span>}</> : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {annual != null ? <>
                    <span className="font-bold text-slate-900">約{annual.toLocaleString('ja-JP')}円</span>
                    {isCheapest ? <span className="block text-[11px] font-semibold text-emerald-700">掲載最安目安</span> : difference != null && difference > 0 ? <span className="block text-[11px] text-amber-700">最安目安より +{difference.toLocaleString('ja-JP')}円</span> : null}
                  </> : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  {item.store.prescriptionFree ? <span className="text-green-600 text-xs font-medium">不要</span> : <span className="text-gray-400 text-xs">要確認</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {!item.inStock ? (
                    <span className="text-gray-400 text-xs">在庫なし</span>
                  ) : !verifiedProductLink ? (
                    <span className="inline-block px-3 py-2 rounded-lg text-xs text-gray-400 border border-gray-200 whitespace-nowrap">購入先確認中</span>
                  ) : item.url.startsWith('#') ? (
                    <span className="inline-block px-3 py-2 rounded-lg text-xs text-gray-400 border border-gray-200 whitespace-nowrap">近日追加予定</span>
                  ) : (
                    <a href={item.url + item.store.affiliateParam} target="_blank" rel="noopener noreferrer sponsored nofollow" className="inline-block px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors whitespace-nowrap">
                      価格を確認する →
                    </a>
                  )}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2 px-4 pb-4">
          ※ 1箱あたりは掲載価格÷セット箱数（送料・割引条件は未反映）。1年分目安はワンデー＝両眼365日、2week＝両眼26交換サイクルで掲載単価から単純換算。まとめ買い割引・送料・ケア用品代等は含みません。
        </p>
      </div>
    </div>
  );
}

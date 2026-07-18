'use client';

import { useState } from 'react';
import { Price, Store } from '@/lib/products';

type SortKey = 'store' | 'prescription';
type SortDir = 'asc' | 'desc';

type PriceTableProps = {
  prices: (Price & { store: Store })[];
  productName: string;
};

export default function PriceTable({ prices, productName }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('store');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  if (prices.length === 0) {
    return <p className="text-gray-500 text-sm p-4">価格情報がありません</p>;
  }

  const sorted = [...prices].sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    let diff = 0;
    if (sortKey === 'store') diff = a.store.name.localeCompare(b.store.name, 'ja');
    else if (sortKey === 'prescription') diff = (a.store.prescriptionFree ? 0 : 1) - (b.store.prescriptionFree ? 0 : 1);
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
        <span className="flex-shrink-0 mt-0.5">⚠️</span>
        <span>
          価格はショップにより随時変動します。最新価格・送料・クーポンは必ずリンク先でご確認ください。
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">
                <button onClick={() => handleSort('store')} className="flex items-center hover:text-slate-900">
                  ショップ<SortIcon col="store" />
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
            {sorted.map((item, index) => (
              <tr key={`${item.storeId}-${index}`} className={[
                'border-b border-gray-100 transition-colors hover:bg-slate-50',
                !item.inStock ? 'opacity-50 bg-gray-50' : '',
              ].filter(Boolean).join(' ')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isRakuten(item.storeId) && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">楽天</span>
                    )}
                    <span className={`font-medium ${!item.inStock ? 'text-gray-400' : 'text-gray-800'}`}>
                      {item.store.name}
                    </span>
                    {item.store.prescriptionFree && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">処方箋不要</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  {item.store.prescriptionFree ? (
                    <span className="text-green-600 text-xs font-medium">不要</span>
                  ) : (
                    <span className="text-gray-400 text-xs">要確認</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {!item.inStock ? (
                    <span className="text-gray-400 text-xs">在庫なし</span>
                  ) : item.url.startsWith('#') ? (
                    <span className="inline-block px-3 py-2 rounded-lg text-xs text-gray-400 border border-gray-200 whitespace-nowrap">
                      近日追加予定
                    </span>
                  ) : (
                    <a
                      href={item.url + item.store.affiliateParam}
                      target="_blank"
                      rel="noopener noreferrer sponsored nofollow"
                      className="inline-block px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors whitespace-nowrap"
                    >
                      価格を確認する →
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2 px-4 pb-4">
          ※ 価格は変動します。最新価格はリンク先でご確認ください。当サイトはアフィリエイトプログラムに参加しています。
        </p>
      </div>
    </div>
  );
}

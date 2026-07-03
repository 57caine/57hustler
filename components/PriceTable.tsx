'use client';

import { useState } from 'react';
import { Price, Store, calcTotalPrice } from '@/lib/products';

type SortKey = 'totalPrice' | 'price' | 'store' | 'shipping' | 'prescription';
type SortDir = 'asc' | 'desc';

type PriceTableProps = {
  prices: (Price & { store: Store })[];
  productName: string;
};

export default function PriceTable({ prices, productName }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalPrice');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  if (prices.length === 0) {
    return <p className="text-gray-500 text-sm p-4">価格情報がありません</p>;
  }

  const withTotal = prices.map((item) => {
    const isFreeShipping = item.price >= item.store.freeShippingMin || item.store.freeShippingMin === 0;
    // 合計はショップ表示価格（price）で送料判定し、1箱あたり価格（pricePerBox）に送料を加算
    const totalPrice = item.pricePerBox + (isFreeShipping ? 0 : item.store.shipping);
    return { ...item, totalPrice, isFreeShipping };
  });

  const inStockItems = withTotal.filter((item) => item.inStock);
  const minTotal = inStockItems.length > 0 ? Math.min(...inStockItems.map((i) => i.totalPrice)) : null;

  const sorted = [...withTotal].sort((a, b) => {
    // 在庫なしは常に末尾
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    let diff = 0;
    if (sortKey === 'totalPrice') diff = a.totalPrice - b.totalPrice;
    else if (sortKey === 'price') diff = a.pricePerBox - b.pricePerBox;
    else if (sortKey === 'store') diff = a.store.name.localeCompare(b.store.name, 'ja');
    else if (sortKey === 'shipping') {
      const sa = a.isFreeShipping ? 0 : a.store.shipping;
      const sb = b.isFreeShipping ? 0 : b.store.shipping;
      diff = sa - sb;
    }
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
  const isAmazon = (id: string) => id === 'amazon';

  return (
    <div>
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-3 text-sm text-yellow-800">
        <span className="flex-shrink-0 mt-0.5">⚠️</span>
        <span>
          表示価格は取得時の参考価格です。度数・枚数・クーポンにより実際の価格と異なる場合があります。必ずショップでご確認ください。
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
            <th className="text-right px-4 py-3 font-semibold text-gray-700">
              <button onClick={() => handleSort('price')} className="flex items-center justify-end w-full hover:text-slate-900">
                商品価格<SortIcon col="price" />
              </button>
            </th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
              <button onClick={() => handleSort('shipping')} className="flex items-center justify-end w-full hover:text-slate-900">
                送料<SortIcon col="shipping" />
              </button>
            </th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">
              <button onClick={() => handleSort('totalPrice')} className="flex items-center justify-end w-full hover:text-slate-900">
                合計（送料込）<SortIcon col="totalPrice" />
              </button>
            </th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
              <button onClick={() => handleSort('prescription')} className="flex items-center justify-center w-full hover:text-slate-900">
                処方箋<SortIcon col="prescription" />
              </button>
            </th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">購入</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, index) => {
            const isCheapest = item.inStock && item.totalPrice === minTotal;
            const rowClass = [
              'border-b border-gray-100 transition-colors',
              !item.inStock ? 'opacity-50 bg-gray-50' : '',
              isCheapest ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-slate-50',
            ].filter(Boolean).join(' ');

            return (
              <tr key={`${item.storeId}-${index}`} className={rowClass}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isCheapest && (
                      <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                        送料込み最安
                      </span>
                    )}
                    {isRakuten(item.storeId) && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">楽天</span>
                    )}
                    {isAmazon(item.storeId) && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">Amazon</span>
                    )}
                    <span className={`font-medium ${!item.inStock ? 'text-gray-400' : 'text-gray-800'}`}>
                      {item.store.name}
                    </span>
                    {item.store.prescriptionFree && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full hidden lg:inline-block">
                        処方箋不要
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${isCheapest ? 'text-slate-800' : 'text-gray-700'}`}>
                    ¥{item.pricePerBox.toLocaleString()}
                  </span>
                  {item.boxes > 1 && (
                    <div className="text-xs text-gray-400 mt-0.5">×{item.boxes}箱購入時</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                  {item.isFreeShipping ? (
                    <span className="text-green-600 font-medium text-xs">送料無料</span>
                  ) : (
                    <span>¥{item.store.shipping.toLocaleString()}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold text-lg ${isCheapest ? 'text-slate-800' : 'text-gray-700'}`}>
                    ¥{item.totalPrice.toLocaleString()}
                  </span>
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
                    <div className="flex flex-col items-center gap-0.5">
                      <a
                        href={item.url + item.store.affiliateParam}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          isCheapest
                            ? 'bg-sky-600 text-white hover:bg-sky-500'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {isCheapest ? '最安値で買う' : '購入する'}
                      </a>
                      {isCheapest && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">※ 価格は変動する場合があります</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-sm text-gray-500 mt-3 px-4 pb-4 flex items-start gap-1.5">
        <span className="flex-shrink-0 mt-0.5">⚠️</span>
        <span>
          表示価格は取得時点の目安です。送料・クーポン・会員価格により実際の価格と異なる場合があります。最終価格はショップでご確認ください。
        </span>
      </p>
    </div>
    </div>
  );
}

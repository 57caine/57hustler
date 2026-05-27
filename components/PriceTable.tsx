import { Price, Store } from '@/lib/products';
import Link from 'next/link';

type PriceTableProps = {
  prices: (Price & { store: Store })[];
  productName: string;
};

export default function PriceTable({ prices, productName }: PriceTableProps) {
  if (prices.length === 0) {
    return <p className="text-gray-500 text-sm p-4">価格情報がありません</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">ショップ</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">価格</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">1枚あたり</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">在庫</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">購入</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item, index) => (
            <tr
              key={`${item.storeId}-${index}`}
              className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                index === 0 ? 'bg-yellow-50' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">最安</span>
                  )}
                  <span className="font-medium text-gray-800">{item.store.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`font-bold text-lg ${index === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  ¥{item.price.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                ¥{Math.round(item.price / item.lensCount)}
              </td>
              <td className="px-4 py-3 text-center">
                {item.inStock ? (
                  <span className="text-green-600 font-medium">○ 在庫あり</span>
                ) : (
                  <span className="text-red-500">× 在庫なし</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={item.url + item.store.affiliateParam}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    index === 0
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {index === 0 ? '最安値で買う' : '購入する'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2 px-4 pb-3">
        ※ 価格は税込。最終更新: {new Date().toLocaleDateString('ja-JP')} | 最新価格は各ショップでご確認ください
      </p>
    </div>
  );
}

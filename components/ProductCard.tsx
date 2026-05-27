import Link from 'next/link';
import { ProductWithPrices } from '@/lib/products';

type ProductCardProps = {
  product: ProductWithPrices;
  rank?: number;
};

export default function ProductCard({ product, rank }: ProductCardProps) {
  const categoryLabel: Record<string, string> = {
    '1day': 'ワンデー',
    '2week': 'ツーウィーク',
    'monthly': 'マンスリー',
    'color': 'カラコン',
  };
  const label = categoryLabel[product.category] ?? product.category;

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200">
        <div className="flex items-start gap-3">
          {rank != null && (
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                rank === 1
                  ? 'bg-yellow-400 text-white'
                  : rank === 2
                  ? 'bg-gray-300 text-white'
                  : rank === 3
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{label}</span>
              <span className="text-xs text-gray-500">{product.brandName}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              {product.lowestPrice != null ? (
                <div>
                  <span className="text-xs text-gray-500">最安値</span>
                  <p className="text-lg font-bold text-red-600">¥{product.lowestPrice.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">価格情報なし</p>
              )}
              <span className="text-blue-600 text-xs font-medium">比較する →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

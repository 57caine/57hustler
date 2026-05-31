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
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all duration-200">
        <div className="flex items-start gap-3">
          {rank != null && (
            <div
              className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                rank <= 3 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{label}</span>
              <span className="text-xs text-gray-500">{product.brandName}</span>
              {product.isNew && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{product.name}</h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              {product.lowestPrice != null ? (
                <div>
                  <span className="text-xs text-gray-400">送料別・最安</span>
                  <p className="text-lg font-bold text-slate-800">¥{product.lowestPrice.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">価格情報なし</p>
              )}
              <span className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium">ショップ比較 →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

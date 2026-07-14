import { ProductWithPrices } from '@/lib/products';

const AMZN = (kw: string) =>
  `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) =>
  `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent(
    'https://search.rakuten.co.jp/search/mall/' + kw + '/'
  )}`;

const CATEGORY_EMOJI: Record<string, string> = {
  '1day': '👁',
  '2week': '🔁',
  'monthly': '📅',
  'color': '🌈',
};

const CATEGORY_LABEL: Record<string, string> = {
  '1day': 'ワンデー',
  '2week': 'ツーウィーク',
  'monthly': 'マンスリー',
  'color': 'カラコン',
};

type ProductCardProps = {
  product: ProductWithPrices;
  rank?: number;
};

export default function ProductCard({ product, rank }: ProductCardProps) {
  const label = CATEGORY_LABEL[product.category] ?? product.category;
  const emoji = CATEGORY_EMOJI[product.category] ?? '👁';
  const amznUrl = AMZN(product.name);
  const rakutenUrl = RAKUTEN(product.name);

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 hover:shadow-sm hover:border-amber-300 transition-all duration-200 overflow-hidden">
      {/* Amazon link — covers image + name + price */}
      <a href={amznUrl} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block p-4 pb-10">
        <div className="flex items-start gap-3">
          {rank != null && (
            <div
              className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                rank <= 3 ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{label}</span>
              <span className="text-xs text-gray-500">{product.brandName}</span>
              {product.isNew && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
              )}
            </div>

            {/* image + name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amber-700">{product.name}</h3>
            </div>

            <div className="pt-2 border-t border-gray-100">
              {product.lowestPrice != null ? (
                <div>
                  <span className="text-xs text-gray-400">参考最安値</span>
                  <p className="text-lg font-bold text-slate-800">¥{product.lowestPrice.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">価格情報なし</p>
              )}
            </div>
            <p className="text-xs text-amber-700 font-medium mt-1">Amazon で購入 →</p>
          </div>
        </div>
      </a>

      {/* Rakuten — absolute at bottom, separate <a> (no nesting) */}
      <a
        href={rakutenUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="absolute bottom-0 left-0 right-0 text-center text-xs text-red-600 hover:text-red-500 border-t border-gray-100 py-2.5 bg-white hover:bg-red-50 transition-colors"
      >
        楽天でも見る
      </a>
    </div>
  );
}

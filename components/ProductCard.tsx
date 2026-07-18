import { ProductWithPrices } from '@/lib/products';

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
  const rakutenUrl = RAKUTEN(product.name);

  return (
    <a
      href={rakutenUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="block relative bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-200 overflow-hidden"
    >
      <div className="p-4">
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

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{product.name}</h3>
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
          </div>
        </div>
        <div className="mt-3 bg-[#bf0000] text-white text-xs font-bold text-center py-2 rounded-lg">
          楽天市場で購入 →
        </div>
      </div>
    </a>
  );
}

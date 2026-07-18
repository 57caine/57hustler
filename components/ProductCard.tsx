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

  // Ranking colors: gold/silver/bronze for top 3
  const rankColors: Record<number, { bg: string; text: string; medal: string }> = {
    1: { bg: 'bg-yellow-400', text: 'text-yellow-900', medal: '🥇' },
    2: { bg: 'bg-gray-300', text: 'text-gray-900', medal: '🥈' },
    3: { bg: 'bg-orange-400', text: 'text-orange-900', medal: '🥉' },
  };

  const rankColor = rank && rankColors[rank] ? rankColors[rank] : { bg: 'bg-gray-100', text: 'text-gray-700', medal: '' };

  return (
    <a
      href={rakutenUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="block relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Ranking Badge */}
        {rank != null && (
          <div className={`absolute top-4 right-4 ${rankColor.bg} ${rankColor.text} w-14 h-14 rounded-full flex flex-col items-center justify-center text-center font-bold shadow-lg`}>
            {rankColor.medal && <span className="text-xl">{rankColor.medal}</span>}
            <span className="text-lg">{rank}</span>
          </div>
        )}

        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">{label}</span>
          <span className="text-xs text-gray-600 font-medium">{product.brandName}</span>
          {product.isNew && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">NEW</span>
          )}
        </div>

        {/* Product Name */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl flex-shrink-0">{emoji}</span>
          <h3 className="font-bold text-gray-900 text-base leading-snug flex-1">
            {product.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t border-gray-100 mb-4">
          {product.lowestPrice != null ? (
            <div>
              <span className="text-xs text-gray-500 font-medium">参考最安値</span>
              <p className="text-2xl font-bold text-red-600 mt-1">¥{product.lowestPrice.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm font-medium">価格情報なし</p>
          )}
        </div>

        {/* CTA Button */}
        <div className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold text-center py-3 rounded-lg transition-colors w-full">
          楽天で購入 →
        </div>
      </div>
    </a>
  );
}

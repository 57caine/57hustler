import { Eye, Repeat, Calendar, Rainbow, Medal, type LucideIcon } from 'lucide-react';
import { ProductWithPrices } from '@/lib/products';

const RAKUTEN = (kw: string) =>
  `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent(
    'https://search.rakuten.co.jp/search/mall/' + kw + '/'
  )}`;

const CATEGORY_ICON: Record<string, LucideIcon> = {
  '1day': Eye,
  '2week': Repeat,
  'monthly': Calendar,
  'color': Rainbow,
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
  const CategoryIcon = CATEGORY_ICON[product.category] ?? Eye;
  const rakutenUrl = RAKUTEN(product.name);

  // 楽天以外の最安値A8ショップを取得
  const a8Prices = product.prices.filter(
    (p) => p.inStock && p.storeId !== 'rakuten' && p.store.url.includes('px.a8.net') && !p.url.startsWith('#')
  );
  const cheapestA8 = a8Prices.length > 0
    ? a8Prices.reduce((min, p) => p.price < min.price ? p : min, a8Prices[0])
    : null;

  const rankColors: Record<number, { bg: string; text: string; hasMedal: boolean }> = {
    1: { bg: 'bg-yellow-400', text: 'text-yellow-900', hasMedal: true },
    2: { bg: 'bg-gray-300', text: 'text-gray-900', hasMedal: true },
    3: { bg: 'bg-orange-400', text: 'text-orange-900', hasMedal: true },
  };
  const rankColor = rank && rankColors[rank] ? rankColors[rank] : { bg: 'bg-gray-100', text: 'text-gray-700', hasMedal: false };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden">
      <div className="p-5">
        {rank != null && (
          <div className={`absolute top-4 right-4 ${rankColor.bg} ${rankColor.text} w-14 h-14 rounded-full flex flex-col items-center justify-center text-center font-bold shadow-lg`}>
            {rankColor.hasMedal && <Medal className="w-5 h-5" />}
            <span className="text-lg">{rank}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded border border-sky-200 font-semibold">{label}</span>
          <span className="text-xs text-gray-600 font-medium">{product.brandName}</span>
          {product.isNew && (
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded border border-emerald-200 font-bold">NEW</span>
          )}
        </div>

        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
            <CategoryIcon className="w-5 h-5 text-sky-700" />
          </span>
          <h3 className="font-bold text-gray-900 text-base leading-snug flex-1">
            {product.name}
          </h3>
        </div>

        <div className="pt-4 border-t border-gray-100 mb-4">
          {cheapestA8 != null ? (
            <div>
              <span className="text-xs text-gray-500 font-medium">通販最安値（{cheapestA8.store.name}）</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">¥{cheapestA8.price.toLocaleString()}</p>
            </div>
          ) : product.lowestPrice != null ? (
            <div>
              <span className="text-xs text-gray-500 font-medium">参考最安値</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">¥{product.lowestPrice.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm font-medium">価格情報なし</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {cheapestA8 && (
            <a
              href={cheapestA8.url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="block bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold text-center py-3 rounded-lg transition-colors w-full"
            >
              {cheapestA8.store.name}で購入 →
            </a>
          )}
          <a
            href={rakutenUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="block bg-[#bf0000] hover:opacity-90 text-white text-sm font-bold text-center py-3 rounded-lg transition-opacity w-full"
          >
            楽天で購入 →
          </a>
        </div>
      </div>
    </div>
  );
}

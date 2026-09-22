import { CircleDot, Palette, Glasses, Sun, Droplet, ImageOff } from 'lucide-react';
import { FEATURED_PRODUCTS } from '@/lib/home-featured-products';

const PLACEHOLDER_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'コンタクトレンズ': CircleDot,
  'カラコン': Palette,
  '眼鏡': Glasses,
  'サングラス': Sun,
  '目薬': Droplet,
};

export default function FeaturedProducts() {
  return (
    <section className="bg-white px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">今、人気のおすすめ商品</h2>
            <p className="mt-1 text-sm text-slate-500">実際の口コミや専門家の評価をもとに厳選しました</p>
          </div>
          <a
            href="/ranking"
            className="hidden shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 no-underline transition-colors hover:border-sky-300 hover:text-sky-600 md:inline-block"
          >
            もっと見る →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {FEATURED_PRODUCTS.map((product) => {
            const PlaceholderIcon = PLACEHOLDER_ICON[product.category] ?? ImageOff;
            return (
              <a
                key={product.id}
                href={product.href}
                target={product.isDummy ? undefined : '_blank'}
                rel={product.isDummy ? undefined : 'noopener noreferrer nofollow sponsored'}
                className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md no-underline"
              >
                <div className={`flex aspect-square w-full items-center justify-center ${product.categoryColorClass.split(' ')[0]}`}>
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <PlaceholderIcon className={`h-10 w-10 ${product.categoryColorClass.split(' ')[1]} opacity-40`} />
                  )}
                </div>
                <div className="p-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.categoryColorClass}`}>
                    {product.category}
                  </span>
                  <p className="mt-1.5 text-sm font-bold leading-snug text-slate-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{product.description}</p>
                  <span className="mt-2 block text-right text-sky-600 opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </div>
              </a>
            );
          })}
        </div>

        <a
          href="/ranking"
          className="mt-6 block text-center text-sm font-semibold text-sky-600 no-underline md:hidden"
        >
          もっと見る →
        </a>
      </div>
    </section>
  );
}

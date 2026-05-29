import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getProductWithPrices, getProductsByCategory } from '@/lib/products';
import PriceTable from '@/components/PriceTable';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductWithPrices(slug);
  if (!product) return {};
  return {
    title: `${product.name}の最安値比較`,
    description: `${product.name}の最安値は¥${product.lowestPrice?.toLocaleString() ?? '調査中'}。${product.description}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductWithPrices(slug);
  if (!product) notFound();

  const categoryLabel: Record<string, string> = {
    '1day': 'ワンデー',
    '2week': 'ツーウィーク',
    'monthly': 'マンスリー',
    'color': 'カラコン',
  };
  const label = categoryLabel[product.category] ?? product.category;
  const BASE = 'https://lens-navi.jp';

  // Related products (same category, excluding current, top 3 by popularity)
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        brand: { '@type': 'Brand', name: product.brandName },
        offers: product.lowestPrice != null ? {
          '@type': 'AggregateOffer',
          lowPrice: product.lowestPrice,
          priceCurrency: 'JPY',
          offerCount: product.prices.length,
          availability: 'https://schema.org/InStock',
        } : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: label, item: `${BASE}/category/${product.category}` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE}/product/${product.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category}`} className="hover:text-slate-700">{label}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {/* Product Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{label}</span>
              <span className="text-gray-500 text-sm">{product.brandName} / {product.manufacturer}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.map((f) => (
                <span key={f} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm max-w-xs">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">BC</p>
                <p className="font-bold text-gray-800">{product.bc}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">DIA</p>
                <p className="font-bold text-gray-800">{product.dia}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">含水率</p>
                <p className="font-bold text-gray-800">{product.waterContent}</p>
              </div>
            </div>
          </div>

          {product.lowestPrice != null && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500 mb-1">最安値</p>
              <p className="text-3xl font-bold text-slate-800">¥{product.lowestPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400">（税込）</p>
            </div>
          )}
        </div>
      </div>

      {/* Guide for first-time online buyers */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-base font-bold text-slate-800 mb-4">初めてネット購入の方へ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 text-white rounded w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">処方箋を手元に用意</p>
              <p className="text-xs text-gray-600 mt-0.5">BC・度数（PWR）・DIAを確認</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 text-white rounded w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">ショップで購入</p>
              <p className="text-xs text-gray-600 mt-0.5">下の表で送料込み最安値を比較</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 text-white rounded w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">商品到着</p>
              <p className="text-xs text-gray-600 mt-0.5">最短翌日〜2日で自宅に届く</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 text-xs text-gray-700 space-y-1">
          <p className="text-amber-700 font-medium">⚠ 処方箋について</p>
          <p>処方箋がない場合は眼科で発行してもらう必要があります。ただし、<strong>既に同じ商品を使用中の方は処方箋不要で購入できるショップが多く</strong>、下表で「処方箋不要」と表示されているショップがその対象です。</p>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">ショップ別価格比較（送料込み）</h2>
        </div>
        <PriceTable prices={product.prices} productName={product.name} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">同カテゴリの人気商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.slug}
                href={`/product/${related.slug}`}
                className="block border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{label}</span>
                  <span className="text-xs text-gray-500">{related.brandName}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{related.name}</h3>
                <p className="text-xs text-slate-600 font-medium mt-2">最安値を見る →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Affiliate disclosure */}
      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 当サイトはアフィリエイト広告を掲載しています。「購入する」ボタンから商品を購入された場合、当サイトに手数料が発生することがあります。価格は税込表示ですが、変動する可能性があります。ご購入前に各ショップの最新価格をご確認ください。
      </p>
    </div>
  );
}

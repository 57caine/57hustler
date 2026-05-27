import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getProductWithPrices } from '@/lib/products';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category}`} className="hover:text-blue-600">{label}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {/* Product Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{label}</span>
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
              <p className="text-3xl font-bold text-red-600">¥{product.lowestPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400">（税込）</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">📊 ショップ別価格比較</h2>
        </div>
        <PriceTable prices={product.prices} productName={product.name} />
      </div>

      {/* Affiliate disclosure */}
      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 当サイトはアフィリエイト広告を掲載しています。「購入する」ボタンから商品を購入された場合、当サイトに手数料が発生することがあります。価格は税込表示ですが、変動する可能性があります。ご購入前に各ショップの最新価格をご確認ください。
      </p>
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProducts, getProductBySlug, isPurchasable } from '@/lib/products';

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const purchasable = isPurchasable(product);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-sky-600">商品一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-sm">
          画像準備中
        </div>

        <div>
          <span className="text-xs border border-sky-600 text-sky-700 px-2 py-0.5 rounded font-medium">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.shortDescription}</p>
          <p className="text-2xl font-bold text-sky-700 mb-6">¥{product.price.toLocaleString()}（税込）</p>

          {purchasable ? (
            <button
              type="button"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              カートに入れる
            </button>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
              現在準備中の商品です。決済機能・在庫確認が整い次第、購入可能になります。
            </div>
          )}

          {product.stockNote && (
            <p className="text-xs text-gray-400 mt-3">{product.stockNote}</p>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">商品説明</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
      </div>
    </div>
  );
}

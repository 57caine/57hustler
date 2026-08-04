import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: '商品一覧',
  description: 'アイケアグッズの商品一覧です。',
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">商品一覧</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">商品一覧</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-sky-400 transition-all"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300 text-xs">
              画像準備中
            </div>
            <span className="text-xs border border-sky-600 text-sky-700 px-2 py-0.5 rounded font-medium">{p.category}</span>
            <p className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1">{p.name}</p>
            <p className="text-xs text-gray-500 mb-2">{p.shortDescription}</p>
            <p className="text-sky-700 font-bold">¥{p.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

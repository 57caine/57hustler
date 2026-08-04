import Link from 'next/link';
import { getAllProducts } from '@/lib/products';

export default function HomePage() {
  const products = getAllProducts();

  return (
    <div>
      <section className="bg-sky-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">目もとのケアグッズ専門ストア</h1>
          <p className="text-sky-50 max-w-xl mx-auto mb-8">
            ホットアイマスク・ブルーライトカットメガネなど、毎日のアイケアに役立つグッズをお届けします。
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-sky-700 font-bold px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors"
          >
            商品一覧を見る
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">商品一覧</h2>
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
      </section>
    </div>
  );
}

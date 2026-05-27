import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices, getAllCategories, getPricesUpdatedAt } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ最安値比較 | コンタクト最安値.com',
  description: '人気コンタクトレンズの最安値を一括比較。アキュビュー、デイリーズ、シードなど主要ブランドの価格を毎日自動更新。送料込み最安値をすぐ確認。',
};

export default function HomePage() {
  const allProducts = getAllProductsWithPrices();
  const categories = getAllCategories();
  const updatedAt = getPricesUpdatedAt();
  const topProducts = [...allProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          コンタクトレンズの<span className="text-blue-600">最安値</span>をすぐ比較
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          スマイルコンタクト・アイシティなど主要5ショップを毎日自動比較
        </p>
        <p className="text-sm text-gray-400">
          価格最終更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
      </section>

      {/* Category Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">種類から探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const emoji = { '1day': '🌅', '2week': '📅', 'monthly': '🗓️', 'color': '🌈' }[cat.slug] || '👁️';
            const productCount = allProducts.filter(p => p.category === cat.slug).length;
            return (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                  <div className="text-4xl mb-2">{emoji}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{productCount}商品を比較</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">🏆 人気ランキング TOP6</h2>
          <Link href="/ranking" className="text-blue-600 text-sm hover:underline">もっと見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="bg-blue-50 rounded-2xl p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💡 使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: '商品を選ぶ', desc: '種類・ブランドから気になるコンタクトを選択' },
            { step: '2', title: '価格を比較', desc: '複数ショップの最安値を一覧で確認' },
            { step: '3', title: '最安値で購入', desc: '「最安値で買う」ボタンからそのまま購入' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO text */}
      <section className="text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-bold text-gray-800 mb-3">コンタクトレンズを最安値で購入するために</h2>
        <p className="mb-2">
          コンタクトレンズは毎月購入する消耗品だからこそ、1円でも安く買いたいもの。
          当サイト「コンタクト最安値.com」では、スマイルコンタクト・アイシティ・レンズアップクラブなど
          主要オンラインショップの価格を毎日自動的に比較しています。
        </p>
        <p>
          アキュビュー オアシス・デイリーズ トータルワン・シード ワンデーピュアなど
          人気ブランド全商品の最安値をワンクリックで確認できます。
        </p>
      </section>
    </div>
  );
}

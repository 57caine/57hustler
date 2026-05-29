import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ 人気ランキング2025年版【45商品・送料込み最安値】',
  description: '売れ筋コンタクトレンズランキング。アキュビュー・デイリーズ・バイオフィニティなど人気45商品を人気順・最安値で比較。カテゴリ別ランキングも掲載。',
};

export default function RankingPage() {
  const allRanked = getAllProductsWithPrices().sort((a, b) => b.popularity - a.popularity);

  const categoryOrder = ['1day', '2week', 'monthly', 'color'];
  const categoryLabel: Record<string, string> = {
    '1day': 'ワンデー',
    '2week': 'ツーウィーク',
    monthly: 'マンスリー',
    color: 'カラコン',
  };

  const top10 = allRanked.slice(0, 10);
  const byCategory = categoryOrder.map((cat) => ({
    cat,
    label: categoryLabel[cat],
    products: allRanked.filter((p) => p.category === cat).slice(0, 5),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">人気ランキング</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        コンタクトレンズ 人気ランキング2025年版
      </h1>
      <p className="text-gray-600 mb-8">
        全{allRanked.length}商品の中から人気順・最安値で比較。カテゴリ別ランキングも掲載しています。
      </p>

      {/* Category jump links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="#overall" className="text-sm bg-slate-800 text-white px-3 py-1 rounded-full font-medium">総合TOP10</a>
        {byCategory.map(({ cat, label }) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full hover:border-slate-400 transition-colors"
          >
            {label}TOP5
          </a>
        ))}
      </div>

      {/* Overall Top 10 */}
      <section id="overall" className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-1 pb-2 border-b border-gray-200">
          総合人気ランキング TOP10
        </h2>
        <p className="text-sm text-gray-500 mb-4">全カテゴリを対象にした人気順ランキングです。</p>
        <div className="space-y-3">
          {top10.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* Category Rankings */}
      {byCategory.map(({ cat, label, products }) => (
        <section key={cat} id={cat} className="mb-12">
          <div className="flex items-center justify-between mb-1 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {label}ランキング TOP5
            </h2>
            <Link
              href={`/category/${cat}`}
              className="text-sm text-slate-600 hover:text-slate-800 font-medium"
            >
              {label}を全て見る →
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {label}コンタクトの人気商品TOP5です。
          </p>
          <div className="space-y-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        </section>
      ))}

      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ ランキングは当サイトの閲覧・人気データをもとにしています。価格は税込・送料別の目安。最終更新: {new Date().toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}

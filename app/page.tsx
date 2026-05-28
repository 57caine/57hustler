import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices, getAllCategories, getPricesUpdatedAt } from '@/lib/products';
import { columns } from '@/lib/columns';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ最安値比較 | コンタクト最安値.com',
  description: '人気コンタクトレンズの最安値を一括比較。アキュビュー、デイリーズ、シードなど主要ブランドの価格を毎日自動更新。送料込み最安値をすぐ確認。',
};

const categoryConfig = {
  '1day':    { emoji: '☀️',  color: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50',   border: 'border-blue-200'   },
  '2week':   { emoji: '📆',  color: 'from-teal-500 to-teal-600',    bg: 'bg-teal-50',   border: 'border-teal-200'   },
  'monthly': { emoji: '🗓️', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  'color':   { emoji: '✨',  color: 'from-pink-500 to-pink-600',    bg: 'bg-pink-50',   border: 'border-pink-200'   },
} as const;

const columnCategoryColors: Record<string, string> = {
  '度数・処方箋': 'bg-purple-100 text-purple-700',
  '購入ガイド': 'bg-green-100 text-green-700',
  '商品比較': 'bg-blue-100 text-blue-700',
};

export default function HomePage() {
  const allProducts = getAllProductsWithPrices();
  const categories = getAllCategories();
  const updatedAt = getPricesUpdatedAt();
  const topProducts = [...allProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Hero */}
      <section className="text-center mb-12">
        <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          毎朝6時に価格を自動更新
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          コンタクトレンズの<span className="text-blue-600">最安値</span>を<br className="md:hidden" />すぐ比較
        </h1>
        <p className="text-gray-500 mb-1">
          24店舗を一括比較 | アキュビュー・デイリーズ・シードなど{allProducts.length}商品対応
        </p>
        <p className="text-xs text-gray-400 mb-6">
          価格最終更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/ranking" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
            人気ランキングを見る
          </Link>
          <Link href="/column/hajimete-erabikata" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            初めての方はこちら
          </Link>
        </div>
      </section>

      {/* Category Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">種類から探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const cfg = categoryConfig[cat.slug as keyof typeof categoryConfig];
            const productCount = allProducts.filter(p => p.category === cat.slug).length;
            return (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className={`rounded-2xl border p-5 text-center hover:shadow-md transition-all cursor-pointer ${cfg?.bg ?? 'bg-white'} ${cfg?.border ?? 'border-gray-200'}`}>
                  <div className="text-4xl mb-2">{cfg?.emoji ?? '👁️'}</div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{cat.name}</h3>
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
          <h2 className="text-xl font-bold text-gray-800">人気ランキング TOP6</h2>
          <Link href="/ranking" className="text-blue-600 text-sm hover:underline">すべて見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* Column Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">コンタクト購入ガイド</h2>
          <Link href="/column" className="text-blue-600 text-sm hover:underline">すべて見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map((column) => (
            <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${columnCategoryColors[column.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {column.category}
                  </span>
                  <span className="text-xs text-gray-400">{column.readingTime}分</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-blue-600 transition-colors mb-2">
                  {column.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{column.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-5">当サイトの使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { step: '1', title: '商品を選ぶ', desc: 'ランキング・種類・ブランドから気になるコンタクトを選択', icon: '🔍' },
            { step: '2', title: '価格を比較', desc: '24ショップの最安値を一覧で比較。送料込みで確認できます', icon: '📊' },
            { step: '3', title: '最安値で購入', desc: '「最安値で買う」ボタンからそのまま公式ショップで購入', icon: '🛒' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-xl w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand links */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ブランドから探す</h2>
        <div className="flex flex-wrap gap-3">
          {['acuvue', 'alcon', 'seed', 'menicon', 'coopervision', 'bausch', 'geo'].map((brand) => {
            const names: Record<string, string> = {
              acuvue: 'アキュビュー', alcon: 'アルコン', seed: 'シード',
              menicon: 'メニコン', coopervision: 'クーパービジョン',
              bausch: 'ボシュロム', geo: 'GEO',
            };
            return (
              <Link key={brand} href={`/brand/${brand}`}>
                <span className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors">
                  {names[brand]}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO text */}
      <section className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">コンタクトレンズを最安値で購入するために</h2>
        <p className="mb-3">
          コンタクトレンズは毎月購入する消耗品だからこそ、1円でも安く買いたいもの。
          当サイト「コンタクト最安値.com」では、レンズクイック・アットレンズ・24lensなど
          24の主要オンラインショップの価格を毎朝自動的に比較しています。
        </p>
        <p>
          アキュビュー オアシス・デイリーズ トータルワン・シード ワンデーピュアなど
          {allProducts.length}商品の最安値をワンクリックで確認できます。
          まとめ買いでさらにお得になるショップも多く、年間数千円〜1万円以上の節約も可能です。
        </p>
      </section>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices, getAllCategories, getPricesUpdatedAt } from '@/lib/products';
import { columns } from '@/lib/columns';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ最安値比較【2025年版・45商品対応】| レンズナビ',
  description: '人気コンタクトレンズ45商品の最安値を一括比較。アキュビュー、デイリーズ、シードなど主要ブランドの価格を毎日更新。送料込み最安値をすぐ確認。乱視・カラコン・遠近両用も対応。',
};

const categoryConfig = {
  '1day':    { label: '1day',    bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700'   },
  '2week':   { label: '2week',   bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700'   },
  'monthly': { label: 'monthly', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  'color':   { label: 'color',   bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700'   },
} as const;

const columnCategoryColors: Record<string, string> = {
  '度数・処方箋': 'bg-slate-100 text-slate-700',
  '購入ガイド': 'bg-emerald-50 text-emerald-700',
  '商品比較': 'bg-slate-100 text-slate-700',
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
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-widest">Contact Lens Price Navigator</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          コンタクトレンズ最安値比較<br className="md:hidden" /><span className="text-slate-600"> 2025年版</span>
        </h1>
        <p className="text-gray-500 mb-1">
          24店舗を一括比較 ・ アキュビュー・デイリーズ・シードなど{allProducts.length}商品対応
        </p>
        <p className="text-xs text-gray-400 mb-6">
          価格最終更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/ranking" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors text-sm">
            人気ランキングを見る
          </Link>
          <Link href="/column/hajimete-erabikata" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
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
                <div className={`rounded-xl border p-5 text-center hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer ${cfg?.bg ?? 'bg-white'} ${cfg?.border ?? 'border-gray-200'}`}>
                  <h3 className={`font-bold mb-1 text-sm ${cfg?.text ?? 'text-gray-700'}`}>{cat.name}</h3>
                  <p className="text-xs text-gray-500">{productCount}商品</p>
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
          <Link href="/ranking" className="text-slate-600 text-sm hover:underline">すべて見る →</Link>
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
          <Link href="/column" className="text-slate-600 text-sm hover:underline">全{columns.length}記事を見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.slice(0, 6).map((column) => (
            <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${columnCategoryColors[column.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {column.category}
                  </span>
                  <span className="text-xs text-gray-400">{column.readingTime}分</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-slate-600 transition-colors mb-2">
                  {column.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{column.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/column" className="inline-block text-sm text-slate-700 border border-slate-300 px-5 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            全{columns.length}記事を見る
          </Link>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-12">
        <h2 className="text-lg font-bold text-gray-800 mb-5">当サイトの使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { step: '1', title: '商品を選ぶ', desc: 'ランキング・種類・ブランドから気になるコンタクトを選択' },
            { step: '2', title: '価格を比較', desc: '24ショップの最安値を一覧で比較。送料込みで確認できます' },
            { step: '3', title: '最安値で購入', desc: '「最安値で買う」ボタンからそのまま公式ショップで購入' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="bg-slate-800 text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.title}</h3>
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
                <span className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl hover:border-slate-300 hover:text-slate-700 transition-colors">
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

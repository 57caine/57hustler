import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices, getAllCategories, getPricesUpdatedAt, getAllBCValues, getProductsByBC } from '@/lib/products';
import { columns } from '@/lib/columns';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ BC選び方・おすすめ比較【2026年版】| レンズナビ',
  description: 'ベースカーブ（BC）でコンタクトレンズを選ぶ方法を徹底解説。BC 8.4〜8.8別のおすすめ商品一覧と、24店舗の最安値比較も。アキュビュー・シード・アルコンなど55商品対応。',
  keywords: ['コンタクト BC', 'ベースカーブ 選び方', 'BC 8.6 コンタクト', 'BC 8.8 コンタクト', 'コンタクトレンズ 最安値'],
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
  'BC選び方': 'bg-sky-100 text-sky-700',
};

const homeFaqs = [
  {
    q: 'ベースカーブ（BC）が合っていないとどうなりますか？',
    a: 'BCが小さすぎると角膜を締め付け、充血・痛み・酸素不足が起きます。BCが大きすぎるとレンズがずれやすく、ゴロゴロ感・視力の不安定さにつながります。必ず眼科で処方されたBCのレンズを選んでください。',
  },
  {
    q: '自分のBCはどうやって調べますか？',
    a: '眼科を受診してコンタクトレンズの処方箋を発行してもらうことで確認できます。処方箋に「BC」または「ベースカーブ」として記載されています。自己判断でBCを変えることは眼の健康上危険ですので、必ず眼科での処方に従ってください。',
  },
  {
    q: 'BC 8.5とBC 8.6のコンタクトでは、どちらが自分に合いますか？',
    a: 'これは眼科での検査結果次第です。一般的にBC 8.5は日本人に多いカーブで、アキュビュー系に多く採用されています。BC 8.6はメニコン・バイオフィニティ・クラリティなどに多い値です。眼科の処方箋に記載されたBCと同じ商品を選んでください。',
  },
];

export default function HomePage() {
  const allProducts = getAllProductsWithPrices();
  const categories = getAllCategories();
  const updatedAt = getPricesUpdatedAt();
  const topProducts = [...allProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const bcValues = getAllBCValues();

  const bcColumns = columns.filter(c => c.category === 'BC選び方').slice(0, 4);
  const otherColumns = columns.filter(c => c.category !== 'BC選び方').slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="text-center mb-12">
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-widest">Contact Lens BC Guide</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          コンタクトレンズは<br className="md:hidden" />
          <span className="text-sky-600">BC（ベースカーブ）</span>から選ぶ
        </h1>
        <p className="text-gray-500 mb-1">
          処方箋のBC値を確認して、ぴったりのコンタクトレンズを見つけよう
        </p>
        <p className="text-xs text-gray-400 mb-6">
          {allProducts.length}商品 ・ 24店舗で価格比較 ・ 価格更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/bc" className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-500 transition-colors text-sm">
            BCで商品を探す
          </Link>
          <Link href="/column/bc-to-ha" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
            BCとは？基礎知識を読む
          </Link>
        </div>
      </section>

      {/* BC別クイック選択 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">BC値から選ぶ</h2>
        <p className="text-sm text-gray-500 mb-4">処方箋に記載されているBC値をタップしてください</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {bcValues.map((bc) => {
            const count = getProductsByBC(bc).length;
            return (
              <Link key={bc} href={`/bc/${bc}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-sky-400 hover:shadow-sm transition-all cursor-pointer group">
                  <p className="text-xs text-gray-400 mb-1">ベースカーブ</p>
                  <p className="text-2xl font-bold text-sky-600 group-hover:text-sky-500">BC {bc}</p>
                  <p className="text-xs text-gray-400 mt-1">{count}商品対応</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BC選び方コラム */}
      {bcColumns.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">BC・ベースカーブ 選び方ガイド</h2>
            <Link href="/column" className="text-slate-600 text-sm hover:underline">全記事を見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bcColumns.map((column) => (
              <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-sky-200 transition-all h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${columnCategoryColors[column.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {column.category}
                    </span>
                    <span className="text-xs text-gray-400">{column.readingTime}分</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-sky-600 transition-colors mb-2">
                    {column.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{column.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 人気ランキング */}
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

      {/* 種類で探す */}
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

      {/* コンタクト購入ガイド */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">コンタクト購入ガイド</h2>
          <Link href="/column" className="text-slate-600 text-sm hover:underline">全{columns.length}記事を見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherColumns.map((column) => (
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

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問（BC・ベースカーブ）</h2>
        <div className="space-y-3">
          {homeFaqs.map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ブランドリンク */}
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
        <h2 className="text-lg font-bold text-gray-800 mb-3">ベースカーブ（BC）で選ぶコンタクトレンズ</h2>
        <p className="mb-3">
          コンタクトレンズを選ぶ際に最も重要なのが<strong>BC（ベースカーブ）</strong>です。
          処方箋に記載されたBC値と同じ商品を選ぶことが、快適な装用感の基本です。
          当サイト「レンズナビ」では、BC 8.4・8.5・8.6・8.7・8.8それぞれのおすすめ商品を一覧で確認できます。
        </p>
        <p>
          さらに、アキュビュー・デイリーズ・シード・メニコンなど
          {allProducts.length}商品について24の主要オンラインショップの最安値比較も提供しています。
          BC選び方ガイドと価格比較を組み合わせて、賢くコンタクトレンズを購入しましょう。
        </p>
      </section>
    </div>
  );
}

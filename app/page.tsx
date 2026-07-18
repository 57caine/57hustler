import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices, getAllCategories, getPricesUpdatedAt, getAllBCValues, getProductsByBC } from '@/lib/products';
import { columns } from '@/lib/columns';
import { eyeColumns } from '@/lib/eye-columns';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: '目のことなら、レンズナビ。コンタクト・眼鏡・アイケア・レーシック総合情報 | レンズナビ',
  description: 'コンタクトレンズの最安値比較から眼鏡選び・VRゴーグル・レーシック・ドライアイ対策まで。目に関するすべての情報が揃う総合サイト。レンズナビは目のことなら何でもわかります。',
  keywords: ['コンタクトレンズ 選び方', '眼鏡 選び方', 'VRゴーグル 視力', 'レーシック 費用', 'ドライアイ 目薬 おすすめ', 'ホットアイマスク おすすめ'],
};

const SITE_CATEGORIES = [
  { href: '/category/1day', label: 'コンタクトレンズ', desc: 'BC別・種類別で最安値比較', bgGradient: 'from-blue-500 to-blue-700', colorCode: '#1565c0' },
  { href: '/karakon', label: 'カラコン', desc: 'ランキング・安全な選び方・韓国ブランド', bgGradient: 'from-red-400 to-red-600', colorCode: '#ad1457' },
  { href: '/megane', label: '眼鏡・サングラス', desc: '顔型別フレーム・ブルーライトカット', bgGradient: 'from-gray-600 to-gray-800', colorCode: '#37474f' },
  { href: '/vr', label: 'VR・スマートグラス', desc: 'Meta Quest・Ray-Ban Meta比較', bgGradient: 'from-purple-500 to-purple-700', colorCode: '#4527a0' },
  { href: '/lasik', label: 'レーシック・視力矯正', desc: '費用・リスク・ICLとの違い', bgGradient: 'from-teal-500 to-teal-700', colorCode: '#00695c' },
  { href: '/eye-care', label: 'アイケア・目薬', desc: 'ドライアイ・コンタクト用目薬', bgGradient: 'from-green-500 to-green-700', colorCode: '#2e7d32' },
  { href: '/eye-goods', label: '目の雑貨・グッズ', desc: 'ホットアイマスク・モニターライト', bgGradient: 'from-orange-500 to-orange-700', colorCode: '#e65100' },
];

const categoryConfig = {
  '1day':    { label: '1day',    bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700'   },
  '2week':   { label: '2week',   bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700'   },
  'monthly': { label: 'monthly', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  'color':   { label: 'color',   bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700'   },
} as const;

const homeFaqs = [
  {
    q: 'コンタクトレンズのBC（ベースカーブ）が合っていないとどうなりますか？',
    a: 'BCが小さすぎると角膜を締め付け、充血・痛み・酸素不足が起きます。BCが大きすぎるとレンズがずれやすく、ゴロゴロ感・視力の不安定さにつながります。必ず眼科で処方されたBCのレンズを選んでください。',
  },
  {
    q: 'ドライアイに効く市販の目薬はありますか？',
    a: 'コンタクト装用者にはソフトサンティア（防腐剤フリー）やロートモイストアイが人気です。主成分としてヒアルロン酸Naを含む目薬は保湿効果に優れています。ただし症状が続く場合は眼科を受診してください。',
  },
  {
    q: 'レーシックの費用はいくらですか？',
    a: '両眼で15万〜30万円が一般的な相場です。最新機器を使ったプレミアムプランは30万円以上になることも。ICL（眼内コンタクト）は50〜70万円程度です。クリニックのカウンセリングは無料なのでまず相談してみましょう。',
  },
];

export default function HomePage() {
  const allProducts = getAllProductsWithPrices();
  const categories = getAllCategories();
  const updatedAt = getPricesUpdatedAt();
  const topProducts = [...allProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const bcValues = getAllBCValues();

  const recentEyeColumns = eyeColumns.slice(0, 4);
  const bcColumns = columns.filter(c => c.category === 'BC選び方').slice(0, 2);

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

      {/* Hero Section */}
      <section className="mb-16 -mx-4 md:-mx-0 -mt-8 md:-mt-0">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20 px-4 md:py-32 rounded-b-3xl md:rounded-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            </svg>
          </div>

          {/* Eye icon watermark - top-right decorative */}
          <div className="absolute top-8 right-8 text-8xl md:text-9xl opacity-20 animate-pulse filter drop-shadow-lg pointer-events-none">
            👁
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4 leading-tight relative z-10" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            目のことなら、<br className="md:hidden" />レンズナビ。
          </h1>

          {/* Sub heading */}
          <p className="text-lg md:text-xl text-blue-100 text-center mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            コンタクト・カラコン・VR・レーシック・アイケア
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-5">
            <Link href="/ranking" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 md:px-10 rounded-lg transition-all duration-200 transform hover:scale-105 min-h-12 flex items-center justify-center text-base md:text-lg">
              人気ランキングを見る
            </Link>
            <Link href="/column" className="bg-white hover:bg-gray-50 text-slate-900 font-bold py-3 px-8 md:px-10 rounded-lg border-2 border-white transition-all duration-200 transform hover:scale-105 min-h-12 flex items-center justify-center text-base md:text-lg">
              コラムを読む
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards with Rich Design */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">カテゴリから探す</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                {/* Top gradient area */}
                <div className={`bg-gradient-to-br ${cat.bgGradient} h-32 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <span className="text-6xl filter drop-shadow-lg relative z-10">👁</span>
                </div>

                {/* Content area */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {cat.desc}
                  </p>
                  <div className="mt-4 inline-flex items-center text-sky-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    詳しく見る →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新コラム（目のカテゴリ） */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">目の健康・アイケアコラム</h2>
          <Link href="/column" className="text-sky-600 text-sm hover:underline">全記事を見る →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEyeColumns.map((column) => (
            <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-sky-200 transition-all h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{column.category}</span>
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

      {/* Ranking Section */}
      <section className="mb-16 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">人気ランキング TOP 6</h2>
            <p className="text-sm text-gray-600">
              {allProducts.length}商品掲載 ・ 更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          <Link href="/ranking" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap">
            全ランキングを見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* BC選択 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">BC値（ベースカーブ）で選ぶ</h2>
          <Link href="/bc" className="text-sky-600 text-sm hover:underline">BCとは？</Link>
        </div>
        <p className="text-sm text-gray-500 mb-4">処方箋に記載されているBC値をタップしてください</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {bcValues.map((bc) => {
            const count = getProductsByBC(bc).length;
            return (
              <Link key={bc} href={`/bc/${bc}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-sky-400 hover:shadow-sm transition-all cursor-pointer group">
                  <p className="text-xs text-gray-400 mb-1">ベースカーブ</p>
                  <p className="text-2xl font-bold text-sky-600 group-hover:text-sky-500">BC {bc}</p>
                  <p className="text-xs text-gray-400 mt-1">{count}商品</p>
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
            <h2 className="text-xl font-bold text-gray-800">BC・コンタクト 選び方ガイド</h2>
            <Link href="/column" className="text-slate-600 text-sm hover:underline">全記事を見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bcColumns.map((column) => (
              <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-sky-200 transition-all h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-medium">{column.category}</span>
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

      {/* 種類で探す */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">コンタクト種類から探す</h2>
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

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">コンタクトブランドから探す</h2>
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
        <h2 className="text-lg font-bold text-gray-800 mb-3">目のことなら、レンズナビ。</h2>
        <p className="mb-3">
          「レンズナビ」は、コンタクトレンズの最安値比較から始まり、眼鏡・サングラス・VRゴーグル・レーシック・アイケア・目のグッズまで、
          目に関するすべての情報を網羅する総合サイトです。
        </p>
        <p>
          コンタクトレンズは<strong>BC（ベースカーブ）</strong>別に{allProducts.length}商品を掲載。楽天市場で最安値をチェックできます。
          ドライアイ対策・ブルーライトカット眼鏡・ホットアイマスクなどのアイケア情報も専門ライターが丁寧に解説しています。
        </p>
      </section>
    </div>
  );
}

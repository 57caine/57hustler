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
  { href: '/category/1day', icon: '👁', label: 'コンタクトレンズ', desc: 'BC別・種類別で最安値比較', color: 'from-sky-50 to-blue-50', border: 'border-sky-200', accent: 'text-sky-600' },
  { href: '/karakon', icon: '👁‍🗨', label: 'カラコン', desc: 'ランキング・安全な選び方・韓国ブランド', color: 'from-pink-50 to-rose-50', border: 'border-pink-200', accent: 'text-pink-600' },
  { href: '/megane', icon: '👓', label: '眼鏡・サングラス', desc: '顔型別フレーム・ブルーライトカット', color: 'from-indigo-50 to-violet-50', border: 'border-indigo-200', accent: 'text-indigo-600' },
  { href: '/vr', icon: '🥽', label: 'VR・スマートグラス', desc: 'Meta Quest・Ray-Ban Meta比較', color: 'from-violet-50 to-purple-50', border: 'border-violet-200', accent: 'text-violet-600' },
  { href: '/lasik', icon: '✨', label: 'レーシック・視力矯正', desc: '費用・リスク・ICLとの違い', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', accent: 'text-emerald-600' },
  { href: '/eye-care', icon: '💊', label: 'アイケア・目薬', desc: 'ドライアイ・コンタクト用目薬', color: 'from-cyan-50 to-teal-50', border: 'border-cyan-200', accent: 'text-cyan-600' },
  { href: '/eye-goods', icon: '🛍', label: '目の雑貨・グッズ', desc: 'ホットアイマスク・モニターライト', color: 'from-orange-50 to-amber-50', border: 'border-orange-200', accent: 'text-orange-600' },
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

      {/* Hero */}
      <section className="text-center mb-12">
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-widest">Eye Care & Vision Guide</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          目のことなら、<span className="text-sky-600">レンズナビ。</span>
        </h1>
        <p className="text-gray-500 mb-6 text-sm max-w-xl mx-auto">
          コンタクトレンズの最安値比較から、眼鏡・VR・レーシック・アイケアまで。目に関するあらゆる情報を網羅します。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/ranking" className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-500 transition-colors text-sm">
            コンタクトおすすめを見る
          </Link>
          <Link href="/column" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
            コラムを読む
          </Link>
        </div>
      </section>

      {/* 6カテゴリ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">カテゴリから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SITE_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} className="group block">
              <div className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-xl p-5 hover:shadow-sm transition-all`}>
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className={`font-bold text-sm mb-1 ${cat.accent}`}>{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.desc}</p>
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

      {/* コンタクト価格比較 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">コンタクトレンズ 最安値ランキング</h2>
          <Link href="/ranking" className="text-slate-600 text-sm hover:underline">すべて見る →</Link>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {allProducts.length}商品掲載 ・ 価格更新: {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ商品比較2026年版【装用タイプ別】',
  description: 'コンタクトレンズの掲載商品を比較。アキュビュー・デイリーズ・バイオフィニティなどの商品情報と装用タイプ別の商品比較を掲載。',
};

const faqs = [
  {
    q: 'コンタクトレンズはどこで買うのが一番安いですか？',
    a: '販売店や購入数量、送料、キャンペーンによって総額は変わります。同じ製品・箱数・度数の条件を揃え、送料込みの支払総額を複数の販売店で比較してください。',
  },
  {
    q: '人気No.1のコンタクトレンズは何ですか？',
    a: '人気順位は集計方法や時期によって変わります。このページでは掲載商品データに基づく独自の順序で紹介しています。装用期間や素材、眼科で確認したレンズの適合条件を優先して選んでください。',
  },
  {
    q: '初めてコンタクトを購入する場合は何から選べばいいですか？',
    a: 'まず眼科で目の状態とレンズの適合を確認し、製品名・BC（ベースカーブ）・PWR（度数）・DIA（直径）など必要な情報を確認してください。装用期間やケア方法は生活習慣に合わせて眼科で相談しましょう。',
  },
  {
    q: '乾きにくいコンタクトレンズはどれですか？',
    a: '乾燥感は涙の状態や装用環境、レンズとの相性によって異なります。素材や製品特性だけで決めず、乾燥や違和感が続く場合は装用を中止し、眼科に相談してください。',
  },
];

export default function RankingPage() {
  const allRanked = getAllProductsWithPrices();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">商品比較</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        コンタクトレンズ商品比較2026年版
      </h1>
      <p className="text-gray-600 mb-8">
        全{allRanked.length}商品を掲載データの順序で紹介。価格・送料・在庫は各販売店の最新表示をご確認ください。
      </p>

      {/* Category jump links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="#overall" className="text-sm bg-sky-600 text-white px-3 py-1 rounded-full font-medium">掲載商品10選</a>
        {byCategory.map(({ cat, label }) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full hover:border-slate-400 transition-colors"
          >
            {label}5選
          </a>
        ))}
      </div>

      {/* Overall Top 10 */}
      <section id="overall" className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-1 pb-2 border-b border-gray-200">
          掲載商品10選
        </h2>
        <p className="text-sm text-gray-500 mb-4">全カテゴリから掲載データの順序で10商品を紹介します。人気・売上順位ではありません。</p>
        <div className="space-y-3">
          {top10.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Rankings */}
      {byCategory.map(({ cat, label, products }) => (
        <section key={cat} id={cat} className="mb-12">
          <div className="flex items-center justify-between mb-1 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {label}の商品5選
            </h2>
            <Link
              href={`/category/${cat}`}
              className="text-sm text-slate-600 hover:text-slate-800 font-medium"
            >
              {label}を全て見る →
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {label}コンタクトから掲載データの順序で5商品を紹介します。
          </p>
          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {/* Purchase decision guidance: do not send visitors to generic shop landing pages. */}
      <section className="mb-10 rounded-xl border border-sky-100 bg-sky-50 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">購入前に確認すること</h2>
        <p className="text-sm text-gray-700 mb-3">
          眼科で適合を確認した製品と同じ商品を選び、度数・BC・DIA・箱数を販売ページで確認してください。
          価格は送料を含む支払総額で比較しましょう。
        </p>
        <p className="text-sm text-gray-700">
          上の商品カードから各商品の販売ページや楽天の商品検索へ進めます。
          リンク先の価格・在庫・取扱条件は変更される場合があります。
        </p>
        <p className="text-xs text-gray-500 mt-3">※当サイトはアフィリエイト広告を掲載しています。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">Q: {q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">A: {a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ 商品の掲載順は当サイトの掲載データに基づくもので、人気・売上順位ではありません。価格は参考値であり、送料・在庫・販売条件は各販売店の最新表示をご確認ください。
      </div>
    </div>
  );
}

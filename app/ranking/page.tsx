import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ 人気ランキング2026年版【55商品・送料込み最安値】',
  description: '売れ筋コンタクトレンズランキング。アキュビュー・デイリーズ・バイオフィニティなど人気55商品を人気順・最安値で比較。カテゴリ別ランキングも掲載。',
};

const faqs = [
  {
    q: 'コンタクトレンズはどこで買うのが一番安いですか？',
    a: '通販（ネット購入）が最安値になるケースがほとんどです。1DAY アキュビュー モイストの場合、眼科処方では1箱1,700〜2,200円程度ですが、通販では1,400〜1,600円前後まで下がることがあります。送料込みで比較することが重要で、まとめ買いで送料無料になるショップを活用するとさらにコストを抑えられます。',
  },
  {
    q: '人気No.1のコンタクトレンズは何ですか？',
    a: 'ワンデータイプでは「1DAY アキュビュー モイスト」と「デイリーズ トータルワン」が常に上位です。アキュビューはLACREON技術によるうるおい感が人気で、デイリーズ トータルワンはシリコーンハイドロゲル素材と水分保持96%が支持されています。2weekでは「アキュビュー オアシス」「バイオフィニティ」が定番です。',
  },
  {
    q: '初めてコンタクトを購入する場合は何から選べばいいですか？',
    a: 'まず眼科で処方箋を取得し、BC（ベースカーブ）・PWR（度数）・DIA（直径）を確認してください。初心者には「1日使い捨てタイプ（1day）」がケア不要で衛生的なためおすすめです。アキュビュー モイスト・デイリーズ アクア コンフォートプラスは比較的リーズナブルで、初めてのコンタクトとして人気があります。',
  },
  {
    q: '乾きにくいコンタクトレンズはどれですか？',
    a: 'シリコーンハイドロゲル素材のコンタクトが乾きにくいとされています。「デイリーズ トータルワン」（水分保持96%）、「アキュビュー オアシス（1day）」（HydraLuxe技術）、「バイオフィニティ」（Aquaform技術）が特に評価が高く、PC作業・長時間装用をする方に向いています。',
  },
];

export default function RankingPage() {
  const allRanked = getAllProductsWithPrices().sort((a, b) => b.popularity - a.popularity);

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
        <span className="text-gray-800">人気ランキング</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        コンタクトレンズ 人気ランキング2026年版
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
        ※ ランキングは当サイトの閲覧・人気データをもとにしています。価格は税込・送料別の目安。最終更新: {new Date().toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}

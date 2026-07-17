import { Metadata } from 'next';
import Link from 'next/link';
import { karakonColumns } from '@/lib/karakon-columns';

export const metadata: Metadata = {
  title: 'カラコンのおすすめ・選び方【度あり・度なし・ナチュラル・韓国ブランド】2026年版 | レンズナビ',
  description: '2026年最新カラコンおすすめランキングと選び方ガイド。度あり・度なし別、ナチュラル系・盛り系、韓国ブランド比較、公式アンバサダー情報まで。安全な選び方・薬機法承認品を徹底解説。',
  keywords: ['カラコン おすすめ', 'カラコン 度あり', 'カラコン ナチュラル', '韓国 カラコン', 'カラコン 初心者', 'カラコン 安全', 'カラコン ランキング 2026'],
};

const RAKUTEN = (kw: string) =>
  `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

const articles = karakonColumns.map(c => ({
  slug: c.slug,
  title: c.title,
  desc: c.description,
  readingTime: c.readingTime,
  badge: '👁‍🗨 カラコン',
}));

const quickBuys = [
  { label: 'カラコン 度あり', rakuten: 'カラコン 度あり ワンデー 日本製' },
  { label: 'カラコン 度なし', rakuten: 'カラコン 度なし ナチュラル 日本製' },
  { label: 'ナチュラル系カラコン', rakuten: 'カラコン ナチュラル ブラウン' },
  { label: '韓国カラコン', rakuten: '韓国 カラコン 日本正規品' },
];

const faqs = [
  {
    q: 'カラコンとコンタクトレンズの違いは何ですか？',
    a: 'カラコン（カラーコンタクトレンズ）はレンズに着色が施されたコンタクトレンズです。日本では度ありも度なしも同じく「高度管理医療機器」として薬機法の規制を受けます。度なしのカラコンでも眼科受診を推奨します。',
  },
  {
    q: 'カラコンは毎日つけても大丈夫ですか？',
    a: '適切なレンズを選び、装用時間（1日8〜10時間以内）と清潔なケアを守れば毎日使用できます。ワンデータイプは毎日交換するため最も衛生的です。ただし目の充血・痛み・見えにくさがある場合は直ちに使用を中止し眼科を受診してください。',
  },
  {
    q: '度なしカラコンも眼科に行く必要がありますか？',
    a: '法的義務ではありませんが、初めてカラコンを使う場合は眼科受診を強くおすすめします。BC（ベースカーブ）が合っていないと角膜を傷める可能性があります。目の健康状態（アレルギー・ドライアイ）も確認できます。',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function KarakonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">カラコン</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">👁‍🗨</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">カラコン完全ガイド2026</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          度あり・度なし別おすすめランキングから、安全な選び方・韓国ブランド・公式アンバサダー情報まで。
          薬機法承認済みの安心カラコンを紹介します。
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['薬機法承認品のみ紹介', '楽天で購入可能', '初心者ガイドあり'].map(t => (
            <span key={t} className="text-xs bg-white border border-pink-200 text-pink-700 px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">カラコン ガイド記事</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`}
            className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-pink-300 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-medium">{a.badge}</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 group-hover:text-pink-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-pink-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* Safety box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h2 className="font-bold text-amber-800 mb-2">⚠️ カラコン購入前に必ず確認</h2>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 初めてのカラコンは眼科でBC（ベースカーブ）を測定してから購入する</li>
          <li>• パッケージに「高度管理医療機器」「承認番号」の記載があることを確認する</li>
          <li>• 雑貨店・格安サイトの無承認品は使用しない</li>
          <li>• 1日8〜10時間以内の装用時間を守る</li>
        </ul>
        <Link href="/column/karakon-anzen-erabikata"
          className="inline-block mt-3 text-xs text-amber-800 font-bold border border-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
          安全な選び方を詳しく読む →
        </Link>
      </div>

      {/* Quick Buy */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">カテゴリー別に楽天で探す</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {quickBuys.map(p => (
          <a key={p.label} href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-red-300 hover:shadow-sm transition-all">
            <span className="font-medium text-gray-800 text-sm">{p.label}</span>
            <span className="text-xs text-red-600 font-bold">楽天で見る →</span>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
      <div className="space-y-3 mb-8">
        {faqs.map(({ q, a }) => (
          <details key={q} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
              {q}<span className="text-gray-400 ml-2 text-xs shrink-0">▾</span>
            </summary>
            <div className="px-4 pb-4 pt-2 text-sm text-gray-700 border-t border-gray-100 leading-relaxed">{a}</div>
          </details>
        ))}
      </div>

      {/* Cross-link */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
        <h2 className="font-bold text-sky-800 mb-2">👁 コンタクトレンズも比較する</h2>
        <p className="text-sm text-gray-700 mb-3">
          透明コンタクトレンズのBC別最安値比較はこちら。カラコンと並行してコンタクトレンズの価格もチェックできます。
        </p>
        <Link href="/category/1day" className="inline-block bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors">
          ワンデーコンタクトを比較する →
        </Link>
      </div>
    </div>
  );
}

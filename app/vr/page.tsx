import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VR・スマートグラスの選び方【視力が悪い人の対策・Meta Quest・Ray-Ban Meta】| レンズナビ',
  description: 'VRゴーグルを視力が悪くても快適に使う方法（コンタクト・度付きインサート）、Meta Quest 3・Ray-Ban Meta・Apple Vision Proの最新比較2026年版。',
  keywords: ['VRゴーグル 視力', 'Meta Quest 3', 'スマートグラス おすすめ', 'VR 近視', '度付きインサートレンズ'],
};

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

const articles = [
  {
    slug: 'vr-shiryoku-warui',
    title: '視力が悪い人のVRゴーグル対策【コンタクト・度付きインサート・メガネスペーサー完全ガイド】',
    desc: '近視・乱視があってもVRを快適に楽しむ3つの方法を解説。Meta Quest対応の度付きインサートレンズも紹介。',
    readingTime: 7,
  },
  {
    slug: 'smart-glass-2026',
    title: 'スマートグラス・VRゴーグル おすすめ2026【Meta Quest 3・Ray-Ban Meta・Vision Pro比較】',
    desc: '2026年最新のVRゴーグル・スマートグラスを徹底比較。視力対応状況も解説。',
    readingTime: 8,
  },
  {
    slug: 'vr-game-osusume-2026',
    title: 'VRゲーム・アプリおすすめ2026【Meta Quest 3対応・ジャンル別ランキング】',
    desc: 'Beat Saber・VRChat・Superhot VRなどMeta Quest 3で遊べるおすすめVRゲームをジャンル別にランキング。',
    readingTime: 7,
  },
  {
    slug: 'vr-yoi-taisaku',
    title: 'VR酔い対策完全ガイド【原因・防ぐ方法・Meta Quest設定】',
    desc: 'VR酔いの原因からテレポート移動・ビネット設定など7つの具体的対策を解説。初心者必読。',
    readingTime: 7,
  },
  {
    slug: 'vr-business-metaverse-2026',
    title: 'VRビジネス活用・メタバース最新動向2026【XR会議・トレーニング・産業活用】',
    desc: 'VR会議・バーチャルトレーニングなど企業のXR活用事例と2026年のメタバース業界トレンドを解説。',
    readingTime: 8,
  },
];

const products = [
  { emoji: '🥽', label: 'Meta Quest 3', amzn: 'Meta Quest 3', rakuten: 'Meta Quest 3' },
  { emoji: '😎', label: 'Ray-Ban Meta Smart Glasses', amzn: 'Ray-Ban Meta Smart Glasses', rakuten: 'Ray-Ban Meta' },
  { emoji: '🔭', label: 'VR度付きインサートレンズ', amzn: 'VR 度付き インサートレンズ', rakuten: 'VR インサートレンズ' },
  { emoji: '📦', label: 'VRメガネスペーサー', amzn: 'VR メガネスペーサー', rakuten: 'VR メガネスペーサー' },
];

const faqs = [
  { q: 'コンタクトレンズを付けたままVRゴーグルを使っても大丈夫ですか？', a: 'ソフトコンタクトレンズであれば基本的に問題ありません。ただし、VR使用中は瞬きが減少してドライアイになりやすいため、装用時間に注意し目薬を準備することをおすすめします。ハードコンタクトはVR使用時の圧迫でズレやすいため注意が必要です。' },
  { q: 'Meta Quest 3は視力が悪くても使えますか？', a: 'Meta Quest 3にはメガネスペーサー（アダプター）が付属しており、多くの眼鏡が装着可能です。また、VR用の度付きインサートレンズ（prescription lenses）を購入してヘッドセットに装着することで、眼鏡なしで使用できます。' },
  { q: 'スマートグラスとVRゴーグルの違いは何ですか？', a: 'VRゴーグル（Meta Quest等）は現実を遮断して仮想空間に没入するデバイスです。スマートグラス（Ray-Ban Meta等）は現実世界に情報をオーバーレイするAR的な使い方や、カメラ・スピーカーを内蔵した「スマートな眼鏡」です。用途に応じて選びましょう。' },
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

export default function VRPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">VR・スマートグラス</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">🥽</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">VR・スマートグラス</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          視力が悪い方向けのVR対策から最新デバイスの比較まで。
          Meta Quest・Ray-Ban Meta・Apple Vision Proを徹底解説します。
        </p>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">VR・スマートグラス ガイド記事</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-violet-300 transition-all">
            <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded font-medium">VR・スマートグラス</span>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1 group-hover:text-violet-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-violet-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* 視力対策ボックス */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-10">
        <h2 className="font-bold text-sky-800 mb-2">👁 視力が悪い方へ：まずコンタクトを検討</h2>
        <p className="text-sm text-gray-700 mb-3">
          VRゴーグルをコンタクトレンズ装用で使うのが最もシンプルな解決策です。
          ワンデーコンタクトはVR使用時の衛生面でも安心です。
        </p>
        <Link href="/category/1day" className="inline-block bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors">
          ワンデーコンタクトを比較する →
        </Link>
      </div>

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">VR・スマートグラスを購入する</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {products.map(p => (
          <div key={p.label} className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-amber-300 transition-all">
            <a href={AMZN(p.amzn)} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block p-5 pb-10 text-center">
              <div className="text-3xl mb-2">{p.emoji}</div>
              <p className="text-sm font-bold text-gray-800">{p.label}</p>
              <p className="text-xs text-amber-700 font-medium mt-1">Amazon で購入 →</p>
            </a>
            <a href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
              className="absolute bottom-0 left-0 right-0 text-center text-xs text-red-600 hover:text-red-500 border-t border-gray-100 py-2.5 bg-white hover:bg-red-50 transition-colors">
              楽天でも見る
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <details key={q} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
              {q}<span className="text-gray-400 ml-2 text-xs shrink-0">▾</span>
            </summary>
            <div className="px-4 pb-4 pt-2 text-sm text-gray-700 border-t border-gray-100 leading-relaxed">{a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

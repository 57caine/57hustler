import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '眼鏡・サングラスの選び方【顔型別・ブルーライト・オンライン購入ガイド】| レンズナビ',
  description: '眼鏡の顔型別選び方、ブルーライトカット眼鏡の効果、オンラインで眼鏡を買う方法を解説。Amazon・楽天での眼鏡フレーム選び方も紹介。',
  keywords: ['眼鏡 選び方', 'ブルーライトカット眼鏡', 'サングラス おすすめ', 'メガネ 顔型', 'オンライン眼鏡'],
};

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

const articles = [
  {
    slug: 'megane-kaomikata',
    title: '眼鏡の選び方【顔型別ガイド2026】丸顔・面長・卵型・ベース型別おすすめフレーム',
    desc: '顔型別に似合う眼鏡フレームの形・素材を徹底解説。丸顔・面長・卵型・ベース型それぞれのおすすめも。',
    readingTime: 8,
  },
  {
    slug: 'blue-light-megane-kouka',
    title: 'ブルーライトカット眼鏡の効果は本当にある？科学的根拠と選び方を解説',
    desc: 'ブルーライトカット眼鏡の科学的な効果と、PC・スマホ作業が多い人向けの選び方を解説。',
    readingTime: 6,
  },
  {
    slug: 'megane-online-shopping',
    title: 'オンラインで眼鏡を安く買う方法【JINS・Zoff・楽天・Amazon完全ガイド】',
    desc: '処方箋を使ってオンラインで度付き眼鏡を注文する手順と、各サービスの比較ガイド。',
    readingTime: 6,
  },
];

const products = [
  { label: '眼鏡フレーム（Amazon）', amzn: '眼鏡 フレーム', rakuten: '眼鏡フレーム' },
  { label: 'ブルーライトカット眼鏡（Amazon）', amzn: 'ブルーライトカット 眼鏡', rakuten: 'ブルーライトカット眼鏡' },
  { label: 'サングラス（Amazon）', amzn: 'サングラス UV400', rakuten: 'サングラス おすすめ' },
  { label: '眼鏡ケース（Amazon）', amzn: '眼鏡ケース おしゃれ', rakuten: '眼鏡ケース' },
];

const faqs = [
  { q: '眼鏡はオンラインで処方箋なしで買えますか？', a: '度なし・ブルーライトカットのみの眼鏡は処方箋不要でオンライン購入できます。度付き眼鏡は処方箋または現在使用中の眼鏡のパラメータ（度数・PD）が必要です。' },
  { q: 'ブルーライトカット眼鏡は目の疲れに効果がありますか？', a: '日本眼科学会の見解ではブルーライトカット眼鏡の効果は限定的とされています。ただし、画面の輝度調整・適度な休憩・モニターとの距離を保つことがより効果的です。' },
  { q: '眼鏡の度数は眼科とコンタクトで同じですか？', a: '異なります。眼鏡は目から12mm離れたレンズで矯正するため、コンタクトより度数が弱くなることが多いです。眼科での処方が必要です。' },
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

export default function MeganePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">眼鏡・サングラス</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">👓</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">眼鏡・サングラス</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          顔型別フレームの選び方からブルーライトカット眼鏡の効果、オンライン購入のコツまで。
          眼鏡に関する疑問をすべてカバーします。
        </p>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">眼鏡ガイド記事</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-indigo-300 transition-all">
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">眼鏡・サングラス</span>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1 group-hover:text-indigo-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-indigo-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">眼鏡・サングラスを購入する</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {products.map(p => (
          <div key={p.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-3">{p.label}</p>
            <div className="flex gap-2">
              <a href={AMZN(p.amzn)} target="_blank" rel="noopener noreferrer nofollow"
                className="flex-1 text-center text-xs font-medium bg-amber-400 hover:bg-amber-300 text-gray-900 px-3 py-2 rounded-lg transition-colors">
                Amazon で探す
              </a>
              <a href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow"
                className="flex-1 text-center text-xs font-medium bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-lg transition-colors">
                楽天で探す
              </a>
            </div>
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

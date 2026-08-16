import { Metadata } from 'next';
import Link from 'next/link';
import { Glasses, Monitor, Sun, Backpack } from 'lucide-react';
import { eyeColumns } from '@/lib/eye-columns';
import { getHeroImage } from '@/lib/unsplash';
import HeroBanner from '@/components/HeroBanner';

const articles = eyeColumns
  .filter(c => c.section === 'megane')
  .map(c => ({ slug: c.slug, title: c.title, desc: c.description, readingTime: c.readingTime }));

export const metadata: Metadata = {
  title: '眼鏡・サングラスの選び方【顔型別・ブルーライト・オンライン購入ガイド】| レンズナビ',
  description: '眼鏡の顔型別選び方、ブルーライトカット眼鏡の効果、オンラインで眼鏡を買う方法を解説。楽天での眼鏡フレーム選び方も紹介。',
  keywords: ['眼鏡 選び方', 'ブルーライトカット眼鏡', 'サングラス おすすめ', 'メガネ 顔型', 'オンライン眼鏡'],
};

const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


const products = [
  { Icon: Glasses, label: '眼鏡フレーム', rakuten: '眼鏡フレーム' },
  { Icon: Monitor, label: 'ブルーライトカット眼鏡', rakuten: 'ブルーライトカット眼鏡' },
  { Icon: Sun, label: 'サングラス', rakuten: 'サングラス おすすめ' },
  { Icon: Backpack, label: '眼鏡ケース', rakuten: '眼鏡ケース' },
];

const itemCards = [
  { label: 'Wavecontact メガネフレーム MGN_BASIC', shop: 'Wavecontact', tag: '眼鏡フレーム', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e02a.71e3dd44.5622e02b.389edc30/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fwavecontact%2Fmgn_basic%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Hodopus メガネフレーム', shop: 'Hodopus', tag: '眼鏡フレーム', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e211.f6ea6aba.5622e212.66574491/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhodopus%2Fhodopus-0001%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'おまかせメガネフレーム', shop: 'メガネルーン', tag: 'お得', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e14a.0945d102.5622e14b.5e616d31/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmegane-lune%2F998-megane-random%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'メガネフレーム CF5043', shop: 'メガネスタイル', tag: '眼鏡フレーム', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e16c.d190f4a9.5622e16d.a64e1d5d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmegane-style%2Fcf5043%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Re-COLLE PCメガネ C111055', shop: 'Re-COLLE', tag: 'PCメガネ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e4c6.0ff9348e.5622e4c7.74cd653f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fre-colle%2Fc111055-pc%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'メガネフレーム U1908C', shop: 'Lorelife', tag: '眼鏡フレーム', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e4ee.c25ab11d.5622e4ef.2987dd69/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Florelife%2Fu1908c-059%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'メガネフレーム F2006C', shop: 'Lorelife', tag: 'おしゃれ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e4ee.c25ab11d.5622e4ef.2987dd69/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Florelife%2Ff2006c-106%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'merry39 メガネフレーム No.2854', shop: 'merry39', tag: '眼鏡フレーム', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e546.0cf65a05.5622e547.f9ab9c2c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmerry39%2F2854%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'メガネフレーム F1912C', shop: 'Lorelife', tag: 'ファッション', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622e4ee.c25ab11d.5622e4ef.2987dd69/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Florelife%2Ff1912c-086%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
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

export default async function MeganePage() {
  const heroImage = await getHeroImage('eyeglasses frame fashion');
  return (
    <div className="light-preview max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">眼鏡・サングラス</span>
      </nav>

      {/* Hero */}
      <HeroBanner
        icon={<Glasses className="w-9 h-9 text-white" />}
        title="眼鏡・サングラス"
        description="顔型別フレームの選び方からブルーライトカット眼鏡の効果、オンライン購入のコツまで。眼鏡に関する疑問をすべてカバーします。"
        imageUrl={heroImage}
        imageAlt="眼鏡フレーム"
        gradient="from-indigo-600 to-sky-600"
        borderColor="border-indigo-200"
        overlayFrom="from-indigo-900/80"
        overlayTo="to-sky-700/60"
      />

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

      {/* Specific Product Cards */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">おすすめメガネアイテム</h2>
      <p className="text-xs text-gray-400 mb-4">※当サイトはアフィリエイト広告を掲載しています。価格・仕様は変更される場合があります。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {itemCards.map(p => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-indigo-300 transition-all">
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">{p.tag}</span>
            <p className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1">{p.label}</p>
            <p className="text-xs text-gray-400 mb-3">{p.shop}</p>
            <div className="bg-[#bf0000] text-white text-xs font-bold text-center py-2 rounded-lg">{p.label}を楽天で見る →</div>
          </a>
        ))}
      </div>

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">眼鏡・サングラスを購入する</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {products.map(p => (
          <a key={p.label} href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-red-300 transition-all">
            <p.Icon className="w-8 h-8 text-indigo-700 mb-2" />
            <p className="font-bold text-gray-800 text-sm mb-1">{p.label}</p>
            <div className="mt-2 bg-[#bf0000] text-white text-xs font-bold text-center py-2 rounded-lg">楽天市場で見る →</div>
          </a>
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

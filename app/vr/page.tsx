import { Metadata } from 'next';
import Link from 'next/link';
import { Headset, Glasses, ScanEye, Package, Eye } from 'lucide-react';
import { eyeColumns } from '@/lib/eye-columns';
import { getHeroImage } from '@/lib/unsplash';
import HeroBanner from '@/components/HeroBanner';

const articles = eyeColumns
  .filter(c => c.section === 'vr')
  .map(c => ({ slug: c.slug, title: c.title, desc: c.description, readingTime: c.readingTime }));

export const metadata: Metadata = {
  title: 'VR・スマートグラスの選び方【視力が悪い人の対策・Meta Quest・Ray-Ban Meta】| レンズナビ',
  description: 'VRゴーグルを視力が悪くても快適に使う方法（コンタクト・度付きインサート）、Meta Quest 3・Ray-Ban Meta・Apple Vision Proの最新比較2026年版。',
  keywords: ['VRゴーグル 視力', 'Meta Quest 3', 'スマートグラス おすすめ', 'VR 近視', '度付きインサートレンズ'],
};

const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


const products = [
  { Icon: Headset, label: 'Meta Quest 3', rakuten: 'Meta Quest 3' },
  { Icon: Glasses, label: 'Ray-Ban Meta Smart Glasses', rakuten: 'Ray-Ban Meta' },
  { Icon: ScanEye, label: 'VR度付きインサートレンズ', rakuten: 'VR インサートレンズ' },
  { Icon: Package, label: 'VRメガネスペーサー', rakuten: 'VR メガネスペーサー' },
];

const vrItemCards = [
  { label: 'Hompart VRゴーグル US02-3C77-203', shop: 'Hompart', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622f10a.00c27bf4.5622f10b.e63b1f04/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhompart%2Fus02-3c77-203%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'iDoga コントローラーセット GS-ZYI1-T25V', shop: 'iDoga Gadget', tag: 'アクセサリ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee0c.0230af00.5622ee0d.c8b1b9d6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fidoga-gadget%2Fgs-zyi1-t25v%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjEwMHgxMDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'BoboVR S3 Pro ヘッドストラップ', shop: 'VR Electronics', tag: 'アクセサリ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622edfb.fb2e30e0.5622edfc.afa105c5/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvr-electronicsten%2Fbobovr-s3pro%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Homido Prime VRヘッドセット（セット）', shop: 'iDoga Gadget', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee0c.0230af00.5622ee0d.c8b1b9d6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fidoga-gadget%2Fhomido-prime-deal%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjEwMHgxMDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Homido Prime VRヘッドセット', shop: 'iDoga Gadget', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee0c.0230af00.5622ee0d.c8b1b9d6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fidoga-gadget%2Fhomido-prime%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjEwMHgxMDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Meta Quest（公式ストア）', shop: 'Meta 公式', tag: 'Meta Quest', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ef30.e497d9a3.5622ef31.db809b25/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmeta%2F9089224114424%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Meta Quest 別モデル（公式）', shop: 'Meta 公式', tag: 'Meta Quest', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ef30.e497d9a3.5622ef31.db809b25/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmeta%2F9089224147192%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'ビックカメラ VRヘッドセット（品番：6970214573901）', shop: 'ビックカメラ', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ef0e.8cb27bcc.5622ef0f.7dbedade/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbiccamera%2F6970214573901%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Meta Quest Pro アクセサリ', shop: 'The Arts', tag: 'アクセサリ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ef04.50de429c.5622ef05.12ad6574/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fthe-arts%2Fmeta-pro-rsl%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'ELECOM VRアクセサリ', shop: 'ELECOM', tag: 'アクセサリ', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee81.8194db97.5622ee82.cf9670fe/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Felecom%2F4549550230469%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Yakia VRゴーグル H-VR-C20', shop: 'Yakia', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee5f.ac61384d.5622ee60.d16df839/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fyakia%2Fh-vr-c20%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'HMD Mini VRヘッドセット', shop: 'iDoga Gadget', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee0c.0230af00.5622ee0d.c8b1b9d6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fidoga-gadget%2Fidg-hmd-mini0001%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjEwMHgxMDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Superdeal VRゲームグラス 13414VRGM02R', shop: 'Superdeal', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622ee3d.087aeb05.5622ee3e.19380709/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsuperdeal%2F13414vrgm02r240210%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Relief10 VRヘッドセット B0BSF34R5R', shop: 'Relief10', tag: 'VRゴーグル', url: 'https://hb.afl.rakuten.co.jp/ichiba/5622edf7.cbfb550b.5622edf8.b19a4c20/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frelief10%2Fb0bsf34r5r%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
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

export default async function VRPage() {
  const heroImage = await getHeroImage('vr headset virtual reality');
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">VR・スマートグラス</span>
      </nav>

      {/* Hero */}
      <HeroBanner
        icon={<Headset className="w-9 h-9 text-white" />}
        title="VR・スマートグラス"
        description="視力が悪い方向けのVR対策から最新デバイスの比較まで。Meta Quest・Ray-Ban Meta・Apple Vision Proを徹底解説します。"
        imageUrl={heroImage}
        imageAlt="VRヘッドセット"
        gradient="from-violet-600 to-purple-600"
        borderColor="border-violet-200"
        overlayFrom="from-violet-900/80"
        overlayTo="to-purple-700/60"
      />

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
        <h2 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
          <Eye className="w-5 h-5 flex-shrink-0" />
          視力が悪い方へ：まずコンタクトを検討
        </h2>
        <p className="text-sm text-gray-700 mb-3">
          VRゴーグルをコンタクトレンズ装用で使うのが最もシンプルな解決策です。
          ワンデーコンタクトはVR使用時の衛生面でも安心です。
        </p>
        <Link href="/category/1day" className="inline-block bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors">
          ワンデーコンタクトを比較する →
        </Link>
      </div>

      {/* Specific VR Product Cards */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">おすすめVR機器・アクセサリ</h2>
      <p className="text-xs text-gray-400 mb-4">※当サイトはアフィリエイト広告を掲載しています。価格・仕様は変更される場合があります。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {vrItemCards.map(p => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-violet-300 transition-all">
            <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded font-medium">{p.tag}</span>
            <p className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1">{p.label}</p>
            <p className="text-xs text-gray-400 mb-3">{p.shop}</p>
            <div className="bg-[#bf0000] text-white text-xs font-bold text-center py-2 rounded-lg">{p.label}を楽天で見る →</div>
          </a>
        ))}
      </div>

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">VR・スマートグラスを購入する</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {products.map(p => (
          <a key={p.label} href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-red-300 transition-all">
            <p.Icon className="w-8 h-8 text-violet-700 mb-2" />
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

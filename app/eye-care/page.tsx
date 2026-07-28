import { Metadata } from 'next';
import Link from 'next/link';
import { eyeColumns } from '@/lib/eye-columns';

const articles = eyeColumns
  .filter(c => c.section === 'eye-care')
  .map(c => ({ slug: c.slug, title: c.title, desc: c.description, readingTime: c.readingTime }));

export const metadata: Metadata = {
  title: 'アイケア・目薬の選び方【コンタクト対応・ドライアイ・ルテインサプリ】| レンズナビ',
  description: 'コンタクト用目薬の選び方、ドライアイ対策、ルテイン・アスタキサンチンサプリの効果を解説。防腐剤フリー目薬のおすすめランキングも紹介。',
  keywords: ['ドライアイ 目薬 おすすめ', 'コンタクト 目薬', 'ルテイン サプリ', 'アイケア', '疲れ目 対策'],
};

const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


const products = [
  { emoji: '💧', label: 'コンタクト用目薬', rakuten: 'コンタクト用目薬 防腐剤フリー' },
  { emoji: '👁', label: 'ドライアイ目薬', rakuten: 'ドライアイ 目薬' },
  { emoji: '🌿', label: 'ルテインサプリ', rakuten: 'ルテイン サプリ' },
  { emoji: '🦐', label: 'アスタキサンチンサプリ', rakuten: 'アスタキサンチン サプリ' },
];

const eyeCareCards = [
  { label: 'La Luna アイウォーマー（ホワイト）', shop: 't-pro', tag: 'アイウォーマー', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237ce7.d10b0fe9.56237ce8.0c7596ff/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ft-pro%2Fla_luna_wh%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Bodyplus アイウォーマー 4580657302', shop: 'bodyplus', tag: 'アイウォーマー', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237db3.a916904a.56237db4.bd5b1f1c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbodyplus%2F4580657302%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'RelxEye アイリラクサー RE-001', shop: 'excitech', tag: 'アイリラクサー', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237d7f.33f4cbd3.56237d80.df2babe8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fexcitech%2Frelx-eye-001%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Leapgrow アイウォーマー MT-IRM21', shop: 'leapgrow', tag: 'アイウォーマー', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237d75.6a00e946.56237d76.0969a7c9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fleapgrow%2Fmt-irm21%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'MyGear リリースアイ', shop: 'mygear', tag: '目もとケア', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237d71.e1be5ab2.56237d72.e7946a18/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmygear%2Freleaseeye%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Nissoplus アイウォーマー NP-EEM23', shop: 'nissoplus', tag: 'アイウォーマー', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237d51.c785194a.56237d52.f8562009/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnissoplus%2Fnp-eem23%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
  { label: 'Nissoplus アイリフレッシャー NP-ER23', shop: 'nissoplus', tag: '目もとリラックス', url: 'https://hb.afl.rakuten.co.jp/ichiba/56237d51.c785194a.56237d52.f8562009/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnissoplus%2Fnp-er23%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9' },
];

const faqs = [
  { q: 'コンタクトを付けたまま目薬をさしても大丈夫ですか？', a: 'コンタクトレンズ対応と明記されている目薬であれば装用中に使用できます。パッケージに「コンタクトレンズ装用中に使えます」と記載されているか確認してください。防腐剤（塩化ベンザルコニウム）が含まれる目薬はコンタクト装用中は使用できません。' },
  { q: 'ドライアイに最も効果的な目薬は何ですか？', a: '主成分として「ヒアルロン酸Na」「ポリビニルアルコール」「カルボキシメチルセルロース」を含む目薬が保湿効果に優れています。コンタクト装用者は「ソフトサンティア」「ロートモイストアイ」などの防腐剤フリー目薬がおすすめです。' },
  { q: 'ルテインサプリは目の健康に効果がありますか？', a: 'ルテイン・ゼアキサンチンは加齢黄斑変性や白内障の予防に効果があるとする研究があります（AREDS2研究）。特に40〜50代以降の目の健康維持に有効とされています。ただし、既存の症状を治療する医薬品ではないため、目の異常がある場合は眼科受診が優先です。' },
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

export default function EyeCarePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">アイケア・目薬</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-cyan-950 to-teal-950 border border-cyan-800 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">💊</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">アイケア・目薬</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          コンタクト対応目薬の選び方からドライアイ対策、ルテインサプリまで。
          目の健康を守るためのアイケア情報を網羅します。
        </p>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">アイケア・目薬 ガイド記事</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-cyan-300 transition-all">
            <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded font-medium">アイケア・目薬</span>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1 group-hover:text-cyan-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-cyan-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* Quick tips */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '💧', title: 'コンタクト用目薬', tip: '防腐剤フリーを選ぼう。「コンタクト対応」の表示を必ず確認。' },
          { icon: '🌿', title: 'ルテインサプリ', tip: '1日10mg以上を目安に。食事（ほうれん草等）でも補える。' },
          { icon: '🌡', title: 'ホットアイマスク', tip: '温熱効果でドライアイ・疲れ目を即効ケア。' },
        ].map(t => (
          <div key={t.title} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{t.icon}</div>
            <p className="font-bold text-gray-800 text-sm mb-1">{t.title}</p>
            <p className="text-xs text-gray-500">{t.tip}</p>
          </div>
        ))}
      </div>

      {/* Eye Care Product Cards */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">おすすめアイケアグッズ</h2>
      <p className="text-xs text-gray-400 mb-4">※当サイトはアフィリエイト広告を掲載しています。価格・仕様は変更される場合があります。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {eyeCareCards.map(p => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-cyan-600 transition-all">
            <span className="text-xs bg-cyan-900 text-cyan-100 px-2 py-0.5 rounded font-medium">{p.tag}</span>
            <p className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1">{p.label}</p>
            <p className="text-xs text-gray-400 mb-3">{p.shop}</p>
            <div className="bg-[#bf0000] text-white text-xs font-bold text-center py-2 rounded-lg">{p.label}を楽天で見る →</div>
          </a>
        ))}
      </div>

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">アイケアグッズを購入する</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {products.map(p => (
          <a key={p.label} href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-red-300 transition-all">
            <div className="text-3xl mb-2">{p.emoji}</div>
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

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

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=57plot-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


const products = [
  { emoji: '💧', label: 'コンタクト用目薬', amzn: 'コンタクト 目薬 防腐剤フリー', rakuten: 'コンタクト用目薬 防腐剤フリー' },
  { emoji: '👁', label: 'ドライアイ目薬', amzn: 'ドライアイ 目薬 おすすめ', rakuten: 'ドライアイ 目薬' },
  { emoji: '🌿', label: 'ルテインサプリ', amzn: 'ルテイン サプリ 目 おすすめ', rakuten: 'ルテイン サプリ' },
  { emoji: '🦐', label: 'アスタキサンチンサプリ', amzn: 'アスタキサンチン サプリ 目', rakuten: 'アスタキサンチン サプリ' },
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
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-2xl p-8 mb-10">
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

      {/* Products / Affiliate */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">アイケアグッズを購入する</h2>
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

import { Metadata } from 'next';
import Link from 'next/link';
import { eyeColumns } from '@/lib/eye-columns';

const articles = eyeColumns
  .filter(c => c.section === 'eye-goods')
  .map(c => ({ slug: c.slug, title: c.title, desc: c.description, readingTime: c.readingTime }));

export const metadata: Metadata = {
  title: '目の雑貨・グッズおすすめ【ホットアイマスク・PC目疲れ対策・拡大鏡】| レンズナビ',
  description: 'ホットアイマスク・モニターライト・ブルーライトカット眼鏡など、目を労わるグッズのおすすめランキング。Amazon・楽天で買えるアイケアグッズを厳選紹介。',
  keywords: ['ホットアイマスク おすすめ', '目のグッズ', 'モニターライト おすすめ', 'アイウォーマー', 'PC 目疲れ 対策'],
};

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


const products = [
  { emoji: '♨️', label: 'ホットアイマスク', amzn: 'ホットアイマスク Panasonic', rakuten: 'ホットアイマスク おすすめ' },
  { emoji: '😴', label: '使い捨てアイマスク（めぐりズム等）', amzn: '花王 めぐりズム アイマスク', rakuten: 'めぐりズム アイマスク' },
  { emoji: '💡', label: 'モニターライト（BenQ ScreenBar等）', amzn: 'BenQ ScreenBar モニターライト', rakuten: 'モニターライト デスク' },
  { emoji: '🔍', label: '拡大鏡・ルーペ', amzn: '拡大鏡 ルーペ おすすめ', rakuten: '拡大鏡 ルーペ' },
];

const faqs = [
  { q: 'ホットアイマスクは毎日使っても大丈夫ですか？', a: '適切な温度（40〜45℃程度）であれば毎日使用できます。ただし目に異常感（痛み・充血・かすみ）がある場合は使用を中止し眼科を受診してください。コンタクトレンズは外してから使用してください。' },
  { q: 'ブルーライトカット眼鏡は度なしで効果がありますか？', a: 'ブルーライトをカットする機能自体は度なし眼鏡でも同じです。ただし、目の疲れの原因はブルーライトだけでなく、画面の輝度・距離・姿勢なども影響します。眼鏡だけに頼らず総合的な対策が重要です。' },
  { q: 'モニターライトとデスクライトはどちらがおすすめですか？', a: 'モニターの上に設置するモニターライト（BenQ ScreenBar等）は、画面に反射しない設計で目への負担を軽減します。デスクライトよりも場所を取らず、モニターを正面から照らすため長時間のPC作業に適しています。' },
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

export default function EyeGoodsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">目の雑貨・グッズ</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">🛍️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">目の雑貨・グッズ</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          ホットアイマスク・モニターライト・ブルーライトカット眼鏡など、目を労わるグッズを厳選紹介。
          Amazon・楽天で購入できるおすすめアイテムをまとめました。
        </p>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">目のグッズ ガイド記事</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-orange-300 transition-all">
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium">目の雑貨・グッズ</span>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1 group-hover:text-orange-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-orange-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* Popular items grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { emoji: '♨️', name: 'ホットアイマスク', desc: 'Panasonic・花王など繰り返し使用タイプが人気', amzn: 'ホットアイマスク おすすめ', rakuten: 'ホットアイマスク おすすめ' },
          { emoji: '💡', name: 'モニターライト', desc: 'BenQ ScreenBarが最人気。PC作業の目疲れを軽減', amzn: 'モニターライト BenQ', rakuten: 'モニターライト デスク' },
          { emoji: '🔍', name: '拡大鏡・ルーペ', desc: '細かい作業・読書に。スタンド型・手持ち型を比較', amzn: '拡大鏡 おすすめ', rakuten: '拡大鏡 ルーペ' },
        ].map(item => (
          <div key={item.name} className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-amber-300 transition-all">
            <a href={AMZN(item.amzn)} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block p-5 pb-10 text-center">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="font-bold text-gray-800 text-sm mb-1">{item.name}</p>
              <p className="text-xs text-gray-500 mb-2">{item.desc}</p>
              <p className="text-xs text-amber-700 font-medium">Amazon で購入 →</p>
            </a>
            <a href={RAKUTEN(item.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
              className="absolute bottom-0 left-0 right-0 text-center text-xs text-red-600 hover:text-red-500 border-t border-gray-100 py-2.5 bg-white hover:bg-red-50 transition-colors">
              楽天でも見る
            </a>
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

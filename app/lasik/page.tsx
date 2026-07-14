import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'レーシック・視力矯正の費用・リスク・クリニック選び完全ガイド | レンズナビ',
  description: 'レーシックの費用（両眼15〜30万円）、リスク・副作用、ICLとの違い、クリニック選びのポイントを解説。手術を検討している方向けの総合情報サイト。',
  keywords: ['レーシック 費用', 'レーシック リスク', 'ICL 眼内コンタクト', 'レーシック クリニック選び', '視力矯正 手術'],
};

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

const articles = [
  {
    slug: 'lasik-hiyo-risk',
    title: 'レーシックとは？費用・リスク・メリット・デメリット完全解説【2026年版】',
    desc: '費用相場・リスク・術後のケア・クリニック選びまで、レーシックに関するすべての疑問に答える完全ガイド。',
    readingTime: 10,
  },
  {
    slug: 'icl-to-ha',
    title: 'ICL（眼内コンタクト）とは？レーシックとの違い・費用・向いている人を解説',
    desc: '強度近視・角膜が薄い方に向いているICL手術の仕組み・費用・リスクをレーシックと比較。',
    readingTime: 8,
  },
];

const faqs = [
  { q: 'レーシックの費用はいくらですか？', a: 'クリニックや機器の種類によりますが、両眼で15万〜30万円が一般的な相場です。アマリスレッドやコンツラなど最新機器を使用したプレミアムプランは30万円以上になることもあります。大学病院や有名クリニックでは品質と安全性が高い分、費用も高くなる傾向があります。' },
  { q: 'レーシックのリスクは何がありますか？', a: '主なリスクとして「ドライアイの悪化（最も多い）」「ハロー・グレアの発生（光のにじみ・輪）」「矯正不足・過矯正」「角膜フラップのトラブル」などがあります。重篤な合併症の発生率は1%未満と言われていますが、手術前に十分な検査とリスク理解が必要です。' },
  { q: 'レーシックとICLはどちらがおすすめですか？', a: 'レーシックは手術費用が比較的安く回復が早いメリットがあります。ICLは強度近視や角膜が薄い方に向いており、手術の可逆性（レンズを取り出せる）も大きなメリットです。眼科での精密検査を受けた上で医師と相談して決めましょう。' },
  { q: '手術前にコンタクトレンズは使えますか？', a: '手術前検査の2週間前からソフトコンタクトレンズを外す必要があります（ハードは4週間前）。コンタクトが角膜の形状に影響するためです。手術日まではメガネを使用してください。' },
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

export default function LasikPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">レーシック・視力矯正</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-8 mb-10">
        <div className="text-4xl mb-3">👁️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">レーシック・視力矯正</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
          レーシック・ICL・オルソケラトロジーなど視力矯正手術の費用・リスク・クリニック選びを解説。
          手術を検討している方向けの総合情報サイトです。
        </p>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
          <p className="text-xs text-amber-700">※ 当サイトは医療情報を提供しますが、最終的な判断は必ず眼科専門医にご相談ください。</p>
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">レーシック・視力矯正 ガイド記事</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {articles.map(a => (
          <Link key={a.slug} href={`/column/${a.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-emerald-300 transition-all">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">レーシック・視力矯正</span>
            <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2 mb-1 group-hover:text-emerald-700">{a.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{a.desc}</p>
            <p className="text-xs text-emerald-600 mt-2">{a.readingTime}分で読める →</p>
          </Link>
        ))}
      </div>

      {/* 費用目安表 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">視力矯正手術 費用目安一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-3 border border-gray-200">手術種類</th>
                <th className="text-left p-3 border border-gray-200">費用目安（両眼）</th>
                <th className="text-left p-3 border border-gray-200">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'レーシック（標準）', cost: '15〜20万円', feature: '回復が早い・最もポピュラー' },
                { name: 'レーシック（プレミアム）', cost: '25〜35万円', feature: '最新機器使用・精度が高い' },
                { name: 'ICL（眼内コンタクト）', cost: '50〜70万円', feature: '強度近視・可逆性あり' },
                { name: 'オルソケラトロジー', cost: '年間8〜15万円', feature: '手術なし・就寝中に装用' },
              ].map(r => (
                <tr key={r.name} className="border-b border-gray-100">
                  <td className="p-3 border border-gray-200 font-medium">{r.name}</td>
                  <td className="p-3 border border-gray-200 text-emerald-700 font-bold">{r.cost}</td>
                  <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 費用はクリニック・機器・追加オプションにより大きく異なります。</p>
      </div>

      {/* 手術前のケアグッズ */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">手術前後のアイケアグッズ</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {[
          { label: '防腐剤フリー目薬（術後ケア）', amzn: '目薬 防腐剤フリー', rakuten: '防腐剤フリー 目薬' },
          { label: '保護メガネ（術後使用）', amzn: '保護メガネ 目 手術後', rakuten: '保護ゴーグル 目薬' },
          { label: '眼帯・アイシールド（Amazon）', amzn: '眼帯 手術用', rakuten: '眼帯 手術' },
          { label: 'アイケアサプリ（ルテイン）', amzn: 'ルテイン サプリ 目', rakuten: 'ルテイン サプリ' },
        ].map(p => (
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

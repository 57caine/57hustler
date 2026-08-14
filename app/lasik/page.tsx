import { Metadata } from 'next';
import Link from 'next/link';
import { Stethoscope, Droplet, ShieldCheck, Bandage, Pill } from 'lucide-react';
import { eyeColumns } from '@/lib/eye-columns';
import { getHeroImage } from '@/lib/unsplash';
import HeroBanner from '@/components/HeroBanner';

const articles = eyeColumns
  .filter(c => c.section === 'lasik')
  .map(c => ({ slug: c.slug, title: c.title, desc: c.description, readingTime: c.readingTime }));

export const metadata: Metadata = {
  title: 'レーシック・視力矯正の費用・リスク・クリニック選び完全ガイド | レンズナビ',
  description: 'レーシックの費用（両眼15〜30万円）、リスク・副作用、ICLとの違い、クリニック選びのポイントを解説。手術を検討している方向けの総合情報サイト。',
  keywords: ['レーシック 費用', 'レーシック リスク', 'ICL 眼内コンタクト', 'レーシック クリニック選び', '視力矯正 手術'],
};

const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;


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

export default async function LasikPage() {
  const heroImage = await getHeroImage('eye exam ophthalmology clinic');
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">レーシック・視力矯正</span>
      </nav>

      {/* Hero */}
      <HeroBanner
        icon={<Stethoscope className="w-9 h-9 text-white" />}
        title="レーシック・視力矯正"
        description="レーシック・ICL・オルソケラトロジーなど視力矯正手術の費用・リスク・クリニック選びを解説。手術を検討している方向けの総合情報サイトです。"
        imageUrl={heroImage}
        imageAlt="眼科診療"
        gradient="from-emerald-950 to-teal-950"
        borderColor="border-emerald-800"
        overlayFrom="from-emerald-950/85"
        overlayTo="to-teal-950/70"
        disclaimer={
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
            <p className="text-xs text-amber-700">※ 当サイトは医療情報を提供しますが、最終的な判断は必ず眼科専門医にご相談ください。</p>
          </div>
        }
      />

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
          { Icon: Droplet, label: '防腐剤フリー目薬（術後ケア）', rakuten: '防腐剤フリー 目薬' },
          { Icon: ShieldCheck, label: '保護メガネ（術後使用）', rakuten: '保護ゴーグル 目薬' },
          { Icon: Bandage, label: '眼帯・アイシールド', rakuten: '眼帯 手術' },
          { Icon: Pill, label: 'アイケアサプリ（ルテイン）', rakuten: 'ルテイン サプリ' },
        ].map(p => (
          <a key={p.label} href={RAKUTEN(p.rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-red-300 transition-all">
            <p.Icon className="w-8 h-8 text-emerald-700 mb-2" />
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

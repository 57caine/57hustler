import { Metadata } from 'next';
import Link from 'next/link';
import { schools, formatPrice } from '@/lib/schools';

export const metadata: Metadata = {
  title: 'プログラミングスクール比較表【2025年版・全14校】',
  description: 'プログラミングスクール14校を料金・期間・給付金対応・転職サポートで一覧比較。スクール選びの判断材料としてご活用ください。',
};

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-slate-100 text-slate-700',
  'スキルアップ': 'bg-emerald-50 text-emerald-700',
  'フリーランス特化': 'bg-amber-50 text-amber-700',
  'AI特化': 'bg-violet-50 text-violet-700',
  '独学支援': 'bg-gray-50 text-gray-600',
};

const faqs = [
  {
    q: 'プログラミングスクールの受講料の相場はいくらですか？',
    a: '未経験からの転職を目指す転職特化コースは20〜40万円が一般的です。ただし、教育訓練給付金（専門実践）を利用すると受講料の最大70%が還付されるため、実質負担は8〜12万円程度になる場合もあります。無料・低価格の独学支援型サービスから始める選択肢もあります。',
  },
  {
    q: 'プログラミング未経験でも転職できますか？',
    a: '未経験転職は可能ですが、スクール選びと学習量が重要です。TECH CAMP・DMM WEBCAMPのような転職特化スクールは転職成功率98%前後を公表しており、転職保証制度も設けています。ただし保証には一定の条件（活動期間・応募数など）があるため、事前に確認が必要です。',
  },
  {
    q: '給付金（教育訓練給付金）を使えるスクールはどれですか？',
    a: 'DMM WEBCAMP・侍エンジニア塾・RUNTEQ・CoachTechなどが教育訓練給付金対象コースを設けています。受給には雇用保険への一定期間の加入（一般：1年以上、専門実践：2〜3年以上）とハローワークへの事前申請が必要です。',
  },
  {
    q: 'プログラミングスクールの選び方のポイントは？',
    a: '①転職目的か副業目的かを明確にする ②給付金対象かどうかを確認する ③転職保証の詳細条件（期限・応募数・対象職種）を書面で確認する ④無料体験授業で雰囲気・サポート品質を確認する ⑤卒業後の転職活動サポート期間を確認する、の5点が重要です。',
  },
  {
    q: '転職保証とはどういう制度ですか？',
    a: '転職保証とは「定められた条件を満たして転職活動をしたにもかかわらず内定が得られなかった場合、受講料を全額または一部返金する」制度です。「転職できなければ全額返金」と謳っていても、応募社数・活動期間・対象職種などの条件が細かく設定されています。入学前に書面で詳細条件を確認することが重要です。',
  },
];

export default function ComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">比較表</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">プログラミングスクール比較表</h1>
      <p className="text-gray-500 text-sm mb-2">全{schools.length}校 ・ 2026年5月更新</p>
      <p className="text-gray-600 text-sm mb-8">料金・受講期間・給付金対応・転職サポートの有無を一覧にまとめました。</p>

      {/* Desktop table */}
      <div className="overflow-x-auto mb-10 rounded-xl border border-gray-200">
        <table className="w-full text-sm bg-white">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[140px]">スクール名</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">カテゴリ</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">受講料</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">期間</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">形式</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">給付金</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">転職保証</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, i) => (
              <tr
                key={school.slug}
                className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-slate-50 transition-colors`}
              >
                <td className="px-4 py-3">
                  <Link href={`/schools/${school.slug}`} className="font-medium text-gray-900 hover:text-slate-600 hover:underline">
                    {school.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[school.category] ?? 'bg-gray-50 text-gray-600'}`}>
                    {school.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  {school.price === 0 ? (
                    <span className="text-emerald-700 font-semibold">無料</span>
                  ) : (
                    `${formatPrice(school.price)}〜`
                  )}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 text-xs">{school.period}</td>
                <td className="px-4 py-3 text-center text-gray-600 text-xs">{school.format.join(' / ')}</td>
                <td className="px-4 py-3 text-center">
                  {school.features.includes('給付金対象') ? (
                    <span className="text-emerald-600 font-bold text-base">○</span>
                  ) : (
                    <span className="text-gray-300 text-base">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {school.features.includes('転職保証') ? (
                    <span className="text-emerald-600 font-bold text-base">○</span>
                  ) : (
                    <span className="text-gray-300 text-base">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/schools/${school.slug}`}
                    className="text-xs text-slate-600 border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Situation-based guide */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">状況別・編集部おすすめ</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: '費用を抑えたい',
              body: '給付金を活用すると受講料の最大70%が戻ります。DMM WEBCAMPや侍エンジニア塾が給付金対象で実質負担を大幅に減らせます。',
              link: '/column/teiten-hojo-programming-school',
              linkText: '給付金の詳細を読む',
            },
            {
              label: '確実に転職したい',
              body: 'TECH CAMPやDMM WEBCAMPは転職保証制度を設けています。転職できなければ全額または一部返金される仕組みです。',
              link: '/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96',
              linkText: '転職特化スクールを見る',
            },
            {
              label: 'フリーランスを目指す',
              body: 'CoachTechはフリーランス案件の紹介まで対応。TechBoothも案件獲得サポートに力を入れており、独立を見据えた選択肢です。',
              link: '/category/%E3%83%95%E3%83%AA%E3%83%BC%E3%83%A9%E3%83%B3%E3%82%B9%E7%89%B9%E5%8C%96',
              linkText: 'フリーランス特化スクールを見る',
            },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">{item.label}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{item.body}</p>
              <Link href={item.link} className="text-xs text-slate-600 hover:underline font-medium">{item.linkText} →</Link>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-medium text-slate-700">掲載基準について：</span>
          掲載順は広告費用によるものではありません。カリキュラム内容・サポート体制・受講者の評判を総合的に評価して掲載しています。
          料金は各スクールの主要コースの参考価格です。最新情報は公式サイトでご確認ください。
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">Q: {q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">A: {a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400">
        ※ 当サイトはアフィリエイト広告を掲載しています。リンク経由で申し込まれた場合、当サイトに紹介料が発生することがあります。
      </p>
    </div>
  );
}

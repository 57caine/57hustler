import { Metadata } from 'next';
import Link from 'next/link';
import { schools, formatPrice } from '@/lib/schools';

export const metadata: Metadata = {
  title: 'プログラミングスクール比較表【2025年版・全12校】',
  description: 'プログラミングスクール12校を料金・期間・給付金対応・転職サポートで一覧比較。スクール選びの判断材料としてご活用ください。',
};

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-blue-50 text-blue-700',
  'スキルアップ': 'bg-emerald-50 text-emerald-700',
  'フリーランス特化': 'bg-amber-50 text-amber-700',
  'AI特化': 'bg-violet-50 text-violet-700',
  '独学支援': 'bg-slate-50 text-slate-600',
};

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">比較表</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">プログラミングスクール比較表</h1>
      <p className="text-gray-500 text-sm mb-2">全{schools.length}校 ・ 2025年6月更新</p>
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
                className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors`}
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

      <p className="text-xs text-gray-400">
        ※ 当サイトはアフィリエイト広告を掲載しています。リンク経由で申し込まれた場合、当サイトに紹介料が発生することがあります。
      </p>
    </div>
  );
}

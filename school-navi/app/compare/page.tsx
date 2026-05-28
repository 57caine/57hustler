import { Metadata } from 'next';
import Link from 'next/link';
import { schools, formatPrice } from '@/lib/schools';

export const metadata: Metadata = {
  title: 'プログラミングスクール比較表',
  description: '主要プログラミングスクール8校を料金・転職成功率・期間・給付金対応で一覧比較。スクール選びの参考にどうぞ。',
};

export default function ComparePage() {
  const compareSchools = schools.filter((s) => s.highlight || s.category === '転職特化');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">スクール比較</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">プログラミングスクール比較表</h1>
      <p className="text-gray-600 mb-8">主要スクールを一覧で比較。料金・転職率・給付金対応をまとめました。</p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-3 text-left">スクール名</th>
              <th className="px-4 py-3 text-left">カテゴリ</th>
              <th className="px-4 py-3 text-right">料金</th>
              <th className="px-4 py-3 text-center">期間</th>
              <th className="px-4 py-3 text-center">形式</th>
              <th className="px-4 py-3 text-center">給付金</th>
              <th className="px-4 py-3 text-center">評価</th>
              <th className="px-4 py-3 text-center">詳細</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, i) => (
              <tr key={school.slug} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${school.highlight ? 'ring-1 ring-inset ring-indigo-200' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {school.highlight && <span className="text-yellow-500">⭐</span>}
                    <span className="font-medium text-gray-900">{school.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{school.category}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(school.price)}〜</td>
                <td className="px-4 py-3 text-center text-gray-600">{school.period}</td>
                <td className="px-4 py-3 text-center text-gray-600">{school.format.join('・')}</td>
                <td className="px-4 py-3 text-center">
                  {school.features.includes('給付金対象') ? (
                    <span className="text-green-600 font-bold">◎</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-gray-700">⭐ {school.rating}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/schools/${school.slug}`} className="text-indigo-600 hover:underline text-xs">詳細 →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {[
          { title: '💰 コスパ重視', school: '給付金活用でDMM WEBCAMPが実質13万円〜。転職率98%と高水準。', link: '/schools/dmm-webcamp' },
          { title: '🏆 実績・安心重視', school: 'TECH CAMPは業界最大規模。卒業生5万人以上の実績と転職保証あり。', link: '/schools/techcamp' },
          { title: '🤖 AI・最新技術', school: 'ゼロプラスでPython・機械学習・ChatGPT APIまで学べる。給付金対象。', link: '/schools/zero-plus' },
        ].map((rec) => (
          <Link key={rec.title} href={rec.link} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all">
            <h3 className="font-bold text-gray-900 mb-2">{rec.title}</h3>
            <p className="text-sm text-gray-600">{rec.school}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新の料金・内容は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

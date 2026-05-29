import { Metadata } from 'next';
import Link from 'next/link';
import { courses, formatPrice } from '@/lib/courses';

export const metadata: Metadata = {
  title: '資格通信講座 比較表',
  description: '主要資格通信講座10社を費用・合格率・学習形式・給付金対応で一覧比較。宅建・簿記・FPなど国家資格の講座選びの参考にどうぞ。',
};

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">講座比較</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">資格通信講座 比較表</h1>
      <p className="text-gray-600 mb-8">主要講座を一覧で比較。費用・合格率・給付金対応をまとめました。</p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left">講座名</th>
              <th className="px-4 py-3 text-left">カテゴリ</th>
              <th className="px-4 py-3 text-right">年間費用</th>
              <th className="px-4 py-3 text-left">学習形式</th>
              <th className="px-4 py-3 text-center">給付金</th>
              <th className="px-4 py-3 text-center">詳細</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, i) => (
              <tr key={course.slug} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${course.highlight ? 'ring-1 ring-inset ring-slate-200' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {course.highlight && <span className="w-2 h-2 bg-slate-700 rounded-full shrink-0"></span>}
                    <span className="font-medium text-gray-900">{course.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{course.category}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(course.price)}〜</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{course.format.join('・')}</td>
                <td className="px-4 py-3 text-center">
                  {course.features.includes('給付金対象') ? (
                    <span className="text-emerald-600 font-bold">◎</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/courses/${course.slug}`} className="text-slate-600 hover:underline text-xs">詳細 →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {[
          { title: '費用重視で選ぶなら', desc: 'スタディングが年間14,000円〜と最安水準。スマホ完結で通勤中も学習できます。', link: '/courses/studying' },
          { title: '合格率重視で選ぶなら', desc: 'フォーサイトは宅建合格率70.8%（全国平均の約2倍）。給付金対象コースあり。', link: '/courses/foresight' },
          { title: '手厚いサポートを求めるなら', desc: 'アガルートは合格特典・全額返金保証付き。充実した講義動画と質問サポート。', link: '/courses/agaroot' },
        ].map((rec) => (
          <Link key={rec.title} href={rec.link} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">{rec.title}</h3>
            <p className="text-sm text-gray-600">{rec.desc}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新の料金・内容は各講座公式サイトでご確認ください。
      </p>
    </div>
  );
}

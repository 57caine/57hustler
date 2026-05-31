import { Metadata } from 'next';
import Link from 'next/link';
import { courses, formatPrice } from '@/lib/courses';

export const metadata: Metadata = {
  title: '資格通信講座 比較表【2026年版・16社一覧】',
  description: '主要資格通信講座16社を費用・合格率・学習形式・給付金対応で一覧比較。スタディング・フォーサイト・ユーキャン・資格の大原など人気講座を徹底比較。',
};

const faqs = [
  {
    q: '資格通信講座の費用の相場はいくらですか？',
    a: '資格・コースによって大きく異なりますが、宅建・FP・簿記などの通信講座は1〜10万円程度が多く、社労士・行政書士・中小企業診断士などの難関資格は10〜20万円以上になります。スタディングは最安水準で1〜3万円台、ユーキャンは3〜8万円台が中心です。教育訓練給付金を利用すると費用の20〜70%が還付されます。',
  },
  {
    q: '教育訓練給付金とは何ですか？どの講座で使えますか？',
    a: '教育訓練給付金は、雇用保険に一定期間加入している方が厚生労働大臣指定の教育訓練を修了した場合に受講料の一部（20〜70%）が給付される制度です。「一般教育訓練」は受講費用の20%、「専門実践教育訓練」は最大70%が支給されます。スタディング・フォーサイト・ユーキャン・資格の大原・クレアールなど主要講座の多くが対象です。受講前にハローワークへの申請が必要です。',
  },
  {
    q: '通信講座と独学ではどちらが合格しやすいですか？',
    a: '通信講座を活用すると合格率が大幅に向上するケースが多いです。フォーサイトの宅建講座では合格率が全国平均の約2倍、アガルートでは約3〜5倍に達するとされています。独学は費用を抑えられますが、学習効率・継続率・合格率すべての面で通信講座が有利なことが多く、特に難関資格（社労士・中小企業診断士など）は通信講座の活用を強く推奨します。',
  },
  {
    q: 'スタディングとフォーサイトどちらがおすすめですか？',
    a: 'スタディングは最安水準の価格とスマホ完結学習が強みで、費用を抑えてすきま時間に学習したい方に向いています。フォーサイトは合格率の実績が高く、教材の品質と添削サポートが充実しており、確実に合格したい方向けです。費用重視→スタディング、合格率重視→フォーサイト、が一般的な選び方です。',
  },
  {
    q: '社会人でも働きながら資格取得できますか？',
    a: '可能です。ただし資格の難易度によって必要な学習時間が異なります。FP3級・ITパスポートは100〜200時間程度で3〜6ヶ月、宅建は300〜400時間で6ヶ月〜1年、社労士・行政書士は700〜1000時間で1〜2年が目安です。スタディング・フォーサイトのようなスマホ対応講座を活用することで、通勤・昼休みなどのスキマ時間を学習に充てられます。',
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
                  <div className="flex gap-1.5 justify-center">
                    <Link href={`/courses/${course.slug}`} className="text-slate-600 hover:underline text-xs border border-slate-300 px-2 py-0.5 rounded">詳細</Link>
                    {(course.affiliate_url !== '#' || course.official_url) && (
                      <a
                        href={course.affiliate_url !== '#' ? course.affiliate_url : course.official_url!}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded hover:bg-slate-700 transition-colors"
                      >
                        公式
                      </a>
                    )}
                  </div>
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

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新の料金・内容は各講座公式サイトでご確認ください。
      </p>
    </div>
  );
}

import { Metadata } from 'next';
import { courses, getAllCategories } from '@/lib/courses';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '資格通信講座 一覧【全16社比較・2026年版】| 資格ナビ',
  description: '人気資格通信講座16社を一覧で比較。宅建・簿記・FP・社労士・IT資格・副業資格など国家資格から民間資格まで対応。費用・合格率・学習スタイルで選べます。',
};

const listFaqs = [
  {
    q: '資格通信講座で一番安いのはどこですか？',
    a: 'スタディングが最安値クラスです。宅建は2万円台、簿記3級は3,000円台から受講でき、スマホだけで完結する学習スタイルです。ただし教材のみで個別サポートはないため、自己管理できる方向けです。コスパ重視の方にはスタディングがおすすめです。',
  },
  {
    q: '合格率が高い資格通信講座はどこですか？',
    a: 'フォーサイトとアガルートが合格率の高さで定評があります。フォーサイトは宅建・FP・社労士などで全国平均の2〜3倍の合格率を公表しています。アガルートは司法試験・社労士・中小企業診断士で高い合格実績があります。難関資格ほど講座品質の差が出やすいです。',
  },
  {
    q: '社会人が働きながら取れる資格は何がおすすめですか？',
    a: 'ITパスポート（学習時間100〜200時間）・FP3級（100〜150時間）・日商簿記3級（100〜200時間）は比較的短期間で取得でき、社会人の入門資格として人気があります。年収アップを目指すなら宅建・FP2級・社労士・行政書士など国家資格が有効です。',
  },
];

const categorySlugMap: Record<string, string> = {
  '国家資格': 'kokukaShikaku',
  '転職・就職向け': 'tensyoku',
  '副業・スキルアップ': 'fukugyou',
  'IT資格': 'it',
};

export default function CoursesPage() {
  const categories = getAllCategories();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: listFaqs.map(({ q, a }) => ({
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
        <span className="text-gray-800">講座一覧</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">資格通信講座 一覧</h1>
      <p className="text-gray-600 mb-6">全{courses.length}講座を掲載。費用・合格率・学習スタイルで比較できます。</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/category/${categorySlugMap[cat] ?? encodeURIComponent(cat)}`}
            className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>

      {categories.map((category) => {
        const catCourses = courses.filter((c) => c.category === category);
        const slug = categorySlugMap[category] ?? encodeURIComponent(category);
        return (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{category}</h2>
              <Link
                href={`/category/${slug}`}
                className="text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                {category}をすべて見る →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        );
      })}

      {/* FAQ Section */}
      <section className="mt-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">よくある質問</h2>
        <div className="space-y-4">
          {listFaqs.map(({ q, a }) => (
            <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="font-bold text-gray-900 mb-2">Q. {q}</p>
              <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載料金は参考値です。最新情報は各講座公式サイトでご確認ください。
      </p>
    </div>
  );
}

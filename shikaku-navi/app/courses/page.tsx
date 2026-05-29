import { Metadata } from 'next';
import { courses, getAllCategories } from '@/lib/courses';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '資格通信講座 一覧【全16社比較・2025年版】',
  description: '人気資格通信講座16社を一覧で比較。宅建・簿記・FP・社労士・IT資格・副業資格など国家資格から民間資格まで対応。費用・合格率・学習スタイルで選べます。',
};

const categorySlugMap: Record<string, string> = {
  '国家資格': 'kokukaShikaku',
  '転職・就職向け': 'tensyoku',
  '副業・スキルアップ': 'fukugyou',
  'IT資格': 'it',
};

export default function CoursesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載料金は参考値です。最新情報は各講座公式サイトでご確認ください。
      </p>
    </div>
  );
}

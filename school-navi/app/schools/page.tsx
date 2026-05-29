import { Metadata } from 'next';
import { schools, getAllCategories } from '@/lib/schools';
import SchoolCard from '@/components/SchoolCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プログラミングスクール一覧【2025年版・全12校】',
  description: 'プログラミングスクール12校を一覧で比較。転職特化・スキルアップ・フリーランス特化・AI特化など目的別に検索できます。料金・期間・給付金対応を掲載。',
};

export default function SchoolsPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">スクール一覧</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">プログラミングスクール一覧</h1>
      <p className="text-gray-600 mb-8">全{schools.length}校を掲載。料金・転職成功率・給付金対応で比較できます。</p>

      {categories.map((category) => {
        const catSchools = schools.filter((s) => s.category === category);
        return (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catSchools.map((school) => (
                <SchoolCard key={school.slug} school={school} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載料金は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

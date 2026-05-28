import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { schools, getAllCategories, getSchoolsByCategory } from '@/lib/schools';
import SchoolCard from '@/components/SchoolCard';

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: encodeURIComponent(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: `${decoded}のプログラミングスクール一覧`,
    description: `${decoded}に特化したプログラミングスクールを比較。料金・特徴・転職成功率を一覧で確認できます。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const catSchools = getSchoolsByCategory(decoded);
  if (catSchools.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/schools" className="hover:text-indigo-600">スクール一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{decoded}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{decoded}のプログラミングスクール</h1>
      <p className="text-gray-600 mb-8">{catSchools.length}校掲載。料金・特徴・対象者を比較できます。</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {catSchools.map((school, i) => (
          <SchoolCard key={school.slug} school={school} rank={i + 1} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">他のカテゴリを見る</h2>
        <div className="flex flex-wrap gap-3">
          {getAllCategories().filter((c) => c !== decoded).map((c) => (
            <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

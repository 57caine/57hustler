import { Metadata } from 'next';
import Link from 'next/link';
import { columns } from '@/lib/columns';

export const metadata: Metadata = {
  title: 'プログラミングスクール コラム一覧',
  description: 'プログラミングスクールの選び方・給付金・転職・フリーランスに役立つコラムを掲載。',
};

const categoryColors: Record<string, string> = {
  'スクール比較': 'bg-indigo-100 text-indigo-700',
  '費用・給付金': 'bg-green-100 text-green-700',
  '転職・キャリア': 'bg-blue-100 text-blue-700',
  'AI・最新技術': 'bg-red-100 text-red-700',
};

export default function ColumnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">コラム</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">コラム一覧</h1>
      <p className="text-gray-600 mb-8">スクール選び・転職・給付金に役立つ記事を掲載しています。</p>

      <div className="space-y-4">
        {columns.map((col) => (
          <Link
            key={col.slug}
            href={`/column/${col.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[col.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {col.category}
              </span>
              <span className="text-xs text-gray-400">{col.readingTime}分で読める</span>
            </div>
            <h2 className="font-bold text-gray-800 mb-1 hover:text-indigo-600">{col.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{col.description}</p>
            <p className="text-xs text-gray-400 mt-2">更新: {col.updatedAt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

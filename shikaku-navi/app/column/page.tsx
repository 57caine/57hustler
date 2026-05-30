import { Metadata } from 'next';
import Link from 'next/link';
import { columns } from '@/lib/columns';

export const metadata: Metadata = {
  title: '資格取得コラム 一覧【全18記事】| 資格ナビ',
  description: '資格通信講座の選び方・給付金・転職・副業・IT資格・医療事務など資格取得に役立つ全18記事。宅建独学vs通信比較・FP2級3級の違い・社労士・行政書士・中小企業診断士・ITパスポートなど人気資格の情報を掲載。',
};

const categoryColors: Record<string, string> = {
  '資格比較': 'bg-slate-100 text-slate-700',
  '勉強法・対策': 'bg-emerald-100 text-emerald-700',
  '転職・キャリア': 'bg-slate-100 text-slate-700',
  '費用・給付金': 'bg-emerald-50 text-emerald-700',
  '国家資格': 'bg-purple-50 text-purple-700',
  'IT資格': 'bg-violet-50 text-violet-700',
  '副業・スキルアップ': 'bg-amber-50 text-amber-700',
};

export default function ColumnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">コラム</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">資格取得コラム 一覧</h1>
      <p className="text-gray-500 text-sm mb-1">全{columns.length}記事</p>
      <p className="text-gray-600 mb-8">資格選び・通信講座比較・転職・副業・給付金活用に役立つ情報を掲載しています。</p>

      <div className="space-y-4">
        {columns.map((col) => (
          <Link
            key={col.slug}
            href={`/column/${col.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[col.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {col.category}
              </span>
              <span className="text-xs text-gray-400">{col.readingTime}分で読める</span>
            </div>
            <h2 className="font-bold text-gray-800 mb-1 hover:text-slate-700">{col.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{col.description}</p>
            <p className="text-xs text-gray-400 mt-2">更新: {col.updatedAt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

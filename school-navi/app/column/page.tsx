import { Metadata } from 'next';
import Link from 'next/link';
import { columns } from '@/lib/columns';

export const metadata: Metadata = {
  title: 'プログラミングスクール コラム一覧【全17記事】| スクールナビ',
  description: 'プログラミングスクールの選び方・定額補助・転職保証・給付金・フリーランス・JavaScript・React・AI学習に役立つ全17記事。未経験からの転職、30代・40代・女性向け、Python・Web制作など目的別に解説。',
};

const categoryColors: Record<string, string> = {
  'スクール比較': 'bg-slate-100 text-slate-700',
  '費用・給付金': 'bg-emerald-50 text-emerald-700',
  '転職・キャリア': 'bg-slate-100 text-slate-700',
  '転職・就職': 'bg-slate-100 text-slate-700',
  'AI・最新技術': 'bg-violet-50 text-violet-700',
  '年代別おすすめ': 'bg-amber-50 text-amber-700',
};

export default function ColumnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">コラム</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">プログラミングスクール コラム一覧</h1>
      <p className="text-gray-500 text-sm mb-1">全{columns.length}記事</p>
      <p className="text-gray-600 mb-8">スクール選び・転職保証・定額補助・給付金・フリーランス独立・AI学習に役立つ記事を掲載しています。</p>

      <div className="space-y-4">
        {columns.map((col) => (
          <Link
            key={col.slug}
            href={`/column/${col.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
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

import { Metadata } from 'next';
import Link from 'next/link';
import { columns } from '@/lib/columns';

export const metadata: Metadata = {
  title: 'コンタクトレンズ コラム・ガイド【全20記事】| レンズナビ',
  description: 'コンタクトレンズの度数の見方、初めての選び方、乾きにくい・乱視用・カラコン・2week・マンスリー・長時間装用の選び方まで、購入前に知っておきたい情報を全20記事で解説。',
};

const categoryColors: Record<string, string> = {
  '度数・処方箋': 'bg-purple-100 text-purple-700',
  '購入ガイド': 'bg-emerald-100 text-emerald-700',
  '商品比較': 'bg-slate-100 text-slate-700',
};

export default function ColumnListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">コラム</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">コンタクトレンズ コラム・ガイド</h1>
      <p className="text-gray-500 text-sm mb-1">全{columns.length}記事</p>
      <p className="text-gray-600 mb-8">
        度数の見方、種類の選び方、通販おすすめショップなど、コンタクトレンズに関するお役立ち情報を掲載しています。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {columns.map((column) => (
          <Link key={column.slug} href={`/column/${column.slug}`} className="group block">
            <article className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-200 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[column.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {column.category}
                </span>
                <span className="text-xs text-gray-400">{column.readingTime}分で読める</span>
              </div>
              <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-slate-700 transition-colors">
                {column.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{column.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>更新: {column.updatedAt}</span>
                <span className="text-slate-700 font-medium group-hover:translate-x-1 transition-transform inline-block">続きを読む →</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-slate-50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">最安値で購入する</h2>
        <p className="text-gray-600 text-sm mb-4">
          気になった商品の価格を複数ショップで一括比較。毎日価格を自動更新しています。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ranking" className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
            人気ランキングを見る
          </Link>
          <Link href="/category/1day" className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            ワンデーを比較する
          </Link>
        </div>
      </div>
    </div>
  );
}

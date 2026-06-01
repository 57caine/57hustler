import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ページが見つかりません | スクールナビ',
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ページが見つかりません</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-500 transition-colors"
          >
            トップページへ
          </Link>
          <Link
            href="/schools"
            className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            スクール一覧を見る
          </Link>
        </div>
      </div>
    </main>
  );
}

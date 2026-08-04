import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'ショップナビの運営者情報です。',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">運営者情報</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">運営者情報</h1>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-6 text-gray-600 font-medium w-32">サイト名</th>
              <td className="py-3">ショップナビ（shop.lens-navi.jp）</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-6 text-gray-600 font-medium">運営目的</th>
              <td className="py-3">アイケアグッズを中心としたオンライン販売</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-6 text-gray-600 font-medium">開設</th>
              <td className="py-3">2026年</td>
            </tr>
          </tbody>
        </table>

        <p className="text-xs text-gray-400">
          事業者の詳細情報は<Link href="/tokushoho" className="underline hover:no-underline">特定商取引法に基づく表記</Link>ページをご確認ください。
        </p>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '運営者情報 | レンズナビ',
  description: 'レンズナビの運営者情報です。',
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

      <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">サイト概要</h2>
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium w-32">サイト名</th>
                <td className="py-3">レンズナビ（lens-navi.jp）</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium">URL</th>
                <td className="py-3">https://lens-navi.jp</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium">運営目的</th>
                <td className="py-3">コンタクトレンズ・カラコン・目に関する情報提供および価格比較</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium">開設</th>
                <td className="py-3">2026年</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">サイトの特徴</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>コンタクトレンズ・カラコンの最安値を複数ショップで毎日自動比較</li>
            <li>BC（ベースカーブ）別・カテゴリ別の絞り込み検索</li>
            <li>目に関する専門コラム記事（コンタクト・カラコン・眼鏡・VR・レーシック・アイケア）</li>
            <li>価格はPlaywrightによる自動スクレイピングで定期更新（1日3回）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">免責事項</h2>
          <p>
            当サイトに掲載している価格・情報は、自動取得のため実際と異なる場合があります。
            最新情報・最終確認は各ショップの公式ページにてご確認ください。
            当サイトの情報を利用したことによるいかなる損害についても、運営者は責任を負いません。
          </p>
        </section>
      </div>
    </div>
  );
}

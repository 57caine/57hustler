import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ | レンズナビ',
  description: 'レンズナビへのお問い合わせページです。',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">お問い合わせ</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h1>
      <p className="text-gray-600 text-sm mb-8">
        情報の誤り・リンク切れ・その他ご要望はメールにてご連絡ください。
      </p>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8">
        <p className="text-sm text-sky-800 font-medium mb-2">お問い合わせ先</p>
        <p className="text-sky-700 text-sm">
          メール：<a href="mailto:nsplot.57c@gmail.com" className="underline hover:no-underline">nsplot.57c@gmail.com</a>
        </p>
      </div>

      <div className="space-y-4 text-sm text-gray-600">
        <h2 className="text-base font-bold text-gray-800">よくあるお問い合わせ</h2>
        <details className="border border-gray-200 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
            価格が実際と異なる
          </summary>
          <div className="px-4 pb-4 pt-2 text-gray-600">
            当サイトの価格は自動スクレイピングで定期更新していますが、タイムラグが生じることがあります。
            最新価格は各ショップでご確認ください。明らかな誤りの場合はご連絡ください。
          </div>
        </details>
        <details className="border border-gray-200 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
            リンクが切れている
          </summary>
          <div className="px-4 pb-4 pt-2 text-gray-600">
            ショップの商品URLは変更されることがあります。
            リンク切れを発見した場合はURLと商品名をご連絡いただけると助かります。
          </div>
        </details>
        <details className="border border-gray-200 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
            掲載してほしい商品・情報がある
          </summary>
          <div className="px-4 pb-4 pt-2 text-gray-600">
            商品名・ブランド名・ショップ名をメールにてお送りください。
            掲載の可否は内容によって判断させていただきます。
          </div>
        </details>
      </div>
    </div>
  );
}

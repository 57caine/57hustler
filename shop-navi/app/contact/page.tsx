import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'ショップナビへのお問い合わせページです。',
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
        商品に関するご質問・ご要望はメールにてご連絡ください。
      </p>

      <div className="border border-sky-200 rounded-xl p-6">
        <p className="text-sm text-sky-800 font-medium mb-2">お問い合わせ先</p>
        <p className="text-sky-700 text-sm">
          {/* [要確認] 問い合わせ用メールアドレスが確定次第、差し替えてください */}
          メール：<a href="mailto:nsplot.57c@gmail.com" className="underline hover:no-underline">nsplot.57c@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

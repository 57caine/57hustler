import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | レンズナビ',
  description: 'レンズナビのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">プライバシーポリシー</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">個人情報の取り扱いについて</h2>
          <p>
            レンズナビ（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
            当サイトはお問い合わせフォームを除き、個人情報を収集していません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">アクセス解析ツールについて</h2>
          <p>
            当サイトはアクセス解析のためCookieを使用することがあります。
            Cookieはブラウザの設定から無効化することができます。
            Cookieを無効にしても当サイトのすべてのコンテンツをご利用いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">アフィリエイトプログラムについて</h2>
          <p>
            当サイトはAmazonアソシエイト、楽天アフィリエイト、A8.netなどのアフィリエイトプログラムに参加しています。
            これらのプログラムはCookieを使用して、当サイトからの参照を識別します。
            詳細は<Link href="/disclosure" className="text-sky-600 hover:underline">アフィリエイト表示</Link>をご覧ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">免責事項</h2>
          <p>
            当サイトのコンテンツ・情報は、できる限り正確な情報を提供するよう努めておりますが、
            正確性・安全性を保証するものではありません。
            当サイトの情報を利用したことによって生じたいかなる損害についても、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">プライバシーポリシーの変更</h2>
          <p>
            当サイトは、法令の改正や運営方針の変更に伴い、プライバシーポリシーを予告なく変更することがあります。
            変更後のプライバシーポリシーは、当ページに掲載された時点から効力を生じるものとします。
          </p>
        </section>

        <p className="text-xs text-gray-400">最終更新日：2026年7月</p>
      </div>
    </div>
  );
}

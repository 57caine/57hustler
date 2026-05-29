import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'スクールナビのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">プライバシーポリシー</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-xs text-gray-500 mb-8">最終更新: 2025年6月1日</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. 基本方針</h2>
          <p>
            スクールナビ（nsplot.com、以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、
            以下のプライバシーポリシーを定め、適切な管理・保護に努めます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. 収集する情報</h2>
          <p className="mb-2">当サイトでは、以下の情報を収集することがあります。</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Googleアナリティクスによるアクセス情報（IPアドレス、ブラウザ情報、閲覧ページ等）</li>
            <li>Cookieによる匿名の利用情報</li>
          </ul>
          <p className="mt-2">当サイトは、お問い合わせフォーム等を設置していないため、氏名・メールアドレス等の個人を特定できる情報は収集していません。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. アクセス解析ツール</h2>
          <p>
            当サイトはGoogleアナリティクス（Google Analytics）を使用しています。
            Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
            このデータは匿名で収集されており、個人を特定するものではありません。
            この機能はCookieを無効にすることで収集を拒否できます。詳しくはGoogleアナリティクスのサービス利用規約をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. アフィリエイトプログラム</h2>
          <p>
            当サイトはA8.net等のアフィリエイトプログラムに参加しています。
            アフィリエイトリンクのクリック情報は提携先サービスによって記録されます。
            詳しくは各アフィリエイトサービスのプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. 免責事項</h2>
          <p>
            当サイトからリンクされた外部サイトの内容・プライバシーポリシーについては、当サイトは責任を負いません。
            掲載情報の正確性・完全性については最善を尽くしていますが、保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. ポリシーの変更</h2>
          <p>
            本プライバシーポリシーは予告なく変更される場合があります。
            変更後のポリシーはこのページに掲載した時点で効力を生じるものとします。
          </p>
        </section>
      </div>
    </div>
  );
}

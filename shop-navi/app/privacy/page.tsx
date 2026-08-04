import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'ショップナビのプライバシーポリシーです。',
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

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">個人情報の取り扱いについて</h2>
          <p>
            当サイトでは、商品のご注文・発送手続きのために、お名前・ご住所・電話番号・メールアドレス等の
            個人情報をお預かりします。これらの情報は、注文処理・商品発送・お問い合わせ対応の目的以外には使用しません。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">第三者提供について</h2>
          <p>
            ご注文いただいた商品の発送手続きのため、配送を担う仕入元事業者に対し、
            発送に必要な範囲でお客様の氏名・ご住所・電話番号を提供します。それ以外の目的での第三者提供は行いません。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">決済情報について</h2>
          <p>
            クレジットカード情報は決済代行事業者（Stripe）が管理し、当サイトのサーバーには保存されません。
          </p>
        </section>
        <p className="text-xs text-gray-400">最終更新日：2026年8月</p>
      </div>
    </div>
  );
}

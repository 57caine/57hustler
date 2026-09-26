import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: '運営者情報・免責事項',
  description: `${SITE_NAME}の運営者情報と免責事項です。`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: '運営者情報・免責事項', href: '/about' }]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-8">運営者情報・免責事項</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">サイト概要</h2>
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium w-32">サイト名</th>
                <td className="py-3">{SITE_NAME}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium">運営目的</th>
                <td className="py-3">テーマ別の宿泊施設の比較・案内</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-600 font-medium">開設</th>
                <td className="py-3">2026年</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">アフィリエイトについて</h2>
          <p>
            当サイトは楽天アフィリエイトを利用しています。掲載している予約ボタン・リンクにはアフィリエイトリンクが含まれ、
            リンク先で予約が成立した場合、運営者が紹介料を受け取ることがあります。宿泊料金など、利用者の方のご負担が増えることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">掲載情報について</h2>
          <p>
            宿泊施設の名称・写真・料金・紹介文などは、楽天ウェブサービスの楽天トラベルAPIから自動で取得しています。
            「子連れ向け」「景色・眺望」などの一部の条件は、施設紹介文に含まれるキーワードから判定した目安です。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">免責事項</h2>
          <p>
            掲載している料金・空室状況・施設情報は取得時点のもので、実際と異なる場合があります。
            予約の前に、必ず楽天トラベルの予約ページで最新の内容をご確認ください。
            当サイトの情報を利用したことによるいかなる損害についても、運営者は責任を負いません。
          </p>
        </section>
      </div>
    </div>
  );
}

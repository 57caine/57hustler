import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: 'ショップナビの特定商取引法に基づく表記です。',
};

export default function TokushohoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">特定商取引法に基づく表記</span>
      </nav>

      <div className="border-2 border-red-400 rounded-lg p-4 mb-8 text-sm text-red-700">
        <p className="font-bold mb-1">⚠️ このページは未確定のドラフトです</p>
        <p>
          事業者名・運営統括責任者名・お問い合わせメールアドレスが未確定のため、本ページをNETSEAの審査提出物として使用したり、
          本番公開・決済導線の稼働に使用しないでください。事業形態（個人事業主／法人）が確定し、これらの項目が正式情報に
          差し替わるまでこの警告は残してください。
        </p>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium w-40 align-top">販売業者</th>
            <td className="py-3">[事業者名：確定次第記載]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">運営統括責任者</th>
            <td className="py-3">[氏名：確定次第記載]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">所在地</th>
            <td className="py-3">ご請求をいただいた場合、遅滞なく開示いたします。</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">電話番号</th>
            <td className="py-3">ご請求をいただいた場合、遅滞なく開示いたします。</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">メールアドレス</th>
            {/* [要確認] お問い合わせ用メールアドレスが確定次第、下記を差し替える */}
            <td className="py-3">[メールアドレス：確定次第記載]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">販売価格</th>
            <td className="py-3">各商品ページに記載の価格（税込）</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">商品代金以外の必要料金</th>
            <td className="py-3">送料は仕入先（NETSEA提携先サプライヤー）の規定に準じます。商品ページまたはご注文手続き時に金額を表示します。</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">支払方法</th>
            <td className="py-3">クレジットカード決済（Stripe）※実装予定・現時点では未稼働です</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">支払時期</th>
            <td className="py-3">ご注文確定時にクレジットカード決済が確定します。</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">商品の引渡時期</th>
            {/* [要調整] 仮の日数。NETSEA提携サプライヤーの標準発送目安が確定次第、正式な日数に差し替える */}
            <td className="py-3">ご注文確認後、通常3営業日以内に発送いたします。</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">返品・交換について</th>
            <td className="py-3">仕入先（NETSEA提携先サプライヤー）の返品・交換規定に準じます。</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

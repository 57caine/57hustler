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
          実在の事業者情報が反映されるまで、本ページをNETSEAの審査提出物として使用したり、
          本番公開・決済導線の稼働に使用しないでください。[要確認] の項目はすべて事業者からの
          正式情報の提供が必要です。
        </p>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium w-40 align-top">販売業者</th>
            <td className="py-3">[要確認：事業者名（屋号／会社名）]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">運営統括責任者</th>
            <td className="py-3">[要確認：代表者名]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">所在地</th>
            <td className="py-3">
              [要確認：個人事業主の場合は「請求があれば遅滞なく開示いたします」表記が可能な場合があります。法人の場合は登記住所の記載が必要です。]
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">電話番号</th>
            <td className="py-3">
              [要確認：同上。非公開とする場合も「請求があれば遅滞なく開示」の一文が必要です。]
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">メールアドレス</th>
            <td className="py-3">[要確認：問い合わせ用メールアドレス]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">販売価格</th>
            <td className="py-3">各商品ページに記載の価格（税込）</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">商品代金以外の必要料金</th>
            <td className="py-3">[要確認：送料・振込手数料等の金額または算出方法]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">支払方法</th>
            <td className="py-3">[要確認：クレジットカード等、対応予定の決済手段]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">支払時期</th>
            <td className="py-3">[要確認：例）ご注文確定時にお支払いが確定します]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">商品の引渡時期</th>
            <td className="py-3">[要確認：発送元（サプライヤー）からの標準的な発送目安日数]</td>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-6 text-gray-600 font-medium align-top">返品・交換について</th>
            <td className="py-3">[要確認：無在庫・消費者直送モデルのため、サプライヤーの返品規定に準じます。具体的な条件の確定が必要です。]</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

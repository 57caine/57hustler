import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'アフィリエイト・広告表示 | レンズナビ',
  description: 'レンズナビのアフィリエイト・広告に関する表示です。',
};

export default function DisclosurePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">アフィリエイト表示</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">アフィリエイト・広告表示</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 text-sky-800">
          <p className="font-medium mb-1">広告について</p>
          <p>
            当サイトはアフィリエイト広告プログラムに参加しています。
            商品リンクから購入された場合、当サイトに手数料が発生することがあります。
            コンテンツの内容はアフィリエイト報酬によって偏ることなく、公正・中立な情報提供を心がけています。
          </p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">参加しているアフィリエイトプログラム</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="font-medium text-gray-800 w-32 shrink-0">楽天市場</span>
              <span>楽天アフィリエイト</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-medium text-gray-800 w-32 shrink-0">A8.net</span>
              <span>各コンタクトレンズ・カラコン専門ショップ（レンズアップ、レンズワン、レンズモード 他）</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">価格情報について</h2>
          <p>
            当サイトの価格情報は自動スクレイピングにより定期的に更新しています（1日3回）。
            ただし、タイムラグや取得エラーにより実際と異なる場合があります。
            購入前に必ず各ショップの公式ページで最新価格をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">コンテンツの公正性について</h2>
          <p>
            当サイトのランキング・比較・コラムは、アフィリエイト報酬の高低に左右されず、
            ユーザーにとって有益な情報提供を最優先に作成しています。
            特定のショップ・商品を優遇した掲載順の操作は行いません。
          </p>
        </section>

        <p className="text-xs text-gray-400">最終更新日：2026年7月</p>
      </div>
    </div>
  );
}

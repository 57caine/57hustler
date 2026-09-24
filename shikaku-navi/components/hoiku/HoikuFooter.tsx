import { HOIKU_SITE_NAME } from '@/lib/hoiku/config';

// /hoiku 専用フッター。運営者情報と免責事項をここに集約する
// 資格ナビ本体へのリンクは意図的に置かない
export default function HoikuFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-gray-800 font-bold mb-2">{HOIKU_SITE_NAME}</p>
            <p className="text-sm leading-relaxed">
              保育士向けの転職サービスを比較・紹介する情報サイトです。
            </p>
          </div>
          <div>
            <h2 className="font-medium text-gray-700 mb-3 text-sm">運営者情報</h2>
            <dl className="text-sm grid grid-cols-[6rem_1fr] gap-y-1.5">
              <dt className="text-gray-400">サイト名</dt>
              <dd>{HOIKU_SITE_NAME}</dd>
              {/* TODO: 公開前に運営者名・連絡先を確定して記載する */}
              <dt className="text-gray-400">運営者</dt>
              <dd>【要記入】運営者名</dd>
              <dt className="text-gray-400">お問い合わせ</dt>
              <dd>【要記入】連絡先</dd>
            </dl>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400 space-y-2 leading-relaxed">
          <p>
            【広告について】当サイトはアフィリエイトプログラムに参加しており、掲載している転職サービスへのリンクには広告（アフィリエイトリンク）が含まれます。リンク経由でサービスに登録・利用された場合、当サイトが紹介料を受け取ることがあります。
          </p>
          <p>
            【ランキングについて】掲載順位は当サイト独自の評価基準に基づくものであり、各サービスの優劣を保証するものではありません。
          </p>
          <p>
            【掲載情報について】求人数・対応エリア・サポート内容などは変更される場合があります。最新の情報は各サービスの公式サイトでご確認ください。
          </p>
          <p>© 2026 {HOIKU_SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}

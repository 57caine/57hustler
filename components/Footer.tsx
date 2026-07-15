import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">コンタクトレンズ</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/category/1day" className="hover:text-sky-600 transition-colors">ワンデー比較</Link></li>
              <li><Link href="/category/2week" className="hover:text-sky-600 transition-colors">2ウィーク比較</Link></li>
              <li><Link href="/bc" className="hover:text-sky-600 transition-colors">BCで選ぶ</Link></li>
              <li><Link href="/ranking" className="hover:text-sky-600 transition-colors">人気ランキング</Link></li>
              <li><Link href="/column/bc-to-ha" className="hover:text-sky-600 transition-colors">BCとは？</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">眼鏡・サングラス</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/megane" className="hover:text-sky-600 transition-colors">眼鏡の選び方</Link></li>
              <li><Link href="/column/megane-kaomikata" className="hover:text-sky-600 transition-colors">顔型別フレーム</Link></li>
              <li><Link href="/column/blue-light-megane-kouka" className="hover:text-sky-600 transition-colors">ブルーライトカット</Link></li>
              <li><Link href="/column/megane-online-shopping" className="hover:text-sky-600 transition-colors">オンライン購入</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">VR・スマートグラス</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/vr" className="hover:text-sky-600 transition-colors">VRゴーグル比較</Link></li>
              <li><Link href="/column/vr-shiryoku-warui" className="hover:text-sky-600 transition-colors">視力が悪い人のVR対策</Link></li>
              <li><Link href="/column/smart-glass-2026" className="hover:text-sky-600 transition-colors">スマートグラス2026</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">レーシック</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/lasik" className="hover:text-sky-600 transition-colors">レーシックとは</Link></li>
              <li><Link href="/column/lasik-hiyo-risk" className="hover:text-sky-600 transition-colors">費用・リスク解説</Link></li>
              <li><Link href="/column/icl-to-ha" className="hover:text-sky-600 transition-colors">ICLとの違い</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">アイケア・目薬</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/eye-care" className="hover:text-sky-600 transition-colors">アイケア総合</Link></li>
              <li><Link href="/column/contact-megusuri-erabikata" className="hover:text-sky-600 transition-colors">コンタクト用目薬</Link></li>
              <li><Link href="/column/dryeye-taisaku" className="hover:text-sky-600 transition-colors">ドライアイ対策</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">目のグッズ・情報</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/eye-goods" className="hover:text-sky-600 transition-colors">アイケアグッズ</Link></li>
              <li><Link href="/column/hot-eye-mask-osusume" className="hover:text-sky-600 transition-colors">ホットアイマスク</Link></li>
              <li><Link href="/column/eye-goods-pc" className="hover:text-sky-600 transition-colors">PC目疲れ対策</Link></li>
              <li><Link href="/about" className="hover:text-sky-600 transition-colors">このサイトについて</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-600 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/disclosure" className="hover:text-sky-600 transition-colors">アフィリエイト表示</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-xs text-center text-gray-400">
          <p className="mb-2">
            当サイトはアフィリエイト広告プログラムに参加しています。商品リンクから購入された場合、当サイトに手数料が発生することがあります。
          </p>
          <p>© 2026 レンズナビ (lens-navi.jp). 価格は予告なく変更される場合があります。最新価格は各ショップでご確認ください。</p>
        </div>
      </div>
    </footer>
  );
}

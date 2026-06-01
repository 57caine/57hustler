import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-700 mb-3">種類から探す</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/1day" className="hover:text-sky-600 transition-colors">ワンデー</Link></li>
              <li><Link href="/category/2week" className="hover:text-sky-600 transition-colors">ツーウィーク</Link></li>
              <li><Link href="/category/monthly" className="hover:text-sky-600 transition-colors">マンスリー</Link></li>
              <li><Link href="/category/color" className="hover:text-sky-600 transition-colors">カラコン</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3">ブランドから探す</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brand/acuvue" className="hover:text-sky-600 transition-colors">アキュビュー</Link></li>
              <li><Link href="/brand/alcon" className="hover:text-sky-600 transition-colors">アルコン</Link></li>
              <li><Link href="/brand/seed" className="hover:text-sky-600 transition-colors">シード</Link></li>
              <li><Link href="/brand/menicon" className="hover:text-sky-600 transition-colors">メニコン</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3">コラム</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/column/dosu-mikata" className="hover:text-sky-600 transition-colors">度数の見方・読み方</Link></li>
              <li><Link href="/column/shohosen-nashi-tsuuhan" className="hover:text-sky-600 transition-colors">処方箋なしで通販購入</Link></li>
              <li><Link href="/column/hajimete-erabikata" className="hover:text-sky-600 transition-colors">初めての選び方</Link></li>
              <li><Link href="/column/kanso-shinikui-contact" className="hover:text-sky-600 transition-colors">乾きにくいコンタクト</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-sky-600 transition-colors">このサイトについて</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-600 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/disclosure" className="hover:text-sky-600 transition-colors">アフィリエイト表示</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-sm text-center text-gray-400">
          <p className="mb-2">
            当サイトはアフィリエイト広告プログラムに参加しています。商品リンクから購入された場合、当サイトに手数料が発生することがあります。
          </p>
          <p>© 2026 レンズナビ (lens-navi.jp). 価格は予告なく変更される場合があります。最新価格は各ショップでご確認ください。</p>
        </div>
      </div>
    </footer>
  );
}

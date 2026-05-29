import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-slate-900 text-xs font-bold">S</span>
            </div>
            <span className="text-white font-bold">資格ナビ</span>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            資格通信講座を客観的なデータで比較する情報メディアです。編集部が独自に調査・検証した情報を掲載しています。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-t border-slate-800 pt-8">
          <div>
            <h3 className="font-medium text-slate-300 mb-3 text-sm">カテゴリ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/kokukaShikaku" className="hover:text-white transition-colors">国家資格</Link></li>
              <li><Link href="/category/tensyoku" className="hover:text-white transition-colors">転職・就職向け</Link></li>
              <li><Link href="/category/it" className="hover:text-white transition-colors">IT資格</Link></li>
              <li><Link href="/category/fukugyou" className="hover:text-white transition-colors">副業・スキルアップ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-300 mb-3 text-sm">講座</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses/studying" className="hover:text-white transition-colors">スタディング</Link></li>
              <li><Link href="/courses/foresight" className="hover:text-white transition-colors">フォーサイト</Link></li>
              <li><Link href="/courses/agaroot" className="hover:text-white transition-colors">アガルート</Link></li>
              <li><Link href="/courses/yukiyukan" className="hover:text-white transition-colors">ユーキャン</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">すべて見る</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-300 mb-3 text-sm">コラム</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/column/shikaku-hikaku-online" className="hover:text-white transition-colors">資格通信講座比較</Link></li>
              <li><Link href="/column/takken-tsushin-osusume" className="hover:text-white transition-colors">宅建通信講座おすすめ</Link></li>
              <li><Link href="/column/bookkeeping-school-hikaku" className="hover:text-white transition-colors">簿記講座比較</Link></li>
              <li><Link href="/column" className="hover:text-white transition-colors">すべて見る</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-300 mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs text-slate-600">
          <p className="mb-1">本サイトはアフィリエイト広告プログラムに参加しています。リンク経由でお申し込みいただいた場合、当サイトに紹介料が発生します。掲載内容は編集部が独自に調査したものですが、最新情報は各講座公式サイトでご確認ください。</p>
          <p>© 2025 資格ナビ（shikaku-navi.jp）</p>
        </div>
      </div>
    </footer>
  );
}

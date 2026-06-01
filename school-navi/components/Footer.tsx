import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-sky-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-gray-800 font-bold">スクールナビ</span>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            プログラミングスクールを客観的なデータで比較する情報メディアです。編集部が独自に調査・検証した情報を掲載しています。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-t border-gray-200 pt-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">カテゴリ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96" className="hover:text-sky-600 transition-colors">転職特化</Link></li>
              <li><Link href="/category/%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97" className="hover:text-sky-600 transition-colors">スキルアップ</Link></li>
              <li><Link href="/category/%E3%83%95%E3%83%AA%E3%83%BC%E3%83%A9%E3%83%B3%E3%82%B9%E7%89%B9%E5%8C%96" className="hover:text-sky-600 transition-colors">フリーランス特化</Link></li>
              <li><Link href="/category/AI%E7%89%B9%E5%8C%96" className="hover:text-sky-600 transition-colors">AI特化</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">スクール</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schools/techcamp" className="hover:text-sky-600 transition-colors">TECH CAMP</Link></li>
              <li><Link href="/schools/dmm-webcamp" className="hover:text-sky-600 transition-colors">DMM WEBCAMP</Link></li>
              <li><Link href="/schools/runteq" className="hover:text-sky-600 transition-colors">RUNTEQ</Link></li>
              <li><Link href="/schools/techacademy" className="hover:text-sky-600 transition-colors">TechAcademy</Link></li>
              <li><Link href="/schools" className="hover:text-sky-600 transition-colors">すべて見る</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">コラム</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/column/programming-school-hikaku-2025" className="hover:text-sky-600 transition-colors">スクール比較2025</Link></li>
              <li><Link href="/column/teiten-hojo-programming-school" className="hover:text-sky-600 transition-colors">給付金の活用方法</Link></li>
              <li><Link href="/column/mikeiken-engineer-tenshi" className="hover:text-sky-600 transition-colors">未経験から転職</Link></li>
              <li><Link href="/column" className="hover:text-sky-600 transition-colors">すべて見る</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-sky-600 transition-colors">このサイトについて</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-600 transition-colors">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
          <p className="mb-1">本サイトはアフィリエイト広告プログラムに参加しています。リンク経由でお申し込みいただいた場合、当サイトに紹介料が発生します。掲載内容は編集部が独自に調査したものですが、最新情報は各スクール公式サイトでご確認ください。</p>
          <p>© 2025 スクールナビ（school.lens-navi.jp）</p>
        </div>
      </div>
    </footer>
  );
}

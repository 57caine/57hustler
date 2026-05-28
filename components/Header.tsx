import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👁️</span>
            <div>
              <span className="text-xl font-bold text-blue-600">コンタクト最安値.com</span>
              <p className="text-xs text-gray-500">コンタクトレンズ価格比較サイト</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/category/1day" className="text-gray-600 hover:text-blue-600 transition-colors">
              ワンデー
            </Link>
            <Link href="/category/2week" className="text-gray-600 hover:text-blue-600 transition-colors">
              ツーウィーク
            </Link>
            <Link href="/category/monthly" className="text-gray-600 hover:text-blue-600 transition-colors">
              マンスリー
            </Link>
            <Link href="/category/color" className="text-gray-600 hover:text-blue-600 transition-colors">
              カラコン
            </Link>
            <Link href="/column" className="text-gray-600 hover:text-blue-600 transition-colors">
              コラム
            </Link>
            <Link href="/ranking" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
              人気ランキング
            </Link>
          </nav>
        </div>
        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-3 mt-2 overflow-x-auto pb-1 text-sm">
          <Link href="/category/1day" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">ワンデー</Link>
          <Link href="/category/2week" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">ツーウィーク</Link>
          <Link href="/category/monthly" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">マンスリー</Link>
          <Link href="/category/color" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">カラコン</Link>
          <Link href="/column" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">コラム</Link>
          <Link href="/ranking" className="whitespace-nowrap bg-blue-600 text-white px-3 py-1 rounded-full">ランキング</Link>
        </nav>
      </div>
    </header>
  );
}

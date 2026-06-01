import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sky-600 rounded-md flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <div>
              <span className="text-base font-bold text-gray-900">レンズナビ</span>
              <p className="text-xs text-gray-500 leading-none mt-0.5">コンタクトレンズ価格比較</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/category/1day" className="text-gray-600 hover:text-slate-900 transition-colors">
              ワンデー
            </Link>
            <Link href="/category/2week" className="text-gray-600 hover:text-slate-900 transition-colors">
              ツーウィーク
            </Link>
            <Link href="/category/monthly" className="text-gray-600 hover:text-slate-900 transition-colors">
              マンスリー
            </Link>
            <Link href="/category/color" className="text-gray-600 hover:text-slate-900 transition-colors">
              カラコン
            </Link>
            <Link href="/column" className="text-gray-600 hover:text-slate-900 transition-colors">
              コラム
            </Link>
            <Link href="/ranking" className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors text-sm font-medium">
              人気ランキング
            </Link>
          </nav>
        </div>
        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-2 mt-2 overflow-x-auto pb-1 text-sm">
          <Link href="/category/1day" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-xs">ワンデー</Link>
          <Link href="/category/2week" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-xs">ツーウィーク</Link>
          <Link href="/category/monthly" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-xs">マンスリー</Link>
          <Link href="/category/color" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-xs">カラコン</Link>
          <Link href="/column" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-xs">コラム</Link>
          <Link href="/ranking" className="whitespace-nowrap bg-sky-600 text-white px-3 py-1 rounded-full text-xs">ランキング</Link>
        </nav>
      </div>
    </header>
  );
}

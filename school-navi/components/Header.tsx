import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <div>
              <span className="text-xl font-bold text-indigo-600">スクールナビ</span>
              <p className="text-xs text-gray-500">プログラミングスクール比較</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/schools" className="text-gray-600 hover:text-indigo-600 transition-colors">スクール一覧</Link>
            <Link href="/compare" className="text-gray-600 hover:text-indigo-600 transition-colors">比較する</Link>
            <Link href="/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96" className="text-gray-600 hover:text-indigo-600 transition-colors">転職特化</Link>
            <Link href="/column" className="text-gray-600 hover:text-indigo-600 transition-colors">コラム</Link>
            <Link href="/schools" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
              スクールを探す
            </Link>
          </nav>
        </div>
        <nav className="flex md:hidden items-center gap-3 mt-2 overflow-x-auto pb-1 text-sm">
          <Link href="/schools" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">スクール一覧</Link>
          <Link href="/compare" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">比較する</Link>
          <Link href="/column" className="whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full text-gray-700">コラム</Link>
          <Link href="/schools" className="whitespace-nowrap bg-indigo-600 text-white px-3 py-1 rounded-full">探す</Link>
        </nav>
      </div>
    </header>
  );
}

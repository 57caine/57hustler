import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sky-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">ショップナビ</span>
              <p className="text-xs text-gray-400 leading-none">アイケアグッズ専門ストア</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="text-gray-600 hover:text-slate-900 transition-colors">商品一覧</Link>
            <Link href="/about" className="text-gray-600 hover:text-slate-900 transition-colors">運営者情報</Link>
            <Link href="/contact" className="text-gray-600 hover:text-slate-900 transition-colors">お問い合わせ</Link>
            <Link href="/products" className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-500 transition-colors">
              商品を見る
            </Link>
          </nav>
        </div>
        <nav className="flex md:hidden items-center gap-2 mt-2 overflow-x-auto pb-1 text-sm">
          <Link href="/products" className="whitespace-nowrap border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 text-xs">商品一覧</Link>
          <Link href="/about" className="whitespace-nowrap border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 text-xs">運営者情報</Link>
          <Link href="/contact" className="whitespace-nowrap border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 text-xs">お問い合わせ</Link>
        </nav>
      </div>
    </header>
  );
}

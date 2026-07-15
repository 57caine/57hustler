import Link from 'next/link';

const NAV = [
  { href: '/category/1day', label: 'コンタクト', icon: '👁' },
  { href: '/megane',        label: '眼鏡・サングラス', icon: '👓' },
  { href: '/vr',            label: 'VR・スマートグラス', icon: '🥽' },
  { href: '/lasik',         label: 'レーシック', icon: '✨' },
  { href: '/eye-care',      label: 'アイケア・目薬', icon: '💊' },
  { href: '/eye-goods',     label: '目のグッズ', icon: '🛍' },
];

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">目</span>
            </div>
            <div>
              <span className="text-base font-bold text-gray-900">レンズナビ</span>
              <p className="text-xs text-gray-400 leading-none mt-0.5 hidden sm:block">目のことなら、レンズナビ。</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {NAV.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-sky-700 hover:bg-sky-50 transition-colors whitespace-nowrap text-xs font-medium">
                {l.label}
              </Link>
            ))}
            <Link href="/ranking"
              className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors text-xs font-bold whitespace-nowrap">
              ランキング
            </Link>
          </nav>
        </div>

        {/* Mobile/tablet nav */}
        <nav className="lg:hidden flex items-center gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {NAV.map(l => (
            <Link key={l.href} href={l.href}
              className="shrink-0 whitespace-nowrap bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-gray-700 text-xs font-medium hover:border-sky-300 hover:text-sky-700 transition-colors">
              {l.icon} {l.label}
            </Link>
          ))}
          <Link href="/ranking"
            className="shrink-0 whitespace-nowrap bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            🏆 ランキング
          </Link>
        </nav>
      </div>
    </header>
  );
}

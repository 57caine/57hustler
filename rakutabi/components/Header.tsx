import Link from 'next/link';
import Icon, { LogoMark } from '@/components/Icon';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site-config';

const NAV = [
  { href: '/#themes', label: 'テーマから探す' },
  { href: '/area', label: '地域から探す' },
  { href: '/feature', label: '特集' },
  { href: '/about', label: 'このサイトについて' },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${light ? 'text-white' : 'text-ink'}`}>
      <LogoMark className={`w-9 h-6 ${light ? 'text-white' : 'text-ink'}`} />
      <span className="font-serif text-xl font-bold tracking-wider">{SITE_NAME}</span>
      <span className={`hidden md:inline text-[11px] ml-1 ${light ? 'text-white/70' : 'text-gray-500'}`}>{SITE_TAGLINE}</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="bg-white/95 border-b border-black/5 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink/80">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-season">{n.label}</Link>
          ))}
          <Link href="/search" aria-label="宿を検索" className="hover:text-season">
            <Icon name="search" />
          </Link>
        </nav>
        {/* スマホ：JavaScriptなしで開閉できる details/summary のメニュー */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer p-2 text-ink" aria-label="メニュー">
            <Icon name="menu" className="w-6 h-6" />
          </summary>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 py-2">
            {[...NAV, { href: '/search', label: '宿を検索' }].map((n) => (
              <Link key={n.href} href={n.href} className="block px-4 py-2.5 text-sm text-ink hover:bg-gray-50">{n.label}</Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}

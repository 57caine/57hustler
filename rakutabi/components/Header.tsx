import Link from 'next/link';
import { SITE_NAME } from '@/lib/site-config';

const NAV = [
  { href: '/#themes', label: 'テーマから探す' },
  { href: '/#areas', label: 'エリアから探す' },
  { href: '/#features', label: '特集' },
  { href: '/search', label: '宿を検索' },
];

export default function Header() {
  return (
    <header className="bg-white/95 border-b border-black/5 sticky top-0 z-30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl font-bold text-season tracking-wider">
          {SITE_NAME}
        </Link>
        <nav className="hidden sm:flex gap-5 text-sm text-gray-600">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-season">{n.label}</Link>
          ))}
        </nav>
        <Link href="/search" className="sm:hidden text-sm text-season">検索</Link>
      </div>
    </header>
  );
}

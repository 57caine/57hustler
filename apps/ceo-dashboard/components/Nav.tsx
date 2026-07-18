'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',         label: '📊 ダッシュボード' },
  { href: '/yonaka',   label: '🌙 夜中' },
  { href: '/henkutsu', label: '📦 henkutsu' },
  { href: '/fx',       label: '📈 FX' },
  { href: '/memo',     label: '📝 メモ' },
  { href: '/office',   label: '🏢 オフィス' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 px-4 overflow-x-auto">
      <div className="max-w-2xl mx-auto flex items-center gap-1 h-12 min-w-max">
        <span className="text-sm font-bold mr-3 shrink-0" style={{ color: 'var(--accent)' }}>57hustler</span>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap"
            style={{
              background: path === l.href ? 'var(--accent-dim)' : 'transparent',
              color: path === l.href ? 'var(--accent)' : 'var(--muted)',
            }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

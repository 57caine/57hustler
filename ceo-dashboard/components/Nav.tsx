'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/today',    label: '🎯 TODAY' },
  { href: '/projects', label: '📁 PROJECTS' },
  { href: '/money',    label: '💰 MONEY' },
  { href: '/ai-team',  label: '🤖 AI TEAM' },
  { href: '/pdca',     label: '🔁 PDCA' },
  { href: '/alert',    label: '🚨 ALERT' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 px-4">
      <div className="max-w-2xl mx-auto flex items-center gap-1 h-12 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <span className="text-sm font-bold mr-3 shrink-0" style={{ color: 'var(--accent)' }}>57hustler</span>
        {links.map(l => {
          const active = path === l.href || path.startsWith(`${l.href}/`);
          return (
            <Link key={l.href} href={l.href}
              className="shrink-0 px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap"
              style={{
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
              }}>
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

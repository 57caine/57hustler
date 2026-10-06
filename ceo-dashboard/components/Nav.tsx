'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/logout/actions';

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
      <div className="max-w-2xl mx-auto flex items-center gap-1 h-12">
        <div className="flex items-center gap-1 h-12 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: 'none' }}>
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
        {/* スクロール領域の外に固定配置: リンクが多くてスクロールしても常に見える位置に表示する */}
        <form action={logout} className="shrink-0">
          <button
            type="submit"
            className="shrink-0 px-3 py-1.5 rounded-md text-sm whitespace-nowrap"
            style={{ color: 'var(--muted)' }}
          >
            🚪 ログアウト
          </button>
        </form>
      </div>
    </nav>
  );
}

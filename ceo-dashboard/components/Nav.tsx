'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',           label: '📊 ダッシュ'    },
  { href: '/yonaka',     label: '🌙 夜中'        },
  { href: '/fx',         label: '📈 FX'          },
  { href: '/office',     label: '👔 社員'        },
  { href: '/reports',    label: '📋 レポート'    },
  { href: '/analytics',  label: '📊 Analytics'   },
  { href: '/audit',      label: '🔍 棚卸し'      },
  { href: '/systems',    label: '⚙️ 仕組み'      },
  { href: '/evaluation', label: '🏆 評価'        },
  { href: '/henkutsu',   label: '🌍 henkutsu'   },
  { href: '/memo',       label: '📝 メモ'        },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 px-4">
      <div className="max-w-2xl mx-auto flex items-center gap-1 h-12 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <span className="text-sm font-bold mr-3 shrink-0" style={{ color: 'var(--accent)' }}>57hustler</span>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="shrink-0 px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap"
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

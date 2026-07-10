'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const tabs = [
  { href: '/fx',         label: '📈 チャート' },
  { href: '/fx/journal', label: '📓 日誌' },
  { href: '/fx/risk',    label: '🛡️ リスク計算' },
];

export default function FxLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div>
      <div className="flex gap-1 mb-5 flex-wrap">
        {tabs.map(t => (
          <Link key={t.href} href={t.href}
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{
              background: path === t.href ? 'var(--accent-dim)' : 'var(--surface)',
              color: path === t.href ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${path === t.href ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}

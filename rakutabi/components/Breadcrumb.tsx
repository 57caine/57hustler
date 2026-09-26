import Link from 'next/link';
import { SITE_URL } from '@/lib/site-config';

export interface Crumb {
  name: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const all = [{ name: 'トップ', href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href}`,
    })),
  };
  return (
    <nav className="text-xs text-gray-500 mb-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {all.map((c, i) => (
        <span key={c.href}>
          {i > 0 && <span className="mx-1">›</span>}
          {i === all.length - 1 ? (
            <span className="text-gray-700">{c.name}</span>
          ) : (
            <Link href={c.href} className="hover:text-season">{c.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

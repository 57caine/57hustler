import Link from 'next/link';
import { SITE_NAME, THEMES } from '@/lib/site-config';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 bg-sky-600 rounded-md flex items-center justify-center text-white text-sm font-bold">旅</span>
          <span className="font-bold text-gray-900">{SITE_NAME}</span>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {THEMES.map((t) => (
            <Link key={t.slug} href={`/theme/${t.slug}`} className="hover:text-sky-600">
              {t.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

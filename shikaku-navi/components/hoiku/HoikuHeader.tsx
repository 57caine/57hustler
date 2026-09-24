import Link from 'next/link';
import { HOIKU_SITE_NAME } from '@/lib/hoiku/config';

// /hoiku 専用ヘッダー。資格ナビ本体へのリンクは意図的に置かない（回遊導線を最小限にするため）
const anchors = [
  { href: '#compare', label: '比較表' },
  { href: '#hoikushibank', label: '保育士バンク！' },
  { href: '#ranking', label: 'ランキング' },
  { href: '#cases', label: '目的別' },
];

export default function HoikuHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/hoiku" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sky-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">保</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800 tracking-tight">{HOIKU_SITE_NAME}</span>
              <p className="text-xs text-gray-400 leading-none">保育士の転職サイトを比較</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="text-gray-600 hover:text-sky-700 transition-colors">
                {a.label}
              </a>
            ))}
          </nav>
        </div>
        <nav className="flex md:hidden items-center gap-2 mt-2 overflow-x-auto pb-1">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="whitespace-nowrap border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 text-xs">
              {a.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

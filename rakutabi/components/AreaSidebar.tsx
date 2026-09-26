import Link from 'next/link';
import Icon from '@/components/Icon';
import { AREAS, REGIONS } from '@/lib/site-config';

/** 地域別ページの左側に出すエリア一覧（デザイン案4） */
export default function AreaSidebar({ current }: { current?: string[] }) {
  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-20 bg-white rounded-2xl ring-1 ring-black/5 p-4">
        <p className="flex items-center gap-1 font-bold text-ink text-sm mb-3">
          <Icon name="pin" className="w-4 h-4" />エリア
        </p>
        {REGIONS.map((r) => (
          <div key={r.slug} className="mb-3">
            <Link href={`/region/${r.slug}`} className="text-xs font-bold text-gray-500 hover:text-season">{r.name}</Link>
            <ul className="mt-1 space-y-1">
              {AREAS.filter((a) => a.region === r.slug).map((a) => {
                const on = current?.includes(a.key);
                return (
                  <li key={a.key}>
                    <Link href={`/area/${a.key}`} className={`block text-sm rounded px-2 py-0.5 ${on ? 'bg-season-soft text-ink font-bold' : 'text-ink/80 hover:text-season'}`}>
                      ・{a.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}

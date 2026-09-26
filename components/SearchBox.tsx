'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { SearchItem } from '@/lib/search-index';

const TYPE_LABEL_CLASS: Record<SearchItem['type'], string> = {
  商品: 'bg-sky-100 text-sky-700',
  コラム: 'bg-blue-100 text-blue-700',
  ブランド: 'bg-navy-900/10 text-navy-900',
  カテゴリ: 'bg-sky-100 text-sky-700',
};

function search(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items
    .filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
    .slice(0, limit);
}

type SearchBoxProps = {
  items: SearchItem[];
  autoFocus?: boolean;
};

export default function SearchBox({ items, autoFocus = false }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = search(items, query);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="商品・コラムを検索"
          className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">該当する結果が見つかりませんでした</p>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={() => handleSelect(item.url)}
                    className="flex items-start gap-2 px-4 py-3 no-underline hover:bg-sky-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${TYPE_LABEL_CLASS[item.type]}`}>
                      {item.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{item.title}</span>
                      <span className="block truncate text-xs text-slate-400">{item.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

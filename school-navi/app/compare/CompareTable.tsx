'use client';

import Link from 'next/link';
import { schools, formatPrice, type School } from '@/lib/schools';
import { useState } from 'react';

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-slate-100 text-slate-700',
  'スキルアップ': 'bg-emerald-50 text-emerald-700',
  'フリーランス特化': 'bg-amber-50 text-amber-700',
  'AI特化': 'bg-violet-50 text-violet-700',
  '独学支援': 'bg-gray-50 text-gray-600',
};

type SortKey = 'price' | 'rating' | 'name' | 'none';
type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-gray-300 ml-1">↕</span>;
  return <span className="text-sky-600 ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
}

export default function CompareTable() {
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterCategory, setFilterCategory] = useState('');

  const categories = [...new Set(schools.map((s) => s.category))];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = schools.filter((s) => !filterCategory || s.category === filterCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'none') return 0;
    let diff = 0;
    if (sortKey === 'price') diff = a.price - b.price;
    else if (sortKey === 'rating') diff = a.rating - b.rating;
    else if (sortKey === 'name') diff = a.name.localeCompare(b.name, 'ja');
    return sortDir === 'asc' ? diff : -diff;
  });

  return (
    <>
      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterCategory('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            filterCategory === ''
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-sky-300'
          }`}
        >
          すべて ({schools.length})
        </button>
        {categories.map((cat) => {
          const count = schools.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? '' : cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filterCategory === cat
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-sky-300'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto mb-10 rounded-xl border border-gray-200">
        <table className="w-full text-sm bg-white">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[140px]">
                <button onClick={() => handleSort('name')} className="flex items-center hover:text-slate-900">
                  スクール名<SortIcon active={sortKey === 'name'} dir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">カテゴリ</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                <button onClick={() => handleSort('price')} className="flex items-center justify-end w-full hover:text-slate-900">
                  受講料<SortIcon active={sortKey === 'price'} dir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">期間</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">形式</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">給付金</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">転職保証</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('rating')} className="flex items-center justify-center w-full hover:text-slate-900">
                  評価<SortIcon active={sortKey === 'rating'} dir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((school, i) => (
              <tr
                key={school.slug}
                className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-slate-50 transition-colors`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {school.highlight && (
                      <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded font-medium">おすすめ</span>
                    )}
                    <Link href={`/schools/${school.slug}`} className="font-medium text-gray-900 hover:text-slate-600 hover:underline">
                      {school.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[school.category] ?? 'bg-gray-50 text-gray-600'}`}>
                    {school.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  {school.price === 0 ? (
                    <span className="text-emerald-700 font-semibold">無料</span>
                  ) : (
                    `${formatPrice(school.price)}〜`
                  )}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 text-xs">{school.period}</td>
                <td className="px-4 py-3 text-center text-gray-600 text-xs">{school.format.join(' / ')}</td>
                <td className="px-4 py-3 text-center">
                  {school.features.includes('給付金対象') ? (
                    <span className="text-emerald-600 font-bold text-base">○</span>
                  ) : (
                    <span className="text-gray-300 text-base">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {school.features.includes('転職保証') ? (
                    <span className="text-emerald-600 font-bold text-base">○</span>
                  ) : (
                    <span className="text-gray-300 text-base">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-gray-700 font-medium text-sm">★{school.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs block">({school.reviewCount.toLocaleString()}件)</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1.5 justify-center">
                    <Link
                      href={`/schools/${school.slug}`}
                      className="text-xs text-slate-600 border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      詳細
                    </Link>
                    {(school.affiliate_url !== '#' || school.official_url) && (
                      <a
                        href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-xs bg-sky-600 text-white px-2.5 py-1 rounded hover:bg-sky-500 transition-colors whitespace-nowrap"
                      >
                        公式
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

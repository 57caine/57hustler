'use client';

import { useMemo, useState } from 'react';
import type { HoikuService } from '@/lib/hoiku/services';
import HoikuAffiliateButton from './HoikuAffiliateButton';

// 主要サービス比較サマリー表（全列ソート対応：CLAUDE.md「比較表のソート機能」ルール）
type SortKey = 'rank' | 'name' | 'type' | 'area' | 'support' | 'jobCount';

const columns: { key: SortKey; label: string }[] = [
  { key: 'rank', label: '順位' },
  { key: 'name', label: 'サービス名' },
  { key: 'type', label: 'タイプ' },
  { key: 'area', label: '対応エリア' },
  { key: 'support', label: '主なサポート' },
  { key: 'jobCount', label: '求人数' },
];

export default function HoikuCompareTable({ services }: { services: HoikuService[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const list = [...services];
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), 'ja');
      return asc ? cmp : -cmp;
    });
    return list;
  }, [services, sortKey, asc]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-sky-50 text-gray-700">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-3 text-left font-medium whitespace-nowrap">
                <button type="button" onClick={() => onSort(c.key)} className="inline-flex items-center gap-1 hover:text-sky-700">
                  {c.label}
                  <span className="text-xs text-gray-400">{sortKey === c.key ? (asc ? '▲' : '▼') : '⇅'}</span>
                </button>
              </th>
            ))}
            <th className="px-3 py-3 text-left font-medium whitespace-nowrap">登録</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.slug} className={`border-t border-gray-100 ${s.rank === 1 ? 'bg-amber-50/60' : ''}`}>
              <td className="px-3 py-3 font-bold text-gray-700">{s.rank}位</td>
              <td className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">{s.name}</td>
              <td className="px-3 py-3 whitespace-nowrap">{s.type}</td>
              <td className="px-3 py-3">{s.area}</td>
              <td className="px-3 py-3">{s.support}</td>
              <td className="px-3 py-3 whitespace-nowrap">{s.jobCount}</td>
              <td className="px-3 py-3">
                <HoikuAffiliateButton
                  service={s}
                  label={`${s.name}を見る`}
                  variant={s.rank === 1 ? 'primary' : 'secondary'}
                  size="sm"
                  className="whitespace-nowrap"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

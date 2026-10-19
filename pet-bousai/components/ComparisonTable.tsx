'use client';

import { useMemo, useState } from 'react';

export interface ComparisonRow {
  itemCode: string;
  name: string;
  shopName: string;
  url: string;
  imageUrl: string;
  type: string;
  category: string;
  /** 楽天の検索結果での順番（掲載順） */
  order: number;
}

type SortKey = 'order' | 'name' | 'type' | 'shop';
type SortDir = 'asc' | 'desc';

const COLLATOR = new Intl.Collator('ja');

/**
 * 商品の比較表（全列で並べ替え可能。CLAUDE.md「新しい比較表はすべての列にソート」に対応）。
 * - 価格・在庫・レビューは表示しない（毎日更新しないため・口コミ転載をしないため）
 * - タイプは商品名に含まれる語からの機械的な分類（lib/product-types.ts）
 * - 1商品＝1リンク。リンクには rel="sponsored" と計測用の data 属性（商品ID・位置）を付ける
 */
export default function ComparisonTable({ rows, caption }: { rows: ComparisonRow[]; caption: string }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'order', dir: 'asc' });

  const sorted = useMemo(() => {
    const value = (r: ComparisonRow) =>
      sort.key === 'order' ? r.order : sort.key === 'name' ? r.name : sort.key === 'type' ? r.type : r.shopName;
    const out = [...rows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : COLLATOR.compare(String(va), String(vb));
      return c !== 0 ? c : a.order - b.order;
    });
    return sort.dir === 'asc' ? out : out.reverse();
  }, [rows, sort]);

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const header = (key: SortKey, label: string, className = '') => {
    const active = sort.key === key;
    return (
      <th
        scope="col"
        className={`border-b border-gray-200 px-2 py-2 text-left font-bold ${className}`}
        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <button
          type="button"
          onClick={() => toggle(key)}
          className="inline-flex min-h-[44px] items-center gap-1 text-left underline-offset-2 hover:underline"
          data-sort-key={key}
        >
          {label}
          <span aria-hidden="true" className="text-xs text-gray-500">
            {active ? (sort.dir === 'asc' ? '▲' : '▼') : '⇅'}
          </span>
          <span className="sr-only">で並べ替え</span>
        </button>
      </th>
    );
  };

  return (
    <table className="mt-3 w-full table-fixed border-collapse text-sm" data-comparison-table>
      <caption className="text-left text-xs text-gray-600 leading-relaxed pb-1">{caption}</caption>
      <thead className="bg-gray-50">
        <tr>
          {header('order', '掲載順', 'w-[4.5rem]')}
          {header('name', '商品')}
          {header('type', 'タイプ', 'w-[5.5rem]')}
          {header('shop', 'ショップ', 'w-[5.5rem]')}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.itemCode} className="border-b border-gray-100 align-top">
            <td className="px-2 py-3 text-center text-gray-500">{r.order}</td>
            <td className="px-2 py-3">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                data-affiliate
                data-item-id={r.itemCode}
                data-position="table"
                data-product-name={r.name.slice(0, 100)}
                data-product-category={r.category}
                data-destination="rakuten"
                className="flex flex-col gap-2 text-brand-800"
              >
                {/* 楽天APIが提供する画像URLをそのまま表示する（加工しない） */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.imageUrl} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 rounded bg-gray-50 object-contain" />
                <span className="line-clamp-4 break-all leading-snug underline underline-offset-2">{r.name}</span>
              </a>
            </td>
            <td className="px-2 py-3 break-all">{r.type}</td>
            <td className="px-2 py-3 break-all text-gray-600">{r.shopName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

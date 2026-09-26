import { getAllProductsWithPrices, getAllBrands, getAllCategories } from '@/lib/products';
import { allColumns } from '@/lib/all-columns';

export type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: '商品' | 'コラム' | 'ブランド' | 'カテゴリ';
};

function buildSearchIndex(): SearchItem[] {
  const products: SearchItem[] = getAllProductsWithPrices().map((p) => ({
    title: p.name,
    description: `${p.brandName} / ${p.subcategory || p.category}`,
    url: `/product/${p.slug}`,
    type: '商品',
  }));

  const columns: SearchItem[] = allColumns.map((c) => ({
    title: c.title,
    description: c.description,
    url: `/column/${c.slug}`,
    type: 'コラム',
  }));

  const brands: SearchItem[] = getAllBrands().map((b) => ({
    title: `${b.name}`,
    description: `${b.manufacturer} のコンタクトレンズブランド`,
    url: `/brand/${b.slug}`,
    type: 'ブランド',
  }));

  const categories: SearchItem[] = getAllCategories().map((c) => ({
    title: `${c.name}`,
    description: c.description,
    url: `/category/${c.slug}`,
    type: 'カテゴリ',
  }));

  return [...products, ...columns, ...brands, ...categories];
}

// ビルド時（モジュール読み込み時）に一度だけ計算する。
// 全ページで共通のHeaderから参照されるが、Next.jsのモジュールキャッシュにより
// 同一ビルドプロセス内では再計算されない。
export const SEARCH_INDEX: SearchItem[] = buildSearchIndex();

import { columns, type ColumnMeta } from './columns';
import { eyeColumns, type EyeColumnMeta } from './eye-columns';

export type AnyColumnMeta = ColumnMeta | EyeColumnMeta;

// Eye/new articles first so they appear at the top of listings
export const allColumns: AnyColumnMeta[] = [
  ...eyeColumns,
  ...columns,
];

export function getAnyColumnBySlug(slug: string): AnyColumnMeta | undefined {
  return allColumns.find(c => c.slug === slug);
}

import { columns, type ColumnMeta } from './columns';
import { eyeColumns, eyeColumnContent, type EyeColumnMeta } from './eye-columns';
import { karakonColumns, karakonColumnContent } from './karakon-columns';

export type AnyColumnMeta = ColumnMeta | EyeColumnMeta;

// karakon → eye → contact の順で表示
export const allColumns: AnyColumnMeta[] = [
  ...karakonColumns,
  ...eyeColumns,
  ...columns,
];

export const allColumnContent: Record<string, React.ReactElement> = {
  ...(karakonColumnContent as Record<string, React.ReactElement>),
  ...(eyeColumnContent as Record<string, React.ReactElement>),
};

export function getAnyColumnBySlug(slug: string): AnyColumnMeta | undefined {
  return allColumns.find(c => c.slug === slug);
}

import Icon from '@/components/Icon';
import { THEMES } from '@/lib/site-config';

/** 検索窓の「食事」選択肢（値は絞り込み条件のキー） */
export const MEAL_OPTIONS = [
  { value: 'roomOnly', label: '素泊まり' },
  { value: 'breakfast', label: '朝食付き' },
  { value: 'meal', label: '2食付き' },
] as const;

/** 検索窓（/search へのGETフォーム。JavaScriptなしでも動く）。デザイン案の白いピル型 */
export default function SearchBox({ defaultQuery = '', defaultTheme = '', defaultMeal = '' }: {
  defaultQuery?: string;
  defaultTheme?: string;
  defaultMeal?: string;
}) {
  const select = 'bg-transparent text-sm text-ink outline-none px-2 py-2 sm:border-l sm:border-gray-200';
  return (
    <form action="/search" method="get" className="bg-white rounded-3xl sm:rounded-full shadow-xl p-1.5 pl-5 flex flex-col sm:flex-row sm:items-center gap-1">
      <label className="flex items-center gap-2 flex-1 min-w-0">
        <Icon name="search" className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="行き先・エリア・宿名などを入力"
          className="flex-1 min-w-0 py-2.5 text-ink bg-transparent outline-none placeholder:text-gray-400"
          aria-label="行き先・エリア・宿名"
        />
      </label>
      <div className="flex items-center gap-1 pb-1 sm:pb-0">
        <select name="theme" defaultValue={defaultTheme} className={select} aria-label="テーマ">
          <option value="">テーマ</option>
          {THEMES.map((t) => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>
        <select name="meal" defaultValue={defaultMeal} className={select} aria-label="食事">
          <option value="">食事</option>
          {MEAL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <button type="submit" aria-label="検索" className="ml-auto bg-ink hover:bg-navy text-white rounded-full w-11 h-11 flex items-center justify-center shrink-0">
          <Icon name="search" className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}

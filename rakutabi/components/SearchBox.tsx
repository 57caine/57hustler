import { THEMES } from '@/lib/site-config';

/** 検索窓の「食事」選択肢（値は絞り込み条件のキー） */
export const MEAL_OPTIONS = [
  { value: 'roomOnly', label: '素泊まり' },
  { value: 'breakfast', label: '朝食付き' },
  { value: 'meal', label: '2食付き' },
] as const;

/** 検索窓（/search へのGETフォーム。JavaScriptなしでも動く） */
export default function SearchBox({ defaultQuery = '', defaultTheme = '', defaultMeal = '' }: {
  defaultQuery?: string;
  defaultTheme?: string;
  defaultMeal?: string;
}) {
  return (
    <form action="/search" method="get" className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="エリア・宿名で探す（例：箱根、別府）"
        className="flex-1 px-4 py-3 rounded-xl text-ink bg-transparent outline-none placeholder:text-gray-400"
        aria-label="エリア・宿名"
      />
      <select name="theme" defaultValue={defaultTheme} className="px-3 py-3 rounded-xl text-ink bg-gray-50 outline-none" aria-label="テーマ">
        <option value="">すべてのテーマ</option>
        {THEMES.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>
      <select name="meal" defaultValue={defaultMeal} className="px-3 py-3 rounded-xl text-ink bg-gray-50 outline-none" aria-label="食事">
        <option value="">食事の指定なし</option>
        {MEAL_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <button type="submit" className="bg-cta hover:bg-cta-hover text-white font-bold rounded-xl px-6 py-3">
        検索
      </button>
    </form>
  );
}

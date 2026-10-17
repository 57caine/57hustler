import type { Metadata } from 'next';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import SearchBox, { MEAL_OPTIONS } from '@/components/SearchBox';
import { AREAS, getTheme } from '@/lib/site-config';
import { getAllHotels, searchHotels } from '@/lib/hotels';

export const metadata: Metadata = { title: '宿を検索' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; theme?: string; meal?: string }> }) {
  const { q = '', theme: themeSlug = '', meal: mealKey = '' } = await searchParams;
  const theme = getTheme(themeSlug);
  const base = q.trim() ? searchHotels(q) : getAllHotels();
  const meal = MEAL_OPTIONS.find((m) => m.value === mealKey);
  const hotels = base
    .filter((h) => !theme || h.themes.includes(theme.slug))
    .filter((h) => !meal || h.conditions.includes(meal.value));
  const prefectures = [...new Set(AREAS.map((a) => a.prefecture))];
  const unsupported = q.trim() && !base.length;
  const suggestions = unsupported ? getAllHotels().filter((h) => !theme || h.themes.includes(theme.slug)).filter((h) => !meal || h.conditions.includes(meal.value)).slice(0, 6) : [];
  const heading = [q.trim() && `「${q.trim()}」`, theme?.name, meal?.label].filter(Boolean).join('×') || 'すべての宿';

  return (
    <div>
      <PageHeader crumbs={[{ name: '宿を検索', href: '/search' }]} eyebrow="SEARCH" title={`${heading}の検索結果`}>
        <div className="mt-5 max-w-3xl">
          <SearchBox defaultQuery={q} defaultTheme={theme?.slug ?? ''} defaultMeal={meal?.value ?? ''} />
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="mb-5 text-sm text-gray-600">現在の検索対象は全国すべての宿ではなく、選定した13エリアです。対象地域：{prefectures.join('・')}。掲載外の地域は検索結果に表示されません。</p>
        {hotels.length === 0 && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
            <h2 className="font-bold text-ink">検索対象の宿が見つかりませんでした</h2>
            <p className="text-sm text-gray-600">{unsupported ? '入力した地域・宿名は、現在収録している宿データにありません。実際に宿がないという意味ではありません。' : '選択した条件に合う宿が、現在収録しているデータにありません。条件を減らすと候補が見つかる場合があります。'}</p>
            <a className="inline-block rounded-full border border-ink px-4 py-2 text-sm font-bold text-ink" href="/search">条件を外して探し直す →</a>
          </div>
        )}
        {hotels.length > 0 && <HotelFilterList hotels={hotels} />}
        {suggestions.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-xl text-ink mb-2">ほかの掲載エリアの候補</h2>
            <p className="text-sm text-gray-600 mb-4">検索した地域とは異なります。条件が近い宿を参考として表示しています。</p>
            <HotelFilterList hotels={suggestions} />
          </section>
        )}
      </div>
    </div>
  );
}

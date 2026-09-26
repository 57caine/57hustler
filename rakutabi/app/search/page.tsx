import type { Metadata } from 'next';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import SearchBox, { MEAL_OPTIONS } from '@/components/SearchBox';
import { getTheme } from '@/lib/site-config';
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
  const heading = [q.trim() && `「${q.trim()}」`, theme?.name, meal?.label].filter(Boolean).join('×') || 'すべての宿';

  return (
    <div>
      <PageHeader crumbs={[{ name: '宿を検索', href: '/search' }]} eyebrow="SEARCH" title={`${heading}の検索結果`}>
        <div className="mt-5 max-w-3xl">
          <SearchBox defaultQuery={q} defaultTheme={theme?.slug ?? ''} defaultMeal={meal?.value ?? ''} />
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <HotelFilterList hotels={hotels} />
      </div>
    </div>
  );
}

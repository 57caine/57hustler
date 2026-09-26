import type { Metadata } from 'next';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import SearchBox from '@/components/SearchBox';
import { getTheme } from '@/lib/site-config';
import { getAllHotels, searchHotels } from '@/lib/hotels';

export const metadata: Metadata = { title: '宿を検索' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; theme?: string }> }) {
  const { q = '', theme: themeSlug = '' } = await searchParams;
  const theme = getTheme(themeSlug);
  const base = q.trim() ? searchHotels(q) : getAllHotels();
  const hotels = theme ? base.filter((h) => h.themes.includes(theme.slug)) : base;
  const heading = [q.trim() && `「${q.trim()}」`, theme?.name].filter(Boolean).join('×') || 'すべての宿';

  return (
    <div>
      <PageHeader crumbs={[{ name: '宿を検索', href: '/search' }]} eyebrow="SEARCH" title={`${heading}の検索結果`}>
        <div className="mt-5 max-w-3xl">
          <SearchBox defaultQuery={q} defaultTheme={theme?.slug ?? ''} />
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <HotelFilterList hotels={hotels} />
      </div>
    </div>
  );
}

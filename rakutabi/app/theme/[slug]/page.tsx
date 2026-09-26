import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import { getPhoto } from '@/lib/photos';

import { AREAS, getTheme, THEMES } from '@/lib/site-config';
import { getHotelsByTheme, hasComboPage } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const theme = getTheme((await params).slug);
  if (!theme) return {};
  return { title: `${theme.name}におすすめの宿`, description: theme.lead };
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const theme = getTheme((await params).slug);
  if (!theme) notFound();
  const hotels = getHotelsByTheme(theme.slug);
  const comboAreas = AREAS.filter((a) => hasComboPage(a.key, theme.slug));

  return (
    <div>
      <PageHeader
        photo={getPhoto(`theme-${theme.slug}`)} crumbs={[{ name: theme.name, href: `/theme/${theme.slug}` }]} eyebrow="THEME" title={`${theme.name}におすすめの宿`} lead={theme.lead}>
        {comboAreas.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2">エリア別に見る</p>
            <div className="flex flex-wrap gap-2">
              {comboAreas.map((a) => (
                <Link key={a.key} href={`/area/${a.key}/${theme.slug}`} className="text-sm bg-white rounded-full px-3 py-1 ring-1 ring-black/10 hover:ring-season hover:text-season">
                  {a.name}の{theme.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DataNotice criteria={theme.criteria} />
        <HotelFilterList hotels={hotels} />
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import { getTheme, THEMES } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: theme.name, href: `/theme/${theme.slug}` }]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{theme.name}におすすめの宿</h1>
      <p className="text-gray-600 mb-4">{theme.lead}</p>
      <DataNotice />
      <HotelFilterList hotels={hotels} />
    </div>
  );
}

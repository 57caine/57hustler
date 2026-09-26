import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import { AREA_FEATURES, AREAS, getAreaFeature } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return AREA_FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const feature = getAreaFeature((await params).slug);
  if (!feature) return {};
  return { title: feature.title, description: feature.lead };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const feature = getAreaFeature((await params).slug);
  if (!feature) notFound();
  const hotels = getHotelsByTheme(feature.theme, feature.areaKeys);
  const areaNames = AREAS.filter((a) => feature.areaKeys.includes(a.key)).map((a) => a.name);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: feature.title, href: `/area/${feature.slug}` }]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h1>
      <p className="text-gray-600 mb-2">{feature.lead}</p>
      <p className="text-sm text-gray-500 mb-4">対象エリア：{areaNames.join('・')}</p>
      <DataNotice />
      <HotelFilterList hotels={hotels} />
    </div>
  );
}

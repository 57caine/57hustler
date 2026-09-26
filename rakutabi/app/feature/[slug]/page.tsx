import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import AreaSidebar from '@/components/AreaSidebar';
import { getAreaPhoto } from '@/lib/photos';

import { AREAS, FEATURES, getFeature, getTheme } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const feature = getFeature((await params).slug);
  if (!feature) return {};
  return { title: feature.title, description: feature.lead };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const feature = getFeature((await params).slug);
  if (!feature) notFound();
  const theme = getTheme(feature.theme);
  const hotels = getHotelsByTheme(feature.theme, feature.areaKeys);
  const areas = AREAS.filter((a) => feature.areaKeys.includes(a.key));

  return (
    <div>
      <PageHeader
        photo={getAreaPhoto(feature.areaKeys[0])} crumbs={[{ name: feature.title, href: `/feature/${feature.slug}` }]} eyebrow="FEATURE" title={feature.title} lead={feature.lead}>
        <div className="mt-5 flex flex-wrap gap-2">
          {areas.map((a) => (
            <Link key={a.key} href={`/area/${a.key}`} className="text-sm bg-white rounded-full px-3 py-1 ring-1 ring-black/10 hover:ring-season hover:text-season">
              {a.name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <AreaSidebar current={feature.areaKeys} />
        <div className="flex-1 min-w-0">
        <DataNotice criteria={theme?.criteria} />
        <HotelFilterList hotels={hotels} />
        </div>
      </div>
    </div>
  );
}

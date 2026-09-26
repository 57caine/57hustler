import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import { getRegion, REGIONS } from '@/lib/site-config';
import { getAreasInRegion, getHotelsByArea } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const region = getRegion((await params).region);
  if (!region) return {};
  return { title: `${region.name}の温泉宿・ホテル`, description: region.lead };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const region = getRegion((await params).region);
  if (!region) notFound();
  const areas = getAreasInRegion(region.slug);
  const hotels = getHotelsByArea(areas.map((a) => a.key));

  return (
    <div>
      <PageHeader crumbs={[{ name: region.name, href: `/region/${region.slug}` }]} eyebrow="AREA" title={`${region.name}の温泉宿・ホテル`} lead={region.lead}>
        <div className="mt-5 flex flex-wrap gap-2">
          {areas.map((a) => (
            <Link key={a.key} href={`/area/${a.key}`} className="text-sm bg-white rounded-full px-3 py-1 ring-1 ring-black/10 hover:ring-season hover:text-season">
              {a.name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DataNotice />
        <HotelFilterList hotels={hotels} />
      </div>
    </div>
  );
}

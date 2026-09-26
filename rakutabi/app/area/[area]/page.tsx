import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataNotice from '@/components/DataNotice';
import HotelFilterList from '@/components/HotelFilterList';
import PageHeader from '@/components/PageHeader';
import AreaSidebar from '@/components/AreaSidebar';
import Icon from '@/components/Icon';
import { getAreaPhoto } from '@/lib/photos';

import { AREAS, getArea, getRegion, THEMES } from '@/lib/site-config';
import { getHotelsByArea, getHotelsByTheme, hasComboPage } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const area = getArea((await params).area);
  if (!area) return {};
  return {
    title: `${area.name}（${area.prefecture}）のホテル・旅館`,
    description: `${area.name}の宿を、温泉・子連れ・カップル・一人旅などのテーマ別に比較できます。`,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const area = getArea((await params).area);
  if (!area) notFound();
  const region = getRegion(area.region);
  const hotels = getHotelsByArea([area.key]);
  const combos = THEMES.filter((t) => hasComboPage(area.key, t.slug));

  return (
    <div>
      <PageHeader
        photo={getAreaPhoto(area.key)}
        crumbs={[
          ...(region ? [{ name: region.name, href: `/region/${region.slug}` }] : []),
          { name: area.name, href: `/area/${area.key}` },
        ]}
        eyebrow={area.prefecture}
        title={`${area.name}のホテル・旅館`}
        lead={`${area.name}エリアの宿を、目的別に比較できます。`}
      />
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <AreaSidebar current={[area.key]} />
        <div className="flex-1 min-w-0">
        {combos.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">{area.name}の宿を目的から探す</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {combos.map((t) => (
                <Link key={t.slug} href={`/area/${area.key}/${t.slug}`} className="bg-white rounded-xl ring-1 ring-black/5 p-4 hover:ring-season">
                  <p className="font-serif font-bold text-ink flex items-start gap-2"><Icon name={t.icon} className="w-5 h-5 shrink-0 text-season" />{t.comboTitle(area.name)}</p>
                  <p className="text-xs text-gray-500 mt-1">{getHotelsByTheme(t.slug, [area.key]).length}件</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <DataNotice />
        <HotelFilterList hotels={hotels} showArea={false} />
        </div>
      </div>
    </div>
  );
}

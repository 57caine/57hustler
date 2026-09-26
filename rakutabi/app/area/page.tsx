import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Photo from '@/components/Photo';
import { AREAS, REGIONS } from '@/lib/site-config';
import { getHotelsByArea } from '@/lib/hotels';
import { getAreaPhoto, getPhoto } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'エリアから探す',
  description: '北海道・関東・東海・関西・九州の温泉地・観光地から、楽天トラベル掲載の宿を探せます。',
};

export default function AreaIndexPage() {
  return (
    <div>
      <PageHeader
        photo={getPhoto('region-kanto')}
        crumbs={[{ name: 'エリアから探す', href: '/area' }]}
        eyebrow="AREA"
        title="エリアから探す"
        lead="人気のエリアから、旅行先を見つけてみましょう。"
      />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {REGIONS.map((r) => (
          <section key={r.slug}>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-ink">{r.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{r.lead}</p>
              </div>
              <Link href={`/region/${r.slug}`} className="text-sm text-ink/80 hover:text-season shrink-0">{r.name}の宿をすべて見る ›</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {AREAS.filter((a) => a.region === r.slug).map((a) => (
                <Link key={a.key} href={`/area/${a.key}`} className="group">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                    <Photo photo={getAreaPhoto(a.key)} credit={false} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="font-serif font-bold text-ink mt-2 group-hover:text-season">{a.name}</p>
                  <p className="text-[11px] text-gray-500">{a.prefecture}・{getHotelsByArea([a.key]).length}件</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

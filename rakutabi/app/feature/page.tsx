import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Photo from '@/components/Photo';
import { FEATURES, SEASONAL_FEATURES } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';
import { getAreaPhoto, getPhoto } from '@/lib/photos';

export const metadata: Metadata = {
  title: '特集一覧',
  description: '季節のおすすめ特集と、東京・名古屋・大阪・福岡から行ける温泉宿の特集です。',
};

export default function FeatureIndexPage() {
  return (
    <div>
      <PageHeader
        photo={getPhoto('banner')}
        crumbs={[{ name: '特集一覧', href: '/feature' }]}
        eyebrow="FEATURE"
        title="特集一覧"
        lead="今だからこそ行きたい、旬の旅をご紹介。"
      />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">季節のおすすめ特集</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SEASONAL_FEATURES.map((f) => (
              <Link key={f.season} href={f.href} className="group bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo photo={getPhoto(`season-${f.season}`)} credit={false} className="group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="font-serif text-xl font-bold text-ink">{f.label}｜{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.lead}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">出発地から探す特集</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <Link key={f.slug} href={`/feature/${f.slug}`} className="group relative overflow-hidden rounded-2xl min-h-40 flex items-end">
                <Photo photo={getAreaPhoto(f.areaKeys[0])} overlay credit={false} className="group-hover:scale-105 transition-transform duration-500" />
                <div className="relative p-5 text-white">
                  <p className="font-serif text-xl font-bold drop-shadow">{f.title}</p>
                  <p className="text-xs text-white/90 mt-1">{getHotelsByTheme(f.theme, f.areaKeys).length}件の宿</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

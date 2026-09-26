import Link from 'next/link';
import HotelCard from '@/components/HotelCard';
import { AREA_FEATURES, getAreaFeature, getSeasonalFeature, THEMES, getTheme } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';

export default function Home() {
  const seasonal = getSeasonalFeature();
  // 季節特集のリンク先に応じて、プレビューする宿を選ぶ
  const [, kind, slug] = seasonal.href.split('/');
  const feature = kind === 'area' ? getAreaFeature(slug) : undefined;
  const theme = kind === 'theme' ? getTheme(slug) : undefined;
  const preview = feature
    ? getHotelsByTheme(feature.theme, feature.areaKeys)
    : theme
      ? getHotelsByTheme(theme.slug)
      : [];

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
            旅のテーマから、泊まりたい宿を探そう
          </h1>
          <p className="text-sky-50 mb-8">
            週末旅行・温泉・子連れ・カップル・一人旅。楽天トラベルに掲載中の宿を、テーマ別に比較できます。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THEMES.map((t) => (
              <Link
                key={t.slug}
                href={`/theme/${t.slug}`}
                className="bg-white/95 text-gray-900 rounded-xl px-4 py-4 text-center hover:bg-white shadow-sm"
              >
                <span className="block text-2xl mb-1" aria-hidden>{t.emoji}</span>
                <span className="font-bold text-sm">{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-xs font-medium text-sky-700 mb-1">季節のおすすめ特集</p>
        <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{seasonal.title}</h2>
            <p className="text-sm text-gray-600">{seasonal.lead}</p>
          </div>
          <Link href={seasonal.href} className="text-sm text-sky-700 hover:underline">特集をすべて見る ›</Link>
        </div>
        {preview.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {preview.slice(0, 3).map((h) => <HotelCard key={h.hotelNo} hotel={h} />)}
          </div>
        ) : (
          <p className="text-sm text-gray-500">宿泊施設データの取得後に、ここにおすすめの宿が表示されます。</p>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">地域から探す</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {AREA_FEATURES.map((f) => (
            <Link key={f.slug} href={`/area/${f.slug}`} className="border border-gray-200 rounded-xl p-5 hover:shadow-md bg-white">
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.lead}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

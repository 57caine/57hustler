import Link from 'next/link';
import HotelCard from '@/components/HotelCard';
import SearchBox from '@/components/SearchBox';
import { SectionTitle } from '@/components/ui';
import {
  FEATURES,
  getCurrentSeason,
  REGIONS,
  SEASONAL_FEATURES,
  SITE_CATCH,
  THEMES,
} from '@/lib/site-config';
import { getAreasInRegion, getHotelsByTheme, getHotelsByArea } from '@/lib/hotels';

export default function Home() {
  const season = getCurrentSeason();
  // 今の季節の特集を先頭に、残りの季節を続けて並べる
  const seasonal = [...SEASONAL_FEATURES].sort((a, b) => Number(b.season === season) - Number(a.season === season));
  const pickup = getHotelsByTheme('onsen').filter((h) => (h.reviewCount ?? 0) >= 100).slice(0, 3);

  return (
    <div>
      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-gradient-to-br from-season-hero-from to-season-hero-to">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_35%)]" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-sm">{SITE_CATCH}</h1>
          <p className="text-white/90 mb-10 text-sm md:text-base">
            週末旅行・温泉旅行・子連れ旅行・カップル旅行・一人旅。楽天トラベル掲載の宿を、エリアとテーマから比較できます。
          </p>
          <div className="max-w-3xl mx-auto text-left">
            <SearchBox />
          </div>
        </div>
      </section>

      {/* 人気テーマ */}
      <section id="themes" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-16">
        <SectionTitle eyebrow="THEME" title="人気のテーマから探す" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {THEMES.map((t) => (
            <Link
              key={t.slug}
              href={`/theme/${t.slug}`}
              className="group bg-white rounded-2xl ring-1 ring-black/5 px-4 py-6 text-center hover:ring-season hover:shadow-md transition"
            >
              <span className="block text-3xl mb-2" aria-hidden>{t.icon}</span>
              <span className="font-serif font-bold group-hover:text-season">{t.name}</span>
              <span className="block text-xs text-gray-500 mt-1">{getHotelsByTheme(t.slug).length}件</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 季節のおすすめ特集 */}
      <section id="features" className="bg-white py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle eyebrow="SEASON" title="季節のおすすめ特集" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonal.map((f) => (
              <Link
                key={f.season}
                href={f.href}
                data-season={f.season}
                className="group rounded-2xl overflow-hidden ring-1 ring-black/5 hover:shadow-md transition bg-season-surface"
              >
                <div className="h-28 bg-gradient-to-br from-season-hero-from to-season-hero-to flex items-end p-4">
                  <span className="font-serif text-3xl font-bold text-white drop-shadow">{f.label}</span>
                  {f.season === season && <span className="ml-auto text-xs bg-white/90 text-season rounded-full px-2 py-0.5">いまの季節</span>}
                </div>
                <div className="p-4">
                  <p className="font-serif font-bold text-season">{f.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{f.lead}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {FEATURES.map((f) => (
              <Link key={f.slug} href={`/feature/${f.slug}`} className="rounded-xl bg-season-soft px-4 py-3 text-sm font-medium text-season hover:shadow">
                {f.title} ›
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* エリアから探す */}
      <section id="areas" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-16">
        <SectionTitle eyebrow="AREA" title="エリアから探す" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {REGIONS.map((r) => {
            const areas = getAreasInRegion(r.slug);
            const count = getHotelsByArea(areas.map((a) => a.key)).length;
            return (
              <div key={r.slug} className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
                <Link href={`/region/${r.slug}`} className="font-serif text-lg font-bold hover:text-season">{r.name}</Link>
                <p className="text-xs text-gray-500 mb-3">{count}件</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {areas.map((a) => (
                    <li key={a.key}><Link href={`/area/${a.key}`} className="text-season hover:underline">{a.name}</Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 口コミ評価の高い温泉宿 */}
      {pickup.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-8">
          <SectionTitle eyebrow="PICK UP" title="口コミ評価の高い温泉宿" lead="口コミ100件以上の温泉宿のうち、楽天トラベルの口コミ評価が高い順です。" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pickup.map((h) => <HotelCard key={h.hotelNo} hotel={h} />)}
          </div>
        </section>
      )}
    </div>
  );
}

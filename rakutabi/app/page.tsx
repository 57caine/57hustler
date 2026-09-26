import Link from 'next/link';
import HotelCard from '@/components/HotelCard';
import Icon from '@/components/Icon';
import Photo from '@/components/Photo';
import SearchBox from '@/components/SearchBox';
import { SectionTitle, TravelTopButton } from '@/components/ui';
import { getCurrentSeason, REGIONS, SEASONAL_FEATURES, THEMES } from '@/lib/site-config';
import { getHotelsByTheme } from '@/lib/hotels';
import { getPhoto } from '@/lib/photos';

const SEASON_COLOR: Record<string, string> = {
  spring: 'text-[#e968a5]',
  summer: 'text-[#2e9fd9]',
  autumn: 'text-[#d97706]',
  winter: 'text-[#4a6b8a]',
};

export default function Home() {
  const season = getCurrentSeason();
  const pickup = getHotelsByTheme('onsen').filter((h) => (h.reviewCount ?? 0) >= 100).slice(0, 4);

  return (
    <div>
      {/* ヒーロー */}
      <section className="relative overflow-hidden">
        <Photo photo={getPhoto('hero')} overlay eager />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-28 md:pt-28 md:pb-40 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-snug tracking-widest drop-shadow-lg">
            知らない景色に、<br />会いに行こう。
          </h1>
          <p className="mt-5 text-sm md:text-base leading-relaxed drop-shadow">
            楽天トラベルの人気宿を比較して、<br className="md:hidden" />あなたにぴったりの宿を見つけよう。
          </p>
          <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-4 max-w-4xl">
            <div className="flex-1"><SearchBox /></div>
            <TravelTopButton label="楽天トラベルで予約する" placement="hero" className="self-start px-6 py-3.5 text-sm" />
          </div>
        </div>
        {/* 下端の波 */}
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-10 md:h-16 text-white" aria-hidden>
          <path d="M0 40c240 40 480 40 720 20S1200-10 1440 30v50H0Z" fill="currentColor" />
        </svg>
      </section>

      {/* 人気のテーマ */}
      <section id="themes" className="max-w-6xl mx-auto px-4 py-12 md:py-16 scroll-mt-16">
        <SectionTitle title="人気のテーマから探す" lead="あなたの旅のスタイルに合わせて、ぴったりの宿を見つけましょう。" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {THEMES.map((t) => (
            <Link key={t.slug} href={`/theme/${t.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow text-center">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Photo photo={getPhoto(`theme-${t.slug}`)} credit={false} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative px-3 pb-4 pt-7">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow ring-1 ring-black/5 flex items-center justify-center text-ink">
                  <Icon name={t.icon} className="w-5 h-5" />
                </span>
                <p className="font-serif font-bold text-ink group-hover:text-season">{t.name}</p>
                <p className="text-[11px] text-gray-500 mt-1">{t.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 季節のおすすめ特集 */}
      <section id="features" className="bg-season-surface py-12 md:py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="季節のおすすめ特集" lead="今だからこそ行きたい、旬の旅をご紹介。" more={{ href: '/feature', label: '特集一覧を見る' }} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SEASONAL_FEATURES.map((f) => (
              <Link key={f.season} href={f.href} className="group bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo photo={getPhoto(`season-${f.season}`)} credit={false} className="group-hover:scale-105 transition-transform duration-500" />
                  {f.season === season && (
                    <span className="absolute top-2 left-2 text-[10px] bg-white/95 text-ink rounded-full px-2 py-0.5 font-bold">いまの季節</span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <p className={`font-serif text-2xl font-bold ${SEASON_COLOR[f.season]}`}>{f.label}</p>
                  <p className="text-sm font-bold text-ink mt-1">{f.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* エリアから探す */}
      <section id="areas" className="max-w-6xl mx-auto px-4 py-12 md:py-16 scroll-mt-16">
        <SectionTitle title="エリアから探す" lead="人気のエリアから、旅行先を見つけてみましょう。" more={{ href: '/area', label: 'すべてのエリアを見る' }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGIONS.map((r) => (
            <Link key={r.slug} href={`/region/${r.slug}`} className="group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                <Photo photo={getPhoto(`region-${r.slug}`)} credit={false} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-serif font-bold text-ink mt-2 group-hover:text-season">{r.name}</p>
              <p className="text-[11px] text-gray-500">{r.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* クチコミ評価の高い温泉宿 */}
      {pickup.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
          <SectionTitle title="クチコミ評価の高い温泉宿" lead="クチコミ100件以上の温泉宿のうち、楽天トラベルのクチコミ評価が高い順です。" more={{ href: '/theme/onsen', label: '温泉旅行の宿をもっと見る' }} />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {pickup.map((h) => <HotelCard key={h.hotelNo} hotel={h} />)}
          </div>
        </section>
      )}

      {/* 下部バナー */}
      <section className="relative overflow-hidden">
        <Photo photo={getPhoto('banner')} overlay />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white">
          <div>
            <p className="font-serif text-2xl md:text-4xl font-bold leading-relaxed tracking-widest drop-shadow">
              きっと見つかる、<br />あなたの理想の旅。
            </p>
            <p className="mt-2 text-sm drop-shadow">楽天トラベルで、思い出に残る旅を。</p>
          </div>
          <TravelTopButton label="楽天トラベルで探す" placement="banner" className="self-start md:self-auto px-7 py-3.5" />
        </div>
      </section>
    </div>
  );
}

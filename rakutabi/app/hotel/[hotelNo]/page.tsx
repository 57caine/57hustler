import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import HotelCard from '@/components/HotelCard';
import HotelTabs from '@/components/HotelTabs';
import { FeatureTags, Rating, ReserveButton } from '@/components/ui';
import { getArea, getRegion, THEMES } from '@/lib/site-config';
import {
  formatYen,
  getAllHotels,
  getCheckinDate,
  getFetchedAt,
  getHighlights,
  getHotel,
  getHotelsByArea,
  getReserveUrl,
  hasComboPage,
  isAffiliateUrl,
} from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllHotels().map((h) => ({ hotelNo: String(h.hotelNo) }));
}

export async function generateMetadata({ params }: { params: Promise<{ hotelNo: string }> }): Promise<Metadata> {
  const hotel = getHotel(Number((await params).hotelNo));
  if (!hotel) return {};
  const area = getArea(hotel.areaKey);
  return {
    title: `${hotel.name}の口コミ評価・料金・特徴`,
    description: `${area ? `${area.prefecture}${area.name}の宿、` : ''}${hotel.name}の口コミ評価・料金・プラン・アクセスを楽天トラベルの情報から紹介します。`,
  };
}

export default async function HotelPage({ params }: { params: Promise<{ hotelNo: string }> }) {
  const hotel = getHotel(Number((await params).hotelNo));
  if (!hotel) notFound();
  const area = getArea(hotel.areaKey);
  const region = area ? getRegion(area.region) : undefined;
  const themes = THEMES.filter((t) => hotel.themes.includes(t.slug));
  const fetchedAt = getFetchedAt();
  const checkin = getCheckinDate();
  // アフィリエイトリンクでないURLは出さない（収益にならないリンクを本番に出さないルール）
  const reserveUrl = getReserveUrl(hotel);
  const photos = [
    hotel.imageUrl && { src: hotel.imageUrl, alt: `${hotel.name}の外観` },
    hotel.roomImageUrl && { src: hotel.roomImageUrl, alt: `${hotel.name}の客室` },
  ].filter((p): p is { src: string; alt: string } => Boolean(p));
  const highlights = getHighlights(hotel);
  const nearby = area ? getHotelsByArea([area.key]).filter((h) => h.hotelNo !== hotel.hotelNo).slice(0, 3) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          ...(region ? [{ name: region.name, href: `/region/${region.slug}` }] : []),
          ...(area ? [{ name: area.name, href: `/area/${area.key}` }] : []),
          { name: hotel.name, href: `/hotel/${hotel.hotelNo}` },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8 min-w-0">
          <div>
            {area && <p className="text-sm text-season-accent mb-1">{area.prefecture}・{area.name}</p>}
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Rating average={hotel.reviewAverage} count={hotel.reviewCount} size="lg" />
              <FeatureTags conditions={hotel.conditions} />
            </div>
          </div>

          <Gallery photos={photos} />

          {highlights.length > 0 && (
            <section className="bg-white rounded-2xl ring-1 ring-black/5 p-5 md:p-6">
              <h2 className="text-xl font-bold mb-3">おすすめポイント</h2>
              <ul className="space-y-2 text-sm">
                {highlights.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-season" aria-hidden>●</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-3">※楽天トラベルAPIから取得した情報をもとに記載しています。</p>
            </section>
          )}

          <HotelTabs
            hotelNo={hotel.hotelNo}
            hotelName={hotel.name}
            special={hotel.special}
            access={hotel.access}
            details={hotel.details}
            plans={hotel.plans}
            planUrls={hotel.plans.map((p) => (isAffiliateUrl(p.reserveUrl) ? p.reserveUrl : null))}
            checkinDate={checkin}
            photos={photos}
            ratings={hotel.ratings}
            reviewAverage={hotel.reviewAverage}
            reviewCount={hotel.reviewCount}
            userReview={hotel.userReview}
            reviewUrl={isAffiliateUrl(hotel.reviewUrl) ? hotel.reviewUrl : null}
          />
        </div>

        {/* 予約ボックス */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
            <p className="text-xs text-gray-500">1名あたり最低料金</p>
            <p className="text-3xl font-bold mb-1">{formatYen(hotel.minCharge)}<span className="text-base font-normal">〜</span></p>
            <p className="text-xs text-gray-400 mb-4">
              楽天トラベル掲載の料金
              {fetchedAt && `（${new Date(fetchedAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}時点）`}。
              日程・人数で変わります。
            </p>
            {reserveUrl ? (
              <ReserveButton url={reserveUrl} label={`${hotel.name}の空室・料金を見る`} full hotelNo={hotel.hotelNo} placement="hotel-main" />
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">予約ボタンは準備中です（楽天アフィリエイトIDの設定後に表示されます）。</p>
            )}
          </div>
          {themes.length > 0 && area && (
            <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5 text-sm">
              <p className="font-serif font-bold mb-2">この宿が掲載されている特集</p>
              <ul className="space-y-1">
                {themes.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={hasComboPage(area.key, t.slug) ? `/area/${area.key}/${t.slug}` : `/theme/${t.slug}`}
                      className="text-season hover:underline"
                    >
                      {hasComboPage(area.key, t.slug) ? t.comboTitle(area.name) : `${t.name}におすすめの宿`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {nearby.length > 0 && area && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-4">{area.name}のほかの宿</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((h) => <HotelCard key={h.hotelNo} hotel={h} />)}
          </div>
        </section>
      )}
    </div>
  );
}

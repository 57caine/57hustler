import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { AREAS, CONDITIONS, THEMES } from '@/lib/site-config';
import { formatYen, getAllHotels, getCheckinDate, getFetchedAt, getHotel, isAffiliateUrl } from '@/lib/hotels';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllHotels().map((h) => ({ hotelNo: String(h.hotelNo) }));
}

export async function generateMetadata({ params }: { params: Promise<{ hotelNo: string }> }): Promise<Metadata> {
  const hotel = getHotel(Number((await params).hotelNo));
  if (!hotel) return {};
  const area = AREAS.find((a) => a.key === hotel.areaKey);
  return {
    title: `${hotel.name}の特徴・料金`,
    description: `${area ? `${area.prefecture}${area.name}の宿、` : ''}${hotel.name}の特徴・最低料金・アクセスを紹介します。`,
  };
}

export default async function HotelPage({ params }: { params: Promise<{ hotelNo: string }> }) {
  const hotel = getHotel(Number((await params).hotelNo));
  if (!hotel) notFound();
  const area = AREAS.find((a) => a.key === hotel.areaKey);
  const themes = THEMES.filter((t) => hotel.themes.includes(t.slug));
  const labels = CONDITIONS.filter((c) => hotel.conditions.includes(c.key));
  const fetchedAt = getFetchedAt();
  const checkin = getCheckinDate();
  // アフィリエイトリンクでないURLは出さない（収益にならないリンクを本番に出さないルール）
  const planUrl = isAffiliateUrl(hotel.planListUrl) ? hotel.planListUrl : null;
  const infoUrl = isAffiliateUrl(hotel.informationUrl) ? hotel.informationUrl : null;
  const primaryTheme = themes[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          ...(primaryTheme ? [{ name: primaryTheme.name, href: `/theme/${primaryTheme.slug}` }] : []),
          { name: hotel.name, href: `/hotel/${hotel.hotelNo}` },
        ]}
      />
      {area && <p className="text-sm text-sky-700 mb-1">{area.prefecture}・{area.name}</p>}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{hotel.name}</h1>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {hotel.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.imageUrl} alt={`${hotel.name}の外観`} className="w-full h-60 object-cover rounded-xl" />
        )}
        {hotel.roomImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.roomImageUrl} alt={`${hotel.name}の客室`} className="w-full h-60 object-cover rounded-xl" />
        )}
      </div>

      <section className="border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">基本情報</h2>
        <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
          <dt className="text-gray-500">最低料金</dt>
          <dd><span className="font-bold">{formatYen(hotel.minCharge)}</span>〜（楽天トラベル掲載の1名あたり最低料金）</dd>
          <dt className="text-gray-500">口コミ評価</dt>
          <dd>{hotel.reviewAverage != null ? `${hotel.reviewAverage.toFixed(2)}（${hotel.reviewCount ?? 0}件）` : '—'}</dd>
          <dt className="text-gray-500">住所</dt>
          <dd>{hotel.address || '—'}</dd>
          <dt className="text-gray-500">アクセス</dt>
          <dd>{hotel.access || '—'}</dd>
          {hotel.nearestStation && (
            <>
              <dt className="text-gray-500">最寄り駅</dt>
              <dd>{hotel.nearestStation}</dd>
            </>
          )}
        </dl>
        {labels.length > 0 && (
          <ul className="flex flex-wrap gap-1 mt-4">
            {labels.map((c) => (
              <li key={c.key} className="text-xs bg-sky-50 text-sky-700 rounded px-2 py-0.5">{c.label}</li>
            ))}
          </ul>
        )}
        {fetchedAt && (
          <p className="text-xs text-gray-400 mt-4">
            {new Date(fetchedAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })} 時点の楽天トラベルAPIの情報
            {checkin && `（${checkin}チェックインで空室あり）`}。料金・空室は変動します。
          </p>
        )}
      </section>

      {hotel.special && (
        <section className="mb-6">
          <h2 className="font-bold text-gray-900 mb-2">施設からの紹介</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{hotel.special}</p>
          <p className="text-xs text-gray-400 mt-2">※楽天トラベルに掲載されている施設の紹介文です。</p>
        </section>
      )}

      <section className="bg-sky-50 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">{hotel.name}を予約する</h2>
        {planUrl || infoUrl ? (
          <div className="flex flex-col sm:flex-row gap-3">
            {planUrl && (
              <a
                href={planUrl}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg px-4 py-3"
              >
                {hotel.name}の宿泊プランを楽天トラベルで見る
              </a>
            )}
            {infoUrl && (
              <a
                href={infoUrl}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 text-center border border-sky-600 text-sky-700 font-bold rounded-lg px-4 py-3 bg-white"
              >
                {hotel.name}の施設ページ（楽天トラベル）
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">予約ボタンは準備中です（楽天アフィリエイトIDの設定後に表示されます）。</p>
        )}
      </section>

      {themes.length > 0 && (
        <p className="text-sm text-gray-600">
          この宿が掲載されているテーマ：
          {themes.map((t, i) => (
            <span key={t.slug}>
              {i > 0 && '・'}
              <Link href={`/theme/${t.slug}`} className="text-sky-700 hover:underline">{t.name}</Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

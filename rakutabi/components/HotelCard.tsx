import Link from 'next/link';
import Icon from '@/components/Icon';
import { FeatureTags, Price, Rating, ReserveButton } from '@/components/ui';
import { getArea } from '@/lib/site-config';
import { getReserveUrl, type Hotel } from '@/lib/hotels';

function Location({ hotel }: { hotel: Hotel }) {
  const area = getArea(hotel.areaKey);
  if (!area) return null;
  return (
    <p className="text-xs text-gray-500 flex items-center gap-1">
      <Icon name="pin" className="w-3.5 h-3.5" />
      {area.prefecture}・{area.name}
    </p>
  );
}

// eslint-disable-next-line @next/next/no-img-element
const Img = ({ hotel }: { hotel: Hotel }) => hotel.imageUrl ? <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : null;

/** 宿泊施設カード（縦型）：写真＋名前＋所在地＋評価＋特徴タグ＋価格＋予約ボタン */
export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const href = `/hotel/${hotel.hotelNo}`;
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 flex flex-col hover:shadow-md transition-shadow">
      <Link href={href} className="block aspect-[4/3] bg-tag overflow-hidden">
        <Img hotel={hotel} />
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold leading-snug text-ink">
          <Link href={href} className="hover:text-season">{hotel.name}</Link>
        </h3>
        <Location hotel={hotel} />
        <Rating average={hotel.reviewAverage} count={hotel.reviewCount} />
        <FeatureTags conditions={hotel.conditions} limit={3} />
        <div className="mt-auto pt-2 space-y-2">
          <Price value={hotel.minCharge} />
          <ReserveButton url={getReserveUrl(hotel)} label="楽天トラベルで見る" fallbackHref={href} hotelNo={hotel.hotelNo} placement="card" size="sm" />
        </div>
      </div>
    </article>
  );
}

/** 宿泊施設カード（横型・一覧ページ用）：左に写真、右に情報 */
export function HotelRow({ hotel }: { hotel: Hotel }) {
  const href = `/hotel/${hotel.hotelNo}`;
  return (
    <article className="group bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow flex">
      <Link href={href} className="block w-[42%] sm:w-64 shrink-0 bg-tag overflow-hidden min-h-40">
        <Img hotel={hotel} />
      </Link>
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="font-bold leading-snug text-ink text-[15px] sm:text-base">
          <Link href={href} className="hover:text-season">{hotel.name}</Link>
        </h3>
        <Location hotel={hotel} />
        <Rating average={hotel.reviewAverage} count={hotel.reviewCount} />
        <FeatureTags conditions={hotel.conditions} limit={3} />
        <div className="mt-auto pt-1 flex flex-wrap items-end justify-between gap-2">
          <Price value={hotel.minCharge} />
          <ReserveButton url={getReserveUrl(hotel)} label="楽天トラベルで見る" fallbackHref={href} hotelNo={hotel.hotelNo} placement="card" size="sm" />
        </div>
      </div>
    </article>
  );
}

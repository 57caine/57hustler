import Link from 'next/link';
import Icon from '@/components/Icon';
import { FeatureTags, Price, Rating, ReserveButton } from '@/components/ui';
import { getArea } from '@/lib/site-config';
import { getFetchedAt, getReserveUrl, type Hotel } from '@/lib/hotels';

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

/** 縦型・横型で共通の料金案内と送客導線。 */
function Booking({ hotel }: { hotel: Hotel }) {
  const fetchedAt = getFetchedAt();
  const at = fetchedAt ? new Date(fetchedAt) : null;
  return (
    <div className="mt-auto pt-2 space-y-2">
      <Price value={hotel.minCharge} />
      {at && Number.isFinite(at.getTime()) && (
        <p className="text-[11px] text-gray-500">
          楽天トラベルAPI・{at.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}（日本時間）取得
        </p>
      )}
      <p className="text-xs text-gray-600">※最新の宿泊料金は楽天トラベルで確認</p>
      <ReserveButton url={getReserveUrl(hotel)} label="楽天トラベルで料金・空室を確認" fallbackHref={`/hotel/${hotel.hotelNo}`} hotelNo={hotel.hotelNo} placement="card" size="sm" className="w-full" />
    </div>
  );
}

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
        <Booking hotel={hotel} />
      </div>
    </article>
  );
}

/** 宿泊施設カード（横型・一覧ページ用）：左に写真、右に情報 */
export function HotelRow({ hotel }: { hotel: Hotel }) {
  const href = `/hotel/${hotel.hotelNo}`;
  return (
    <article className="group bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
      <Link href={href} className="block w-full aspect-[4/3] sm:aspect-auto sm:w-[38%] shrink-0 bg-tag overflow-hidden min-h-40">
        <Img hotel={hotel} />
      </Link>
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="font-bold leading-snug text-ink text-[15px] sm:text-base">
          <Link href={href} className="hover:text-season">{hotel.name}</Link>
        </h3>
        <Location hotel={hotel} />
        <Rating average={hotel.reviewAverage} count={hotel.reviewCount} />
        <FeatureTags conditions={hotel.conditions} limit={3} />
        <Booking hotel={hotel} />
      </div>
    </article>
  );
}

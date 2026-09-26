import Link from 'next/link';
import { FeatureTags, Rating, ReserveButton } from '@/components/ui';
import { getArea } from '@/lib/site-config';
import { formatYen, getReserveUrl, type Hotel } from '@/lib/hotels';

/** 宿泊施設カード：写真＋評価＋口コミ数＋特徴タグ＋価格＋予約ボタン */
export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const area = getArea(hotel.areaKey);
  const href = `/hotel/${hotel.hotelNo}`;
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 flex flex-col">
      <Link href={href} className="block aspect-[4/3] bg-season-soft overflow-hidden">
        {hotel.imageUrl && (
          // 楽天トラベルの画像サーバーから直接表示する（next/imageの外部ドメイン設定は未設定）
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" />
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {area && <p className="text-xs text-season-accent">{area.prefecture}・{area.name}</p>}
        <h3 className="font-bold leading-snug">
          <Link href={href} className="hover:text-season">{hotel.name}</Link>
        </h3>
        <Rating average={hotel.reviewAverage} count={hotel.reviewCount} />
        <FeatureTags conditions={hotel.conditions} limit={4} />
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <p className="text-xs text-gray-500">
            1名あたり
            <span className="block text-lg font-bold text-ink font-sans">{formatYen(hotel.minCharge)}〜</span>
          </p>
          <ReserveButton url={getReserveUrl(hotel)} label="楽天トラベルで予約" fallbackHref={href} hotelNo={hotel.hotelNo} placement="card" />
        </div>
      </div>
    </article>
  );
}

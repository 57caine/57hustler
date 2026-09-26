import Link from 'next/link';
import { AREAS, CONDITIONS } from '@/lib/site-config';
import { formatYen, type Hotel } from '@/lib/hotels';

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const area = AREAS.find((a) => a.key === hotel.areaKey);
  const labels = CONDITIONS.filter((c) => hotel.conditions.includes(c.key));
  return (
    <Link
      href={`/hotel/${hotel.hotelNo}`}
      className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      {hotel.imageUrl && (
        // 楽天トラベルの画像サーバーから直接表示する（next/imageの外部ドメイン設定は未設定）
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-44 object-cover" loading="lazy" />
      )}
      <div className="p-4">
        {area && <p className="text-xs text-sky-700 mb-1">{area.prefecture}・{area.name}</p>}
        <h3 className="font-bold text-gray-900 leading-snug mb-2">{hotel.name}</h3>
        <p className="text-sm text-gray-700">
          最低料金 <span className="font-bold">{formatYen(hotel.minCharge)}</span>〜
          {hotel.reviewAverage != null && (
            <span className="ml-3 text-gray-500">評価 {hotel.reviewAverage.toFixed(2)}（{hotel.reviewCount ?? 0}件）</span>
          )}
        </p>
        {labels.length > 0 && (
          <ul className="flex flex-wrap gap-1 mt-3">
            {labels.map((c) => (
              <li key={c.key} className="text-xs bg-sky-50 text-sky-700 rounded px-2 py-0.5">{c.label}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

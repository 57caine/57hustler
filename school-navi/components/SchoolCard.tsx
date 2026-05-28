import Link from 'next/link';
import type { School } from '@/lib/schools';
import { formatPrice } from '@/lib/schools';

type Props = {
  school: School;
  rank?: number;
};

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-blue-100 text-blue-700',
  'スキルアップ': 'bg-green-100 text-green-700',
  'フリーランス特化': 'bg-orange-100 text-orange-700',
  'AI特化': 'bg-red-100 text-red-700',
  '独学支援': 'bg-purple-100 text-purple-700',
};

export default function SchoolCard({ school, rank }: Props) {
  return (
    <div className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all ${school.highlight ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'}`}>
      {school.highlight && (
        <div className="bg-indigo-600 text-white text-xs text-center py-1 font-medium">
          ⭐ おすすめ
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="bg-gray-100 text-gray-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">
                {rank}
              </span>
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{school.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[school.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {school.category}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">料金</p>
            <p className="font-bold text-gray-800">{formatPrice(school.price)}〜</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{school.tagline}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {school.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <span>⏱ {school.period}</span>
          <span>📅 {school.format.join('・')}</span>
          <span className="ml-auto flex items-center gap-1">
            ⭐ <span className="font-bold text-gray-700">{school.rating}</span>
            <span className="text-xs">({school.reviewCount}件)</span>
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/schools/${school.slug}`}
            className="flex-1 text-center border border-indigo-600 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            詳細を見る
          </Link>
          <a
            href={school.affiliate_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            公式サイトへ
          </a>
        </div>
      </div>
    </div>
  );
}

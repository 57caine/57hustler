import Link from 'next/link';
import type { School } from '@/lib/schools';
import { formatPrice } from '@/lib/schools';

type Props = {
  school: School;
  rank?: number;
};

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-slate-50 text-slate-700 border-slate-200',
  'スキルアップ': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'フリーランス特化': 'bg-amber-50 text-amber-700 border-amber-200',
  'AI特化': 'bg-violet-50 text-violet-700 border-violet-200',
  '独学支援': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function SchoolCard({ school, rank }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-gray-300 transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {rank && (
              <p className="text-xs text-gray-400 mb-1">#{rank}</p>
            )}
            <h3 className="font-bold text-gray-900 text-base leading-tight">{school.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded border font-medium mt-1 inline-block ${categoryColors[school.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {school.category}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">受講料</p>
            <p className="font-bold text-gray-800 text-sm">{school.price === 0 ? '無料' : `${formatPrice(school.price)}〜`}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{school.tagline}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {school.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>期間: {school.period}</span>
          <span className="text-gray-300">|</span>
          <span>{school.format.join(' / ')}</span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/schools/${school.slug}`}
            className="flex-1 text-center border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            詳細を見る
          </Link>
          {school.affiliate_url === '#' && !school.official_url ? (
            <span className="flex-1 text-center border border-gray-200 text-gray-400 py-2 rounded-lg text-sm whitespace-nowrap">
              近日追加予定
            </span>
          ) : (
            <a
              href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 text-center bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              公式サイト
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

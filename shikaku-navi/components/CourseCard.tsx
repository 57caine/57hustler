import Link from 'next/link';
import type { Course } from '@/lib/courses';
import { formatPrice } from '@/lib/courses';

type Props = {
  course: Course;
  rank?: number;
};

const categoryColors: Record<string, string> = {
  '国家資格': 'bg-slate-50 text-slate-700 border-slate-200',
  '転職・就職向け': 'bg-slate-50 text-slate-700 border-slate-200',
  'IT資格': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '副業・スキルアップ': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function CourseCard({ course, rank }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-gray-300 transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {rank && (
              <p className="text-xs text-gray-400 mb-1">#{rank}</p>
            )}
            <h3 className="font-bold text-gray-900 text-base leading-tight">{course.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded border font-medium mt-1 inline-block ${categoryColors[course.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {course.category}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">年間受講料</p>
            <p className="font-bold text-gray-800 text-sm">{formatPrice(course.price)}〜</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{course.tagline}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {course.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>{course.format.join(' / ')}</span>
          {course.passRate !== '非公開' && (
            <>
              <span className="text-gray-300">|</span>
              <span>合格率: {course.passRate}</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="flex-1 text-center border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            詳細を見る
          </Link>
          {course.affiliate_url === '#' ? (
            <span className="flex-1 text-center border border-gray-200 text-gray-400 py-2 rounded-lg text-sm whitespace-nowrap">
              近日追加予定
            </span>
          ) : (
            <a
              href={course.affiliate_url}
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

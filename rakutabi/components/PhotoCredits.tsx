import type { Photo } from '@/lib/photo-keys';

/**
 * ページ内で使ったUnsplash写真の撮影者クレジット一覧（リンク付き）。
 * カード内の写真はカード全体がリンクのためクレジットを文字のみで出しており、撮影者ページへのリンクはここにまとめる
 */
export default function PhotoCredits({ photos }: { photos: (Photo | null)[] }) {
  const unique = [...new Map(photos.filter((p): p is Photo => Boolean(p?.creditUrl)).map((p) => [p.url, p])).values()];
  if (unique.length === 0) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-[11px] text-gray-400 leading-relaxed">
      写真：
      {unique.map((p, i) => (
        <span key={p.url}>
          {i > 0 && '、'}
          <a href={p.creditUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600">{p.credit}</a>
        </span>
      ))}
      {' '}/{' '}
      <a href="https://unsplash.com/?utm_source=rakutabi&utm_medium=referral" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600">Unsplash</a>
    </div>
  );
}

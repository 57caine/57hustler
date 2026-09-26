import type { Photo as PhotoData } from '@/lib/photo-keys';

/**
 * 写真を背景いっぱいに表示する。写真が無い場合は季節色のグラデーション。
 * Unsplashの写真には撮影者クレジット（利用規約で必要）を右下に小さく表示する。
 */
export default function Photo({ photo, className = "", overlay = false, credit = "link", eager = false }: {
  photo: PhotoData | null;
  className?: string;
  /** 文字を重ねる場合の暗いグラデーション */
  overlay?: boolean;
  /**
   * 撮影者クレジット（Unsplash写真のみ）。'link'＝撮影者ページへのリンク付き、
   * 'text'＝文字のみ（カード全体がリンクになっている場所。<a>の入れ子を避けるため。リンクはページ下部の PhotoCredits に出す）
   */
  credit?: 'link' | 'text';
  /** ファーストビューの写真は遅延読み込みしない */
  eager?: boolean;
}) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-season-hero-from to-season-hero-to ${className}`}>
      {photo && (
        // 楽天トラベル・Unsplashの画像サーバーから直接表示する（next/imageの外部ドメイン設定は未設定）
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" loading={eager ? "eager" : "lazy"} />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" aria-hidden />}
      {photo?.creditUrl && credit === 'link' && (
        <a
          href={photo.creditUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute bottom-1 right-2 text-[10px] text-white/80 hover:text-white drop-shadow"
        >
          Photo: {photo.credit} / Unsplash
        </a>
      )}
      {photo?.creditUrl && credit === 'text' && (
        <span className="absolute bottom-1 right-2 text-[9px] text-white/85 drop-shadow">Photo: {photo.credit} / Unsplash</span>
      )}
    </div>
  );
}

import Link from 'next/link';
import Icon from '@/components/Icon';
import { RAKUTEN_TRAVEL_TOP_URL } from '@/lib/affiliate';
import { CONDITIONS, type ConditionKey } from '@/lib/site-config';

/** 評価（★＋数値＋クチコミ件数） */
export function Rating({ average, count, size = 'sm' }: { average: number | null; count: number | null; size?: 'sm' | 'lg' }) {
  if (average == null) return <span className="text-xs text-gray-400">クチコミ評価なし</span>;
  return (
    <span className={`inline-flex items-center gap-1 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
      <span className="text-amber-400" aria-hidden>★</span>
      <span className="font-bold text-amber-600">{average.toFixed(1)}</span>
      <span className="text-gray-500 text-xs">（クチコミ {(count ?? 0).toLocaleString('ja-JP')}件）</span>
    </span>
  );
}

/** 特徴タグ（薄い青灰色のピル） */
export function FeatureTags({ conditions, limit }: { conditions: ConditionKey[]; limit?: number }) {
  const labels = CONDITIONS.filter((c) => conditions.includes(c.key)).slice(0, limit);
  if (labels.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1">
      {labels.map((c) => (
        <li key={c.key} className="text-[11px] bg-tag text-tag-ink rounded px-2 py-0.5">{c.short ?? c.label}</li>
      ))}
    </ul>
  );
}

/** 価格表示（赤・1名あたり） */
export function Price({ value, size = 'md' }: { value: number | null; size?: 'md' | 'lg' }) {
  if (value == null) return <span className="text-sm text-gray-400">料金は楽天トラベルでご確認ください</span>;
  return (
    <span className="text-price font-bold font-sans">
      <span className={size === 'lg' ? 'text-3xl' : 'text-xl'}>¥{value.toLocaleString('ja-JP')}</span>
      <span className="text-sm">〜/人</span>
    </span>
  );
}

/**
 * 楽天トラベルへの予約ボタン（赤系・ゴシック）。
 * url はアフィリエイトURLのときだけ渡すこと（呼び出し側で getReserveUrl() を使う）。
 * url が無い間は、個別ページへの内部リンク（fallbackHref）を同じ位置に出す。
 */
export function ReserveButton({
  url,
  label,
  fallbackHref,
  fallbackLabel = '宿の詳細を見る',
  size = 'sm',
  hotelNo,
  placement,
}: {
  url: string | null;
  label: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  size?: 'sm' | 'lg';
  /** 送客クリック計測用（components/ClickTracker.tsx） */
  hotelNo?: number;
  placement?: 'card' | 'hotel-main';
}) {
  const base = `font-sans font-bold rounded-full text-center transition-colors inline-flex items-center justify-center gap-2 ${
    size === 'lg' ? 'w-full px-6 py-3.5 text-base shadow-md' : 'px-4 py-2 text-xs'
  }`;
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        data-hotel-no={hotelNo}
        data-placement={placement}
        className={`${base} bg-cta hover:bg-cta-hover text-white`}
      >
        {label}
        <Icon name="arrow" className={size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} strokeWidth={2.2} />
      </a>
    );
  }
  if (!fallbackHref) return null;
  return (
    <Link href={fallbackHref} className={`${base} border border-ink/20 text-ink hover:bg-gray-50`}>
      {fallbackLabel}
    </Link>
  );
}

/** 楽天トラベルのトップへのアフィリエイトリンク（ヒーロー・下部バナー用） */
export function TravelTopButton({ label, placement, className = '' }: { label: string; placement: 'hero' | 'banner'; className?: string }) {
  return (
    <a
      href={RAKUTEN_TRAVEL_TOP_URL}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      data-hotel-no="0"
      data-placement={placement}
      className={`inline-flex items-center gap-2 rounded-full bg-white text-cta font-bold shadow-lg hover:bg-red-50 transition-colors ${className}`}
    >
      {label}
      <Icon name="arrow" className="w-4 h-4" strokeWidth={2.2} />
    </a>
  );
}

/** セクション見出し（明朝体・紺色）。右側に「一覧を見る」リンクを置ける */
export function SectionTitle({ title, lead, more }: { title: string; lead?: string; more?: { href: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-[28px] font-bold text-ink">{title}</h2>
        {lead && <p className="text-sm text-gray-500 mt-2">{lead}</p>}
      </div>
      {more && (
        <Link href={more.href} className="shrink-0 text-sm text-ink/80 hover:text-season inline-flex items-center gap-1">
          {more.label}
          <Icon name="arrow" className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

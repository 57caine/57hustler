import Link from 'next/link';
import { CONDITIONS, type ConditionKey } from '@/lib/site-config';

/** 評価（★＋数値＋口コミ件数） */
export function Rating({ average, count, size = 'sm' }: { average: number | null; count: number | null; size?: 'sm' | 'lg' }) {
  if (average == null) return <span className="text-xs text-gray-400">口コミ評価なし</span>;
  const full = Math.round(average);
  return (
    <span className={`inline-flex items-center gap-1 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
      <span className="text-amber-500 tracking-tight" aria-hidden>
        {'★'.repeat(full)}
        <span className="text-gray-300">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="font-bold text-ink">{average.toFixed(2)}</span>
      <span className="text-gray-500 text-xs">（口コミ{(count ?? 0).toLocaleString('ja-JP')}件）</span>
    </span>
  );
}

/** 特徴タグ */
export function FeatureTags({ conditions, limit }: { conditions: ConditionKey[]; limit?: number }) {
  const labels = CONDITIONS.filter((c) => conditions.includes(c.key)).slice(0, limit);
  if (labels.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1">
      {labels.map((c) => (
        <li key={c.key} className="text-xs bg-season-soft text-season rounded-full px-2.5 py-0.5">{c.label}</li>
      ))}
    </ul>
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
  full,
  hotelNo,
  placement,
}: {
  url: string | null;
  label: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  full?: boolean;
  /** 送客クリック計測用（components/ClickTracker.tsx） */
  hotelNo?: number;
  placement?: 'card' | 'hotel-main';
}) {
  const base = `font-sans font-bold rounded-lg px-4 py-2.5 text-sm text-center transition-colors ${full ? 'block w-full' : 'inline-block'}`;
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
      </a>
    );
  }
  if (!fallbackHref) return null;
  return (
    <Link href={fallbackHref} className={`${base} border border-season text-season hover:bg-season-soft`}>
      {fallbackLabel}
    </Link>
  );
}

/** セクション見出し（明朝体） */
export function SectionTitle({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-xs tracking-[0.2em] text-season-accent font-medium mb-1">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      {lead && <p className="text-sm text-gray-600 mt-1">{lead}</p>}
    </div>
  );
}

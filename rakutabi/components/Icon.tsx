/** 線画アイコン（デザイン案のテーマアイコン等）。外部アイコンライブラリは使わずSVGを直接持つ */
const PATHS = {
  calendar: 'M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm3 7h2m4 0h2m-8 4h2',
  onsen: 'M5 20h14M7 16c0-3 10-3 10 0M8 4c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4M16 4c-1 1.5 1 2.5 0 4M4 13h16',
  family: 'M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 21v-6H5l1-6h4l1 6h-1v6m4 0v-5l1-5h4l1 5v5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  person: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4',
  pin: 'M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  check: 'm5 12 4 4 10-10',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  chevron: 'm6 9 6 6 6-6',
  yen: 'M6 4l6 8 6-8M12 12v8M8 13h8M8 16h8',
  meal: 'M7 3v8m-2-8v5a2 2 0 0 0 4 0V3m-2 8v10M17 3c-2 0-3 2-3 6h3v12',
  bed: 'M3 18V7m0 6h18v5M3 13V11a2 2 0 0 1 2-2h5v4m11 0v-2a2 2 0 0 0-2-2h-9',
  mountain: 'M3 19 9.5 8l4 6.5L16 11l5 8H3Z',
  area: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14',
} as const;

export type IconKey = keyof typeof PATHS;

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.7 }: { name: IconKey; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}

/** ロゴマーク（山のシルエット） */
export function LogoMark({ className = 'w-9 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-hidden>
      <path d="M2 28 17 6l8 11 5-6 16 17Z" fill="currentColor" />
      <path d="M17 6l-3.5 5.2 3.5 2 3-1.8Z" fill="#fff" opacity=".85" />
      <path d="M30 11l-2.4 2.9 2.4 1.3 2.2-1.4Z" fill="#fff" opacity=".85" />
    </svg>
  );
}

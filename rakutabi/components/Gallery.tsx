'use client';

import { useState } from 'react';

/** 写真ギャラリー（デザイン案：左に大きな写真、右に小さな写真を縦に並べる。クリックで大きい写真を切り替え） */
export default function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) {
    return <div className="aspect-[16/9] rounded-2xl bg-tag" aria-hidden />;
  }
  const current = photos[Math.min(index, photos.length - 1)];
  const others = photos.map((p, i) => ({ ...p, i })).filter((p) => p.i !== index);
  return (
    <div className={`grid gap-2 ${others.length ? 'grid-cols-[2fr_1fr]' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={current.src} alt={current.alt} className="w-full aspect-[4/3] object-cover rounded-2xl bg-tag" />
      {others.length > 0 && (
        <div className="grid gap-2 auto-rows-fr">
          {others.slice(0, 2).map((p) => (
            <button key={p.src} type="button" onClick={() => setIndex(p.i)} aria-label={`${p.alt}を大きく表示`} className="rounded-2xl overflow-hidden bg-tag hover:opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

/** 写真ギャラリー（メイン写真＋サムネイル切り替え） */
export default function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) {
    return <div className="aspect-[16/9] rounded-2xl bg-season-soft" aria-hidden />;
  }
  const current = photos[Math.min(index, photos.length - 1)];
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={current.src} alt={current.alt} className="w-full aspect-[16/9] object-cover rounded-2xl bg-season-soft" />
      {photos.length > 1 && (
        <div className="flex gap-2 mt-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${p.alt}を表示`}
              className={`w-24 aspect-[4/3] rounded-lg overflow-hidden ring-2 ${i === index ? 'ring-season' : 'ring-transparent opacity-70 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

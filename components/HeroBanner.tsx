import Image from 'next/image';
import type { ReactNode } from 'react';

type HeroBannerProps = {
  icon: ReactNode;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  gradient: string; // 例: 'from-indigo-950 to-blue-950'
  borderColor: string; // 例: 'border-indigo-800'
  overlayFrom: string; // 例: 'from-indigo-950/85'
  overlayTo: string; // 例: 'to-blue-950/70'
  disclaimer?: ReactNode;
};

export default function HeroBanner({
  icon,
  title,
  description,
  imageUrl,
  imageAlt,
  gradient,
  borderColor,
  overlayFrom,
  overlayTo,
  disclaimer,
}: HeroBannerProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} border ${borderColor} rounded-2xl p-8 mb-10`}>
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="absolute inset-0 object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${overlayFrom} ${overlayTo}`} />
        </>
      )}
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-200 text-sm leading-relaxed max-w-xl">{description}</p>
        {disclaimer}
      </div>
    </div>
  );
}

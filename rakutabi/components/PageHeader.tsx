import Breadcrumb, { type Crumb } from '@/components/Breadcrumb';
import Photo from '@/components/Photo';
import type { Photo as PhotoData } from '@/lib/photo-keys';

/** 一覧ページ共通の見出し（デザイン案：写真の上に大きな明朝の見出しを重ねる帯） */
export default function PageHeader({ crumbs, eyebrow, title, lead, photo, children }: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
  photo?: PhotoData | null;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative overflow-hidden">
        <Photo photo={photo ?? null} overlay eager />
        <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-12 md:pt-20 md:pb-16 text-white">
          {eyebrow && <p className="text-xs tracking-[0.2em] text-white/80 mb-2">{eyebrow}</p>}
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow">{title}</h1>
          {lead && <p className="mt-3 text-sm md:text-base text-white/90 max-w-2xl drop-shadow">{lead}</p>}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-3">
        <Breadcrumb items={crumbs} />
        {children}
      </div>
    </div>
  );
}

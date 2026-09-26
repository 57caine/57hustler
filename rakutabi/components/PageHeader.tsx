import Breadcrumb, { type Crumb } from '@/components/Breadcrumb';

/** 一覧ページ共通の見出し帯（季節色のグラデーション） */
export default function PageHeader({ crumbs, eyebrow, title, lead, children }: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-season-hero-from/40 to-season-surface border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-8">
        <Breadcrumb items={crumbs} />
        {eyebrow && <p className="text-xs tracking-[0.2em] text-season-accent font-medium mb-1">{eyebrow}</p>}
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">{title}</h1>
        {lead && <p className="text-gray-700 max-w-3xl">{lead}</p>}
        {children}
      </div>
    </div>
  );
}

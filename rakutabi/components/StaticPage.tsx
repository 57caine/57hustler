import Breadcrumb from '@/components/Breadcrumb';

/** サイト情報系ページ（サイトについて・利用規約など）の共通レイアウト */
export default function StaticPage({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: title, href }]} />
      <h1 className="text-2xl md:text-3xl font-bold mb-8">{title}</h1>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 p-6 md:p-8 space-y-8 text-sm leading-relaxed text-gray-700 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}

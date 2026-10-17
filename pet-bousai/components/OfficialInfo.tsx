import { SOURCES, type SourceId } from '@/lib/sources';

/**
 * 公的資料にもとづく情報の枠。商品紹介（広告）とは見た目と見出しで明確に分ける。
 * cite には出典と記載ページを渡す（例: { id: 'owner-guide', pages: 'p.19' }）。
 */
export default function OfficialInfo({
  title,
  cite,
  children,
}: {
  title: string;
  cite: { id: SourceId; pages?: string }[];
  children: React.ReactNode;
}) {
  return (
    <section className="my-6 rounded-lg border border-brand-100 bg-brand-50 px-4 py-4" data-official-info>
      <p className="text-xs font-bold text-brand-700 tracking-wide">公的資料にもとづく情報</p>
      <h2 className="!mt-1 !border-0 !pb-0 text-lg font-bold">{title}</h2>
      <div className="prose-body text-[15px]">{children}</div>
      <p className="mt-3 text-xs text-gray-600 leading-relaxed">
        出典：
        {cite.map((c, i) => (
          <span key={c.id + i}>
            {i > 0 && '／'}
            <a href={SOURCES[c.id].url} target="_blank" rel="noopener noreferrer" className="underline">
              {SOURCES[c.id].publisher}「{SOURCES[c.id].title}」
            </a>
            （{SOURCES[c.id].issued}）{c.pages ?? ''}
          </span>
        ))}
      </p>
    </section>
  );
}

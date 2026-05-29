import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { columns, getColumnBySlug, columnContent } from '@/lib/columns';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return columns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = getColumnBySlug(slug);
  if (!column) return {};
  return {
    title: column.title,
    description: column.description,
  };
}

const categoryColors: Record<string, string> = {
  '度数・処方箋': 'bg-purple-100 text-purple-700',
  '購入ガイド': 'bg-emerald-100 text-emerald-700',
  '商品比較': 'bg-slate-100 text-slate-700',
};

export default async function ColumnPage({ params }: Props) {
  const { slug } = await params;
  const column = getColumnBySlug(slug);
  if (!column) notFound();

  const content = columnContent[slug];
  if (!content) notFound();

  const otherColumns = columns.filter((c) => c.slug !== slug).slice(0, 3);
  const BASE = 'https://lens-navi.jp';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: column.title,
        description: column.description,
        datePublished: column.publishedAt,
        dateModified: column.updatedAt,
        publisher: { '@type': 'Organization', name: 'コンタクト最安値.com', url: BASE },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/column/${column.slug}` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'コラム', item: `${BASE}/column` },
          { '@type': 'ListItem', position: 3, name: column.title, item: `${BASE}/column/${column.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/column" className="hover:text-slate-700">コラム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 line-clamp-1">{column.title}</span>
      </nav>

      <article>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[column.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {column.category}
            </span>
            <span className="text-xs text-gray-400">{column.readingTime}分で読める</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {column.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-gray-100">
            <span>公開: {column.publishedAt}</span>
            <span>更新: {column.updatedAt}</span>
          </div>
        </div>

        <div className="text-gray-800 leading-relaxed">
          {content}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            ※ 当サイトはアフィリエイト広告を掲載しています。商品リンクから購入された場合、当サイトに手数料が発生することがあります。価格情報は参考値であり、実際の価格は各ショップでご確認ください。
          </p>
        </div>
      </article>

      {otherColumns.length > 0 && (
        <aside className="mt-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">関連コラム</h2>
          <div className="space-y-3">
            {otherColumns.map((c) => (
              <Link key={c.slug} href={`/column/${c.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {c.category}
                  </span>
                </div>
                <p className="font-medium text-gray-800 text-sm hover:text-slate-700">{c.title}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

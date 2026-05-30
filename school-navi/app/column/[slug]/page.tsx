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
  'スクール比較': 'bg-slate-100 text-slate-700',
  '費用・給付金': 'bg-emerald-50 text-emerald-700',
  '転職・キャリア': 'bg-slate-100 text-slate-700',
  '転職・就職': 'bg-slate-100 text-slate-700',
  'AI・最新技術': 'bg-violet-50 text-violet-700',
  '年代別おすすめ': 'bg-amber-50 text-amber-700',
};

const BASE = 'https://nsplot.com';

export default async function ColumnArticlePage({ params }: Props) {
  const { slug } = await params;
  const column = getColumnBySlug(slug);
  if (!column) notFound();

  const content = columnContent[slug];
  if (!content) notFound();

  const otherColumns = columns.filter((c) => c.slug !== slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: column.title,
        description: column.description,
        datePublished: column.publishedAt,
        dateModified: column.updatedAt,
        publisher: { '@type': 'Organization', name: 'スクールナビ', url: BASE },
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">{column.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-gray-100">
            <span>公開: {column.publishedAt}</span>
            <span>更新: {column.updatedAt}</span>
          </div>
        </div>

        {/* 目次 */}
        {column.headings && column.headings.length > 0 && (
          <nav aria-label="目次" className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <p className="text-xs font-bold text-slate-500 tracking-widest mb-3">目次</p>
            <ol className="space-y-2">
              {column.headings.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="text-slate-400 font-mono text-xs mt-0.5 shrink-0 w-5">{i + 1}.</span>
                  <span className="text-slate-700 leading-snug">{h}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* 記事前CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800">この記事のスクールを無料で比較する</p>
            <p className="text-xs text-gray-500 mt-0.5">料金・転職実績・給付金対応を一覧で確認</p>
          </div>
          <Link href="/schools" className="shrink-0 bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap">
            スクール一覧を見る →
          </Link>
        </div>

        {/* 本文 */}
        <div className="text-gray-800 leading-relaxed">{content}</div>

        {/* 記事後CTA */}
        <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm font-bold text-gray-800 mb-1">無料でスクールを比較・資料請求する</p>
          <p className="text-xs text-gray-500 mb-3">料金・給付金対応・転職保証・受講期間を一覧比較。全て無料で確認できます。</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/schools" className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              全スクールを比較する →
            </Link>
            <Link href="/category/tensyoku" className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg hover:border-slate-300 transition-colors">
              転職保証あり
            </Link>
            <Link href="/category/kyuufu" className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg hover:border-slate-300 transition-colors">
              給付金対応
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            ※ 当サイトはアフィリエイト広告を掲載しています。スクールリンクから申し込まれた場合、当サイトに手数料が発生することがあります。掲載情報は参考値であり、最新情報は各スクール公式サイトでご確認ください。
          </p>
        </div>
      </article>

      {otherColumns.length > 0 && (
        <aside className="mt-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">関連コラム</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherColumns.map((c) => (
              <Link key={c.slug} href={`/column/${c.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[c.category] ?? 'bg-gray-100 text-gray-600'}`}>{c.category}</span>
                  <span className="text-xs text-gray-400">{c.readingTime}分</span>
                </div>
                <p className="font-medium text-gray-800 text-sm leading-snug hover:text-slate-700">{c.title}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

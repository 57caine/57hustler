import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { columns, getColumnBySlug, columnContent } from '@/lib/columns';
import { eyeColumns, eyeColumnContent, type EyeColumnMeta } from '@/lib/eye-columns';
import { karakonColumnContent } from '@/lib/karakon-columns';
import { allColumns, getAnyColumnBySlug } from '@/lib/all-columns';
import ArticleTOC from '@/components/ArticleTOC';
import { getHeroImage } from '@/lib/unsplash';

// 白基調デザインのモデルケース対象記事（承認後、全体展開時にこの判定は撤去する）
const LIGHT_PREVIEW_SLUGS = new Set(['sunglass-polarized-guide']);
const LIGHT_PREVIEW_HERO_QUERY: Record<string, string> = {
  'sunglass-polarized-guide': 'polarized sunglasses fashion outdoor',
};

const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

const SECTION_CTA: Record<string, { label: string; rakuten: string }> = {
  megane:      { label: '眼鏡・サングラスを楽天で探す', rakuten: '眼鏡フレーム おすすめ' },
  vr:          { label: 'VR・スマートグラスを楽天で探す', rakuten: 'VRゴーグル Meta Quest' },
  lasik:       { label: 'アイケアグッズを楽天で探す', rakuten: '目薬 コンタクト' },
  'eye-care':  { label: 'アイケアグッズを楽天で探す', rakuten: 'ドライアイ 目薬 コンタクト' },
  'eye-goods': { label: '目のグッズを楽天で探す', rakuten: 'ホットアイマスク おすすめ' },
  karakon:     { label: 'カラコンを楽天で探す', rakuten: 'カラコン おすすめ 日本製' },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allColumns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = getAnyColumnBySlug(slug);
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
  'BC選び方': 'bg-sky-100 text-sky-700',
  '眼鏡・サングラス': 'bg-indigo-100 text-indigo-700',
  'VR・スマートグラス': 'bg-violet-100 text-violet-700',
  'レーシック': 'bg-emerald-100 text-emerald-700',
  'アイケア・目薬': 'bg-cyan-100 text-cyan-700',
  '目のグッズ': 'bg-orange-100 text-orange-700',
  'カラコン': 'bg-pink-100 text-pink-700',
};

export default async function ColumnPage({ params }: Props) {
  const { slug } = await params;
  const column = getAnyColumnBySlug(slug);
  if (!column) notFound();

  const content = columnContent[slug] ?? eyeColumnContent[slug] ?? karakonColumnContent[slug];
  if (!content) notFound();

  const otherColumns = allColumns.filter((c) => c.slug !== slug).slice(0, 4);
  const BASE = 'https://lens-navi.jp';

  const isLightPreview = LIGHT_PREVIEW_SLUGS.has(slug);
  const heroImage = isLightPreview
    ? await getHeroImage(LIGHT_PREVIEW_HERO_QUERY[slug] ?? column.title)
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: column.title,
        description: column.description,
        datePublished: column.publishedAt,
        dateModified: column.updatedAt,
        publisher: { '@type': 'Organization', name: 'レンズナビ', url: BASE },
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
    <div className={`${isLightPreview ? 'light-preview ' : ''}max-w-3xl mx-auto px-4 py-8`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/column" className="hover:text-slate-700">コラム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 line-clamp-1">{column.title}</span>
      </nav>

      <article>
        {/* ヘッダー */}
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
          {heroImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <Image
                src={heroImage}
                alt={column.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-gray-100">
            <span>公開: {column.publishedAt}</span>
            <span>更新: {column.updatedAt ?? column.publishedAt}</span>
          </div>
        </div>

        {/* TOC（クライアント側でH2にID付与＋スムーズスクロール） */}
        <ArticleTOC bodyId="article-body" />

        {/* 記事前CTA */}
        {(() => {
          const isEye = 'section' in column;
          const eyeSection = isEye ? (column as EyeColumnMeta).section : null;
          const cta = eyeSection ? SECTION_CTA[eyeSection] : null;
          if (cta) {
            return (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                <p className="text-sm font-bold text-gray-800 mb-3">{cta.label}</p>
                <a href={RAKUTEN(cta.rakuten)} target="_blank" rel="noopener noreferrer nofollow"
                  className="block w-full text-center text-sm font-bold bg-[#bf0000] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-opacity">
                  楽天市場で見る →
                </a>
              </div>
            );
          }
          return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">コンタクトレンズをお得に購入する</p>
                <p className="text-xs text-gray-500 mt-0.5">楽天市場で最安値をチェック</p>
              </div>
              <Link href="/ranking" className="shrink-0 bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap">
                おすすめ商品を見る →
              </Link>
            </div>
          );
        })()}

        {/* 本文 */}
        <div id="article-body" className="text-gray-800 leading-relaxed">
          {content}
        </div>

        {/* FAQ（メタデータから） */}
        {('faqs' in column) && column.faqs && column.faqs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-3">
              {(column as EyeColumnMeta).faqs!.map(({ q, a }) => (
                <details key={q} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                    {q}<span className="text-gray-400 ml-2 text-xs shrink-0">▾</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-sm text-gray-700 border-t border-gray-100 leading-relaxed">{a}</div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* 記事後CTA */}
        {(() => {
          const isEye = 'section' in column;
          const eyeSection = isEye ? (column as EyeColumnMeta).section : null;
          const cta = eyeSection ? SECTION_CTA[eyeSection] : null;
          if (cta) {
            return (
              <div className="mt-10 p-5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm font-bold text-gray-800 mb-3">この記事に関連する商品を楽天で探す</p>
                <a href={RAKUTEN(cta.rakuten)} target="_blank" rel="noopener noreferrer nofollow"
                  className="block w-full text-center text-sm font-bold bg-[#bf0000] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-opacity">
                  楽天市場で見る →
                </a>
                <div className="mt-3 pt-3 border-t border-red-100 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">コンタクトレンズの最安値も比較</p>
                  <Link href="/ranking" className="shrink-0 text-xs font-bold text-sky-600 hover:underline whitespace-nowrap">
                    コンタクト最安値を見る →
                  </Link>
                </div>
              </div>
            );
          }
          return (
            <div className="mt-10 p-5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-bold text-gray-800 mb-1">コンタクトレンズを楽天で購入する</p>
              <p className="text-xs text-gray-500 mb-3">楽天市場で最安値をチェック</p>
              <div className="flex flex-wrap gap-2">
                <a href={RAKUTEN('コンタクトレンズ ワンデー')} target="_blank" rel="noopener noreferrer nofollow"
                  className="bg-[#bf0000] hover:opacity-90 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-opacity">
                  楽天で探す →
                </a>
                <Link href="/category/1day" className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-lg hover:border-slate-300 transition-colors">
                  ワンデー比較
                </Link>
                <Link href="/category/2week" className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-lg hover:border-slate-300 transition-colors">
                  2ウィーク比較
                </Link>
              </div>
            </div>
          );
        })()}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            ※ 当サイトはアフィリエイト広告を掲載しています。商品リンクから購入された場合、当サイトに手数料が発生することがあります。価格情報は参考値であり、実際の価格は各ショップでご確認ください。
          </p>
        </div>
      </article>

      {/* 関連コラム */}
      {otherColumns.length > 0 && (
        <aside className="mt-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">関連コラム</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherColumns.map((c) => (
              <Link key={c.slug} href={`/column/${c.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[c.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {c.category}
                  </span>
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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { schools, getSchoolBySlug, formatPrice } from '@/lib/schools';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return schools.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  if (!school) return {};
  return {
    title: `${school.name}の評判・料金・特徴`,
    description: `${school.name}の料金・転職成功率・カリキュラムを詳しく解説。${school.tagline}`,
  };
}

const BASE = 'https://nsplot.com';

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  if (!school) notFound();

  const related = schools.filter((s) => s.slug !== slug && s.category === school.category).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        name: school.name,
        description: school.description,
        offers: {
          '@type': 'Offer',
          price: school.price,
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'スクール一覧', item: `${BASE}/schools` },
          { '@type': 'ListItem', position: 3, name: school.name, item: `${BASE}/schools/${school.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/schools" className="hover:text-indigo-600">スクール一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{school.name}</span>
      </nav>

      {/* School Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{school.category}</span>
              {school.highlight && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">⭐ おすすめ</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h1>
            <p className="text-gray-600 mb-4">{school.tagline}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {school.features.map((f) => (
                <span key={f} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm max-w-sm">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">期間</p>
                <p className="font-bold text-gray-800 text-xs">{school.period}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">形式</p>
                <p className="font-bold text-gray-800 text-xs">{school.format.join('・')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">評価</p>
                <p className="font-bold text-gray-800">⭐ {school.rating}</p>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1">料金</p>
            <p className="text-3xl font-bold text-indigo-600">{formatPrice(school.price)}</p>
            <p className="text-xs text-gray-400">{school.priceNote}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <a
            href={school.affiliate_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 text-center bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            公式サイトで詳細を確認する →
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{school.name}の特徴</h2>
        <p className="text-gray-700 leading-relaxed mb-5">{school.description}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-green-700 mb-2">✅ メリット</h3>
            <ul className="space-y-1">
              {school.pros.map((p) => (
                <li key={p} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-500 shrink-0">◎</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-red-700 mb-2">⚠️ デメリット</h3>
            <ul className="space-y-1">
              {school.cons.map((c) => (
                <li key={c} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-red-400 shrink-0">△</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">学べる言語・技術</h2>
        <div className="flex flex-wrap gap-2">
          {school.languages.map((lang) => (
            <span key={lang} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">{lang}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 text-center">
        <p className="font-bold text-gray-900 mb-2">{school.name}の無料相談・資料請求はこちら</p>
        <p className="text-sm text-gray-600 mb-4">まずは無料で相談してみましょう。しつこい勧誘はありません。</p>
        <a
          href={school.affiliate_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors"
        >
          公式サイトへ（無料相談）
        </a>
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mb-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。料金・内容は変更される場合があります。最新情報は公式サイトでご確認ください。
      </p>

      {/* Related */}
      {related.length > 0 && (
        <aside>
          <h2 className="text-lg font-bold text-gray-800 mb-4">同じカテゴリのスクール</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link key={s.slug} href={`/schools/${s.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all">
                <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatPrice(s.price)}〜 / {s.period}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

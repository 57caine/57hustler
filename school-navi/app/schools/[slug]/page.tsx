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
    title: `${school.name}の評判・料金・特徴【編集部が徹底調査】`,
    description: `${school.name}の料金・サポート内容・カリキュラムを解説。${school.tagline}`,
  };
}

const BASE = 'https://nsplot.com';

const categoryColors: Record<string, string> = {
  '転職特化': 'bg-slate-50 text-slate-700 border-slate-200',
  'スキルアップ': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'フリーランス特化': 'bg-amber-50 text-amber-700 border-amber-200',
  'AI特化': 'bg-violet-50 text-violet-700 border-violet-200',
  '独学支援': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  if (!school) notFound();

  const related = schools
    .filter((s) => s.slug !== slug && s.category === school.category)
    .slice(0, 3);

  const schoolFaqs = [
    {
      q: `${school.name}の料金はいくらですか？`,
      a: `${school.name}の受講料は${school.price === 0 ? '無料（転職成功報酬型など）' : `${formatPrice(school.price)}円〜`}です。${school.priceNote}コースや受講形態によって異なるため、最新の料金は公式サイトでご確認ください。`,
    },
    {
      q: `${school.name}は未経験者でも受講できますか？`,
      a: `${school.name}は${school.targetAudience}を対象としており、プログラミング未経験の方でも受講可能です。基礎から丁寧にサポートするカリキュラムが用意されています。`,
    },
    {
      q: `${school.name}の受講期間はどのくらいですか？`,
      a: `${school.name}の標準的な受講期間は${school.period}です。学習ペースやコースによって異なる場合があります。`,
    },
    {
      q: `${school.name}では給付金は使えますか？`,
      a: school.features.includes('給付金対象')
        ? `${school.name}は教育訓練給付金の対象講座を提供しています。雇用保険の加入期間など条件がありますので、受講前にハローワークでご確認ください。`
        : `${school.name}の給付金対象講座については公式サイトでご確認ください。給付金非対応の場合でも分割払いや奨学金制度を設けているケースがあります。`,
    },
  ];

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
      {
        '@type': 'FAQPage',
        mainEntity: schoolFaqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/schools" className="hover:text-slate-700">スクール一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{school.name}</span>
      </nav>

      {/* School Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded border font-medium mb-2 inline-block ${categoryColors[school.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {school.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-1">{school.name}</h1>
            <p className="text-gray-600 mb-4 leading-relaxed">{school.tagline}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {school.features.map((f) => (
                <span key={f} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded">
                  {f}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">受講期間</p>
                <p className="font-semibold text-gray-800 text-sm">{school.period}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">受講形式</p>
                <p className="font-semibold text-gray-800 text-sm">{school.format.join(' / ')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">対象者</p>
                <p className="font-semibold text-gray-800 text-sm">{school.targetAudience}</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-400 mb-1">受講料（目安）</p>
            <p className="text-3xl font-bold text-slate-800">
              {school.price === 0 ? '無料' : formatPrice(school.price)}
            </p>
            <p className="text-xs text-gray-400 mt-1">{school.priceNote}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          {school.affiliate_url === '#' ? (
            <span className="flex-1 text-center border border-gray-200 text-gray-400 py-3 rounded-xl text-sm">
              近日追加予定
            </span>
          ) : (
            <a
              href={school.affiliate_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 text-center bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors text-sm"
            >
              公式サイトで詳細を確認する
            </a>
          )}
          <Link
            href="/compare"
            className="text-center border border-gray-300 text-gray-600 py-3 px-5 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm"
          >
            他校と比較する
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{school.name}の概要</h2>
        <p className="text-gray-700 leading-relaxed text-sm">{school.description}</p>
      </div>

      {/* Pros & Cons */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">メリット・デメリット</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-emerald-700 text-sm mb-3 flex items-center gap-1.5">
              <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-xs">+</span>
              メリット
            </h3>
            <ul className="space-y-2">
              {school.pros.map((p) => (
                <li key={p} className="text-sm text-gray-700 flex gap-2 leading-relaxed">
                  <span className="text-emerald-500 shrink-0 mt-0.5">▸</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-amber-700 text-sm mb-3 flex items-center gap-1.5">
              <span className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center text-xs">−</span>
              デメリット
            </h3>
            <ul className="space-y-2">
              {school.cons.map((c) => (
                <li key={c} className="text-sm text-gray-700 flex gap-2 leading-relaxed">
                  <span className="text-amber-400 shrink-0 mt-0.5">▸</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">学べる言語・技術</h2>
        <div className="flex flex-wrap gap-2">
          {school.languages.map((lang) => (
            <span key={lang} className="text-sm bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded font-medium">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <p className="font-semibold text-gray-900 mb-1 text-sm">{school.name}の詳細・無料相談</p>
        <p className="text-xs text-gray-500 mb-4">料金・カリキュラムの詳細は公式サイトでご確認ください。無料カウンセリングを実施しているスクールが多いため、まず話を聞いてみることをお勧めします。</p>
        {school.affiliate_url === '#' ? (
          <span className="inline-block border border-gray-200 text-gray-400 px-8 py-3 rounded-lg text-sm">
            近日追加予定
          </span>
        ) : (
          <a
            href={school.affiliate_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
          >
            公式サイトを確認する
          </a>
        )}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {schoolFaqs.map(({ q, a }) => (
            <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
              <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 border border-gray-100 rounded-lg p-3 mb-10">
        ※ 当サイトはアフィリエイト広告を掲載しています。リンク経由で申し込まれた場合、当サイトに紹介料が発生することがあります。料金・内容は変更される場合があります。最新情報は公式サイトでご確認ください。
      </p>

      {/* Related */}
      {related.length > 0 && (
        <aside>
          <h2 className="text-lg font-bold text-gray-800 mb-4">同じカテゴリのスクール</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link key={s.slug} href={`/schools/${s.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-sm transition-all">
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {s.price === 0 ? '無料' : `${formatPrice(s.price)}〜`} / {s.period}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

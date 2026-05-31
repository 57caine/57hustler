import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { courses, getCourseBySlug, formatPrice } from '@/lib/courses';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.name}の評判・料金・合格率【2026年版】`,
    description: `${course.name}の料金・合格率・カリキュラムを詳しく解説。${course.tagline} 対応資格: ${course.targetExam.slice(0, 3).join('・')}など。`,
  };
}

const BASE = 'https://shikaku.lens-navi.jp';

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const related = courses.filter((c) => c.slug !== slug && c.category === course.category).slice(0, 3);

  const courseFaqs = [
    {
      q: `${course.name}の受講料はいくらですか？`,
      a: `${course.name}の受講料は${formatPrice(course.price)}〜です。${course.priceNote}コースや対象資格によって異なるため、最新の料金は公式サイトでご確認ください。`,
    },
    {
      q: `${course.name}の合格率はどのくらいですか？`,
      a: `${course.name}の合格率は${course.passRate}です。資格の種類・受講コースによって異なります。詳細な合格実績は公式サイトをご覧ください。`,
    },
    {
      q: `${course.name}はどんな資格に対応していますか？`,
      a: `${course.name}は${course.targetExam.join('・')}などの資格・試験に対応しています。`,
    },
    {
      q: `${course.name}で給付金は使えますか？`,
      a: course.features.includes('給付金対象')
        ? `${course.name}は教育訓練給付金の対象講座を提供しています。雇用保険の加入期間など条件があるため、受講前にハローワークでご確認ください。給付金を活用すると受講料の20〜70%が還付される場合があります。`
        : `${course.name}の給付金対象講座については公式サイトでご確認ください。分割払いや早割制度を利用することで実質負担を軽減できる場合があります。`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        name: course.name,
        description: course.description,
        offers: {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: '講座一覧', item: `${BASE}/courses` },
          { '@type': 'ListItem', position: 3, name: course.name, item: `${BASE}/courses/${course.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: courseFaqs.map(({ q, a }) => ({
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
        <Link href="/courses" className="hover:text-slate-700">講座一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{course.name}</span>
      </nav>

      {/* Course Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full">{course.category}</span>
              {course.highlight && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">編集部おすすめ</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
            <p className="text-gray-600 mb-4">{course.tagline}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {course.features.map((f) => (
                <span key={f} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm max-w-xs">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">学習形式</p>
                <p className="font-bold text-gray-800 text-xs mt-1">{course.format.join('・')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">合格率</p>
                <p className="font-bold text-gray-800 text-xs mt-1">{course.passRate}</p>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1">年間受講料</p>
            <p className="text-3xl font-bold text-slate-800">{formatPrice(course.price)}</p>
            <p className="text-xs text-gray-400">{course.priceNote}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          {course.affiliate_url === '#' && !course.official_url ? (
            <span className="flex-1 text-center border border-gray-200 text-gray-400 py-3 rounded-xl text-sm">
              近日追加予定
            </span>
          ) : (
            <a
              href={course.affiliate_url !== '#' ? course.affiliate_url : course.official_url!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 text-center bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              公式サイトで詳細を確認する →
            </a>
          )}
        </div>
      </div>

      {/* Target Exams */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">対応している資格・試験</h2>
        <div className="flex flex-wrap gap-2">
          {course.targetExam.map((exam) => (
            <span key={exam} className="bg-slate-50 text-slate-700 text-sm px-3 py-1 rounded-full border border-slate-200 font-medium">{exam}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{course.name}の特徴</h2>
        <p className="text-gray-700 leading-relaxed mb-5">{course.description}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-slate-700 mb-2 text-sm">メリット</h3>
            <ul className="space-y-1">
              {course.pros.map((p) => (
                <li key={p} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-slate-500 shrink-0">◎</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-500 mb-2 text-sm">デメリット</h3>
            <ul className="space-y-1">
              {course.cons.map((c) => (
                <li key={c} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-gray-400 shrink-0">△</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {courseFaqs.map(({ q, a }) => (
            <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
              <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-center">
        <p className="font-bold text-gray-900 mb-2">{course.name}の詳細・無料資料請求はこちら</p>
        <p className="text-sm text-gray-600 mb-4">まずは公式サイトで最新の料金・コース内容をご確認ください。</p>
        {course.affiliate_url === '#' && !course.official_url ? (
          <span className="inline-block border border-gray-200 text-gray-400 px-8 py-3 rounded-full text-sm">
            近日追加予定
          </span>
        ) : (
          <a
            href={course.affiliate_url !== '#' ? course.affiliate_url : course.official_url!}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-colors"
          >
            公式サイトを見る
          </a>
        )}
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mb-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。料金・内容は変更される場合があります。最新情報は公式サイトでご確認ください。
      </p>

      {/* Related */}
      {related.length > 0 && (
        <aside>
          <h2 className="text-lg font-bold text-gray-800 mb-4">同じカテゴリの講座</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((c) => (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatPrice(c.price)}〜 / {c.priceNote}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

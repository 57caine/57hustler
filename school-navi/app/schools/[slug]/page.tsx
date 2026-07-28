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

const BASE = 'https://school.lens-navi.jp';

const categoryColors: Record<string, string> = {
  'プログラミング・IT転職': 'bg-sky-50 text-sky-700 border-sky-200',
  '資格・オンライン学習': 'bg-blue-50 text-blue-700 border-blue-200',
  'クリエイティブ・デザイン': 'bg-purple-50 text-purple-700 border-purple-200',
  '音楽': 'bg-pink-50 text-pink-700 border-pink-200',
  'ゴルフ・フィットネス': 'bg-green-50 text-green-700 border-green-200',
  '投資・トレード': 'bg-amber-50 text-amber-700 border-amber-200',
};

// Generate skills based on category
function getSkillsForCategory(category: string, languages: string[]): string[] {
  if (category === 'プログラミング・IT転職') {
    return ['HTML/CSS', 'JavaScript', 'React/Vue.js', 'Node.js/Python', 'Git/GitHub'];
  } else if (category === 'ゴルフ・フィットネス') {
    return ['スイング改善', 'コースマネジメント', '戦略的アプローチ', 'メンタル管理'];
  } else if (category === '投資・トレード') {
    return ['テクニカル分析', 'ファンダメンタル分析', 'リスク管理', '資金管理', 'エントリー・イグジット手法'];
  }
  return languages.slice(0, 5);
}

// Generate career paths based on category
function getCareerPathsForCategory(category: string): { before: string; after: string }[] {
  if (category === 'プログラミング・IT転職') {
    return [
      { before: '未経験の事務職', after: 'Webエンジニアとして転職、年収350〜500万円' },
      { before: '副業ゼロのフリーター', after: 'フリーランスエンジニア、月収50〜80万円' },
      { before: '営業職からの転職', after: 'インフラエンジニア、年収400〜600万円' },
    ];
  } else if (category === 'ゴルフ・フィットネス') {
    return [
      { before: 'ゴルフ歴5年で100切りが目標だったビジネスパーソン', after: '3ヶ月で安定して90台でプレー' },
      { before: '接待ゴルフが苦手だった営業職', after: 'スコア85達成でビジネスが有利に' },
      { before: 'コンペで毎回下位だった管理職', after: '6ヶ月で70台を達成、社内での評価UP' },
    ];
  } else if (category === '投資・トレード') {
    return [
      { before: '副業ゼロのサラリーマン', after: 'FXで月5〜10万円の安定収益' },
      { before: 'FX初心者で自己流の投資', after: '自己流脱却・損失ゼロへの転換' },
      { before: '投資知識ゼロのサラリーマン', after: '3ヶ月で独立したトレード判断が可能' },
    ];
  }
  return [];
}

// Generate FAQ based on category
function getFAQForCategory(category: string, schoolName: string, price: number, period: string): { q: string; a: string }[] {
  const basePrice = price === 0 ? '無料（転職成功報酬型など）' : `${formatPrice(price)}円〜`;

  if (category === 'プログラミング・IT転職') {
    return [
      { q: `${schoolName}の受講後、本当に転職できますか？`, a: `${schoolName}では転職保証やキャリアサポートが充実しています。ただし、転職成功には受講完了・ポートフォリオ作成・面接対策への主体的な取り組みが必要です。スクールは環境・サポートを提供し、最終的な成功は本人の努力次第です。` },
      { q: '給付金を使ったら実際の支払額はどのくらい？', a: `給付金対象コースなら最大70%還付されます。例えば受講料${basePrice}の場合、給付金適用で実質負担は数万〜10万円程度に抑えられます。ただし、受講前のハローワーク申請が必須で、受給にはいくつかの条件があります。` },
      { q: '働きながら受講できますか？', a: `${schoolName}はオンライン完結・自分のペースで学習できるため、働きながらの受講が可能です。ただし、平均的には週30時間程度の学習時間が必要です。本業との両立を考慮して、カリキュラムの期間を検討することをお勧めします。` },
      { q: '卒業後のキャリアサポートはありますか？', a: `${schoolName}では転職活動中のサポート・求人紹介が充実しています。卒業後3〜6ヶ月間のキャリアサポート期間が設けられているスクールがほとんどです。サポート期限を確認した上で、計画的に転職活動を進めることが大事です。` },
      { q: 'ポートフォリオ制作のサポートはありますか？', a: `${schoolName}ではポートフォリオ制作を含むカリキュラムが用意されています。実務に近いプロジェクト課題・チーム開発経験を通じて、採用面接で評価される実績を作ることができます。` },
    ];
  } else if (category === 'ゴルフ・フィットネス') {
    return [
      { q: '初心者でもパーソナルレッスンに通えますか？', a: `${schoolName}は初心者向けカリキュラムが充実しています。基礎から応用まで、個人の能力レベルに合わせた指導が特徴です。むしろ初心者ほど、早期段階で正しいフォーム・スイング理論を習得することが上達の鍵になります。` },
      { q: 'どのくらいの期間でスコア改善できますか？', a: `${schoolName}では最短3ヶ月でのスコア改善を目指します。多くの利用者は3-6ヶ月で10-20打のスコア改善を達成しています。ただし個人差があるため、初回カウンセリングで現状と目標に基づいた期間を確認することをお勧めします。` },
      { q: '1回のレッスン時間はどのくらいですか？', a: `${schoolName}の1回のレッスン時間は、通常30分〜1時間程度です。レッスン頻度・内容はコースによって異なります。高頻度・短期集中型と無制限サポート型など複数の選択肢があります。` },
      { q: 'レッスン以外に自主練習は必要ですか？', a: `レッスン以外にも、指導内容を定着させるための自主練習が効果的です。${schoolName}ではレッスン内容の復習・自主練習方法もアドバイスしており、多くの受講者がレッスン+自主練習で短期成果を達成しています。` },
    ];
  } else if (category === '投資・トレード') {
    return [
      { q: 'FX初心者でもスクールで学べますか？', a: `${schoolName}では初心者向けカリキュラムが充実しています。ただし、投資には常にリスクがあるため、資金管理・メンタル管理をしっかり学べるスクールを選ぶことが重要です。` },
      { q: '安定した利益を出すには何を学べばいい？', a: `テクニカル分析・ファンダメンタル分析・リスク管理・資金管理の4本柱を習得することが基本です。${schoolName}では実践的なトレード手法を学ぶとともに、デモトレード→少額実践を通じた経験積みが大事です。` },
      { q: 'スクール詐欺に注意するには？', a: `信頼できるスクールは「必ず儲かる」などの保証をしません。実績がある講師・評判が良いスクール・リスク説明が充実したスクールを選びましょう。無料セミナーで講師の信頼性を判断することが大切です。` },
      { q: 'いくらから投資を始められますか？', a: `FXの最小単位は業者によって異なりますが、1,000通貨単位なら数千円から始められます。ただし、スクール受講後のデモトレード→少額実践（10,000円程度）の流れが安全です。リスク管理を徹底してください。` },
    ];
  }

  return [];
}

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
    ...getFAQForCategory(school.category, school.name, school.price, school.period),
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
          {school.affiliate_url === '#' && !school.official_url ? (
            <span className="flex-1 text-center border border-gray-200 text-gray-400 py-3 rounded-xl text-sm">
              近日追加予定
            </span>
          ) : (
            <a
              href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
              target="_blank"
              rel={`noopener noreferrer nofollow${school.affiliate_url !== '#' ? ' sponsored' : ''}`}
              className="flex-1 text-center bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-500 transition-colors text-sm"
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

      {/* Languages / Skills */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">身につくスキル</h2>
        <div className="flex flex-wrap gap-2">
          {getSkillsForCategory(school.category, school.languages).map((skill) => (
            <span key={skill} className="text-sm bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1.5 rounded font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Career Paths */}
      {getCareerPathsForCategory(school.category).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">卒業後のキャリアパス例</h2>
          <div className="space-y-4">
            {getCareerPathsForCategory(school.category).map((path, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-gray-700">ビフォー:</span> {path.before}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">アフター:</span> {path.after}
                  </p>
                </div>
                <div className="shrink-0 text-lg text-sky-500">→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA After Skills */}
      {(school.affiliate_url !== '#' || school.official_url) && (
        <div className="mb-6">
          <a
            href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="block w-full text-center bg-sky-600 text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity text-lg no-underline"
          >
            {school.name}の公式サイトで詳細を確認する →
          </a>
        </div>
      )}

      {/* CTA */}
      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <p className="font-semibold text-gray-900 mb-1 text-sm">{school.name}の詳細・無料相談</p>
        <p className="text-xs text-gray-500 mb-4">料金・カリキュラムの詳細は公式サイトでご確認ください。無料カウンセリングを実施しているスクールが多いため、まず話を聞いてみることをお勧めします。</p>
        {school.affiliate_url === '#' && !school.official_url ? (
          <span className="inline-block border border-gray-200 text-gray-400 px-8 py-3 rounded-lg text-sm">
            近日追加予定
          </span>
        ) : (
          <a
            href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
            target="_blank"
            rel={`noopener noreferrer nofollow${school.affiliate_url !== '#' ? ' sponsored' : ''}`}
            className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-500 transition-colors text-sm"
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

      {/* CTA After FAQ */}
      {(school.affiliate_url !== '#' || school.official_url) && (
        <div className="mb-6">
          <a
            href={school.affiliate_url !== '#' ? school.affiliate_url : school.official_url!}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="block w-full text-center bg-sky-600 text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity text-lg no-underline"
          >
            {school.name}の公式サイトで詳細を確認する →
          </a>
        </div>
      )}

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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { courses, getCoursesByCategory, getAllCategories } from '@/lib/courses';
import CourseCard from '@/components/CourseCard';
import { columns } from '@/lib/columns';

type Props = { params: Promise<{ category: string }> };

const categoryConfig: Record<string, {
  title: string;
  description: string;
  guide: string[];
  relatedExams: string[];
  faqs: { q: string; a: string }[];
}> = {
  '国家資格': {
    title: '国家資格 通信講座 比較ランキング2026年版',
    description: '宅建・FP・社労士・行政書士など人気国家資格の通信講座を徹底比較。合格率・費用・学習スタイルで選べます。',
    guide: [
      '国家資格は合格率が低い試験が多いため、サポート体制（添削・質問対応）を重視して選ぶことが重要',
      '教育訓練給付金（最大70%補助）が使える講座かどうかを確認すると費用を大幅に節約できる',
      '試験の難易度により学習期間が大きく異なる。宅建は3〜6ヶ月、社労士・行政書士は6〜12ヶ月が目安',
      'スタディング・フォーサイト・アガルートは高い合格実績があり国家資格に特に強い',
    ],
    relatedExams: ['宅建（宅地建物取引士）', 'FP（ファイナンシャルプランナー）', '社会保険労務士', '行政書士', '日商簿記'],
    faqs: [
      { q: '国家資格の通信講座はどれが一番合格率が高いですか？', a: 'フォーサイトとアガルートが高い合格率実績で定評があります。フォーサイトは宅建・FP・社労士で全国平均の2〜3倍の合格率を公表しています。アガルートは司法試験・社労士・中小企業診断士で高い実績があります。' },
      { q: '国家資格の通信講座で給付金は使えますか？', a: 'フォーサイト・TAC・LEC・ユーキャンなど多くの主要講座が教育訓練給付金の対象です。雇用保険の加入期間（一般：1年以上、専門実践：2〜3年以上）など条件があり、受講前のハローワーク申請が必要です。' },
      { q: '宅建と社労士ではどちらが取りやすいですか？', a: '宅建（合格率15〜17%、学習200〜400時間）の方が社労士（合格率6〜8%、学習600〜1000時間）より取りやすいです。どちらも独学より通信講座を使うと合格率が大幅に上がります。初学者には宅建から始めることをおすすめします。' },
    ],
  },
  '転職・就職向け': {
    title: '転職・就職に有利な資格 通信講座 比較2026年版',
    description: 'キャリアアップ・転職に直結する資格の通信講座を比較。社労士・行政書士・FPなど転職市場で評価される資格に対応。',
    guide: [
      '転職目的なら、資格取得後のキャリア相談・求人紹介まで対応する講座を選ぶと一石二鳥',
      '取得した資格が転職先の業界・職種で評価されるかを事前に求人サイトで確認してから学習を始めよう',
      'FP・宅建・日商簿記2級は転職市場での汎用性が高く、幅広い業界で評価される入門国家資格',
      'ハローワーク経由で教育訓練給付金を申請すると受講料の最大70%が還付される',
    ],
    relatedExams: ['FP2級・3級', '宅建（宅地建物取引士）', '日商簿記2級', '社会保険労務士', '中小企業診断士'],
    faqs: [
      { q: '転職に最も有利な資格はどれですか？', a: '業界によって異なりますが、汎用性の高い資格はFP2級・宅建・日商簿記2級です。IT業界なら基本情報技術者・応用情報技術者、不動産業界なら宅建、金融・保険業界なら社労士・FPが特に評価されます。' },
      { q: '転職活動中でも資格の勉強はできますか？', a: 'はい。通信講座はスマホで隙間時間に学習できるため、転職活動と並行できます。ただし社労士・中小企業診断士など難関資格は転職活動前に取得するか、転職後に学習する方が現実的です。' },
      { q: '資格を取ってから転職するか、転職してから取得するか？', a: 'FP・簿記・宅建など比較的短期（3〜6ヶ月）で取得できる資格は転職前取得が転職成功率を高めます。社労士・行政書士など長期（1年以上）かかる資格は転職後に職場の理解を得ながら学習する方が現実的です。' },
    ],
  },
  '副業・スキルアップ': {
    title: '副業・スキルアップ向け資格 通信講座 比較2026年版',
    description: '副業収入アップ・スキルアップを目的とした資格の通信講座を比較。FP・簿記・ITパスポートなど実践的な資格に対応。',
    guide: [
      '副業目的なら、資格取得後にすぐ収入につながる実務系資格（FP・簿記・宅建）が優先度高い',
      '月額制・動画中心の通信講座は隙間時間に学習しやすく、働きながらの副業資格取得に向いている',
      'スタディングはスマートフォン完結で学習でき、通勤時間を活用して効率的に勉強できる',
      'FP3級は独学でも取得しやすく、その後2級・1級へのステップアップで副業の幅が広がる',
    ],
    relatedExams: ['FP3級・2級', '日商簿記3級・2級', 'ITパスポート', 'MOS（マイクロソフトオフィススペシャリスト）', 'ウェブデザイン技能検定'],
    faqs: [
      { q: '副業で稼げる資格はどれですか？', a: 'FP（ファイナンシャルプランナー）は2級取得後にFP相談・マネーコンサルが副業として可能です。宅建は不動産業界での副業に強い。日商簿記2級は経理・記帳代行の副業ニーズがあります。医療事務は歯科・クリニックでのパート・フリーランス案件があります。' },
      { q: '主婦・育休中でも取れる資格はありますか？', a: 'FP3級・日商簿記3級・ITパスポートはスキマ時間で学習でき、主婦や育休中でも取りやすい入門資格です。医療事務・調剤薬局事務も通信講座で取得でき、資格取得後にパート就職のニーズも高い。' },
      { q: '副業目的の資格取得に給付金は使えますか？', a: '雇用保険に加入している方は在職中でも給付金を申請できます。スタディング・フォーサイト・ユーキャンなどで対象コースがあり、受講前にハローワークで申請することで受講料の20〜70%が還付されます。' },
    ],
  },
  'IT資格': {
    title: 'IT資格 通信講座 比較ランキング2026年版',
    description: 'ITパスポート・基本情報技術者・応用情報技術者など国家IT資格の通信講座を比較。未経験からエンジニア転職を目指す方にも対応。',
    guide: [
      'IT系国家資格は経産省管轄のIPA試験が主流。ITパスポート→基本情報→応用情報の順に難易度が上がる',
      'プログラミング未経験でもITパスポート・基本情報の午前試験は通信講座で短期合格が可能',
      '応用情報・情報処理安全確保支援士は高度IT人材の証明になり、転職・昇給に直結する',
      'オンライン動画＋演習問題の組み合わせが最も効率的。スタディング・ユーキャンが実績豊富',
    ],
    relatedExams: ['ITパスポート', '基本情報技術者（FE）', '応用情報技術者（AP）', '情報処理安全確保支援士', 'AWS認定・Oracle認定'],
    faqs: [
      { q: 'ITパスポートと基本情報技術者はどちらが転職に有利ですか？', a: '転職・就職には基本情報技術者（FE）の方が評価されます。ITパスポートは「IT基礎知識の証明」として有効ですが、エンジニア採用では基本情報以上が求められることが多いです。IT未経験からの転職スタートラインとしてITパスポートを取得してから基本情報を目指す流れが一般的です。' },
      { q: 'IT資格の通信講座はどれが一番安いですか？', a: 'スタディングが最安値クラスです。ITパスポートコースは数千円から、基本情報技術者コースも2万円以下で受講できます。スマホ完結で通勤時間を活用した学習が可能です。' },
      { q: 'IT資格は独学でも合格できますか？', a: 'ITパスポートは独学でも比較的取りやすい資格です（合格率50〜60%）。基本情報技術者（合格率25〜30%）は午後の記述式・プログラミング問題があり、通信講座を使うと短期合格しやすくなります。' },
    ],
  },
};

const slugToCategory: Record<string, string> = {
  'kokukaShikaku': '国家資格',
  'tensyoku': '転職・就職向け',
  'fukugyou': '副業・スキルアップ',
  'it': 'IT資格',
};

export async function generateStaticParams() {
  return Object.keys(categoryConfig).map((cat) => {
    const slug = Object.entries(slugToCategory).find(([, v]) => v === cat)?.[0] ??
      encodeURIComponent(cat);
    return { category: slug };
  });
}

function getCategoryFromSlug(slug: string): string | undefined {
  if (slugToCategory[slug]) return slugToCategory[slug];
  return Object.keys(categoryConfig).find((cat) => encodeURIComponent(cat) === slug || cat === decodeURIComponent(slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  if (!category) return {};
  const config = categoryConfig[category];
  return {
    title: config.title,
    description: config.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  if (!category || !categoryConfig[category]) notFound();

  const config = categoryConfig[category];
  const catCourses = getCoursesByCategory(category);
  const relatedColumns = columns.filter((c) => {
    const keywords: Record<string, string[]> = {
      '国家資格': ['宅建', '行政書士', 'FP', 'fp', '簿記', '給付金'],
      '転職・就職向け': ['転職', '就職', 'キャリア'],
      '副業・スキルアップ': ['副業', 'スキル', 'fp', 'FP'],
      'IT資格': ['IT', 'プログラミング', 'エンジニア'],
    };
    return keywords[category]?.some((kw) => c.title.includes(kw) || c.description.includes(kw));
  }).slice(0, 3);

  const BASE = 'https://shikaku.lens-navi.jp';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: '講座一覧', item: `${BASE}/courses` },
          { '@type': 'ListItem', position: 3, name: category, item: `${BASE}/category/${slug}` },
        ],
      },
      ...(config.faqs ? [{
        '@type': 'FAQPage',
        mainEntity: config.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }] : []),
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/courses" className="hover:text-slate-700">講座一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{category}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
      <p className="text-gray-600 mb-6">{config.description}</p>

      {/* Guide section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-8">
        <h2 className="text-base font-bold text-slate-800 mb-3">選び方のポイント</h2>
        <ul className="space-y-2">
          {config.guide.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Related exams */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2 font-medium">対応している主な資格・試験</p>
        <div className="flex flex-wrap gap-2">
          {config.relatedExams.map((exam) => (
            <span key={exam} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
              {exam}
            </span>
          ))}
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {category}の通信講座一覧（{catCourses.length}講座）
      </h2>
      {catCourses.length === 0 ? (
        <p className="text-gray-500">現在このカテゴリの講座はありません。</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {catCourses.map((course, i) => (
            <CourseCard key={course.id} course={course} rank={i + 1} />
          ))}
        </div>
      )}

      {/* Related columns */}
      {relatedColumns.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連コラム</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedColumns.map((col) => (
              <Link
                key={col.slug}
                href={`/column/${col.slug}`}
                className="block border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <p className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{col.title}</p>
                <p className="text-xs text-slate-600 mt-2">{col.readingTime}分で読める →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {config.faqs && (
        <section className="mt-10 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {config.faqs.map(({ q, a }) => (
              <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
                <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link
        href="/courses"
        className="inline-block mt-8 border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        ← 全講座一覧を見る
      </Link>
    </div>
  );
}

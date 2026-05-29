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
}> = {
  '国家資格': {
    title: '国家資格 通信講座 比較ランキング2025年版',
    description: '宅建・FP・社労士・行政書士など人気国家資格の通信講座を徹底比較。合格率・費用・学習スタイルで選べます。',
    guide: [
      '国家資格は合格率が低い試験が多いため、サポート体制（添削・質問対応）を重視して選ぶことが重要',
      '教育訓練給付金（最大70%補助）が使える講座かどうかを確認すると費用を大幅に節約できる',
      '試験の難易度により学習期間が大きく異なる。宅建は3〜6ヶ月、社労士・行政書士は6〜12ヶ月が目安',
      'スタディング・フォーサイト・アガルートは高い合格実績があり国家資格に特に強い',
    ],
    relatedExams: ['宅建（宅地建物取引士）', 'FP（ファイナンシャルプランナー）', '社会保険労務士', '行政書士', '日商簿記'],
  },
  '転職・就職向け': {
    title: '転職・就職に有利な資格 通信講座 比較2025年版',
    description: 'キャリアアップ・転職に直結する資格の通信講座を比較。社労士・行政書士・FPなど転職市場で評価される資格に対応。',
    guide: [
      '転職目的なら、資格取得後のキャリア相談・求人紹介まで対応する講座を選ぶと一石二鳥',
      '取得した資格が転職先の業界・職種で評価されるかを事前に求人サイトで確認してから学習を始めよう',
      'FP・宅建・日商簿記2級は転職市場での汎用性が高く、幅広い業界で評価される入門国家資格',
      'ハローワーク経由で教育訓練給付金を申請すると受講料の最大70%が還付される',
    ],
    relatedExams: ['FP2級・3級', '宅建（宅地建物取引士）', '日商簿記2級', '社会保険労務士', '中小企業診断士'],
  },
  '副業・スキルアップ': {
    title: '副業・スキルアップ向け資格 通信講座 比較2025年版',
    description: '副業収入アップ・スキルアップを目的とした資格の通信講座を比較。FP・簿記・ITパスポートなど実践的な資格に対応。',
    guide: [
      '副業目的なら、資格取得後にすぐ収入につながる実務系資格（FP・簿記・宅建）が優先度高い',
      '月額制・動画中心の通信講座は隙間時間に学習しやすく、働きながらの副業資格取得に向いている',
      'スタディングはスマートフォン完結で学習でき、通勤時間を活用して効率的に勉強できる',
      'FP3級は独学でも取得しやすく、その後2級・1級へのステップアップで副業の幅が広がる',
    ],
    relatedExams: ['FP3級・2級', '日商簿記3級・2級', 'ITパスポート', 'MOS（マイクロソフトオフィススペシャリスト）', 'ウェブデザイン技能検定'],
  },
  'IT資格': {
    title: 'IT資格 通信講座 比較ランキング2025年版',
    description: 'ITパスポート・基本情報技術者・応用情報技術者など国家IT資格の通信講座を比較。未経験からエンジニア転職を目指す方にも対応。',
    guide: [
      'IT系国家資格は経産省管轄のIPA試験が主流。ITパスポート→基本情報→応用情報の順に難易度が上がる',
      'プログラミング未経験でもITパスポート・基本情報の午前試験は通信講座で短期合格が可能',
      '応用情報・情報処理安全確保支援士は高度IT人材の証明になり、転職・昇給に直結する',
      'オンライン動画＋演習問題の組み合わせが最も効率的。スタディング・ユーキャンが実績豊富',
    ],
    relatedExams: ['ITパスポート', '基本情報技術者（FE）', '応用情報技術者（AP）', '情報処理安全確保支援士', 'AWS認定・Oracle認定'],
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

  const BASE = 'https://shikaku-navi.jp';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: category, item: `${BASE}/category/${slug}` },
        ],
      },
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

      <Link
        href="/courses"
        className="inline-block mt-8 border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        ← 全講座一覧を見る
      </Link>
    </div>
  );
}

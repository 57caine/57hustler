import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { schools, getAllCategories, getSchoolsByCategory } from '@/lib/schools';
import { columns } from '@/lib/columns';
import SchoolCard from '@/components/SchoolCard';

type Props = { params: Promise<{ category: string }> };

const categoryGuide: Record<string, {
  heading: string;
  intro: string;
  points: string[];
  relatedColumns: string[];
}> = {
  '転職特化': {
    heading: '転職特化スクールを選ぶポイント',
    intro: '未経験からIT転職を目指す方向けに、転職支援・求人紹介・転職保証まで総合的にサポートするスクールを掲載しています。',
    points: [
      '転職成功率・実績数を公開しているスクールを優先する。「転職率98%」など具体的な数字に注目。',
      '転職保証（転職できなければ返金）の有無と条件を事前に確認する。応募社数・期限などの条件が現実的かをチェック。',
      '教育訓練給付金対象コースを選ぶと受講料の最大70%が戻ってくる。ハローワーク手続きが必要なため事前確認を。',
      '卒業後のサポート期間を確認する。転職活動は卒業後も数ヶ月続く場合があるため、卒業後サポートが充実しているか重要。',
    ],
    relatedColumns: ['mikeiken-engineer-tenshi', 'tensyoku-hosho-school', 'engineer-tensyoku-kikan', 'teiten-hojo-programming-school'],
  },
  'スキルアップ': {
    heading: 'スキルアップ向けスクールを選ぶポイント',
    intro: '転職以外の目的（副業・社内昇進・個人開発）でプログラミングを学びたい方向けのスクールです。',
    points: [
      '「何を作りたいか」「どのスキルが必要か」を明確にしてからスクールを選ぶ。目的なしに入学すると学習が続かない。',
      '副業を目指す場合は、ポートフォリオ制作サポートや案件獲得支援があるスクールが有利。',
      '学習形式（オンライン・動画・メンタリング）を自分のライフスタイルに合わせて選ぶ。本業との両立が重要。',
      '副業・フリーランスで稼ぎたい場合は、Webデザイン・WordPress・フロントエンドなど需要の高いスキルを優先。',
    ],
    relatedColumns: ['web-seisaku-school', 'python-programming-school', 'freelance-engineer-school'],
  },
  'フリーランス特化': {
    heading: 'フリーランス特化スクールを選ぶポイント',
    intro: 'フリーランスエンジニア・フリーランスWebデザイナーとして独立・案件獲得を目指す方向けのスクールです。',
    points: [
      '案件紹介・案件保証があるスクールを選ぶ。卒業後すぐに案件を獲得できる環境があるかが重要。',
      '単価交渉・契約書作成・営業などフリーランス特有のビジネス面のサポートがあるか確認する。',
      'ポートフォリオ制作・GitHubの整備サポートがあるスクールは独立後の案件獲得に有利。',
      '通学エリアや受講形式が自分に合っているか確認する。フリーランスは自己管理が必要なため学習スタイルも重要。',
    ],
    relatedColumns: ['freelance-engineer-school', 'web-seisaku-school'],
  },
  'AI特化': {
    heading: 'AI特化スクールを選ぶポイント',
    intro: 'AI・機械学習・データサイエンスを学び、AI領域での転職・副業・研究を目指す方向けの専門スクールです。',
    points: [
      'AI・機械学習はPythonが必須。Pythonの基礎からAIモデル構築まで一貫して学べるカリキュラムを選ぶ。',
      '数学（線形代数・統計）の基礎が必要。数学に不安がある方は入門数学サポートがあるスクールを選ぶ。',
      '実務プロジェクト・ハンズオン演習が多いスクールが就職・転職後に即戦力になりやすい。',
      'AIエンジニア・データサイエンティストの求人は東京集中。リモート対応の求人かどうかも確認する。',
    ],
    relatedColumns: ['ai-engineer-school-guide', 'python-programming-school'],
  },
  '独学支援': {
    heading: '独学支援スクールを選ぶポイント',
    intro: '費用を抑えながらプログラミングを学びたい方、まず入門として試したい方向けの低コスト学習サービスです。',
    points: [
      '無料・低価格のサービスは自己管理が重要。学習計画を自分で立て、継続する意志が必要。',
      '「プログラミングが自分に向いているか試したい」という方は、まず独学支援サービスで試してから有料スクールへの進学を検討する流れが合理的。',
      'コミュニティや質問できる場（Discord・Slack）があるサービスは学習継続率が上がりやすい。',
      '独学後に転職・副業を目指す場合は、ポートフォリオの質が重要。作品レビューサービスがあるものを選ぶ。',
    ],
    relatedColumns: ['dokugaku-vs-school'],
  },
};

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: encodeURIComponent(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const guide = categoryGuide[decoded];
  return {
    title: `${decoded}のプログラミングスクール比較【2025年版】`,
    description: guide?.intro ?? `${decoded}に特化したプログラミングスクールを比較。料金・特徴・転職成功率を一覧で確認できます。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const catSchools = getSchoolsByCategory(decoded);
  if (catSchools.length === 0) notFound();

  const guide = categoryGuide[decoded];
  const relatedCols = guide?.relatedColumns
    ? columns.filter((c) => guide.relatedColumns.includes(c.slug))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/schools" className="hover:text-slate-700">スクール一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{decoded}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{decoded}のプログラミングスクール</h1>
      <p className="text-gray-600 mb-8">{catSchools.length}校掲載。料金・特徴・対象者を比較できます。</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {catSchools.map((school, i) => (
          <SchoolCard key={school.slug} school={school} rank={i + 1} />
        ))}
      </div>

      {guide && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{guide.heading}</h2>
          <p className="text-sm text-gray-600 mb-4">{guide.intro}</p>
          <ul className="space-y-2">
            {guide.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-gray-700">
                <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{point}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedCols.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連コラム</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedCols.map((col) => (
              <Link key={col.slug} href={`/column/${col.slug}`} className="group block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-slate-700">{col.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{col.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">他のカテゴリを見る</h2>
        <div className="flex flex-wrap gap-3">
          {getAllCategories().filter((c) => c !== decoded).map((c) => (
            <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm hover:border-slate-300 hover:text-slate-700 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { schools, getAllCategories, getSchoolsByCategory } from '@/lib/schools';
import { columns } from '@/lib/columns';
import SchoolCard from '@/components/SchoolCard';

type Props = { params: Promise<{ category: string }> };

const BASE = 'https://school.lens-navi.jp';

const categoryGuide: Record<string, {
  heading: string;
  intro: string;
  points: string[];
  relatedColumns: string[];
  faqs: { q: string; a: string }[];
}> = {
  'プログラミング・IT転職': {
    heading: 'プログラミング・IT転職スクールを選ぶポイント',
    intro: 'プログラミングを学んでITエンジニアへの転職・副業・フリーランスを目指す方向けのスクール比較。給付金対象コースや転職保証付きスクールも掲載。',
    faqs: [
      { q: '転職保証があるプログラミングスクールはどこですか？', a: 'TECH CAMP・DMM WEBCAMP・侍エンジニア塾・GEEK JOBなどが転職保証（転職できなければ返金）を提供しています。各スクールで条件（応募社数・期限など）が異なるため、事前に確認してください。' },
      { q: '未経験からIT転職するのにどれくらいかかりますか？', a: '一般的に学習開始〜内定まで6〜12ヶ月が目安です。スクール受講が3〜6ヶ月、転職活動が2〜4ヶ月の流れが多いです。転職特化スクールは転職活動のサポートが充実しており短期内定取得を目指せます。' },
      { q: '転職特化スクールで給付金は使えますか？', a: 'TECH CAMP・DMM WEBCAMP・TechAcademy・侍エンジニア塾などが教育訓練給付金（専門実践教育訓練）の指定講座を提供しています。雇用保険の加入期間（2〜3年以上）など条件があり、受講前のハローワーク申請が必要です。' },
    ],
    points: [
      '転職成功率・実績数を公開しているスクールを優先する。「転職率98%」など具体的な数字に注目。',
      '転職保証（転職できなければ返金）の有無と条件を事前に確認する。応募社数・期限などの条件が現実的かをチェック。',
      '教育訓練給付金対象コースを選ぶと受講料の最大70%が戻ってくる。ハローワーク手続きが必要なため事前確認を。',
      '卒業後のサポート期間を確認する。転職活動は卒業後も数ヶ月続く場合があるため、卒業後サポートが充実しているか重要。',
    ],
    relatedColumns: ['mikeiken-engineer-tenshi', 'tensyoku-hosho-school', 'engineer-tensyoku-kikan', 'teiten-hojo-programming-school'],
  },
  'ゴルフ・フィットネス': {
    heading: 'ゴルフ・フィットネススクールを選ぶポイント',
    intro: 'ゴルフのスコアアップを短期間で実現するパーソナルレッスン・スクール比較。ビジネスゴルフにも対応。',
    faqs: [
      { q: 'パーソナルゴルフレッスンでどのくらい上達しますか？', a: 'RIZAP GOLFなどのパーソナルレッスンは、最短3ヶ月でスイング改善・スコアアップを実現します。個人の能力差がありますが、多くの利用者は3-6ヶ月で10-20打のスコア改善を達成しています。' },
      { q: 'ゴルフレッスンの料金はどのくらいですか？', a: 'パーソナルレッスンは16回コース（2ヶ月）で30〜50万円程度が目安です。格安スクールは月1-2万円程度からありますが、専属トレーナーサポートがある高級スクールは10-50万円と幅広い選択肢があります。' },
      { q: '初心者でもパーソナルレッスンに通えますか？', a: 'はい。むしろ初心者ほどパーソナルレッスンが有効です。早期段階で正しいフォームを習得することで、その後の上達が大きく変わります。接待ゴルフが必要な方も初心者ウェルカムなスクールが多いです。' },
    ],
    points: [
      '専属トレーナー制を採用しているスクールを選ぶ。一貫性のある指導が上達を加速させます。',
      'スコア保証・返金制度があるスクールを優先。成果にコミットしたスクールの方が上達が早いです。',
      '通学の手軽さ（自宅・職場から近い）を重視。継続できるかどうかが上達の鍵です。',
      'ビジネスゴルフが必要な場合は、マナー・戦略指導も含まれるスクールを確認。',
    ],
    relatedColumns: [],
  },
  '投資・トレード': {
    heading: '投資・トレードスクールを選ぶポイント',
    intro: 'FX・株式投資のトレード技術を学べるスクール・勉強会の比較。初心者から実践まで対応。',
    faqs: [
      { q: 'FXトレード初心者でもスクールで学べますか？', a: 'はい。多くのFXスクールが初心者向けカリキュラムを用意しています。ただし、投資には常にリスクがあるため、資金管理・メンタル管理をしっかり学べるスクールを選ぶことが重要です。' },
      { q: 'FXで安定した利益を出すにはどうしたらいいですか？', a: 'テクニカル分析・ファンダメンタル分析・リスク管理・資金管理の4本柱を習得することが基本です。スクールで実践的なトレード手法を学び、デモトレード→少額実践を通じて経験を積む流れが効果的です。' },
      { q: 'FXスクールの詐欺に注意するには？', a: '「必ず儲かる」などの保証がないか確認。信頼できるスクールは、リスク・損失可能性を明確に説明します。実績がある講師・評判が良いスクールを選び、無料セミナーで講師の信頼性を判断することが大切です。' },
    ],
    points: [
      'テクニカル分析・ファンダメンタル分析・リスク管理を3本柱として学べるスクールを選ぶ。',
      '講師の実績・トレード履歴が公開されているスクールを優先。実績がない講師から学ぶのは避ける。',
      'デモトレード・少額実践サポートがあるスクールが実践的。いきなり大きく投資しない。',
      '損失可能性・リスク説明が充実しているスクールを選ぶ。「必ず儲かる」は詐欺の可能性。',
    ],
    relatedColumns: [],
  },
  '資格・オンライン学習': {
    heading: '資格・オンライン学習スクールを選ぶポイント',
    intro: '資格取得に向けたオンライン講座・通信教育の比較。コスパ重視の方向け。',
    faqs: [
      { q: 'オンラインスクールで資格取得できますか？', a: 'はい。多くの資格がオンライン学習で対応可能です。ただし、試験受験には指定会場での受験が必要な場合がほとんどです。オンラインスクールは学習サポート・講座提供であり、試験受験のサポートではない点に注意。' },
      { q: 'オンライン資格講座と通学講座の違いは何ですか？', a: 'オンライン講座はコスト・時間の自由度が高く、通学講座は質問対応・対面指導が充実している傾向があります。独学力がある方にはオンライン、講師の指導を受けたい方には通学がおすすめです。' },
      { q: '低コストで資格取得できるスクールはどこですか？', a: 'オンスク.JPなどの格安プラットフォーム（月額1,000〜2,000円程度）から、10万円超の本格的なスクールまで幅広い選択肢があります。取得目指す資格・学習スタイルで選ぶことが重要。' },
    ],
    points: [
      '月額課金型 vs 買い切り型を比較。短期取得目指すなら買い切り、複数資格取得なら月額が有利。',
      '講師の質問対応時間・サポート体制を確認。独学に不安があれば充実したサポートのスクールを選ぶ。',
      '過去問・模試が充実しているスクールを選ぶ。試験本番の準備レベルが大きく変わります。',
      '合格実績・合格率を公開しているスクールが信頼できる。',
    ],
    relatedColumns: [],
  },
  'クリエイティブ・デザイン': {
    heading: 'クリエイティブ・デザインスクールを選ぶポイント',
    intro: 'デザイン・動画編集・クリエイティブスキルを習得できるスクール比較。',
    faqs: [
      { q: '動画編集・デザインは独学でも習得できますか？', a: '動画編集・デザインは独学でも習得可能ですが、プロレベルのスキルを短期間で身につけるにはスクールが有効です。案件獲得・ポートフォリオ作成のサポートがあるスクールなら、卒業後の収入化がスムーズです。' },
      { q: 'クリエイティブスキルで副業・フリーランスになれますか？', a: 'はい。動画編集・Webデザイン・グラフィックデザインは高単価案件が多く、フリーランス人気の職種です。クラウドソーシング・エージェント経由で案件を獲得できます。' },
      { q: '初心者からクリエイターになるまでどのくらい？', a: 'スクール受講（3-6ヶ月）→ポートフォリオ作成（1-2ヶ月）→案件獲得で、合計6-9ヶ月が目安。実務経験を積むことで単価が上がります。' },
    ],
    points: [
      'Adobe Creative Cloud（Photoshop・Premiere Proなど）の実践的なスキルが学べるスクール選ぶ。',
      'ポートフォリオ制作サポート・案件紹介があるスクール優先。卒業後の収入化が関わります。',
      '動画・デザイン市場のトレンド・実践的案件に基づいたカリキュラムが大事。',
      'コミュニティ・卒業生ネットワークが活発なスクールは案件情報が多い。',
    ],
    relatedColumns: [],
  },
  '音楽': {
    heading: '音楽スクールを選ぶポイント',
    intro: '音楽・楽器レッスンのスクール比較。大人の趣味から本格的な学習まで。',
    faqs: [
      { q: '大人からでも音楽・楽器は習える？', a: 'はい。むしろ大人向けレッスンを専門とするスクールが多いです。目標（趣味・プロを目指す等）に合わせたカリキュラムが用意されているスクールが多くあります。' },
      { q: 'マンツーマンレッスンとグループレッスンどちらが良い？', a: 'マンツーマンは個人の進度に合わせた指導が受けられ、グループレッスンは同じ目標を持つ仲間との学習が楽しい。予算・学習スタイルで選ぶことが重要。' },
      { q: '楽器購入は必須ですか？', a: 'スクールでの無料レンタル・購入支援をしているスクールがほとんど。最初は気軽に始められます。' },
    ],
    points: [
      'プロ講師が指導しているスクール選ぶ。現役ミュージシャン・プロの指導が上達を加速させます。',
      'レッスン時間・頻度の柔軟性。仕事・趣味の両立ができるスクール選ぶ。',
      '楽器レンタル・購入支援があるスクール優先。初期投資を抑えられます。',
      'コミュニティ・発表会がスクール。モチベーション維持・スキル確認が可能。',
    ],
    relatedColumns: [],
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
    title: `${decoded}のプログラミングスクール比較【2026年版】`,
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

  const jsonLd = guide?.faqs ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'スクール一覧', item: `${BASE}/schools` },
          { '@type': 'ListItem', position: 3, name: decoded, item: `${BASE}/category/${encodeURIComponent(decoded)}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  } : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
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

      {guide?.faqs && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {guide.faqs.map(({ q, a }) => (
              <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
                <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

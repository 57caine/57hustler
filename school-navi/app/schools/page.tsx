import { Metadata } from 'next';
import { schools, getAllCategories } from '@/lib/schools';
import SchoolCard from '@/components/SchoolCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プログラミングスクール一覧【2026年版・全14校】| スクールナビ',
  description: 'プログラミングスクール14校を一覧で比較。転職特化・スキルアップ・フリーランス特化・AI特化など目的別に検索できます。料金・期間・給付金対応・転職成功率を掲載。',
};

const listFaqs = [
  {
    q: '転職保証があるプログラミングスクールはどこですか？',
    a: 'TECH CAMP・DMM WEBCAMP・侍エンジニア塾・GEEK JOBなどが転職保証（転職できなければ全額返金）を提供しています。条件は各スクールで異なり、一定期間内での求職活動・受講完了・ポートフォリオ作成などが必要です。',
  },
  {
    q: '給付金が使えるプログラミングスクールはどこですか？',
    a: 'TECH CAMP・DMM WEBCAMP・TechAcademy・侍エンジニア塾などが教育訓練給付金（専門実践教育訓練）の指定講座を提供しています。給付金を使うには受講前にハローワークでの申請が必要で、雇用保険の加入期間（2〜3年以上）も条件になります。',
  },
  {
    q: '未経験でも入れるプログラミングスクールはどこですか？',
    a: '掲載している14校すべてが未経験者歓迎です。特にTECH CAMP・DMM WEBCAMP・GEEK JOBは未経験から転職を目指す方に特化したカリキュラムを提供しており、プログラミングの基礎から転職活動まで一貫したサポートを受けられます。',
  },
];

export default function SchoolsPage() {
  const categories = getAllCategories();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: listFaqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">スクール一覧</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">プログラミングスクール一覧</h1>
      <p className="text-gray-600 mb-8">全{schools.length}校を掲載。料金・転職成功率・給付金対応で比較できます。</p>

      {categories.map((category) => {
        const catSchools = schools.filter((s) => s.category === category);
        return (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catSchools.map((school) => (
                <SchoolCard key={school.slug} school={school} />
              ))}
            </div>
          </section>
        );
      })}

      {/* FAQ Section */}
      <section className="mt-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">よくある質問</h2>
        <div className="space-y-4">
          {listFaqs.map(({ q, a }) => (
            <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="font-bold text-gray-900 mb-2">Q. {q}</p>
              <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-4">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載料金は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { getSchoolsByCategory, getAllCategories, getCategoryUrl } from '@/lib/schools';
import SchoolCard from '@/components/SchoolCard';

const BASE = 'https://school.lens-navi.jp';
const CATEGORY = '音楽';

export const metadata: Metadata = {
  title: '音楽スクール比較【2026年版】 | ボーカル・楽器レッスン',
  description: '音楽・楽器レッスンのスクール比較。大人の趣味から本格的な学習まで対応。料金・特徴・対象者を一覧で確認できます。',
  alternates: { canonical: `${BASE}/category/music` },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'スクール一覧', item: `${BASE}/schools` },
        { '@type': 'ListItem', position: 3, name: '音楽', item: `${BASE}/category/music` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '大人からでも音楽・楽器は習える？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'はい。むしろ大人向けレッスンを専門とするスクールが多いです。目標（趣味・プロを目指す等）に合わせたカリキュラムが用意されているスクールが多くあります。',
          },
        },
        {
          '@type': 'Question',
          name: 'マンツーマンレッスンとグループレッスンどちらが良い？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'マンツーマンは個人の進度に合わせた指導が受けられ、グループレッスンは同じ目標を持つ仲間との学習が楽しい。予算・学習スタイルで選ぶことが重要。',
          },
        },
        {
          '@type': 'Question',
          name: '楽器購入は必須ですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'スクールでの無料レンタル・購入支援をしているスクールがほとんど。最初は気軽に始められます。',
          },
        },
      ],
    },
  ],
};

export default function MusicCategoryPage() {
  const catSchools = getSchoolsByCategory(CATEGORY);
  const otherCategories = getAllCategories().filter((c) => c !== CATEGORY);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/schools" className="hover:text-slate-700">スクール一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">音楽</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">音楽スクール</h1>
      <p className="text-gray-600 mb-8">{catSchools.length}校掲載。料金・特徴・対象者を比較できます。</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {catSchools.map((school, i) => (
          <SchoolCard key={school.slug} school={school} rank={i + 1} />
        ))}
      </div>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">音楽スクールを選ぶポイント</h2>
        <p className="text-sm text-gray-600 mb-4">音楽・楽器レッスンのスクール比較。大人の趣味から本格的な学習まで。</p>
        <ul className="space-y-2">
          {[
            'プロ講師が指導しているスクール選ぶ。現役ミュージシャン・プロの指導が上達を加速させます。',
            'レッスン時間・頻度の柔軟性。仕事・趣味の両立ができるスクール選ぶ。',
            '楽器レンタル・購入支援があるスクール優先。初期投資を抑えられます。',
            'コミュニティ・発表会があるスクール。モチベーション維持・スキル確認が可能。',
          ].map((point) => (
            <li key={point} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{point}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">他のカテゴリを見る</h2>
        <div className="flex flex-wrap gap-3">
          {otherCategories.map((c) => (
            <Link key={c} href={getCategoryUrl(c)} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm hover:border-slate-300 hover:text-slate-700 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '大人からでも音楽・楽器は習える？', a: 'はい。むしろ大人向けレッスンを専門とするスクールが多いです。目標（趣味・プロを目指す等）に合わせたカリキュラムが用意されているスクールが多くあります。' },
            { q: 'マンツーマンレッスンとグループレッスンどちらが良い？', a: 'マンツーマンは個人の進度に合わせた指導が受けられ、グループレッスンは同じ目標を持つ仲間との学習が楽しい。予算・学習スタイルで選ぶことが重要。' },
            { q: '楽器購入は必須ですか？', a: 'スクールでの無料レンタル・購入支援をしているスクールがほとんど。最初は気軽に始められます。' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
              <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-8">
        ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値です。最新情報は各スクール公式サイトでご確認ください。
      </p>
    </div>
  );
}

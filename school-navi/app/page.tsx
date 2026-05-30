import { Metadata } from 'next';
import Link from 'next/link';
import { schools, getHighlightedSchools, formatPrice, getAllCategories } from '@/lib/schools';
import { columns } from '@/lib/columns';
import SchoolCard from '@/components/SchoolCard';

export const metadata: Metadata = {
  title: 'プログラミングスクール比較ランキング2025年版｜おすすめ14校を徹底比較',
  description: 'TECH CAMP・DMM WEBCAMP・侍エンジニア塾・RaiseTechなど人気プログラミングスクール14校を料金・転職実績・給付金対応で徹底比較。未経験からIT転職・副業・フリーランスを目指す方向け完全ガイド。',
};

const homeFaqs = [
  {
    q: 'プログラミングスクールと独学どちらが良いですか？',
    a: '転職を目指す場合はスクールが有利です。独学は費用を抑えられますが、ポートフォリオ作成・面接対策・転職サポートが自己責任になります。スクールは20〜40万円かかりますが、給付金（最大70%還付）を活用すると実質8〜12万円程度に抑えられます。挫折率も独学の方が高い傾向があります。',
  },
  {
    q: 'プログラミングスクールで給付金を使える条件は何ですか？',
    a: '雇用保険に一定期間加入していること（一般：1年以上、専門実践：2〜3年以上）と、厚生労働大臣指定の講座を受講することが必要です。受講開始前にハローワークで受給資格確認と申請を行う必要があります。在職中でも受給可能なので、退職前に手続きを進めることを推奨します。',
  },
  {
    q: '未経験からエンジニア転職は何ヶ月かかりますか？',
    a: '一般的に学習開始〜内定まで6〜12ヶ月が目安です。スクール受講（3〜6ヶ月）+転職活動（2〜4ヶ月）の流れが多いです。転職特化スクール（TECH CAMP・DMM WEBCAMPなど）は転職支援が充実しており、短期での内定取得をサポートしています。',
  },
];

export default function HomePage() {
  const highlighted = getHighlightedSchools();
  const topColumns = columns.slice(0, 3);
  const subsidySchools = schools.filter((s) => s.features.includes('給付金対象'));

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'スクールナビ',
      url: 'https://nsplot.com',
      description: 'プログラミングスクールを比較するサイト',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-widest">Programming School Navigator</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-white">
            プログラミングスクール<br />
            <span className="text-slate-300">徹底比較ガイド 2025年版</span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-xl text-sm leading-relaxed">
            TECH CAMP・DMM WEBCAMP など{schools.length}校を料金・転職実績・給付金対応で客観的に比較。
            編集部が実際の情報を調査・検証して掲載しています。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/schools" className="inline-block bg-white text-slate-900 font-bold px-7 py-3 rounded-lg hover:bg-slate-100 transition-colors text-sm text-center">
              スクール一覧を見る
            </Link>
            <Link href="/compare" className="inline-block border border-slate-600 text-slate-300 font-medium px-7 py-3 rounded-lg hover:border-slate-400 hover:text-white transition-colors text-sm text-center">
              比較表で見る
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-800 text-slate-300 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 text-sm">
          <span><strong className="text-white">{schools.length}校</strong> を掲載</span>
          <span><strong className="text-white">{subsidySchools.length}校</strong> が給付金対象</span>
          <span>最終更新: <strong className="text-white">2026年5月</strong></span>
        </div>
      </section>

      {/* Pickup Schools */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">編集部ピックアップ</h2>
            <p className="text-sm text-gray-500 mt-1">転職実績・料金・サポート体制を総合的に評価</p>
          </div>
          <Link href="/schools" className="text-sm text-slate-600 hover:text-slate-900 hover:underline">全{schools.length}校を見る</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {highlighted.map((school, i) => (
            <SchoolCard key={school.slug} school={school} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Category navigation */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-5">目的から探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '転職・就職を目指す', href: '/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96', desc: '転職保証・内定サポートあり' },
              { label: 'スキルアップ', href: '/category/%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97', desc: '副業・現職スキル強化' },
              { label: 'フリーランス独立', href: '/category/%E3%83%95%E3%83%AA%E3%83%BC%E3%83%A9%E3%83%B3%E3%82%B9%E7%89%B9%E5%8C%96', desc: '案件獲得サポートあり' },
              { label: 'AI・機械学習', href: '/category/AI%E7%89%B9%E5%8C%96', desc: 'ChatGPT・DX人材育成' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-gray-800 text-sm mb-1">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subsidy info */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="border border-gray-200 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shrink-0">制度解説</div>
            <h2 className="text-lg font-bold text-gray-900">教育訓練給付金で受講料が最大70%戻る</h2>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">
            雇用保険に一定期間加入していれば、厚生労働大臣が指定した講座を修了することで受講料の20〜70%が支給されます。
            条件を満たす方が対象で、申請は受講前のハローワーク手続きが必要です。
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {subsidySchools.map((s) => (
              <Link key={s.slug} href={`/schools/${s.slug}`} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(s.price)}〜</p>
                </div>
                <span className="text-xs border border-slate-300 text-slate-600 px-2 py-0.5 rounded">給付金対象</span>
              </Link>
            ))}
          </div>
          <Link href="/column/teiten-hojo-programming-school" className="text-sm text-slate-700 hover:underline font-medium">
            給付金制度の詳しい解説を読む →
          </Link>
        </div>
      </section>

      {/* Columns */}
      <section className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">スクール選びに役立つ記事</h2>
            <Link href="/column" className="text-sm text-slate-600 hover:underline">すべての記事</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {topColumns.map((col) => (
              <Link key={col.slug} href={`/column/${col.slug}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded mb-3 inline-block">{col.category}</span>
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">{col.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{col.description}</p>
                <p className="text-xs text-gray-400 mt-3">更新: {col.updatedAt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial policy */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3">掲載基準・編集ポリシー</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            スクールナビは、各スクールの公式情報・利用者の声・編集部の独自調査をもとに掲載内容を作成しています。
            掲載順位は広告費用に左右されず、料金・転職実績・カリキュラム内容・サポート体制を総合的に評価して決定しています。
            情報は定期的に更新していますが、最新の料金・内容は各スクール公式サイトでご確認ください。
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
          ※ 当サイトはアフィリエイト広告を掲載しています。スクールリンクから申し込まれた場合、当サイトに手数料が発生することがあります。掲載情報は参考値であり、最新の料金・内容は各スクール公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { schools, getHighlightedSchools, formatPrice } from '@/lib/schools';
import { columns } from '@/lib/columns';
import SchoolCard from '@/components/SchoolCard';

export default function HomePage() {
  const highlighted = getHighlightedSchools();
  const topColumns = columns.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-medium mb-3">プログラミングスクール比較サイト</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            未経験からエンジニア転職<br className="md:hidden" />を目指す人のための<br />
            スクール比較サイト
          </h1>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            TECH CAMP・DMM WEBCAMPなど<strong>人気8校</strong>を料金・転職成功率・給付金対応で徹底比較。あなたに最適なスクールが見つかります。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/schools" className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors">
              スクール一覧を見る
            </Link>
            <Link href="/compare" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors">
              スクールを比較する
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: `${schools.length}校`, label: '掲載スクール数' },
            { value: '最大70%', label: '給付金割引' },
            { value: '無料', label: '掲載情報すべて' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Schools */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⭐ おすすめスクール</h2>
          <Link href="/schools" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {highlighted.map((school, i) => (
            <SchoolCard key={school.slug} school={school} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">目的から探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '転職・就職', icon: '🏢', href: '/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96', desc: '転職保証あり' },
              { label: 'スキルアップ', icon: '📈', href: '/category/%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97', desc: '副業・学習' },
              { label: 'フリーランス', icon: '🖥️', href: '/category/%E3%83%95%E3%83%AA%E3%83%BC%E3%83%A9%E3%83%B3%E3%82%B9%E7%89%B9%E5%8C%96', desc: '案件獲得まで' },
              { label: 'AI・機械学習', icon: '🤖', href: '/category/AI%E7%89%B9%E5%8C%96', desc: 'ChatGPT活用' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all text-center"
              >
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="font-bold text-gray-800 text-sm">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison Banner */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💰 給付金を使えば最大70%OFF</h2>
          <p className="text-gray-600 mb-5 text-sm">教育訓練給付金制度を活用すれば、受講料の最大70%が国から支給されます。条件を満たせばほぼ誰でも利用できます。</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {schools.filter((s) => s.features.includes('給付金対象')).map((s) => (
              <div key={s.slug} className="bg-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(s.price)}〜</p>
                </div>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">給付金対象</span>
              </div>
            ))}
          </div>
          <Link href="/column/teiten-hojo-programming-school" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
            給付金の詳細を見る →
          </Link>
        </div>
      </section>

      {/* Columns */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">📚 スクール選びに役立つコラム</h2>
            <Link href="/column" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {topColumns.map((col) => (
              <Link key={col.slug} href={`/column/${col.slug}`} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mb-3 inline-block">{col.category}</span>
                <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">{col.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{col.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 当サイトはアフィリエイト広告を掲載しています。スクールリンクから申し込まれた場合、当サイトに手数料が発生することがあります。掲載情報は参考値であり、最新の料金・内容は各スクール公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

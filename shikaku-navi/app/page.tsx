import Link from 'next/link';
import { courses, getHighlightedCourses, formatPrice, getSubsidyCourses } from '@/lib/courses';
import { columns } from '@/lib/columns';
import CourseCard from '@/components/CourseCard';

export default function HomePage() {
  const highlighted = getHighlightedCourses();
  const topColumns = columns.slice(0, 3);
  const subsidyCourses = getSubsidyCourses();

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-widest">Qualification School Navigator</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-white">
            資格取得で年収・キャリアアップ<br />
            <span className="text-slate-300">通信講座 徹底比較ガイド 2025年版</span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-xl text-sm leading-relaxed">
            スタディング・フォーサイト・アガルートなど{courses.length}講座を費用・合格率・学習スタイルで客観的に比較。
            宅建・簿記・FP・社労士・行政書士などの国家資格対策講座を厳選紹介。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/courses" className="inline-block bg-white text-slate-900 font-bold px-7 py-3 rounded-lg hover:bg-slate-100 transition-colors text-sm text-center">
              講座一覧を見る
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
          <span><strong className="text-white">{courses.length}講座</strong> を掲載</span>
          <span><strong className="text-white">{subsidyCourses.length > 0 ? subsidyCourses.length : '複数'}講座</strong> が給付金対象</span>
          <span>最終更新: <strong className="text-white">2025年6月</strong></span>
        </div>
      </section>

      {/* Pickup Courses */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">編集部ピックアップ</h2>
            <p className="text-sm text-gray-500 mt-1">費用・合格率・サポート体制を総合的に評価</p>
          </div>
          <Link href="/courses" className="text-sm text-slate-600 hover:text-slate-900 hover:underline">全{courses.length}講座を見る</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {highlighted.map((course, i) => (
            <CourseCard key={course.slug} course={course} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Exam category navigation */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-5">試験・資格から探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '宅建（宅地建物取引士）', href: '/courses', desc: '不動産業界の必須国家資格' },
              { label: '日商簿記 2・3級', href: '/courses', desc: '経理・会計の定番資格' },
              { label: 'FP 2・3級', href: '/courses', desc: '金融・保険業界で活躍' },
              { label: 'IT資格（ITパスポート）', href: '/courses', desc: 'IT基礎知識の証明' },
              { label: '中小企業診断士', href: '/courses', desc: '経営コンサルの国家資格' },
              { label: '社会保険労務士', href: '/courses', desc: '人事・労務の専門家' },
              { label: '行政書士', href: '/courses', desc: '法律系・独立も可能' },
              { label: '基本情報技術者', href: '/courses', desc: 'ITエンジニアの登竜門' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-gray-800 text-sm mb-1 leading-snug">{cat.label}</p>
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
            <h2 className="text-lg font-bold text-gray-900">教育訓練給付金で受講料が最大20〜70%戻る</h2>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">
            雇用保険に一定期間加入していれば、厚生労働大臣が指定した資格講座を修了することで受講料の20〜70%が支給されます。
            フォーサイトなど給付金対象講座を選べば実質負担を大幅に抑えられます。申請はハローワークへの事前手続きが必要です。
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">給付金対象の主な資格講座</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                { name: 'フォーサイト', note: '宅建・簿記・社労士など' },
                { name: 'TAC', note: '中小企業診断士・簿記など' },
                { name: 'LEC東京リーガルマインド', note: '行政書士・社労士など' },
                { name: 'ユーキャン', note: '各種国家資格（一部対象）' },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between border border-slate-200 bg-white rounded-lg p-3">
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.note}</p>
                  </div>
                  <span className="text-xs border border-slate-300 text-slate-600 px-2 py-0.5 rounded shrink-0">給付金対象</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/column/shikaku-hikaku-online" className="text-sm text-slate-700 hover:underline font-medium">
            給付金対象講座の詳しい解説を読む →
          </Link>
        </div>
      </section>

      {/* Columns */}
      <section className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">資格取得に役立つ記事</h2>
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
            資格ナビは、各資格通信講座の公式情報・受講者の声・編集部の独自調査をもとに掲載内容を作成しています。
            掲載順位は広告費用に左右されず、費用・合格率・カリキュラム内容・サポート体制を総合的に評価して決定しています。
            情報は定期的に更新していますが、最新の料金・内容は各講座公式サイトでご確認ください。
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
          ※ 当サイトはアフィリエイト広告を掲載しています。講座リンクから申し込まれた場合、当サイトに手数料が発生することがあります。掲載情報は参考値であり、最新の料金・内容は各講座公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

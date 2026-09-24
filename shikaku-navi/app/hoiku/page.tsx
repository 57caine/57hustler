import { hoikuServices, getMainService, getServiceBySlug } from '@/lib/hoiku/services';
import { hoikuCases } from '@/lib/hoiku/cases';
import { HOIKU_LAST_UPDATED } from '@/lib/hoiku/config';
import HoikuCompareTable from '@/components/hoiku/HoikuCompareTable';
import HoikuAffiliateButton from '@/components/hoiku/HoikuAffiliateButton';

// 保育士転職ナビ トップ（骨格）
// 構成: ①ヒーロー＋比較サマリー表 ②保育士バンク！深掘り ③比較ランキング ④悩み別・目的別
// ※ 【仮】【要確認】【ダミー】の表記がある箇所は、公開前に必ず差し替えること

// 口コミ枠（骨格段階のダミー）
// 実在の利用者の声として読める文章を創作して載せるのは、景品表示法・ステマ規制上のリスクが高い。
// 掲載する場合は、出典（公式サイト掲載の声・自社アンケート等）を明記した実データに差し替える。
const reviewSlots = [
  { label: '良かった点', body: '【ダミー】出典つきの口コミ（良かった点）をここに掲載' },
  { label: '良かった点', body: '【ダミー】出典つきの口コミ（良かった点）をここに掲載' },
  { label: '気になった点', body: '【ダミー】出典つきの口コミ（気になった点）をここに掲載' },
];

export default function HoikuTopPage() {
  const main = getMainService();
  const ranked = [...hoikuServices].sort((a, b) => a.rank - b.rank);

  return (
    <div>
      {/* PR表記（ステマ規制対応：ページ冒頭で広告を含むことを明示） */}
      <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2">
        <p className="max-w-5xl mx-auto">【PR】本ページはアフィリエイト広告を利用しています。</p>
      </div>

      {/* ① ヒーロー */}
      <section className="bg-gradient-to-br from-sky-500 to-blue-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-100 text-xs font-medium mb-3">最終更新: {HOIKU_LAST_UPDATED}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            保育士の転職サイト比較
            <br />
            <span className="text-sky-100 text-2xl md:text-3xl">迷ったら「{main.name}」から始めよう</span>
          </h1>
          <p className="text-sky-100 mb-8 max-w-2xl text-sm leading-relaxed">
            保育士向けの転職サービスは、担当者が付く「転職エージェント型」と、自分で探す「求人サイト型」に分かれます。
            このページでは{main.name}を中心に、主要サービスの特徴・対応エリア・サポート内容を比較し、目的別の選び方を紹介します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <HoikuAffiliateButton service={main} variant="inverse" />
            <a
              href="#compare"
              className="inline-flex items-center justify-center border border-white/40 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              比較表を見る
            </a>
          </div>
        </div>
      </section>

      {/* ① 主要サービス比較サマリー表 */}
      <section id="compare" className="max-w-5xl mx-auto px-4 py-12 scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">主要な保育士転職サービス比較表</h2>
        <p className="text-sm text-gray-500 mb-6">列名をタップすると並べ替えできます。</p>
        <HoikuCompareTable services={hoikuServices} />
        <p className="text-xs text-gray-400 mt-3">
          ※「要確認」の項目は各サービス公式サイトの情報を確認のうえ掲載予定です。
        </p>
      </section>

      {/* ② 保育士バンク！深掘り */}
      <section id="hoikushibank" className="bg-white border-y border-gray-200 scroll-mt-28">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="text-sky-700 text-sm font-bold mb-1">編集部イチオシ</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{main.name}とは？特徴と使い方</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">{main.catchCopy}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { title: '特徴', body: `【仮】${main.type}。保育業界に特化した転職支援サービスです。（詳細は要確認）` },
              { title: '対応地域', body: main.area },
              { title: 'サポート内容', body: main.support },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">こんな人に向いています</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {main.goodFor.map((g) => (
                  <li key={g} className="flex gap-2"><span className="text-sky-600">✓</span>{g}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">注意しておきたい点</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {main.caution.map((c) => (
                  <li key={c} className="flex gap-2"><span className="text-gray-400">・</span>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-3">利用者の口コミ</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-3">
            {reviewSlots.map((r, i) => (
              <div key={i} className="rounded-xl bg-gray-50 border border-dashed border-gray-300 p-5">
                <p className="text-xs font-bold text-gray-500 mb-2">{r.label}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{r.body}</p>
                <p className="text-xs text-gray-400 mt-3">出典：【要記入】</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-8">※口コミは出典を明記したうえで掲載します。</p>

          <div className="rounded-xl bg-sky-50 p-6 text-center">
            <p className="text-sm text-gray-700 mb-4">登録は無料（要確認）。まずは希望エリアの求人をチェックしてみましょう。</p>
            <HoikuAffiliateButton service={main} />
          </div>
        </div>
      </section>

      {/* ③ 比較ランキング */}
      <section id="ranking" className="max-w-5xl mx-auto px-4 py-12 scroll-mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">保育士転職サービス おすすめランキング</h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          評価基準：【要記入】（例：対応エリアの広さ、サポート内容、求人の探しやすさ等。順位の根拠をここに明記する）
        </p>
        <ol className="space-y-5">
          {ranked.map((s) => (
            <li
              key={s.slug}
              className={`rounded-xl border bg-white p-6 ${s.rank === 1 ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s.rank === 1 ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.rank}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                  <p className="text-xs text-gray-400">運営：{s.operator} ／ {s.type}</p>
                  <p className="text-sm text-gray-600 mt-2">{s.catchCopy}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-5">
                <div>
                  <p className="font-bold text-gray-700 mb-1">向いている人</p>
                  <ul className="text-gray-600 space-y-1">
                    {s.goodFor.map((g) => <li key={g}>・{g}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">注意点</p>
                  <ul className="text-gray-600 space-y-1">
                    {s.caution.map((c) => <li key={c}>・{c}</li>)}
                  </ul>
                </div>
              </div>
              <HoikuAffiliateButton
                service={s}
                variant={s.rank === 1 ? 'primary' : 'secondary'}
                className="w-full sm:w-auto"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* ④ 悩み別・目的別 */}
      <section id="cases" className="bg-white border-y border-gray-200 scroll-mt-28">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">悩み別・目的別の選び方</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {hoikuCases.map((c) => (
              <div key={c.id} id={`case-${c.id}`} className="rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{c.lead}</p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{c.reason}</p>
                <div className="flex flex-col gap-2">
                  {c.recommend
                    .map((slug) => getServiceBySlug(slug))
                    .filter((s) => s !== undefined)
                    .map((s) => (
                      <HoikuAffiliateButton
                        key={s.slug}
                        service={s}
                        label={`${s.name}を見る`}
                        variant={s.rank === 1 ? 'primary' : 'secondary'}
                        size="sm"
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

export type Column = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
};

export const columns: Column[] = [
  {
    slug: 'shikaku-hikaku-online',
    title: '社会人に人気の資格通信講座5選【2025年版・費用・合格率比較】',
    description: 'スタディング・フォーサイト・アガルート・ユーキャン・クレアールの5社を費用・合格率・学習スタイルで徹底比較。社会人が働きながら資格取得できる通信講座の選び方を解説します。',
    category: '資格比較',
    publishedAt: '2025-04-01',
    updatedAt: '2025-06-01',
    readingTime: 12,
  },
  {
    slug: 'takken-tsushin-osusume',
    title: '宅建通信講座おすすめ5選【2025年・合格率・費用で比較】',
    description: '宅地建物取引士（宅建）の通信講座をスタディング・フォーサイト・アガルート・LEC・TACで比較。合格率・費用・学習期間を一覧でチェックできます。',
    category: '資格比較',
    publishedAt: '2025-04-15',
    updatedAt: '2025-06-01',
    readingTime: 10,
  },
  {
    slug: 'bookkeeping-school-hikaku',
    title: '簿記2・3級の通信講座おすすめ比較【スタディング vs フォーサイト vs ユーキャン】',
    description: '日商簿記2・3級の合格を目指す方向けに、人気3社（スタディング・フォーサイト・ユーキャン）の料金・カリキュラム・合格率を詳しく比較します。',
    category: '資格比較',
    publishedAt: '2025-05-01',
    updatedAt: '2025-06-01',
    readingTime: 10,
  },
  {
    slug: 'shikaku-career-up',
    title: '転職に有利な資格おすすめ10選【年収アップが狙える資格を厳選】',
    description: '転職・年収アップに直結する人気資格を10選で紹介。宅建・簿記・FP・中小企業診断士・社労士など、取得難易度と費用対効果で厳選した資格を解説します。',
    category: '転職・キャリア',
    publishedAt: '2025-05-15',
    updatedAt: '2025-06-01',
    readingTime: 11,
  },
];

export function getColumnBySlug(slug: string): Column | undefined {
  return columns.find((c) => c.slug === slug);
}

export const columnContent: Record<string, React.ReactNode> = {
  'shikaku-hikaku-online': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">通信講座選びの3つのポイント</h2>
        <p className="mb-4">社会人が資格通信講座を選ぶ際は、①費用対効果、②学習スタイルの柔軟性（スマホ対応など）、③合格実績・サポート体制の3点を重視することが重要です。</p>
        <p>2025年現在、国内には多数の資格通信講座が存在します。本記事では、社会人に人気の5社を費用・合格率・学習スタイルで徹底比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">通信講座5社の比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">年間費用</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'スタディング', price: '14,000円〜', note: 'スマホ完結・最安水準' },
                { name: 'フォーサイト', price: '38,000円〜', note: '高合格率・給付金対象' },
                { name: 'アガルート', price: '55,000円〜', note: '合格特典・全額返金保証' },
                { name: 'ユーキャン', price: '43,000円〜', note: '知名度No.1・添削指導' },
                { name: 'クレアール', price: '48,000円〜', note: '非常識合格法・長期サポート' },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">{row.price}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※価格は代表的なコースの参考値です。資格・コースにより異なります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スタディング：コスパ最重視ならこれ</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-slate-800 mb-2">スタディングの特徴</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>スマホ1台で学習が完結するため通勤時間を有効活用できる</li>
            <li>年間14,000円〜と業界最安水準の受講料</li>
            <li>AI機能による苦手分野の自動抽出と問題演習</li>
            <li>宅建・簿記・FPなど幅広い資格に対応</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フォーサイト：合格率重視ならこれ</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 mb-2">フォーサイトの特徴</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>宅建合格率70.8%（全国平均の約2倍）</li>
            <li>フルカラーテキストで視覚的に理解しやすい</li>
            <li>教育訓練給付金対象コースで実質負担を削減可能</li>
            <li>eラーニングシステムManaBunでスマホ学習も可能</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">まとめ：目的別おすすめ通信講座</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">コスパ重視：</span><span>スタディング（年間14,000円〜、スマホ完結）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">合格率重視：</span><span>フォーサイト（業界トップ水準の合格率、給付金対象）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">サポート重視：</span><span>アガルート（合格特典・全額返金保証あり）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">安心感重視：</span><span>ユーキャン（知名度No.1・添削指導あり）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">長期学習：</span><span>クレアール（セーフティコースで翌年まで延長可能）</span></li>
        </ul>
      </section>
    </div>
  ),
  'takken-tsushin-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建試験の概要と難易度</h2>
        <p className="mb-4">宅地建物取引士（宅建）は不動産業界の必須国家資格です。合格率は例年15〜17%程度で、毎年20万人以上が受験する人気資格です。独学でも合格できますが、通信講座を活用することで学習効率を大幅に高められます。</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-bold text-slate-800 mb-2">宅建試験の基本情報</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>試験日：毎年10月の第3日曜日</li>
            <li>合格率：15〜17%（例年）</li>
            <li>試験形式：四肢択一式50問・2時間</li>
            <li>受験費用：8,200円</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建通信講座5社の比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">費用</th>
                <th className="border border-gray-200 px-3 py-2 text-center">合格率</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'スタディング', price: '14,000円〜', rate: '非公開', note: '最安値・スマホ完結' },
                { name: 'フォーサイト', price: '38,000円〜', rate: '70.8%', note: '業界トップ合格率' },
                { name: 'アガルート', price: '55,000円〜', rate: '72.3%', note: '合格特典・返金保証' },
                { name: 'LEC', price: '88,000円〜', rate: '非公開', note: '法律系最大手・模試充実' },
                { name: 'TAC', price: '95,000円〜', rate: '非公開', note: '通学・通信両対応' },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">{row.price}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{row.rate}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※合格率は各社公式データより。条件・測定方法は各社により異なります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建通信講座の選び方</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">費用を抑えたい方</h3>
            <p className="text-sm text-gray-700">スタディングが最安値。スマホ完結で通勤中も学習できます。テキストは不要で電子データのみでよい方に最適です。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">合格率を重視する方</h3>
            <p className="text-sm text-gray-700">フォーサイトかアガルートが高合格率。教育訓練給付金が使えるフォーサイトは実質負担を抑えられます。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">通学も検討している方</h3>
            <p className="text-sm text-gray-700">TACかLECが通学・通信の両方に対応。直接講師に質問できる環境を求める方に向いています。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建の学習スケジュール例</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>1〜3月：基礎学習（権利関係・法令上の制限）</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>4〜6月：宅建業法・その他法令を集中学習</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>7〜8月：過去問演習・弱点補強</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>9〜10月：模試・直前対策</span></li>
        </ol>
      </section>
    </div>
  ),
  'bookkeeping-school-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">簿記2・3級の難易度と取得メリット</h2>
        <p className="mb-4">日商簿記は経理・会計スキルを証明できる国内屈指の人気資格です。3級は初心者向け、2級は就職・転職に有利なレベルとされています。取得することで経理職への転職や副業での帳簿管理能力を示せます。</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { level: '3級', rate: '40〜50%', period: '2〜3ヶ月', merit: '経理の基礎知識を証明' },
            { level: '2級', rate: '15〜25%', period: '4〜6ヶ月', merit: '転職・就職で高評価' },
          ].map((item) => (
            <div key={item.level} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">日商簿記 {item.level}</p>
              <p className="font-bold text-slate-800 text-lg mb-2">合格率 {item.rate}</p>
              <p className="text-xs text-gray-600">標準学習期間: {item.period}</p>
              <p className="text-xs text-gray-500 mt-1">{item.merit}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">3社の比較：スタディング vs フォーサイト vs ユーキャン</h2>
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">スタディング：コスパ最強</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>料金：約14,000円〜（業界最安水準）</li>
              <li>学習形式：スマホ完結・動画講義＋AI問題演習</li>
              <li>対象：スマホで隙間時間に学びたい方</li>
              <li>弱点：テキストなし・自己管理が必要</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">フォーサイト：バランス型</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>料金：約38,000円〜（給付金対象あり）</li>
              <li>学習形式：フルカラーテキスト＋eラーニング</li>
              <li>対象：テキストとデジタルを組み合わせたい方</li>
              <li>弱点：スタディングより価格が高い</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">ユーキャン：安心・添削重視</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>料金：約43,000円〜</li>
              <li>学習形式：テキスト＋添削指導</li>
              <li>対象：講師のフィードバックを受けながら学びたい方</li>
              <li>弱点：スマホ対応は他社より限定的</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">教育訓練給付金で費用を削減</h2>
        <p className="mb-3">雇用保険加入者であれば、フォーサイトなど教育訓練給付金対象コースで受講料の20%が給付されます。条件を事前に確認してハローワークへ申請しましょう。</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-bold text-slate-700 mb-2">給付金活用例（フォーサイト・簿記2級コース）</p>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>通常受講料：38,000円</li>
            <li>給付金（20%）：7,600円</li>
            <li>実質負担：約30,400円</li>
          </ul>
        </div>
      </section>
    </div>
  ),
  'shikaku-career-up': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職・年収アップに直結する資格とは</h2>
        <p className="mb-4">資格取得が転職・年収アップに直結するためには、①市場での需要が高い、②取得難易度に見合った評価がある、③業務独占または名称独占の国家資格であることが重要です。闇雲に資格を取得するのではなく、自分のキャリア目標に合った資格を選ぶことが成功の鍵です。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職に有利な資格10選</h2>
        <div className="space-y-4">
          {[
            { rank: 1, name: '宅地建物取引士（宅建）', industry: '不動産業界', income: '年収400〜600万円台', note: '不動産会社への就職・転職に必須' },
            { rank: 2, name: '日商簿記2級', industry: '経理・会計全般', income: '年収350〜500万円台', note: 'どの業界でも評価される汎用性の高さ' },
            { rank: 3, name: 'FP2級', industry: '金融・保険業界', income: '年収400〜600万円台', note: '金融・保険会社への転職で高評価' },
            { rank: 4, name: '中小企業診断士', industry: 'コンサル・経営', income: '年収600〜1,000万円台', note: '経営コンサルタントの唯一の国家資格' },
            { rank: 5, name: '社会保険労務士', industry: '人事・労務', income: '年収450〜700万円台', note: '人事・労務のプロとして独立も可能' },
            { rank: 6, name: '行政書士', industry: '法律・行政', income: '年収400〜600万円台', note: '独立開業も可能な法律系国家資格' },
            { rank: 7, name: 'ITパスポート', industry: 'IT全般', income: '年収350〜500万円台', note: 'IT基礎知識の証明として幅広く活用' },
            { rank: 8, name: '基本情報技術者', industry: 'ITエンジニア', income: '年収450〜700万円台', note: 'ITエンジニアの登竜門的な国家資格' },
            { rank: 9, name: '日商簿記3級', industry: '経理・会計全般', income: '年収300〜400万円台', note: '経理入門として最初に取得すべき資格' },
            { rank: 10, name: 'FP3級', industry: '金融・保険業界', income: '年収300〜450万円台', note: '金融知識の基礎として取得しやすい' },
          ].map((item) => (
            <div key={item.rank} className="flex gap-4 border border-gray-200 rounded-xl p-4">
              <span className="text-2xl font-bold text-slate-300 shrink-0 w-8 text-center">{item.rank}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  <span>業界：{item.industry}</span>
                  <span>想定年収：{item.income}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">※年収は資格取得後の一般的な目安です。経験・スキル・企業規模により異なります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">資格取得の費用対効果を考える</h2>
        <p className="mb-3">資格取得にかかる費用（通信講座代＋受験料）を、取得後の年収増加で回収できるか試算することが重要です。</p>
        <div className="bg-slate-50 rounded-xl p-5">
          <p className="font-bold text-slate-800 mb-3">費用対効果の試算例：FP2級</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>通信講座費用（フォーサイト）：約38,000円</li>
            <li>受験料（学科＋実技）：約13,000円</li>
            <li>合計投資：約51,000円</li>
            <li>年収アップ幅（金融業界転職時）：年50〜100万円増も可能</li>
            <li>回収期間：数ヶ月〜1年程度</li>
          </ul>
        </div>
      </section>
    </div>
  ),
};

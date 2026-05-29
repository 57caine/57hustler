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
  {
    slug: 'fp-tsushin-osusume',
    title: 'FP（ファイナンシャルプランナー）通信講座おすすめ比較【2025年版】',
    description: 'FP2・3級の通信講座をスタディング・フォーサイト・アガルート・ユーキャンで比較。費用・合格率・学習スタイル別の選び方を解説します。',
    category: '資格比較',
    publishedAt: '2025-05-20',
    updatedAt: '2025-06-01',
    readingTime: 9,
  },
  {
    slug: 'gyousei-tsushin-hikaku',
    title: '行政書士通信講座おすすめ比較【2025年・合格率・費用で選ぶ】',
    description: '行政書士試験の通信講座をアガルート・フォーサイト・スタディング・クレアールで比較。合格率・費用・学習期間の違いを一覧で確認できます。',
    category: '資格比較',
    publishedAt: '2025-05-25',
    updatedAt: '2025-06-01',
    readingTime: 10,
  },
  {
    slug: 'kyouiku-kunren-kyuufu',
    title: '教育訓練給付金で資格取得費用を最大70%削減【申請手順・対象講座解説】',
    description: '雇用保険加入者が使える教育訓練給付金制度を解説。一般教育訓練・特定一般・専門実践の3種類と、資格通信講座への適用例・申請手順をまとめました。',
    category: '費用・給付金',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
  {
    slug: 'shikaku-dokugaku-vs-tsushin',
    title: '資格取得は独学 vs 通信講座どちらが有利？費用・合格率で比較',
    description: '資格取得を独学か通信講座で迷っている方向けに、費用・合格率・学習効率の観点から徹底比較。資格別のおすすめ選択肢も紹介します。',
    category: '費用・給付金',
    publishedAt: '2025-06-05',
    updatedAt: '2025-06-05',
    readingTime: 8,
  },
  {
    slug: 'shakaijin-shikaku-study',
    title: '働きながら資格取得するための勉強法【社会人が実践できる時間管理術】',
    description: '仕事と勉強を両立するための時間管理・勉強法を紹介。通勤時間・昼休みの活用、スキマ時間学習のコツ、挫折しないためのスケジュール管理まで解説します。',
    category: '転職・キャリア',
    publishedAt: '2025-06-10',
    updatedAt: '2025-06-10',
    readingTime: 9,
  },
  {
    slug: 'shakushi-tsushin-osusume',
    title: '社労士 通信講座 おすすめ5選【2025年版・合格率・費用を比較】',
    description: '社会保険労務士（社労士）試験に強い通信講座を徹底比較。アガルート・フォーサイト・スタディング・クレアールの費用・合格率・サポート体制を一覧で確認。',
    category: '国家資格',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 9,
  },
  {
    slug: 'chusho-shindan-shi',
    title: '中小企業診断士 通信講座 おすすめ3選【難関国家資格を最短取得】',
    description: '中小企業診断士試験に強い通信講座を比較。スタディング・クレアール・TACの費用・サポート・学習スタイルで選べる。1次から2次まで一貫対応の講座を紹介。',
    category: '国家資格',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 8,
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
  'fp-tsushin-osusume': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">FP（ファイナンシャルプランナー）は金融・保険・不動産・税務など幅広い分野の知識を証明できる人気資格です。3級は入門レベル、2級は転職・就職で評価される実務レベルとされています。独学でも合格できる資格ですが、通信講座を活用することで効率よく学習を進められます。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">FP試験の基本情報</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { level: '3級', rate: '60〜70%', period: '1〜2ヶ月', note: '入門・基礎知識の証明' },
            { level: '2級', rate: '25〜40%', period: '3〜5ヶ月', note: '転職・就職で高評価' },
          ].map((item) => (
            <div key={item.level} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">FP技能士 {item.level}</p>
              <p className="font-bold text-slate-800 text-lg mb-1">合格率 {item.rate}</p>
              <p className="text-xs text-gray-600">標準学習期間: {item.period}</p>
              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">※試験はFP協会・きんざいそれぞれで実施されます。合格率は試験機関・実施回により異なります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">FP通信講座4社の比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">費用（2・3級）</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'スタディング', price: '8,800円〜', note: 'スマホ完結・最安水準' },
                { name: 'フォーサイト', price: '25,000円〜', note: '高合格率・フルカラーテキスト' },
                { name: 'アガルート', price: '28,000円〜', note: '合格特典・丁寧な解説' },
                { name: 'ユーキャン', price: '39,000円〜', note: '添削指導・知名度No.1' },
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
        <p className="text-xs text-gray-400 mt-2">※価格は3・2級セットコースの参考値です。最新料金は各社公式サイトをご確認ください。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">状況別・おすすめFP通信講座</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">コストを最優先したい方</h3>
            <p className="text-sm text-gray-700">スタディングが最安値。3級なら8,800円〜とコスパ抜群。スマホだけで完結するため通勤時間を活用できます。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">合格率を重視する方</h3>
            <p className="text-sm text-gray-700">フォーサイトかアガルートが合格実績で定評があります。フルカラーテキストで視覚的に理解しやすい点も強みです。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">添削・手厚いサポートが欲しい方</h3>
            <p className="text-sm text-gray-700">ユーキャンは添削指導が充実。知名度と実績があり、初めて資格取得に挑戦する方も安心して学べます。</p>
          </div>
        </div>
      </section>
    </div>
  ),
  'gyousei-tsushin-hikaku': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">行政書士は官公庁への書類作成・申請代行ができる法律系国家資格です。合格率は例年10〜15%程度で難易度は高めですが、独立開業や副業としての活用も可能なため人気があります。通信講座を活用することで独学より効率的に合格を目指せます。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">行政書士試験の基本情報</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="font-semibold text-slate-700 shrink-0">試験日：</span><span>毎年11月第2日曜日</span></li>
            <li className="flex gap-2"><span className="font-semibold text-slate-700 shrink-0">合格率：</span><span>10〜15%（例年）</span></li>
            <li className="flex gap-2"><span className="font-semibold text-slate-700 shrink-0">試験形式：</span><span>記述式・多肢選択式（300点満点・180点以上で合格）</span></li>
            <li className="flex gap-2"><span className="font-semibold text-slate-700 shrink-0">標準学習期間：</span><span>6〜12ヶ月</span></li>
            <li className="flex gap-2"><span className="font-semibold text-slate-700 shrink-0">受験料：</span><span>10,400円</span></li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">行政書士通信講座4社の比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">費用</th>
                <th className="border border-gray-200 px-3 py-2 text-center">合格特典</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'アガルート', price: '55,000円〜', tokuten: '全額返金', note: '合格率業界最高水準・丁寧な解説' },
                { name: 'フォーサイト', price: '63,000円〜', tokuten: '給付金対象', note: 'フルカラーテキスト・高合格率' },
                { name: 'スタディング', price: '35,000円〜', tokuten: 'なし', note: '最安水準・スマホ完結' },
                { name: 'クレアール', price: '58,000円〜', tokuten: 'セーフティコース', note: '翌年まで延長可能・長期サポート' },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">{row.price}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-500">{row.tokuten}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※価格・合格特典は変更される場合があります。最新情報は各社公式サイトでご確認ください。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">行政書士の学習スケジュール例（1年間）</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>1〜3月：民法・行政法の基礎固め</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>4〜6月：商法・憲法・基礎法学を学習</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>7〜9月：過去問演習・弱点補強</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>10〜11月：記述式対策・直前模試</span></li>
        </ol>
      </section>
    </div>
  ),
  'kyouiku-kunren-kyuufu': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">教育訓練給付金は、雇用保険の被保険者または一定の離職者が指定講座を修了した際に、受講料の一部を国（ハローワーク）から支給してもらえる制度です。資格通信講座の費用を大幅に削減できるため、社会人の資格取得に非常に有利な制度です。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">教育訓練給付金の3種類</h2>
        <div className="space-y-4">
          {[
            {
              type: '一般教育訓練給付金',
              rate: '受講料の20%（上限10万円）',
              condition: '雇用保険加入期間3年以上（初回は1年以上）',
              target: '簿記・FP・TOEIC準備講座など',
            },
            {
              type: '特定一般教育訓練給付金',
              rate: '受講料の40%（上限20万円）',
              condition: '雇用保険加入期間3年以上（初回は1年以上）',
              target: 'ITパスポート・税理士・宅建など厚生労働大臣が指定した講座',
            },
            {
              type: '専門実践教育訓練給付金',
              rate: '受講料の50〜70%（上限56〜112万円）',
              condition: '雇用保険加入期間3年以上（初回は2年以上）',
              target: '看護師・美容師・情報処理安全確保支援士など長期専門資格',
            },
          ].map((item) => (
            <div key={item.type} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-800 mb-2">{item.type}</h3>
              <div className="text-sm space-y-1 text-gray-700">
                <p><span className="font-medium">給付率：</span>{item.rate}</p>
                <p><span className="font-medium">受給条件：</span>{item.condition}</p>
                <p><span className="font-medium">対象例：</span>{item.target}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">申請手順（受講前が重要）</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>厚生労働省の「教育訓練給付制度 検索システム」で対象講座を確認</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>受講開始1ヶ月前までにハローワークで「受給資格確認」を受ける</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>通信講座に申し込み・受講開始</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>講座修了後1ヶ月以内にハローワークへ支給申請</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">5</span><span>審査後、指定口座に給付金が振り込まれる</span></li>
        </ol>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-amber-800 font-medium">注意：受講開始前のハローワーク手続きが必須です</p>
          <p className="text-sm text-amber-700 mt-1">受講後の申請では給付金を受け取れません。必ず受講開始1ヶ月前までに手続きをしてください。</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">給付金対象の資格通信講座例</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'フォーサイト（宅建・FP・簿記）', rate: '20%給付', note: '一般教育訓練給付' },
            { name: 'スタディング（中小企業診断士）', rate: '20%給付', note: '一般教育訓練給付' },
            { name: 'アガルート（社労士・行政書士）', rate: '20〜40%給付', note: '一般・特定一般給付' },
            { name: 'TAC（公認会計士・税理士）', rate: '20〜70%給付', note: '専門実践教育訓練も対象' },
          ].map((item) => (
            <div key={item.name} className="border border-gray-200 rounded-lg p-3">
              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">{item.rate}</p>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">※対象講座・給付率は変更される場合があります。最新情報はハローワークまたは各社公式サイトでご確認ください。</p>
      </section>
    </div>
  ),
  'shikaku-dokugaku-vs-tsushin': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">資格取得を目指す際、多くの方が「独学で頑張るか、通信講座を使うか」と悩みます。どちらが有利かは、資格の難易度・自分の学習スタイル・投資できる費用によって異なります。本記事では費用・合格率・学習効率の3つの観点から徹底比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">独学 vs 通信講座：メリット・デメリット比較</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">独学</h3>
            <p className="text-xs font-semibold text-emerald-700 mb-2">メリット</p>
            <ul className="text-sm space-y-1 text-gray-700 mb-3">
              <li>費用が最小限（テキスト代のみ3,000〜8,000円程度）</li>
              <li>自分のペースで自由に学習できる</li>
              <li>市販テキストで充分な資格も多い</li>
            </ul>
            <p className="text-xs font-semibold text-amber-700 mb-2">デメリット</p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>学習計画の立案・管理がすべて自己責任</li>
              <li>わからない部分で詰まりやすい</li>
              <li>合格率が通信講座より低い傾向</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">通信講座</h3>
            <p className="text-xs font-semibold text-emerald-700 mb-2">メリット</p>
            <ul className="text-sm space-y-1 text-gray-700 mb-3">
              <li>合格に必要な内容を効率的に学べる</li>
              <li>質問・サポートで疑問をすぐに解決</li>
              <li>教育訓練給付金で費用を削減できる場合も</li>
            </ul>
            <p className="text-xs font-semibold text-amber-700 mb-2">デメリット</p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>独学より費用がかかる（数万〜十数万円）</li>
              <li>スケジュールが決まっている場合がある</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">資格別：独学 vs 通信講座 どちらがおすすめ？</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">資格</th>
                <th className="border border-gray-200 px-3 py-2 text-left">おすすめ</th>
                <th className="border border-gray-200 px-3 py-2 text-left">理由</th>
              </tr>
            </thead>
            <tbody>
              {[
                { shikaku: 'FP3級', osusume: '独学でも可', reason: '合格率60〜70%と高く、市販テキストで対応可能' },
                { shikaku: 'FP2級', osusume: '通信講座推奨', reason: '計算問題・記述対策に専門指導が有効' },
                { shikaku: '簿記3級', osusume: '独学でも可', reason: '市販問題集で合格できるレベル' },
                { shikaku: '簿記2級', osusume: '通信講座推奨', reason: '工業簿記が加わり難易度が上がる' },
                { shikaku: '宅建', osusume: '通信講座推奨', reason: '合格率15〜17%、体系的な学習が重要' },
                { shikaku: '行政書士', osusume: '通信講座強く推奨', reason: '合格率10〜15%、記述式対策が必須' },
              ].map((row, i) => (
                <tr key={row.shikaku} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.shikaku}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.osusume}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-500 text-xs">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">結論：コスパを考えると通信講座が有利な場合が多い</h2>
        <p className="text-sm text-gray-700">独学で1〜2年かけて合格を目指すより、通信講座で6〜12ヶ月で合格する方が、仕事への復帰・キャリアアップの時間を考えると費用対効果が高いことがあります。特に難関資格では、通信講座の合格率が独学の2〜3倍になるケースも。教育訓練給付金を活用すれば実質負担も大きく下がります。</p>
      </section>
    </div>
  ),
  'shakaijin-shikaku-study': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">仕事をしながら資格取得を目指す社会人の最大の課題は「学習時間の確保」です。しかし1日1〜2時間の学習を継続するだけで、多くの国家資格に合格できます。本記事では、忙しい社会人が実践できる時間管理術と勉強法を紹介します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社会人の1日の学習時間の目安</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { shikaku: 'FP2・3級', jikan: '1〜2時間/日', kikan: '2〜5ヶ月' },
            { shikaku: '宅建', jikan: '1〜2時間/日', kikan: '6〜8ヶ月' },
            { shikaku: '行政書士', jikan: '2〜3時間/日', kikan: '8〜12ヶ月' },
          ].map((item) => (
            <div key={item.shikaku} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="font-bold text-slate-800 mb-1">{item.shikaku}</p>
              <p className="text-sm text-gray-700">{item.jikan}</p>
              <p className="text-xs text-gray-500 mt-1">標準期間: {item.kikan}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スキマ時間を活用する5つのテクニック</h2>
        <ol className="space-y-4 text-sm">
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
            <div><p className="font-semibold text-gray-900">通勤時間をフル活用（往復30〜60分）</p><p className="text-gray-600 mt-0.5">スマホ対応の通信講座（スタディングなど）で動画講義・問題演習。電車内でイヤホンを使って音声学習も効果的です。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
            <div><p className="font-semibold text-gray-900">昼休みの30分を問題演習に充てる</p><p className="text-gray-600 mt-0.5">昼食後の30分は問題演習専用にするとリズムが作りやすい。毎日継続することで月15時間の学習時間が確保できます。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
            <div><p className="font-semibold text-gray-900">就寝前の30〜60分を毎日確保</p><p className="text-gray-600 mt-0.5">SNSやテレビの時間を学習に置き換える。就寝前は記憶の定着に適した時間帯とも言われています。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
            <div><p className="font-semibold text-gray-900">週末に集中学習日を設ける（3〜4時間）</p><p className="text-gray-600 mt-0.5">平日の復習・弱点補強に活用。カフェなどの外出先で集中する環境を作ることも有効です。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-0.5">5</span>
            <div><p className="font-semibold text-gray-900">「ゼロの日」を作らないルールを設ける</p><p className="text-gray-600 mt-0.5">忙しい日でも5分だけ問題を解くなど「ゼロにしない」習慣が継続の鍵。アプリを使えば隙間時間に問題演習が可能です。</p></div>
          </li>
        </ol>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">挫折しないための学習管理法</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">試験日から逆算してスケジュールを立てる</h3>
            <p className="text-sm text-gray-700">試験日を確認し、「いつまでにインプット→いつから過去問演習」というマイルストーンを設定することで、学習の見通しが立ちます。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">通信講座の学習スケジュール機能を活用する</h3>
            <p className="text-sm text-gray-700">スタディングやフォーサイトなど多くの通信講座には学習管理機能があります。自動でスケジュールを組んでくれるので計画立案の手間が省けます。</p>
          </div>
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">合格体験記を定期的に読む</h3>
            <p className="text-sm text-gray-700">モチベーションが下がった時は、同じ状況（社会人・仕事しながら）で合格した人の体験記を読むことが効果的です。</p>
          </div>
        </div>
      </section>
    </div>
  ),
  'shakushi-tsushin-osusume': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">社会保険労務士（社労士）は、企業の人事・労務・社会保険手続きを代行できる国家資格です。合格率は6〜7%と難関ですが、取得後の活躍フィールドは広く、士業として独立開業も可能です。本記事では、社労士試験に強い通信講座を徹底比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社労士試験の基本情報</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500 w-1/3">試験形式</td><td className="py-2 px-3">択一式（70問）＋選択式（40問）</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">試験日</td><td className="py-2 px-3">毎年8月第4日曜日</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500">合格率</td><td className="py-2 px-3">6〜7%（2024年：6.9%）</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">標準学習期間</td><td className="py-2 px-3">800〜1,000時間（約1〜2年）</td></tr>
              <tr className="bg-gray-50"><td className="py-2 px-3 text-gray-500">受験資格</td><td className="py-2 px-3">大卒・短大卒・3年以上の実務経験など</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社労士通信講座 比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">受講料</th>
                <th className="border border-gray-200 px-3 py-2 text-center">合格実績</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">アガルート</td>
                <td className="border border-gray-200 px-3 py-2 text-right">142,780円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center">合格率22.2%</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">合格特典・返金制度あり</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium">フォーサイト</td>
                <td className="border border-gray-200 px-3 py-2 text-right">79,800円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center">合格率38.8%</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">e-ラーニング充実・スマホ学習可</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">スタディング</td>
                <td className="border border-gray-200 px-3 py-2 text-right">49,500円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center">非公開</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">業界最安水準・スキマ学習重視</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium">クレアール</td>
                <td className="border border-gray-200 px-3 py-2 text-right">88,000円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center">非公開</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">非常識合格法・質問無制限</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">LEC</td>
                <td className="border border-gray-200 px-3 py-2 text-right">148,000円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center">非公開</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">大手資格スクール・通学も可</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 合格率は各社公表値。受講コース・時期により異なります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社労士資格の活かし方</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">独立開業</h3>
            <p className="text-xs text-gray-700">事務所を開設し、企業の人事労務コンサルや社会保険手続き代行で収入を得る。年収500〜1,000万円も可能。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">企業内社労士</h3>
            <p className="text-xs text-gray-700">人事・総務部門でのキャリアアップに。資格手当が付く企業も多く、転職市場での評価も高い。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">コンサルティング</h3>
            <p className="text-xs text-gray-700">中小企業向けに助成金申請支援・労務管理相談を行うコンサルタントとして活躍できる。</p>
          </div>
        </div>
      </section>
    </div>
  ),
  'chusho-shindan-shi': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">中小企業診断士は、経営コンサルタントとして唯一の国家資格です。企業の経営診断・助言を行う専門家として認定されます。合格率は一次4〜17%・二次18〜19%と難関ながら、取得後のキャリアアップ・転職・独立に非常に有効です。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">中小企業診断士試験の概要</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500 w-1/3">試験構成</td><td className="py-2 px-3">一次試験（7科目）＋二次試験（記述式4科目）</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">一次合格率</td><td className="py-2 px-3">4〜17%（年により変動が大きい）</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500">二次合格率</td><td className="py-2 px-3">18〜19%</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">標準学習期間</td><td className="py-2 px-3">1,000〜1,500時間（1〜3年）</td></tr>
              <tr className="bg-gray-50"><td className="py-2 px-3 text-gray-500">試験日</td><td className="py-2 px-3">一次：8月、二次：10月</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">中小企業診断士に強い通信講座</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">スタディング</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">コスパ最強</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">受講料：49,500円〜と業界最安水準。スマホで動画・問題演習・過去問が完結できるため忙しい社会人に人気。</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">クレアール</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">サポート充実</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">受講料：128,000円〜。質問回数無制限で受験期間を延長できる「セーフティコース」が人気。不合格時の延長制度が安心。</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">TAC</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">実績最高</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">受講料：198,000円〜。大手資格スクールとして高い合格実績。通学・通信両対応で2次試験の記述対策が充実。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">なぜ中小企業診断士はキャリアアップに強いのか</h2>
        <ul className="space-y-2">
          {[
            '経営・財務・マーケティング・IT・法務など多分野の知識が身につき、ビジネス全般の視野が広がる',
            '経営企画・コンサル・金融機関・商社など多業界で評価される汎用性の高い資格',
            '独立して企業診断・助成金コンサルタントとして活躍できる副業・開業のルートがある',
            '合格後の研究会・プロコン活動を通じて人脈が広がり、案件紹介につながることも多い',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  ),
};

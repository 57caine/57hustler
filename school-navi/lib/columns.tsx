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
    slug: 'programming-school-hikaku-2025',
    title: 'プログラミングスクール比較2025年最新版｜8校を徹底比較',
    description: 'TECH CAMP、DMM WEBCAMP、RUNTEQなど人気プログラミングスクール8校を料金・転職率・カリキュラムで比較。あなたに合ったスクール選びをサポートします。',
    category: 'スクール比較',
    publishedAt: '2025-04-01',
    updatedAt: '2025-06-01',
    readingTime: 12,
  },
  {
    slug: 'teiten-hojo-programming-school',
    title: '給付金・補助金が使えるプログラミングスクール一覧【最大70%OFF】',
    description: '厚生労働省の教育訓練給付金を使って最大70%オフで受講できるプログラミングスクールを紹介。申請方法・条件も解説。',
    category: '費用・給付金',
    publishedAt: '2025-03-15',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
  {
    slug: 'mikeiken-engineer-tenshi',
    title: '未経験からエンジニア転職できるスクール3選｜成功率で比較',
    description: '未経験からIT・エンジニア職への転職を目指す人向けに転職成功率の高いスクールを徹底比較。転職保証あり・なしの違いも解説。',
    category: '転職・キャリア',
    publishedAt: '2025-03-01',
    updatedAt: '2025-05-15',
    readingTime: 10,
  },
  {
    slug: 'programming-school-ryokin-hikaku',
    title: 'プログラミングスクールの費用・料金を比較【安い順ランキング】',
    description: '主要プログラミングスクール8校の料金を一覧で比較。月額制・一括払い・分割払いのそれぞれのメリットも解説。',
    category: '費用・給付金',
    publishedAt: '2025-02-15',
    updatedAt: '2025-06-01',
    readingTime: 7,
  },
  {
    slug: 'freelance-engineer-school',
    title: 'フリーランスエンジニアになるためのスクール選び方【2025年版】',
    description: '副業・フリーランスエンジニアを目指す人向けのスクール選び方ガイド。案件紹介まで対応するCoachTechなどフリーランス特化スクールを紹介。',
    category: '転職・キャリア',
    publishedAt: '2025-02-01',
    updatedAt: '2025-05-01',
    readingTime: 9,
  },
  {
    slug: 'ai-engineer-school-guide',
    title: 'AIエンジニアになるためのスクール選び方｜ChatGPT時代の学び方',
    description: 'Python・機械学習・ChatGPT APIを学べるAI特化プログラミングスクールを比較。需要が高まるAIエンジニア転職への最短ルートを解説。',
    category: 'AI・最新技術',
    publishedAt: '2025-01-15',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
  {
    slug: 'programming-school-shakaijin-osusume',
    title: '社会人におすすめプログラミングスクール5選【2025年・働きながら学べる】',
    description: '社会人が働きながらプログラミングを学べるスクールを徹底比較。夜間・週末対応、オンライン受講可能なスクールを厳選紹介。',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
  {
    slug: 'programming-school-josei-osusume',
    title: '女性向けプログラミングスクール おすすめ5選【2025年版】',
    description: '女性が学びやすいプログラミングスクールを比較。女性講師・女性コミュニティ・育児との両立サポートなど女性特有のニーズに応えるスクールを紹介。',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 7,
  },
  {
    slug: 'programming-school-40dai-osusume',
    title: '40代・50代からでもプログラミングスクールに通える？【現実と対策】',
    description: '40代・50代でプログラミングスクールに通う際の疑問と不安を解消。年齢制限・転職可能性・学習期間など、シニア世代が気になるポイントを解説。',
    category: '転職・キャリア',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 7,
  },
  {
    slug: 'dokugaku-vs-school',
    title: 'プログラミング独学 vs スクール どっちがいい？【費用・期間・転職率で比較】',
    description: 'プログラミングを独学とスクールで学ぶ場合を徹底比較。費用・学習期間・転職成功率・挫折率などを具体的な数字で解説。あなたに向いているのはどっち？',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
  {
    slug: 'engineer-tensyoku-kikan',
    title: '未経験からエンジニア転職まで何ヶ月かかる？【リアルな期間と準備方法】',
    description: '未経験からエンジニアに転職するまでの現実的な期間を解説。スクール別の転職実績や準備にかかる時間、転職成功のために必要なスキルレベルを詳しく紹介。',
    category: '転職・キャリア',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
  },
];

export function getColumnBySlug(slug: string): Column | undefined {
  return columns.find((c) => c.slug === slug);
}

export const columnContent: Record<string, React.ReactNode> = {
  'programming-school-hikaku-2025': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">プログラミングスクール選びの3つのポイント</h2>
        <p className="mb-4">プログラミングスクールを選ぶ際には、①転職・就職支援の充実度、②カリキュラムの実践性、③コストパフォーマンスの3点を重視することが大切です。</p>
        <p>2025年現在、国内には200校以上のプログラミングスクールが存在します。本記事では、実績・料金・カリキュラムの観点から厳選した8校を徹底比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職特化型スクール比較</h2>
        <div className="bg-blue-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-blue-800 mb-2">1位：TECH CAMP（テックキャンプ）</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>転職成功率99%（自社調べ）</li>
            <li>業界最大規模・卒業生5万人以上</li>
            <li>転職できなければ全額返金保証</li>
            <li>料金：748,000円〜（夜間・休日10週間コース）</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-green-800 mb-2">2位：DMM WEBCAMP（ディーエムエム ウェブキャンプ）</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>受講者数9万人突破</li>
            <li>最大70%給付金対象</li>
            <li>転職成功率98%</li>
            <li>料金：437,800円〜（給付金適用後130,000円程度）</li>
          </ul>
        </div>
        <div className="bg-purple-50 rounded-xl p-5">
          <h3 className="font-bold text-purple-800 mb-2">3位：RUNTEQ（ランテック）</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>実務レベルのスキルが身につく</li>
            <li>卒業生の評価が業界最高水準</li>
            <li>9ヶ月間の充実したカリキュラム</li>
            <li>料金：550,000円（Webエンジニア転職コース）</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スキルアップ・副業向けスクール比較</h2>
        <p className="mb-4">転職よりも副業や学習目的でプログラミングを学びたい方には、月額制や短期コースがおすすめです。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール名</th>
                <th className="border border-gray-200 px-3 py-2 text-left">料金</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2">Progate</td>
                <td className="border border-gray-200 px-3 py-2">月990円〜</td>
                <td className="border border-gray-200 px-3 py-2">入門者向け・スライド形式</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">TechAcademy</td>
                <td className="border border-gray-200 px-3 py-2">174,900円〜</td>
                <td className="border border-gray-200 px-3 py-2">副業支援・現役エンジニア指導</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">CodeCamp</td>
                <td className="border border-gray-200 px-3 py-2">129,800円〜</td>
                <td className="border border-gray-200 px-3 py-2">マンツーマン・英語対応</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">まとめ：目的別おすすめスクール</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">転職希望：</span><span>TECH CAMP または DMM WEBCAMP（転職保証・給付金あり）</span></li>
          <li className="flex gap-2"><span className="font-bold text-green-600 shrink-0">本格スキル習得：</span><span>RUNTEQ（9ヶ月間・実務レベル）</span></li>
          <li className="flex gap-2"><span className="font-bold text-purple-600 shrink-0">副業・学習：</span><span>TechAcademy または Progate（コスパ重視）</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-600 shrink-0">フリーランス：</span><span>CoachTech（案件紹介まで対応）</span></li>
          <li className="flex gap-2"><span className="font-bold text-red-600 shrink-0">AI特化：</span><span>ゼロプラス（Python・ChatGPT API）</span></li>
        </ul>
      </section>
    </div>
  ),
  'teiten-hojo-programming-school': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">教育訓練給付金とは？</h2>
        <p className="mb-4">教育訓練給付金は、厚生労働省が運営するスキルアップ支援制度です。雇用保険に一定期間加入していれば、指定されたプログラミングスクールの受講料を最大70%補助してもらえます。</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-bold text-yellow-800 mb-2">受給条件（一般的）</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・雇用保険に1年以上加入（初回は1年、2回目以降は3年）</li>
            <li>・受講開始日時点で在職中または離職後1年以内</li>
            <li>・ハローワークへの事前申請が必要</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">給付金対応プログラミングスクール一覧</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">DMM WEBCAMP</h3>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">最大70%OFF</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">専門実践教育訓練給付金対象。437,800円のコースが実質130,000円程度に。</p>
            <p className="text-xs text-gray-400">対象コース：就職転職コース（3ヶ月）</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">ゼロプラス（AIエンジニアコース）</h3>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">最大70%OFF</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">専門実践教育訓練給付金対象のAI特化スクール。</p>
            <p className="text-xs text-gray-400">対象コース：AIエンジニアコース（6ヶ月）</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">TechAcademy</h3>
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">最大20%OFF</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">一般教育訓練給付金対象コースあり。</p>
            <p className="text-xs text-gray-400">対象コース：一部コース</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">給付金申請の流れ</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>ハローワークで訓練前キャリアコンサルティングを受ける</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>給付金支給申請書を入手する</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>スクールに入学・受講開始</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>受講修了後1ヶ月以内にハローワークへ支給申請</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">5</span><span>審査後、給付金が振込まれる</span></li>
        </ol>
      </section>
    </div>
  ),
  'mikeiken-engineer-tenshi': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">未経験からエンジニア転職できる？現実を解説</h2>
        <p className="mb-4">結論から言うと、未経験からのエンジニア転職は十分可能です。ただし、独学だけでは難しく、適切なスクールとサポートが成功の鍵を握ります。</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="font-bold text-blue-800 mb-2">未経験エンジニア転職の現状（2025年）</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・IT人材不足：2030年に79万人不足の見込み（経済産業省試算）</li>
            <li>・20代〜30代前半は未経験採用が活発</li>
            <li>・スクール卒業生の平均転職期間：1〜3ヶ月</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職成功率が高いスクール3選</h2>
        <div className="space-y-4">
          {[
            { rank: 1, name: 'TECH CAMP', rate: '99%', period: '10週間〜', price: '748,000円〜', note: '業界最大規模・転職保証あり', color: 'blue' },
            { rank: 2, name: 'DMM WEBCAMP', rate: '98%', period: '3ヶ月〜', price: '437,800円〜', note: '給付金で実質130,000円程度', color: 'green' },
            { rank: 3, name: 'RUNTEQ', rate: '95%以上', period: '9ヶ月', price: '550,000円', note: '実務レベルのスキルが身につく', color: 'purple' },
          ].map((school) => (
            <div key={school.rank} className={`border border-${school.color}-200 bg-${school.color}-50 rounded-xl p-4`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`bg-${school.color}-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0`}>{school.rank}</span>
                <h3 className="font-bold text-gray-900">{school.name}</h3>
                <span className="ml-auto text-sm font-bold text-red-600">転職成功率{school.rate}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <span>期間：{school.period}</span>
                <span>料金：{school.price}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{school.note}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職保証とは？条件を確認しよう</h2>
        <p className="mb-3">転職保証とは「卒業後一定期間内に転職できなければ受講料を返金する」制度です。ただし以下の条件があります。</p>
        <ul className="text-sm space-y-2">
          <li className="flex gap-2"><span className="text-red-500">⚠️</span><span>一定数以上の求人応募実績が必要</span></li>
          <li className="flex gap-2"><span className="text-red-500">⚠️</span><span>提示された求人を断った場合は対象外</span></li>
          <li className="flex gap-2"><span className="text-red-500">⚠️</span><span>卒業後6ヶ月〜1年以内という期間制限あり</span></li>
        </ul>
      </section>
    </div>
  ),
  'programming-school-ryokin-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">プログラミングスクール料金比較一覧（安い順）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">料金</th>
                <th className="border border-gray-200 px-3 py-2 text-left">備考</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Progate', price: '月990円〜', note: '入門向け月額制' },
                { name: 'TechAcademy', price: '174,900円〜', note: '4週間コース' },
                { name: 'CodeCamp', price: '129,800円〜', note: '2ヶ月コース' },
                { name: 'DMM WEBCAMP', price: '437,800円（給付金後〜130,000円）', note: '給付金活用で大幅削減' },
                { name: 'CoachTech', price: '456,500円〜', note: 'フリーランス特化' },
                { name: 'RUNTEQ', price: '550,000円', note: '9ヶ月本格コース' },
                { name: 'TECH CAMP', price: '748,000円〜', note: '転職保証・業界最大手' },
                { name: 'ゼロプラス', price: '498,000円（給付金後〜150,000円）', note: 'AI特化' },
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
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">分割払い・ローンの活用</h2>
        <p className="mb-4">多くのスクールでは信販会社のローンが使えます。月々の負担を抑えながら学習できます。</p>
        <div className="bg-gray-50 rounded-xl p-4 text-sm">
          <p className="font-bold mb-2">例：TECH CAMP 748,000円を24回払いの場合</p>
          <p className="text-gray-600">月々 約31,000円（金利は各信販会社により異なる）</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">コスパ最強スクールはどこ？</h2>
        <p className="mb-3">「料金÷転職後の年収増加額」で考えると、給付金を活用したDMM WEBCAMPが最もコスパが良いケースが多いです。</p>
        <ul className="text-sm space-y-2">
          <li className="flex gap-2"><span className="text-green-500 font-bold">◎</span><span><strong>DMM WEBCAMP</strong>：給付金活用で実質13万円、転職後年収+100万円以上も可能</span></li>
          <li className="flex gap-2"><span className="text-blue-500 font-bold">○</span><span><strong>Progate</strong>：月990円、まず試してみたい人に最適</span></li>
          <li className="flex gap-2"><span className="text-purple-500 font-bold">○</span><span><strong>TechAcademy</strong>：副業月5万円を目指すなら17万円投資は元が取れる</span></li>
        </ul>
      </section>
    </div>
  ),
  'freelance-engineer-school': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フリーランスエンジニアの現実：需要と収入</h2>
        <p className="mb-4">フリーランスエンジニアの平均年収は800万〜1,200万円と高水準です。2025年現在、クラウドワークス・ランサーズなどのフリーランスマーケットは急成長しており、スキルがあれば仕事に困りません。</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          {[
            { label: 'フリーランス平均年収', value: '800〜1,200万円' },
            { label: '案件単価（中堅）', value: '月60〜80万円' },
          ].map((stat) => (
            <div key={stat.label} className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="font-bold text-blue-700 text-lg">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フリーランス特化スクール：CoachTech</h2>
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">CoachTech（コーチテック）の特徴</h3>
          <ul className="text-sm space-y-2">
            <li className="flex gap-2"><span className="text-green-500">✅</span><span>卒業後の案件紹介まで一貫サポート</span></li>
            <li className="flex gap-2"><span className="text-green-500">✅</span><span>チーム開発でポートフォリオが作れる</span></li>
            <li className="flex gap-2"><span className="text-green-500">✅</span><span>PHP/Laravel・Vue.jsなど案件需要が高い言語</span></li>
            <li className="flex gap-2"><span className="text-red-400">⚠️</span><span>転職サポートはやや弱め</span></li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">料金：456,500円（6ヶ月フリーランスコース）</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フリーランスになるまでのロードマップ</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>スクールでWebアプリ開発の基礎を習得（3〜6ヶ月）</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>副業で小規模案件を受注・実績を積む（3〜6ヶ月）</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>月30万円以上の安定収入が見込めたら独立</span></li>
          <li className="flex gap-3"><span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>エージェント（レバテックフリーランス等）で高単価案件へ</span></li>
        </ol>
      </section>
    </div>
  ),
  'ai-engineer-school-guide': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">AIエンジニアとは？2025年の需要</h2>
        <p className="mb-4">AIエンジニアとは、機械学習・深層学習・ChatGPT APIなどのAI技術を使ってシステムを開発する職種です。ChatGPT登場以降、企業のAI活用ニーズが爆発的に高まっており、AIエンジニアの需要は今後も右肩上がりが見込まれます。</p>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="font-bold text-red-800 mb-2">AIエンジニアの市場価値（2025年）</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・平均年収：800万〜1,500万円（上位層）</li>
            <li>・求人数：2023年比で約3倍に増加</li>
            <li>・スキル：Python、機械学習、LLM、API連携</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">AIエンジニアを目指せるスクール</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">AI特化</span>
              <h3 className="font-bold text-gray-900">ゼロプラス</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Python・機械学習・ChatGPT APIまで学べる唯一のAI特化スクール。給付金を活用すれば実質負担を大幅削減。</p>
            <p className="text-xs text-gray-400">料金：498,000円（給付金後〜150,000円）</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">転職特化</span>
              <h3 className="font-bold text-gray-900">TECH CAMP（AIコース）</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">従来のWebエンジニアコースに加え、AIエンジニア向けコースも拡充。転職保証付き。</p>
            <p className="text-xs text-gray-400">料金：詳細は公式サイトでご確認ください</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">独学でAIを学ぶ場合との比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">項目</th>
                <th className="border border-gray-200 px-3 py-2 text-center">スクール</th>
                <th className="border border-gray-200 px-3 py-2 text-center">独学</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: '学習期間', school: '6ヶ月〜', self: '1〜2年' },
                { item: '費用', school: '〜50万円', self: '数万円' },
                { item: '転職サポート', school: '◎ 充実', self: '× なし' },
                { item: '挫折リスク', school: '低い', self: '高い（独学挫折率95%）' },
              ].map((row, i) => (
                <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2">{row.item}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{row.school}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{row.self}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ),
  'programming-school-shakaijin-osusume': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">仕事をしながらプログラミングを学ぶのは、時間管理の面で大きなハードルがあります。しかし2025年現在、社会人のライフスタイルに合わせた夜間・週末・オンライン対応のスクールが充実しており、無理なく学習を継続できる環境が整っています。本記事では、社会人が働きながら通えるおすすめスクール5選を徹底比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社会人がスクール選びで重視すべき3つのポイント</h2>
        <p className="mb-4">社会人がプログラミングスクールを選ぶ際には、学習スタイルの柔軟性・メンタリングのサポート体制・転職支援の充実度の3点が特に重要です。平日の夜や土日にしか学習時間を確保できない場合、非同期でのサポートが受けられるかどうかも確認しましょう。</p>
        <div className="bg-blue-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-blue-800 mb-3">チェックリスト：社会人向けスクールの見極め方</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">✓</span><span>オンライン完結で受講できるか</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">✓</span><span>夜間・週末にメンター質問が可能か</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">✓</span><span>受講期間の延長制度はあるか</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">✓</span><span>転職活動中もサポートが続くか</span></li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">社会人おすすめスクール5選：比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール名</th>
                <th className="border border-gray-200 px-3 py-2 text-left">受講形式</th>
                <th className="border border-gray-200 px-3 py-2 text-left">期間</th>
                <th className="border border-gray-200 px-3 py-2 text-left">料金</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'TECH CAMP 夜間・休日コース', style: 'オンライン', period: '10週間', price: '748,000円〜' },
                { name: 'DMM WEBCAMP', style: 'オンライン', period: '3ヶ月〜', price: '437,800円〜' },
                { name: 'TechAcademy', style: 'オンライン', period: '4週間〜', price: '174,900円〜' },
                { name: 'RUNTEQ', style: 'オンライン', period: '9ヶ月', price: '550,000円' },
                { name: 'CodeCamp', style: 'オンライン', period: '2ヶ月〜', price: '129,800円〜' },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.name}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.style}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.period}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※料金は2025年6月時点の情報です。詳細は各スクール公式サイトをご確認ください。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">各スクールの特徴と社会人向けポイント</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">1. TECH CAMP 夜間・休日コース</h3>
            <p className="text-sm text-gray-700 mb-2">社会人向けの夜間・休日専用コースを設けており、平日夜と土日で10週間学習するスタイルです。転職成功率99%（自社調べ）・転職保証付きと実績も十分。毎日メンターに質問できるサポート体制が心強いです。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMPの詳細ページ</a>をご覧ください。</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">2. DMM WEBCAMP</h3>
            <p className="text-sm text-gray-700 mb-2">完全オンラインで、自分のペースに合わせた学習が可能です。教育訓練給付金の対象で最大70%OFFになるため、コスト面での負担が少ない点も社会人に嬉しいポイントです。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/dmm-webcamp" className="text-green-600 underline">DMM WEBCAMPの詳細ページ</a>をご覧ください。</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-bold text-purple-800 mb-2">3. RUNTEQ</h3>
            <p className="text-sm text-gray-700 mb-2">9ヶ月の長期コースながら完全オンライン対応。社会人でも無理なく続けられる設計になっており、実務レベルのスキルを身につけたい方に向いています。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/runteq" className="text-purple-600 underline">RUNTEQの詳細ページ</a>をご覧ください。</p>
          </div>
        </div>
      </section>
      <section>
        <p className="text-sm text-gray-700">社会人がプログラミングを学ぶ最大の壁は「時間の確保」です。1日1〜2時間でも継続できるスクールを選ぶことが、挫折しないための最大のポイントです。まずは無料カウンセリングを活用して、自分に合った学習ペースを相談してみましょう。</p>
      </section>
    </div>
  ),
  'programming-school-josei-osusume': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">「女性がプログラミングを学びやすい環境かどうか」は、スクール選びにおいて見落とされがちな重要な視点です。女性講師の有無・女性専用コミュニティ・育児中でも学べる柔軟なスケジュールなど、女性特有のニーズに応えるスクールは確実に増えています。本記事では2025年時点で女性におすすめのプログラミングスクール5選を紹介します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">女性がプログラミングを学ぶ背景</h2>
        <p className="mb-4">IT業界における女性エンジニアの比率は依然として低く（約20%程度）、裏を返せば市場価値が高いとも言えます。育児や家事と両立しながらキャリアアップを目指す女性にとって、リモートワーク可能なエンジニア職は特に魅力的な選択肢です。</p>
        <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
          <p className="font-bold text-pink-800 mb-2">女性エンジニアの働き方メリット</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li className="flex gap-2"><span className="text-pink-500">✓</span><span>フルリモート求人が多く、育児と両立しやすい</span></li>
            <li className="flex gap-2"><span className="text-pink-500">✓</span><span>スキルが評価される実力主義の職場が多い</span></li>
            <li className="flex gap-2"><span className="text-pink-500">✓</span><span>フリーランスとして時短・時間帯を選べる</span></li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">女性におすすめスクール5選：比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール名</th>
                <th className="border border-gray-200 px-3 py-2 text-left">女性向けサポート</th>
                <th className="border border-gray-200 px-3 py-2 text-left">料金</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'TECH CAMP', support: '女性受講生コミュニティあり', price: '748,000円〜' },
                { name: 'DMM WEBCAMP', support: '女性カウンセラー対応・給付金利用可', price: '437,800円〜' },
                { name: 'TechAcademy', support: 'オンライン完結・育児中でも受講可', price: '174,900円〜' },
                { name: 'RUNTEQ', support: '女性エンジニアのロールモデル多数', price: '550,000円' },
                { name: 'CodeCamp', support: 'マンツーマン・女性講師選択可', price: '129,800円〜' },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.name}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.support}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">育児中・ブランク明けの女性でも学べる？</h2>
        <p className="mb-4">育児中や離職期間がある女性でも、オンラインのプログラミングスクールであれば自分のペースで学習を進められます。特にTechAcademyは学習期間を自由に設定できるため、子育てと並行して学びたい方に人気です。</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-bold text-yellow-800 mb-2">ポイント：給付金は育児中でも使える？</p>
          <p className="text-sm text-gray-700">育児休業中であっても、雇用保険加入期間の条件を満たせば教育訓練給付金を利用できる場合があります。詳しくはハローワークに相談しましょう。<a href="/columns/teiten-hojo-programming-school" className="text-slate-700 underline ml-1">給付金の詳細はこちら</a></p>
        </div>
      </section>
      <section>
        <p className="text-sm text-gray-700">女性がプログラミングスクールを選ぶ際は、「卒業後に女性エンジニアとして働いている先輩の声」を参考にするのが最も参考になります。各スクールの無料カウンセリングでは、女性向けのサポート内容を具体的に確認してみましょう。</p>
      </section>
    </div>
  ),
  'programming-school-40dai-osusume': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">「40代・50代からでもプログラミングスクールに通えるの？」という疑問を持つ方は多くいます。結論から言うと、学習自体は何歳からでも可能ですが、転職市場の現実を理解した上でスクールを選ぶことが重要です。本記事では、シニア世代がプログラミングを学ぶ際の現実と、成功するための対策を解説します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">40代・50代のプログラミング学習：現実と可能性</h2>
        <p className="mb-4">プログラミングスクールの多くは年齢制限を設けておらず、40代・50代の受講生も珍しくありません。ただし「未経験からのエンジニア転職」という観点では、20〜30代と比べて難易度が上がることは正直に伝えておく必要があります。</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">40代・50代の強み</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-green-500">+</span><span>業務経験・ビジネス知識が豊富</span></li>
              <li className="flex gap-2"><span className="text-green-500">+</span><span>自己管理能力・コミュニケーション力が高い</span></li>
              <li className="flex gap-2"><span className="text-green-500">+</span><span>特定業界のドメイン知識を活かせる</span></li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">課題と対策</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-red-500">-</span><span>転職市場での年齢ハードル</span></li>
              <li className="flex gap-2"><span className="text-red-500">-</span><span>新技術の習得に時間がかかる場合も</span></li>
              <li className="flex gap-2"><span className="text-red-500">-</span><span>転職ではなく社内DX活用が現実的な場合も</span></li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">40代・50代にとっての現実的な目標設定</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">転職を目指す場合</h3>
            <p className="text-sm text-gray-700">未経験エンジニア転職は難易度が高いため、現職の業界知識とプログラミングを組み合わせた「DXエンジニア」や「社内SE」などを狙うのが現実的です。医療・製造・金融などの専門業界でのITエンジニア需要は高く、業界知識は大きな武器になります。</p>
          </div>
          <div className="border-l-4 border-green-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">副業・フリーランスを目指す場合</h3>
            <p className="text-sm text-gray-700">業務委託・フリーランスとして特定ジャンルに特化した仕事を受注するルートは、年齢より実力が問われるため比較的有利です。<a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMP</a>や<a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMP</a>のキャリアカウンセリングで個別の状況を相談することをおすすめします。</p>
          </div>
          <div className="border-l-4 border-purple-400 pl-4">
            <h3 className="font-bold text-gray-900 mb-1">スキルアップ・DX推進を目指す場合</h3>
            <p className="text-sm text-gray-700">転職が目的でない場合、現職でのDX推進やExcel・ノーコードツールの習得から始め、徐々にPythonやSQLに広げるアプローチが無理なく続けられます。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">40代・50代におすすめのスクール選び方</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">目的</th>
                <th className="border border-gray-200 px-3 py-2 text-left">おすすめスクール</th>
                <th className="border border-gray-200 px-3 py-2 text-left">理由</th>
              </tr>
            </thead>
            <tbody>
              {[
                { goal: '転職・キャリアチェンジ', school: 'TECH CAMP / DMM WEBCAMP', reason: '転職サポートが充実・個別カウンセリングあり' },
                { goal: '副業・フリーランス', school: 'TechAcademy / CoachTech', reason: '案件紹介まで対応・実践的なスキル習得' },
                { goal: 'スキルアップ・趣味', school: 'Progate / CodeCamp', reason: '低コストで始められる・自分ペースで学習可' },
              ].map((row, i) => (
                <tr key={row.goal} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.goal}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.school}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <p className="text-sm text-gray-700">40代・50代からのプログラミング学習は「遅すぎる」ことはありません。ただし、目標を現実的に設定し、自分の強みと組み合わせる戦略が成功のカギです。まずは無料カウンセリングを活用して、キャリアアドバイザーに相談することをおすすめします。</p>
      </section>
    </div>
  ),
  'dokugaku-vs-school': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">「プログラミングは独学でも学べる」という意見がある一方、「スクールに通わないと挫折する」という声も多く聞かれます。どちらが正しいかは一概に言えず、学習者の状況や目標によって大きく異なります。本記事では独学とスクールの違いを費用・期間・転職成功率などの具体的な指標で徹底比較し、あなたに合った選択をサポートします。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">独学 vs スクール：数字で比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">比較項目</th>
                <th className="border border-gray-200 px-3 py-2 text-center">独学</th>
                <th className="border border-gray-200 px-3 py-2 text-center">スクール</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: '費用', self: '無料〜数万円', school: '13万〜75万円' },
                { item: '学習期間（転職まで）', self: '1〜3年', school: '3ヶ月〜9ヶ月' },
                { item: '挫折率', self: '約95%', school: '約20〜30%' },
                { item: '転職成功率', self: 'データなし（低め）', school: '95〜99%（各社自社調べ）' },
                { item: 'メンターサポート', self: 'なし', school: 'あり（チャット・ビデオ）' },
                { item: 'カリキュラム', self: '自己設計が必要', school: '体系的に設計済み' },
                { item: 'ポートフォリオ支援', self: 'なし', school: 'あり（多くのスクール）' },
              ].map((row, i) => (
                <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.item}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{row.self}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-blue-700 font-medium">{row.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※挫折率・転職成功率は各種調査・スクール公式データをもとにした参考値です。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">独学が向いている人・スクールが向いている人</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-3">独学が向いている人</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex gap-2"><span className="text-gray-500">✓</span><span>自走力があり、問題を自力で調べられる</span></li>
              <li className="flex gap-2"><span className="text-gray-500">✓</span><span>転職よりスキルアップ・趣味が目的</span></li>
              <li className="flex gap-2"><span className="text-gray-500">✓</span><span>費用をできる限り抑えたい</span></li>
              <li className="flex gap-2"><span className="text-gray-500">✓</span><span>すでにある程度の技術的基礎がある</span></li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-3">スクールが向いている人</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>エンジニア転職を明確な目標としている</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>短期間で確実にスキルを習得したい</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>挫折経験があり、サポートが必要</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>転職後の年収アップを期待している</span></li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スクール受講の費用対効果を試算する</h2>
        <p className="mb-4">スクールの費用は高く見えますが、転職後の年収増加を考えると長期的なROIは高くなります。たとえば転職後に年収が100万円アップすれば、50万円のスクール費用は半年で回収できます。</p>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="font-bold text-green-800 mb-2">費用対効果の試算例</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・スクール費用（給付金活用後）：約13万円（DMM WEBCAMP）</li>
            <li>・転職後の年収増加：+80〜150万円（未経験→エンジニア）</li>
            <li>・回収期間：約1〜2ヶ月</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600 mt-3">転職目的であれば、<a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMP</a>や<a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMP</a>のような転職保証・給付金対応スクールの活用を強くおすすめします。</p>
      </section>
      <section>
        <p className="text-sm text-gray-700">独学かスクールかという二択ではなく、「まずProgateで独学を試してから、本気になったらスクールに切り替える」というハイブリッドアプローチも有効です。最終的には自分の目標と状況に合わせて判断することが大切です。</p>
      </section>
    </div>
  ),
  'engineer-tensyoku-kikan': (
    <div className="space-y-8">
      <section>
        <p className="mb-4">「未経験からエンジニアに転職するまでどのくらいかかるの？」は、プログラミング学習を始める前に誰もが気になる疑問です。正直に言うと、個人の学習ペースや目標とするエンジニア像によって大きく異なりますが、現実的な平均期間と必要な準備を理解することで、より戦略的に学習を進められます。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">未経験エンジニア転職までの平均期間</h2>
        <p className="mb-4">一般的に、未経験からエンジニア転職までに必要な期間は「学習期間3〜9ヶ月＋転職活動1〜3ヶ月」で、合計4ヶ月〜1年程度が目安です。スクールを活用した場合と独学の場合では大きく差が出ます。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2 text-left">学習方法</th>
                <th className="border border-gray-200 px-3 py-2 text-left">学習期間</th>
                <th className="border border-gray-200 px-3 py-2 text-left">転職活動</th>
                <th className="border border-gray-200 px-3 py-2 text-left">合計期間</th>
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'スクール（短期集中）', study: '3ヶ月', job: '1〜2ヶ月', total: '4〜5ヶ月' },
                { method: 'スクール（標準）', study: '6ヶ月', job: '1〜3ヶ月', total: '7〜9ヶ月' },
                { method: 'スクール（本格コース）', study: '9ヶ月', job: '1〜3ヶ月', total: '10〜12ヶ月' },
                { method: '独学', study: '1〜2年', job: '3〜6ヶ月', total: '15〜30ヶ月' },
              ].map((row, i) => (
                <tr key={row.method} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.method}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.study}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.job}</td>
                  <td className="border border-gray-200 px-3 py-2 font-bold text-blue-700">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">転職成功に必要なスキルレベルとは</h2>
        <p className="mb-4">企業が未経験エンジニアに求めるスキルレベルは年々上がっています。「HTMLとCSSが書ける」だけでは転職市場でのアピールは難しく、実用的なWebアプリを1〜2本ポートフォリオとして作れることが求められます。</p>
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">最低限必要なスキルセット（フロントエンド）</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>HTML / CSS / JavaScript（ES6+）</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>ReactまたはVue.jsの基礎</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>GitHubでのバージョン管理</span></li>
              <li className="flex gap-2"><span className="text-blue-500">✓</span><span>オリジナルWebアプリ1〜2本（ポートフォリオ）</span></li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">最低限必要なスキルセット（バックエンド・Rails系）</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-green-500">✓</span><span>Ruby on Rails または Laravel の基礎</span></li>
              <li className="flex gap-2"><span className="text-green-500">✓</span><span>データベース（SQL）の基礎</span></li>
              <li className="flex gap-2"><span className="text-green-500">✓</span><span>REST APIの設計・実装</span></li>
              <li className="flex gap-2"><span className="text-green-500">✓</span><span>Heroku / Renderなどへのデプロイ経験</span></li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スクール別の転職実績比較</h2>
        <div className="space-y-3">
          {[
            { name: 'TECH CAMP', rate: '99%', period: '平均2ヶ月以内', link: '/schools/techcamp', color: 'blue' },
            { name: 'DMM WEBCAMP', rate: '98%', period: '平均1〜3ヶ月', link: '/schools/dmm-webcamp', color: 'green' },
            { name: 'RUNTEQ', rate: '95%以上', period: '平均2〜3ヶ月', link: '/schools/runteq', color: 'purple' },
          ].map((s) => (
            <div key={s.name} className={`border border-${s.color}-200 rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <a href={s.link} className={`font-bold text-${s.color}-700 underline`}>{s.name}</a>
                <p className="text-xs text-gray-500 mt-0.5">転職活動期間：{s.period}</p>
              </div>
              <span className="text-lg font-bold text-red-600">{s.rate}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">※転職成功率は各社自社調べ。条件・定義は各スクールにより異なります。</p>
      </section>
      <section>
        <p className="text-sm text-gray-700">未経験からエンジニア転職を目指すなら、「何ヶ月で転職できるか」より「どのスキルレベルに達するか」を重視することが重要です。転職保証のあるスクールを選べば、目標達成まで手厚いサポートを受けながら学習を進められます。まずは<a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMP</a>や<a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMP</a>の無料カウンセリングで、自分の状況に合ったプランを相談してみましょう。</p>
      </section>
    </div>
  ),
};

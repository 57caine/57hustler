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
            <li>✅ 転職成功率99%（自社調べ）</li>
            <li>✅ 業界最大規模・卒業生5万人以上</li>
            <li>✅ 転職できなければ全額返金保証</li>
            <li>💰 料金：748,000円〜（夜間・休日10週間コース）</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-green-800 mb-2">2位：DMM WEBCAMP（ディーエムエム ウェブキャンプ）</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✅ 受講者数9万人突破</li>
            <li>✅ 最大70%給付金対象</li>
            <li>✅ 転職成功率98%</li>
            <li>💰 料金：437,800円〜（給付金適用後130,000円程度）</li>
          </ul>
        </div>
        <div className="bg-purple-50 rounded-xl p-5">
          <h3 className="font-bold text-purple-800 mb-2">3位：RUNTEQ（ランテック）</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✅ 実務レベルのスキルが身につく</li>
            <li>✅ 卒業生の評価が業界最高水準</li>
            <li>✅ 9ヶ月間の充実したカリキュラム</li>
            <li>💰 料金：550,000円（Webエンジニア転職コース）</li>
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
          <li className="flex gap-2"><span className="font-bold text-blue-600 shrink-0">転職希望：</span><span>TECH CAMP または DMM WEBCAMP（転職保証・給付金あり）</span></li>
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
          <p className="font-bold text-yellow-800 mb-2">💡 受給条件（一般的）</p>
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
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>ハローワークで訓練前キャリアコンサルティングを受ける</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>給付金支給申請書を入手する</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>スクールに入学・受講開始</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>受講修了後1ヶ月以内にハローワークへ支給申請</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">5</span><span>審査後、給付金が振込まれる</span></li>
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
          <p className="font-bold text-blue-800 mb-2">📊 未経験エンジニア転職の現状</p>
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
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span><span>スクールでWebアプリ開発の基礎を習得（3〜6ヶ月）</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span><span>副業で小規模案件を受注・実績を積む（3〜6ヶ月）</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span><span>月30万円以上の安定収入が見込めたら独立</span></li>
          <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span><span>エージェント（レバテックフリーランス等）で高単価案件へ</span></li>
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
          <p className="font-bold text-red-800 mb-2">🔥 AIエンジニアの市場価値</p>
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
};

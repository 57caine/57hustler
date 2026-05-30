import React from 'react';
import Link from 'next/link';

export type Column = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  headings?: string[];
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
    headings: ['プログラミングスクール選びの3つのポイント', '転職特化型スクール比較', 'スキルアップ・副業向けスクール比較', 'まとめ：目的別おすすめスクール'],
  },
  {
    slug: 'teiten-hojo-programming-school',
    title: '給付金・補助金が使えるプログラミングスクール一覧【最大70%OFF】',
    description: '厚生労働省の教育訓練給付金を使って最大70%オフで受講できるプログラミングスクールを紹介。申請方法・条件も解説。',
    category: '費用・給付金',
    publishedAt: '2025-03-15',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['教育訓練給付金とは？', '給付金対応プログラミングスクール一覧', '給付金申請の流れ'],
  },
  {
    slug: 'mikeiken-engineer-tenshi',
    title: '未経験からエンジニア転職できるスクール3選｜成功率で比較',
    description: '未経験からIT・エンジニア職への転職を目指す人向けに転職成功率の高いスクールを徹底比較。転職保証あり・なしの違いも解説。',
    category: '転職・キャリア',
    publishedAt: '2025-03-01',
    updatedAt: '2025-05-15',
    readingTime: 10,
    headings: ['未経験からエンジニア転職できる？現実を解説', '転職成功率が高いスクール3選', '転職保証とは？条件を確認しよう'],
  },
  {
    slug: 'programming-school-ryokin-hikaku',
    title: 'プログラミングスクールの費用・料金を比較【安い順ランキング】',
    description: '主要プログラミングスクール8校の料金を一覧で比較。月額制・一括払い・分割払いのそれぞれのメリットも解説。',
    category: '費用・給付金',
    publishedAt: '2025-02-15',
    updatedAt: '2025-06-01',
    readingTime: 7,
    headings: ['プログラミングスクール料金比較一覧（安い順）', '分割払い・ローンの活用', 'コスパ最強スクールはどこ？'],
  },
  {
    slug: 'freelance-engineer-school',
    title: 'フリーランスエンジニアになるためのスクール選び方【2026年版】',
    description: '副業・フリーランスエンジニアを目指す人向けのスクール選び方ガイド。案件紹介まで対応するCoachTechなどフリーランス特化スクールを紹介。',
    category: '転職・キャリア',
    publishedAt: '2025-02-01',
    updatedAt: '2025-05-01',
    readingTime: 9,
    headings: ['フリーランスエンジニアの現実：需要と収入', 'フリーランス特化スクール：CoachTech', 'フリーランスになるまでのロードマップ'],
  },
  {
    slug: 'ai-engineer-school-guide',
    title: 'AIエンジニアになるためのスクール選び方｜ChatGPT時代の学び方',
    description: 'Python・機械学習・ChatGPT APIを学べるAI特化プログラミングスクールを比較。需要が高まるAIエンジニア転職への最短ルートを解説。',
    category: 'AI・最新技術',
    publishedAt: '2025-01-15',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['AIエンジニアとは？2025年の需要', 'AIエンジニアを目指せるスクール', '独学でAIを学ぶ場合との比較'],
  },
  {
    slug: 'programming-school-shakaijin-osusume',
    title: '社会人におすすめプログラミングスクール5選【2025年・働きながら学べる】',
    description: '社会人が働きながらプログラミングを学べるスクールを徹底比較。夜間・週末対応、オンライン受講可能なスクールを厳選紹介。',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['社会人がスクール選びで重視すべき3つのポイント', '社会人おすすめスクール5選：比較表', '各スクールの特徴と社会人向けポイント'],
  },
  {
    slug: 'programming-school-josei-osusume',
    title: '女性向けプログラミングスクール おすすめ5選【2026年版】',
    description: '女性が学びやすいプログラミングスクールを比較。女性講師・女性コミュニティ・育児との両立サポートなど女性特有のニーズに応えるスクールを紹介。',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 7,
    headings: ['女性がプログラミングを学ぶ背景', '女性におすすめスクール5選：比較表', '育児中・ブランク明けの女性でも学べる？'],
  },
  {
    slug: 'programming-school-40dai-osusume',
    title: '40代・50代からでもプログラミングスクールに通える？【現実と対策】',
    description: '40代・50代でプログラミングスクールに通う際の疑問と不安を解消。年齢制限・転職可能性・学習期間など、シニア世代が気になるポイントを解説。',
    category: '転職・キャリア',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 7,
    headings: ['40代・50代のプログラミング学習：現実と可能性', '40代・50代にとっての現実的な目標設定', '40代・50代におすすめのスクール選び方'],
  },
  {
    slug: 'dokugaku-vs-school',
    title: 'プログラミング独学 vs スクール どっちがいい？【費用・期間・転職率で比較】',
    description: 'プログラミングを独学とスクールで学ぶ場合を徹底比較。費用・学習期間・転職成功率・挫折率などを具体的な数字で解説。あなたに向いているのはどっち？',
    category: 'スクール比較',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['独学 vs スクール：数字で比較', '独学が向いている人・スクールが向いている人', 'スクール受講の費用対効果を試算する'],
  },
  {
    slug: 'engineer-tensyoku-kikan',
    title: '未経験からエンジニア転職まで何ヶ月かかる？【リアルな期間と準備方法】',
    description: '未経験からエンジニアに転職するまでの現実的な期間を解説。スクール別の転職実績や準備にかかる時間、転職成功のために必要なスキルレベルを詳しく紹介。',
    category: '転職・キャリア',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['未経験エンジニア転職までの平均期間', '転職成功に必要なスキルレベルとは', 'スクール別の転職実績比較'],
  },
  {
    slug: 'python-programming-school',
    title: 'Pythonが学べるプログラミングスクール おすすめ5選【2026年版・AI・データサイエンス対応】',
    description: 'Python・機械学習・データサイエンスが学べるプログラミングスクールを徹底比較。AI・バックエンド・副業など目的別のおすすめスクールを料金・カリキュラムで選べます。',
    category: 'AI・最新技術',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 9,
    headings: ['Pythonで目指せるキャリア', 'Pythonが学べるスクール比較', 'Python学習のロードマップ'],
  },
  {
    slug: 'web-seisaku-school',
    title: 'Web制作が学べるプログラミングスクール おすすめ5選【HTML/CSS/JavaScript対応】',
    description: 'HTMLコーダー・Webデザイナー・フロントエンドエンジニアを目指す方向けのスクールを比較。未経験から副業・転職まで対応したWeb制作特化スクールを紹介。',
    category: 'スクール比較',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 8,
    headings: ['Web制作で目指せるキャリア', 'Web制作スクール 比較表', '副業を目指すなら何ヶ月で稼げる？'],
  },
  {
    slug: 'tensyoku-hosho-school',
    title: '転職保証付きプログラミングスクール比較【2026年版・返金条件も徹底解説】',
    description: '転職できなければ全額返金・一部返金の転職保証があるプログラミングスクールを比較。保証の条件・対象コース・実績を詳しく解説。未経験転職を確実にしたい方向け。',
    category: '転職・就職',
    publishedAt: '2026-05-25',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['転職保証とは？仕組みと注意点', '転職保証付きスクール 比較', '転職保証を最大限活かすための学習戦略', '転職保証なしでも検討すべき優良スクール'],
  },
  {
    slug: 'programming-school-30dai',
    title: '30代からのプログラミングスクール選び方【未経験・転職成功のポイント解説】',
    description: '30代でプログラミングを学ぶメリット・デメリットと、30代未経験からIT転職に成功するためのスクール選び方を解説。年収・就職先・現実的な転職ルートも紹介。',
    category: '年代別おすすめ',
    publishedAt: '2026-05-26',
    updatedAt: '2026-05-29',
    readingTime: 9,
    headings: ['30代でのエンジニア転職は現実的か？', '30代にお勧めのプログラミングスクール', '30代エンジニア転職のリアルなタイムライン', '30代でエンジニアを目指す前に確認すること'],
  },
  {
    slug: 'javascript-react-school',
    title: 'JavaScript・Reactが学べるプログラミングスクール おすすめ5選【2026年版】',
    description: 'JavaScriptとReactに特化したプログラミングスクールを比較。フロントエンドエンジニア転職・Web制作副業を目指す方向けに、カリキュラム・費用・転職実績をランキング形式で紹介。',
    category: 'スクール比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['なぜJavaScript・Reactを選ぶのか', 'JavaScript・React特化スクール おすすめランキング', 'JavaScript学習ロードマップ'],
  },
  {
    slug: 'programming-school-20dai-osusume',
    title: '20代・大学生・新卒向けプログラミングスクールおすすめ3選【2026年版】',
    description: '20代や大学生・新卒の方向けにコスパと転職サポートを重視したプログラミングスクールを厳選。給付金活用・就職実績・無料体験の観点から3校を徹底比較します。',
    category: '年代別おすすめ',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 8,
    headings: ['20代がプログラミングスクールを選ぶポイント', '20代・新卒向けスクールおすすめ3選', '20代でエンジニアになるメリット'],
  },
  {
    slug: 'web-frontend-school',
    title: 'Webフロントエンドエンジニアを目指せるスクール比較【HTML/CSS/JavaScript対応】',
    description: 'HTML・CSS・JavaScript・Reactを学べるWebフロントエンド特化スクールを比較。転職に必要なスキルセットと各スクールのカリキュラムの違いを解説します。',
    category: 'スクール比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 9,
    headings: ['Webフロントエンドエンジニアに必要なスキルとは', 'Webフロントエンド対応スクール比較', 'フロントエンドエンジニアの就職・転職先'],
  },
  {
    slug: 'school-koukai-shinai-erabi',
    title: 'プログラミングスクールで後悔しないための選び方【失敗例と回避策】',
    description: 'プログラミングスクールで後悔した人の失敗パターンを分析。「高い受講料が無駄だった」「就職できなかった」などの失敗を避けるための選び方・確認事項を詳しく解説。',
    category: 'スクール比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 9,
    headings: ['プログラミングスクールで後悔する人の共通パターン', '入学前に必ず確認すべき7つのポイント', '後悔しにくいスクールの特徴まとめ'],
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
        <div className="bg-slate-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-slate-800 mb-2">1位：TECH CAMP（テックキャンプ）</h3>
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
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">転職希望：</span><span><a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMP</a> または <a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMP</a>（転職保証・給付金あり）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">本格スキル習得：</span><span><a href="/schools/runteq" className="text-slate-700 underline">RUNTEQ</a>（9ヶ月間・実務レベル）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">副業・学習：</span><span><a href="/schools/techacademy" className="text-slate-700 underline">TechAcademy</a> または <a href="/schools/progate" className="text-slate-700 underline">Progate</a>（コスパ重視）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">フリーランス：</span><span><a href="/schools/coachtech" className="text-slate-700 underline">CoachTech</a>（案件紹介まで対応）</span></li>
          <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">AI特化：</span><span><a href="/schools/zero-plus" className="text-slate-700 underline">ゼロプラス</a>（Python・ChatGPT API）</span></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'プログラミングスクールに通う前に独学を試すべきですか？', a: '独学で1〜2ヶ月試してから判断するのが理想的です。Progate・ドットインストール等の無料ツールで「続けられるか」「楽しいと感じるか」を確認しましょう。ただし転職を目指すなら、独学だけでは採用実績・転職支援が受けられません。転職成功率の高いスクールに入った方が、結果的に最短で目標達成できる場合が多いです。' },
            { q: '給付金は誰でも受け取れますか？', a: '「特定一般教育訓練給付金（受講費の40%還付、上限20万円）」「専門実践教育訓練給付金（同70%、最大56万円）」の2種類があります。条件は在職者・離職者で異なりますが、雇用保険に1年以上加入（在職者）または通算2年以上加入（離職者）が基本要件。受講前にハローワークでの事前手続きが必要です。' },
            { q: '転職保証（返金保証）は本当に信頼できますか？', a: '条件を確認することが重要です。多くのスクールは「卒業後〇ヶ月以内に就職できなかった場合」「提出課題を全て完了している場合」など条件付き。実績の高いスクール（TECH CAMP・DMM WEBCAMP等）は返金実績も公開しており、信頼性は高いと評価されています。保証内容の細則を入学前に必ず確認してください。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '教育訓練給付金を申請する際の注意点は何ですか？', a: '最大のポイントは「受講開始前にハローワークで手続きが必要」な点です。受講を開始してから申請しても給付を受けられません。また、給付金対象の講座かどうかをスクールのページまたは厚労省の検索システムで必ず確認してください。条件（雇用保険加入期間等）を満たしているかの事前確認もハローワークで行えます。' },
            { q: '給付金対応スクールは授業の質が低いですか？', a: 'そんなことはありません。DMM WEBCAMP・TECH CAMP・ヒューマンアカデミーなど、業界大手の多くが給付金対象です。給付金対象になるためには厚労省の審査をクリアする必要があり、カリキュラムの質・修了率なども審査されます。むしろ給付金対応スクールのほうが体系的に整備されている傾向があります。' },
            { q: '給付金は転職後にも受け取れますか？', a: '「専門実践教育訓練給付金」は、受講修了後1年以内に転職（就職）に成功した場合、追加で受講費の20%が給付される「追加給付」があります（合計最大70%）。ただし、条件として雇用保険加入者であること等が必要。給付を最大化するなら、スクール選びと転職活動の両方を計画的に進めることが重要です。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
  'mikeiken-engineer-tenshi': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">未経験からエンジニア転職できる？現実を解説</h2>
        <p className="mb-4">結論から言うと、未経験からのエンジニア転職は十分可能です。ただし、独学だけでは難しく、適切なスクールとサポートが成功の鍵を握ります。</p>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="font-bold text-slate-800 mb-2">未経験エンジニア転職の現状（2025年）</p>
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
          <li className="flex gap-2"><span className="text-red-500">△</span><span>一定数以上の求人応募実績が必要</span></li>
          <li className="flex gap-2"><span className="text-red-500">△</span><span>提示された求人を断った場合は対象外</span></li>
          <li className="flex gap-2"><span className="text-red-500">△</span><span>卒業後6ヶ月〜1年以内という期間制限あり</span></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '未経験からエンジニアに転職するのに何ヶ月かかりますか？', a: '平均的には学習開始から転職成功まで3〜6ヶ月が目安です。スクール在籍中（3ヶ月）に転職活動を並行し、卒業後1〜2ヶ月で内定を取るパターンが多いです。ただし学習量・スクール選択・転職市場の状況によって大きく変わります。転職保証付きスクールを選ぶと最長期間のサポートが受けられます。' },
            { q: '未経験エンジニアの初任給はどのくらいですか？', a: '20代前半の未経験転職では月給22〜30万円程度が相場です（年収300〜420万円）。スクール卒業者の初任給中央値は年収350〜380万円程度との調査も。経験を積めば1〜3年で年収500〜600万円以上を目指すことができます。Web系よりSIer（受託開発）の方が初任給が高い傾向がありますが、その後のキャリアパスは異なります。' },
            { q: '転職先の企業はどう選べばいいですか？', a: '未経験転職では「研修制度・メンター制度が整っているか」「エンジニアの比率が高いか」「モダンな技術スタックを使っているか」が重要な判断基準です。SESや客先常駐専門の企業は技術スキルが伸びにくい場合も。スクールの転職支援で紹介される企業の質も、スクール選びの重要なポイントになります。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
          <li className="flex gap-2"><span className="text-slate-500 font-bold">○</span><span><strong>Progate</strong>：月990円、まず試してみたい人に最適</span></li>
          <li className="flex gap-2"><span className="text-purple-500 font-bold">○</span><span><strong>TechAcademy</strong>：副業月5万円を目指すなら17万円投資は元が取れる</span></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'プログラミングスクールの料金が高い理由は何ですか？', a: '主に人件費（メンター・チューター・カウンセラー）と転職支援コスト（求人開拓・面接対策・企業とのマッチング）が占めます。また、少人数制・個別指導のスクールほど料金が高くなります。料金の高さと転職成功率は必ずしも比例しませんが、転職保証付きのスクールは失敗リスクが低くコスパが良いと評価されています。' },
            { q: '分割払いやローンを利用する場合の注意点は？', a: '金利0%キャンペーン（スクール提携のローン）を利用すれば実質無利子で分割払いが可能なスクールもあります。金融機関のカードローンは金利が高いため避けましょう。また、給付金は受講費の40〜70%が戻る制度のため、先に全額支払って給付を受けてから実質負担額を計算すると、分割払いのメリットが見えやすくなります。' },
            { q: '最も安いプログラミングスクールを教えてください', a: '月額制のProgateやドットインストール（月990〜1,000円程度）が最安値ですが、転職支援は含まれません。転職支援付きで最安値クラスはTechAcademy（4週間コース174,900円〜）、CodeCamp（129,800円〜）など。給付金対応スクールでは給付後の実質負担が130,000円程度になる場合もあります。目的に合わせて選びましょう。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
            <div key={stat.label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="font-bold text-slate-700 text-lg">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フリーランス特化スクール：<a href="/schools/coachtech" className="text-slate-700 underline">CoachTech</a></h2>
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">CoachTech（コーチテック）の特徴</h3>
          <ul className="text-sm space-y-2">
            <li className="flex gap-2"><span className="text-emerald-500 shrink-0">◎</span><span>卒業後の案件紹介まで一貫サポート</span></li>
            <li className="flex gap-2"><span className="text-emerald-500 shrink-0">◎</span><span>チーム開発でポートフォリオが作れる</span></li>
            <li className="flex gap-2"><span className="text-emerald-500 shrink-0">◎</span><span>PHP/Laravel・Vue.jsなど案件需要が高い言語</span></li>
            <li className="flex gap-2"><span className="text-amber-400 shrink-0">△</span><span>転職サポートはやや弱め</span></li>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'フリーランスエンジニアは会社員より収入が高いですか？', a: '平均的にはYes。フリーランスエンジニアの平均年収は700〜900万円程度（会社員の1.5〜2倍）という調査があります。ただし、会社員と違い社会保険料を自分で払う・確定申告が必要・案件が途切れるリスクがある等のデメリットも考慮する必要があります。副業からフリーランスへの段階的移行が現実的です。' },
            { q: 'フリーランスエンジニアになるまでに最低どのくらいのスキルが必要ですか？', a: '最低でも「1つの言語でWebアプリを単独で作れる」レベルが必要です。具体的にはGitHub管理・データベース設計・API連携を含む実装経験が望ましい。CoachTechなどフリーランス特化スクールでは、案件獲得の実績作りまで支援してくれます。未経験から直接フリーランスは非常に困難で、まず会社員エンジニアとして2〜3年経験を積むのが現実的なルートです。' },
            { q: 'フリーランスになるのに法人化（会社設立）は必要ですか？', a: '最初は個人事業主として始めるのが一般的です。年収が500万円を超えてくると法人化（合同会社や株式会社）を検討するケースが多いです。法人化すると税制上のメリット（役員報酬の経費化等）がある反面、手続きコスト・社会保険料の会社負担が発生します。スタートは個人事業主で問題ありません。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">転職特化</span>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'AIエンジニアになるためにはどのくらいの期間が必要ですか？', a: '基礎的なAI・機械学習を扱えるレベルまでは3〜6ヶ月が目安。ただし実業務レベルで活躍するには1〜2年の実践経験が必要です。Python・統計・数学の基礎知識がある方は習得が早く、完全未経験の場合は6ヶ月〜1年のスクール受講が推奨されます。AIエンジニアの市場価値は高く、学習投資に見合うリターンが期待できます。' },
            { q: 'AIエンジニアと機械学習エンジニア・データサイエンティストの違いは？', a: 'AIエンジニアは広義で「AIを活用したシステム開発全般」を担当。機械学習エンジニアはMLモデルの開発・チューニング特化、データサイエンティストはデータ分析・統計モデリング特化です。現場では役割が混在することが多く、Pythonを軸にした基礎スキルは共通。スクール選びでは「モデル開発まで学ぶか」「APIを使ったアプリ開発か」で方向性を決めましょう。' },
            { q: 'ChatGPT APIを使うだけでAIエンジニアになれますか？', a: 'ChatGPT等の既製AIをAPIで組み込む「AIアプリ開発」は習得しやすく需要も高いですが、「AIエンジニア」のフルスタックには及びません。LangChain・RAG・プロンプトエンジニアリングを習得すれば、AI活用エンジニアとして転職・副業が可能です。モデルのゼロからの開発（機械学習）まで学ぶかは、目指すキャリアによって判断してください。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
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
        <div className="bg-slate-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-slate-800 mb-3">チェックリスト：社会人向けスクールの見極め方</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-slate-500 font-bold">◎</span><span>オンライン完結で受講できるか</span></li>
            <li className="flex gap-2"><span className="text-slate-500 font-bold">◎</span><span>夜間・週末にメンター質問が可能か</span></li>
            <li className="flex gap-2"><span className="text-slate-500 font-bold">◎</span><span>受講期間の延長制度はあるか</span></li>
            <li className="flex gap-2"><span className="text-slate-500 font-bold">◎</span><span>転職活動中もサポートが続くか</span></li>
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
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-2">1. TECH CAMP 夜間・休日コース</h3>
            <p className="text-sm text-gray-700 mb-2">社会人向けの夜間・休日専用コースを設けており、平日夜と土日で10週間学習するスタイルです。転職成功率99%（自社調べ）・転職保証付きと実績も十分。毎日メンターに質問できるサポート体制が心強いです。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMPの詳細ページ</a>をご覧ください。</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">2. DMM WEBCAMP</h3>
            <p className="text-sm text-gray-700 mb-2">完全オンラインで、自分のペースに合わせた学習が可能です。教育訓練給付金の対象で最大70%OFFになるため、コスト面での負担が少ない点も社会人に嬉しいポイントです。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMPの詳細ページ</a>をご覧ください。</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-bold text-purple-800 mb-2">3. RUNTEQ</h3>
            <p className="text-sm text-gray-700 mb-2">9ヶ月の長期コースながら完全オンライン対応。社会人でも無理なく続けられる設計になっており、実務レベルのスキルを身につけたい方に向いています。</p>
            <p className="text-xs text-gray-500">詳細は<a href="/schools/runteq" className="text-slate-700 underline">RUNTEQの詳細ページ</a>をご覧ください。</p>
          </div>
        </div>
      </section>
      <section>
        <p className="text-sm text-gray-700">社会人がプログラミングを学ぶ最大の壁は「時間の確保」です。1日1〜2時間でも継続できるスクールを選ぶことが、挫折しないための最大のポイントです。まずは無料カウンセリングを活用して、自分に合った学習ペースを相談してみましょう。</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '社会人がプログラミングスクールに通いながら仕事を続けられますか？', a: '多くのスクールがオンライン・夜間・週末対応のコースを設けており、仕事を続けながら受講できます。TECH CAMP夜間・休日コース（10週間）やDMM WEBCAMPの自習型コースが人気です。週20〜30時間の学習時間を確保できるかが成功の鍵。「転職を急がない」方はゆっくり学べるが、転職保証の期限には注意が必要です。' },
            { q: '社会人が転職するのに有利な年齢・時期はありますか？', a: '一般的にエンジニア転職は25〜28歳が最も転職しやすい年齢層です。30代でも未経験転職は可能ですが、スキルレベルと即戦力性への期待が高まります。35歳以上は難易度が上がりますが、前職の業界知識（金融・医療・製造等）と組み合わせると差別化できます。40代以上は「業界特化型エンジニア」を目指す方向性が現実的です。' },
            { q: 'スクールに通わずに社会人がエンジニア転職できますか？', a: '独学での転職成功者もいますが、時間が2〜3倍かかることが多く、ポートフォリオのクオリティ・転職先の質にも差が出やすいです。転職支援・面接対策・企業紹介のネットワークはスクールが大きなアドバンテージを持っています。時間効率と転職成功確率を考えると、スクール活用が合理的な選択です。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
            <li className="flex gap-2"><span className="text-pink-500">◎</span><span>フルリモート求人が多く、育児と両立しやすい</span></li>
            <li className="flex gap-2"><span className="text-pink-500">◎</span><span>スキルが評価される実力主義の職場が多い</span></li>
            <li className="flex gap-2"><span className="text-pink-500">◎</span><span>フリーランスとして時短・時間帯を選べる</span></li>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '女性のエンジニア転職は不利ですか？', a: 'むしろ現在は女性エンジニアの採用に積極的な企業が増えています。IT業界全体の女性比率が低いため、女性エンジニアは希少価値が高く評価される傾向があります。育児や時短勤務への理解があるIT企業も増えており、ライフワークバランスを重視した働き方がしやすい職種でもあります。' },
            { q: '育児中でもプログラミングスクールに通えますか？', a: 'オンライン・自分のペースで学べるスクールなら育児中でも受講可能です。コエテコキャンパス・TechAcademy・DMM WEBCAMPなどはオンライン完結型で時間の融通が利きます。子供の寝た夜間に学習するスタイルで受講する方も多いです。スクールによっては育児中の方向けの柔軟なスケジュール調整にも対応しています。' },
            { q: 'Webデザインとプログラミング、どちらを学ぶべきですか？', a: '両方スキルがあると差別化できますが、収入面ではプログラミング（エンジニア）のほうが高い傾向があります。Webデザイナーの平均年収は300〜400万円、Webエンジニアは400〜600万円。HTML/CSS（デザイン寄り）から始めてJavaScriptを学び、フロントエンドエンジニアを目指すルートが、女性に選ばれるパスの一つです。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
          <div className="border-l-4 border-slate-400 pl-4">
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '40代・50代でのエンジニア転職は現実的ですか？', a: '40代の未経験転職は難易度が高く、求人数が限られます。ただし、「ITコンサル・社内SE・PM（プロジェクトマネージャー）」への転職なら前職の業界経験を活かせます。完全未経験のWebエンジニア転職は厳しいですが、副業・フリーランス（特定クライアント向け）や自社サービス企業の社内SEとして活躍している40代エンジニアも増えています。' },
            { q: '40代がプログラミングスクールを選ぶ際のポイントは何ですか？', a: '①転職支援の対象年齢制限がないか（一部スクールは35歳以下限定）、②実績として40代の転職事例を公開しているか、③副業・フリーランス支援に力を入れているか、の3点が重要です。転職保証は年齢制限があるケースが多いため、「卒業後の転職状況」や「サポート期間」を具体的に確認してください。' },
            { q: '40代のプログラミング学習にはどのくらいの時間がかかりますか？', a: '個人差はありますが、IT知識がゼロの場合、Webアプリを作れるレベルまで300〜500時間程度が目安です（3〜6ヶ月週20時間学習で達成可能）。40代は記憶力より論理的思考力・業務経験で補える部分もあり、学習速度が極端に遅くなるわけではありません。「自分のペースで着実に進む」という姿勢が長続きのコツです。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
                  <td className="border border-gray-200 px-3 py-2 text-center text-slate-700 font-medium">{row.school}</td>
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
              <li className="flex gap-2"><span className="text-gray-500">◎</span><span>自走力があり、問題を自力で調べられる</span></li>
              <li className="flex gap-2"><span className="text-gray-500">◎</span><span>転職よりスキルアップ・趣味が目的</span></li>
              <li className="flex gap-2"><span className="text-gray-500">◎</span><span>費用をできる限り抑えたい</span></li>
              <li className="flex gap-2"><span className="text-gray-500">◎</span><span>すでにある程度の技術的基礎がある</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-3">スクールが向いている人</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>エンジニア転職を明確な目標としている</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>短期間で確実にスキルを習得したい</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>挫折経験があり、サポートが必要</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>転職後の年収アップを期待している</span></li>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '独学とスクール、どちらを選ぶべきか判断するポイントは？', a: '「転職を目指しているか」が最大の判断基準です。転職なら転職支援・企業ネットワーク・ポートフォリオ支援があるスクールが有利。副業・スキルアップ目的なら独学で十分な場合も多い。また「学習継続に自信がない」「一人では挫折しそう」という方はスクールのメンタリング環境が重要な価値になります。独学挫折率は90%以上という調査もあります。' },
            { q: 'スクールに通えば誰でもエンジニアになれますか？', a: '残念ながら全員ではありません。スクール卒業者の転職成功率は高いスクールで95〜99%と公表されていますが、「課題を全て提出した人」という条件付きが多い。学習時間を確保できない・カリキュラムについていけない方は途中離脱するケースも。入学前のカウンセリングで自分の目標と学習環境を正直に相談し、合うスクールを選ぶことが重要です。' },
            { q: '独学の場合、どのくらいの期間で転職できますか？', a: '独学での転職成功例はありますが、平均的には1〜2年かかることが多く、ポートフォリオのクオリティ確保が課題です。スクール卒業生と競う就職活動では、カリキュラム修了証・転職支援実績・企業とのコネクションがない分、不利になります。時間が2〜3倍かかるリスクを考えると、転職目的ならスクール投資のコスパが高い場合が多いです。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
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
                  <td className="border border-gray-200 px-3 py-2 font-bold text-slate-700">{row.total}</td>
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
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-2">最低限必要なスキルセット（フロントエンド）</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>HTML / CSS / JavaScript（ES6+）</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>ReactまたはVue.jsの基礎</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>GitHubでのバージョン管理</span></li>
              <li className="flex gap-2"><span className="text-slate-500">◎</span><span>オリジナルWebアプリ1〜2本（ポートフォリオ）</span></li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">最低限必要なスキルセット（バックエンド・Rails系）</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex gap-2"><span className="text-green-500">◎</span><span>Ruby on Rails または Laravel の基礎</span></li>
              <li className="flex gap-2"><span className="text-green-500">◎</span><span>データベース（SQL）の基礎</span></li>
              <li className="flex gap-2"><span className="text-green-500">◎</span><span>REST APIの設計・実装</span></li>
              <li className="flex gap-2"><span className="text-green-500">◎</span><span>Heroku / Renderなどへのデプロイ経験</span></li>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'プログラミングスクールを卒業してから内定まで何ヶ月かかりますか？', a: '転職活動開始から内定まで平均1〜3ヶ月です。スクール在籍中に転職活動を並行する方が多く、カリキュラム終了直前〜修了直後に内定を取るパターンが多いです。書類選考・面接・コーディングテスト対策が並行して必要で、準備が整っているほど短期間で内定が出ます。スクールの転職支援を最大限活用しましょう。' },
            { q: '転職成功に必要な最低限のポートフォリオとはどのようなものですか？', a: '最低1〜2つの「実際に動くWebアプリ」が必要です。ただし「チュートリアルのコピー」ではなく、自分で設計・機能追加したオリジナル要素が求められます。GitHubでソースコードを公開し、READMEに開発意図・使用技術・工夫点を丁寧に書くことが重要。API連携・ユーザー認証・DBを含む機能があるとより評価されます。' },
            { q: 'エンジニア転職で年齢制限はありますか？', a: '法律上の年齢制限はありませんが、実態として25〜30歳が最も内定を取りやすい年齢層です。30代でも未経験転職の成功例は多数ありますが、求人数は絞られます。40代以上は前職の業界特化（医療・金融・製造×IT）という武器がないと難しい。スクール選びでも「何歳まで転職支援対象か」を確認することが重要です。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
  'python-programming-school': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">Pythonは現在最も需要が高いプログラミング言語のひとつです。AI・機械学習・データサイエンス・バックエンド開発・自動化ツール作成など、活用範囲が非常に広く、転職・副業どちらの目的でも学ぶ価値があります。本記事ではPythonに特化したプログラミングスクールを比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pythonで目指せるキャリア</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">AIエンジニア・機械学習エンジニア</h3>
            <p className="text-xs text-gray-700">平均年収800〜1,500万円。PyTorch・TensorFlow・ChatGPT APIを使ったシステム開発が中心。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">データサイエンティスト</h3>
            <p className="text-xs text-gray-700">平均年収600〜1,000万円。pandas・NumPy・scikit-learnを使ったデータ分析・可視化が主な業務。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">バックエンドエンジニア（Django/Flask）</h3>
            <p className="text-xs text-gray-700">平均年収500〜800万円。WebアプリのサーバーサイドをPythonで開発。転職需要が安定して高い。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">業務自動化エンジニア（副業）</h3>
            <p className="text-xs text-gray-700">ExcelをPythonで自動化・スクレイピングツール作成など、副業案件も豊富。単価1〜5万円/件。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pythonが学べるスクール比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">料金</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Python活用内容</th>
                <th className="border border-gray-200 px-3 py-2 text-center">転職保証</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/zero-plus" className="text-slate-700 underline">ゼロプラス</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">498,000円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">AI・機械学習・ChatGPT API特化</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-emerald-600">あり</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/techcamp" className="text-slate-700 underline">TECH CAMP</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">748,000円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">Python基礎からWebアプリ開発まで</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-emerald-600">あり</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/techacademy" className="text-slate-700 underline">TechAcademy</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">174,900円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">Webアプリ開発・機械学習コース有</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-gray-400">なし</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/dmm-webcamp" className="text-slate-700 underline">DMM WEBCAMP</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">437,800円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">PythonでWebアプリ・給付金対象</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-emerald-600">あり</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Python学習のロードマップ</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">1</span>
            <div><p className="font-semibold text-gray-900">Python基礎文法（1〜2ヶ月）</p><p className="text-gray-600 mt-0.5">変数・制御構文・関数・クラスを習得。paizaやProgateで入門も可能。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">2</span>
            <div><p className="font-semibold text-gray-900">ライブラリ習得（2〜3ヶ月）</p><p className="text-gray-600 mt-0.5">目的に応じてpandas/NumPy（データ分析）またはDjango/Flask（Web開発）を選択。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">3</span>
            <div><p className="font-semibold text-gray-900">ポートフォリオ制作（1〜2ヶ月）</p><p className="text-gray-600 mt-0.5">GitHubにリポジトリを公開。転職・副業どちらでも必須の実績作り。</p></div>
          </li>
          <li className="flex gap-3">
            <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">4</span>
            <div><p className="font-semibold text-gray-900">転職活動または副業開始</p><p className="text-gray-600 mt-0.5">転職エージェント・クラウドソーシングで案件応募開始。スクールのキャリアサポートを活用。</p></div>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'PythonはAIの学習にしか使えませんか？', a: 'Pythonは汎用プログラミング言語で、Webバックエンド（Django/Flask）・データ分析・機械学習・スクレイピング・自動化スクリプト等、幅広い用途があります。特にAI・データ系の需要が高く、Python人材の市場価値は高い状態が続いています。Webエンジニアを目指す場合もバックエンドにPythonを使う企業は多いです。' },
            { q: 'Python未経験でも3ヶ月でエンジニア転職できますか？', a: '3ヶ月で基礎学習は可能ですが、転職成功には5〜6ヶ月の学習期間が現実的です。スクールのカリキュラムが整備されていれば3ヶ月で転職活動開始できますが、ポートフォリオ作成・面接練習・求人応募の期間も必要です。「3ヶ月で内定」と謳うスクールもありますが、個人の学習速度・経験によって大きく差があります。' },
            { q: 'Pythonスクールを選ぶ際に確認すべき点は何ですか？', a: '①Python専門かつ現役エンジニアが指導しているか、②カリキュラムにWebフレームワーク（Django/FastAPI）や機械学習（Scikit-learn/PyTorch）が含まれているか、③転職支援で実際にPythonを使う求人が紹介されるか、の3点が重要です。Python名目でも実際はJavaScriptやHTMLが中心のスクールもあるため、カリキュラム詳細を必ず確認してください。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
  'web-seisaku-school': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">Web制作（HTML・CSS・JavaScript）はプログラミング初心者が最初に学ぶことが多い分野です。難易度が比較的低く、副業・転職ともに活用できる実践的なスキルです。本記事では、Web制作に特化したプログラミングスクールを目的別に比較します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Web制作で目指せるキャリア</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Webコーダー（副業）</h3>
            <p className="text-xs text-gray-700">クラウドソーシングでHTML/CSSのコーディング案件受注。月3〜10万円が現実的。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Webデザイナー</h3>
            <p className="text-xs text-gray-700">Figma・PhotoshopでデザインしHTML/CSSで実装。年収350〜600万円が目安。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-2">フロントエンドエンジニア</h3>
            <p className="text-xs text-gray-700">JavaScript・React・Vue.jsまで習得してWebアプリを開発。年収500〜900万円。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Web制作スクール 比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">スクール</th>
                <th className="border border-gray-200 px-3 py-2 text-right">料金</th>
                <th className="border border-gray-200 px-3 py-2 text-left">カリキュラム</th>
                <th className="border border-gray-200 px-3 py-2 text-left">こんな人向け</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/progate" className="text-slate-700 underline">Progate</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">月990円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">HTML/CSS/JS/Python入門</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">コードを試してみたい入門者</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/codecamp" className="text-slate-700 underline">CodeCamp</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">129,800円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">HTML/CSS/JS/WordPressまで</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">Webデザイン・副業を目指す方</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/techacademy" className="text-slate-700 underline">TechAcademy</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">174,900円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">HTML/CSS/JS/React/副業支援</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">副業で月5万円を目指す方</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium"><a href="/schools/coachtech" className="text-slate-700 underline">CoachTech</a></td>
                <td className="border border-gray-200 px-3 py-2 text-right">456,500円〜</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">React/Vue.js/案件紹介まで</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">フリーランスを本気で目指す方</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">副業を目指すなら何ヶ月で稼げる？</h2>
        <p className="text-gray-700 mb-4">Web制作は、正しく学習すれば3〜6ヶ月で副業受注が可能です。ただし、ポートフォリオ（制作実績）なしでの案件獲得は難しいため、学習期間中にサンプルサイトを複数作成することが重要です。</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-semibold text-slate-800 mb-2 text-sm">副業受注までのステップ</p>
          <ol className="text-sm space-y-1 text-gray-700">
            <li>1. HTML/CSS/JavaScriptの基礎習得（1〜2ヶ月）</li>
            <li>2. WordPressカスタマイズ・LP制作の練習（1〜2ヶ月）</li>
            <li>3. ポートフォリオサイト3〜5件制作</li>
            <li>4. クラウドワークス・ランサーズで案件応募開始</li>
            <li>5. 初月1〜3万円、3ヶ月後に月5〜10万円が目安</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'Web制作の副業で月いくら稼げますか？', a: '副業初期（スクール卒業後半年）では月3〜5万円が現実的な目標です。1〜2年経験を積むと月10〜30万円以上を目指せます。案件単価は名刺サイト（3〜5万円）・コーポレートサイト（10〜30万円）・ECサイト（30〜100万円）と幅広く、スキルアップとともに単価が上がります。クラウドワークス・ランサーズ・知人紹介が主な案件獲得経路です。' },
            { q: 'Web制作はAIに仕事を奪われませんか？', a: 'Webデザインの単純作業はAIで代替が進んでいますが、「クライアントとの要件定義・コミュニケーション・オリジナルデザイン・WordPressカスタマイズ」などの高付加価値業務は当面AIで完全代替できません。むしろAI（Figma AI・GitHub Copilot等）を使いこなすWeb制作者が競争力を高めています。「AIを使える制作者」になることが重要です。' },
            { q: 'WebデザインとWebコーディング、どちらから学ぶべきですか？', a: '副業・フリーランスを目指すなら「HTMLコーディング→CSSデザイン→JavaScript→WordPressカスタマイズ」の順序が効率的です。デザインセンスがなくてもコーディングはできます。デザインにも興味がある方はFigmaで基礎を学んでからコーディングへ進む方法もあります。まずはコーディングで「動くものを作る」体験をするのが挫折を防ぐコツです。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
  'tensyoku-hosho-school': (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">転職保証とは？仕組みと注意点</h2>
        <p className="text-gray-700 mb-4">
          転職保証とは、スクールが定める条件を満たして就活活動を行ったにもかかわらず転職できなかった場合に、受講料の全額または一部を返金する制度です。保証があることで安心して学習に臨めますが、<strong>保証の条件は各スクールで大きく異なります</strong>。
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="font-semibold text-amber-800 mb-2 text-sm">転職保証で注意すべきポイント</p>
          <ul className="text-sm text-amber-900 space-y-1">
            {[
              '「転職できなければ返金」の条件（年齢・学習時間・求人応募数など）を事前に確認する',
              '「IT系ならどこでも可」など就職先の条件が緩い保証は実質的に機能しない場合がある',
              '保証対象の職種・年収帯・勤務地を必ず確認する',
              '保証期間（卒業後何ヶ月以内か）を確認する。短いと現実的に難しいケースも',
            ].map((item) => <li key={item} className="flex gap-2"><span className="shrink-0">△</span>{item}</li>)}
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">転職保証付きスクール 比較</h2>
        <div className="space-y-4">
          {[
            {
              name: 'TECH CAMP（テックキャンプ）',
              slug: 'techcamp',
              guarantee: '転職できなければ受講料全額返金',
              conditions: '卒業後90日以内・企業10社以上への応募・紹介企業への応募が条件',
              price: '327,800円〜（給付金適用で実質約10万円）',
              badge: '最大手・実績最多',
              note: '国内最大級の転職実績を誇る。給付金対象で実質コストを大幅削減できる。転職後の平均年収は400〜550万円台。',
            },
            {
              name: 'DMM WEBCAMP',
              slug: 'dmm-webcamp',
              guarantee: '転職できなければ受講料全額返金',
              conditions: '全カリキュラム修了・10社以上への応募・紹介企業への応募が条件',
              price: '329,780円〜（給付金適用で実質約10万円）',
              badge: '転職保証・給付金両対応',
              note: 'DMM運営の信頼感。転職成功率98%を掲げる。Webエンジニア・バックエンドの求人に強い。',
            },
            {
              name: 'GEEK JOB（ギークジョブ）',
              slug: 'geek-job',
              guarantee: '転職できなければ受講料全額返金',
              conditions: '卒業後30日以内・紹介企業への応募が条件。年齢制限あり（35歳以下推奨）',
              price: '337,000円〜',
              badge: '20代に特化',
              note: '20代・未経験者に特化したスクール。短期間（最短2ヶ月）でのエンジニア転職を目指す。',
            },
          ].map(({ name, slug: schoolSlug, guarantee, conditions, price, badge, note }) => (
            <div key={schoolSlug} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h3 className="font-bold text-gray-900">{name}</h3>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{badge}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 mb-0.5">保証内容</p>
                  <p className="text-gray-800 font-medium">{guarantee}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 mb-0.5">受講料目安</p>
                  <p className="text-gray-800 font-medium">{price}</p>
                </div>
              </div>
              <p className="text-xs text-amber-700 mb-2"><strong>保証条件：</strong>{conditions}</p>
              <p className="text-sm text-gray-600 mb-3">{note}</p>
              <a href={`/schools/${schoolSlug}`} className="text-sm text-slate-700 font-medium hover:underline">詳細を見る →</a>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">転職保証を最大限活かすための学習戦略</h2>
        <ul className="space-y-3">
          {[
            '保証条件の「応募社数」「学習時間の記録」などは入学前から意識して管理する。卒業後に証明できないと保証が適用されないケースがある',
            'スクールの紹介求人だけでなく、自分でも転職サイト（Leverages Career・paiza転職など）を並行して使う',
            '転職保証を「保険」として活用しつつ、学習期間中に実績（ポートフォリオ・GitHubの草）を積むことが転職成功率を上げる',
            '保証があっても「転職できさえすればよい」という思考は危険。年収・職種・勤務地の希望条件は明確に持っておく',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">転職保証なしでも検討すべき優良スクール</h2>
        <p className="text-gray-600 text-sm mb-3">
          転職保証がなくても、高い転職実績・充実したサポートで成功率が高いスクールもあります。
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: '侍エンジニア塾', slug: 'samurai-engineer', point: '専属メンターとの1対1サポートで挫折率が低い。転職成功率は93.4%（自社調べ）。' },
            { name: 'TechAcademy', slug: 'techacademy', point: '現役エンジニアのコードレビュー。週2回のメンタリングで質問し放題。副業・転職両対応。' },
          ].map(({ name, slug: ss, point }) => (
            <div key={ss} className="border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-900 text-sm mb-1"><a href={`/schools/${ss}`} className="hover:underline text-slate-800">{name}</a></p>
              <p className="text-xs text-gray-600">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '転職保証は本当に全額返金されますか？', a: '返金されるケースはありますが、条件を満たさないと受けられません。「コースの全課題を提出する」「転職活動中に紹介された企業へ必ず応募する」「卒業後〇ヶ月以内に申告する」等、細かい条件が設定されています。全員が活用できる制度ではなく、「積極的に取り組んで転職できなかった場合の保険」と考えるのが正確です。入学前に規約を必ず読んでください。' },
            { q: '転職保証なしのスクールは質が低いですか？', a: 'そんなことはありません。RUNTEQ・コードクリサリスなど、転職保証はないが卒業生の転職成功率が高く評価されているスクールも多いです。転職保証付きは「安心感」の担保ですが、保証費用がコストに上乗せされているケースもあります。卒業生の転職先企業・平均年収・満足度などを比較した上でスクールを選ぶことを推奨します。' },
            { q: '転職保証と給付金は同時に活用できますか？', a: '同時活用可能なスクールもあります。DMM WEBCAMPは給付金対応かつ転職保証付きのコースがあり、実質負担を抑えつつリスクも低減できます。ただし、給付金対象コースと転職保証付きコースが異なる場合もあるため、入学前にどちらの条件が適用されるかを明確にスクールに確認してください。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
  'programming-school-30dai': (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">30代でのエンジニア転職は現実的か？</h2>
        <p className="text-gray-700 mb-4">
          結論から言うと、<strong>30代前半（30〜34歳）のエンジニア転職は十分現実的</strong>です。IT人材不足が深刻な現在、スキルがあれば年齢よりも即戦力性・学習意欲が評価されます。ただし、20代と同じ戦略では通用しないため、30代に合った転職戦略が必要です。
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="font-semibold text-emerald-800 mb-2 text-sm">30代の強み</p>
            <ul className="text-sm text-emerald-900 space-y-1">
              {['社会人経験・コミュニケーション能力', '業界知識（前職スキルの活用）', '責任感・マネジメント適性', '目的意識が明確で学習の継続率が高い'].map(s => <li key={s} className="flex gap-1"><span>◎</span>{s}</li>)}
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="font-semibold text-amber-800 mb-2 text-sm">30代の注意点</p>
            <ul className="text-sm text-amber-900 space-y-1">
              {['未経験だと20代より書類落ちリスクが高い', '年収期待値と現実のギャップが生じやすい', 'ベンチャー・スタートアップへの挑戦が有効', '転職先の選定に慎重さが必要'].map(s => <li key={s} className="flex gap-1"><span>△</span>{s}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">30代にお勧めのプログラミングスクール</h2>
        <div className="space-y-4">
          {[
            {
              name: 'TECH CAMP（テックキャンプ）',
              slug: 'techcamp',
              badge: '30代実績あり',
              reason: '30代の転職実績が業界最多クラス。社会人経験を活かしたIT転職に強く、前職の業界知識（営業・企画・経理など）を活かせる求人を多数保有。給付金活用で費用も抑えられる。',
              age_fit: '業界経験を活かしてIT×○○の専門家を目指したい人に特に向く',
            },
            {
              name: '侍エンジニア塾',
              slug: 'samurai-engineer',
              badge: '挫折しない1対1',
              reason: '専属メンターとの1対1指導は、仕事と学習を並行する社会人に最適。30代の「限られた時間で確実に学ぶ」ニーズに合った学習設計。オーダーメイドカリキュラムで前職スキルを活かした開発も可能。',
              age_fit: '本業との両立・確実なスキル習得を重視する人向け',
            },
            {
              name: 'DMM WEBCAMP',
              slug: 'dmm-webcamp',
              badge: '転職保証・給付金',
              reason: '「転職保証＋給付金」の組み合わせで、30代の転職リスクを最小化できる。バックエンド・インフラ系など実務的な技術を学べるカリキュラムが30代転職希望者に評価される。',
              age_fit: '転職成功率と費用対効果を重視する人向け',
            },
          ].map(({ name, slug: ss, badge, reason, age_fit }) => (
            <div key={ss} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-gray-900">{name}</h3>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{badge}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{reason}</p>
              <p className="text-xs text-slate-600 font-medium mb-3">{age_fit}</p>
              <a href={`/schools/${ss}`} className="text-sm text-slate-700 font-medium hover:underline">詳細・料金を見る →</a>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">30代エンジニア転職のリアルなタイムライン</h2>
        <div className="space-y-2">
          {[
            { month: '1〜2ヶ月目', label: 'プログラミング基礎学習', body: 'HTML/CSS/JavaScriptまたはPython/Javaを選択。スクールのカリキュラムに沿って基礎を固める。仕事しながらの場合は週15〜20時間の確保を目標に。' },
            { month: '3〜4ヶ月目', label: 'アプリ開発・ポートフォリオ制作', body: 'オリジナルWebアプリやAPIを使ったサービスを制作。GitHubに継続してコミットし、実績として残す。前職の業界知識を活かしたサービス設計が好印象。' },
            { month: '5〜6ヶ月目', label: '転職活動開始', body: 'エージェント（Leverages・マイナビIT・paiza転職など）に登録し、求人票の精読を開始。30代は自分の強みを「即戦力」としてアピールする職務経歴書が重要。' },
            { month: '6〜8ヶ月目', label: '内定・入社', body: '業界にもよるが、30代未経験の場合は平均6〜10社の面接を経て内定が出るケースが多い。最初の転職先で2〜3年経験を積み、その後年収アップ転職が現実的なルート。' },
          ].map(({ month, label, body }) => (
            <div key={month} className="flex gap-4 border-l-2 border-slate-300 pl-4">
              <div className="shrink-0 text-xs text-slate-500 w-20 pt-0.5">{month}</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">30代でエンジニアを目指す前に確認すること</h2>
        <ul className="space-y-3">
          {[
            '現在の年収と転職後の年収ギャップを把握する。未経験入社後の初年度は現職より低くなる場合が多い（300〜380万円台が多い）',
            '家族・生活費などを考慮した「学習・転職活動費用の確保」。給付金や教育ローンも活用を検討する',
            '「Webエンジニア」「インフラエンジニア」など方向性を絞ること。分野が多すぎると学習が散漫になる',
            '30代後半（35〜39歳）でも転職実績はあるが、難易度は上がる。早めの行動が重要',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '30代のエンジニア転職で前職の経験は活かせますか？', a: '大いに活かせます。金融・医療・製造・物流など特定業界でのSE・社内SEポジションでは、その業界知識と技術スキルの両方を持つ30代エンジニアの需要が高いです。「業界経験×プログラミング」という差別化ができれば、純粋な未経験よりも有利に転職活動を進められます。スクール選びでは「業界別の転職支援実績」も確認しましょう。' },
            { q: '30代でプログラミングスクールに入学した人の転職成功例を教えてください', a: '実際の事例として、30代前半の営業職からWebエンジニアへの転職（年収350→450万円）、30代後半のマーケターからデータエンジニアへの転職（年収500→650万円）などの例があります。前職経験・学習量・スクールの質によって結果は大きく異なりますが、「無理」ではないことは多くのスクールの卒業生実績が示しています。' },
            { q: '30代でエンジニア転職する前に確認すべきことは何ですか？', a: '①現在の仕事を辞めてから学習するか・働きながらか（貯金と生活費の確認）、②家族の理解・同意があるか（特に既婚者・子育て中の方）、③転職後の年収低下を許容できるか（未経験転職は最初の1〜2年は現職より低くなる可能性が高い）、の3点を事前にクリアにしておくことで、学習中のメンタルが安定します。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),

  'javascript-react-school': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">なぜJavaScript・Reactを選ぶのか</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          フロントエンドエンジニアの求人の多くがJavaScript + Reactの知識を必要としています。2025年現在、ReactはWeb開発フレームワークの中で圧倒的なシェアを誇り、転職・副業どちらの目標にも直結するスキルです。
        </p>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">JavaScript・Reactで目指せるキャリア</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { career: 'フロントエンドエンジニア', salary: '年収400〜700万円' },
              { career: 'Webデザイナー（コーディング込み）', salary: '年収350〜550万円' },
              { career: 'フルスタックエンジニア', salary: '年収500〜900万円' },
              { career: 'フリーランスWeb制作', salary: '月30〜80万円' },
            ].map(({ career, salary }) => (
              <div key={career} className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-sm font-medium text-gray-800">{career}</p>
                <p className="text-xs text-emerald-700">{salary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">JavaScript・React特化スクール おすすめランキング</h2>
        <div className="space-y-5">
          {[
            {
              rank: 1,
              name: 'TECH CAMP（テックキャンプ）',
              price: '217,800円〜',
              period: '10週間〜',
              support: '転職保証・メンター常駐',
              curriculum: 'HTML/CSS → JavaScript → React → Node.js。実務レベルのポートフォリオ制作まで一貫指導。',
              pros: ['現役エンジニアによるメンター制度（平均回答15分）', 'React + Node.jsのフルスタック開発まで学べる', '転職成功率98.8%（公表値）', '給付金対象コース（最大70%還付）'],
              recommended: '転職目的でReact実務スキルを最短で身につけたい方',
            },
            {
              rank: 2,
              name: 'DMM WEBCAMP',
              price: '329,000円〜',
              period: '3ヶ月',
              support: '転職保証・給付金対象',
              curriculum: 'JavaScript基礎 → React → Webアプリ開発。実際のプロダクト開発に近い環境で学習。',
              pros: ['教育訓練給付金（専門実践）で最大70%還付', 'React + TypeScriptまで学べる現代的カリキュラム', '転職活動サポートが厚く内定実績も豊富', 'オンライン・通学選べる'],
              recommended: '給付金を使ってコストを抑えたい転職希望者',
            },
            {
              rank: 3,
              name: 'Code Chrysalis',
              price: '300,000円〜',
              period: '12週間',
              support: '英語環境・外資系転職に強い',
              curriculum: 'JavaScript → React → TypeScript → Node.js。英語でのコーディング面接対策も含む。',
              pros: ['外資系・グローバル企業への転職に強い', 'JavaScriptの深い理解を重視した本格カリキュラム', '少人数制で質問しやすい環境', '卒業生ネットワークが豊富'],
              recommended: '外資系IT・英語環境でのエンジニア転職を目指す方',
            },
            {
              rank: 4,
              name: 'Progate Path',
              price: '198,000円〜',
              period: '3〜6ヶ月',
              support: 'メンタリング・ポートフォリオ支援',
              curriculum: 'Progateの教材をベースにJavaScript → React → 実践プロジェクト。基礎固めから始められる。',
              pros: ['Progateの実績ある教材を活用した学習設計', 'JavaScript基礎が不安な方でも安心して始められる', 'ポートフォリオ制作サポートが充実', '比較的リーズナブルな価格'],
              recommended: '初めてJavaScriptを学ぶ方・基礎から丁寧に学びたい方',
            },
            {
              rank: 5,
              name: 'Samurai Engineer（侍エンジニア）',
              price: '594,000円〜',
              period: '3〜6ヶ月',
              support: '完全個別指導・マンツーマン',
              curriculum: 'マンツーマン指導でJavaScript・Reactを自分のペースで学習。副業・フリーランス向けカリキュラムも充実。',
              pros: ['完全個別指導で自分のペースに合わせた学習が可能', '副業・フリーランス向けカリキュラムが豊富', '現役エンジニアが担当し技術的な質問も安心', '幅広い年齢層・学習目的に対応'],
              recommended: '副業・フリーランスWeb制作を目指す方・個別指導を希望する方',
            },
          ].map(({ rank, name, price, period, support, curriculum, pros, recommended }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className={`text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${rank <= 2 ? 'bg-slate-800' : 'bg-slate-500'}`}>{rank}</span>
                <div>
                  <p className="font-bold text-gray-900 text-base">{name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">受講料: {price}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">期間: {period}</span>
                    <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">{support}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{curriculum}</p>
              <ul className="space-y-1 mb-3">
                {pros.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
              <p className="text-xs bg-slate-50 rounded-lg px-3 py-2 text-slate-700">おすすめ対象: {recommended}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">JavaScript学習ロードマップ</h2>
        <div className="space-y-3">
          {[
            { step: 'STEP 1', title: 'HTML・CSS基礎（1〜2週間）', body: 'Webページの構造（HTML）とデザイン（CSS）の基礎を習得。ProGate・ドットインストールなどで無料で学べる。' },
            { step: 'STEP 2', title: 'JavaScript基礎（2〜4週間）', body: '変数・関数・配列・DOM操作の基礎。ここが最も時間のかかるステップ。「Eloquent JavaScript」や各スクールのカリキュラムで体系的に学習。' },
            { step: 'STEP 3', title: 'React入門（2〜4週間）', body: 'コンポーネント・状態管理（useState）・React Router（画面遷移）の基礎。公式ドキュメントが非常に充実している。' },
            { step: 'STEP 4', title: 'ポートフォリオ制作（1〜2ヶ月）', body: 'TODOアプリ・天気アプリ・ECサイトなど実際のWebアプリを制作。GitHubで公開し、転職活動での技術力証明に使う。' },
            { step: 'STEP 5', title: 'TypeScript導入（学習と並行）', body: 'TypeScriptはJavaScriptに型付けを追加した言語で、現代の現場では必須。Reactと組み合わせて学習することが多い。' },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4 border-l-2 border-slate-300 pl-4">
              <div className="shrink-0 text-xs text-slate-500 w-16 pt-0.5">{step}</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">JavaScript・Reactが学べるスクールを確認する</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'TECH CAMP', slug: 'techcamp' },
            { name: 'DMM WEBCAMP', slug: 'dmm-webcamp' },
            { name: 'TechAcademy', slug: 'techacademy' },
            { name: '侍エンジニア塾', slug: 'samurai-engineer' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/schools/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細を見る →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'JavaScriptだけ学べばフロントエンドエンジニアになれますか？', a: 'JavaScriptの基礎の上にReact（またはVue.js）を学ぶことが現在の市場では必須です。HTML/CSS→JavaScript→React（またはNext.js）の順が一般的なフロントエンドスクールのカリキュラム。TypeScriptも近年採用が急増しており、習得すると市場価値がさらに高まります。' },
            { q: 'ReactとVue.js、どちらを学ぶべきですか？', a: '国内外ともにReactの求人数が多く、学習リソースも豊富なためReactを推奨します。Vue.jsは日本のSIer・中小企業での採用が多く、特定の環境では有利。Next.js（Reactベースのフレームワーク）はフルスタック開発に対応しており、フロントエンドとバックエンドの両方を学びたい方に人気です。スクール選びでも「どのフレームワークを教えるか」を確認してください。' },
            { q: 'フロントエンドエンジニアの将来性はどうですか？', a: 'Webの重要性が増す中でフロントエンド需要は引き続き高い状態が続いています。AIツール（GitHub Copilot・Vercel AI SDK等）との組み合わせにより生産性は向上しており、AIを使いこなすフロントエンドエンジニアの価値が高まっています。バックエンド（Node.js・GraphQL）まで扱えるフルスタック方向へのスキル拡張も需要が高いです。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),

  'school-koukai-shinai-erabi': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">プログラミングスクールで後悔する人の共通パターン</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          プログラミングスクールへの入学後に後悔する人の多くは、入学前の「確認不足」が原因です。高額な受講料を支払ってから後悔しないために、よくある失敗パターンとその回避策を解説します。
        </p>
        <div className="space-y-3">
          {[
            {
              pattern: '「なんとなく需要がありそうだから」で入学した',
              risk: '学習目標が曖昧だと挫折しやすく、転職活動でも「なぜエンジニアになりたいのか」が答えられない。',
              solution: '入学前に「Webエンジニア・インフラ・AI」など方向性を決め、その職種の求人を実際に見てから判断する。',
            },
            {
              pattern: '転職保証の条件をきちんと確認しなかった',
              risk: '「転職保証あり」と謳っていても、「卒業後〇ヶ月以内」「応募〇社以上」「特定の職種のみ」など細かい条件がある場合が多い。',
              solution: '入学前に転職保証の対象条件・除外条件・返金額を書面で確認する。口頭の説明だけでは不十分。',
            },
            {
              pattern: '給付金の対象確認を怠った',
              risk: '雇用保険の加入期間・講座の給付金指定番号が必要で、要件を満たさないと給付金がもらえない。',
              solution: 'ハローワークで事前に給付金受給資格を確認する。受給要件は在職中から調べておく。',
            },
            {
              pattern: '受講中のサポート内容を詳しく確認しなかった',
              risk: '「質問し放題」と書かれていても回答が翌日以降、もしくはテキストベースのみというスクールもある。',
              solution: '体験授業でサポートの質・速度を実際に確認。「平均回答時間は？」「現役エンジニアが担当？」を直接聞く。',
            },
            {
              pattern: 'ポートフォリオ指導なしのコースを選んだ',
              risk: '技術を学んでも成果物がないと転職活動で評価されない。コードレビューのないスクールは実力が付きにくい。',
              solution: 'ポートフォリオ制作・コードレビューが含まれるコースを選ぶ。成果物の完成度が転職成功率に直結する。',
            },
          ].map(({ pattern, risk, solution }) => (
            <div key={pattern} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-2">失敗パターン：「{pattern}」</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-red-700 mb-0.5">リスク</p>
                  <p className="text-xs text-red-600">{risk}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-emerald-700 mb-0.5">回避策</p>
                  <p className="text-xs text-emerald-700">{solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">入学前に必ず確認すべき7つのポイント</h2>
        <div className="space-y-2">
          {[
            { no: 1, check: '転職実績・転職率の具体的な数値を公開しているか', detail: '「転職率98%」などの数値が第三者機関による調査か、自社調査かを確認。対象期間・条件も重要。' },
            { no: 2, check: '給付金（教育訓練給付金）の対象コースか', detail: '特定一般教育訓練（20%還付）または専門実践教育訓練（最大70%還付）の認定を受けているかをハローワーク・厚労省サイトで確認。' },
            { no: 3, check: '転職保証の詳細条件を書面で確認', detail: '返金額・期限・応募条件・除外職種などを書面で取得。口頭説明を信用しない。' },
            { no: 4, check: '現役エンジニアがメンターを担当しているか', detail: '学習中のサポートが現役エンジニアか、受講修了生かで技術的な深さが大きく変わる。' },
            { no: 5, check: '無料体験・カウンセリングに参加して雰囲気を確認', detail: '雰囲気が合わないと挫折しやすい。体験授業でコミュニケーションスタイル・教材品質を実際に確認。' },
            { no: 6, check: 'ポートフォリオ制作・コードレビューがカリキュラムに含まれるか', detail: '成果物のレビューなしに「技術が身についた」は転職活動で証明できない。' },
            { no: 7, check: '卒業後の転職活動サポート期間はどのくらいか', detail: '転職活動は卒業後も数ヶ月続く。サポートが卒業後〇ヶ月まで、または無制限かを確認。' },
          ].map(({ no, check, detail }) => (
            <div key={no} className="bg-slate-50 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{no}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{check}</p>
                  <p className="text-xs text-gray-600">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">後悔しにくいスクールの特徴まとめ</h2>
        <ul className="space-y-2">
          {[
            '転職実績・合格率を具体的な数値で公開している（第三者調査が望ましい）',
            '教育訓練給付金対象コースがあり費用の負担を抑えられる',
            '無料体験授業が充実しており入学前に雰囲気を確認できる',
            '現役エンジニアが担当するメンタリング・コードレビューがある',
            '転職保証の条件が明確で現実的（応募数・期間が無理のない範囲）',
            'ポートフォリオ制作が含まれ、転職活動に使える成果物が作れる',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">評判の良いスクールを詳しく見る</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'TECH CAMP', slug: 'techcamp' },
            { name: 'DMM WEBCAMP', slug: 'dmm-webcamp' },
            { name: '侍エンジニア塾', slug: 'samurai-engineer' },
            { name: 'RUNTEQ', slug: 'runteq' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/schools/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細を見る →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'プログラミングスクールで後悔した人が再転職する場合、何をすればいいですか？', a: '転職先がエンジニア職でない場合は再度スクール入学よりも「現職でのスキルアップ機会」の確認が先です。エンジニアとして入社できたが環境が合わない場合は、1〜2年の経験を積んでから転職活動（経験者採用）が最も現実的。スクールへの再投資より、現在の環境を最大限活用して実績を作ることが優先です。' },
            { q: '入学前の無料カウンセリングでは何を聞けばいいですか？', a: '①転職支援の具体的なサポート内容（求人数・企業の質・面接対策の回数）、②実際の卒業生の転職先企業名・年収（可能な範囲で）、③カリキュラムの進め方（自習型か講義型か）、④途中でやめた場合の返金規定、⑤転職保証・給付金の適用条件の細則、を具体的に質問してください。抽象的な回答が多いスクールは要注意です。' },
            { q: 'プログラミングスクールの口コミ・評判はどこで調べれば信頼できますか？', a: '信頼性が高い順に：①実際に通った知人・SNS（X・LinkedIn）での体験談、②課金なしのGoogle口コミ・転職口コミサイト（転職会議・OpenWork等のIT版）、③第三者のブログ・YouTube比較動画（広告なしのもの）。スクール公式サイトの「卒業生の声」は選ばれた好評例のため参考程度に。実際のカリキュラムを体験できる「無料体験入学」に必ず参加することをおすすめします。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),

  'programming-school-20dai-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">20代がプログラミングスクールを選ぶポイント</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          20代・大学生・新卒の方がスクールを選ぶ際は、転職サポートの充実度・費用と給付金の活用・就職後のキャリアパスの3点が重要です。
          30代以降と比べて「若さ」という武器があるため、スキルと意欲さえあれば未経験からでも大手IT企業への就職も十分に狙えます。
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="font-semibold text-gray-800 mb-3 text-sm">20代がスクール選びで重視すべきポイント</p>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              '転職・就職支援の実績と内定先企業の質（大手・成長企業への実績があるか）',
              '給付金対象講座かどうか（雇用保険加入者なら最大70%還付）',
              '無料体験・トライアルで事前に雰囲気を確認できるか',
              '学習コミュニティが活発で仲間と切磋琢磨できる環境か',
              '受講後のフォロー・キャリアチェンジの相談ができるか',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-slate-500 mt-0.5 shrink-0">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">20代・新卒向けスクールおすすめ3選</h2>
        <div className="space-y-5">
          {[
            {
              rank: 1,
              name: 'TECH CAMP（テックキャンプ）',
              slug: 'techcamp',
              badge: '転職保証あり',
              price: '437,800円〜（給付金適用後 約131,340円〜）',
              period: '10週間〜3ヶ月',
              point: '転職成功率98.9%（自社調べ）、専属メンターによる学習サポート、転職できなければ全額返金の転職保証付き。20代・未経験向けの転職支援実績が業界最多クラス。',
              features: ['転職保証あり', '給付金対象', '未経験歓迎'],
            },
            {
              rank: 2,
              name: 'DMM WEBCAMP',
              slug: 'dmm-webcamp',
              badge: '転職特化',
              price: '415,800円〜（給付金適用後 約124,740円〜）',
              period: '3ヶ月',
              point: '業界最大規模の転職支援チーム。専属キャリアアドバイザーが就職活動をサポート。大学生・新卒向けのコースは就職活動スケジュールに合わせた柔軟な学習が可能。',
              features: ['転職保証あり', '給付金対象', '就活サポート'],
            },
            {
              rank: 3,
              name: 'GEEK JOB（ギークジョブ）',
              slug: 'geek-job',
              badge: '最短2ヶ月',
              price: '無料コースあり（転職成功で受講料0円）',
              period: '最短2ヶ月',
              point: '20代の転職に特化した完全無料（転職成功報酬型）モデルも持つ。短期集中コースで最短2ヶ月でエンジニア転職を目指せる。大学生・フリーター・第二新卒に強い。',
              features: ['無料コースあり', '20代特化', '短期集中'],
            },
          ].map(({ rank, name, slug, badge, price, period, point, features }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                  <p className="font-bold text-gray-900">{name}</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">{badge}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {features.map((f) => (
                  <span key={f} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
                <div><span className="text-gray-500">期間: </span><span className="font-medium text-gray-800">{period}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/schools/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">20代でエンジニアになるメリット</h2>
        <div className="space-y-3">
          {[
            { title: '年収の伸びしろが大きい', body: '20代でエンジニアになれば30〜40代にかけてのキャリア設計の自由度が高くなります。スタートアップでのストックオプション・大手IT企業への転職・フリーランス独立など、選択肢が豊富です。' },
            { title: '第二新卒・未経験採用の枠がある', body: 'IT業界は慢性的な人材不足のため、20代未経験の採用に積極的な企業が多い。ポテンシャル重視の採用が行われており、スクールで学んだスキルと意欲があれば十分に転職できます。' },
            { title: '給付金で費用の負担を大きく軽減できる', body: '雇用保険に1年以上加入していれば教育訓練給付金を活用でき、受講料の20〜70%が還付されます。例えば40万円のスクールが実質12万円前後になることも。在職中に申請を済ませておくのがポイントです。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">20代向けスクールをさらに比較する</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'TECH CAMP', slug: 'techcamp' },
            { name: 'DMM WEBCAMP', slug: 'dmm-webcamp' },
            { name: 'GEEK JOB', slug: 'geek-job' },
            { name: '侍エンジニア塾', slug: 'samurai-engineer' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/schools/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細 →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '20代でプログラミングスクールに通うメリットは何ですか？', a: '最大のメリットは「若さ」という採用側から見た伸びしろです。20代は未経験転職でも採用されやすく、スクールのカリキュラムを全力で消化できる時間・体力もあります。転職後の給与成長率も高く、25歳でエンジニア転職→30歳で年収600万円以上というキャリアパスが現実的です。投資回収の観点でも若いほど有利です。' },
            { q: '新卒でエンジニア採用と、スクール経由転職はどちらが有利ですか？', a: '新卒採用のほうが給与・研修制度・配属先の選択肢で有利なケースが多いです。ただしエンジニア職以外で新卒入社して20代後半で転職する場合、スクール経由でも十分に高い給与水準で転職できます。「エンジニアになりたい」という意志があるなら、どのルートでも可能ですが、自分の状況（在学中か社会人か）に合った選択をしましょう。' },
            { q: '20代でプログラミングスクールに入るのに最適な時期はいつですか？', a: '「思い立った今」が最善です。エンジニア転職は年齢が低いほど有利で、1年待つと1年分の採用優位性が失われます。学生なら卒業前（インターン・就活時期を活用）、社会人なら早期に転職活動の準備を始めることが重要。迷っている時間が最大のコストです。無料カウンセリングを複数スクールで受けてから判断することをおすすめします。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),

  'web-frontend-school': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Webフロントエンドエンジニアに必要なスキルとは</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Webフロントエンドエンジニアは、ユーザーが実際に見て操作するWebサイト・Webアプリの表示部分（UI）を構築するエンジニアです。
          2026年現在、求人市場では以下のスキルセットが求められています。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">スキル</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">重要度</th>
                <th className="text-left py-2 text-gray-600 font-semibold">備考</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HTML / CSS', '必須', 'レイアウト・スタイリングの基礎'],
                ['JavaScript（ES6+）', '必須', 'フロントエンドの中核言語'],
                ['React / Vue.js', '重要', 'モダンUI構築のフレームワーク'],
                ['TypeScript', '推奨', '型安全な開発で採用増加中'],
                ['Git / GitHub', '必須', 'バージョン管理・チーム開発'],
                ['レスポンシブデザイン', '必須', 'スマートフォン対応'],
                ['APIとの連携（REST / GraphQL）', '推奨', 'バックエンドとの接続'],
              ].map(([skill, importance, note]) => (
                <tr key={skill} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{skill}</td>
                  <td className="py-2 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full ${importance === '必須' ? 'bg-slate-800 text-white' : importance === '重要' ? 'bg-slate-100 text-slate-700' : 'bg-gray-100 text-gray-600'}`}>{importance}</span></td>
                  <td className="py-2 text-gray-600">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Webフロントエンド対応スクール比較</h2>
        <div className="space-y-4">
          {[
            {
              name: 'RUNTEQ（ランテック）',
              slug: 'runteq',
              focus: 'Webエンジニア特化',
              langs: 'Ruby on Rails / JavaScript / React',
              period: '5〜9ヶ月',
              price: '437,800円〜',
              point: 'Webエンジニア転職に特化した実践型スクール。React・JavaScriptを含む実務に近いカリキュラムで、転職後のミスマッチが少ない。即戦力育成に定評あり。',
            },
            {
              name: 'TechAcademy（テックアカデミー）',
              slug: 'techacademy',
              focus: 'フロントエンド特化コース',
              langs: 'HTML / CSS / JavaScript / jQuery',
              period: '4〜16週間',
              price: '174,900円〜',
              point: 'フロントエンドコースを単独で受講可能。現役エンジニアによる週2回のメンタリング・コードレビューで確実にスキルが身につく。短期集中型で副業・転職に対応。',
            },
            {
              name: 'TECH CAMP（テックキャンプ）',
              slug: 'techcamp',
              focus: '総合エンジニア転職',
              langs: 'Ruby on Rails / JavaScript / React',
              period: '10週間〜3ヶ月',
              price: '437,800円〜',
              point: '転職保証付きで業界最大規模の転職支援。フロントエンドだけでなくバックエンド・インフラまで幅広く学び、フルスタックとして転職市場での価値を高める。',
            },
            {
              name: '侍エンジニア塾',
              slug: 'samurai-engineer',
              focus: 'マンツーマン指導',
              langs: 'HTML / CSS / JavaScript / Vue.js / React',
              period: '3〜12ヶ月',
              price: '220,000円〜',
              point: '専属インストラクターとの1対1のマンツーマン指導。フロントエンドの特定フレームワーク（Reactなど）を重点的に学ぶカスタマイズも可能。',
            },
          ].map(({ name, slug, focus, langs, period, price, point }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-gray-900">{name}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">{focus}</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 text-xs mb-3">
                <div><span className="text-gray-500">学習技術: </span><span className="font-medium text-gray-800">{langs}</span></div>
                <div><span className="text-gray-500">期間: </span><span className="font-medium text-gray-800">{period}</span></div>
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/schools/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フロントエンドエンジニアの就職・転職先</h2>
        <div className="space-y-3">
          {[
            { title: 'Web制作会社・システム開発会社', body: 'Webサイト・Webアプリの制作を請け負うSIer・Web制作会社は未経験・第二新卒の採用も多い。フロントエンドのポートフォリオを作成して実力をアピールすることが重要。' },
            { title: '自社開発スタートアップ', body: 'スタートアップはポテンシャル採用が多く、若手エンジニアが活躍できる環境。ReactやTypeScriptを使った実務経験が積みやすく、成長スピードが速い。株式報酬（ストックオプション）も期待できる。' },
            { title: '大手IT企業のフロントエンド部門', body: 'Yahoo!・メルカリ・サイバーエージェントなど大手IT企業はフロントエンドの専門職採用が活発。中途採用でもフロントエンドの実務経験2〜3年あれば応募できる求人が多い。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">フロントエンドが学べるスクールを比較する</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'RUNTEQ', slug: 'runteq' },
            { name: 'TechAcademy', slug: 'techacademy' },
            { name: 'TECH CAMP', slug: 'techcamp' },
            { name: '侍エンジニア塾', slug: 'samurai-engineer' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/schools/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細 →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'Webフロントエンドエンジニアとバックエンドエンジニア、年収差はありますか？', a: '一般的にバックエンド・フルスタックエンジニアのほうが年収が高い傾向があります（平均50〜100万円程度）。ただしフロントエンド専門でも大手企業・スタートアップでは年収700〜1,000万円以上の求人も存在します。フロントエンドからバックエンドへスキルを広げる（フルスタック化）ことで年収上昇を狙う方も多いです。' },
            { q: 'フロントエンドスクールでTypeScriptは教えてもらえますか？', a: '最近のフロントエンドスクールはTypeScriptをカリキュラムに含めているところが増えています。TypeScript習得は就職後の実務で必須になるケースが多く、スクール選びでは「TypeScript・Next.js・テストコードまで学べるか」を確認してください。ReactのみでTypeScriptを教えないスクールは時代遅れになりつつあります。' },
            { q: 'フロントエンドエンジニアはリモートワークしやすいですか？', a: 'IT職種の中でもフロントエンドエンジニアはリモートワーク対応率が高い職種の一つです。GitHub・Slack・Figmaなどのツールでチームコラボレーションが完結するため、フルリモートOKの求人が多いです。スクールの転職支援で「リモートワーク可」の求人を絞り込める場合も多く、働き方の柔軟性を求める方にも向いています。' }
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white hover:bg-slate-50 font-medium text-gray-800 text-sm list-none">
                {q}<span className="text-slate-400 shrink-0 ml-2 text-xs">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  ),
};

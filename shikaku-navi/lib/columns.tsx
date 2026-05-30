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
    slug: 'shikaku-hikaku-online',
    title: '社会人に人気の資格通信講座5選【2026年版・費用・合格率比較】',
    description: 'スタディング・フォーサイト・アガルート・ユーキャン・クレアールの5社を費用・合格率・学習スタイルで徹底比較。社会人が働きながら資格取得できる通信講座の選び方を解説します。',
    category: '資格比較',
    publishedAt: '2025-04-01',
    updatedAt: '2025-06-01',
    readingTime: 12,
    headings: ['通信講座選びの3つのポイント', '通信講座5社の比較表', 'スタディング：コスパ最重視ならこれ', 'フォーサイト：合格率重視ならこれ', 'まとめ：目的別おすすめ通信講座'],
  },
  {
    slug: 'takken-tsushin-osusume',
    title: '宅建通信講座おすすめ5選【2025年・合格率・費用で比較】',
    description: '宅地建物取引士（宅建）の通信講座をスタディング・フォーサイト・アガルート・LEC・TACで比較。合格率・費用・学習期間を一覧でチェックできます。',
    category: '資格比較',
    publishedAt: '2025-04-15',
    updatedAt: '2025-06-01',
    readingTime: 10,
    headings: ['宅建試験の概要と難易度', '宅建通信講座5社の比較', '宅建通信講座の選び方', '宅建の学習スケジュール例'],
  },
  {
    slug: 'bookkeeping-school-hikaku',
    title: '簿記2・3級の通信講座おすすめ比較【スタディング vs フォーサイト vs ユーキャン】',
    description: '日商簿記2・3級の合格を目指す方向けに、人気3社（スタディング・フォーサイト・ユーキャン）の料金・カリキュラム・合格率を詳しく比較します。',
    category: '資格比較',
    publishedAt: '2025-05-01',
    updatedAt: '2025-06-01',
    readingTime: 10,
    headings: ['簿記2・3級の難易度と取得メリット', '3社の比較：スタディング vs フォーサイト vs ユーキャン', '教育訓練給付金で費用を削減'],
  },
  {
    slug: 'shikaku-career-up',
    title: '転職に有利な資格おすすめ10選【年収アップが狙える資格を厳選】',
    description: '転職・年収アップに直結する人気資格を10選で紹介。宅建・簿記・FP・中小企業診断士・社労士など、取得難易度と費用対効果で厳選した資格を解説します。',
    category: '転職・キャリア',
    publishedAt: '2025-05-15',
    updatedAt: '2025-06-01',
    readingTime: 11,
    headings: ['転職・年収アップに直結する資格とは', '転職に有利な資格10選', '資格取得の費用対効果を考える'],
  },
  {
    slug: 'fp-tsushin-osusume',
    title: 'FP（ファイナンシャルプランナー）通信講座おすすめ比較【2026年版】',
    description: 'FP2・3級の通信講座をスタディング・フォーサイト・アガルート・ユーキャンで比較。費用・合格率・学習スタイル別の選び方を解説します。',
    category: '資格比較',
    publishedAt: '2025-05-20',
    updatedAt: '2025-06-01',
    readingTime: 9,
    headings: ['FP試験の基本情報', 'FP通信講座4社の比較', '状況別・おすすめFP通信講座'],
  },
  {
    slug: 'gyousei-tsushin-hikaku',
    title: '行政書士通信講座おすすめ比較【2025年・合格率・費用で選ぶ】',
    description: '行政書士試験の通信講座をアガルート・フォーサイト・スタディング・クレアールで比較。合格率・費用・学習期間の違いを一覧で確認できます。',
    category: '資格比較',
    publishedAt: '2025-05-25',
    updatedAt: '2025-06-01',
    readingTime: 10,
    headings: ['行政書士試験の基本情報', '行政書士通信講座4社の比較', '行政書士の学習スケジュール例（1年間）'],
  },
  {
    slug: 'kyouiku-kunren-kyuufu',
    title: '教育訓練給付金で資格取得費用を最大70%削減【申請手順・対象講座解説】',
    description: '雇用保険加入者が使える教育訓練給付金制度を解説。一般教育訓練・特定一般・専門実践の3種類と、資格通信講座への適用例・申請手順をまとめました。',
    category: '費用・給付金',
    publishedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    readingTime: 8,
    headings: ['教育訓練給付金の3種類', '申請手順（受講前が重要）', '給付金対象の資格通信講座例'],
  },
  {
    slug: 'shikaku-dokugaku-vs-tsushin',
    title: '資格取得は独学 vs 通信講座どちらが有利？費用・合格率で比較',
    description: '資格取得を独学か通信講座で迷っている方向けに、費用・合格率・学習効率の観点から徹底比較。資格別のおすすめ選択肢も紹介します。',
    category: '費用・給付金',
    publishedAt: '2025-06-05',
    updatedAt: '2025-06-05',
    readingTime: 8,
    headings: ['独学 vs 通信講座：メリット・デメリット比較', '資格別：独学 vs 通信講座 どちらがおすすめ？', '結論：コスパを考えると通信講座が有利な場合が多い'],
  },
  {
    slug: 'shakaijin-shikaku-study',
    title: '働きながら資格取得するための勉強法【社会人が実践できる時間管理術】',
    description: '仕事と勉強を両立するための時間管理・勉強法を紹介。通勤時間・昼休みの活用、スキマ時間学習のコツ、挫折しないためのスケジュール管理まで解説します。',
    category: '転職・キャリア',
    publishedAt: '2025-06-10',
    updatedAt: '2025-06-10',
    readingTime: 9,
    headings: ['社会人の1日の学習時間の目安', 'スキマ時間を活用する5つのテクニック', '挫折しないための学習管理法'],
  },
  {
    slug: 'shakushi-tsushin-osusume',
    title: '社労士 通信講座 おすすめ5選【2026年版・合格率・費用を比較】',
    description: '社会保険労務士（社労士）試験に強い通信講座を徹底比較。アガルート・フォーサイト・スタディング・クレアールの費用・合格率・サポート体制を一覧で確認。',
    category: '国家資格',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 9,
    headings: ['社労士試験の基本情報', '社労士通信講座 比較表', '社労士資格の活かし方'],
  },
  {
    slug: 'chusho-shindan-shi',
    title: '中小企業診断士 通信講座 おすすめ3選【難関国家資格を最短取得】',
    description: '中小企業診断士試験に強い通信講座を比較。スタディング・クレアール・TACの費用・サポート・学習スタイルで選べる。1次から2次まで一貫対応の講座を紹介。',
    category: '国家資格',
    publishedAt: '2025-06-15',
    updatedAt: '2025-06-15',
    readingTime: 8,
    headings: ['中小企業診断士試験の概要', '中小企業診断士に強い通信講座', 'なぜ中小企業診断士はキャリアアップに強いのか'],
  },
  {
    slug: 'it-passport-tsushin-hikaku',
    title: 'ITパスポート通信講座おすすめ比較【2026年版・最短合格を狙う】',
    description: 'ITパスポート試験に対応したおすすめ通信講座を徹底比較。費用・学習時間・合格率・スマホ対応度をランキング形式で紹介。CBT試験対策のポイントも解説。',
    category: 'IT資格',
    publishedAt: '2026-05-20',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['ITパスポートとは？合格すると何が変わるか', 'ITパスポート通信講座 比較ランキング', 'ITパスポート 独学 vs 通信講座', 'ITパスポート合格後のステップ'],
  },
  {
    slug: 'fukugyou-shikaku-osusume',
    title: '副業で稼げる資格おすすめ10選【2026年版・収入アップに直結】',
    description: '副業に活かせる人気資格をランキング形式で紹介。FP・簿記・宅建・医療事務・ITパスポートなど収入アップに直結する資格の特徴・取得難易度・稼ぎ方を徹底解説。',
    category: '副業・スキルアップ',
    publishedAt: '2026-05-22',
    updatedAt: '2026-05-29',
    readingTime: 9,
    headings: ['副業に資格は必要か？資格が有利になる副業タイプ', '副業で稼げる資格 おすすめ10選', '副業資格取得を通信講座でスムーズに進めるコツ'],
  },
  {
    slug: 'iryo-jimu-shikaku-osusume',
    title: '医療事務 資格 通信講座 おすすめ5選【2026年版・費用・難易度比較】',
    description: '医療事務資格（医療事務技能審査試験・医療事務管理士）の取得に強い通信講座を比較。ユーキャン・ニチイ学館・キャリアカレッジの費用・カリキュラム・就職サポートを解説。',
    category: '国家資格',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 9,
    headings: ['医療事務資格とは？種類と特徴', '医療事務 通信講座 おすすめランキング', '医療事務の仕事と就職先', '医療事務資格 選び方のポイント'],
  },
  {
    slug: 'shikaku-nanido-ranking',
    title: '社会人が取りやすい資格ランキング2025【難易度・合格率・勉強時間で比較】',
    description: '働きながら取得しやすい国家資格・民間資格をランキング形式で紹介。FP・ITパスポート・宅建など難易度・必要勉強時間・合格率を一覧で比較して最適な資格選びをサポート。',
    category: '勉強法・対策',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['資格難易度の見方と選び方', '取得しやすい資格ランキングTOP10', '目的別おすすめ資格の選び方', '短期合格に役立つ通信講座の特徴'],
  },
  {
    slug: 'takken-dokusha-vs-tsushin',
    title: '宅建は独学と通信講座どっちがいい？費用・合格率・期間を徹底比較',
    description: '宅建（宅地建物取引士）の独学と通信講座を費用・合格率・学習期間・サポートで比較。初受験・再受験・働きながら合格を目指す方それぞれにおすすめの方法を解説します。',
    category: '資格比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 9,
    headings: ['宅建試験の概要と独学・通信講座それぞれの特徴', '独学をおすすめできる人・できない人', '宅建通信講座おすすめ3選'],
  },
  {
    slug: 'fp-2kyu-3kyu-chigai',
    title: 'FP2級と3級の違いは？どちらから取るべきか受験戦略を解説',
    description: 'FP（ファイナンシャルプランナー）2級と3級の試験内容・難易度・費用・就職への影響を比較。初めてFPを取得する方がどちらから始めるべきかを具体的に解説します。',
    category: '勉強法・対策',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 8,
    headings: ['FP2級と3級の違いを一覧で比較', 'あなたに向いているのはどっち？', 'FP2・3級の通信講座おすすめ比較'],
  },
  {
    slug: 'chuusho-shindan-shi-tsushin-hikaku',
    title: '中小企業診断士 通信講座おすすめ比較【2026年版・費用・合格率】',
    description: '中小企業診断士の通信講座をスタディング・アガルート・TAC・LEC・クレアールで比較。費用・合格率・学習期間・サポート内容を徹底解説します。',
    category: '資格比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 10,
    headings: ['中小企業診断士の試験概要', '中小企業診断士 通信講座 比較', '中小企業診断士の取得メリット'],
  },
  {
    slug: 'kango-fukushi-shikaku-tsushin',
    title: '介護・福祉系資格の通信講座おすすめ比較【ケアマネ・介護福祉士・社会福祉士】',
    description: 'ケアマネージャー・介護福祉士・社会福祉士など介護・福祉系国家資格の通信講座を比較。ニチイ学館・ユーキャン・キャリアカレッジなど主要講座の費用・特徴を解説。',
    category: '国家資格',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 9,
    headings: ['介護・福祉系の国家資格一覧', '介護・福祉系資格の通信講座おすすめ', '介護・福祉系資格の取得メリット'],
  },
  {
    slug: 'gyousei-vs-shakushi',
    title: '行政書士 vs 社労士 どっちを取るべき？難易度・年収・将来性を徹底比較',
    description: '行政書士と社労士の難易度・合格率・必要勉強時間・年収・独立開業のしやすさを詳しく比較。どちらを先に取るべきか迷っている社会人向けに選択基準を解説します。',
    category: '国家資格',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 10,
    headings: ['行政書士 vs 社労士 基本比較', '業務内容の違い', 'どちらを先に取るべき？目的別の選び方', '行政書士・社労士の通信講座比較'],
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '通信講座と通学スクール、どちらがいいですか？', a: '社会人が働きながら資格を取るなら通信講座が圧倒的に有利です。通学スクールは週1〜2回の通学時間が必要で、場所・時間が固定されます。通信講座はスマホ1台でスキマ時間に学習でき、ペースも自分で調整できます。合格率は通信講座と通学スクールで大きな差はなく、コストも通信講座のほうが安い場合が多いです。' },
            { q: '資格の通信講座に給付金は使えますか？', a: '多くの資格通信講座が「特定一般教育訓練給付金（受講費の40%還付、上限20万円）」または「専門実践教育訓練給付金（最大70%還付）」の対象です。スタディング・フォーサイト・アガルートも対象講座があります。受講開始前にハローワークでの手続きが必要なため、まず受講したい講座の給付金適用可否を確認し、条件を満たしているか事前相談してください。' },
            { q: '資格を取っても就職・転職に役立ちますか？', a: '資格が直結するキャリアアップの効果は資格による差が大きいです。宅建・FP・行政書士・社労士・中小企業診断士は転職市場での評価が高く、年収アップにつながるケースが多い。一方、名称独占・業務独占の区別・独立開業の可否も重要なポイントです。資格取得前に「この資格を持って何をしたいか」を明確にすることが大切です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '宅建の合格率はどのくらいですか？', a: '宅建（宅地建物取引士）の合格率は例年15〜18%程度で推移しています。毎年20万人以上が受験する人気資格ですが、難易度は中程度で、適切な学習（300〜500時間）で未経験でも合格できます。通信講座を活用した場合の合格率はスクールによって異なり、フォーサイトは独自調査で合格率が全国平均の約2〜4倍と公表しています。' },
            { q: '宅建と管理業務主任者、どちらを先に取るべきですか？', a: '不動産会社に就職・転職を目指すなら宅建が優先です。宅建は不動産取引で「5人に1人の設置義務」がある必須資格で、転職市場での需要が高い。管理業務主任者はマンション管理会社に特化した資格で、宅建とのダブルライセンスで市場価値が上がります。まず宅建→翌年管理業務主任者のルートが一般的です。' },
            { q: '宅建の勉強を独学で進める場合、どのくらいの期間が必要ですか？', a: '独学では平均300〜500時間の勉強時間が必要で、6〜12ヶ月が目安です。通信講座では200〜350時間程度に短縮できるケースがあります（効率的な学習順・過去問重点学習のため）。試験は毎年10月の第3日曜日に実施されるため、受験希望の前年10〜12月から学習開始するのが理想的です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '簿記3級と2級、どちらを最初に取るべきですか？', a: '経理・財務への転職を目指す方は2級取得が目標になりますが、まず3級から始めることを推奨します。3級は2級の基礎となる知識を習得でき、独学でも合格しやすい（合格率40〜50%）。2級の合格率は約20〜30%で難易度が上がります。通信講座でセット受講（3級+2級）すると割引になるケースが多く、1年で両方取得を目指す計画が効率的です。' },
            { q: '日商簿記とその他の簿記検定の違いは何ですか？', a: '日商簿記（日本商工会議所主催）が最も認知度が高く、転職・就職で評価されます。全経簿記（全国経理教育協会）・建設業経理士・農業簿記等も存在しますが、汎用性は日商簿記が最高。「簿記2級」という場合、ほぼ日商簿記2級のことを指します。就職・転職を目的とするなら日商簿記を選びましょう。' },
            { q: '簿記の資格を取ったら年収はどのくらい上がりますか？', a: '簿記2級取得後、経理・財務職への転職では20〜50万円程度の年収アップが期待できるケースがあります。ただし資格単体での年収アップより、「実務経験+資格」の組み合わせのほうが評価されます。中小企業の経理担当は300〜400万円、上場企業の財務部門は500〜700万円以上と幅があります。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '転職せずに現職の年収を上げるために資格は有効ですか？', a: '資格が現職での昇給に直結するかは会社によります。資格取得手当が設定されている職場（医療・金融・建設等）では即時効果があります。一般的なオフィスワーカーの場合、資格取得が直接昇給につながらないケースも多いです。転職市場での価値を高める「副次的な効果」として資格を活用するのが現実的です。' },
            { q: '士業（弁護士・税理士・司法書士）は本当に高収入ですか？', a: '難易度の高い士業資格は独立開業後に高収入が期待できますが、勤務の場合は年収400〜700万円程度が相場（弁護士・税理士も含む）。独立開業で成功すれば年収1,000万円以上も可能ですが、個人差が大きく、集客・営業力が重要です。難関資格の学習コスト（時間・費用）を考慮した上で、費用対効果を慎重に判断してください。' },
            { q: '複数の資格を持つのと1つを深掘りするのは、どちらが有利ですか？', a: 'キャリアアップの目的次第です。専門性の高い職種（税理士・弁護士・医師等）は1資格を深掘り。一方、コンサル・営業・管理職方向はFP+宅建+ITパスポートなど複数資格のポートフォリオが有利な場合もあります。「資格コレクター」にならないよう、資格取得の目的と活用シーンを先に考えてから計画を立てることが重要です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'FP3級を独学で取ると、FP2級の難易度は大きく上がりますか？', a: 'FP3級から2級への難易度の上昇は「約2倍」と言われます。3級は暗記中心で独学可能（合格率80%前後）ですが、2級は計算問題が増え・出題範囲が広くなります（合格率40〜50%）。3級取得後すぐに2級の学習を継続するのが最も効率的。通信講座で3級+2級セットを受講すると割引になりますし、知識の連続性があるため習得が効率的です。' },
            { q: 'FP資格は独立開業できますか？', a: 'FP資格単体で独立開業は難しいですが、FP2〜1級＋実務経験があれば「独立系FP」として相談業務が可能です。日本FP協会のAFP・CFP認定を取得するとより信頼性が上がります。実際は保険代理店・不動産会社・証券会社での勤務FPが多く、独立開業には集客力・顧客管理スキルが重要です。まずは資格取得→実務経験→独立というルートが一般的です。' },
            { q: 'FP試験は何月に受験できますか？', a: '3・4・5月・8・9月・10月・1・2月の年6回（学科・実技それぞれ）実施されています（2023年以降のCBT方式導入後）。年複数回受験できるようになり、合格しやすくなっています。まず3級→合格後すぐに2級の学習開始→次の試験で2級受験、というスケジュールが効率的です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '行政書士の合格率はどのくらいですか？', a: '例年10〜13%程度と難関資格です。毎年40,000〜50,000人が受験し、合格者は5,000〜6,000人程度。基準点主義（総合180点以上＋各科目で足切りあり）のため、バランスのとれた学習が必要です。独学では合格まで2〜3年かかることが多く、通信講座を活用すると1〜1.5年での合格を目指しやすくなります。' },
            { q: '行政書士と司法書士の違いは何ですか？どちらを目指すべきですか？', a: '行政書士は行政手続（許認可・在留資格等）の書類作成代理が主業務。司法書士は登記・裁判所手続が主業務で、難易度は司法書士のほうがかなり高い（合格率約5%）。独立開業後の業務範囲は司法書士のほうが広い。費用・時間・難易度を考えると「まず行政書士→独立後に司法書士」または「司法書士一本に絞る」の選択が現実的です。' },
            { q: '行政書士は就職・転職で有利ですか？', a: '行政書士資格は独立開業型の資格で、企業就職での直接的な評価は税理士・社労士より低い場合があります。ただし、建設業・不動産業・入管業務を扱う企業では有資格者を積極採用しているケースも。キャリアアップ目的なら「行政書士+業界経験」の組み合わせで独立開業を目指す方向性が最もリターンが大きいです。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '給付金の申請はいつでもできますか？', a: '受講開始前に手続きが必要です。「受講開始日の1ヶ月前まで」にハローワークで支給要件照会を行い、利用登録をする必要があります。受講後に「こんな制度があったのか」と気づいても給付を受けられません。まずハローワークに相談し、受給資格があるか確認してから受講先を決定することをお勧めします。' },
            { q: '専門実践教育訓練給付金（70%給付）の対象になる通信講座はありますか？', a: '社会保険労務士・税理士・弁護士・医療系国家資格等の難関資格を目指す一部の通信講座が対象です。宅建・FP等の比較的難易度の低い資格は「特定一般教育訓練（40%給付）」が多い。厚生労働省の「教育訓練給付制度 検索システム」でご自身の受講希望講座が対象かを確認できます。' },
            { q: '給付金対象の通信講座と非対象の通信講座、質の差はありますか？', a: '給付金対象には厚生労働省の審査基準（修了率・就職率・カリキュラム等）をクリアする必要があるため、一定の質が担保されています。ただし対象外でも質が高い通信講座は存在し、スタディングなどはコスパが高いと評価されています。給付金対象かどうかより、「合格率・講師の質・サポート体制」で選ぶことを推奨します。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '独学で一発合格できる資格と通信講座が必要な資格の違いは何ですか？', a: '合格率が40%以上の資格（FP3級・ITパスポート・簿記3級等）は独学でも合格しやすい。合格率が15%以下の資格（宅建・行政書士・社労士等）は通信講座の活用が効率的です。また、範囲が広くて出題傾向の分析が重要な試験は通信講座のほうが「やるべき勉強」を絞り込んでくれるため、時間節約になります。' },
            { q: '独学のデメリットを補う方法はありますか？', a: '独学最大のデメリットは「どこで躓いているか気づきにくい」「モチベーション維持が難しい」の2点。補う方法として①学習コミュニティへの参加（Twitterのハッシュタグ・資格取得者のSNSフォロー）、②無料の質問機能が使えるアプリ（スタディングの一部機能等）の活用、③友人・同僚と勉強仲間を作る、などが有効です。' },
            { q: '社会人が独学で難関資格に合格した事例はありますか？', a: 'あります。ただし合格者の学習時間・学習法を詳細に調べると、市販テキスト以外に「過去問解析・弱点特化学習・模試受験」等を徹底的に行っていることが多いです。独学成功者は独学とはいえど非常に体系的に勉強しており、結果として通信講座と変わらないメソッドを使っていることがほとんど。コストを抑えたいなら、コスパの高い通信講座（スタディング等）が現実的な妥協点です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '社会人が1日何時間の学習を続ければ資格取得できますか？', a: '資格の難易度によります。FP3級なら1日1時間×2〜3ヶ月（約60〜90時間）、宅建なら1日1.5時間×8〜10ヶ月（約350〜450時間）、社労士なら1日2時間×12〜18ヶ月（700〜1,000時間）が目安です。週末に集中して週20時間確保できる方は期間を短縮できます。スキマ時間（通勤・休憩・就寝前）を活用するとペースが維持しやすいです。' },
            { q: '学習習慣がない社会人が勉強を続けるコツは何ですか？', a: '①「朝の30分」等の固定時間を確保する（意志力ではなく習慣化）、②学習ハードルを下げる（「完璧に理解しなくていい、まずページを開くだけ」）、③スマホアプリで通勤中に学習する（スタディングのスマホ対応は特に優秀）、④勉強した記録をSNSやノートに記録する（達成感がモチベーションを維持）、の4点が効果的です。' },
            { q: '育児・家事・仕事を抱える主婦でも資格取得できますか？', a: 'できます。時間の確保が難しい中でも「子供の昼寝中」「家事の合間の5〜10分」「通院の待ち時間」等のスキマ学習を積み重ねることで合格した事例は多数あります。スマホアプリ対応の通信講座（スタディング等）はこのような環境に特に適しています。FP・宅建・医療事務・社会保険労務士は育児後の再就職・パートで活かせる人気資格です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '社労士試験の難易度はどのくらいですか？', a: '合格率6〜7%程度の難関国家資格です。法律改正が多い（毎年の保険法改正等）ため、最新テキストでの学習が重要。学習時間は800〜1,000時間が必要とされ、通信講座の場合1〜1.5年が目安です。科目ごとの「足切り（基準点）」があるためバランスのよい学習が必須。独学より通信講座・予備校の活用が合格率を高めやすいです。' },
            { q: '社労士の仕事内容と稼げる金額を教えてください', a: '主な業務は①社会保険・労働保険の手続代行、②就業規則・労働契約書の作成、③給与計算アウトソーシング、④助成金申請コンサルティング、⑤労務相談顧問業務です。勤務社労士の年収は300〜500万円程度。独立開業後は顧問先を増やすことで年収500〜1,000万円以上を目指すことができます。人事・労務担当者としての転職にも有利です。' },
            { q: '社労士と行政書士、どちらを先に取るべきですか？', a: '目指すキャリアによります。人事・労務・助成金系に興味があれば社労士が先。許認可・在留資格・遺産手続き方向なら行政書士が先。ダブルライセンスで活躍している士業も多く、最終的にはどちらも取得すると業務の幅が広がります。難易度は社労士のほうがやや高く（合格率7% vs 行政書士12%）、学習時間も多く必要です。' }
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '中小企業診断士の難易度と勉強時間はどのくらいですか？', a: '1次試験・2次試験の2段階で構成され、合格率は1次試験25〜30%・2次試験18〜20%・最終合格率は約5〜8%程度です。必要学習時間は1,000〜1,500時間が目安で、通信講座を活用した場合1〜2年が現実的な学習期間です。経営学・財務・法律・情報など7科目の幅広い知識が求められますが、MBAに近い実践的な学習内容です。' },
            { q: '中小企業診断士はどのような職種に就ける人に有利ですか？', a: '経営コンサルタント・企業内診断士（経営企画・事業開発）・銀行員・商工会議所職員・中小企業向け金融機関に特に有利です。独立開業型の資格ですが、大企業のMBA取得と同等の評価を受けるケースもあり、社内でのキャリアアップにも有効。資格取得後の「診断士の会」へのネットワーク参加も活躍の場を広げる機会になります。' },
            { q: '中小企業診断士を通信講座で取得する場合、どのくらい費用がかかりますか？', a: 'スタディング（89,100円〜）・アガルート（138,000円〜）・TAC（240,000円〜）と幅があります。スタディングはコスパが最高水準で、動画講義とスマホ学習に優れています。費用対効果を考えると、1〜1.5年で合格できれば取得後の収入増加（コンサル転職・顧問料）で十分に回収できます。' }
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
  'it-passport-tsushin-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ITパスポートとは？合格すると何が変わるか</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          ITパスポート（iパス）は経済産業省所管のIPA（情報処理推進機構）が実施するIT国家資格の入門レベルです。ITの基礎知識・セキュリティ・経営戦略・プロジェクト管理など幅広い分野を問う試験で、IT職種以外の社会人・学生にも広く取得が推奨されています。
        </p>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">試験概要</p>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 w-28">受験資格</td><td className="py-1.5">なし（誰でも受験可）</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500">試験形式</td><td className="py-1.5">CBT（随時・全国会場）</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500">問題数</td><td className="py-1.5">100問（四択）</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500">合格基準</td><td className="py-1.5">総合600点以上（1,000点満点）</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500">合格率</td><td className="py-1.5">約50〜55%（例年）</td></tr>
              <tr><td className="py-1.5 text-gray-500">標準学習期間</td><td className="py-1.5">1〜3ヶ月（50〜100時間程度）</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          CBT方式のため試験日は自分で選択でき、年間を通じていつでも受験できます。合格率は約50%と国家資格の中では取りやすい部類に入りますが、IT知識ゼロから始める場合は通信講座でポイントを押さえて学習することで合格率が大幅に上がります。
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ITパスポート通信講座 比較ランキング</h2>
        <div className="space-y-4">
          <div className="border-2 border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-bold">1位</span>
              <h3 className="font-bold text-gray-900">スタディング ITパスポートコース</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded ml-auto">コスパ最強</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <span>受講料：4,950円〜</span>
              <span>学習形式：スマホ完結</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">最安クラスの受講料でAI問題演習・動画講義・過去問演習が揃う。通勤・昼休みのスキマ時間だけで合格を狙える設計が特徴。IT職種以外のビジネスパーソンの取得率も高い。</p>
            <div className="text-xs text-gray-500">◎ スキマ時間学習 ◎ 低価格 △ 紙テキストなし</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded font-bold">2位</span>
              <h3 className="font-bold text-gray-900">フォーサイト ITパスポートコース</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded ml-auto">テキスト品質</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <span>受講料：20,800円〜</span>
              <span>学習形式：テキスト＋eラーニング</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">フルカラーで見やすいテキストと充実した問題演習が特徴。宅建・FPでも高い合格率を誇るフォーサイトのノウハウをITパスポートにも展開。教育訓練給付金対象コースあり。</p>
            <div className="text-xs text-gray-500">◎ テキスト品質 ◎ 給付金対象 △ 価格がやや高め</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded font-bold">3位</span>
              <h3 className="font-bold text-gray-900">ユーキャン ITパスポートコース</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded ml-auto">添削指導あり</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <span>受講料：31,900円〜</span>
              <span>学習形式：テキスト＋添削</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">国内最大規模の通信教育会社の安心感。添削指導と充実した紙テキストで、デジタルより紙で学びたい方に向く。サポート期間が8ヶ月と余裕を持って学習できる。</p>
            <div className="text-xs text-gray-500">◎ 添削指導 ◎ 紙テキスト充実 △ 価格が高め</div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ITパスポート 独学 vs 通信講座</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: '独学が向いている人', points: ['IT・PC操作の基礎知識がある', '3ヶ月以上の余裕がある', '参考書・問題集を自分で進められる'] },
            { label: '通信講座が向いている人', points: ['IT知識が少ない・ゼロから始める', '2ヶ月以内で合格したい', 'スキマ時間を効率よく使いたい'] },
          ].map(({ label, points }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
              <ul className="space-y-1">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-slate-400 shrink-0">▸</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ITパスポート合格後のステップ</h2>
        <ul className="space-y-2">
          {[
            'ITパスポート取得後は「基本情報技術者試験」へのステップアップが一般的。IT職への転職・昇進で大きく評価される。',
            '非IT職でも「DX推進担当」「情報セキュリティリーダー」などの役割でIT資格が評価される企業が増えている。',
            '基本情報→応用情報→高度試験と段階的にキャリアを積む国家試験ルートが整備されており、IT専門職を目指す人は連続した取得計画が有効。',
            'G検定（AI）・情報セキュリティマネジメントなど横展開することでDX・セキュリティ両面でのスキルをアピールできる。',
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
            { q: 'ITパスポートは難しいですか？独学で合格できますか？', a: 'ITパスポートの合格率は50〜60%程度で、国家資格の中では比較的取りやすい部類です。学習時間の目安は100〜150時間（2〜3ヶ月）。独学でも市販テキスト+過去問で合格可能です。通信講座を使う場合は学習を効率化できますが、費用をかけなくてもITパスポートは独学で対応できます。次のステップとして基本情報技術者試験（合格率40%程度）も視野に入れましょう。' },
            { q: 'ITパスポートを持っていると就職・転職に有利ですか？', a: 'ITパスポートは「IT基礎知識の証明」として、IT非専門職の就活・転職に加点評価される資格です。ただし、IT専門職（エンジニア・SE等）への転職では基本情報技術者試験以上が期待されます。文系・事務職・営業職など「IT素養をアピールしたい非IT職」の人に最適な資格です。取得後のステップとして「基本情報技術者試験→応用情報技術者試験」を目指しましょう。' },
            { q: 'ITパスポートとG検定（AI）、どちらを先に取るべきですか？', a: 'IT基礎知識がない方はITパスポートが先。AIに特化した学習・キャリアを目指す方はG検定（深層学習・AI理論）が有効です。両方取得するとITとAIの素養を証明でき、DX推進・AIプロジェクト関連業務での差別化が可能。費用もITパスポート（7,500円）・G検定（年4〜5回実施、12,000円程度）と比較的低コストで取得できます。' }
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
  'fukugyou-shikaku-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">副業に資格は必要か？資格が有利になる副業タイプ</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          副業すべてに資格が必要なわけではありませんが、「資格がある＝専門性・信頼性の証明」になる副業では資格取得が収入アップに直結します。特に対人サービス・相談業・独立開業系の副業では資格保有者と非保有者で単価が大きく変わります。
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: '資格が直結する副業', examples: ['FP（資産運用相談）', '簿記（記帳代行）', '宅建（不動産副業）'] },
            { label: '資格で単価が上がる副業', examples: ['医療事務（パート単価）', 'プログラミング（基本情報）', 'ライター（専門分野資格）'] },
            { label: '資格で信頼が上がる副業', examples: ['コンサルティング', 'オンライン家庭教師', 'Webデザイン（色彩検定）'] },
          ].map(({ label, examples }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
              <ul className="space-y-1">
                {examples.map((e) => (
                  <li key={e} className="text-xs text-gray-600">▸ {e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">副業で稼げる資格 おすすめ10選</h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'FP（ファイナンシャルプランナー）2級', level: '普通', period: '3〜6ヶ月', income: '月3〜10万円', note: '保険・税金・投資の相談業が可能に。副業FPとしてブログ・YouTube・個別相談で収入を得られる。2級は独立・副業での活躍に十分な知識が身につく。' },
            { rank: 2, name: '日商簿記2級', level: '普通', period: '3〜6ヶ月', income: '月2〜8万円', note: '記帳代行・確定申告サポートなど会計系副業に直結。フリーランサー向け経理代行需要が高い。クラウド会計普及で個人向けサポート案件も増加。' },
            { rank: 3, name: '宅地建物取引士（宅建）', level: '難しい', period: '6〜12ヶ月', income: '月5〜15万円', note: '不動産会社でのパート・副業に有利。宅建士証があれば独立開業も可能で収入の天井が高い。難易度は高いが取得後の副業・転職価値が非常に高い。' },
            { rank: 4, name: 'ITパスポート', level: '易しい', period: '1〜2ヶ月', income: '月1〜5万円', note: 'IT系副業（データ入力・IT補助業務）で有利。社内評価・昇給にもつながる。合格率50%と取りやすい入門IT国家資格。' },
            { rank: 5, name: '医療事務（メディカルクラーク）', level: '普通', period: '3〜4ヶ月', income: '月2〜6万円', note: 'クリニック・病院でのパート需要が全国的に高い。資格保有者は採用優遇・時給アップが期待できる。' },
            { rank: 6, name: '行政書士', level: 'かなり難しい', period: '6〜18ヶ月', income: '月5〜30万円', note: '許認可申請・会社設立・相続など幅広い法務業務を副業・独立で受注できる。難易度は高いが単価が高い。' },
            { rank: 7, name: '色彩検定2級', level: '普通', period: '2〜4ヶ月', income: '月1〜5万円', note: 'Webデザイン・インテリア・ファッション分野の副業に活かせる。デザイン副業の単価アップに直結。' },
            { rank: 8, name: '介護職員初任者研修', level: '易しい', period: '1〜3ヶ月', income: '月3〜8万円', note: '介護ヘルパーとして週末・夜間の副業が可能。全国的に人手不足のため求人が多く、すぐに案件を見つけやすい。' },
            { rank: 9, name: 'G検定（JDLA ジェネラリスト検定）', level: '普通', period: '2〜3ヶ月', income: '月2〜10万円', note: 'AI・DX推進コンサルタントとしての副業に活かせる。DX支援・社員教育コンテンツ制作などの副業案件が増加中。' },
            { rank: 10, name: '食育インストラクター（民間）', level: '易しい', period: '2〜4ヶ月', income: '月1〜5万円', note: '料理教室・食育ブログ・SNS発信など副業の幅が広い。取りやすく食に関心が高い方に人気の資格。' },
          ].map(({ rank, name, level, period, income, note }) => (
            <div key={rank} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${rank <= 3 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}>{rank}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">難易度: {level}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 mb-2">
                    <span>学習期間: {period}</span>
                    <span>副業収入目安: {income}</span>
                  </div>
                  <p className="text-xs text-gray-600">{note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">副業資格取得を通信講座でスムーズに進めるコツ</h2>
        <ul className="space-y-2">
          {[
            '目標の副業から逆算して資格を選ぶ。資格を先に選ぶと活用できない資格を取るリスクがある',
            '副業開始まで3〜6ヶ月が現実的なスケジュール。資格取得後すぐに収入が発生するとは限らない',
            '教育訓練給付金（最大20〜70%還付）対象講座を選ぶと実質負担を大幅に減らせる',
            '通信講座は「スキマ時間学習型」を選ぶと本業との両立がしやすい',
            'FP・簿記・ITパスポートは比較的短期間・低価格で取得でき副業参入への障壁が低い',
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
            { q: '副業で資格を活かすまでにはどのくらいの準備期間が必要ですか？', a: '資格取得後すぐに副業収入が得られるわけではありません。資格取得→実績作り（低単価案件・知人案件）→SNS・プラットフォームでの集客まで、副業として安定収入になるまで3〜12ヶ月かかることが多いです。FPはSNS発信→相談料収入、Webライターは文字単価UP→継続案件という段階的な成長が一般的です。' },
            { q: '副業で稼げる金額の現実的な目安を教えてください', a: '資格+副業の組み合わせで、月3〜10万円が現実的な初期目標です。FP（相談料5,000〜30,000円/時）・宅建（不動産会社の副業仲介）・社労士（顧問料月3〜5万円/社）などは軌道に乗れば月10万円以上も可能。ただし「資格を取れば稼げる」わけではなく、集客・営業力・継続力がより重要です。' },
            { q: '副業解禁していない会社員が資格を使って副業するのは問題ありますか？', a: '就業規則で副業禁止の場合、資格を使った副業も原則NGです。ただし確定申告の義務（副業所得年20万円超）が発生しても会社に自動通知はされません（住民税の特別徴収変更を避ければ）。近年は政府の副業推進もあり副業解禁企業が増えていますが、まず就業規則を確認・必要なら会社への申請をしてください。' }
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

  'iryo-jimu-shikaku-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">医療事務資格とは？種類と特徴</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          医療事務は、病院・クリニック・調剤薬局の受付・会計・レセプト（診療報酬明細書）作成を担う仕事です。就職に有利な民間資格が複数あり、通信講座で数ヶ月から取得できます。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">資格名</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">主催団体</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">難易度</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">合格率</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['医療事務技能審査試験（メディカルクラーク）', '日本医療教育財団', '普通', '60〜70%'],
                ['医療事務管理士技能認定試験', '技能認定振興協会', '普通', '50〜60%'],
                ['診療報酬請求事務能力認定試験', '日本医療保険事務協会', '難しい', '30〜40%'],
                ['医療秘書技能検定', '日本医療秘書学会', '普通', '50〜65%'],
              ].map(([name, org, difficulty, rate]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="border border-gray-200 px-3 py-2 font-medium text-gray-800">{name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{org}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{difficulty}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">医療事務 通信講座 おすすめランキング</h2>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'ユーキャン 医療事務講座',
              price: '49,000円',
              period: '約4ヶ月',
              support: '添削6回・質問サービス',
              target: '医療事務技能審査試験（メディカルクラーク）',
              points: ['合格実績多数・知名度が高く就職活動でも評価される', '教材がわかりやすく独学経験なしでも取り組みやすい', '添削指導と質問サポートで挫折しにくい'],
            },
            {
              rank: 2,
              name: 'ニチイ学館 医療事務（医科）',
              price: '44,000円〜',
              period: '約4ヶ月',
              support: '通学・通信選択可・就職サポート',
              target: 'メディカルクラーク・実務直結',
              points: ['全国の病院・医療機関への就職支援が充実', '通学クラスもあり対面で質問できる', '病院での就業経験者が多い実績'],
            },
            {
              rank: 3,
              name: 'キャリアカレッジ 医療事務+調剤薬局事務W資格取得講座',
              price: '39,800円',
              period: '約3〜4ヶ月',
              support: '質問無制限・W資格取得',
              target: 'メディカルクラーク＋調剤薬局事務管理士',
              points: ['1つの講座で2つの資格を同時取得できる', '調剤薬局への就職も視野に入れられる', '質問無制限で学習中の疑問をすぐ解消'],
            },
            {
              rank: 4,
              name: 'スタディング 医療事務講座',
              price: '19,800円',
              period: '約3ヶ月',
              support: 'スマホ完結・AI問題演習',
              target: '医療事務管理士',
              points: ['業界最安水準の価格でスマートフォン完結', 'スキマ時間に学習できる動画中心のカリキュラム', 'AI問題演習で弱点を効率的に克服'],
            },
            {
              rank: 5,
              name: 'フォーサイト 医療事務講座',
              price: '29,800円',
              period: '約3〜4ヶ月',
              support: 'eラーニング・合格保証なし',
              target: '診療報酬請求事務能力認定試験',
              points: ['比較的難易度の高い「診療報酬請求事務能力認定試験」に対応', '学習効率を重視したフルカラーテキスト', 'デジタル教材でタブレット学習が快適'],
            },
          ].map(({ rank, name, price, period, support, target, points }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="bg-slate-800 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div>
                  <p className="font-bold text-gray-900 text-base">{name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">対象資格: {target}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">受講料: {price}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">学習期間: {period}</span>
                <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">{support}</span>
              </div>
              <ul className="space-y-1">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">医療事務の仕事と就職先</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          医療事務は全国どこでも求人がある安定職種です。主な就職先と仕事内容を確認しましょう。
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { place: '総合病院・クリニック', work: '受付・会計・レセプト作成。患者対応が中心。' },
            { place: '調剤薬局', work: '処方箋の受付・会計・薬歴管理。医療事務＋調剤薬局事務の知識が有利。' },
            { place: '歯科医院', work: '歯科レセプト・受付。歯科医療事務の知識が求められる。' },
            { place: '健診センター・検診機関', work: '健康診断の受付・結果管理。病院勤務よりも落ち着いた環境が多い。' },
          ].map(({ place, work }) => (
            <div key={place} className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{place}</p>
              <p className="text-xs text-gray-600">{work}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">医療事務資格 選び方のポイント</h2>
        <div className="space-y-3">
          {[
            { title: '就職目的ならユーキャン・ニチイが有利', body: '病院・クリニックへの就職を目指す場合、知名度の高いユーキャンや就職支援が充実しているニチイ学館が有利です。採用担当者が資格名を知っている確率が高く、選考でのアピール力があります。' },
            { title: 'W資格を効率よく取るならキャリアカレッジ', body: '医療事務と調剤薬局事務の両方を取得することで、就職先の選択肢が広がります。キャリアカレッジのW資格講座は1つの受講費用でダブル取得が可能でコスパ優秀です。' },
            { title: '費用を抑えたいならスタディング', body: '2万円以下でスマートフォン完結学習できるスタディングは、費用重視の方に最適。ただし就職サポートは限定的なため、自力で就職活動が進められる方向けです。' },
            { title: '難関資格を目指すならフォーサイト', body: '「診療報酬請求事務能力認定試験」は医療事務資格の中で最も難しく、取得すれば就職・給与面で有利になります。フォーサイトはこの試験に特化したカリキュラムが充実しています。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">医療事務対応のおすすめ通信講座を確認する</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'ユーキャン', slug: 'yukiyukan' },
            { name: 'スタディング', slug: 'studying' },
            { name: 'キャリアカレッジ', slug: 'career-college-japan' },
            { name: 'ニチイ学館', slug: 'nichiiko-gakkan' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/courses/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細を見る →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '医療事務の資格は何種類あり、どれが一番評価されますか？', a: '医療事務の主な資格は「診療報酬請求事務能力認定試験（最難関・最高評価）」「医療事務技能審査試験（メディカルクラーク）」「医療事務管理士技能認定試験」等があります。就職市場で最も評価されるのは「診療報酬請求事務能力認定試験」で合格率30〜40%と難しいが、持っていると採用で大きなアドバンテージになります。' },
            { q: '医療事務はAIに仕事を奪われませんか？', a: 'レセプト（診療報酬明細書）の入力・チェックはAI自動化が進んでいますが、患者対応・医師・看護師とのコミュニケーション・複雑なケースの対応はまだ人間が担います。電子カルテ・医事コンピュータを使いこなす「デジタルスキルのある医療事務」の需要は引き続き高い状態です。AI時代でも医療機関の受付・患者対応は人手が必要な領域です。' },
            { q: '医療事務の資格を持っていると転職しやすいですか？', a: '医療機関（病院・クリニック・歯科医院・調剤薬局）への就職・転職で有利になります。特に未経験者の採用では「資格あり」と「なし」で優先度が変わるケースが多いです。また、ブランクがある主婦の再就職でも、医療事務資格があると採用されやすいです。病院の規模・科によって給与は異なりますが、医療業界は景気の影響を受けにくく安定した雇用環境です。' }
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

  'shikaku-nanido-ranking': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">資格難易度の見方と選び方</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          「取りやすい資格」を選ぶ際は、合格率だけでなく<strong>必要勉強時間・試験頻度・受験資格の有無</strong>を総合的に判断することが重要です。以下のランキングは、社会人が働きながら取得することを前提に評価しています。
        </p>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">評価基準</p>
          <ul className="space-y-1">
            {[
              '合格率（高いほど取得しやすい）',
              '必要勉強時間の目安（短いほど社会人向き）',
              '試験実施頻度（多いほどリトライしやすい）',
              '受験資格の制限（なし・少ないほど誰でも受けやすい）',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-xs text-gray-700">
                <span className="text-slate-400 shrink-0">▸</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">取得しやすい資格ランキングTOP10</h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'ITパスポート', time: '約100〜200時間', rate: '50〜55%', freq: 'ほぼ毎日（CBT）', level: '易しい', note: 'コンピュータ・ビジネス基礎知識。受験資格なし。社会人の必須スキルとしてIT業界以外でも評価が高まっている。' },
            { rank: 2, name: 'FP3級', time: '約100〜150時間', rate: '70〜85%', freq: '年3回（1・5・9月）', level: '易しい', note: 'お金の基礎知識（税・保険・年金）。受験資格なし。FP2級へのステップとして取得する方が多い。' },
            { rank: 3, name: '日商簿記3級', time: '約100〜200時間', rate: '40〜60%', freq: '年3回（2・6・11月）', level: '普通', note: '会計・経理の基礎。受験資格なし。3級は入門で、転職・就職では2級以上が有利。' },
            { rank: 4, name: 'MOS（マイクロソフト オフィス スペシャリスト）', time: '約50〜100時間', rate: '70〜80%', freq: '毎月（CBT）', level: '易しい', note: 'WordやExcelの実務スキル。PC操作の証明として就職・転職時に評価される。' },
            { rank: 5, name: '宅地建物取引士（宅建）', time: '約300〜400時間', rate: '15〜17%', freq: '年1回（10月）', level: '難しい', note: '不動産業界では必須。難しいが取得後の市場価値が高く、年収への影響が大きい国家資格。' },
            { rank: 6, name: 'FP2級', time: '約150〜300時間', rate: '35〜60%', freq: '年3回（1・5・9月）', level: '普通', note: '実務レベルの金融・保険知識。転職での評価が高く、FP3級から続けて取得する人が多い。' },
            { rank: 7, name: '日商簿記2級', time: '約300〜500時間', rate: '15〜30%', freq: '年3回（2・6・11月）', level: '難しい', note: '経理・会計職での転職に強い。3級より大幅に難しいが取得価値は高い。' },
            { rank: 8, name: '行政書士', time: '約500〜1000時間', rate: '10〜13%', freq: '年1回（11月）', level: 'かなり難しい', note: '独立開業できる法律系国家資格。合格率は低いが通信講座を活用すると合格率が大幅に向上。' },
            { rank: 9, name: '社会保険労務士（社労士）', time: '約700〜1000時間', rate: '6〜7%', freq: '年1回（8月）', level: 'かなり難しい', note: '人事・労務分野の最高峰資格。独立開業・企業内キャリアアップ両方に活かせる。' },
            { rank: 10, name: '中小企業診断士', time: '約700〜1200時間', rate: '一次20%・二次18%', freq: '年1回（一次7月・二次10月）', level: 'かなり難しい', note: '経営全般を扱う唯一のコンサルタント国家資格。2次試験まであり難度が高い。' },
          ].map(({ rank, name, time, rate, freq, level, note }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-2">
                <span className={`text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${rank <= 3 ? 'bg-slate-800' : 'bg-slate-400'}`}>{rank}</span>
                <p className="font-bold text-gray-900">{name}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">勉強時間: {time}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">合格率: {rate}</span>
                <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">試験: {freq}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{level}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">目的別おすすめ資格の選び方</h2>
        <div className="space-y-3">
          {[
            { goal: '転職・就職を有利にしたい', recs: 'FP2級・宅建・簿記2級・社労士のいずれかを目標にする。業界に合わせて選ぶ（不動産→宅建、金融→FP、経理→簿記、人事→社労士）。' },
            { goal: '副業収入を増やしたい', recs: 'FP3級・2級はお金の相談業務に活かせる。簿記は確定申告サポート・経理代行に活用可能。ITパスポートはWeb系副業の入口になる。' },
            { goal: '3ヶ月以内に資格を取りたい', recs: 'ITパスポート・FP3級・MOS。いずれも100〜200時間程度の学習で合格が狙える。通信講座を活用すると効率がさらに上がる。' },
            { goal: '独立・開業を目指したい', recs: '行政書士・社労士・中小企業診断士は独立開業が可能な国家資格。難易度は高いが長期的な収入安定につながる。' },
          ].map(({ goal, recs }) => (
            <div key={goal} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">目標：{goal}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{recs}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">短期合格に役立つ通信講座の特徴</h2>
        <ul className="space-y-2">
          {[
            'スキマ時間学習型（スマートフォン対応・動画中心）: スタディング・フォーサイトが代表格',
            '合格実績が高い講座を選ぶ: 合格率を公表している講座は信頼性の目安になる',
            '教育訓練給付金対象講座を活用: 受講料の20〜70%が還付されコスト負担を大幅軽減',
            '試験1〜2ヶ月前からの直前対策講座もある: 模擬試験・直前ヤマ当て講義で最終調整',
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
            { q: '難易度が低くて転職に有利な資格を教えてください', a: '難易度が中程度（合格率30〜50%）で転職評価が高い資格として、FP2級・ITパスポート・日商簿記2級・MOSスペシャリストがあります。宅建（合格率15〜18%）は難易度がやや高いですが、取得後の転職評価は非常に高い。目標の職種に合わせた資格選びが最も重要で、「難関資格を取ること」自体が目的にならないようにしましょう。' },
            { q: '資格の取得に失敗（不合格）した場合、どうすればいいですか？', a: '不合格でも得た知識は残ります。まず「弱かった分野・科目」を分析し、次回試験（多くの資格は年1〜2回）に向けて補強学習を行いましょう。通信講座は多くが「不合格の場合の保証（受講期間延長・返金）」を提供しています。1〜2回の不合格は珍しくなく、むしろ不合格後の改善学習で合格する方が知識が定着しています。' },
            { q: '複数の資格を短期間で取る「資格ラッシュ」は意味がありますか？', a: '転職目的で短期間に複数資格を取ることは、「資格のコレクター」として見られるリスクがあります。採用担当者は資格の数より「その資格を使って何をしたいか」を評価します。資格ラッシュより「1〜2つの核となる資格を深掘りし、実務経験を積む」ほうがキャリアアップには有効です。ただし、ダブルライセンスで業務の幅が広がる組み合わせ（社労士+中小企業診断士等）は戦略的に有効です。' }
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

  'gyousei-vs-shakushi': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">行政書士 vs 社労士 基本比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          行政書士と社労士は、どちらも独立開業できる人気の国家資格です。扱う業務領域が異なり、目指すキャリアによって適した資格が変わります。まず基本スペックを確認しましょう。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">比較項目</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">行政書士</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">社労士</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['試験月', '11月（年1回）', '8月（年1回）'],
                ['合格率', '10〜13%', '6〜7%'],
                ['必要勉強時間', '500〜800時間', '700〜1000時間'],
                ['受験資格', 'なし（誰でも受験可）', '学歴・実務経験あり'],
                ['主な業務', '許認可申請・契約書作成', '労働・社会保険手続き'],
                ['独立開業', 'しやすい', 'しやすい'],
                ['企業内資格価値', '中程度', '高い（人事・総務部門）'],
                ['平均年収（独立）', '300〜600万円', '400〜700万円'],
              ].map(([item, gyousei, shakushi]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="border border-gray-200 px-3 py-2 font-medium text-gray-700">{item}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-800">{gyousei}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-800">{shakushi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">業務内容の違い</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3">行政書士の主な仕事</p>
            <ul className="space-y-2">
              {[
                '建設業許可・風俗営業許可などの許認可申請',
                '会社設立・定款作成の手続き',
                '在留資格（ビザ）申請の代行',
                '遺言書・相続関連の書類作成',
                '農地転用許可・産廃業許可など行政手続き',
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-slate-400 shrink-0">▸</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3">社労士の主な仕事</p>
            <ul className="space-y-2">
              {[
                '労働保険・社会保険の手続き代行',
                '就業規則・賃金規程の作成・改定',
                '助成金申請サポート',
                '労働相談・人事コンサルティング',
                '年金・健康保険の相談・手続き',
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-slate-400 shrink-0">▸</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">どちらを先に取るべき？目的別の選び方</h2>
        <div className="space-y-3">
          {[
            { title: '企業に勤めながら資格を活かしたい → 社労士が有利', body: '社労士は人事・総務・労務管理部門での評価が高く、昇進・昇給・転職に直結します。企業内での活躍を目指す場合は社労士を優先しましょう。企業での実務経験を積みながら独立開業の準備もできます。' },
            { title: '独立・開業を早く実現したい → 行政書士から始める', body: '受験資格がなく（社労士は学歴・実務経験が要る）、比較的難易度がやや低めの行政書士から先に取得するのが現実的です。開業後に社労士も取得すると業務の幅が大きく広がります。' },
            { title: '両方取りたい場合は行政書士→社労士の順番', body: '行政書士と社労士はダブルライセンスで相乗効果が高く（会社設立＋就業規則整備など）、行政書士の知識が社労士試験の社会保険科目の理解を助けます。行政書士→社労士の順が一般的です。' },
            { title: '勉強時間が少ない方は行政書士から', body: '合格率・必要勉強時間ともに行政書士の方が取り組みやすく、社労士は受験資格の縛りもあります。まず行政書士で国家試験合格の経験を積むことが、社労士へのステップになります。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">行政書士・社労士の通信講座比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">講座名</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">行政書士</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">社労士</th>
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['スタディング', '49,500円〜', '74,800円〜', 'スマホ完結・コスパ最良'],
                ['フォーサイト', '54,800円〜', '78,800円〜', '合格率が業界平均の3〜5倍'],
                ['アガルート', '80,000円〜', '107,800円〜', '合格特典・充実サポート'],
                ['クレアール', '59,000円〜', '87,000円〜', '非常識合格法・効率学習'],
                ['LEC', '88,000円〜', '120,000円〜', '老舗・教室通学も選べる'],
              ].map(([name, gyousei, shakushi, feature]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="border border-gray-200 px-3 py-2 font-medium text-gray-800">{name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{gyousei}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{shakushi}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 料金は最安コースの参考価格です。最新情報は各公式サイトでご確認ください。</p>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 mb-3">行政書士・社労士対応の通信講座を比較する</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'スタディング', slug: 'studying' },
            { name: 'フォーサイト', slug: 'foresight' },
            { name: 'アガルート', slug: 'agaroot' },
            { name: 'クレアール', slug: 'crecer' },
            { name: 'LEC', slug: 'lec' },
          ].map(({ name, slug }) => (
            <Link key={slug} href={`/courses/${slug}`} className="text-sm border border-slate-300 bg-white text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {name}の詳細を見る →
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '行政書士と社労士はどちらが独立開業に向いていますか？', a: 'どちらも独立型の資格ですが、業務の特性が異なります。行政書士は許認可（建設業・飲食店・在留資格等）の書類作成が主で、新規開業・外国人雇用が増える分野で需要があります。社労士は人事・労務・助成金で、中小企業を顧問先として持つスタイルが主流。顧問先数を増やすことで安定収入が見込める社労士のほうが、開業後の収入安定化がしやすいという意見もあります。' },
            { q: '行政書士と社労士のダブルライセンスのメリットは何ですか？', a: '行政書士は会社設立・建設業許可等の行政手続、社労士は就業規則・社会保険手続と業務が補完的で、一つの会社の設立から経営サポートまでワンストップで対応できます。顧問先からの信頼度が上がり、単価アップにつながるケースが多い。ただし両方の取得は合計学習時間1,500〜2,000時間以上が必要で、年単位の計画が必要です。' },
            { q: '行政書士・社労士とも通信講座でゼロから合格できますか？', a: 'できます。特に社労士はスタディング・アガルート・フォーサイトで合格者を多数輩出しています。行政書士もアガルート・スタディングが合格実績を公表。両資格とも合格率10%前後と難関ですが、通信講座の効率的なカリキュラムで独学より短期合格を目指しやすくなっています。まずは無料体験を利用して学習スタイルが自分に合うか確認しましょう。' }
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

  'takken-dokusha-vs-tsushin': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建試験の概要と独学・通信講座それぞれの特徴</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          宅地建物取引士（宅建）は不動産業界で唯一の国家資格で、合格率は例年15〜17%程度。
          独学でも合格できる試験ですが、学習時間は200〜400時間が目安とされています。
          独学か通信講座かを選ぶ際は、自分の「自己管理力」「予算」「残り時間」で判断しましょう。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">比較項目</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">独学</th>
                <th className="text-left py-2 text-gray-600 font-semibold">通信講座</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['費用', '1〜3万円（テキスト代のみ）', '2〜15万円（給付金活用で実質負担軽減）'],
                ['合格率（目安）', '10〜13%前後', '20〜30%前後（講座による）'],
                ['学習期間', '6〜12ヶ月（自己管理次第）', '3〜6ヶ月（カリキュラム通りに進める）'],
                ['サポート', 'なし', '質問対応・添削・模試など'],
                ['挫折リスク', '高い（自己管理が必要）', '低い（ペース配分をサポート）'],
                ['向いている人', '自己管理が得意・費用を最小化したい', '短期合格・初受験・再受験の方'],
              ].map(([item, dokugaku, tsushin]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{item}</td>
                  <td className="py-2 pr-4 text-gray-600">{dokugaku}</td>
                  <td className="py-2 text-gray-600">{tsushin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">独学をおすすめできる人・できない人</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-slate-800 rounded-xl p-5">
            <p className="font-bold text-slate-800 mb-3 text-sm">独学が向いている人</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                '試験まで6ヶ月以上の時間がある',
                '毎日2〜3時間の学習時間を確保できる',
                '費用を1〜3万円程度に抑えたい',
                '過去に資格試験の独学経験がある',
                '宅建業法や法律系の知識がある程度ある',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3 text-sm">通信講座が向いている人</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                '初めて宅建を受験する（法律知識がない）',
                '仕事が忙しく学習時間が不規則',
                '前回不合格で今度こそ確実に受かりたい',
                '給付金を使って費用を抑えたい',
                '質問できる環境・添削サービスが欲しい',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">宅建通信講座おすすめ3選</h2>
        <div className="space-y-4">
          {[
            {
              name: 'フォーサイト',
              slug: 'foresight',
              price: '28,600円〜（宅建合格対策講座）',
              pass: '全国平均の3.3倍（2024年度）',
              feature: '合格率重視',
              point: '合格率実績が業界トップクラス。フルカラーテキスト・動画・問題演習・バジェット式スケジュール管理で短期合格をサポート。教育訓練給付金（一般）対象。',
            },
            {
              name: 'スタディング',
              slug: 'studying',
              price: '10,780円〜（宅建合格コース）',
              pass: '合格者多数輩出（合格率非公開）',
              feature: '最安値クラス',
              point: 'スマホだけで完結する最安値クラスの通信講座。動画・問題演習・AI復習機能をアプリで一括管理。時間がない社会人・コスト重視の方に最適。',
            },
            {
              name: 'LEC東京リーガルマインド',
              slug: 'lec',
              price: '60,000円〜',
              pass: '高い（詳細は公式サイト参照）',
              feature: '質問・サポート充実',
              point: '司法試験・行政書士など法律系資格のプロ講師陣による宅建講座。質問し放題・模試多数・過去問解説が充実。難関試験対策としての品質が高い。',
            },
          ].map(({ name, slug, price, pass, feature, point }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-gray-900">{name}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">{feature}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
                <div><span className="text-gray-500">合格率: </span><span className="font-medium text-gray-800">{pass}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/courses/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載している合格率・費用は参考値です。最新情報は各講座公式サイトでご確認ください。給付金の適用条件はハローワークでご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '宅建を独学で合格するのに何年かかりますか？', a: '初学者の場合、独学では1〜2年かかるケースが多いです（合格率15〜18%の難関資格のため）。通信講座を活用すると約6〜10ヶ月での合格を目指しやすくなります。独学での不合格率が高い理由として「法改正への対応が遅れる」「どこに注力すべきか分からない」の2点が挙げられます。通信講座では最新の法改正対応・過去問分析が反映されたカリキュラムを使えます。' },
            { q: '宅建の過去問は何年分解けばいいですか？', a: '少なくとも10年分（計4肢択一×50問×10年＝500問）を繰り返し解くことが推奨されています。宅建の合格ラインは総得点の約70〜75%（35〜38点/50点）で、過去問の繰り返しで解法パターンが身につきます。通信講座では過去問データベースと正答率分析機能があり、弱点分野への集中学習が可能です。' },
            { q: '宅建の通信講座費用で最もコスパが良いのはどこですか？', a: 'スタディング（39,600円〜）が最安値クラスで、スマホ完結型の学習UIが高評価です。合格率も全国平均を上回るデータが公表されています。フォーサイト（62,800円〜）は合格率が業界最高水準と公表しており、確実に合格したい方に人気。給付金対応講座を選べば実質負担を大幅に減らせます。まずは各社の無料体験・資料請求で比較してみてください。' }
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

  'fp-2kyu-3kyu-chigai': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">FP2級と3級の違いを一覧で比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          FP（ファイナンシャルプランナー）技能士は3・2・1級の3段階があります。
          就職・転職・副業で活かすなら2級以上が実用的とされますが、初学者は3級から始めるのが一般的です。
          2級と3級の主な違いを以下にまとめます。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">比較項目</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">FP3級</th>
                <th className="text-left py-2 text-gray-600 font-semibold">FP2級</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['試験実施機関', '日本FP協会 / きんざい', '日本FP協会 / きんざい'],
                ['受験資格', '誰でも受験可能', 'FP3級合格 or 実務経験2年以上'],
                ['合格率', '80〜90%前後', '40〜60%前後'],
                ['学習時間（目安）', '100〜150時間', '200〜300時間'],
                ['試験料', '4,000〜6,000円', '8,000〜11,700円'],
                ['就職・転職での評価', '入門資格（実務では低い）', '実務で評価される最低ライン'],
                ['副業・独立', 'FP相談業務はできない', '法人・個人向けFP業務が可能'],
              ].map(([item, fp3, fp2]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{item}</td>
                  <td className="py-2 pr-4 text-gray-600">{fp3}</td>
                  <td className="py-2 text-gray-600">{fp2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">あなたに向いているのはどっち？</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-slate-800 rounded-xl p-5">
            <p className="font-bold text-slate-800 mb-3 text-sm">FP3級から始める方が良い人</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'FPを初めて学ぶ完全初心者',
                '家計・税金・保険の基礎知識を身につけたい',
                '2級受験のための基礎固めをしたい',
                '試験まで3ヶ月程度しかない',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3 text-sm">FP2級から始めても良い人</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                '金融・保険業界などで実務経験がある',
                '転職・就職活動でFP2級が必要とされている',
                'FP3級を既に取得済み',
                '短期間で2級まで一気に合格したい',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">FP2・3級の通信講座おすすめ比較</h2>
        <div className="space-y-4">
          {[
            {
              name: 'スタディング',
              slug: 'studying',
              price: 'FP3級: 3,850円〜 / FP2級: 6,050円〜',
              pass: '合格者多数（合格率非公開）',
              point: '最安値クラスで3・2級セットコースも充実。スマホ完結型で隙間時間に学習可能。通勤・昼休みに動画講義と問題演習を組み合わせて学べる。',
            },
            {
              name: 'フォーサイト',
              slug: 'foresight',
              price: 'FP2・3級セット: 38,800円〜',
              pass: '全国平均の1.5〜2倍前後',
              point: 'バジェット式カリキュラムで合格に必要なポイントに絞った学習。フルカラーテキスト・動画・模試がセットになったコスパの良いパックが充実。',
            },
            {
              name: 'アガルート',
              slug: 'agaroot',
              price: 'FP2級: 16,280円〜',
              pass: '高い（詳細は公式サイト参照）',
              point: '動画講義の質が高く合格率実績も堅調。FP2級に集中した効率的な学習が可能。無料体験授業・全額返金合格保証あり。',
            },
          ].map(({ name, slug, price, pass, point }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-bold text-gray-900 mb-2">{name}</p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
                <div><span className="text-gray-500">合格率: </span><span className="font-medium text-gray-800">{pass}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/courses/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載している合格率・試験情報は参考値です。最新の試験日程・受験料は日本FP協会・きんざいの公式サイトでご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'FP3級から2級へのステップアップは何ヶ月必要ですか？', a: '3級合格直後から学習を継続した場合、2〜4ヶ月で2級受験準備が整うケースが多いです。3級の基礎知識があるため積み上げ学習が可能。通信講座の3級+2級セットなら、効率的なカリキュラムで合計5〜7ヶ月での両方合格を目指せます。3級と2級の試験は同日に開催されることはないため、スケジュール管理が重要です。' },
            { q: 'FP2級を持っていると就職・転職でどんな評価を得られますか？', a: '金融（銀行・証券・保険）・不動産・FPコンサルタント職では採用で高く評価されます。また、一般企業の経理・財務・人事部門でも「金融知識がある人材」として差別化できます。FP2級以上は履歴書の資格欄で「金融知識の証明」として機能し、FP1級・CFPは独立開業・相談業務の信頼性向上に有効です。' },
            { q: 'FP試験はCBT（コンピュータ試験）になりましたか？', a: '2023年度よりFP3級・2級の学科・実技試験が一部CBT方式で実施されています（日本FP協会・きんざいどちらも）。年複数回受験可能になり、試験の自由度が上がっています。通信講座のカリキュラムもCBT方式に対応したものを選ぶとスムーズです。試験日程・会場はFP協会公式サイトでご確認ください。' }
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

  'chuusho-shindan-shi-tsushin-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">中小企業診断士の試験概要</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          中小企業診断士は、中小企業の経営課題に対して診断・助言を行う国家資格です。
          一次試験（7科目・マーク式）と二次試験（4科目・記述式＋口述）の2段階で構成され、
          合格率は一次試験30〜40%・二次試験18〜20%・最終合格は約4〜5%と難関資格です。
          合格までの学習時間は1,000〜1,500時間が目安とされています。
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
          <p className="font-semibold text-gray-800 mb-2 text-sm">試験概要</p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: '一次試験科目数', value: '7科目（経済・財務・企業経営論など）' },
              { label: '二次試験', value: '4事例（筆記）+ 口述試験' },
              { label: '一次試験合格率', value: '30〜40%（年によって変動）' },
              { label: '最終合格率', value: '約4〜5%' },
              { label: '学習時間（目安）', value: '1,000〜1,500時間' },
              { label: '試験実施月', value: '一次：8月 / 二次：10月' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-lg p-2 border border-gray-100">
                <p className="text-gray-500 mb-0.5">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">中小企業診断士 通信講座 比較</h2>
        <div className="space-y-4">
          {[
            {
              name: 'スタディング',
              slug: 'studying',
              price: '56,800円〜（一次・二次対策コース）',
              pass: '合格者多数（合格率非公開）',
              period: '12〜18ヶ月',
              feature: '最安値クラス',
              point: '業界最安値クラス。スマホ完結型でAI学習機能で効率的に弱点克服。一次試験の7科目をまとめて対策できるセットコースが充実。',
            },
            {
              name: 'アガルート',
              slug: 'agaroot',
              price: '148,000円〜（総合コース）',
              pass: '高い実績（詳細は公式参照）',
              period: '12〜18ヶ月',
              feature: '合格率重視',
              point: '二次試験の事例演習・添削が充実。合格時の全額返金制度あり。動画講義の品質が高く、独学では理解しにくい二次試験（事例問題）の対策に強い。',
            },
            {
              name: 'TAC',
              slug: 'tac',
              price: '278,000円〜（一次二次総合コース）',
              pass: '高い合格実績',
              period: '12〜24ヶ月',
              feature: '質問サポート充実',
              point: '中小企業診断士対策の老舗スクール。講師陣の質と二次試験対策のノウハウが豊富。教育訓練給付金の対象講座あり。オンラインと通学の選択が可能。',
            },
            {
              name: 'クレアール',
              slug: 'crecer',
              price: '149,000円〜（一次二次合格コース）',
              pass: '高い（詳細は公式参照）',
              period: '12〜18ヶ月',
              feature: '非常識合格法',
              point: '「非常識合格法」で頻出範囲に絞った効率的な学習が可能。二次試験の添削サービスが充実しており、記述式問題の改善が着実に進む。',
            },
          ].map(({ name, slug, price, pass, period, feature, point }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-gray-900">{name}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">{feature}</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 text-xs mb-3">
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
                <div><span className="text-gray-500">合格: </span><span className="font-medium text-gray-800">{pass}</span></div>
                <div><span className="text-gray-500">期間: </span><span className="font-medium text-gray-800">{period}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/courses/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">中小企業診断士の取得メリット</h2>
        <div className="space-y-3">
          {[
            { title: 'コンサルタント・独立開業が可能', body: '中小企業診断士は独占業務はないが、経営コンサルタントとしての独立・副業が可能です。中小企業向けの経営相談・補助金申請支援・事業計画書作成など幅広い業務で需要があります。' },
            { title: '大企業・金融機関での評価が高い', body: '金融機関・コンサルティング会社・商社などで評価される資格。企業内診断士として社内コンサルタント的な役割を担う方も多い。昇格・評価で有利に働くことが多い。' },
            { title: '経営知識が体系的に身につく', body: '財務・マーケティング・生産管理・IT・経済など経営に必要な知識を一通り学べる。MBAに近い学習内容を資格取得という形で達成できる点も人気の理由。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載している合格率・費用は参考値です。最新の試験情報は中小企業診断協会の公式サイトでご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '中小企業診断士の通信講座と大手資格予備校（TACやLEC）の違いは何ですか？', a: '大手予備校（TAC・LEC）は対面授業・質問対応・答練（模擬試験）が充実していますが、費用が20〜30万円程度と高め。通信講座（スタディング・アガルート）はスマホ完結で費用が6〜15万円程度と安く、スキマ時間学習に優れています。「独学より効率的に、予備校より安く」という方には通信講座が最適な選択肢です。' },
            { q: '中小企業診断士の2次試験は記述式ですが、通信講座でも対策できますか？', a: '対応しています。アガルートやTACの通信講座では2次試験の事例問題（4事例）の解き方・答案作成のフレームワークを動画で学べます。また模範答案の添削サービス付き講座もあります。スタディングはコスパが高い反面、2次試験の添削対応が限定的なため、2次試験対策は他社の答練と組み合わせる方法も有効です。' },
            { q: '中小企業診断士は合格後に実務補習が必要ですか？', a: 'はい、試験合格後に15日間の「実務補習」（または実務従事）が必要です。実務補習は中小企業診断協会が実施する中小企業へのコンサルティング実習で、費用は約50,000円程度。実務補習を修了すると「中小企業診断士」として正式登録されます。試験合格だけでは「診断士」を名乗れない点は入学前に把握しておきましょう。' }
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

  'kango-fukushi-shikaku-tsushin': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">介護・福祉系の国家資格一覧</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          介護・福祉の分野には複数の国家資格があり、それぞれ役割と対象者が異なります。
          社会人が通信講座で取得を目指せる主な資格を一覧で確認しましょう。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">資格名</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">合格率</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">学習時間</th>
                <th className="text-left py-2 text-gray-600 font-semibold">活躍の場</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ケアマネージャー（介護支援専門員）', '約20%', '200〜400時間', 'ケアプラン作成・相談窓口'],
                ['介護福祉士（国家資格）', '約70%', '300〜500時間', '介護施設・訪問介護'],
                ['社会福祉士（国家資格）', '約30%', '400〜600時間', '相談・支援業務全般'],
                ['介護職員初任者研修', 'ほぼ100%', '130時間', '入門資格・就職に有利'],
                ['実務者研修', 'ほぼ100%', '450時間', '介護福祉士受験の必須要件'],
              ].map(([name, pass, time, use]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{name}</td>
                  <td className="py-2 pr-4 text-gray-600">{pass}</td>
                  <td className="py-2 pr-4 text-gray-600">{time}</td>
                  <td className="py-2 text-gray-600">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">介護・福祉系資格の通信講座おすすめ</h2>
        <div className="space-y-4">
          {[
            {
              name: 'ニチイ学館',
              slug: 'nichiiko-gakkan',
              target: '介護職員初任者研修・介護福祉士',
              price: '89,000円〜（初任者研修）',
              feature: '就職支援充実',
              point: '介護業界で最大手の研修機関。全国に教室があり通信+通学のハイブリッド型。受講修了後の就職支援も強く、ニチイグループへの就職ルートもある。',
            },
            {
              name: 'ユーキャン',
              slug: 'yukiyukan',
              target: '介護福祉士・社会福祉士・ケアマネ',
              price: '54,000円〜（介護福祉士コース）',
              feature: '教材の分かりやすさ',
              point: '通信講座の大手で教材の分かりやすさに定評あり。テキスト・動画・添削がセットになった充実のコースが揃う。教育訓練給付金の対象講座も多い。',
            },
            {
              name: 'キャリアカレッジジャパン',
              slug: 'career-college-japan',
              target: '介護職員初任者研修・ケアマネ対策',
              price: '29,700円〜（初任者研修）',
              feature: 'コスパ',
              point: '受講料が比較的リーズナブルで通信メインの学習スタイル。仕事・育児と並行しながら自分のペースで学べる。介護初任者研修から介護福祉士まで段階的に取得できる。',
            },
          ].map(({ name, slug, target, price, feature, point }) => (
            <div key={slug} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-gray-900">{name}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">{feature}</span>
              </div>
              <div className="text-xs mb-3 space-y-1">
                <div><span className="text-gray-500">対応資格: </span><span className="font-medium text-gray-800">{target}</span></div>
                <div><span className="text-gray-500">費用: </span><span className="font-medium text-gray-800">{price}</span></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{point}</p>
              <Link href={`/courses/${slug}`} className="inline-block text-sm border border-slate-300 bg-white text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {name}の詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">介護・福祉系資格の取得メリット</h2>
        <div className="space-y-3">
          {[
            { title: '未経験からでも就職・転職できる', body: '介護職員初任者研修は未経験者でも短期間（130時間）で取得でき、資格取得後すぐに介護施設への就職・転職が可能です。人材不足の業界のため採用率が高い傾向があります。' },
            { title: '女性・主婦の再就職に強い', body: '介護・福祉系は女性が多く活躍する業界。育休・産休明けや子育て後の再就職でも受け入れが積極的。ニチイ学館などは就職支援まで一貫してサポートしてくれます。' },
            { title: '資格手当・給与アップが期待できる', body: '介護福祉士・ケアマネジャーなどの上位資格を取得すると資格手当（月1〜5万円程度）が付くことが多く、給与アップが期待できます。キャリアアップを考えるなら段階的な資格取得が有効です。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載している費用・合格率は参考値です。最新の試験情報・受験要件は社会福祉振興・試験センター等の公式サイトでご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '介護福祉士と社会福祉士の違いは何ですか？', a: '介護福祉士は「介護の実践者」で、高齢者・障害者の身体介護・生活支援が主な業務。社会福祉士は「福祉の相談援助専門職」で、福祉施設・病院の相談員・ケースワーカーとして支援計画の立案・調整を担います。どちらも国家資格。介護福祉士は実務経験（3年）+研修後に試験受験、社会福祉士は大学の指定科目修了または通信教育での受験資格取得が一般的です。' },
            { q: '介護・福祉系の資格は通信講座だけで取れますか？', a: '取れる資格と取れない資格があります。社会福祉士・精神保健福祉士は通信制大学+通信講座の組み合わせで受験資格を取得できます。介護福祉士は実務経験3年が必須条件で、通信講座だけでは取れません。ホームヘルパー（訪問介護員）養成研修は通信+実技研修の組み合わせで取得可能です。まず目指す資格の受験資格を確認してください。' },
            { q: '介護・福祉系の資格を取ると年収はどのくらいになりますか？', a: '介護職員（介護福祉士取得後）の平均年収は320〜380万円程度。社会福祉士（相談援助職）は300〜450万円。ケアマネジャー（ケアマネ）は350〜450万円程度です。管理職・施設長になると500万円以上も可能です。給与水準は施設種別（特別養護老人ホーム・グループホーム・障害者施設）によっても差があります。処遇改善加算制度により介護職の給与は年々上昇傾向にあります。' }
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

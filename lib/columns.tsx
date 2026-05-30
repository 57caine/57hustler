import Link from 'next/link';

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
};

export const columns: ColumnMeta[] = [
  {
    slug: 'dosu-mikata',
    title: 'コンタクトレンズの度数（PWR）の見方・読み方を徹底解説',
    description: 'PWR・BC・DIAとは何か、処方箋の読み方から乱視用のCYL・AXISまでわかりやすく解説。通販で正しく選ぶための基礎知識。',
    category: '度数・処方箋',
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-28',
    readingTime: 7,
  },
  {
    slug: 'shohosen-nashi-tsuuhan',
    title: '処方箋なしでコンタクトレンズを通販購入できる？正しい買い方ガイド',
    description: '「処方箋なしでネット購入できるの？」という疑問に回答。法律上の扱いと安全な購入方法、おすすめ通販ショップを紹介。',
    category: '購入ガイド',
    publishedAt: '2026-05-05',
    updatedAt: '2026-05-28',
    readingTime: 6,
  },
  {
    slug: 'hajimete-erabikata',
    title: '初めてコンタクトレンズを選ぶ方法【種類・価格・手順を全解説】',
    description: '1day・2week・monthlyの違い、初心者におすすめの種類、価格の目安、購入手順まで。コンタクト初心者向け完全ガイド。',
    category: '購入ガイド',
    publishedAt: '2026-05-10',
    updatedAt: '2026-05-28',
    readingTime: 8,
  },
  {
    slug: 'kanso-shinikui-contact',
    title: '目が乾きにくいコンタクトレンズおすすめ7選【乾燥が気になる人向け】',
    description: '長時間装用でも目が乾きにくいコンタクトレンズを厳選。素材・含水率の選び方から、乾燥対策まで詳しく解説。',
    category: '商品比較',
    publishedAt: '2026-05-15',
    updatedAt: '2026-05-28',
    readingTime: 7,
  },
  {
    slug: 'ranshi-contact-erabikata',
    title: '乱視用コンタクトレンズの選び方【軽度・中等度別おすすめ】',
    description: '乱視の度数（CYL）・軸度（AXIS）の意味から、乱視用ワンデー・2weekの選び方まで徹底解説。軽度・中等度別におすすめ商品も紹介。',
    category: '商品比較',
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-28',
    readingTime: 7,
  },
  {
    slug: 'contact-kakaku-hikaku-2024',
    title: 'コンタクトレンズ通販サイト価格比較【2026年版・送料込み最安値】',
    description: 'レンズクイック・アットレンズ・24lensなど主要24ショップの特徴と価格帯を比較。まとめ買い割引・送料無料条件も詳しく解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-19',
    updatedAt: '2026-05-28',
    readingTime: 5,
  },
  {
    slug: 'acuvue-zenkindai-hikaku',
    title: 'アキュビュー全種類の違いを比較【どれが自分に合う？】',
    description: 'アキュビュー オアシス・モイスト・トゥルーアイなど全ラインナップの違いを徹底比較。目の乾き・装用時間・価格で選ぶポイントを解説。',
    category: '商品比較',
    publishedAt: '2026-05-20',
    updatedAt: '2026-05-28',
    readingTime: 8,
  },
  {
    slug: 'colorcl-hajimete-guide',
    title: 'カラコン初心者ガイド【自然に見える選び方・安全な使い方】',
    description: '初めてカラコンを選ぶ方向けに、自然に見えるカラーの選び方、度あり・度なしの違い、安全な使い方を解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-21',
    updatedAt: '2026-05-28',
    readingTime: 6,
  },
  {
    slug: 'contact-kaigai-vs-kokunai',
    title: 'コンタクトレンズ 海外製 vs 国産の違いは？選ぶポイント',
    description: 'アキュビュー（アメリカ）、シード・メニコン（日本）など国産・海外製の違いを比較。品質・価格・入手しやすさの観点から解説。',
    category: '商品比較',
    publishedAt: '2026-05-22',
    updatedAt: '2026-05-28',
    readingTime: 5,
  },
  {
    slug: 'contact-maintenance',
    title: 'コンタクトレンズのケア方法【2week・マンスリーの正しい洗い方】',
    description: '2週間・マンスリーコンタクトの正しいケア方法。洗浄液の選び方、保存方法、NGな行為をわかりやすく解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-23',
    updatedAt: '2026-05-28',
    readingTime: 6,
  },
  {
    slug: 'silicon-hydrogel-merit',
    title: 'シリコーンハイドロゲルコンタクトとは？通常素材との違いと選ぶメリット',
    description: '高酸素透過率のシリコーンハイドロゲル素材のメリット・デメリットを解説。長時間装用・PC作業が多い人におすすめの理由とは。',
    category: '商品比較',
    publishedAt: '2026-05-24',
    updatedAt: '2026-05-28',
    readingTime: 6,
  },
  {
    slug: 'contact-nenkan-cost',
    title: 'コンタクトレンズの年間コストを比較【1day vs 2week vs monthly】',
    description: '1日使い捨て・2週間・マンスリーの年間コストをケア用品込みで比較。生活スタイル別に最もコスパが良い選択肢を提案。',
    category: '購入ガイド',
    publishedAt: '2026-05-25',
    updatedAt: '2026-05-28',
    readingTime: 5,
  },
  {
    slug: 'contact-tsuuhan-osusume-shop',
    title: 'コンタクトレンズ通販おすすめショップ10選【送料・価格・処方箋不要条件で比較】',
    description: 'アットレンズ・レンズゼロ・レンズクイックなど人気10ショップを送料・最安値・処方箋不要条件で徹底比較。初めての通販でも安心して選べる。',
    category: '購入ガイド',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
  },
  {
    slug: 'acuvue-oasys-1day-review',
    title: 'ワンデーアキュビューオアシス 評判・最安値【乾きにくさNo.1の実力を検証】',
    description: 'ワンデーアキュビューオアシスの特徴・使い心地・実際の口コミを徹底検証。最安値ショップと処方箋不要で買える店もあわせて紹介。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
  },
  {
    slug: 'bifocal-multifocal-contact',
    title: '遠近両用コンタクトレンズ 選び方ガイド【老眼・40代・老視の方へ】',
    description: '老眼鏡なしで近くも遠くも見える遠近両用コンタクト。種類の違い・装用感・おすすめ商品を解説。初めて遠近両用を使う方向け完全ガイド。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
  },
  {
    slug: '2week-contact-osusume',
    title: '2ウィークコンタクトおすすめ5選【2025年版・コスパ最強を徹底比較】',
    description: 'アキュビューオアシス・バイオフィニティ・プロクリアなど人気2weekコンタクトを徹底比較。価格・酸素透過率・乾燥感を基準にコスパ最強を選ぶ方法を解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
  },
  {
    slug: 'monthly-contact-hikaku',
    title: 'マンスリーコンタクトレンズ比較【2025年版・1枚あたりの最安値ランキング】',
    description: 'バイオフィニティ・エアオプティクス・クラリティなどマンスリーコンタクト人気商品の価格・酸素透過率・うるおいを比較。1ヶ月使い捨てのメリットと選び方も解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 6,
  },
  {
    slug: 'colorcon-ranking-2025',
    title: 'カラコン人気ランキング2025【ナチュラル系・盛り系・度あり別おすすめ】',
    description: '2025年おすすめカラコンをナチュラル・盛り系・度ありで分けてランキング。GEOベラ・アキュビュー ディファイン・フレッシュルックなど人気商品を徹底比較。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
  },
  {
    slug: 'ranshi-contact-ranking-2025',
    title: '乱視用コンタクトレンズ おすすめランキング2025【ワンデー・2week・マンスリー別】',
    description: '乱視（CYL・AXIS）に対応したトーリックコンタクトのおすすめを種類別にランキング。アキュビュー オアシス乱視用・デイリーズ トータルワン乱視用など人気商品を比較。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
  },
  {
    slug: 'contact-chouji-so',
    title: '長時間装用向けコンタクトレンズ おすすめ5選【PC作業・残業が多い方へ】',
    description: '1日10時間以上コンタクトを使う方向けに、乾きにくく酸素透過率が高いコンタクトを厳選。シリコーンハイドロゲル素材の選び方と長時間装用のコツも解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 6,
  },
  {
    slug: 'dailies-total1-vs-oasys',
    title: 'デイリーズ トータルワン vs アキュビュー オアシス 徹底比較【どっちが良い？】',
    description: 'コンタクト最高峰2製品「デイリーズ トータルワン」と「アキュビュー オアシス 1day」を乾きにくさ・装用感・価格・素材スペックで徹底比較。あなたにはどちらが向いているかを解説。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
  },
  {
    slug: 'contact-dryeye-osusume',
    title: 'ドライアイ向けコンタクトレンズ おすすめランキング【目が乾く方必見】',
    description: 'ドライアイや目の乾燥が気になる方向けに、乾きにくいコンタクトレンズを厳選ランキング。シリコーンハイドロゲル素材・高含水タイプ・目薬との組み合わせ方も解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
  },
  {
    slug: 'contact-tsuhan-shop-hikaku',
    title: 'コンタクトレンズ通販おすすめショップ比較【2026年版・最安値24店舗】',
    description: 'レンズクイック・アットレンズ・24Lens・シンシアなどコンタクト通販の主要24店舗を価格・送料・配送速度・処方箋対応で比較。初めての通販でも安心な選び方ガイド。',
    category: '購入ガイド',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 9,
  },
  {
    slug: 'acuvue-moist-vs-oasys-chigai',
    title: 'アキュビュー モイスト vs アキュビュー オアシス 違いを徹底比較【どっちを選ぶ？】',
    description: 'アキュビューの定番2モデル「モイスト」と「オアシス」の違いを乾きにくさ・価格・酸素透過率・素材で比較。用途・予算別にどちらが合うか選び方を解説します。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
  },
  {
    slug: 'contact-2week-osusume',
    title: '2weekコンタクトレンズ おすすめランキング2026年版【コスパ・乾きにくさ別】',
    description: 'アキュビュー オアシス・シード 2ウィークピュア・バイオフィニティなど人気2weekコンタクト7選を比較。コスパ重視・乾きにくさ重視・乱視用など目的別のおすすめをランキング形式で解説。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 8,
  },
  {
    slug: 'menicon-contact-osusume',
    title: 'メニコン コンタクトレンズ おすすめ比較【1day・2week・マンスリー対応】',
    description: 'メニコンの人気コンタクトレンズを1day・2week・マンスリー別に比較。1monthメニコン・めにサポなど各シリーズの違い、特徴、最安値の調べ方を解説します。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
  },
];

export function getColumnBySlug(slug: string): ColumnMeta | undefined {
  return columns.find((c) => c.slug === slug);
}

export const columnContent: Record<string, React.ReactNode> = {
  'dosu-mikata': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        コンタクトレンズを通販で買うとき、処方箋に書かれた「PWR」「BC」「DIA」などの記号の意味がわからなくて困った経験はありませんか？
        この記事では、コンタクトレンズの度数パラメータの見方を、初めての方にもわかりやすく解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">PWR（度数）とは？</h2>
      <p className="mb-4">
        <strong>PWR（Power）</strong>は、コンタクトレンズの度数を表します。「SPH（Sphere）」と書かれることもあります。
        近視の方はマイナス（－）、遠視の方はプラス（＋）の数値になります。
      </p>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">PWR値</th>
              <th className="text-left p-2">度数の目安</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2">-0.25 〜 -1.00</td><td className="p-2">軽度の近視</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2">-1.25 〜 -3.00</td><td className="p-2">中程度の近視（最も多い）</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2">-3.25 〜 -6.00</td><td className="p-2">強度の近視</td></tr>
            <tr><td className="p-2">-6.25以上</td><td className="p-2">超強度の近視</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2">
        <strong>注意：</strong>眼鏡の度数とコンタクトの度数は異なります。眼鏡の度数をそのままコンタクトに使わず、必ず眼科で処方を受けてください。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">BC（ベースカーブ）とは？</h2>
      <p className="mb-4">
        <strong>BC（Base Curve）</strong>は、レンズの曲率（カーブの大きさ）を表します。単位はmmで、数値が小さいほどカーブがきつく、大きいほど緩やかです。
      </p>
      <p className="mb-4">
        日本人の角膜曲率の平均は<strong>7.7〜8.1mm</strong>程度で、コンタクトレンズのBCは角膜より少し大きめの<strong>8.3〜9.0mm</strong>で設計されています。
        BCが合わないとレンズがずれやすくなったり、目に負担がかかるため、必ず処方されたBCを選びましょう。
      </p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
        <p><strong>主要商品のBC一覧：</strong></p>
        <ul className="mt-2 space-y-1">
          <li>アキュビュー オアシス ワンデー：BC 8.5mm</li>
          <li>1デイ アキュビュー モイスト：BC 8.5mm</li>
          <li>デイリーズ トータルワン：BC 8.5mm</li>
          <li>ワンデーピュア うるおいプラス：BC 8.8mm</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">DIA（直径）とは？</h2>
      <p className="mb-4">
        <strong>DIA（Diameter）</strong>はレンズの直径を表します。通常の透明コンタクトは<strong>13.8〜14.5mm</strong>が一般的です。
        カラーコンタクトには14.5mm以上の大きめサイズもあります（デカ目効果）。
      </p>
      <p className="mb-4">
        同じブランドの商品でもDIAが異なることがありますが、DIAが違っても同じ度数を注文できます。
        ただし、前回と異なるDIAの商品に変更する場合は眼科での確認を推奨します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乱視用のパラメータ（CYL・AXIS）</h2>
      <p className="mb-4">
        乱視がある方のコンタクトレンズには、通常の度数に加えて以下のパラメータがあります。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">CYL（乱視度数）</h3>
          <p className="text-sm text-gray-700">乱視の強さを表す数値。マイナスで表記され、-0.75〜-2.25が一般的な範囲です。</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">AXIS（軸度）</h3>
          <p className="text-sm text-gray-700">乱視の方向（軸の角度）を1〜180度で表します。この数値が違うと見え方が大きく変わります。</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">処方箋の右目・左目の見分け方</h2>
      <p className="mb-4">
        処方箋では右目と左目を以下の略語で区別します：
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li><strong>R（Right）/ OD（Oculus Dexter）</strong>＝右目</li>
        <li><strong>L（Left）/ OS（Oculus Sinister）</strong>＝左目</li>
      </ul>
      <p className="mb-6">
        通販で購入する際は、右目と左目のパラメータを入れ間違えないよう注意してください。
        度数が違う場合は特に重要です。
      </p>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">処方された商品を最安値で購入する</h3>
        <p className="text-slate-300 mb-4">度数がわかったら、当サイトで最安値ショップを比較しましょう。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          人気商品の価格を比較する →
        </Link>
      </div>
    </div>
  ),

  'shohosen-nashi-tsuuhan': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「コンタクトレンズって処方箋がないと通販で買えないの？」という疑問を持つ方は多いです。
        結論から言うと、<strong>薬機法上はコンタクトレンズの購入に処方箋の提示義務はありません</strong>が、眼科での検査を強く推奨します。この記事で詳しく解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コンタクトレンズは「高度管理医療機器」</h2>
      <p className="mb-4">
        コンタクトレンズは<strong>高度管理医療機器（クラスIII）</strong>に分類されており、目に直接触れる医療器具です。
        眼科での処方・定期検査が推奨されていますが、法律上は処方箋の提示なしに購入できます。
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">重要なポイント</p>
        <p className="text-sm mt-1">初めてコンタクトを使う場合や、度数を変更する場合は、必ず眼科を受診してください。目に合わない度数のコンタクトを使い続けると、視力低下や目のトラブルを引き起こす可能性があります。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">通販で安全に購入するための3条件</h2>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
          <div>
            <h3 className="font-bold text-gray-800">初回は眼科で処方を受けている</h3>
            <p className="text-sm text-gray-600 mt-1">初めてコンタクトを作る場合は必ず眼科へ。BC（ベースカーブ）や度数の正確な数値を確認しましょう。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
          <div>
            <h3 className="font-bold text-gray-800">同じ種類・同じ度数を継続購入している</h3>
            <p className="text-sm text-gray-600 mt-1">以前に処方された同一商品を再購入する場合は、通販が便利で経済的です。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
          <div>
            <h3 className="font-bold text-gray-800">定期的に眼科で検査を受けている</h3>
            <p className="text-sm text-gray-600 mt-1">年に1〜2回の定期検査を受けながら通販購入するのが理想的なスタイルです。</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">通販ショップの選び方</h2>
      <p className="mb-4">通販でコンタクトを買う場合は、以下のポイントを確認しましょう。</p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li><strong>高度管理医療機器販売許可を取得しているか</strong>（正規ショップの証）</li>
        <li><strong>日本の正規品を販売しているか</strong>（並行輸入品は注意）</li>
        <li><strong>送料込みの価格で比較する</strong>（送料無料のショップがお得）</li>
        <li><strong>まとめ買い割引があるか</strong>（6箱・8箱セットが安い場合が多い）</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">おすすめ通販ショップの比較</h2>
      <p className="mb-4">
        当サイトでは24店舗のコンタクト通販ショップの価格を毎日比較しています。
        商品によって最安値ショップが異なるため、購入前に必ず比較することをおすすめします。
      </p>
      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">今すぐ最安値を比較する</h3>
        <p className="text-slate-300 mb-4">アキュビュー、デイリーズ、シードなど人気商品の価格を一括比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            ワンデーを比較
          </Link>
          <Link href="/category/2week" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            2週間を比較
          </Link>
          <Link href="/ranking" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            人気ランキングを見る
          </Link>
        </div>
      </div>
    </div>
  ),

  'hajimete-erabikata': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        初めてコンタクトレンズを使いたいけど、種類が多くてどれを選べばいいかわからない…という方向けに、
        ワンデー・2週間・マンスリーの違いから、価格の目安、購入手順まで詳しく解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">まず眼科へ行こう</h2>
      <p className="mb-4">
        コンタクトレンズを初めて使う場合は、必ず<strong>眼科を受診</strong>してください。
        眼科では以下の検査・処方を受けられます：
      </p>
      <ul className="list-disc list-inside mb-6 space-y-1 text-gray-700">
        <li>視力・屈折検査（度数の決定）</li>
        <li>角膜曲率測定（BC値の確認）</li>
        <li>角膜の健康状態チェック</li>
        <li>トライアルレンズの装用体験</li>
        <li>コンタクトの付け外し指導</li>
      </ul>
      <p className="mb-4 bg-green-50 border-l-4 border-green-400 pl-4 py-2 text-sm">
        初診料・検査料は病院により異なりますが、3,000〜5,000円程度が目安です。健康保険が適用されます。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">種類の違いを知ろう</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">ワンデー（1日使い捨て）</h3>
          <p className="text-sm text-gray-700 mb-2">毎日新しいレンズを使う。衛生的で手入れ不要。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ ケア用品が不要</li>
            <li>✓ 旅行・スポーツに便利</li>
            <li>✗ 1日あたりのコスト高め</li>
          </ul>
          <p className="text-sm font-bold text-slate-700 mt-2">月コスト目安：3,000〜8,000円</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">2ウィーク（2週間交換）</h3>
          <p className="text-sm text-gray-700 mb-2">2週間使い続けてから新品に交換。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ ワンデーより経済的</li>
            <li>✓ 酸素透過率が高い製品多い</li>
            <li>✗ 毎日のケアが必要</li>
          </ul>
          <p className="text-sm font-bold text-green-700 mt-2">月コスト目安：2,000〜4,000円</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">マンスリー（1ヶ月交換）</h3>
          <p className="text-sm text-gray-700 mb-2">1ヶ月使い続けてから交換。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ 最もコスパが良い</li>
            <li>✓ ゴミが少ない</li>
            <li>✗ 毎日のケアが必須</li>
          </ul>
          <p className="text-sm font-bold text-purple-700 mt-2">月コスト目安：1,500〜3,000円</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">初心者にはワンデーがおすすめ</h2>
      <p className="mb-4">
        初めてコンタクトを使う方には<strong>ワンデー（1日使い捨て）</strong>を強くおすすめします。理由は3つ：
      </p>
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
        <li><strong>ケア用品が不要</strong>なので、管理が簡単</li>
        <li><strong>毎日新しいレンズ</strong>なので目のトラブルが起きにくい</li>
        <li>万が一合わなくても<strong>翌日からやめられる</strong>リスクが低い</li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">初心者におすすめのワンデーコンタクト</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">人気No.1</span>
            <span className="text-xs text-gray-500">アキュビュー</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">1デイ アキュビュー モイスト</h3>
          <p className="text-xs text-gray-600 mb-2">LACREON技術で乾きを防ぐ。初心者に最も人気。</p>
          <Link href="/product/acuvue-moist-1day" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">コスパ最強</span>
            <span className="text-xs text-gray-500">シード</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">ワンデーピュア うるおいプラス</h3>
          <p className="text-xs text-gray-600 mb-2">国産品質でリーズナブル。コスパを重視する方に。</p>
          <Link href="/product/seed-1day-pure" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">ネット通販での購入の流れ（6ステップ）</h2>
      <div className="space-y-4 mb-6">
        {[
          { step: 1, title: '度数・BCを確認する', desc: '手元の処方箋、または既存のコンタクトケース・箱に記載された度数（PWR）・BC・DIAを確認します。初めての方は必ず眼科を受診して正確なパラメータを取得してください。' },
          { step: 2, title: '商品を選ぶ', desc: '当サイトのカテゴリ別ページやランキングから商品を探します。乾きが気になる方にはシリコーン素材、コスパ重視の方には国産ブランドがおすすめです。' },
          { step: 3, title: 'ショップを比較する', desc: '同じ商品でも通販ショップによって価格が数百円〜1,000円以上異なることがあります。必ず送料込みの合計金額で比較しましょう。当サイトの商品ページで一括比較できます。' },
          { step: 4, title: '注文する', desc: '選んだショップで度数・BC・DIA・右目左目を正確に入力して注文します。入力ミスが最も多いのは左右の入れ間違いです。注文確認画面で必ず確認してください。' },
          { step: 5, title: '商品が到着する', desc: '多くのショップでは最短翌日〜2日で届きます。届いたらパッケージに記載のパラメータが注文通りか確認してから装用してください。' },
          { step: 6, title: '継続購入する', desc: '同じ商品・同じ度数であれば継続して通販購入できます。眼科での定期検査（年1〜2回推奨）を忘れずに。度数が変わった場合は必ず眼科で再処方を受けてください。' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 bg-gray-50 rounded-xl p-4">
            <div className="bg-slate-800 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold flex-shrink-0 text-sm">
              {item.step}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">処方箋について知っておこう</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 mb-2">処方箋が必要なケース</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 初めてコンタクトを使う場合</li>
            <li>• 度数を変更する場合</li>
            <li>• 目に異常・不調がある場合</li>
            <li>• 新しい商品（BC/DIAが変わる）に切り替える場合</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">処方箋が不要なケース（多くのショップ）</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 既に使っている同一商品・同一度数を継続購入する場合</li>
            <li>• 以前に眼科で処方されたパラメータがわかっている場合</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">※ショップによって異なります。購入前にショップの規約をご確認ください。</p>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800 text-sm">重要</p>
        <p className="text-sm text-gray-700 mt-1">薬機法上、コンタクトレンズの購入に処方箋の提示義務はありませんが、目の健康のために定期的な眼科検査を強く推奨します。特に初めての方や度数が変わった方は必ず眼科を受診してください。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">送料を含めた実際のコスト計算例</h2>
      <p className="mb-4 text-gray-700">ショップを比較するときは<strong>送料込みの合計金額</strong>で比較することが重要です。以下の例を参考にしてください。</p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border border-gray-200">ショップ</th>
              <th className="text-right p-3 border border-gray-200">商品価格</th>
              <th className="text-right p-3 border border-gray-200">送料</th>
              <th className="text-right p-3 border border-gray-200 font-bold text-slate-700">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-amber-50 border-b border-gray-200">
              <td className="p-3 border border-gray-200 font-medium">A店（送料330円・3,300円以上無料）</td>
              <td className="p-3 border border-gray-200 text-right">¥2,980</td>
              <td className="p-3 border border-gray-200 text-right">¥330</td>
              <td className="p-3 border border-gray-200 text-right font-bold text-amber-700">¥3,310</td>
            </tr>
            <tr className="bg-green-50 border-b border-gray-200">
              <td className="p-3 border border-gray-200 font-medium">B店（送料330円・2,000円以上無料）</td>
              <td className="p-3 border border-gray-200 text-right">¥3,100</td>
              <td className="p-3 border border-gray-200 text-right text-green-600">送料無料</td>
              <td className="p-3 border border-gray-200 text-right font-bold text-green-700">¥3,100 ✓ 最安</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border border-gray-200 font-medium">C店（送料440円・5,500円以上無料）</td>
              <td className="p-3 border border-gray-200 text-right">¥2,870</td>
              <td className="p-3 border border-gray-200 text-right">¥440</td>
              <td className="p-3 border border-gray-200 text-right font-bold">¥3,310</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-600 mb-6 bg-slate-50 rounded-lg p-3">
        この例では商品価格が最も安いC店（¥2,870）より、送料無料のB店（¥3,100）の方が送料込みでは安くなります。当サイトの価格表では<strong>送料込みの合計金額</strong>を表示しているので、すぐに最安ショップがわかります。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">よくある質問（Q&amp;A）</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            q: '初めてコンタクトを使いたい。どこに行けばいい？',
            a: 'まず眼科を受診してください。「コンタクトレンズを使いたい」と伝えれば、視力検査・BC測定・トライアルレンズの装用体験・付け外し指導まで行ってもらえます。初診料込みで3,000〜5,000円程度が目安です（健康保険適用）。',
          },
          {
            q: '処方箋はいつまで有効？',
            a: '眼科によって異なりますが、一般的には発行から1年以内とされています。ただし、コンタクトの通販購入では処方箋の提示義務がないため、以前の処方内容を確認して同一商品を購入することが多いです。',
          },
          {
            q: '眼鏡の度数とコンタクトの度数は同じ？',
            a: '異なります。眼鏡は目から少し離れた位置に置かれるため、同じ視力を矯正するのに必要な度数がコンタクトと異なります。必ず眼科でコンタクト用の度数を処方してもらってください。',
          },
          {
            q: '左右で度数が違う場合はどうすればいい？',
            a: '左右それぞれの度数（PWR）でコンタクトを注文します。ほとんどの通販ショップでは左右別々の度数を設定して1回で注文できます。注文時の入力ミス（左右の入れ間違い）に注意してください。',
          },
          {
            q: 'まとめ買いとその都度購入、どちらがお得？',
            a: '一般的にまとめ買い（6箱・8箱セット）の方が1箱あたりの価格が安くなります。また、送料無料条件を満たしやすくなるため、送料面でもお得です。ただし、度数が合わなくなるリスクを考えて、無理に大量購入する必要はありません。',
          },
        ].map((item, i) => (
          <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <span className="text-slate-800 font-bold text-sm">Q.</span>
              {item.q}
            </summary>
            <div className="px-4 py-3 text-sm text-gray-700 bg-white">
              <span className="text-green-600 font-bold text-sm">A. </span>{item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">人気ワンデーコンタクトを比較する</h3>
        <p className="text-slate-300 mb-4">初心者におすすめの商品一覧。送料込み最安値ショップがすぐわかります。</p>
        <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          ワンデー全商品を見る →
        </Link>
      </div>
    </div>
  ),

  'kanso-shinikui-contact': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「コンタクトをしていると夕方には目がゴロゴロする」「パソコン作業中に目が乾いてつらい」という悩みを持つ方は多いです。
        この記事では、目が乾きにくいコンタクトレンズの選び方と、おすすめ商品を詳しく紹介します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コンタクトで目が乾く原因</h2>
      <p className="mb-4">コンタクトレンズで目が乾く主な原因は以下の3つです：</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">💧</div>
          <h3 className="font-bold text-gray-800 mb-1">涙液の蒸発</h3>
          <p className="text-xs text-gray-600">レンズが角膜を覆うことで涙の蒸発を促進</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🖥️</div>
          <h3 className="font-bold text-gray-800 mb-1">まばたき減少</h3>
          <p className="text-xs text-gray-600">スマホ・PC使用中はまばたきが通常の1/3以下に</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🌬️</div>
          <h3 className="font-bold text-gray-800 mb-1">環境的要因</h3>
          <p className="text-xs text-gray-600">冷暖房・花粉・乾燥した室内環境</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乾きにくいレンズの選び方</h2>
      <h3 className="text-xl font-bold text-gray-800 mb-3">① 素材で選ぶ</h3>
      <p className="mb-4">
        <strong>シリコーンハイドロゲル</strong>素材は酸素透過率が高く、目への負担が少なくなります。
        酸素不足による目の充血・乾燥感を防ぎます。
      </p>
      <h3 className="text-xl font-bold text-gray-800 mb-3">② 保湿成分で選ぶ</h3>
      <p className="mb-4">
        うるおい成分が配合されたレンズは長時間装用でも乾きにくくなります。代表的な技術：
      </p>
      <ul className="list-disc list-inside mb-6 space-y-1 text-sm text-gray-700">
        <li><strong>LACREON®技術（アキュビュー）</strong>：保湿成分をレンズに閉じ込める</li>
        <li><strong>HydraLuxe™技術（アキュビュー）</strong>：涙液との親和性が高い</li>
        <li><strong>水勾配テクノロジー（デイリーズ）</strong>：表面含水率約99%</li>
        <li><strong>生体模倣技術（バイオトゥルー）</strong>：角膜と同じ含水率78%</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乾きにくいコンタクトおすすめ7選</h2>
      <div className="space-y-4 mb-8">
        {[
          { rank: 1, slug: 'dailies-total1', name: 'デイリーズ トータルワン', brand: 'アルコン', point: '表面含水率約99%の水勾配テクノロジー。乾燥感ゼロに近い究極のうるおい。', badge: '最強うるおい' },
          { rank: 2, slug: 'acuvue-oasys-1day', name: 'アキュビュー オアシス ワンデー', brand: 'アキュビュー', point: 'HydraLuxe™で涙液と一体化。終日快適な装用感が続く。', badge: 'シリコーン素材' },
          { rank: 3, slug: 'biotrue-oneday', name: 'バイオトゥルーワンデー', brand: 'ボシュロム', point: '含水率78%で角膜と同じ水分量。目の負担を最小限に。', badge: '生体模倣技術' },
          { rank: 4, slug: 'acuvue-moist-1day', name: '1デイ アキュビュー モイスト', brand: 'アキュビュー', point: 'LACREON®技術で1日中うるおいをキープ。コスパも良好。', badge: 'コスパ優秀' },
          { rank: 5, slug: 'dailies-aqua-comfort-plus', name: 'デイリーズ アクア コンフォートプラス', brand: 'アルコン', point: '3種類のうるおい成分。まばたきのたびにうるおいを補給。', badge: '保湿成分3種' },
          { rank: 6, slug: 'neo-sight-1day', name: 'ネオサイト ワンデー シリコーン UV', brand: 'シード', point: '国産シリコーンハイドロゲル。高酸素透過率で長時間装用に対応。', badge: '国産シリコーン' },
          { rank: 7, slug: 'clariti-1day', name: 'クラリティ ワンデー', brand: 'クーパービジョン', point: 'シリコーンハイドロゲルでコスパ重視の方に。乾燥しにくい素材。', badge: '高コスパ' },
        ].map((item) => (
          <div key={item.slug} className="border border-gray-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${item.rank <= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {item.rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                <span className="text-xs text-gray-500">{item.brand}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.point}</p>
              <Link href={`/product/${item.slug}`} className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乾燥対策のその他のポイント</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li>意識的にまばたきを増やす（特にPC・スマホ使用中）</li>
        <li>コンタクト用目薬（人工涙液）を活用する</li>
        <li>装用時間を守る（ワンデーなら16時間以内）</li>
        <li>室内の加湿（湿度40〜60%が理想）</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">乾きにくいコンタクトを最安値で購入する</h3>
        <p className="text-slate-300 mb-4">気になった商品の最安値ショップを今すぐ比較できます。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          全商品の価格を比較する →
        </Link>
      </div>
    </div>
  ),

  'ranshi-contact-erabikata': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「乱視があるとコンタクトは使えない？」「乱視用って普通のと何が違うの？」という疑問を持つ方のために、
        乱視用コンタクトレンズの選び方を、軽度・中等度別に詳しく解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乱視とは？CYL・AXISの意味</h2>
      <p className="mb-4">
        乱視とは、角膜や水晶体の形が球面ではなく楕円形に歪んでいるために、焦点が一点に集まらず像がぼやけたり二重に見える状態です。
        乱視用コンタクトの処方箋には、通常の度数（PWR）に加えて以下のパラメータが記載されます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">CYL（シリンダー・乱視度数）</h3>
          <p className="text-sm text-gray-700">乱視の強さを表す数値。マイナスで表記され、数値が大きいほど乱視が強いことを意味します。</p>
          <p className="text-sm text-gray-600 mt-2"><strong>一般的な範囲：</strong>-0.75 〜 -2.25</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">AXIS（アクシス・軸度）</h3>
          <p className="text-sm text-gray-700">乱視の方向（軸の角度）を1〜180度で表します。この数値が違うと矯正効果が出ません。</p>
          <p className="text-sm text-gray-600 mt-2"><strong>重要：</strong>AXISは±5度以内が望ましい</p>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">乱視用を選ぶ目安</p>
        <p className="text-sm mt-1">CYL（乱視度数）が-0.75以上ある場合は、乱視用コンタクトの使用を検討してください。-0.50以下の軽度乱視は、普通の球面コンタクトで十分なことも多いです。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乱視用コンタクトの仕組み</h2>
      <p className="mb-4">
        乱視用コンタクトは「トーリックレンズ」とも呼ばれ、レンズに方向性を持たせることで乱視を矯正します。
        通常のコンタクトと異なり、<strong>レンズが目の上で回転しない</strong>ように設計されています。
      </p>
      <p className="mb-4">主な安定化方式：</p>
      <ul className="list-disc list-inside mb-6 space-y-1 text-sm text-gray-700">
        <li><strong>プリズムバラスト方式：</strong>レンズの下部を厚くして重力で安定化</li>
        <li><strong>ダブルスラブオフ方式：</strong>上下を削って安定化（まばたきに強い）</li>
        <li><strong>Eyelid Stabilization方式（アキュビュー）：</strong>まぶたの動きを利用して安定化</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">軽度・中等度別おすすめ乱視用コンタクト</h2>
      <h3 className="text-xl font-bold text-gray-800 mb-3">軽度乱視（CYL -0.75〜-1.25）向け</h3>
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">人気No.1</span>
            <span className="text-xs text-gray-500">ワンデー乱視用</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">1デイ アキュビュー モイスト 乱視用</h4>
          <p className="text-xs text-gray-600 mb-2">LACREON技術で乾きにくく、乱視もしっかり矯正。軽度〜中等度乱視の方に人気No.1のワンデー。</p>
          <Link href="/product/acuvue-moist-1day-astig" className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">コスパ最強</span>
            <span className="text-xs text-gray-500">ワンデー乱視用</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">ワンデーピュア うるおいプラス 乱視用</h4>
          <p className="text-xs text-gray-600 mb-2">国産品質で価格が安い。コスパ重視の方に最適な乱視用ワンデー。</p>
          <Link href="/product/seed-1day-pure-astig" className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3">中等度乱視（CYL -1.50〜-2.25）向け</h3>
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">安定性No.1</span>
            <span className="text-xs text-gray-500">2ウィーク乱視用</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">アキュビュー オアシス 乱視用</h4>
          <p className="text-xs text-gray-600 mb-2">HYDRACLEAR PLUS技術で乾燥に強く、乱視の安定矯正力も抜群。中等度乱視の方に強くおすすめ。</p>
          <Link href="/product/acuvue-oasys-2week-astig" className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">マンスリー</span>
            <span className="text-xs text-gray-500">マンスリー乱視用</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">バイオフィニティ トーリック</h4>
          <p className="text-xs text-gray-600 mb-2">Aquaform技術搭載。コスパ重視でマンスリー乱視用を探している方に最適。</p>
          <Link href="/product/biofinity-toric" className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乱視用コンタクトを選ぶ際の注意点</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li>必ず眼科でCYL・AXIS・BCを正確に処方してもらう</li>
        <li>通販購入時はCYLとAXISの入力ミスに注意（左右間違えやすい）</li>
        <li>装用感に違和感がある場合はすぐに外して眼科へ</li>
        <li>乱視用は普通のコンタクトより割高だが眼の健康のために適切なものを選ぶ</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">乱視用コンタクトの最安値を比較する</h3>
        <p className="text-slate-300 mb-4">アキュビュー・シード・クーパービジョンなど主要ブランドの乱視用コンタクトを一括比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            ワンデー乱視用を見る
          </Link>
          <Link href="/ranking" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            人気ランキングを見る
          </Link>
        </div>
      </div>
    </div>
  ),

  'contact-kakaku-hikaku-2024': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        コンタクトレンズの通販サイトは数十店舗あり、同じ商品でも価格が異なります。
        この記事では2026年時点での主要ショップの特徴・価格帯・送料を比較し、賢い購入方法を解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コンタクト通販サイトを選ぶポイント</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">① 送料込みの価格で比較する</h3>
          <p className="text-sm text-gray-700">商品価格が安くても送料が高ければ意味がありません。必ず「送料込み最終価格」で比較しましょう。</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">② まとめ買い割引を活用する</h3>
          <p className="text-sm text-gray-700">多くのショップで6箱・8箱まとめ買いで割引があります。3〜6ヶ月分まとめて買うとお得です。</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">③ 初回割引・クーポンを使う</h3>
          <p className="text-sm text-gray-700">多くのショップで初回購入割引（10〜20%オフ）があります。新規登録時のクーポンも活用しましょう。</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">④ 正規品かどうか確認する</h3>
          <p className="text-sm text-gray-700">高度管理医療機器販売許可を取得した正規ショップで購入することが安全です。</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">主要通販ショップの特徴比較</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-3 border border-slate-200">ショップ名</th>
              <th className="text-left p-3 border border-slate-200">特徴</th>
              <th className="text-left p-3 border border-slate-200">送料無料条件</th>
              <th className="text-left p-3 border border-slate-200">強み</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">レンズクイック</td>
              <td className="p-3 border border-gray-200">老舗大手。品揃え豊富</td>
              <td className="p-3 border border-gray-200">3,000円以上</td>
              <td className="p-3 border border-gray-200">安定した低価格</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">アットレンズ</td>
              <td className="p-3 border border-gray-200">価格競争力が高い</td>
              <td className="p-3 border border-gray-200">5,000円以上</td>
              <td className="p-3 border border-gray-200">まとめ買い割引</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">24lens</td>
              <td className="p-3 border border-gray-200">24時間注文受付</td>
              <td className="p-3 border border-gray-200">3,500円以上</td>
              <td className="p-3 border border-gray-200">迅速な発送</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">レンズゼロ</td>
              <td className="p-3 border border-gray-200">最安値を狙える</td>
              <td className="p-3 border border-gray-200">3,000円以上</td>
              <td className="p-3 border border-gray-200">価格の安さ</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">クリアコンタクト</td>
              <td className="p-3 border border-gray-200">シンプルで使いやすい</td>
              <td className="p-3 border border-gray-200">4,000円以上</td>
              <td className="p-3 border border-gray-200">使いやすいUI</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">モアコン</td>
              <td className="p-3 border border-gray-200">ポイント還元が充実</td>
              <td className="p-3 border border-gray-200">2,500円以上</td>
              <td className="p-3 border border-gray-200">ポイント制度</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">商品別最安値を比較する</h2>
      <p className="mb-4">同じ商品でもショップによって価格差が大きく出ます。例えば人気のアキュビュー オアシス ワンデー（30枚入り）は：</p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
        <p className="font-bold mb-2 text-gray-800">アキュビュー オアシス ワンデー 30枚（1箱）の価格帯（送料別）</p>
        <ul className="space-y-1 text-gray-700">
          <li>最安値ショップ：約1,800円〜</li>
          <li>平均価格：約2,200円前後</li>
          <li>高めのショップ：約2,600円〜</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">※価格は時期・セールにより変動します</p>
      </div>
      <div className="space-y-3 mb-6">
        {[
          { slug: 'acuvue-oasys-1day', name: 'アキュビュー オアシス ワンデー' },
          { slug: 'acuvue-moist-1day', name: '1デイ アキュビュー モイスト' },
          { slug: 'dailies-total1', name: 'デイリーズ トータルワン' },
          { slug: 'seed-1day-pure', name: 'ワンデーピュア うるおいプラス' },
        ].map(p => (
          <div key={p.slug} className="flex items-center justify-between border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-800 text-sm">{p.name}</span>
            <Link href={`/product/${p.slug}`} className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">賢い節約術まとめ</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li><strong>まとめ買い：</strong>6箱・8箱セット購入で1箱あたりの価格を下げる</li>
        <li><strong>定期購入：</strong>定期便サービスを使うと5〜10%割引になるショップが多い</li>
        <li><strong>ポイント還元：</strong>楽天やPayPayを使えるショップは実質さらにお得</li>
        <li><strong>セール時期：</strong>ショップ独自のセール・決算セールを狙う</li>
        <li><strong>価格比較：</strong>当サイトで複数ショップの価格を一括比較する</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">今すぐ最安値ショップを比較する</h3>
        <p className="text-slate-300 mb-4">24ショップの価格を一括比較。送料込みの最終価格がすぐわかります。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          人気商品の価格比較ランキングを見る →
        </Link>
      </div>
    </div>
  ),

  'acuvue-zenkindai-hikaku': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        アキュビューは日本で最も売れているコンタクトレンズブランドです。
        しかし種類が多くて「どれが自分に合うのか」わからない方も多いはず。
        この記事では全ラインナップを比較し、自分に合った商品の選び方を解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">アキュビューのラインナップ一覧</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-3 border border-slate-200">商品名</th>
              <th className="text-left p-3 border border-slate-200">タイプ</th>
              <th className="text-left p-3 border border-slate-200">素材</th>
              <th className="text-left p-3 border border-slate-200">含水率</th>
              <th className="text-left p-3 border border-slate-200">特徴</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">オアシス ワンデー</td>
              <td className="p-3 border border-gray-200">1日</td>
              <td className="p-3 border border-gray-200">シリコーンHG</td>
              <td className="p-3 border border-gray-200">38%</td>
              <td className="p-3 border border-gray-200">HydraLuxe™技術・最高の乾き防止</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">モイスト（1デイ）</td>
              <td className="p-3 border border-gray-200">1日</td>
              <td className="p-3 border border-gray-200">通常HG</td>
              <td className="p-3 border border-gray-200">58%</td>
              <td className="p-3 border border-gray-200">LACREON®技術・コスパ優秀</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">モイスト 乱視用</td>
              <td className="p-3 border border-gray-200">1日</td>
              <td className="p-3 border border-gray-200">通常HG</td>
              <td className="p-3 border border-gray-200">58%</td>
              <td className="p-3 border border-gray-200">LACREON®＋乱視矯正</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">オアシス ワンデー乱視用</td>
              <td className="p-3 border border-gray-200">1日</td>
              <td className="p-3 border border-gray-200">シリコーンHG</td>
              <td className="p-3 border border-gray-200">38%</td>
              <td className="p-3 border border-gray-200">HydraLuxe™＋高安定乱視矯正</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">オアシス（2ウィーク）</td>
              <td className="p-3 border border-gray-200">2週間</td>
              <td className="p-3 border border-gray-200">シリコーンHG</td>
              <td className="p-3 border border-gray-200">38%</td>
              <td className="p-3 border border-gray-200">HYDRACLEAR® PLUS・乾きにくさ最強</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">オアシス 乱視用（2W）</td>
              <td className="p-3 border border-gray-200">2週間</td>
              <td className="p-3 border border-gray-200">シリコーンHG</td>
              <td className="p-3 border border-gray-200">38%</td>
              <td className="p-3 border border-gray-200">HYDRACLEAR® PLUS＋乱視矯正</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">ディファイン（カラコン）</td>
              <td className="p-3 border border-gray-200">1日</td>
              <td className="p-3 border border-gray-200">通常HG</td>
              <td className="p-3 border border-gray-200">58%</td>
              <td className="p-3 border border-gray-200">LACREON®＋自然なリングデザイン</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">目的別・おすすめアキュビューはこれ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">目の乾きが気になる → オアシス</h3>
          <p className="text-sm text-gray-700 mb-2">シリコーンHG素材でHydraLuxe™技術搭載。長時間PCやスマホを使う人に最適。</p>
          <Link href="/product/acuvue-oasys-1day" className="text-slate-700 text-sm font-medium hover:underline">オアシス ワンデーの価格を見る →</Link>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">コスパ重視 → モイスト</h3>
          <p className="text-sm text-gray-700 mb-2">LACREON®技術で快適。価格がオアシスより手頃。毎日使いに最適。</p>
          <Link href="/product/acuvue-moist-1day" className="text-green-600 text-sm font-medium hover:underline">モイストの価格を見る →</Link>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">乱視がある → モイスト乱視用</h3>
          <p className="text-sm text-gray-700 mb-2">乱視用の中でも価格が抑えめで人気。CYL -0.75〜-1.75対応。</p>
          <Link href="/product/acuvue-moist-1day-astig" className="text-purple-600 text-sm font-medium hover:underline">モイスト乱視用の価格を見る →</Link>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <h3 className="font-bold text-orange-800 mb-2">コスト節約・2週間 → オアシス2W</h3>
          <p className="text-sm text-gray-700 mb-2">ワンデーより安くて乾きにくさはトップクラス。長時間装用する日が多い方に。</p>
          <Link href="/product/acuvue-oasys-2week" className="text-orange-600 text-sm font-medium hover:underline">オアシス 2Wの価格を見る →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">オアシスとモイストの違い</h2>
      <p className="mb-4">最も比較されるのがオアシスとモイストの違いです：</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-3">オアシス ワンデー</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ シリコーンハイドロゲル素材</li>
            <li>✓ HydraLuxe™技術（涙液との親和性）</li>
            <li>✓ 酸素透過率Dk/t=121</li>
            <li>✓ 長時間装用・PC作業向き</li>
            <li>✗ モイストより割高</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-3">1デイ アキュビュー モイスト</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ LACREON®技術で十分なうるおい</li>
            <li>✓ 含水率58%（高め）</li>
            <li>✓ 価格がお手頃</li>
            <li>✓ 初心者・普段使いに最適</li>
            <li>✗ シリコーン素材ではない</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">アキュビュー全商品の最安値を比較する</h3>
        <p className="text-slate-300 mb-4">オアシス・モイスト・乱視用など、アキュビュー全商品の通販最安値を一括比較。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          アキュビューの価格を比較する →
        </Link>
      </div>
    </div>
  ),

  'colorcl-hajimete-guide': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「カラコンを試してみたいけど、何を選べばいいかわからない」「安全に使えるか心配」という方のために、
        カラコン初心者向けの選び方ガイドをまとめました。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">カラコンとは？基本知識</h2>
      <p className="mb-4">
        カラーコンタクトレンズ（カラコン）は、通常のコンタクトレンズに色素を加え、瞳の色や大きさを変えられるレンズです。
        日本では<strong>高度管理医療機器</strong>として規制されており、医師の処方に基づいた適切な使用が推奨されます。
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">安全に使うための大前提</p>
        <p className="text-sm mt-1">カラコンも一般コンタクトと同様、初回は眼科で処方を受けてください。度なしカラコンも、自分の目に合ったBCと直径のものを選ぶことが重要です。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度あり vs 度なしカラコンの違い</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">度ありカラコン</h3>
          <p className="text-sm text-gray-700 mb-3">視力矯正＋瞳の色変えを同時にできる。近視の方は度ありを選ぶ。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ コンタクト1枚で視力矯正できる</li>
            <li>✓ 眼鏡が不要になる</li>
            <li>✗ 適切な度数が必要（眼科処方を）</li>
          </ul>
        </div>
        <div className="bg-pink-50 rounded-xl p-4">
          <h3 className="font-bold text-pink-800 mb-2">度なしカラコン（±0.00）</h3>
          <p className="text-sm text-gray-700 mb-3">視力は正常・眼鏡不要の方向け。純粋に瞳の色を変えたい場合。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ 視力が良い人でも使える</li>
            <li>✓ コンサート・イベントなどに</li>
            <li>✗ 度ありより種類が限られることも</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">自然に見えるカラコンの選び方</h2>
      <h3 className="text-xl font-bold text-gray-800 mb-3">① 直径（DIA）で選ぶ</h3>
      <p className="mb-4">
        カラコンの直径（着色直径）が大きいほどデカ目効果が出ます。
        自然に見せたい場合は<strong>着色直径13.8mm以下</strong>を目安にしましょう。
      </p>
      <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
        <ul className="space-y-1 text-gray-700">
          <li><strong>13.5mm以下：</strong>ほぼ素の瞳に近い自然さ</li>
          <li><strong>13.8mm：</strong>程よい盛れ感・自然な印象</li>
          <li><strong>14.2mm：</strong>標準的なカラコンサイズ</li>
          <li><strong>14.5mm以上：</strong>デカ目・コスプレ向き</li>
        </ul>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">② カラーで選ぶ</h3>
      <p className="mb-4">日本人の瞳に自然に見えるカラーは<strong>ナチュラルブラウン系・グレー系</strong>が定番です。</p>
      <ul className="list-disc list-inside mb-6 space-y-1 text-sm text-gray-700">
        <li><strong>ナチュラルブラウン：</strong>日本人の素の瞳に最も近い色</li>
        <li><strong>ライトブラウン：</strong>明るい印象、自然な外国人風</li>
        <li><strong>グレー：</strong>クールな印象、ナチュラルにも使える</li>
        <li><strong>ヘーゼル：</strong>グリーン混じり、オシャレな印象</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">初心者におすすめのカラコン</h2>
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">国産・安心</span>
            <span className="text-xs text-gray-500">シード</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">シードアイコフレ ワンデー UV</h3>
          <p className="text-xs text-gray-600 mb-2">国産カラコンで安心・安全。自然な発色で初心者に最適。</p>
          <Link href="/product/seed-eye-coffret-1day" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">アキュビュー品質</span>
            <span className="text-xs text-gray-500">アキュビュー</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">ワンデー アキュビュー ディファイン</h3>
          <p className="text-xs text-gray-600 mb-2">Limbal Ringデザインで自然に目を大きく見せる。LACREON技術で快適。</p>
          <Link href="/product/acuvue-define-1day" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">ナチュラル系</span>
            <span className="text-xs text-gray-500">GEO</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">GEO ヌーディーシリーズ</h3>
          <p className="text-xs text-gray-600 mb-2">ナチュラルブラウン・グレーで自然な盛れ感。コスパも良好。</p>
          <Link href="/product/geo-nudy-color" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">安全な使い方のポイント</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li>使用期間を守る（ワンデーは1日、マンスリーは1ヶ月まで）</li>
        <li>就寝時は必ず外す（連続装用禁止）</li>
        <li>水道水での保存は絶対にしない</li>
        <li>目が赤い・痛いなど異常があればすぐ外して眼科へ</li>
        <li>定期的に眼科で検査を受ける</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">カラコンの最安値を比較する</h3>
        <p className="text-slate-300 mb-4">人気カラコンの通販最安値を一括比較。送料込みで最もお得なショップがすぐわかります。</p>
        <Link href="/category/color" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          カラコン全商品を見る →
        </Link>
      </div>
    </div>
  ),

  'contact-kaigai-vs-kokunai': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        コンタクトレンズには日本製（シード・メニコンなど）と海外製（アキュビュー・アルコンなど）があります。
        「どちらを選べばいいの？」という疑問を、品質・価格・入手しやすさの観点から徹底比較します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">日本の主要コンタクトブランドまとめ</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-3 border border-slate-200">ブランド</th>
              <th className="text-left p-3 border border-slate-200">製造国</th>
              <th className="text-left p-3 border border-slate-200">代表商品</th>
              <th className="text-left p-3 border border-slate-200">価格帯</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">シード</td>
              <td className="p-3 border border-gray-200">🇯🇵 日本</td>
              <td className="p-3 border border-gray-200">ワンデーピュア</td>
              <td className="p-3 border border-gray-200">安〜中</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">メニコン</td>
              <td className="p-3 border border-gray-200">🇯🇵 日本</td>
              <td className="p-3 border border-gray-200">メニコン ワンデー</td>
              <td className="p-3 border border-gray-200">中</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">アキュビュー</td>
              <td className="p-3 border border-gray-200">🇺🇸 アメリカ</td>
              <td className="p-3 border border-gray-200">オアシス・モイスト</td>
              <td className="p-3 border border-gray-200">中〜高</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">アルコン</td>
              <td className="p-3 border border-gray-200">🇨🇭 スイス</td>
              <td className="p-3 border border-gray-200">デイリーズ トータルワン</td>
              <td className="p-3 border border-gray-200">高</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">クーパービジョン</td>
              <td className="p-3 border border-gray-200">🇺🇸 アメリカ</td>
              <td className="p-3 border border-gray-200">クラリティ・バイオフィニティ</td>
              <td className="p-3 border border-gray-200">安〜中</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-medium">ボシュロム</td>
              <td className="p-3 border border-gray-200">🇺🇸 アメリカ</td>
              <td className="p-3 border border-gray-200">バイオトゥルー・ウルトラ</td>
              <td className="p-3 border border-gray-200">中</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">国産コンタクトのメリット・デメリット</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-3">メリット</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>✓ <strong>日本の規制に合わせた品質管理</strong>：薬機法に基づく厳格な検査</li>
            <li>✓ <strong>日本人の目に合わせた設計</strong>：角膜サイズ・形状を考慮</li>
            <li>✓ <strong>価格が比較的手頃</strong>：特にシードのコスパは高い</li>
            <li>✓ <strong>日本語サポートが充実</strong>：不具合時の対応が容易</li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-3">デメリット</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>✗ <strong>品揃えが少ない</strong>：海外ブランドより種類が少ない</li>
            <li>✗ <strong>最先端技術では海外に遅れることも</strong>：シリコーンHG製品の展開</li>
            <li>✗ <strong>一部商品が通販で入手困難な場合</strong></li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">海外製コンタクトのメリット・デメリット</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-3">メリット</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>✓ <strong>最先端技術を搭載</strong>：HydraLuxe™、水勾配テクノロジーなど</li>
            <li>✓ <strong>豊富な種類</strong>：乱視用・遠近両用なども充実</li>
            <li>✓ <strong>世界的な実績</strong>：グローバルで安全性が実証済み</li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-3">デメリット</h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>✗ <strong>価格が高め</strong>：特にアキュビューオアシス・デイリーズ</li>
            <li>✗ <strong>並行輸入品に注意</strong>：正規品かどうか確認が必要</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">結論：どちらを選ぶべき？</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <ul className="space-y-3 text-sm text-gray-700">
          <li><strong>コスパ重視 →</strong> シード（ワンデーピュア）がおすすめ。国産品質で価格は最安レベル。</li>
          <li><strong>乾きが気になる →</strong> アキュビュー オアシスかデイリーズ トータルワン。最先端の保湿技術は海外勢が強い。</li>
          <li><strong>長時間装用 →</strong> シリコーンHG素材の海外製品（アキュビュー・クーパービジョン）が有利。</li>
          <li><strong>初心者 →</strong> アキュビュー モイストまたはシード ワンデーピュア。どちらも安心して使える。</li>
        </ul>
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">国産・海外製の人気商品を一括比較</h3>
        <p className="text-slate-300 mb-4">シード・メニコンから、アキュビュー・アルコンまで、全商品の最安値を比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            ワンデーを比較
          </Link>
          <Link href="/ranking" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            人気ランキングを見る
          </Link>
        </div>
      </div>
    </div>
  ),

  'contact-maintenance': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        2ウィーク・マンスリーコンタクトを清潔に使い続けるには、正しいケアが必要です。
        毎日のケアをサボると目のトラブルにつながります。この記事で正しい洗い方・保存方法を覚えましょう。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">なぜケアが必要？</h2>
      <p className="mb-4">
        コンタクトレンズには使用中に<strong>タンパク質・脂質・細菌</strong>などが付着します。
        これを毎日洗浄・消毒しないと、目のトラブルの原因になります。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🦠</div>
          <h3 className="font-bold text-gray-800 mb-1 text-sm">細菌・微生物</h3>
          <p className="text-xs text-gray-600">角膜炎・結膜炎の原因。特にアカントアメーバには要注意。</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🥚</div>
          <h3 className="font-bold text-gray-800 mb-1 text-sm">タンパク質汚れ</h3>
          <p className="text-xs text-gray-600">涙に含まれるタンパク質が蓄積するとアレルギーの原因に。</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🫧</div>
          <h3 className="font-bold text-gray-800 mb-1 text-sm">脂質汚れ</h3>
          <p className="text-xs text-gray-600">まぶたの油分が付着。レンズが曇る・乾きやすくなる原因。</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">正しいケアの手順</h2>
      <div className="space-y-4 mb-6">
        {[
          { step: 1, title: '手を洗う', detail: '石鹸でしっかり手を洗い、清潔なタオルで水気を取る。ハンドクリームを使った後はよく洗い流す。' },
          { step: 2, title: 'レンズを外す', detail: '指先でやさしくつまんで外す。爪でレンズを傷つけないよう注意。' },
          { step: 3, title: 'すり洗いをする', detail: '手のひらにレンズを乗せ、洗浄液（MPSなど）を数滴垂らして、指腹で20秒間円を描くようにすり洗い。表裏両面行う。' },
          { step: 4, title: 'すすぐ', detail: '洗浄液でレンズをよくすすぐ。水道水は使用不可（アカントアメーバに感染するリスクがある）。' },
          { step: 5, title: 'レンズケースに入れる', detail: '新しい洗浄保存液をケースに入れ、レンズを浸す。最低4〜6時間（消毒時間）以上置く。' },
          { step: 6, title: 'レンズケースのケア', detail: '毎日洗浄液で洗い、自然乾燥させる。ケースは1〜3ヶ月で交換する。' },
        ].map(item => (
          <div key={item.step} className="flex gap-4 bg-gray-50 rounded-xl p-4">
            <div className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">
              {item.step}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">洗浄液の種類と選び方</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">MPS（マルチパーパスソリューション）</h3>
          <p className="text-sm text-gray-700">洗浄・すすぎ・消毒・保存が1本でできるオールインワン洗浄液。最もよく使われる。</p>
          <p className="text-sm font-medium text-slate-700 mt-2">代表例：レニュー、バイオクレン、AOセプト</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">過酸化水素系消毒液</h3>
          <p className="text-sm text-gray-700">強力な消毒効果。使用前に中和が必要（AOセプトなど）。MPSよりも高い消毒力。</p>
          <p className="text-sm font-medium text-green-700 mt-2">代表例：AOセプト クリアケア</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">絶対にやってはいけないNG行為</h2>
      <div className="bg-red-50 rounded-xl p-4 mb-6">
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span><strong>水道水でのすすぎ・保存</strong>：アカントアメーバに感染するリスクがある</span></li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span><strong>古い洗浄液の再使用</strong>：消毒効果が落ちている</span></li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span><strong>レンズをつけたまま就寝</strong>：酸素不足・角膜炎の原因</span></li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span><strong>ケースを洗わず使い続ける</strong>：細菌・バイオフィルムが繁殖する</span></li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span><strong>使用期限を超えて使う</strong>：2週間・マンスリーの期限厳守</span></li>
        </ul>
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">2ウィーク・マンスリーコンタクトの最安値を比較する</h3>
        <p className="text-slate-300 mb-4">アキュビュー オアシス、バイオフィニティなど2week・マンスリーの価格を一括比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/2week" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            2ウィークを比較
          </Link>
          <Link href="/category/monthly" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            マンスリーを比較
          </Link>
        </div>
      </div>
    </div>
  ),

  'silicon-hydrogel-merit': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「シリコーンハイドロゲル」という言葉をコンタクトレンズの説明で見かけることが増えました。
        通常の素材と何が違うのか、どんな人に向いているのか、メリット・デメリットをわかりやすく解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">シリコーンハイドロゲルとは？</h2>
      <p className="mb-4">
        シリコーンハイドロゲルは、従来の<strong>ヒドロゲル素材</strong>にシリコーンを組み合わせた、
        コンタクトレンズの高機能素材です。シリコーンを加えることで、酸素の透過率が劇的に向上します。
      </p>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <h3 className="font-bold text-slate-800 mb-2">酸素透過率（Dk/t値）の比較</h3>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2">素材</th>
              <th className="text-left p-2">Dk/t値の目安</th>
              <th className="text-left p-2">代表商品</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-2">ヒドロゲル（従来素材）</td>
              <td className="p-2">20〜35</td>
              <td className="p-2">アキュビュー モイスト</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-2">シリコーンハイドロゲル</td>
              <td className="p-2">60〜170</td>
              <td className="p-2">アキュビュー オアシス</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">※Dk/t値が高いほど酸素が目に届きやすい</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">シリコーンハイドロゲルのメリット</h2>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="text-2xl flex-shrink-0">🫁</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">高い酸素透過率</h3>
            <p className="text-sm text-gray-700">目の角膜は直接空気から酸素を取り込む必要があります。シリコーンHG素材は酸素をより多く角膜に届けるため、充血・乾燥感が起きにくくなります。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="text-2xl flex-shrink-0">⏰</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">長時間装用に適している</h3>
            <p className="text-sm text-gray-700">酸素透過率が高いため、1日14〜16時間の長時間装用でも角膜への負担が小さくなります。仕事が長い方・夜遅い方に特に向いています。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="text-2xl flex-shrink-0">💻</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">PC・スマホ作業が多い人向き</h3>
            <p className="text-sm text-gray-700">デジタルデバイスの長時間使用でまばたきが減り目が乾きやすくなります。高酸素素材は目の充血・かすみを防ぐ効果があります。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-green-50 rounded-xl p-4">
          <div className="text-2xl flex-shrink-0">🏃</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">スポーツ・アクティブな方に</h3>
            <p className="text-sm text-gray-700">動きの激しいスポーツ中も目への酸素供給が安定。疲れ目や目のかすみが出にくい。</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">シリコーンハイドロゲルのデメリット</h2>
      <div className="bg-orange-50 rounded-xl p-4 mb-6">
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✗ <strong>価格が高め：</strong>従来素材より1〜2割ほど割高になることが多い</li>
          <li>✗ <strong>脂質が付きやすい：</strong>シリコーンは油を引き寄せる性質があり、脂質汚れがつきやすい</li>
          <li>✗ <strong>素材の硬さ：</strong>一部の人は従来素材より硬く感じる場合がある</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">おすすめのシリコーンHGコンタクト</h2>
      <div className="space-y-3 mb-6">
        {[
          { slug: 'acuvue-oasys-1day', name: 'アキュビュー オアシス ワンデー', brand: 'アキュビュー', feature: 'HydraLuxe™技術でシリコーン素材特有の乾きを解消。ワンデーで最高の快適性。' },
          { slug: 'acuvue-oasys-2week', name: 'アキュビュー オアシス（2ウィーク）', brand: 'アキュビュー', feature: 'HYDRACLEAR PLUS技術。週5日以上装用する方に人気No.1の2ウィーク。' },
          { slug: 'neo-sight-1day', name: 'ネオサイト ワンデー シリコーン UV', brand: 'シード', feature: '国産シリコーンハイドロゲル。リーズナブルな価格で高酸素透過率を実現。' },
          { slug: 'clariti-1day', name: 'クラリティ ワンデー', brand: 'クーパービジョン', feature: 'シリコーンHG素材で最安値クラスのワンデー。コスパ重視の方に。' },
        ].map(item => (
          <div key={item.slug} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full">シリコーンHG</span>
              <span className="text-xs text-gray-500">{item.brand}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.feature}</p>
            <Link href={`/product/${item.slug}`} className="text-slate-700 text-sm font-medium hover:underline">最安値を確認 →</Link>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">シリコーンハイドロゲルコンタクトを比較する</h3>
        <p className="text-slate-300 mb-4">アキュビュー オアシス、クラリティなどシリコーンHG素材の価格を一括比較。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          全商品の価格を比較する →
        </Link>
      </div>
    </div>
  ),

  'contact-nenkan-cost': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「ワンデーと2ウィーク、結局どちらが安い？」は多くの人が気になる疑問です。
        この記事では1日使い捨て・2週間・マンスリーの年間コストをケア用品も含めて比較し、
        生活スタイル別に最適な選択肢を提案します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">年間コスト比較の前提条件</h2>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
        <ul className="space-y-1">
          <li>・毎日装用（年間365日）として計算</li>
          <li>・両目使用（左右同じ度数として計算）</li>
          <li>・通販最安値ショップでのまとめ買い価格を使用</li>
          <li>・ケア用品（洗浄液・ケースなど）も含む</li>
          <li>・価格は2026年時点の目安（変動あり）</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">タイプ別年間コスト比較</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-3 border border-slate-200">タイプ</th>
              <th className="text-left p-3 border border-slate-200">レンズ代/年</th>
              <th className="text-left p-3 border border-slate-200">ケア用品/年</th>
              <th className="text-left p-3 border border-slate-200">合計/年</th>
              <th className="text-left p-3 border border-slate-200">月換算</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-slate-700">1day（普及タイプ）</td>
              <td className="p-3 border border-gray-200">約30,000〜40,000円</td>
              <td className="p-3 border border-gray-200">不要</td>
              <td className="p-3 border border-gray-200 font-bold">約30,000〜40,000円</td>
              <td className="p-3 border border-gray-200">2,500〜3,300円</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-slate-700">1day（プレミアム）</td>
              <td className="p-3 border border-gray-200">約50,000〜70,000円</td>
              <td className="p-3 border border-gray-200">不要</td>
              <td className="p-3 border border-gray-200 font-bold">約50,000〜70,000円</td>
              <td className="p-3 border border-gray-200">4,200〜5,800円</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-green-700">2week</td>
              <td className="p-3 border border-gray-200">約15,000〜25,000円</td>
              <td className="p-3 border border-gray-200">約5,000〜8,000円</td>
              <td className="p-3 border border-gray-200 font-bold">約20,000〜33,000円</td>
              <td className="p-3 border border-gray-200">1,700〜2,750円</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-purple-700">マンスリー</td>
              <td className="p-3 border border-gray-200">約8,000〜15,000円</td>
              <td className="p-3 border border-gray-200">約5,000〜8,000円</td>
              <td className="p-3 border border-gray-200 font-bold">約13,000〜23,000円</td>
              <td className="p-3 border border-gray-200">1,100〜1,900円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mb-6">※両目使用・365日装用の概算です。商品・購入先により大きく異なります。</p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">生活スタイル別おすすめ</h2>
      <div className="space-y-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-800 mb-2">週3〜4日のみ装用する方 → ワンデーが最安</h3>
          <p className="text-sm text-gray-700">使う日だけレンズを使い、ケア用品が不要なワンデーが有利になります。月10〜15枚ならワンデーが最もコスパ良好です。</p>
          <Link href="/product/seed-1day-pure" className="text-slate-700 text-sm font-medium hover:underline mt-2 inline-block">コスパ最強ワンデーを見る →</Link>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">毎日装用・利便性重視 → ワンデー（普及タイプ）</h3>
          <p className="text-sm text-gray-700">ケアの手間を省きながらも月3,000円前後に抑えられる。シードやクーパービジョンのリーズナブルなワンデーがおすすめ。</p>
          <Link href="/product/clariti-1day" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">クラリティ ワンデーを見る →</Link>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">コスト最優先 → マンスリー</h3>
          <p className="text-sm text-gray-700">毎日装用する場合、マンスリーが年間コストは最安。ただしケアの手間がかかるので忙しい方は要注意。</p>
          <Link href="/product/biofinity" className="text-purple-600 text-sm font-medium hover:underline mt-2 inline-block">バイオフィニティを見る →</Link>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <h3 className="font-bold text-orange-800 mb-2">快適さ重視・毎日装用 → 2ウィーク（プレミアム）</h3>
          <p className="text-sm text-gray-700">アキュビュー オアシス 2ウィークは乾きにくさ最高レベルで年間コストも現実的。バランス最良の選択肢。</p>
          <Link href="/product/acuvue-oasys-2week" className="text-orange-600 text-sm font-medium hover:underline mt-2 inline-block">アキュビュー オアシス 2Wを見る →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コスト削減のコツ</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li><strong>まとめ買い：</strong>6箱・8箱まとめ買いで1箱あたりの価格が下がる</li>
        <li><strong>価格比較サイト活用：</strong>同じ商品でもショップにより1,000円以上差が出ることも</li>
        <li><strong>セール・ポイント還元：</strong>楽天SPUやPayPayキャンペーンを組み合わせる</li>
        <li><strong>定期便：</strong>定期購入サービスで5〜10%の割引を受ける</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">今すぐコスト比較を始める</h3>
        <p className="text-slate-300 mb-4">1day・2week・マンスリーの人気商品を一括比較。最安値がすぐわかります。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm">
            ワンデーを比較
          </Link>
          <Link href="/category/2week" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm">
            2ウィークを比較
          </Link>
          <Link href="/category/monthly" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm">
            マンスリーを比較
          </Link>
        </div>
      </div>
    </div>
  ),
  'contact-tsuuhan-osusume-shop': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">コンタクトレンズの通販ショップは国内に50社以上あり、同じ商品でも価格差が1,000円以上になることもあります。本記事では、実際の価格・送料・処方箋不要条件を調査し、信頼できる10ショップを厳選して紹介します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ショップを選ぶ3つのポイント</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800 text-sm mb-1">1. 送料込み最安値</p>
            <p className="text-xs text-gray-600">商品価格が安くても送料が高ければ意味なし。合計額で比較を</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800 text-sm mb-1">2. 処方箋不要かどうか</p>
            <p className="text-xs text-gray-600">既使用の商品なら不要なショップも多い。確認して購入時間を節約</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="font-bold text-slate-800 text-sm mb-1">3. 在庫・配送速度</p>
            <p className="text-xs text-gray-600">最短翌日着が多い。ブランドや度数によっては取り寄せになる場合も</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">おすすめ通販ショップ一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">ショップ名</th>
                <th className="border border-gray-200 px-3 py-2 text-right">送料</th>
                <th className="border border-gray-200 px-3 py-2 text-right">送料無料条件</th>
                <th className="border border-gray-200 px-3 py-2 text-center">処方箋不要</th>
                <th className="border border-gray-200 px-3 py-2 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">アットレンズ</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥330</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥3,980〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-green-600">◎</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">A8.net経由で割引あり。品揃え豊富</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium">レンズゼロ</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥440</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥5,000〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-green-600">◎</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">価格最安水準。まとめ買い割引あり</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">レンズクイック</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥385</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥4,000〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-green-600">◎</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">最短翌日着。在庫豊富</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 font-medium">24レンズ</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥330</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥3,300〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-gray-400">要確認</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">楽天ショップ。ポイント還元高め</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">レンズアップ</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥330</td>
                <td className="border border-gray-200 px-3 py-2 text-right">¥3,500〜</td>
                <td className="border border-gray-200 px-3 py-2 text-center text-green-600">◎</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-600">ポイント制あり。定期便で5%OFF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">処方箋不要で購入できる条件</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="font-semibold text-amber-800 mb-2">処方箋不要で買えるケース</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・現在使用中の同じ商品を継続購入する場合</li>
            <li>・度数・BC・DIAが同一のリピート購入</li>
            <li>・眼科で処方された記録がある場合（ショップにより確認あり）</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-semibold text-red-800 mb-2">処方箋が必要なケース</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>・初めてコンタクトを使う方</li>
            <li>・度数・商品を変更する場合</li>
            <li>・眼科での定期検査を長期間受けていない場合</li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">価格比較の方法</h2>
        <p className="text-gray-700 mb-4">同じ商品でも、ショップによって1箱あたり500〜1,500円の差が出ることがあります。特に送料を含めた合計額で比較することが重要です。当サイトでは全商品の価格を送料込みで一覧表示しています。</p>
        <Link href="/" className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm">
          商品別最安値を比較する →
        </Link>
      </section>
    </div>
  ),
  'acuvue-oasys-1day-review': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">ワンデーアキュビューオアシスは、ジョンソン・エンド・ジョンソンが販売する1日使い捨てコンタクトレンズのプレミアムライン。「乾きにくい」「長時間快適」という口コミが多く、ワンデーの中でも人気の高い商品です。本記事では特徴・使い心地・価格の順に解説します。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ワンデーアキュビューオアシスの特徴</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">HYDRALUXE テクノロジー</h3>
            <p className="text-xs text-gray-700">涙液に似た成分を配合したレンズ素材で、目の表面の水分を長時間保持。長時間のPC作業やドライアイ気味の方に特に向いている。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">シリコーンハイドロゲル素材</h3>
            <p className="text-xs text-gray-700">酸素透過率（Dk/t）121と高く、長時間装用でも目への酸素供給を確保。通常のヒドロゲル素材に比べて目の充血が起きにくい。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">UV保護機能</h3>
            <p className="text-xs text-gray-700">紫外線（UV-A/UV-B）をカット。屋外での活動が多い方にも安心。ただしサングラスの代替にはならない。</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">使い捨てで衛生的</h3>
            <p className="text-xs text-gray-700">1日使い捨てなのでケア用品不要。花粉・ハウスダスト・汚れを毎日リセット。アレルギー体質の方にも選ばれやすい。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">スペック一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500 w-1/3">素材</td><td className="py-2 px-3 font-medium">シリコーンハイドロゲル（セノフィルコンA）</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">含水率</td><td className="py-2 px-3 font-medium">38%</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500">酸素透過率（Dk/t）</td><td className="py-2 px-3 font-medium">121（業界最高水準）</td></tr>
              <tr className="border-b border-gray-100 bg-gray-50"><td className="py-2 px-3 text-gray-500">BC（ベースカーブ）</td><td className="py-2 px-3 font-medium">8.5mm</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 px-3 text-gray-500">DIA（直径）</td><td className="py-2 px-3 font-medium">14.3mm</td></tr>
              <tr className="bg-gray-50"><td className="py-2 px-3 text-gray-500">度数範囲（PWR）</td><td className="py-2 px-3 font-medium">-0.50〜-12.00 / +0.50〜+8.00</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">こんな人におすすめ</h2>
        <ul className="space-y-2">
          {[
            '目が乾きやすい・ドライアイ気味の方',
            '1日10時間以上のPC・スマートフォン利用がある方',
            'コンタクトの不快感（ゴロゴロ感・乾燥）が気になっていた方',
            '花粉症・アレルギーで目が敏感な方',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-500 shrink-0">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">最安値で購入する</h2>
        <p className="text-gray-700 mb-4">ワンデーアキュビューオアシスは通販各社で価格差があります。送料込みの最安値は当サイトの比較ページでご確認ください。</p>
        <Link href="/product/acuvue-oasys-1day" className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm">
          ワンデーアキュビューオアシスの最安値を見る →
        </Link>
      </section>
    </div>
  ),
  'bifocal-multifocal-contact': (
    <div className="space-y-8">
      <section>
        <p className="text-gray-700 mb-4 leading-relaxed">40代を過ぎると老眼（老視）が始まり、近くのものが見えにくくなります。遠近両用コンタクトレンズは、1枚のレンズで遠くも近くも見えるよう設計された製品で、老眼鏡との併用が不要になる場合があります。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">遠近両用コンタクトの仕組み</h2>
        <div className="bg-slate-50 rounded-xl p-5 mb-4 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">同時視（マルチフォーカル）設計</h3>
          <p className="text-sm text-gray-700 mb-3">レンズの中心部と周辺部に異なる度数を設計し、脳が自動的に必要な焦点を選択する方式。慣れるまで1〜2週間かかることがある。</p>
          <h3 className="font-bold text-slate-800 mb-2">交互視（モノビジョン）との違い</h3>
          <p className="text-sm text-gray-700">片目を遠用、もう片目を近用に設定するモノビジョン法もある。眼科医と相談して自分に合った方法を選ぶことが重要。</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">おすすめ遠近両用コンタクト</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">デイリーズ アクア コンフォートプラス マルチフォーカル</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">ワンデー</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">アルコン製のワンデー遠近両用。PRECISION PROFILE設計で自然な視野を実現。</p>
            <Link href="/product/dailies-aqua-multifocal" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">バイオフィニティ マルチフォーカル</h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">マンスリー</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">クーパービジョン製のマンスリー遠近両用。シリコーンハイドロゲル素材で長時間装用向き。コスト重視の方に。</p>
            <Link href="/product/biofinity-multifocal" className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">遠近両用を始める前に知っておくこと</h2>
        <ul className="space-y-3">
          {[
            '必ず眼科で処方を受けること。老視の度数（ADD）の測定が必要',
            '慣れるまでに時間がかかる場合がある。最初の1〜2週間は違和感を感じやすい',
            '夜間の運転や細かい作業では見え方に制限を感じることもある',
            'マルチフォーカルが合わない場合はモノビジョン法や老眼鏡との併用も検討',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  ),
  '2week-contact-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2ウィークコンタクトが選ばれる理由</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          2週間使い捨てのコンタクトレンズは、1dayと比べてコストを抑えつつ、マンスリーより頻繁に交換できる「コスパと清潔感のバランス型」として人気です。通勤・通学・長時間装用が多い社会人に特に選ばれています。
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: '1dayとの違い', text: '1枚あたりの価格が1dayの約1/3〜1/5。ただし毎日のケアが必要。' },
            { label: 'マンスリーとの違い', text: '2週間で交換のため衛生面で優れる。マンスリーより目への負担が少ない。' },
            { label: '価格の目安', text: '1箱（6枚入）2,000〜4,000円。両眼で月あたり約2,000〜5,000円程度。' },
          ].map(({ label, text }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
              <p className="text-xs text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2ウィークコンタクト おすすめ5選</h2>
        <div className="space-y-4">
          {[
            {
              rank: 1, name: 'アキュビュー オアシス（2week）', brand: 'ジョンソン・エンド・ジョンソン',
              slug: 'acuvue-oasys-2week', badge: '総合1位',
              feature: 'HydraLuxe™テクノロジー搭載のシリコーンハイドロゲル素材。乾燥感が気になる方に最も支持される2weekコンタクト。Dk/t 147と高い酸素透過率で長時間装用も快適。',
              specs: [['素材', 'シリコーンハイドロゲル'], ['含水率', '38%'], ['Dk/t', '147'], ['UV保護', 'あり（クラスI）']],
            },
            {
              rank: 2, name: 'バイオフィニティ', brand: 'クーパービジョン',
              slug: 'biofinity', badge: '酸素透過率No.1',
              feature: 'Aquaformテクノロジーで含水率48%、Dk/t 160と業界最高水準の酸素透過率。シリコーンハイドロゲル素材で長時間装用・PC作業が多い方におすすめ。',
              specs: [['素材', 'シリコーンハイドロゲル'], ['含水率', '48%'], ['Dk/t', '160'], ['UV保護', 'なし']],
            },
            {
              rank: 3, name: 'プロクリア ワン', brand: 'クーパービジョン',
              slug: 'proclear-1day', badge: 'うるおい長持ち',
              feature: '含水率57%でPC・ソフトレンズ素材の中でも高い水分保持力。目の乾燥感が気になる方・ドライアイ傾向の方に特に選ばれている。',
              specs: [['素材', 'ハイドロゲル'], ['含水率', '57%'], ['Dk/t', '27.6'], ['UV保護', 'なし']],
            },
            {
              rank: 4, name: 'エア オプティクス ハイドラグライド（2week）', brand: 'アルコン',
              slug: 'air-optix-hydraglyde-2week', badge: 'コスパ優秀',
              feature: 'HydraGlyde保湿マトリクスで終日潤いをキープ。シリコーンハイドロゲル素材で酸素透過率も高く、価格帯はオアシスより抑えめで選びやすい。',
              specs: [['素材', 'シリコーンハイドロゲル'], ['含水率', '33%'], ['Dk/t', '138'], ['UV保護', 'なし']],
            },
            {
              rank: 5, name: 'ネオサイト 2ウィーク シリコーン UV', brand: 'シード',
              slug: 'neo-sight-2week-si', badge: '国産・コスパ',
              feature: '国内メーカー（シード）製のシリコーンハイドロゲル2weekレンズ。UV保護機能付きで日常使いに最適。価格がやや抑えめで長期コストを抑えたい方に。',
              specs: [['素材', 'シリコーンハイドロゲル'], ['含水率', '35%'], ['Dk/t', '129'], ['UV保護', 'あり']],
            },
          ].map(({ rank, name, brand, slug: productSlug, badge, feature, specs }) => (
            <div key={rank} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank <= 2 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}>{rank}</span>
                <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                <span className="text-xs text-gray-500">{brand}</span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded ml-auto">{badge}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{feature}</p>
              <div className="grid grid-cols-4 gap-1 mb-3">
                {specs.map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                    <div className="text-xs font-semibold text-gray-700">{v}</div>
                  </div>
                ))}
              </div>
              <Link href={`/product/${productSlug}`} className="text-slate-700 text-sm font-medium hover:underline">最安値を比較する →</Link>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2ウィークコンタクトを選ぶ際のチェックポイント</h2>
        <ul className="space-y-2">
          {[
            'シリコーンハイドロゲル素材は酸素透過率が高くPC作業・長時間装用に向く。ハイドロゲルより目への負担が少ない。',
            '含水率が高いほど初期のうるおいが強いが、乾燥すると水分を目から奪うため、乾燥感に悩む方はシリコーン素材を選ぶのが一般的。',
            'UV保護機能付きは紫外線から目を守るが、眼科医のUVカット眼鏡に比べると保護範囲が限定的。日差しが強い日は眼鏡・帽子との併用を推奨。',
            '乱視がある方（CYL値がある）は通常の球面レンズではなくトーリックレンズ（乱視用）を使用すること。処方箋で確認を。',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <span className="text-slate-400 shrink-0 mt-0.5">▸</span>{item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  ),
  'monthly-contact-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">マンスリーコンタクトのメリットとデメリット</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          1ヶ月使い捨てコンタクトレンズ（マンスリー）は、1枚あたりのコストが最も安い交換サイクルです。ただし毎日のレンズケア（洗浄・保存）が欠かせず、清潔に管理できる方向けです。
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">マンスリーのメリット</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {['1枚あたりの単価が最安。両眼で月1,000〜2,000円が目安', 'ゴミが少なくSDGs・環境面でのメリットもある', '長期利用で1dayより大幅にコストを抑えられる'].map(m => (
                <li key={m} className="flex gap-2"><span className="text-slate-400 shrink-0">▸</span>{m}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">マンスリーのデメリット</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {['毎日の洗浄液・保存ケアが必要（コストと手間）', '管理ミスによる目のトラブルリスクが1dayより高い', '旅行・外泊時はケア用品持参が必要'].map(m => (
                <li key={m} className="flex gap-2"><span className="text-slate-400 shrink-0">▸</span>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">マンスリーコンタクト 価格・スペック比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left p-2 font-medium">商品名</th>
                <th className="p-2 font-medium">素材</th>
                <th className="p-2 font-medium">含水率</th>
                <th className="p-2 font-medium">Dk/t</th>
                <th className="p-2 font-medium">最安値目安</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'バイオフィニティ', slug: 'biofinity', material: 'SiHy', water: '48%', dkt: '160', price: '1,800円/箱' },
                { name: 'エア オプティクス ハイドラグライド', slug: 'air-optix-hydraglyde', material: 'SiHy', water: '33%', dkt: '138', price: '1,700円/箱' },
                { name: 'クラリティ アドバンス', slug: 'clariti-monthly', material: 'SiHy', water: '56%', dkt: '86', price: '1,500円/箱' },
                { name: '2ウィーク ピュア', slug: 'seed-2week-pure', material: 'Hydrogel', water: '38%', dkt: '26', price: '900円/箱' },
                { name: 'バイオトゥルー マンスリー', slug: 'biotrue-monthly', material: 'Hydrogel', water: '78%', dkt: '42', price: '1,200円/箱' },
              ].map(({ name, slug: ps, material, water, dkt, price }, i) => (
                <tr key={ps} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2">
                    <Link href={`/product/${ps}`} className="text-slate-700 hover:underline font-medium">{name}</Link>
                  </td>
                  <td className="p-2 text-center text-gray-600">{material}</td>
                  <td className="p-2 text-center text-gray-600">{water}</td>
                  <td className="p-2 text-center text-gray-600">{dkt}</td>
                  <td className="p-2 text-center text-gray-800 font-medium">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ SiHy=シリコーンハイドロゲル。価格は6枚入り1箱の目安（税込・送料別）。最新価格は商品ページで確認してください。</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">マンスリーケア用品のコストも考慮しよう</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          マンスリーコンタクトの真のコストは、レンズ代＋ケア用品（洗浄液・保存液・レンズケース）の合計です。洗浄液は月あたり500〜1,500円程度。1dayと比較する際は必ずケア用品代も含めた試算を行いましょう。それでもマンスリーが低コストになることが多いです。
        </p>
      </section>
    </div>
  ),
  'colorcon-ranking-2025': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">カラコン選びの基本：安全に使うための3つのポイント</h2>
        <div className="space-y-3">
          {[
            { title: '眼科処方を受ける', body: '度あり・度なし問わずカラコンは医療機器です。初めて使う場合は必ず眼科でフィッティング検査と処方を受けてください。目の形・サイズに合わないレンズは角膜トラブルの原因になります。' },
            { title: 'JIS規格・薬事法認可品を選ぶ', body: '日本国内で販売される正規品は薬事法認可（クラスIII医療機器）を受けています。格安の並行輸入品・未認可品は素材・染料の安全性が保証されないため、国内正規流通品を選びましょう。' },
            { title: '装用時間・交換サイクルを守る', body: '1day・2week・マンスリーの交換サイクルを必ず守ること。また1日の装用時間は10〜12時間が目安で、それ以上の長時間装用は目への負担が大きくなります。' },
          ].map(({ title, body }) => (
            <div key={title} className="flex gap-3">
              <span className="shrink-0 text-slate-400 mt-1">▸</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">カラコン人気ランキング2025【ナチュラル系】</h2>
        <p className="text-sm text-gray-500 mb-3">日常使いに自然に馴染むナチュラル系カラコンのランキングです。</p>
        <div className="space-y-3">
          {[
            {
              rank: 1, name: 'アキュビュー ディファイン モイスト ワンデー', brand: 'ジョンソン・エンド・ジョンソン',
              slug: 'acuvue-define-moist-1day',
              detail: '瞳のフチを自然に強調するナチュラルエンハンス系。LACREON®保湿技術で1日中うるおいが続く。国内大手ブランドで安心感があり、ナチュラル系No.1の人気。',
              badge: 'ナチュラル1位',
            },
            {
              rank: 2, name: 'フレッシュルック イルミネート', brand: 'アルコン',
              slug: 'freshlook-illuminate',
              detail: '透明感のある瞳に仕上げるナチュラル系。3つのトーンで立体的に瞳を演出しながら自然な印象を維持。オフィスにも使いやすい。',
              badge: '透明感',
            },
            {
              rank: 3, name: 'GEO ベラ カラー', brand: 'GEO Medical（韓国）',
              slug: 'geo-bella-color',
              detail: '韓国発の人気カラコン。60カ国以上に展開する信頼ブランドで、ナチュラルからデイリーカラーまで豊富なラインナップ。コスパも優秀。',
              badge: 'コスパ優秀',
            },
          ].map(({ rank, name, brand, slug: ps, detail, badge }) => (
            <div key={rank} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}>{rank}</span>
                <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                <span className="text-xs text-gray-500">{brand}</span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded ml-auto">{badge}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{detail}</p>
              <Link href={`/product/${ps}`} className="text-slate-700 text-sm font-medium hover:underline">最安値を見る →</Link>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">カラコン人気ランキング2025【度あり・度数選び方】</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          度ありカラコンは、近視矯正とカラーレンズを兼ねた製品です。対応度数の範囲が通常のコンタクトより狭い場合があるため、購入前に処方箋のPWR値と照合してください。
        </p>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">度ありカラコン 選び方チェックリスト</p>
          <ul className="space-y-1.5">
            {[
              '眼科で最新の処方箋を取得する（特にBC値をカラコンの規格と合わせること）',
              'PWRが-6.00以下の強度近視の場合、対応商品が限られる。商品詳細ページで対応度数を確認する',
              '乱視（CYL値あり）の方は乱視用カラコン（トーリックカラコン）が必要だが、種類は少ない',
              '初めてのカラコンは透明な通常コンタクトでフィッティングに慣れてから移行するのが安全',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-xs text-gray-700">
                <span className="text-slate-400 shrink-0">▸</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  ),

  'ranshi-contact-ranking-2025': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視用コンタクト（トーリックレンズ）とは</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          乱視は角膜が楕円形に歪んでいることで、物がぼやけたり二重に見える状態です。通常のコンタクトでは矯正できず、<strong>トーリックレンズ（乱視用）</strong>が必要です。処方箋に「CYL（乱視度数）」と「AXIS（軸）」の値がある方が対象です。
        </p>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">処方箋の見方</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">項目</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">意味</th>
                  <th className="text-left py-2 text-gray-600 font-semibold">例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['PWR / SPH', '球面度数（近視・遠視）', '-3.00'],
                  ['CYL', '乱視度数', '-0.75'],
                  ['AXIS', '乱視の軸方向（0〜180度）', '180'],
                  ['BC', 'ベースカーブ（カーブ半径）', '8.6'],
                ].map(([item, meaning, example]) => (
                  <tr key={item} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-800">{item}</td>
                    <td className="py-2 pr-4 text-gray-600">{meaning}</td>
                    <td className="py-2 text-gray-600">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          乱視用レンズは回転しないよう設計されており（プリズムバラスト方式など）、装用後に見え方が安定するまで数秒〜数十秒かかることがあります。これは仕様で、異常ではありません。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ワンデー乱視用コンタクト おすすめランキング</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          1日使い捨てタイプ。ケア不要で衛生的。外出時・旅行中・スポーツ時の使用に便利です。
        </p>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'デイリーズ トータルワン 乱視用',
              maker: 'アルコン',
              feature: '水分保持96%・シリコーンHG素材。1日中快適な装用感でドライアイ傾向の方にも適合。',
              bc: '8.6',
              cyl: '-0.75 / -1.25 / -1.75 / -2.25',
            },
            {
              rank: 2,
              name: 'ワンデーアキュビュー モイスト 乱視用',
              maker: 'ジョンソン&ジョンソン',
              feature: 'うるおい成分LACREON配合。日本人の目に合わせた豊富なAXIS設定（10度刻み）で細かい乱視矯正が可能。',
              bc: '8.5',
              cyl: '-0.75 / -1.25 / -1.75 / -2.25',
            },
            {
              rank: 3,
              name: 'バイオフィニティ トーリック（1day換算）',
              maker: 'クーパービジョン',
              feature: 'Aquaform技術で自然なうるおい。BC8.7と8.5の2種類があり、目の形に合わせて選べる。',
              bc: '8.5 / 8.7',
              cyl: '-0.75 / -1.25 / -1.75',
            },
          ].map(({ rank, name, maker, feature, bc, cyl }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-0.5">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{feature}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="bg-slate-50 rounded px-2 py-1">BC: {bc}</span>
                    <span className="bg-slate-50 rounded px-2 py-1">CYL: {cyl}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2week乱視用コンタクト おすすめランキング</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          2週間交換タイプ。1日使い捨てよりコストを抑えられます。毎日のケアが必要ですが、ランニングコストは最も低い部類です。
        </p>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'アキュビュー オアシス 乱視用',
              maker: 'ジョンソン&ジョンソン',
              feature: 'HYDRACLEAR PLUSテクノロジーで涙液の安定膜を形成。2weekタイプで最も乾きにくいとされ、長時間装用でも快適。',
              bc: '8.6',
              cyl: '-0.75 / -1.25 / -1.75 / -2.25',
            },
            {
              rank: 2,
              name: 'メダリスト フレッシュフィット コンフォートモイスト 乱視用',
              maker: 'アルコン（ノバルティス）',
              feature: 'フォーカスライン設計でレンズの安定性が高い。豊富な度数展開で強度乱視（CYL-2.25）にも対応。',
              bc: '8.7',
              cyl: '-0.75 / -1.25 / -1.75 / -2.25',
            },
            {
              rank: 3,
              name: 'プロクリア 乱視用（2week）',
              maker: 'クーパービジョン',
              feature: 'PC技術で表面に水分を引きつけ、乾燥を防ぐ。目が敏感・ドライアイ傾向の方に適合。',
              bc: '8.7',
              cyl: '-0.75 / -1.25 / -1.75',
            },
          ].map(({ rank, name, maker, feature, bc, cyl }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-0.5">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{feature}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="bg-slate-50 rounded px-2 py-1">BC: {bc}</span>
                    <span className="bg-slate-50 rounded px-2 py-1">CYL: {cyl}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">マンスリー乱視用コンタクト おすすめ</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          1ヶ月交換タイプ。最もコストが低く、毎日使用する方に経済的です。しっかりしたケアが必要です。
        </p>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'バイオフィニティ トーリック',
              maker: 'クーパービジョン',
              feature: 'Aquaform技術でレンズ自体が水分を保持。シリコーンHG素材で酸素透過率が高く、長時間装用にも対応。乱視度数が強い方（CYL-2.25まで）にも豊富な選択肢。',
              bc: '8.5 / 8.7',
              cyl: '-0.75〜-2.25',
            },
            {
              rank: 2,
              name: 'エアオプティクス プラス HG トーリック',
              maker: 'アルコン',
              feature: 'Smart Surfaceテクノロジーでレンズ表面に水分層を形成。プラチナサーフェスで汚れが付きにくく、マンスリーでも清潔な装用感が続く。',
              bc: '8.6',
              cyl: '-0.75 / -1.25 / -1.75',
            },
          ].map(({ rank, name, maker, feature, bc, cyl }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-0.5">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{feature}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="bg-slate-50 rounded px-2 py-1">BC: {bc}</span>
                    <span className="bg-slate-50 rounded px-2 py-1">CYL: {cyl}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">CYL・AXISの選び方と注意点</h2>
        <div className="space-y-3">
          {[
            { title: '必ず眼科処方箋を取得する', body: '乱視用コンタクトはCYL値・AXIS値・BC値の3つが合わないと視力矯正が不十分になります。ネット購入でも処方箋が必要で、自己判断でのCYL・AXIS変更は視力低下・眼精疲労の原因になります。' },
            { title: 'AXIS（軸）は厳密に合わせる', body: 'AXISが10度ずれると視力矯正効果が落ちます。処方箋のAXIS値と商品ラインナップが合わない場合は、最も近い値を眼科医に相談して選んでください。10度刻みの製品（アキュビューシリーズ等）はフィット率が高い傾向があります。' },
            { title: '初回は眼科でフィッティング確認を', body: '乱視用レンズは装用後の安定に時間がかかります（数秒〜30秒）。初めて使う場合は眼科でレンズの安定性・見え方を確認してからリピート購入することを推奨します。' },
            { title: '強度乱視（CYL -2.00以上）は選択肢が限られる', body: 'CYL -2.00以上の強度乱視の場合、対応している製品が限られます。バイオフィニティ トーリックやアキュビュー系が対応していることが多いですが、眼科に相談してください。' },
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
          ※ 掲載している製品情報・BC値・CYL設定は参考値です。実際のご購入前に必ず眼科で処方箋を取得し、最新の製品仕様を販売店でご確認ください。
        </p>
      </section>
    </div>
  ),

  'contact-chouji-so': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">長時間装用で大切なのは「素材」</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          1日10時間以上のコンタクト装用は、角膜への酸素供給不足・乾燥による不快感・充血などのリスクが高まります。長時間装用に適したレンズを選ぶ際の最重要ポイントは<strong>シリコーンハイドロゲル（SiHy）素材</strong>かどうかです。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">素材</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">酸素透過率</th>
                <th className="text-left py-2 text-gray-600 font-semibold">長時間装用</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ハイドロゲル（旧来型）', '低〜中', '非推奨（目が疲れやすい）'],
                ['シリコーンハイドロゲル', '非常に高い', '推奨（酸素が豊富に通る）'],
              ].map(([material, o2, long]) => (
                <tr key={material} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-800">{material}</td>
                  <td className="py-2 pr-4 text-gray-600">{o2}</td>
                  <td className="py-2 text-gray-600">{long}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          PC作業・残業・運転など目を酷使する方は、必ずシリコーンハイドロゲル素材のレンズを選んでください。旧来のハイドロゲルより価格はやや高めですが、眼の健康維持への投資として重要です。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">長時間装用向けおすすめコンタクト5選</h2>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'デイリーズ トータルワン',
              type: 'ワンデー',
              maker: 'アルコン',
              material: 'シリコーンHG（Dk/t:156）',
              moisture: '水分保持96%（レンズ表面）',
              comment: '現存する1dayコンタクトの中でトップクラスの酸素透過率と水分保持力。目の表面に水の膜を作る「ウォーターグラジェント技術」により、1日中乾燥感が少ない。長時間のPC作業・運転に最も適した製品の一つ。',
            },
            {
              rank: 2,
              name: 'アキュビュー オアシス（1day）',
              type: 'ワンデー',
              maker: 'ジョンソン&ジョンソン',
              material: 'シリコーンHG（Dk/t:121）',
              moisture: 'HYDRALUXE技術',
              comment: 'HYDRALUXE技術で涙液とレンズが一体化。まばたきのたびにレンズ表面が潤う設計で、ドライアイ傾向の長時間装用者に高く評価されている。UVブロック機能も付属。',
            },
            {
              rank: 3,
              name: 'バイオフィニティ（2week）',
              type: '2week',
              maker: 'クーパービジョン',
              material: 'シリコーンHG（Dk/t:160）',
              moisture: 'Aquaform技術（内部保水）',
              comment: '2weekでありながら非常に高い酸素透過率。Aquaform技術でレンズ内部に水分を保持するため、表面処理なしで自然なうるおいが続く。コスパを重視しながらも快適な長時間装用を実現したい方向け。',
            },
            {
              rank: 4,
              name: 'アキュビュー オアシス（2week）',
              type: '2week',
              maker: 'ジョンソン&ジョンソン',
              material: 'シリコーンHG（Dk/t:147）',
              moisture: 'HYDRACLEAR PLUS技術',
              comment: '2週間交換タイプの定番中の定番。HYDRACLEAR PLUSで涙液の安定膜を形成し、長時間のデスクワーク・学習でも快適。2weekシリーズの中で最も人気が高く、眼科処方でも頻繁に推薦される製品。',
            },
            {
              rank: 5,
              name: 'エアオプティクス プラス HG（マンスリー）',
              type: 'マンスリー',
              maker: 'アルコン',
              material: 'シリコーンHG（Dk/t:138）',
              moisture: 'Smart Surface技術',
              comment: '月々のコストを抑えながら高い酸素透過率を確保。Smart Surfaceテクノロジーでレンズ表面の汚れ付着を抑制。経済的に長時間装用対応レンズを使い続けたい方に適合。',
            },
          ].map(({ rank, name, type, maker, material, moisture, comment }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{name}</p>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{material}</span>
                    <span className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full">{moisture}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">長時間装用のケアポイント</h2>
        <div className="space-y-3">
          {[
            { title: '装用時間は最大12〜14時間を目安に', body: 'シリコーンHGでも1日の装用上限は12〜14時間が推奨上限です。それ以上の連続装用は角膜への負担が増します。仕事の都合で16時間以上になる場合は、眼科医に相談してください。' },
            { title: '20-20-20ルールを守る', body: 'PC作業では20分ごとに20フィート（約6m）先を20秒間見る「20-20-20ルール」が有効です。ピント調節筋の疲労を防ぎ、乾燥感・眼精疲労を軽減します。' },
            { title: '目薬（点眼液）を活用する', body: 'コンタクト装用中でも使える「コンタクト対応」の人工涙液・目薬を使用することで乾燥感を軽減できます。市販品ではソフトサンティアやロートコンタクトシリーズが代表的です。防腐剤フリーのものを選ぶと目への負担が少ない。' },
            { title: 'MGD（マイボーム腺機能不全）に注意', body: '長時間のスクリーン作業では瞬きの回数が減り、涙の質が低下します。定期的に目を閉じてゆっくり瞬きし、マイボーム腺（まぶたの脂腺）の機能を維持することが重要です。' },
            { title: '定期的な眼科検診を怠らない', body: 'シリコーンHGでも長期間・長時間の装用は角膜への影響があります。年1〜2回の眼科検診で角膜の状態を確認し、適切なレンズ選択を続けてください。' },
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
          ※ 掲載している製品情報・酸素透過率（Dk/t値）は参考値です。長時間装用については必ず眼科医に相談し、処方に従ってください。最新の製品仕様は各メーカー公式サイトでご確認ください。
        </p>
      </section>
    </div>
  ),

  'dailies-total1-vs-oasys': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2大プレミアムレンズを徹底比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          「デイリーズ トータルワン」（アルコン）と「アキュビュー オアシス 1-day with HydraLuxe」（ジョンソン＆ジョンソン）は、
          1dayコンタクト市場の頂点に立つ2製品です。どちらも乾きにくさ・酸素透過率で最高クラスのスペックを持ちますが、素材アプローチが異なります。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">項目</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">デイリーズ トータルワン</th>
                <th className="text-left py-2 text-gray-600 font-semibold">アキュビュー オアシス 1-day</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['メーカー', 'アルコン', 'ジョンソン＆ジョンソン'],
                ['素材', 'ダレフィルコン A（SiHy）', 'セノフィルコン A（SiHy）'],
                ['Dk/t値', '156', '103'],
                ['含水率（表面/中心）', '80% / 33%', '38%'],
                ['BC', '8.5', '8.5'],
                ['DIA', '14.1mm', '14.3mm'],
                ['UVカット', 'あり（クラス1）', 'あり（クラス1）'],
                ['1箱あたり枚数', '30枚', '30枚'],
                ['価格帯（目安）', '3,000〜4,500円/箱', '2,800〜4,000円/箱'],
              ].map(([item, total1, oasys]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{item}</td>
                  <td className="py-2 pr-4 text-gray-600">{total1}</td>
                  <td className="py-2 text-gray-600">{oasys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">5つの観点で比較</h2>
        <div className="space-y-4">
          {[
            {
              title: '乾きにくさ',
              winner: 'デイリーズ トータルワン',
              body: 'デイリーズ トータルワンは「ウォーターグラジエントテクノロジー」により、レンズ表面の含水率が80%に達します。目の表面に触れる部分がほぼ水分で構成されているため、装用感が目立ちにくく乾燥感を感じにくい設計です。アキュビュー オアシスも「HydraLuxe」涙液模倣テクノロジーで高い保水力を持ちますが、乾きにくさの純粋なスペックではデイリーズに軍配が上がります。',
            },
            {
              title: '装用感・フィット感',
              winner: '個人差あり',
              body: 'アキュビュー オアシス（DIA 14.3mm）はやや大きめのため瞳を大きく見せる効果があり、フィット感が高いと感じる方が多いです。デイリーズ トータルワン（DIA 14.1mm）は小さめでナチュラルな見た目。初めてコンタクトを使う方やソフトレンズに慣れていない方にはアキュビュー オアシスの装用感が合いやすい傾向があります。',
            },
            {
              title: '酸素透過率（Dk/t値）',
              winner: 'デイリーズ トータルワン',
              body: 'Dk/t値はデイリーズ トータルワンが156と業界トップクラス。アキュビュー オアシスの103も十分高い水準ですが、長時間装用や角膜への酸素供給を特に重視する場合はデイリーズ トータルワンが有利です。',
            },
            {
              title: '価格',
              winner: 'アキュビュー オアシス 1-day',
              body: '通販最安値ベースではアキュビュー オアシスの方が若干安いケースが多いです。デイリーズ トータルワンは製造コストが高く、最安値でも1枚あたり約100〜150円前後。まとめ買いでのコスト差も考慮すると、予算が限られている場合はアキュビュー オアシス 1-dayが選ばれやすいです。',
            },
            {
              title: '乱視用・カラーラインナップ',
              winner: 'アキュビュー オアシス 1-day',
              body: 'アキュビュー オアシスには乱視用「with HydraLuxe for Astigmatism」があり、乱視対応の選択肢が充実しています。デイリーズ トータルワンの乱視用は「デイリーズ トータルワン for Astigmatism」として提供されていますが、国内取り扱い度数範囲が若干異なる場合があります。',
            },
          ].map(({ title, winner, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-bold text-gray-900">{title}</p>
                <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">{winner}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">あなたに向いているのはどっち？</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-slate-800 rounded-xl p-5">
            <p className="font-bold text-slate-800 mb-3">デイリーズ トータルワンが向いている方</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'とにかく乾きにくいレンズを探している',
                '長時間（10時間以上）の装用が多い',
                '高い酸素透過率を重視する',
                'ドライアイ気味で他のレンズで乾燥感があった',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3">アキュビュー オアシス 1-dayが向いている方</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'コストパフォーマンスも重視したい',
                '乱視用の選択肢が豊富な方がいい',
                'やや大きめのレンズでフィット感を重視',
                '初めてプレミアムレンズに挑戦する方',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">最安値を確認する</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/product/dailies-total1" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1">デイリーズ トータルワン</p>
            <p className="text-xs text-gray-500 mb-3">アルコン / 30枚入</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg">最安値を見る</span>
          </Link>
          <Link href="/product/acuvue-oasys-1day" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1">アキュビュー オアシス 1-day</p>
            <p className="text-xs text-gray-500 mb-3">ジョンソン＆ジョンソン / 30枚入</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg">最安値を見る</span>
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載しているスペック・価格は参考値です。実際の製品仕様は各メーカー公式サイト・販売店でご確認ください。コンタクトレンズは医療機器のため、初めてご使用の方は必ず眼科を受診して処方箋を取得してください。
        </p>
      </section>
    </div>
  ),

  'contact-dryeye-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ドライアイとコンタクトレンズの関係</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          ドライアイは涙の量や質が低下し、目の表面が乾燥しやすくなる状態です。コンタクトレンズはレンズ自体が水分を必要とするため、
          ドライアイの方が装用すると乾燥感・異物感・充血が起きやすくなります。ただし、素材や含水率を適切に選ぶことでこれらの症状を大幅に軽減できます。
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
          <p className="font-semibold text-gray-800 mb-2 text-sm">ドライアイの方がレンズ選びで重視すべきポイント</p>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              'シリコーンハイドロゲル（SiHy）素材：酸素透過率が高く角膜への負担が少ない',
              '含水率が高いレンズ or 表面コーティングで保水するレンズ',
              '1dayタイプ：毎日新しいレンズに取り替えるため汚れ・タンパク質の蓄積がない',
              '大きすぎない直径（DIA）：瞼との摩擦を減らす',
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">ドライアイ向けコンタクト おすすめランキング</h2>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'デイリーズ トータルワン',
              maker: 'アルコン',
              type: '1day',
              material: 'ダレフィルコン A（SiHy）',
              moisture: 'Dk/t 156・表面含水率80%',
              comment: '水分勾配テクノロジーにより、目の表面に触れるレンズ外側が約80%の含水率を実現。ドライアイ対策として最高峰の設計。長時間装用でも快適さを維持しやすい。',
            },
            {
              rank: 2,
              name: 'アキュビュー オアシス 1-day with HydraLuxe',
              maker: 'ジョンソン＆ジョンソン',
              type: '1day',
              material: 'セノフィルコン A（SiHy）',
              moisture: 'Dk/t 103・HydraLuxeテクノロジー',
              comment: '涙液の成分に似た構造を持つHydraLuxeが涙膜を安定させ、乾燥感を軽減。デジタルデバイス作業が多い方に人気。乱視用ラインアップも充実。',
            },
            {
              rank: 3,
              name: 'バイオトゥルー ONEday',
              maker: 'ボシュロム',
              type: '1day',
              material: 'ハイプロキシフィルコン A',
              moisture: '含水率78%・ハイドロソート技術',
              comment: 'ハイドロゲル素材ながら含水率78%を誇り、涙液タンパク質と同様の成分でレンズ表面を保水。価格が比較的リーズナブルでコスパの良いドライアイ対策レンズ。',
            },
            {
              rank: 4,
              name: 'アキュビュー オアシス 2week',
              maker: 'ジョンソン＆ジョンソン',
              type: '2week',
              material: 'セノフィルコン A（SiHy）',
              moisture: 'Dk/t 147・HYDRACLEAR Plus',
              comment: '2weekタイプの中ではトップクラスの乾きにくさ。HYDRACLEAR Plusがレンズ内部に浸透し装用中の保湿を維持。1dayより低コストで乾燥感対策を継続できる。',
            },
            {
              rank: 5,
              name: 'プロクリア 1day',
              maker: 'クーパービジョン',
              type: '1day',
              material: 'オマフィルコン A',
              moisture: '含水率62%・PC技術',
              comment: 'フォスフォリルコリン（PC）テクノロジーにより、生体との親和性が高い表面を形成。タンパク質・細菌の付着を抑制し清潔に保てる。ドライアイ初期・軽度の方に適合。',
            },
          ].map(({ rank, name, maker, type, material, moisture, comment }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{name}</p>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{material}</span>
                    <span className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full">{moisture}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ドライアイとコンタクトの乾燥対策ケア</h2>
        <div className="space-y-3">
          {[
            { title: 'コンタクト対応の目薬（人工涙液）を使う', body: '「コンタクトレンズ装用中OK」と表示のある防腐剤フリーの点眼液を使用。ソフトサンティア（参天製薬）やロートコンタクト（ロート製薬）シリーズが代表的。1〜2時間に1回程度の点眼が乾燥感を和らげます。' },
            { title: '装用時間を短くする', body: 'ドライアイがある場合、1日の装用上限は8〜10時間を目安にしましょう。帰宅後はなるべく早く外し、目を休ませる時間を確保してください。' },
            { title: 'まばたきを意識的に増やす', body: 'PCやスマホ使用中はまばたきの回数が通常の3分の1程度に減ります。20分に1回、意識的に10回まばたきするクセをつけましょう。' },
            { title: '定期的に眼科で検診を受ける', body: 'ドライアイは進行する場合もあります。年2回程度、眼科でドライアイの状態とレンズの適合性を確認してもらいましょう。必要に応じてレンズの種類や度数の見直しを行います。' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">各製品の最安値を確認する</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/product/dailies-total1" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1 text-sm">デイリーズ トータルワン</p>
            <p className="text-xs text-gray-500 mb-2">アルコン / 1day</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る</span>
          </Link>
          <Link href="/product/acuvue-oasys-1day" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1 text-sm">アキュビュー オアシス 1-day</p>
            <p className="text-xs text-gray-500 mb-2">J&J / 1day</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る</span>
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載している製品情報・スペックは参考値です。ドライアイの症状が重い場合は自己判断せず、必ず眼科医に相談してください。最新の製品仕様は各メーカー公式サイトでご確認ください。
        </p>
      </section>
    </div>
  ),

  'contact-tsuhan-shop-hikaku': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">コンタクトレンズ通販を選ぶ5つのポイント</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          コンタクトレンズの通販ショップは価格・送料・配送スピード・処方箋対応・クーポン頻度で大きく差があります。
          「最安値」だけで選ぶと送料を含めるとトータルで高くなるケースも。以下の5点を確認して選びましょう。
        </p>
        <div className="space-y-3">
          {[
            { no: '1', title: '送料込みの最終価格を比較する', body: '「1箱○○円」の表示でも送料が別途かかるショップが多い。特定金額以上で送料無料になるラインも各ショップで異なるため、実際の購入金額で比較してください。当サイトでは送料込みの最安値を掲載しています。' },
            { no: '2', title: 'まとめ買いの割引率を確認する', body: '4箱・6箱・8箱のまとめ買いで追加割引を設けているショップが多い。毎月購入する場合は年間まとめ買いが最もコスパが良くなるケースが多いです。' },
            { no: '3', title: '処方箋不要の対応範囲を確認する', body: '「処方箋不要」対応ショップでも条件があります（同商品の継続使用者のみ・初めてのコンタクトには不可など）。初めて使う方や度数変更がある場合は眼科を受診してください。' },
            { no: '4', title: 'クーポン・ポイント還元を活用する', body: 'メルマガ登録で初回割引・誕生月クーポン・楽天ポイント還元など、各ショップで定期的なお得情報がある。楽天市場・Yahoo!ショッピング経由での購入もポイント還元率を考慮すると有利なことが多い。' },
            { no: '5', title: '配送スピードと在庫の豊富さ', body: '急いでいる場合は「最短翌日お届け」のショップを選ぶ。在庫が豊富で取り扱いブランドが多いショップほど、欲しい商品が欠品なく購入できる。' },
          ].map(({ no, title, body }) => (
            <div key={no} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{no}</span>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">主要通販ショップ特徴まとめ</h2>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">ショップ</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">特徴</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">送料無料条件</th>
                <th className="text-left py-2 text-gray-600 font-semibold">処方箋</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['レンズクイック', '価格競争力が高い', '一定金額以上', '不要対応あり'],
                ['アットレンズ', 'まとめ買い割引充実', '一定金額以上', '不要対応あり'],
                ['24Lens', 'クーポン頻度が高い', '一定金額以上', '不要対応あり'],
                ['シンシア', '国内ブランドに強い', '一定金額以上', '不要対応あり'],
                ['楽天市場', 'ポイント還元が豊富', 'ショップ依存', 'ショップ依存'],
                ['Yahoo!ショッピング', 'Paypayポイント還元', 'ショップ依存', 'ショップ依存'],
              ].map(([shop, feature, free, rx]) => (
                <tr key={shop} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{shop}</td>
                  <td className="py-2 pr-4 text-gray-600">{feature}</td>
                  <td className="py-2 pr-4 text-gray-600">{free}</td>
                  <td className="py-2 text-gray-600">{rx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">※ 送料無料条件・処方箋対応は変更される場合があります。最新情報は各ショップでご確認ください。</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ランキングで最安値を確認する</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          当サイトでは24店舗の価格を毎日自動更新し、送料込みの最安値を一覧で比較できます。
          商品ページからその日の最安値ショップを確認してご購入ください。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ranking" className="inline-block bg-slate-800 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            人気ランキングTOP6を見る
          </Link>
          <Link href="/category/1day" className="inline-block border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            ワンデー一覧を見る
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 当サイトはアフィリエイト広告を掲載しています。掲載情報は参考値であり、最新の価格・条件は各ショップ公式サイトでご確認ください。コンタクトレンズは医療機器です。初めてご使用の方は必ず眼科を受診してください。
        </p>
      </section>
    </div>
  ),

  'acuvue-moist-vs-oasys-chigai': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">アキュビュー モイストとオアシスの基本スペック比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          アキュビュー（ジョンソン＆ジョンソン）の1dayシリーズで最も売れている2モデルが「モイスト」と「オアシス」です。
          両者は同じブランドですが素材・酸素透過率・価格帯が大きく異なります。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">項目</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">アキュビュー モイスト</th>
                <th className="text-left py-2 text-gray-600 font-semibold">アキュビュー オアシス 1-day</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['素材', 'エタフィルコン A（ハイドロゲル）', 'セノフィルコン A（シリコーンHG）'],
                ['Dk/t値', '33.3', '103'],
                ['含水率', '58%', '38%'],
                ['BC', '8.5', '8.5'],
                ['DIA', '14.2mm', '14.3mm'],
                ['UVカット', 'あり（クラス2）', 'あり（クラス1）'],
                ['乱視用ライン', 'あり', 'あり'],
                ['価格帯（目安）', '1,600〜2,200円/箱', '2,800〜4,000円/箱'],
              ].map(([item, moist, oasys]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{item}</td>
                  <td className="py-2 pr-4 text-gray-600">{moist}</td>
                  <td className="py-2 text-gray-600">{oasys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">モイストとオアシス 4つの違い</h2>
        <div className="space-y-4">
          {[
            {
              title: '価格の違い',
              winner: 'アキュビュー モイスト',
              body: 'モイストはオアシスの約半額〜60%の価格で購入できます。年間使用量で換算すると1〜2万円以上の差になることも。コストを重視する場合は迷わずモイストを選びましょう。まとめ買いでもモイストの方がトータルコストは大幅に低い。',
            },
            {
              title: '乾きにくさ・酸素透過率',
              winner: 'アキュビュー オアシス 1-day',
              body: 'オアシスはシリコーンハイドロゲル素材でDk/t値103と高い酸素透過率を誇ります。モイストはハイドロゲル素材でDk/t値33.3。長時間装用（8時間以上）や目の乾燥が気になる方にはオアシスが明らかに優れています。',
            },
            {
              title: '初心者・ライトユーザーへの適合性',
              winner: 'アキュビュー モイスト',
              body: 'コンタクト初心者・週3〜4日程度の使用・予算を抑えたい方には、モイストが最適な選択肢です。装用感も一般的なハイドロゲルとしては標準以上で、日常的な使用には十分な品質です。',
            },
            {
              title: '長時間・ハードユーザーへの適合性',
              winner: 'アキュビュー オアシス 1-day',
              body: 'PCワーク・長時間外出・ドライアイ気味の方には価格差を払ってでもオアシスを選ぶ価値があります。1日の装用終わりの乾燥感・眼精疲労の感じ方が大きく異なります。',
            },
          ].map(({ title, winner, body }) => (
            <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-bold text-gray-900">{title}</p>
                <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">{winner}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">どちらを選べばいい？</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-slate-800 rounded-xl p-5">
            <p className="font-bold text-slate-800 mb-3">モイストが向いている方</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'コストをできるだけ抑えたい',
                '週3〜4日程度のライトな使用',
                '目の乾燥はそれほど気にならない',
                '初めてアキュビューを使う',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <p className="font-bold text-gray-800 mb-3">オアシスが向いている方</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                '1日8時間以上の長時間装用が多い',
                '目の乾燥・疲れが気になる',
                'PCやスマホを長時間使用する',
                '最高品質のアキュビューを使いたい',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">最安値を確認する</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/product/acuvue-moist-1day" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1">アキュビュー モイスト 1day</p>
            <p className="text-xs text-gray-500 mb-3">J&J / ハイドロゲル / 30枚入</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg">最安値を見る</span>
          </Link>
          <Link href="/product/acuvue-oasys-1day" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <p className="font-bold text-gray-900 mb-1">アキュビュー オアシス 1-day</p>
            <p className="text-xs text-gray-500 mb-3">J&J / シリコーンHG / 30枚入</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg">最安値を見る</span>
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載しているスペック・価格は参考値です。最新の製品仕様は各メーカー公式サイトでご確認ください。コンタクトレンズは医療機器のため、初めてご使用の方は必ず眼科を受診して処方箋を取得してください。
        </p>
      </section>
    </div>
  ),

  'contact-2week-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2weekコンタクトのメリット・デメリット</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          2週間使い捨てコンタクトレンズは、ワンデーと比べてコストを抑えつつ、毎日のレンズケア（洗浄・保存）を前提にした設計です。
          毎日使う方には経済的な選択肢ですが、ケア用品代と手間もかかります。
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="font-bold text-emerald-800 text-sm mb-2">メリット</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {['ワンデーより1日あたりのコストが安い', '多くのシリーズがシリコーンHG素材で酸素透過率が高い', '乱視用・遠近両用のラインナップが豊富', 'まとめ買いでさらにコスト削減可能'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="font-bold text-slate-700 text-sm mb-2">デメリット</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {['毎日のレンズケアが必要（洗浄・保存液代も発生）', '水道水洗浄は厳禁（感染リスクあり）', 'ケア不足だとタンパク汚れが蓄積しやすい', '旅行・外泊時はケア用品も持ち歩く必要がある'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">おすすめ2weekコンタクト ランキング</h2>
        <div className="space-y-4">
          {[
            {
              rank: 1,
              name: 'アキュビュー オアシス（2week）',
              maker: 'ジョンソン＆ジョンソン',
              material: 'セノフィルコン A（SiHy）',
              dk: '147',
              price: '2,500〜3,800円/箱（6枚）',
              point: '2weekレンズの中で最高クラスの乾きにくさ。HYDRACLEAR Plusがレンズ全体に保湿成分を届け、12〜14時間の長時間装用でも快適さを維持。PC・デスクワーク・コンタクト中心の生活の方に最適。',
            },
            {
              rank: 2,
              name: 'バイオフィニティ',
              maker: 'クーパービジョン',
              material: 'コメットフィルコン A（SiHy）',
              dk: '160',
              price: '2,200〜3,200円/箱（6枚）',
              point: 'Dk/t値160と業界最高水準の酸素透過率を誇るマンスリー・2weekシリーズの主力。Aquaformテクノロジーで保水性も高い。長時間・高酸素環境を求める方に支持されている。',
            },
            {
              rank: 3,
              name: 'シード 2ウィーク ピュア EDOF',
              maker: 'シード',
              material: 'エタフィルコン A',
              dk: '28',
              price: '1,500〜2,400円/箱（6枚）',
              point: '国産ブランドのシードが提供するコスパ重視の2weekレンズ。EDOF（拡張焦点深度）技術採用で手元から遠方まで見やすい。価格を抑えながらも安定した品質を重視する方に。',
            },
            {
              rank: 4,
              name: 'メニコン 2week Menicon Premio',
              maker: 'メニコン',
              material: 'シリコーンハイドロゲル',
              dk: '161',
              price: '1,800〜2,800円/箱（6枚）',
              point: '国内最大コンタクトメーカーのメニコンが提供する高スペック2weekレンズ。酸素透過率が高く、日本人の眼形状に合わせた設計で安定した装用感。',
            },
          ].map(({ rank, name, maker, material, dk, price, point }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{material}</span>
                    <span className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full">Dk/t: {dk}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{price}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">2weekコンタクトの最安値を比較する</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/2week" className="inline-block bg-slate-800 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            2week商品一覧で最安値を見る
          </Link>
          <Link href="/ranking" className="inline-block border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            全商品ランキングを見る
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載しているスペック・価格は参考値です。最新の製品情報は各メーカー公式サイトでご確認ください。コンタクトレンズは医療機器のため、初めてご使用の方は必ず眼科を受診してください。
        </p>
      </section>
    </div>
  ),

  'menicon-contact-osusume': (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">メニコンの特徴</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          メニコン（Menicon）は1951年創業の日本最大のコンタクトレンズ専業メーカーです。
          国産ブランドならではの品質管理と日本人の眼形状に合わせた設計が特徴で、特に高い酸素透過率のレンズ開発で定評があります。
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
          <p className="font-semibold text-gray-800 mb-2 text-sm">メニコンの主なラインナップ</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">シリーズ名</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">交換周期</th>
                  <th className="text-left py-2 text-gray-600 font-semibold">特徴</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['メニコンワンデー', '1day', 'シリコーンHG素材・高酸素透過率'],
                  ['シード ワンデー ピュアUV', '1day', 'UV保護・薄型設計'],
                  ['2week Menicon Premio', '2week', 'Dk/t 161・高酸素透過率'],
                  ['1month Menicon', 'マンスリー', '薄型デザイン・使いやすい'],
                  ['1month Menicon Toric', 'マンスリー', '乱視用・安定したフィット感'],
                ].map(([name, period, feature]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-semibold text-gray-700">{name}</td>
                    <td className="py-2 pr-4 text-gray-600">{period}</td>
                    <td className="py-2 text-gray-600">{feature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">メニコン商品のおすすめポイント別選び方</h2>
        <div className="space-y-3">
          {[
            { category: '長時間装用・仕事中重視の方', product: '2week Menicon Premio', reason: 'Dk/t 161の高い酸素透過率で1日中装用しても角膜への負担が少ない。シリコーンハイドロゲル素材で乾燥感も軽減。' },
            { category: 'コスパ重視の方', product: '1month Menicon', reason: 'マンスリータイプは1日あたりのコストが最も安い。ケア用品代を含めても年間コストはワンデーの半分以下になることが多い。' },
            { category: '乱視がある方', product: '1month Menicon Toric / 2week Menicon Toric', reason: '乱視用（トーリック）レンズは軸の安定性が重要。メニコンのトーリックレンズは日本人の眼形状に合わせた設計でずれにくい。' },
            { category: '手軽に使いたい方', product: 'メニコンワンデー', reason: '1day使い捨てで毎日のケア不要。旅行・出張・週数回の使用に最適。シリコーンHG素材で乾きにくい。' },
          ].map(({ category, product, reason }) => (
            <div key={category} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm">{category}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{product}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">メニコンの最安値を確認する</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/brand/menicon" className="inline-block bg-slate-800 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            メニコン 商品一覧を見る
          </Link>
          <Link href="/ranking" className="inline-block border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            全商品ランキングを見る
          </Link>
        </div>
      </section>

      <section>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          ※ 掲載しているスペック・価格は参考値です。最新の製品情報はメニコン公式サイトでご確認ください。コンタクトレンズは医療機器のため、初めてご使用の方は必ず眼科を受診してください。
        </p>
      </section>
    </div>
  ),
};

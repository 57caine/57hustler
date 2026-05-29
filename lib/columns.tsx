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
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="text-left p-2 rounded">PWR値</th>
              <th className="text-left p-2">度数の目安</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-100"><td className="p-2">-0.25 〜 -1.00</td><td className="p-2">軽度の近視</td></tr>
            <tr className="border-b border-blue-100"><td className="p-2">-1.25 〜 -3.00</td><td className="p-2">中程度の近視（最も多い）</td></tr>
            <tr className="border-b border-blue-100"><td className="p-2">-3.25 〜 -6.00</td><td className="p-2">強度の近視</td></tr>
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">ワンデー（1日使い捨て）</h3>
          <p className="text-sm text-gray-700 mb-2">毎日新しいレンズを使う。衛生的で手入れ不要。</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ ケア用品が不要</li>
            <li>✓ 旅行・スポーツに便利</li>
            <li>✗ 1日あたりのコスト高め</li>
          </ul>
          <p className="text-sm font-bold text-blue-700 mt-2">月コスト目安：3,000〜8,000円</p>
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
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">コスパ最強</span>
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
              <th className="text-right p-3 border border-gray-200 font-bold text-blue-700">合計</th>
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
      <p className="text-sm text-gray-600 mb-6 bg-blue-50 rounded-lg p-3">
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
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
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
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">安定性No.1</span>
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">① 送料込みの価格で比較する</h3>
          <p className="text-sm text-gray-700">商品価格が安くても送料が高ければ意味がありません。必ず「送料込み最終価格」で比較しましょう。</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">② まとめ買い割引を活用する</h3>
          <p className="text-sm text-gray-700">多くのショップで6箱・8箱まとめ買いで割引があります。3〜6ヶ月分まとめて買うとお得です。</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">③ 初回割引・クーポンを使う</h3>
          <p className="text-sm text-gray-700">多くのショップで初回購入割引（10〜20%オフ）があります。新規登録時のクーポンも活用しましょう。</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">④ 正規品かどうか確認する</h3>
          <p className="text-sm text-gray-700">高度管理医療機器販売許可を取得した正規ショップで購入することが安全です。</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">主要通販ショップの特徴比較</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-100">
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
            <tr className="bg-blue-100">
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">目の乾きが気になる → オアシス</h3>
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-3">オアシス ワンデー</h3>
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">度ありカラコン</h3>
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
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">アキュビュー品質</span>
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
            <tr className="bg-blue-100">
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
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">MPS（マルチパーパスソリューション）</h3>
          <p className="text-sm text-gray-700">洗浄・すすぎ・消毒・保存が1本でできるオールインワン洗浄液。最もよく使われる。</p>
          <p className="text-sm font-medium text-blue-700 mt-2">代表例：レニュー、バイオクレン、AOセプト</p>
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
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="font-bold text-blue-800 mb-2">酸素透過率（Dk/t値）の比較</h3>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="bg-blue-100">
              <th className="text-left p-2">素材</th>
              <th className="text-left p-2">Dk/t値の目安</th>
              <th className="text-left p-2">代表商品</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-100">
              <td className="p-2">ヒドロゲル（従来素材）</td>
              <td className="p-2">20〜35</td>
              <td className="p-2">アキュビュー モイスト</td>
            </tr>
            <tr className="border-b border-blue-100">
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
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">シリコーンHG</span>
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
            <tr className="bg-blue-100">
              <th className="text-left p-3 border border-slate-200">タイプ</th>
              <th className="text-left p-3 border border-slate-200">レンズ代/年</th>
              <th className="text-left p-3 border border-slate-200">ケア用品/年</th>
              <th className="text-left p-3 border border-slate-200">合計/年</th>
              <th className="text-left p-3 border border-slate-200">月換算</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-blue-700">1day（普及タイプ）</td>
              <td className="p-3 border border-gray-200">約30,000〜40,000円</td>
              <td className="p-3 border border-gray-200">不要</td>
              <td className="p-3 border border-gray-200 font-bold">約30,000〜40,000円</td>
              <td className="p-3 border border-gray-200">2,500〜3,300円</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-200 font-bold text-blue-700">1day（プレミアム）</td>
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
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">週3〜4日のみ装用する方 → ワンデーが最安</h3>
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
};

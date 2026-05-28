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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">PWR（度数）とは？</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">BC（ベースカーブ）とは？</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">DIA（直径）とは？</h2>
      <p className="mb-4">
        <strong>DIA（Diameter）</strong>はレンズの直径を表します。通常の透明コンタクトは<strong>13.8〜14.5mm</strong>が一般的です。
        カラーコンタクトには14.5mm以上の大きめサイズもあります（デカ目効果）。
      </p>
      <p className="mb-4">
        同じブランドの商品でもDIAが異なることがありますが、DIAが違っても同じ度数を注文できます。
        ただし、前回と異なるDIAの商品に変更する場合は眼科での確認を推奨します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">乱視用のパラメータ（CYL・AXIS）</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">処方箋の右目・左目の見分け方</h2>
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

      <div className="bg-blue-600 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">処方された商品を最安値で購入する</h3>
        <p className="text-blue-100 mb-4">度数がわかったら、当サイトで最安値ショップを比較しましょう。</p>
        <Link href="/ranking" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">コンタクトレンズは「高度管理医療機器」</h2>
      <p className="mb-4">
        コンタクトレンズは<strong>高度管理医療機器（クラスIII）</strong>に分類されており、目に直接触れる医療器具です。
        眼科での処方・定期検査が推奨されていますが、法律上は処方箋の提示なしに購入できます。
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">重要なポイント</p>
        <p className="text-sm mt-1">初めてコンタクトを使う場合や、度数を変更する場合は、必ず眼科を受診してください。目に合わない度数のコンタクトを使い続けると、視力低下や目のトラブルを引き起こす可能性があります。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">通販で安全に購入するための3条件</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">通販ショップの選び方</h2>
      <p className="mb-4">通販でコンタクトを買う場合は、以下のポイントを確認しましょう。</p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li><strong>高度管理医療機器販売許可を取得しているか</strong>（正規ショップの証）</li>
        <li><strong>日本の正規品を販売しているか</strong>（並行輸入品は注意）</li>
        <li><strong>送料込みの価格で比較する</strong>（送料無料のショップがお得）</li>
        <li><strong>まとめ買い割引があるか</strong>（6箱・8箱セットが安い場合が多い）</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">おすすめ通販ショップの比較</h2>
      <p className="mb-4">
        当サイトでは24店舗のコンタクト通販ショップの価格を毎日比較しています。
        商品によって最安値ショップが異なるため、購入前に必ず比較することをおすすめします。
      </p>
      <div className="bg-blue-600 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">今すぐ最安値を比較する</h3>
        <p className="text-blue-100 mb-4">アキュビュー、デイリーズ、シードなど人気商品の価格を一括比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
            ワンデーを比較
          </Link>
          <Link href="/category/2week" className="inline-block bg-white text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">まず眼科へ行こう</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">種類の違いを知ろう</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">初心者にはワンデーがおすすめ</h2>
      <p className="mb-4">
        初めてコンタクトを使う方には<strong>ワンデー（1日使い捨て）</strong>を強くおすすめします。理由は3つ：
      </p>
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
        <li><strong>ケア用品が不要</strong>なので、管理が簡単</li>
        <li><strong>毎日新しいレンズ</strong>なので目のトラブルが起きにくい</li>
        <li>万が一合わなくても<strong>翌日からやめられる</strong>リスクが低い</li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">初心者におすすめのワンデーコンタクト</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">人気No.1</span>
            <span className="text-xs text-gray-500">アキュビュー</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">1デイ アキュビュー モイスト</h3>
          <p className="text-xs text-gray-600 mb-2">LACREON技術で乾きを防ぐ。初心者に最も人気。</p>
          <Link href="/product/acuvue-moist-1day" className="text-blue-600 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">コスパ最強</span>
            <span className="text-xs text-gray-500">シード</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">ワンデーピュア うるおいプラス</h3>
          <p className="text-xs text-gray-600 mb-2">国産品質でリーズナブル。コスパを重視する方に。</p>
          <Link href="/product/seed-1day-pure" className="text-blue-600 text-sm font-medium hover:underline">最安値を見る →</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">通販での購入手順</h2>
      <ol className="list-decimal list-inside mb-6 space-y-3 text-gray-700">
        <li><strong>眼科で処方箋（度数・BCなど）を確認</strong></li>
        <li><strong>当サイトで最安値ショップを比較</strong>（商品ページで全店舗の価格一覧）</li>
        <li><strong>最安値ショップで注文</strong>（度数・BC・DIAを正確に入力）</li>
        <li><strong>最短翌日〜2日で自宅に届く</strong></li>
      </ol>

      <div className="bg-blue-600 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">人気ワンデーコンタクトを比較する</h3>
        <p className="text-blue-100 mb-4">初心者におすすめの商品一覧。最安値ショップがすぐわかります。</p>
        <Link href="/category/1day" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">コンタクトで目が乾く原因</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">乾きにくいレンズの選び方</h2>
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

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">乾きにくいコンタクトおすすめ7選</h2>
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
              <Link href={`/product/${item.slug}`} className="text-blue-600 text-sm font-medium hover:underline">最安値を確認 →</Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">乾燥対策のその他のポイント</h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li>意識的にまばたきを増やす（特にPC・スマホ使用中）</li>
        <li>コンタクト用目薬（人工涙液）を活用する</li>
        <li>装用時間を守る（ワンデーなら16時間以内）</li>
        <li>室内の加湿（湿度40〜60%が理想）</li>
      </ul>

      <div className="bg-blue-600 text-white rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-2">乾きにくいコンタクトを最安値で購入する</h3>
        <p className="text-blue-100 mb-4">気になった商品の最安値ショップを今すぐ比較できます。</p>
        <Link href="/ranking" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          全商品の価格を比較する →
        </Link>
      </div>
    </div>
  ),
};

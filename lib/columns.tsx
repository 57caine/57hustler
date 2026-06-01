import Link from 'next/link';

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  headings?: string[];
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
    headings: ['PWR（度数）とは？', 'BC（ベースカーブ）とは？', 'DIA（直径）とは？', '乱視用のパラメータ（CYL・AXIS）', '処方箋の右目・左目の見分け方'],
  },
  {
    slug: 'shohosen-nashi-tsuuhan',
    title: '処方箋なしでコンタクトレンズを通販購入できる？正しい買い方ガイド',
    description: '「処方箋なしでネット購入できるの？」という疑問に回答。法律上の扱いと安全な購入方法、おすすめ通販ショップを紹介。',
    category: '購入ガイド',
    publishedAt: '2026-05-05',
    updatedAt: '2026-05-28',
    readingTime: 6,
    headings: ['コンタクトレンズは「高度管理医療機器」', '通販で安全に購入するための3条件', '通販ショップの選び方', 'おすすめ通販ショップの比較'],
  },
  {
    slug: 'hajimete-erabikata',
    title: '初めてコンタクトレンズを選ぶ方法【種類・価格・手順を全解説】',
    description: '1day・2week・monthlyの違い、初心者におすすめの種類、価格の目安、購入手順まで。コンタクト初心者向け完全ガイド。',
    category: '購入ガイド',
    publishedAt: '2026-05-10',
    updatedAt: '2026-05-28',
    readingTime: 8,
    headings: ['まず眼科へ行こう', '種類の違いを知ろう', '初心者にはワンデーがおすすめ', '初心者におすすめのワンデーコンタクト', 'ネット通販での購入の流れ（6ステップ）', '処方箋について知っておこう', '送料を含めた実際のコスト計算例', 'よくある質問（Q&A）'],
  },
  {
    slug: 'kanso-shinikui-contact',
    title: '目が乾きにくいコンタクトレンズおすすめ7選【乾燥が気になる人向け】',
    description: '長時間装用でも目が乾きにくいコンタクトレンズを厳選。素材・含水率の選び方から、乾燥対策まで詳しく解説。',
    category: '商品比較',
    publishedAt: '2026-05-15',
    updatedAt: '2026-05-28',
    readingTime: 7,
    headings: ['コンタクトで目が乾く原因', '乾きにくいレンズの選び方', '乾きにくいコンタクトおすすめ7選', '乾燥対策のその他のポイント'],
  },
  {
    slug: 'ranshi-contact-erabikata',
    title: '乱視用コンタクトレンズの選び方【軽度・中等度別おすすめ】',
    description: '乱視の度数（CYL）・軸度（AXIS）の意味から、乱視用ワンデー・2weekの選び方まで徹底解説。軽度・中等度別におすすめ商品も紹介。',
    category: '商品比較',
    publishedAt: '2026-05-18',
    updatedAt: '2026-05-28',
    readingTime: 7,
    headings: ['乱視とは？CYL・AXISの意味', '乱視用コンタクトの仕組み', '軽度・中等度別おすすめ乱視用コンタクト', '乱視用コンタクトを選ぶ際の注意点'],
  },
  {
    slug: 'contact-kakaku-hikaku-2024',
    title: 'コンタクトレンズ通販サイト価格比較【2026年版・送料込み最安値】',
    description: 'レンズクイック・アットレンズ・24lensなど主要24ショップの特徴と価格帯を比較。まとめ買い割引・送料無料条件も詳しく解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-19',
    updatedAt: '2026-05-28',
    readingTime: 5,
    headings: ['コンタクト通販サイトを選ぶポイント', '主要通販ショップの特徴比較', '商品別最安値を比較する', '賢い節約術まとめ'],
  },
  {
    slug: 'acuvue-zenkindai-hikaku',
    title: 'アキュビュー全種類の違いを比較【どれが自分に合う？】',
    description: 'アキュビュー オアシス・モイスト・トゥルーアイなど全ラインナップの違いを徹底比較。目の乾き・装用時間・価格で選ぶポイントを解説。',
    category: '商品比較',
    publishedAt: '2026-05-20',
    updatedAt: '2026-05-28',
    readingTime: 8,
    headings: ['アキュビューのラインナップ一覧', '目的別・おすすめアキュビューはこれ', 'オアシスとモイストの違い'],
  },
  {
    slug: 'colorcl-hajimete-guide',
    title: 'カラコン初心者ガイド【自然に見える選び方・安全な使い方】',
    description: '初めてカラコンを選ぶ方向けに、自然に見えるカラーの選び方、度あり・度なしの違い、安全な使い方を解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-21',
    updatedAt: '2026-05-28',
    readingTime: 6,
    headings: ['カラコンとは？基本知識', '度あり vs 度なしカラコンの違い', '自然に見えるカラコンの選び方', '初心者におすすめのカラコン', '安全な使い方のポイント'],
  },
  {
    slug: 'contact-kaigai-vs-kokunai',
    title: 'コンタクトレンズ 海外製 vs 国産の違いは？選ぶポイント',
    description: 'アキュビュー（アメリカ）、シード・メニコン（日本）など国産・海外製の違いを比較。品質・価格・入手しやすさの観点から解説。',
    category: '商品比較',
    publishedAt: '2026-05-22',
    updatedAt: '2026-05-28',
    readingTime: 5,
    headings: ['日本の主要コンタクトブランドまとめ', '国産コンタクトのメリット・デメリット', '海外製コンタクトのメリット・デメリット', '結論：どちらを選ぶべき？'],
  },
  {
    slug: 'contact-maintenance',
    title: 'コンタクトレンズのケア方法【2week・マンスリーの正しい洗い方】',
    description: '2週間・マンスリーコンタクトの正しいケア方法。洗浄液の選び方、保存方法、NGな行為をわかりやすく解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-23',
    updatedAt: '2026-05-28',
    readingTime: 6,
    headings: ['なぜケアが必要？', '正しいケアの手順', '洗浄液の種類と選び方', '絶対にやってはいけないNG行為'],
  },
  {
    slug: 'silicon-hydrogel-merit',
    title: 'シリコーンハイドロゲルコンタクトとは？通常素材との違いと選ぶメリット',
    description: '高酸素透過率のシリコーンハイドロゲル素材のメリット・デメリットを解説。長時間装用・PC作業が多い人におすすめの理由とは。',
    category: '商品比較',
    publishedAt: '2026-05-24',
    updatedAt: '2026-05-28',
    readingTime: 6,
    headings: ['シリコーンハイドロゲルとは？', 'シリコーンハイドロゲルのメリット', 'シリコーンハイドロゲルのデメリット', 'おすすめのシリコーンHGコンタクト'],
  },
  {
    slug: 'contact-nenkan-cost',
    title: 'コンタクトレンズの年間コストを比較【1day vs 2week vs monthly】',
    description: '1日使い捨て・2週間・マンスリーの年間コストをケア用品込みで比較。生活スタイル別に最もコスパが良い選択肢を提案。',
    category: '購入ガイド',
    publishedAt: '2026-05-25',
    updatedAt: '2026-05-28',
    readingTime: 5,
    headings: ['年間コスト比較の前提条件', 'タイプ別年間コスト比較', '生活スタイル別おすすめ', 'コスト削減のコツ'],
  },
  {
    slug: 'contact-tsuuhan-osusume-shop',
    title: 'コンタクトレンズ通販おすすめショップ10選【送料・価格・処方箋不要条件で比較】',
    description: 'アットレンズ・レンズゼロ・レンズクイックなど人気10ショップを送料・最安値・処方箋不要条件で徹底比較。初めての通販でも安心して選べる。',
    category: '購入ガイド',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['ショップを選ぶ3つのポイント', 'おすすめ通販ショップ一覧', '処方箋不要で購入できる条件', '価格比較の方法'],
  },
  {
    slug: 'acuvue-oasys-1day-review',
    title: 'ワンデーアキュビューオアシス 評判・最安値【乾きにくさNo.1の実力を検証】',
    description: 'ワンデーアキュビューオアシスの特徴・使い心地・実際の口コミを徹底検証。最安値ショップと処方箋不要で買える店もあわせて紹介。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
    headings: ['ワンデーアキュビューオアシスの特徴', 'スペック一覧', 'こんな人におすすめ', '最安値で購入する'],
  },
  {
    slug: 'bifocal-multifocal-contact',
    title: '遠近両用コンタクトレンズ 選び方ガイド【老眼・40代・老視の方へ】',
    description: '老眼鏡なしで近くも遠くも見える遠近両用コンタクト。種類の違い・装用感・おすすめ商品を解説。初めて遠近両用を使う方向け完全ガイド。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['遠近両用コンタクトの仕組み', 'おすすめ遠近両用コンタクト', '遠近両用を始める前に知っておくこと'],
  },
  {
    slug: '2week-contact-osusume',
    title: '2ウィークコンタクトおすすめ5選【2025年版・コスパ最強を徹底比較】',
    description: 'アキュビューオアシス・バイオフィニティ・プロクリアなど人気2weekコンタクトを徹底比較。価格・酸素透過率・乾燥感を基準にコスパ最強を選ぶ方法を解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
    headings: ['2ウィークコンタクトが選ばれる理由', '2ウィークコンタクト おすすめ5選', '2ウィークコンタクトを選ぶ際のチェックポイント'],
  },
  {
    slug: 'monthly-contact-hikaku',
    title: 'マンスリーコンタクトレンズ比較【2025年版・1枚あたりの最安値ランキング】',
    description: 'バイオフィニティ・エアオプティクス・クラリティなどマンスリーコンタクト人気商品の価格・酸素透過率・うるおいを比較。1ヶ月使い捨てのメリットと選び方も解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 6,
    headings: ['マンスリーコンタクトのメリットとデメリット', 'マンスリーコンタクト 価格・スペック比較', 'マンスリーケア用品のコストも考慮しよう'],
  },
  {
    slug: 'colorcon-ranking-2025',
    title: 'カラコン人気ランキング2025【ナチュラル系・盛り系・度あり別おすすめ】',
    description: '2025年おすすめカラコンをナチュラル・盛り系・度ありで分けてランキング。GEOベラ・アキュビュー ディファイン・フレッシュルックなど人気商品を徹底比較。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 7,
    headings: ['カラコン選びの基本：安全に使うための3つのポイント', 'カラコン人気ランキング2025【ナチュラル系】', 'カラコン人気ランキング2025【度あり・度数選び方】'],
  },
  {
    slug: 'ranshi-contact-ranking-2025',
    title: '乱視用コンタクトレンズ おすすめランキング2025【ワンデー・2week・マンスリー別】',
    description: '乱視（CYL・AXIS）に対応したトーリックコンタクトのおすすめを種類別にランキング。アキュビュー オアシス乱視用・デイリーズ トータルワン乱視用など人気商品を比較。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 8,
    headings: ['乱視用コンタクト（トーリックレンズ）とは', 'ワンデー乱視用コンタクト おすすめランキング', '2week乱視用コンタクト おすすめランキング', 'マンスリー乱視用コンタクト おすすめ', 'CYL・AXISの選び方と注意点'],
  },
  {
    slug: 'contact-chouji-so',
    title: '長時間装用向けコンタクトレンズ おすすめ5選【PC作業・残業が多い方へ】',
    description: '1日10時間以上コンタクトを使う方向けに、乾きにくく酸素透過率が高いコンタクトを厳選。シリコーンハイドロゲル素材の選び方と長時間装用のコツも解説。',
    category: '商品比較',
    publishedAt: '2026-05-29',
    updatedAt: '2026-05-29',
    readingTime: 6,
    headings: ['長時間装用で大切なのは「素材」', '長時間装用向けおすすめコンタクト5選', '長時間装用のケアポイント'],
  },
  {
    slug: 'dailies-total1-vs-oasys',
    title: 'デイリーズ トータルワン vs アキュビュー オアシス 徹底比較【どっちが良い？】',
    description: 'コンタクト最高峰2製品「デイリーズ トータルワン」と「アキュビュー オアシス 1day」を乾きにくさ・装用感・価格・素材スペックで徹底比較。あなたにはどちらが向いているかを解説。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
    headings: ['2大プレミアムレンズを徹底比較', '5つの観点で比較', 'あなたに向いているのはどっち？', '最安値を確認する'],
  },
  {
    slug: 'contact-dryeye-osusume',
    title: 'ドライアイ向けコンタクトレンズ おすすめランキング【目が乾く方必見】',
    description: 'ドライアイや目の乾燥が気になる方向けに、乾きにくいコンタクトレンズを厳選ランキング。シリコーンハイドロゲル素材・高含水タイプ・目薬との組み合わせ方も解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
    headings: ['ドライアイとコンタクトレンズの関係', 'ドライアイ向けコンタクト おすすめランキング', 'ドライアイとコンタクトの乾燥対策ケア', '各製品の最安値を確認する'],
  },
  {
    slug: 'contact-tsuhan-shop-hikaku',
    title: 'コンタクトレンズ通販おすすめショップ比較【2026年版・最安値24店舗】',
    description: 'レンズクイック・アットレンズ・24Lens・シンシアなどコンタクト通販の主要24店舗を価格・送料・配送速度・処方箋対応で比較。初めての通販でも安心な選び方ガイド。',
    category: '購入ガイド',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 9,
    headings: ['コンタクトレンズ通販を選ぶ5つのポイント', '主要通販ショップ特徴まとめ', 'ランキングで最安値を確認する'],
  },
  {
    slug: 'acuvue-moist-vs-oasys-chigai',
    title: 'アキュビュー モイスト vs アキュビュー オアシス 違いを徹底比較【どっちを選ぶ？】',
    description: 'アキュビューの定番2モデル「モイスト」と「オアシス」の違いを乾きにくさ・価格・酸素透過率・素材で比較。用途・予算別にどちらが合うか選び方を解説します。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
    headings: ['アキュビュー モイストとオアシスの基本スペック比較', 'モイストとオアシス 4つの違い', 'どちらを選べばいい？', '最安値を確認する'],
  },
  {
    slug: 'contact-2week-osusume',
    title: '2weekコンタクトレンズ おすすめランキング2026年版【コスパ・乾きにくさ別】',
    description: 'アキュビュー オアシス・シード 2ウィークピュア・バイオフィニティなど人気2weekコンタクト7選を比較。コスパ重視・乾きにくさ重視・乱視用など目的別のおすすめをランキング形式で解説。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 8,
    headings: ['2weekコンタクトのメリット・デメリット', 'おすすめ2weekコンタクト ランキング', '2weekコンタクトの最安値を比較する'],
  },
  {
    slug: 'menicon-contact-osusume',
    title: 'メニコン コンタクトレンズ おすすめ比較【1day・2week・マンスリー対応】',
    description: 'メニコンの人気コンタクトレンズを1day・2week・マンスリー別に比較。1monthメニコン・めにサポなど各シリーズの違い、特徴、最安値の調べ方を解説します。',
    category: '商品比較',
    publishedAt: '2026-05-30',
    updatedAt: '2026-05-30',
    readingTime: 7,
    headings: ['メニコンの特徴', 'メニコン商品のおすすめポイント別選び方', 'メニコンの最安値を確認する'],
  },
  {
    slug: 'soft-vs-hard-contact-hikaku',
    title: 'ソフトコンタクトレンズとハードコンタクトの違いを完全比較【どちらが自分に合う？】',
    description: 'ソフトとハードコンタクトの装用感・費用・矯正力・手入れの手間を徹底比較。乱視や高度近視の方への適性や、それぞれのメリット・デメリットをわかりやすく解説。',
    category: '商品比較',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 7,
    headings: ['ソフトとハード、根本的な違いとは', 'ソフトコンタクトのメリット・デメリット', 'ハードコンタクトのメリット・デメリット', '費用と維持コストの比較', '乱視・高度近視への適性', 'どちらを選べばいい？タイプ別おすすめ'],
  },
  {
    slug: 'ranshi-contact-ranking-erabikata',
    title: '乱視用コンタクトレンズの選び方と人気ランキング2026【トーリックレンズ完全ガイド】',
    description: '乱視の程度（CYL）・軸度（AXIS）別に最適なトーリックコンタクトを選ぶ方法と、ワンデー・2week・マンスリー別人気ランキングを徹底解説。',
    category: '商品比較',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 8,
    headings: ['乱視とは何か？トーリックレンズが必要な理由', '乱視の度数（CYL）・軸度（AXIS）の読み方', '装用スタイル別おすすめ乱視用コンタクト', '人気乱視用コンタクトランキング2026', '乱視用レンズを選ぶ際の注意点', 'よくある質問'],
  },
  {
    slug: 'shoshinsha-contact-guide',
    title: 'コンタクトレンズ初心者が失敗しない購入ガイド【眼科・種類・通販の選び方】',
    description: '初めてコンタクトを買う方向けに、眼科受診から種類の選び方、通販での安全な購入手順まで失敗しないポイントをステップ形式で解説。',
    category: '購入ガイド',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 7,
    headings: ['まず眼科を受診しよう', 'コンタクトレンズの種類と選び方', '処方箋の見方と必要なパラメータ', 'はじめての通販購入ステップ', '初心者が失敗しやすいポイントと対策', '購入後のケア・定期検査について'],
  },
  {
    slug: 'multifocal-contact-rogansetsu',
    title: '遠近両用コンタクトレンズ比較2026【老眼・老視対策・おすすめ商品ランキング】',
    description: '老眼で近くが見えにくくなった方向けに、遠近両用コンタクトの仕組みから選び方、人気商品の比較まで徹底解説。老眼鏡なしで快適に過ごすための完全ガイド。',
    category: '商品比較',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 8,
    headings: ['遠近両用コンタクトが必要になるサイン', '遠近両用コンタクトの仕組みと種類', '同時視タイプと交互視タイプの違い', '人気遠近両用コンタクトランキング', '遠近両用コンタクトを始める前に知っておくこと', '老眼鏡との使い分け方'],
  },
  {
    slug: 'colorcl-doari-donashi-guide',
    title: 'カラコン度あり・度なしの選び方ガイド【近視・乱視対応・安全な使い方】',
    description: '度あり・度なしカラコンの違いと選び方を解説。近視・乱視のある方が度入りカラコンを選ぶポイント、おすすめ商品と安全な使用方法も紹介。',
    category: '購入ガイド',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 6,
    headings: ['度あり・度なしカラコンとは', '度ありカラコンが必要な人・不要な人', '度ありカラコンのパラメータ（PWR・BC・DIA）の見方', '度ありカラコンおすすめ商品', '度なしカラコンの注意点と適切な使い方', '安全に楽しむための使用ルール'],
  },
  {
    slug: 'contact-dosu-mikata-erabikata',
    title: 'コンタクトレンズの度数の見方と選び方【PWR・BC・DIAを正しく理解しよう】',
    description: 'コンタクトレンズの処方箋に書かれたPWR・BC・DIAの意味を解説。眼鏡との度数の違い、乱視用のCYL・AXIS、通販で正しく選ぶための完全ガイド。',
    category: '度数・処方箋',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 6,
    headings: ['コンタクトレンズの処方箋を読む前に', 'PWR（度数）の意味と近視・遠視の違い', 'BC（ベースカーブ）とDIA（直径）の見方', '乱視用CYL・AXISの読み方', '眼鏡の度数とコンタクトの度数の違い', '通販で間違えないための確認ポイント'],
  },
  {
    slug: 'dryeye-contact-sentaku',
    title: 'ドライアイに悩む人のためのコンタクトレンズ選び【乾きにくいレンズ完全ガイド】',
    description: 'ドライアイの方がコンタクトを快適に使うための素材・含水率・装用時間の選び方を解説。乾きにくいシリコーンハイドロゲルレンズのおすすめランキングも紹介。',
    category: 'ケア・健康',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 7,
    headings: ['ドライアイとコンタクトレンズの関係', '乾きにくいコンタクトを選ぶ3つのポイント', 'シリコーンハイドロゲル vs 含水率高いハイドロゲル', 'ドライアイ向けおすすめコンタクトレンズ', '目薬・人工涙液との正しい組み合わせ方', 'ドライアイを悪化させないための装用習慣'],
  },
  {
    slug: 'student-shufu-contact-setsuyaku',
    title: '学生・主婦向けコンタクトレンズ節約術【年間コストを半額にする方法】',
    description: '学生・主婦の方がコンタクトレンズ代を節約するための種類選び・通販活用・まとめ買いのコツを解説。生活スタイル別に年間コストを最安値にする方法を紹介。',
    category: 'お得情報',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 6,
    headings: ['コンタクト代を節約するための基本戦略', '種類別コスト比較（1day・2week・マンスリー）', '通販vsドラッグストア・眼科での価格差', 'まとめ買いと定期購入でさらに節約', '学生・主婦におすすめのコスパ重視商品', '節約しながら目の健康を守るポイント'],
  },
  {
    slug: 'contact-care-guide-yohin-hikaku',
    title: 'コンタクトレンズの正しいケア方法とケア用品比較【2weekマンスリー向け完全解説】',
    description: '2week・マンスリーコンタクトの正しい洗浄・保存手順と、MPS・過酸化水素系洗浄液の選び方を詳しく解説。NG行為とトラブル予防のポイントも紹介。',
    category: 'ケア・健康',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 7,
    headings: ['なぜコンタクトのケアが重要なのか', '正しいケアの基本ステップ', 'MPS（マルチパーパスソリューション）の選び方', '過酸化水素系洗浄液とMPSの違い', '絶対にやってはいけないNG行為', 'ケア用品のコスト比較とおすすめ商品'],
  },
  {
    slug: '1day-vs-2week-dotchiga-otoku',
    title: '使い捨てコンタクト1dayと2weekどっちがお得？年間コスト・手間を徹底比較',
    description: '1日使い捨てと2週間交換コンタクトの年間コスト・利便性・手間を徹底比較。生活スタイル・使用頻度別にどちらを選ぶべきか、損をしない選び方を解説。',
    category: 'お得情報',
    publishedAt: '2026-05-31',
    updatedAt: '2026-05-31',
    readingTime: 6,
    headings: ['1dayと2weekの基本的な違い', '年間コスト比較（ケア用品込み）', '使用頻度別・どちらがお得か', '手間・利便性の比較', '1dayがおすすめな人・2weekがおすすめな人', '最安値通販で賢く購入する方法'],
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'コンタクトの度数と眼鏡の度数は同じですか？', a: '異なります。眼鏡は目から約12mm離れたレンズで矯正するのに対し、コンタクトは目に直接装用するため、屈折距離が違います。近視の場合、眼鏡よりコンタクトの度数がやや弱くなるのが一般的。自己判断で眼鏡の度数をそのままコンタクトに流用せず、眼科での処方を受けてください。' },
            { q: 'BC（ベースカーブ）が合っていないとどうなりますか？', a: 'BCが小さすぎる（きつすぎる）と角膜を締め付けて酸素不足・充血・痛みが生じます。BCが大きすぎる（ゆるすぎる）とレンズがずれやすく、ゴロゴロ感・視力の不安定さが起きます。BCは眼科でのフィッティング検査が必要。通販で自己判断するのはNGです。' },
            { q: '度数を自己判断で変えてもいいですか？', a: '絶対にNGです。度数が合っていないコンタクトを使い続けると、視力低下・眼精疲労・頭痛の原因になるだけでなく、眼の病気を見落とすリスクもあります。「なんとなく見えにくくなった」と感じたら、まず眼科を受診してください。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '初めてコンタクトを使う場合も処方箋なしで通販購入できますか？', a: '初めての方は必ず眼科を受診してください。BC（ベースカーブ）・度数・DIA（直径）は人によって異なり、目に合わないレンズを使い続けると角膜障害などのリスクがあります。処方箋なし通販は「すでに使用中の同じ商品を継続購入する方」が前提です。' },
            { q: '処方箋の有効期限はどれくらいですか？', a: '一般的に処方箋の有効期限は発行から1年以内とされています（法律で定められているわけではありませんが、多くの眼科・ショップがこの基準を採用）。視力・角膜の状態は変化するため、1年ごとの定期検査と処方箋更新を推奨します。' },
            { q: '並行輸入品（海外品）と国内正規品の違いは何ですか？', a: '国内正規品は日本の薬機法基準をクリアし、品質・情報表示（日本語添付文書）が保証されています。並行輸入品は価格が安いケースもありますが、品質管理や適切な情報が保証されません。万が一トラブルがあった際のサポートも受けにくいため、信頼できる国内正規代理店のショップで購入することを強くおすすめします。' },
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

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-slate-200">おすすめランキング商品の最安値を今すぐ確認</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {[
          { name: 'デイリーズ トータルワン', brand: 'アルコン', slug: 'dailies-total1', badge: '乾きにくさ最強' },
          { name: 'アキュビュー オアシス 1day', brand: 'J&J', slug: 'acuvue-oasys-1day', badge: 'HydraLuxe技術' },
          { name: 'バイオトゥルー ONEday', brand: 'ボシュロム', slug: 'biotrue-oneday', badge: '含水率78%' },
          { name: 'ネオサイト ワンデー SiHy UV', brand: 'シード', slug: 'neo-sight-1day', badge: '国産・コスパ' },
        ].map(({ name, brand, slug, badge }) => (
          <Link key={slug} href={`/product/${slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mb-2">{badge}</span>
            <p className="font-bold text-gray-900 text-sm mb-0.5">{name}</p>
            <p className="text-xs text-gray-500 mb-3">{brand}</p>
            <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る →</span>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-slate-200">乾燥感の原因と対処法まとめ</h2>
      <p className="mb-4 text-gray-700">コンタクトの乾燥感は「レンズの素材・含水率」だけでなく、日常の使い方や環境も大きく影響します。以下のポイントを押さえることで、同じレンズでも快適さが大きく変わります。</p>
      <div className="space-y-3 mb-8">
        {[
          { title: '装用時間を守る', body: 'どんなに高品質なレンズでも、12〜16時間を超えた装用は角膜への酸素供給が限界に近づきます。帰宅後はなるべく早く外し、眼鏡で過ごす習慣をつけましょう。' },
          { title: 'コンタクト対応の目薬を使う', body: '「コンタクト装用中OK」の防腐剤フリー目薬を1〜2時間おきに点眼するだけで乾燥感が大幅に改善します。ソフトサンティア・ロートコンタクトシリーズが代表的です。' },
          { title: '環境を整える', body: '冷暖房の風が直接目に当たらない席を選ぶ、加湿器で室内湿度を40〜60%に保つ、PCディスプレイの明るさを下げる、の3つが最も効果的です。' },
          { title: '定期的な眼科受診', body: '乾燥感が続く場合はドライアイが進行している可能性があります。年1〜2回の眼科検診で適切なレンズ選定と処方を見直してもらいましょう。' },
        ].map(({ title, body }) => (
          <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-slate-200">よくある質問</h2>
      <div className="space-y-3 mb-8">
        {[
          {
            q: '含水率が高いレンズの方が乾きにくいですか？',
            a: '必ずしもそうではありません。含水率が高いレンズは初期のうるおいは豊富ですが、逆に大気中の水分を多く吸収しようとするため、乾燥した環境では蒸発しやすくなります。乾燥感対策には「シリコーンハイドロゲル素材」と「表面保湿コーティング」の組み合わせが最も効果的です。',
          },
          {
            q: 'ハードコンタクトはソフトより乾きにくいですか？',
            a: 'ハードコンタクト（RGP）は酸素透過率が非常に高く、涙液交換が活発なため長時間装用でも乾燥感が少ないとされます。ただし装用感に慣れるまで時間がかかり、激しい運動時にずれやすいデメリットがあります。',
          },
          {
            q: 'ワンデーと2weekではどちらが乾きにくいですか？',
            a: '一般的にワンデーの方が新品のレンズを毎日使うため、タンパク汚れが蓄積せず快適さを維持しやすいです。ただし2weekでも高品質なシリコーンHGレンズ（アキュビュー オアシス 2weekなど）は乾きにくい設計になっています。',
          },
        ].map(({ q, a }) => (
          <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
            <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
            </summary>
            <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
              <span className="text-emerald-600 font-bold">A. </span>{a}
            </div>
          </details>
        ))}
      </div>

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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '乱視用コンタクトのパラメータにはどんな数字がありますか？', a: '通常の球面レンズの度数（PWR）に加え、CYL（円柱度数：-0.75、-1.25、-1.75など）とAXIS（乱視軸：0〜180度）が追加されます。自分の乱視の種類・軸・度数は眼科で検査してもらう必要があります。ショッピングサイトでは商品ページで選択できる項目として表示されます。' },
            { q: '乱視が軽い場合、普通の球面レンズでもいいですか？', a: '乱視が軽微（0.50D以下）の場合、球面レンズでもそれほど不自由を感じない方もいます。ただし、夜間の光がにじむ・長時間使用で目が疲れやすいなどの症状がある場合は乱視用を試してみる価値があります。眼科でどちらが合うかフィッティングしてもらうのが最善です。' },
            { q: '乱視用コンタクトは値段が高いですか？', a: '球面レンズに比べて1箱あたり500〜1,500円程度高いのが一般的です。ただし通販での最安値を比較すると、眼科処方価格より30〜50%程度安く購入できることが多いです。乱視があるのに球面レンズを使い続けて目を酷使するより、正確に矯正するほうが長期的に目の健康を守れます。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'コンタクトレンズの価格が上がっている理由は何ですか？', a: '円安による輸入コストの上昇、原材料・物流費の高騰、エネルギー費の上昇が主な要因です。主要メーカー（アキュビュー・アルコン等）の多くが2022〜2024年に値上げを実施しました。ただし、通販では競合ショップ間の価格競争により、メーカー希望小売価格より30〜50%安く購入できるケースが多いです。' },
            { q: 'コンタクトレンズの期限（使用期限）を過ぎたものを使っても大丈夫ですか？', a: '絶対にNGです。未開封でも保存液の品質が変化しており、レンズの素材も劣化している可能性があります。期限切れレンズの装用は感染・炎症リスクがあります。未開封で期限が切れてしまった場合は廃棄してください。通販での大量購入は使用期限（通常2〜5年）を確認してから行いましょう。' },
            { q: '眼科で買うコンタクトと通販で買うコンタクトは同じ商品ですか？', a: 'はい、同じ商品です。商品名・度数・BC・DIAが同一であれば、眼科院内販売も通販も同一製品です。違いは価格で、眼科院内は定価に近い価格、通販は送料込みで20〜50%程度安いケースが一般的。処方・定期検査は眼科で受け、購入は通販でというスタイルが経済的に最適です。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'アキュビューモイストとオアシスの一番の違いは何ですか？', a: '素材と乾燥感です。モイストはヒドロゲル素材（Dk/t 28）、オアシスはシリコーンハイドロゲル素材（1day版：Dk/t 121）。酸素透過率に大きな差があり、オアシスのほうが長時間装用・ドライアイ傾向の方に向いています。価格はオアシスが1箱1,000〜2,000円高め。乾燥が気になるならオアシス、コスト優先ならモイストが選ばれます。' },
            { q: 'アキュビューオアシス1dayと2week版、乾きにくさはどちらが上ですか？', a: 'ほぼ同等と評価されていますが、多くのユーザーが1day版（ワンデーアキュビューオアシス）をわずかに上と評価する傾向があります。1day版はHydraLuxe™テクノロジー、2week版はHYDRACLEAR Plus™と、どちらも独自技術を搭載。1dayは交換の手間がなく清潔で、2weekはコスパが良い。ライフスタイルで選んで問題ありません。' },
            { q: 'アキュビュー製品はどこで一番安く買えますか？', a: 'コンタクトレンズの通販ショップ間で価格競争があり、同じ商品でも1箱あたり数百〜1,500円程度の差があります。眼科での処方購入より通販のほうが20〜50%安いケースが多いです。当サイトでは主要ショップの送料込み最安値を比較できます。まとめ買いとクーポンを組み合わせると年間で1〜3万円節約できることも。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'カラコンは初めてコンタクトを使う方でも使えますか？', a: '使えますが、初めての方は必ず眼科でBC・度数・DIAを処方してもらってください。カラコンも通常のコンタクト同様に「高度管理医療機器」で医療機器です。自己判断でサイズ・度数を決めると角膜障害のリスクがあります。眼科受診後に処方内容に合ったカラコンを選びましょう。' },
            { q: '度なしカラコンでも眼科受診は必要ですか？', a: 'はい、必要です。度なしカラコンも医療機器のため、初回は眼科でBC（ベースカーブ）を確認することが推奨されています。BC8.6が標準ですが、8.5や8.8が合う方もいます。合わないBCのレンズを使い続けると角膜を傷つける危険性があります。' },
            { q: 'カラコンはどれくらい色が変わりますか？', a: '瞳の元の色・明るさによって発色が異なります。元の瞳が黒・濃い茶色の場合、はっきりした発色のカラコンでも薄付きに見えることがあります。ライトブラウン・ブルーグレー系は暗い瞳でも自然に発色しやすい。ビビッドカラー（緑・ブルー）はコスプレ向けで日常使いには不自然に見える場合も。選ぶ前にブランド公式サイトの装着イメージ画像を必ず確認しましょう。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '海外通販でコンタクトレンズを買う際のリスクは何ですか？', a: '主なリスクは①品質保証なし（検品・保管状態が不明）、②日本向けの正規品ではないため薬機法基準外の可能性、③万が一の問題時にサポートが受けにくい、④個人輸入の税関トラブル、の4点。特にカラコンや処方の難しい度数では品質の差が目に直接影響します。' },
            { q: '海外製コンタクトレンズは国内品より本当に安いですか？', a: 'カタログ価格は安い場合もありますが、送料・関税・支払い手数料を含めると大差ないケースも。また国内通販ショップでも眼科定価の30〜50%安で購入できるため、リスクを取って海外通販を使うメリットは薄れています。国内最安値を通販比較サイトで確認してから判断することをおすすめします。' },
            { q: 'コンタクトレンズの個人輸入は違法ですか？', a: '個人使用の範囲内であれば違法ではありませんが、薬機法上グレーゾーンです。販売（転売）は違法。品質基準が日本と異なる製品を自己責任で使用することになります。目の健康リスクを考えると、国内の正規ショップで購入することを強くおすすめします。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'MPS（マルチパーパスソリューション）とポビドンヨード消毒の違いは？', a: 'MPSは洗浄・すすぎ・消毒・保存が1本でできる便利なケア用品で最も普及しています。ポビドンヨード系（アイミー プラチナム等）は殺菌力が高く、アカントアメーバなど強力な微生物にも有効。ただし使用手順が複雑です。レンズの種類・ライフスタイルに合わせて選びましょう。' },
            { q: 'コンタクトのケアをさぼると目にどんな影響がありますか？', a: '洗浄不足でタンパク質・脂質・花粉などの汚れがレンズに蓄積し、角膜炎・結膜炎・巨大乳頭結膜炎（GPC）などのリスクが高まります。汚れたレンズは装用感が悪化するだけでなく、視力低下や重篤な目のトラブルの原因になることも。「面倒くさい」という理由でケアを省略する場合はワンデー（1日使い捨て）への切り替えをおすすめします。' },
            { q: 'ケア用品の種類はどうやって選べばいいですか？', a: 'まず使用しているレンズがMPS対応かを確認（シリコーンハイドロゲルレンズに非対応のMPSも存在）。次に使いやすさ重視ならMPS、殺菌力重視なら過酸化水素系（ボシュロム クリアケア等）を選ぶとよいでしょう。眼科でのアドバイスも参考にしてください。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'シリコーンハイドロゲルは目に悪影響がありますか？', a: '適切に使用すれば悪影響はありません。むしろ従来のヒドロゲル素材より酸素透過率が高く、角膜への酸素供給量が増えて目の健康に有利です。ただし、シリコーンの疎水性によって汚れが付きやすい側面もあるため、適切なレンズケアが重要です。長期使用・長時間装用の方に特におすすめの素材です。' },
            { q: 'ヒドロゲルとシリコーンハイドロゲル、どちらを選ぶべきですか？', a: '長時間装用（8時間以上）・PC作業が多い・ドライアイ気味の方にはシリコーンハイドロゲルがおすすめ。短時間の装用・コストを最優先したい方にはヒドロゲルでも十分。価格差は1箱あたり500〜1,500円程度で、シリコーンハイドロゲルのほうが高め。快適性を重視するなら差額を払う価値があります。' },
            { q: 'Dk/t値（酸素透過率）が高ければ高いほど良いですか？', a: 'Dk/t値は高いほど角膜への酸素供給量が多く、理論上は目に有利です。ただし、Dk/t 87以上であれば「十分な酸素透過率」とされており、それ以上の差は実際の装用感で体感しにくい面もあります。バイオフィニティのDk/t 160とアキュビューモイストのDk/t 28は大きな差があり、長時間装用での快適性に明確な違いが出ます。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'ワンデーと2ウィーク、年間コストで安いのはどちらですか？', a: '2ウィークのほうが安い場合がほとんどです。ワンデーは年間レンズ代が両眼で40,000〜70,000円程度。2ウィーク+ケア用品で20,000〜35,000円程度。差額は年間で2〜4万円になることも。ただし、ワンデーはケア不要で衛生的という利点があり、快適性やライフスタイルを含めてトータルで判断してください。' },
            { q: 'コンタクトの年間コストを節約するコツを教えてください', a: '①通販最安値を毎回比較する（眼科院内処方の30〜50%安いケースも）、②まとめ買い割引を利用する、③クーポン・セールを活用する、④2ウィークを2枚で管理して片目ずつ開封するなど工夫する人もいます。ただし④は公式の使用方法ではないため、衛生リスクがあります。最も安全に節約するなら①〜③の組み合わせがベストです。' },
            { q: '眼科の定期検査代も含めた年間コストはどれくらいですか？', a: '眼科の定期検査（コンタクト検査）は自由診療で1回2,000〜5,000円程度。年2回受診すると4,000〜10,000円が追加でかかります。これを含めたワンデーの年間総コストは50,000〜80,000円、2ウィークは30,000〜45,000円程度が目安。眼科費用を「節約」して受診を省略すると、目のトラブルで後からより多くの費用がかかるリスクがあります。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '処方箋なしでコンタクトを通販購入するのは違法ですか？', a: '違法ではありません。薬機法上、コンタクトレンズ購入に処方箋の提示義務はありません。ただし、高度管理医療機器として眼科での定期検査を推奨しています。特に初めてコンタクトを使う方・度数や商品を変更する場合は必ず眼科を受診してください。' },
            { q: '定期購入サービスとその都度購入、どちらがお得ですか？', a: '定期購入は毎回の注文手間がなく、追加割引（5〜15%オフ）が設定されているショップが多いため、毎月使用する方にはお得。デメリットはキャンセル手続きが必要な場合があること。その都度購入は自由度が高く、セール時にまとめ買いするなど柔軟に対応できます。' },
            { q: '海外通販でコンタクトを買うのはどうですか？', a: '個人輸入は薬機法上グレーゾーンで、品質保証がありません。海外製品は日本の規格と異なる場合があり、万が一トラブルが起きた際のサポートも受けられません。コストを抑えたい場合は国内通販のまとめ買り・クーポン活用をおすすめします。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'ワンデーアキュビューオアシスは普通のアキュビューモイストと何が違いますか？', a: '素材が違います。オアシスはシリコーンハイドロゲル（Dk/t 121）、モイストはヒドロゲル（Dk/t 28）。酸素透過率がオアシスのほうが圧倒的に高く、長時間装用・ドライアイ傾向の方に向いています。価格はオアシスが1日あたり約30〜50円高めですが、乾燥感が大幅に軽減される方も多いです。' },
            { q: '乱視があってもワンデーアキュビューオアシスを使えますか？', a: '乱視用は「ワンデーアキュビューオアシス トーリック」をお選びください。乱視の軸・円柱度数に対応した専用設計で、視力が安定しやすいです。まず眼科で正確な乱視度数を測定してもらう必要があります。乱視が軽微（0.75D以下）の場合は通常の球面レンズで対応できることもあります。' },
            { q: 'ワンデーアキュビューオアシスの価格が高いですか？安く買う方法はありますか？', a: '1箱（30枚入）で2,800〜4,500円程度が相場で、確かに高めのレンズです。通販での送料込み最安値を比較すること、まとめ買い（6箱・8箱）での割引を活用すること、クーポン利用でコストを抑えられます。当サイトで価格を一括比較すると最安値を見つけやすいです。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '遠近両用コンタクトは何歳から使えますか？', a: '老視（老眼）が始まる40代から使用が増えますが、年齢より症状が基準です。近くが見えにくい・腕を伸ばしてスマホを見るようになってきた方は眼科での相談をおすすめします。自己判断でADD（加入度数）を選ぶのは危険で、必ず処方を受けてください。' },
            { q: '遠近両用コンタクトと老眼鏡、どちらが良いですか？', a: 'コンタクトに慣れている方・見た目を気にしない方・外出が多い方には遠近両用コンタクトが便利です。一方、コンタクトをしていない時間が長い方・手元作業が多い方は老眼鏡+通常コンタクトの組み合わせも有効。どちらが合うか眼科医と相談するのが最善です。' },
            { q: '遠近両用コンタクトに慣れるまでどれくらいかかりますか？', a: '個人差はありますが、一般的に1〜2週間で慣れる方が多いです。最初は遠くも近くもぼんやり感じたり、コントラストが低下したように感じる場合があります。夜間運転の際は特に違和感を覚えやすいため、まず昼間から慣らしていくことを推奨します。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '2ウィークコンタクトのケア用品代はいくらかかりますか？', a: 'MPS（マルチパーパスソリューション）の場合、1本（360ml）で1,200〜2,000円程度。2週間に1本消費するとすると、月額600〜1,000円程度のケア用品代がかかります。年間7,000〜12,000円程度。ケア用品代を含めても、ワンデーより年間コストが安くなるケースがほとんどです。' },
            { q: 'アキュビューオアシス2weekとバイオフィニティ、どちらが乾きにくいですか？', a: '乾燥感の点では多くのユーザーがアキュビューオアシスをやや上と評価します。HYDRACLEAR Plusという独自の保湿技術が特徴で、終日の装用快適性が高評価。バイオフィニティはAquaformテクノロジーで高い酸素透過率（Dk/t 160）が売りで、長時間装用での目への負担軽減が強み。乾燥感重視ならオアシス、酸素透過率重視ならバイオフィニティという選び方が目安です。' },
            { q: '2ウィークコンタクトを期限（14日）過ぎて使い続けるのは危険ですか？', a: 'はい、危険です。14日を超えるとタンパク質・脂質汚れが蓄積し、レンズが劣化して酸素透過率が下がります。眼科での角膜潰瘍・感染症リスクが高まり、最悪の場合は視力障害につながることも。「まだ汚れてない」と感じても、必ず14日で交換してください。' },
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
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          マンスリーコンタクトの真のコストは、レンズ代＋ケア用品（洗浄液・保存液・レンズケース）の合計です。洗浄液は月あたり500〜1,500円程度。1dayと比較する際は必ずケア用品代も含めた試算を行いましょう。それでもマンスリーが低コストになることが多いです。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">おすすめマンスリーの最安値を確認</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'バイオフィニティ', brand: 'クーパービジョン', slug: 'biofinity', badge: 'Dk/t 160' },
            { name: 'エア オプティクス ハイドラグライド', brand: 'アルコン', slug: 'air-optix-hydraglyde', badge: 'Dk/t 138' },
            { name: 'クラリティ アドバンス', brand: 'クーパービジョン', slug: 'clariti-monthly', badge: 'SiHy・低価格' },
            { name: 'バイオトゥルー マンスリー', brand: 'ボシュロム', slug: 'biotrue-monthly', badge: '含水率78%' },
          ].map(({ name, brand, slug, badge }) => (
            <Link key={slug} href={`/product/${slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mb-2">{badge}</span>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{name}</p>
              <p className="text-xs text-gray-500 mb-3">{brand}</p>
              <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: 'マンスリーコンタクトを2週間で交換してもいいですか？',
              a: '問題ありません。メーカー指定より短い期間での交換は安全性の観点では問題なく、むしろ清潔です。ただし2weekや1dayへの変更を検討した方がコスト面で合理的です。',
            },
            {
              q: 'マンスリーレンズを旅行に持っていくのは大変ですか？',
              a: 'ケア用品（MPS洗浄液・保存液）を持ち歩く必要があります。1週間以上の旅行なら、旅行中だけワンデーを使い、帰宅後マンスリーに戻す方法も効率的です。',
            },
            {
              q: 'マンスリーのシリコーンHGと通常素材はどちらがよいですか？',
              a: 'PC作業・長時間装用が多い方はシリコーンHG（バイオフィニティ・エア オプティクスなど）を強くおすすめします。Dk/t値が高く角膜への酸素供給量が多いため、充血・乾燥感が起きにくいです。コスパを最優先する場合は通常ハイドロゲル素材（バイオトゥルー マンスリーなど）でも使用条件次第で十分です。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
          ))}
        </div>
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">人気カラコンの最安値を確認</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'アキュビュー ディファイン モイスト 1day', brand: 'J&J', slug: 'acuvue-define-moist-1day', badge: 'ナチュラル系人気No.1' },
            { name: 'フレッシュルック イルミネート', brand: 'アルコン', slug: 'freshlook-illuminate', badge: '透明感' },
            { name: 'GEO ベラ カラー', brand: 'GEO Medical', slug: 'geo-bella-color', badge: 'コスパ優秀' },
          ].map(({ name, brand, slug, badge }) => (
            <Link key={slug} href={`/product/${slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mb-2">{badge}</span>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{name}</p>
              <p className="text-xs text-gray-500 mb-3">{brand}</p>
              <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: 'カラコンと普通のコンタクトは安全性が違いますか？',
              a: '薬機法認証済み（高度管理医療機器認証）のカラコンであれば安全性の基準は同等です。問題なのは無認証の海外製安価品。認証番号が表示されていない製品は避け、必ず認証済み製品を眼科処方のもとで使用してください。',
            },
            {
              q: 'カラコンを初めて使うときに気をつけることは？',
              a: '必ず眼科で処方を受けてから購入してください。目の形（BC値）はカラコンと合っている必要があります。最初は短時間（4〜6時間）から始めて目の慣れを確認し、違和感があればすぐに外して眼科を受診してください。',
            },
            {
              q: 'カラコンは毎日使っても大丈夫ですか？',
              a: '適切なケアを行い、装用時間を守れば毎日使用できます。1dayタイプは毎日新品を使うため衛生的です。2weekタイプは毎日の洗浄・保存が必須です。目に異常（充血・痛み・かすみ）を感じたらすぐに外して眼科を受診してください。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
          ))}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視用コンタクトの最安値を確認</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'デイリーズ トータルワン 乱視用', brand: 'アルコン', slug: 'dailies-total1-toric', badge: '1day・乾きにくさ最強' },
            { name: 'ワンデーアキュビュー モイスト 乱視用', brand: 'J&J', slug: 'acuvue-moist-1day-astig', badge: '1day・コスパ' },
            { name: 'アキュビュー オアシス 乱視用', brand: 'J&J', slug: 'acuvue-oasys-astig', badge: '2week・乾きにくい' },
            { name: 'バイオフィニティ トーリック', brand: 'クーパービジョン', slug: 'biofinity-toric', badge: 'マンスリー・高酸素' },
          ].map(({ name, brand, slug, badge }) => (
            <Link key={slug} href={`/product/${slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mb-2">{badge}</span>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{name}</p>
              <p className="text-xs text-gray-500 mb-3">{brand}</p>
              <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: '乱視用コンタクトは普通のコンタクトより見え方が安定しにくいですか？',
              a: '装用直後は回転するため見え方が安定するまで数秒〜十数秒かかることがありますが、これは正常です。適切に処方されたトーリックレンズは数秒後に安定し、通常のコンタクトと同等の視力矯正が期待できます。見え方がいつまでもぼやける場合はフィッティングが合っていない可能性があります。',
            },
            {
              q: '軽い乱視（CYL -0.75）でも乱視用コンタクトが必要ですか？',
              a: '個人差がありますが、CYL -0.75程度の軽度乱視では通常の球面レンズで十分見えると感じる方も多いです。乱視用を試してみて視力・見え方が改善しない場合は球面レンズに戻す選択肢もあります。眼科医の判断に従うことが最善です。',
            },
            {
              q: '乱視用コンタクトの選択肢は通常レンズより少ないですか？',
              a: '少ないです。対応度数（PWR）・CYL・AXISの組み合わせが限られるため、強度近視（-8.00以上）や強い乱視（CYL-2.25超）の方は対応レンズが見つかりにくいことがあります。眼科処方後にショップで在庫を確認してください。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">おすすめ商品の最安値を確認する</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-2">
          {[
            { name: 'アキュビュー オアシス 1day', brand: 'J&J', slug: 'acuvue-oasys-1day', badge: 'Dk/t 103' },
            { name: 'デイリーズ トータルワン', brand: 'アルコン', slug: 'dailies-total1', badge: 'Dk/t 156' },
            { name: 'バイオフィニティ（2week）', brand: 'クーパービジョン', slug: 'biofinity', badge: 'Dk/t 160' },
            { name: 'アキュビュー オアシス 2week', brand: 'J&J', slug: 'acuvue-oasys-2week', badge: 'Dk/t 147' },
          ].map(({ name, brand, slug, badge }) => (
            <Link key={slug} href={`/product/${slug}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mb-2">{badge}</span>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{name}</p>
              <p className="text-xs text-gray-500 mb-3">{brand}</p>
              <span className="inline-block bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">最安値を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: '1日8時間のPC作業ならどのコンタクトがおすすめですか？',
              a: 'シリコーンハイドロゲル素材で酸素透過率の高い「アキュビュー オアシス 1day（Dk/t 103）」または「デイリーズ トータルワン（Dk/t 156）」が特に適しています。PC作業中はまばたきが減り乾燥しやすいため、HydraLuxeや水分勾配テクノロジーなどの保湿技術を持つ製品を選びましょう。',
            },
            {
              q: '長時間装用しても大丈夫なコンタクトはありますか？',
              a: 'シリコーンハイドロゲル素材のコンタクトは従来素材より長時間装用に適していますが、1日の装用上限は最大12〜14時間が推奨です。これを超える場合は眼科医に相談してください。どんな高品質なレンズでも長時間の連続装用は角膜への負担がかかります。',
            },
            {
              q: '目薬はコンタクトをしたまま使えますか？',
              a: '「コンタクト装用中OK」と表示のある防腐剤フリーの目薬であれば使用できます。一般的な目薬（防腐剤入り）はコンタクトに吸着してしまうため使用できません。ソフトサンティア・ロートコンタクトシリーズ・アイボン コンタクトなどが代表的な装用中OKの目薬です。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">価格帯・コスパ比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          2製品は同じ30枚入りですが、価格帯に差があります。乾きにくさや酸素透過率でトータルワンが勝る一方、オアシスはコストを抑えつつ高品質を実現しています。年間コスト（両目・365日）で比べると：
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">製品</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">1箱の目安価格</th>
                <th className="text-left py-2 text-gray-600 font-semibold">年間コスト目安（両目）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['デイリーズ トータルワン', '3,500円前後', '約85,000円'],
                ['アキュビュー オアシス 1-day', '3,000円前後', '約73,000円'],
              ].map(([name, box, annual]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{name}</td>
                  <td className="py-2 pr-4 text-gray-600">{box}</td>
                  <td className="py-2 text-gray-600">{annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">※ 価格は送料込み最安値ショップ利用時の参考値。実際の最安値はショップ・時期によって異なります。</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: 'デイリーズ トータルワンとオアシスはどちらが乾きにくいですか？',
              a: '乾きにくさのスペックではデイリーズ トータルワンが上回ります。水分勾配テクノロジーにより表面含水率が約80%に達し、目の表面に触れる部分がほぼ水分のみで構成されます。ただし個人差があり、オアシスの方が合うと感じる方も一定数います。',
            },
            {
              q: '乱視がある場合はどちらを選べばよいですか？',
              a: '乱視用（トーリック）ラインナップはアキュビュー オアシスの方が充実しており、CYL・AXISの対応範囲も広いです。デイリーズ トータルワン 乱視用は高品質ですが対応CYL範囲が限られます。',
            },
            {
              q: '初めてプレミアムレンズを試す場合はどちらがおすすめですか？',
              a: 'アキュビュー オアシス 1dayが入門としておすすめです。デイリーズ トータルワンより価格が抑えられており、初めてシリコーンハイドロゲル素材を試す場合でも購入しやすいです。気に入ればそのまま継続し、さらなる乾燥感改善を求める場合にトータルワンへのアップグレードを検討しましょう。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
          ))}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: 'ドライアイでもコンタクトは使えますか？',
              a: '軽度〜中等度のドライアイであれば、適切なレンズを選ぶことで使用できます。シリコーンハイドロゲル素材・1日使い捨てタイプ・表面保湿テクノロジーを持つレンズ（デイリーズ トータルワン・アキュビュー オアシスなど）が特に適しています。重度のドライアイの場合は眼科医に相談し、コンタクトの適合可否を確認してください。',
            },
            {
              q: 'ドライアイ対策で目薬はどれを選べばいいですか？',
              a: 'コンタクト装用中は「コンタクト装用中OK」と表示のある防腐剤フリーの目薬を選んでください。ソフトサンティア（参天製薬）・ロートコンタクトシリーズ（ロート製薬）が代表的です。防腐剤入りの一般目薬はレンズに吸着するため使用不可です。眼科でドライアイと診断された場合は、処方目薬（ヒアルロン酸点眼など）を使用することで症状を効果的に緩和できます。',
            },
            {
              q: '含水率が高いほどドライアイに良いですか？',
              a: '必ずしもそうとは言えません。含水率が高すぎるレンズは、逆に目の水分を吸収しようとして乾燥感を悪化させることがあります（高含水率パラドックス）。ドライアイ対策では「シリコーンハイドロゲル素材」と「表面の保湿コーティング技術」の組み合わせが最も効果的とされています。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
          ))}
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'コンタクトレンズの通販は安全ですか？', a: '高度管理医療機器販売許可を取得している正規ショップで購入すれば安全です。日本の正規品を販売しており、届いたレンズのロット番号での品質確認も可能。並行輸入品や怪しいショップからの購入は避けましょう。なお、コンタクトは医療機器のため、初回購入前に必ず眼科を受診してください。' },
            { q: '楽天市場やAmazonでコンタクトを買うメリット・デメリットは？', a: 'ポイント還元（楽天SPU・Amazonポイント）がメリット。セール時（お買い物マラソン・プライムデー）は特にお得になります。デメリットは出品者が多くて品質の見極めが必要な点。正規販売店バッジや取扱店認定の表示を必ず確認しましょう。' },
            { q: 'まとめ買いと毎月購入、どちらがお得ですか？', a: '年間コストではまとめ買いが有利。多くのショップが6箱・8箱セットで追加割引を設定しており、1箱あたりの価格が下がります。ただし、在庫を持ちすぎると使用期限内に使いきれない場合もあるため、半年分（6箱）程度のまとめ買いが現実的です。' },
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">年間コスト比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          同じアキュビューブランドですが価格帯が異なります。両目・365日装用の年間コスト目安：
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">製品</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">1箱の目安価格</th>
                <th className="text-left py-2 text-gray-600 font-semibold">年間コスト目安（両目）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['アキュビュー モイスト 1day', '1,300〜1,800円', '約31,000〜44,000円'],
                ['アキュビュー オアシス 1-day', '2,800〜4,000円', '約68,000〜97,000円'],
              ].map(([name, box, annual]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{name}</td>
                  <td className="py-2 pr-4 text-gray-600">{box}</td>
                  <td className="py-2 text-gray-600">{annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">※ 最安値ショップ利用時の参考値。実際の価格は各ショップでご確認ください。</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: 'モイストからオアシスに変えると乾燥感は改善しますか？',
              a: 'ほとんどの方で改善します。モイストはハイドロゲル素材（Dk/t 28.9）、オアシスはシリコーンハイドロゲル素材（Dk/t 103）で酸素透過率が約3.5倍高く、長時間装用後の充血・乾燥感が大幅に軽減される方が多いです。ただし个人差があるため、できれば眼科でサンプルレンズを試してから購入することをおすすめします。',
            },
            {
              q: 'アキュビュー モイストで問題ない人はオアシスにする必要はありますか？',
              a: '不要です。モイストで乾燥感・充血などのトラブルがなく、快適に使えているならそのままで問題ありません。オアシスはモイストより価格が2〜3倍高いため、満足している場合は無理に切り替える必要はありません。',
            },
            {
              q: 'アキュビュー オアシスとデイリーズ トータルワンはどちらが乾きにくいですか？',
              a: 'スペック上はデイリーズ トータルワンが上回ります。水分勾配テクノロジーにより表面含水率が約80%に達します。ただし価格はトータルワンがさらに高いため、まずオアシスを試してさらに改善を求める場合にトータルワンへのアップグレードをおすすめします。',
            },
          ].map(({ q, a }) => (
            <details key={q} className="border border-gray-200 rounded-xl overflow-hidden">
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <span className="text-slate-700 font-bold shrink-0">Q.</span>{q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white leading-relaxed">
                <span className="text-emerald-600 font-bold">A. </span>{a}
              </div>
            </details>
          ))}
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'アキュビューオアシス2weekに乱視用・遠近両用はありますか？', a: 'あります。乱視用は「アキュビューオアシス トーリック（2week）」、遠近両用は「アキュビューオアシス マルチフォーカル（2week）」があります。いずれも同じシリコーンハイドロゲル素材・HYDRACLEAR Plus技術を採用。乱視や老視がある方でも乾きにくいオアシスシリーズを選べます。' },
            { q: 'コンタクトのケアにミネラルウォーターを使っても大丈夫ですか？', a: '絶対に使用しないでください。ミネラルウォーターや水道水には「アカントアメーバ」などの微生物が含まれており、コンタクトを介して目に感染すると重篤な角膜炎を引き起こすことがあります。視力を失う恐れもある非常に危険な感染症です。ケアは必ず専用のMPS・ケア液のみを使用してください。' },
            { q: '2weekコンタクトをワンデーとして使い捨てにしてもいいですか？', a: '2weekレンズをワンデーとして使い捨てること自体は物理的には可能ですが、コストが高くなるだけです。また2weekレンズはワンデーと素材設計が異なり、1日使用後は適切なケアを前提に設計されています。「コスト節約のためにワンデーを2日以上使い回す」のは逆方向で絶対NG。指定の交換サイクルを守ることが目の健康を守る基本です。' },
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

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'メニコンのコンタクトは他のブランドと比べて価格はどうですか？', a: '価格帯はミドルレンジで、アキュビューやデイリーズと同等かやや安め。マンスリータイプの「1month Menicon」はランニングコストが低く、ケア用品と合わせても年間コストを抑えやすいです。ワンデーのメニコンは大手に比べてやや手ごろな価格帯です。' },
            { q: 'メニコンスクエア（定額サービス）とは何ですか？', a: 'メニコンの独自サービスで、月額固定料金でレンズ（ハードレンズ）とケア用品・眼科検診がセットになるプランです。ソフトレンズとは別のサービスで、ハードコンタクトの長期ユーザーに特に人気があります。ソフトレンズは通常の通販購入が一般的です。' },
            { q: 'メニコンのハードコンタクトとソフトコンタクト、どちらを選べばいいですか？', a: 'ハードは矯正力が高く（特に乱視・高度近視）、長期コストが安い（1枚で数年使用）反面、装用感の慣れが必要で落下・破損リスクがあります。ソフトは装用感が快適で扱いやすく、日常使いに向いています。初めての方・スポーツをする方・短期利用の方はソフトが向いています。眼科医に相談した上で選びましょう。' },
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

  'soft-vs-hard-contact-hikaku': (
    <div className="space-y-8">
      <section>
        <p className="lead text-lg text-gray-700 mb-6">
          コンタクトレンズには大きく「ソフト」と「ハード」の2種類があります。装用感・矯正力・コスト・手入れの手間が大きく異なるため、自分のライフスタイルや目の状態に合った選択が重要です。この記事では両者の違いを徹底的に比較します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ソフトとハード、根本的な違いとは</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          ソフトコンタクトレンズは柔らかい素材（ハイドロゲルまたはシリコーンハイドロゲル）でできており、角膜より大きく目全体を覆うように装用します。一方、ハードコンタクトレンズは硬い素材（酸素透過性プラスチック）でできており、角膜より小さいサイズで中央部のみを覆います。
        </p>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">項目</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">ソフト</th>
                <th className="text-left py-2 text-gray-600 font-semibold">ハード</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['素材', '柔らかい（含水性）', '硬い（酸素透過性）'],
                ['サイズ', '13.8〜14.5mm（大きい）', '8.5〜9.5mm（小さい）'],
                ['装用感', '最初から快適', '慣れが必要（1〜2週間）'],
                ['矯正力', '標準〜やや低め', '高い（乱視・高度近視向き）'],
                ['交換周期', '1day〜マンスリー', '1〜2年以上'],
                ['年間コスト', '中〜高', '長期的には安い'],
              ].map(([item, soft, hard]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-semibold text-gray-700">{item}</td>
                  <td className="py-2 pr-4 text-gray-600">{soft}</td>
                  <td className="py-2 text-gray-600">{hard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ソフトコンタクトのメリット・デメリット</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">メリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・最初から装用感が快適</li>
              <li>・落下・ずれにくい</li>
              <li>・スポーツ時も安心</li>
              <li>・種類・ブランドが豊富</li>
              <li>・1dayタイプはケア不要</li>
              <li>・カラーレンズも選べる</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">デメリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・ハードより酸素透過率が低い場合も</li>
              <li>・乱視の矯正精度がやや劣る</li>
              <li>・年間コストが高め（特に1day）</li>
              <li>・素材によって乾きやすい</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ハードコンタクトのメリット・デメリット</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">メリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・高い矯正力（乱視・強度近視向き）</li>
              <li>・長期使用でコストが安い</li>
              <li>・酸素透過率が高いものが多い</li>
              <li>・耐久性が高い（1〜2年使用可）</li>
              <li>・視力矯正の精度が高い</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">デメリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・慣れるまで異物感がある</li>
              <li>・外れやすい・落としやすい</li>
              <li>・埃が入ると痛い</li>
              <li>・スポーツ中に外れるリスク</li>
              <li>・種類・ブランドが少ない</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">費用と維持コストの比較</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          初期費用はハードのほうが高め（1枚1万〜2万円程度）ですが、1〜2年以上使えるため長期的には安くなります。ソフトは商品によりますが、ワンデーは年間3〜6万円、2weekは年間1.5〜3万円（ケア用品込み）が目安です。
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-4">
          <p className="font-bold text-yellow-800 text-sm">コスト比較の目安（両目・年間）</p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1">
            <li>ワンデーソフト：約3〜6万円</li>
            <li>2weekソフト：約1.5〜3万円（ケア用品含む）</li>
            <li>マンスリーソフト：約1〜2万円（ケア用品含む）</li>
            <li>ハード：初年度1〜2万円＋ケア用品、2年目以降ケア用品のみ</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視・高度近視への適性</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          乱視の矯正においてはハードコンタクトが有利です。ハードレンズは涙液レンズ効果により角膜の不規則な形状を補正するため、強い乱視でも高精度の矯正が可能です。ソフトの乱視用（トーリック）レンズも改善されていますが、強い乱視（CYL -2.25超）や不正乱視にはハードが優れています。
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          高度近視（PWR -8.00以上）の場合も、ハードレンズのほうが対応度数の幅が広く、薄型設計で装用しやすい選択肢があります。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">どちらを選べばいい？タイプ別おすすめ</h2>
        <div className="space-y-3">
          {[
            { type: '初めてコンタクトを使う方', rec: 'ソフト（ワンデー）', reason: '装用感の慣れが不要で、万が一目に合わなくても使い切りなので損失が少ない。' },
            { type: '強い乱視・不正乱視がある方', rec: 'ハード', reason: 'ソフトの乱視用では矯正しきれない場合もあり、ハードの涙液レンズ効果で高精度の矯正が可能。' },
            { type: 'スポーツ・アウトドアが好きな方', rec: 'ソフト', reason: '落下リスクが低く、砂埃が入っても痛みが少ない。ワンデーなら衛生的。' },
            { type: 'コストを徹底的に抑えたい方', rec: 'ハードまたはマンスリーソフト', reason: 'ハードは長期使用できるためランニングコストが最も安い。ソフトならマンスリーが次点。' },
            { type: 'PC作業・長時間装用の方', rec: 'シリコーンハイドロゲルソフト', reason: '高酸素透過率素材で角膜への負担を軽減。乾燥対策になる目薬との併用も効果的。' },
          ].map(({ type, rec, reason }) => (
            <div key={type} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm">{type}</p>
                <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">{rec}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-slate-800 text-white rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">ソフトコンタクトの最安値を比較する</h3>
          <p className="text-slate-300 mb-4">ワンデー・2week・マンスリーの人気商品を24ショップで価格比較。</p>
          <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            人気商品の価格を比較する →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'ソフトからハードに変えることはできますか？', a: '可能ですが、眼科での再処方が必要です。ハードは角膜に合わせた精密なフィッティングが必要で、慣れるまで数週間かかることがあります。いきなりハードに変えると異物感で続けられないケースもあるため、医師と相談の上で試用期間を設けることをおすすめします。' },
            { q: 'ハードコンタクトは通販で購入できますか？', a: 'ハードコンタクトはソフトと比べて通販での取り扱いが少なく、眼科または眼科指定のショップで購入するのが一般的です。個人の角膜形状に合わせたカスタム品も多いため、通販よりも眼科経由の購入が安全です。' },
            { q: 'ソフトとハードを目的によって使い分けることはできますか？', a: '医師の処方のもとであれば可能です。例えば平日の仕事中はハード、週末のスポーツ時はソフトという使い分けをする方もいます。ただし、ハードからソフトへの切り替え時に角膜形状が一時的に変化することがあり、視力測定に影響する場合があります。眼科医に相談することを推奨します。' },
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

  'ranshi-contact-ranking-erabikata': (
    <div className="space-y-8">
      <section>
        <p className="lead text-lg text-gray-700 mb-6">
          乱視用コンタクトレンズ（トーリックレンズ）は、通常の近視・遠視矯正に加えて乱視も同時に補正できる特殊なレンズです。この記事では乱視の基礎知識から、自分に合ったレンズの選び方、2026年版の人気ランキングまで徹底解説します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視とは何か？トーリックレンズが必要な理由</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          乱視は角膜または水晶体の形が球面ではなく楕円形（ラグビーボール形）になっているため、光が一点に集まらず像がぼやけたり二重に見えたりする状態です。日本人の約6〜7割が何らかの乱視を持っているとされており、軽度の乱視は通常の球面レンズでも問題ない場合がありますが、中等度以上（CYL -0.75以上）では乱視用レンズの使用が推奨されます。
        </p>
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <p className="font-bold text-purple-800 mb-2 text-sm">乱視の症状チェックリスト</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・遠くの文字がぼやけたり二重に見える</li>
            <li>・夜間の光が滲んで見える（ハロー・グレア）</li>
            <li>・眼精疲労・頭痛が起きやすい</li>
            <li>・ものが歪んで見える</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視の度数（CYL）・軸度（AXIS）の読み方</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          処方箋に記載される乱視関連のパラメータは主に2つです。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">CYL（乱視度数）</h3>
            <p className="text-xs text-gray-700 leading-relaxed">乱視の強さを表す。マイナスで表記され、数値が大きいほど乱視が強い。一般的な範囲は -0.75〜-2.25。</p>
            <div className="mt-2 text-xs text-gray-600">
              <p>-0.75：軽度乱視</p>
              <p>-1.25：中等度乱視</p>
              <p>-1.75以上：やや強い乱視</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">AXIS（軸度）</h3>
            <p className="text-xs text-gray-700 leading-relaxed">乱視の方向（軸の角度）を1〜180度で表す。この数値が異なると矯正効果が得られないため、必ず正確に入力する必要がある。</p>
            <div className="mt-2 text-xs text-gray-600">
              <p>10度刻み（10・20・30…）で設定されることが多い</p>
              <p>製品によって選択できるAXISの数が異なる</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3">
          <p className="text-sm font-bold text-yellow-800">重要：AXISは製品によって対応範囲が異なります</p>
          <p className="text-xs text-gray-700 mt-1">処方箋のAXIS値が購入したいレンズで選択できない場合、別の商品を選ぶ必要があります。通販で購入する際は必ず対応AXISを確認してください。</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">装用スタイル別おすすめ乱視用コンタクト</h2>
        <div className="space-y-3">
          {[
            { style: 'ワンデー（1日使い捨て）', merit: 'ケア不要で衛生的。週数回だけ使う方や旅行・外出時に便利。', cost: '年間コスト高め', rec: 'デイリーズ トータルワン乱視用、ワンデーアキュビュー モイスト乱視用' },
            { style: '2week（2週間交換）', merit: 'ワンデーより経済的で、毎日使う方に向く。毎日のケアが必要。', cost: '年間コスト中程度', rec: 'アキュビュー オアシス乱視用、メダリスト乱視用' },
            { style: 'マンスリー（月1交換）', merit: '最もコストが安い。しっかりしたケアが必要。毎日使用する方向け。', cost: '年間コスト安め', rec: 'バイオフィニティ トーリック、エアオプティクスプラス乱視用' },
          ].map(({ style, merit, cost, rec }) => (
            <div key={style} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-bold text-gray-900 text-sm">{style}</p>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{cost}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{merit}</p>
              <p className="text-xs text-gray-500">おすすめ：{rec}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">人気乱視用コンタクトランキング2026</h2>
        <div className="space-y-4">
          {[
            { rank: 1, name: 'デイリーズ トータルワン 乱視用', maker: 'アルコン', type: 'ワンデー', feature: '水分保持96%のウォーターグラジェント素材。1日中快適な装用感でドライアイ気味の方にも最適。CYL -0.75〜-2.25対応。' },
            { rank: 2, name: 'アキュビュー オアシス 乱視用', maker: 'ジョンソン&ジョンソン', type: '2week', feature: 'HYDRACLEAR PLUSテクノロジーで涙液の安定膜を形成。乾きにくさと視力安定性を両立。BC 8.6mm。' },
            { rank: 3, name: 'ワンデーアキュビュー モイスト 乱視用', maker: 'ジョンソン&ジョンソン', type: 'ワンデー', feature: 'LACREON配合でうるおい持続。10度刻みのAXIS設定で日本人の細かい乱視軸に対応。' },
            { rank: 4, name: 'バイオフィニティ トーリック', maker: 'クーパービジョン', type: 'マンスリー', feature: 'Aquaform技術で含水率48%を自然に維持。BC 8.5/8.7の2種類から選べるフィット性。' },
          ].map(({ rank, name, maker, type, feature }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{rank}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm">{name}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{maker}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">乱視用レンズを選ぶ際の注意点</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span className="text-red-500 font-bold shrink-0">!</span>必ず眼科で乱視の度数（CYL）と軸度（AXIS）を処方してもらう</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-bold shrink-0">!</span>購入する商品のAXIS選択肢に自分の軸度が含まれているか確認する</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-bold shrink-0">!</span>装用直後に見え方が安定しない場合は数秒待つ（レンズが回転して安定する）</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-bold shrink-0">!</span>通販で購入する際は左右のCYL・AXISを正確に入力する</li>
        </ul>
      </section>

      <section>
        <div className="bg-slate-800 text-white rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">乱視用コンタクトの最安値を比較する</h3>
          <p className="text-slate-300 mb-4">主要ショップの価格を毎日更新。送料込みで最安値を探せます。</p>
          <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            ランキングで最安値を見る →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '軽い乱視（CYL -0.75）でも乱視用コンタクトは必要ですか？', a: '個人差があります。CYL -0.75の軽度乱視では通常の球面レンズで十分見えると感じる方も多いです。ただし眼精疲労や夜間の見えにくさが気になる場合は乱視用を試す価値があります。眼科医に相談してください。' },
            { q: '乱視用コンタクトは通常のコンタクトより高価ですか？', a: '一般的に同じブランド・シリーズの乱視用は通常品より1〜2割程度高い傾向があります。ただし通販を利用することで大幅に安く購入できます。' },
            { q: 'AXIS（軸度）が少しずれても問題ありませんか？', a: '軸度のずれは視力矯正効果に大きく影響します。処方通りのAXISを選ぶことが重要です。製品のAXISラインナップに合わない場合は眼科医に相談して近い数値での処方を検討してください。' },
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

  'shoshinsha-contact-guide': (
    <div className="space-y-8">
      <section>
        <p className="lead text-lg text-gray-700 mb-6">
          初めてコンタクトレンズを使いたいけれど、どこで何を買えばいいかわからない…という方は多いはずです。この記事では眼科受診から種類の選び方、通販での購入手順まで、失敗しないためのポイントをわかりやすく解説します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">まず眼科を受診しよう</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          コンタクトレンズは目に直接触れる医療機器です。初めて使う方は必ず眼科を受診し、処方を受けてください。眼科では以下のことを行います。
        </p>
        <div className="space-y-2 mb-4">
          {[
            { step: '1', label: '視力・屈折検査', desc: '近視・遠視・乱視の度数を測定します。' },
            { step: '2', label: '角膜曲率検査', desc: 'BC（ベースカーブ）を決めるために角膜のカーブを測定します。' },
            { step: '3', label: '眼科疾患の確認', desc: 'コンタクトを使用できない眼の状態がないかチェックします。' },
            { step: '4', label: 'トライアルレンズ装用', desc: '実際にレンズを試してフィット感を確認します。' },
            { step: '5', label: '処方箋の発行', desc: 'PWR・BC・DIAなどの数値が記載された処方箋をもらいます。' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex gap-3 bg-slate-50 rounded-xl p-3">
              <span className="bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{step}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3">
          <p className="text-sm font-bold text-yellow-800">眼科受診の費用目安</p>
          <p className="text-xs text-gray-700 mt-1">初診料＋コンタクト処方料で3,000〜5,000円程度（保険適用時）。トライアルレンズを使用する場合は別途費用がかかる場合があります。</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">コンタクトレンズの種類と選び方</h2>
        <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 text-gray-600 font-semibold">種類</th>
                <th className="text-left py-2 pr-3 text-gray-600 font-semibold">交換周期</th>
                <th className="text-left py-2 pr-3 text-gray-600 font-semibold">年間コスト目安</th>
                <th className="text-left py-2 text-gray-600 font-semibold">おすすめな人</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ワンデー', '毎日交換', '3〜6万円', 'ケアが面倒・不定期使用'],
                ['2week', '2週間で交換', '1.5〜3万円', '毎日使用・バランス重視'],
                ['マンスリー', '1ヶ月で交換', '1〜2万円', '毎日使用・コスト重視'],
              ].map(([type, period, cost, rec]) => (
                <tr key={type} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-semibold text-gray-700">{type}</td>
                  <td className="py-2 pr-3 text-gray-600">{period}</td>
                  <td className="py-2 pr-3 text-gray-600">{cost}</td>
                  <td className="py-2 text-gray-600">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          初心者には<strong>ワンデー</strong>がおすすめです。毎日新しいレンズを使うため衛生的で、ケア用品も不要。万が一目に合わなくても損失が少なく、生活に合わせた使い方ができます。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">処方箋の見方と必要なパラメータ</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          通販でコンタクトを購入する際に必要なパラメータを理解しておきましょう。
        </p>
        <div className="space-y-2 mb-4">
          {[
            { param: 'PWR / SPH', desc: '度数（近視はマイナス、遠視はプラス）' },
            { param: 'BC', desc: 'ベースカーブ（レンズの曲率。8.3〜9.0mmが一般的）' },
            { param: 'DIA', desc: '直径（レンズのサイズ。14.0mm前後が一般的）' },
            { param: 'CYL', desc: '乱視度数（乱視がある方のみ）' },
            { param: 'AXIS', desc: '乱視の軸度（乱視がある方のみ）' },
          ].map(({ param, desc }) => (
            <div key={param} className="flex gap-3 items-start">
              <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-1 rounded shrink-0">{param}</span>
              <p className="text-sm text-gray-700 pt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">はじめての通販購入ステップ</h2>
        <div className="space-y-3">
          {[
            { n: '1', t: '処方箋を手元に用意する', d: '眼科でもらった処方箋の数値（PWR・BC・DIA）を確認します。' },
            { n: '2', t: '商品を選ぶ', d: '処方されたブランド・商品名で検索するか、当サイトのランキングから選びましょう。' },
            { n: '3', t: '左右の度数を入力する', d: 'R（右目）とL（左目）の度数が異なる場合が多いため、間違えないよう注意して入力します。' },
            { n: '4', t: '送料込みの最安値を確認する', d: '商品価格だけでなく、送料を含めた合計金額で比較しましょう。まとめ買いで送料無料になるショップが多いです。' },
            { n: '5', t: '決済・注文完了', d: 'クレジットカードまたはコンビニ払いなどで決済。注文履歴をスクリーンショットで保存しておくと安心です。' },
          ].map(({ n, t, d }) => (
            <div key={n} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
              <span className="bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{n}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{t}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">初心者が失敗しやすいポイントと対策</h2>
        <div className="space-y-3">
          {[
            { fail: '左右の度数を入れ間違える', fix: '処方箋を手元に置き、RとLを確認しながら入力。注文確認メールで再チェックする。' },
            { fail: '眼鏡の度数をそのまま使う', fix: '眼鏡とコンタクトの度数は異なります。必ず眼科で処方されたコンタクト用の度数を使用。' },
            { fail: '処方と違うBCで購入する', fix: 'BCが合わないと装用感が悪くなります。処方箋通りのBCで注文しましょう。' },
            { fail: 'ケア用品を購入し忘れる', fix: '2week・マンスリーを選んだ場合は洗浄液・保存液も一緒に購入。ワンデーならケア不要。' },
          ].map(({ fail, fix }) => (
            <div key={fail} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-red-700 text-sm mb-1">✗ {fail}</p>
              <p className="text-sm text-gray-700 leading-relaxed">→ {fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">購入後のケア・定期検査について</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          コンタクトを使い始めたら、年に1〜2回の定期検査を受けることが推奨されています。自覚症状がなくても、角膜に問題が起きていることがあるためです。「目がゴロゴロする」「充血が続く」「見え方が急に変わった」などの症状がある場合はすぐに眼科を受診してください。
        </p>
        <div className="bg-slate-800 text-white rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">今すぐ最安値を比較する</h3>
          <p className="text-slate-300 mb-4">初心者におすすめのワンデーコンタクトを24ショップで価格比較。</p>
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            ワンデーの最安値を見る →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '初めてコンタクトを使う場合、眼科はどこでも同じですか？', a: 'コンタクトレンズの処方に慣れた眼科を選ぶことが重要です。トライアルレンズの在庫が豊富な眼科では、複数の商品を試してから処方してもらえます。「コンタクトレンズ外来あり」と明記している眼科が安心です。' },
            { q: '処方箋なしで通販購入しても大丈夫ですか？', a: '薬機法上は処方箋の提示義務がありませんが、初めての方は必ず眼科での処方後に購入してください。2回目以降・同一商品の継続購入であれば通販が便利です。' },
            { q: 'コンタクトを初めて装用するコツはありますか？', a: '手をしっかり洗い、レンズの表裏を確認（裏返しは縁が外側に反る）してから装用します。眼科でのトライアル時に装用・取り外しの練習ができるので、初回は焦らず練習しましょう。' },
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

  'multifocal-contact-rogansetsu': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        40代を過ぎたころから「近くの文字が読みにくくなった」「スマホを離して見るようになった」という経験はありませんか？それは老眼（老視）のサインです。遠近両用コンタクトレンズなら、老眼鏡なしで遠くも近くも快適に見えるようになります。この記事では仕組み・種類・選び方・おすすめ商品をすべて解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">遠近両用コンタクトが必要になるサイン</h2>
      <p className="mb-4">
        老眼は40代前後から始まり、年齢とともに進行します。以下のような症状が出てきたら、遠近両用コンタクトの使用を検討するタイミングです。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>スマートフォンや本を遠ざけないと読めなくなってきた</li>
        <li>コンタクトをしていると手元の文字がぼやける</li>
        <li>目が疲れやすくなり、頭痛が出ることがある</li>
        <li>レストランのメニューが暗い場所で読みにくい</li>
      </ul>
      <div className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-3 mb-6">
        <p className="font-bold text-blue-800">老眼鏡の「かけ外し」から卒業できる</p>
        <p className="text-sm mt-1">遠近両用コンタクトは、一枚のレンズに遠距離・中距離・近距離の複数の焦点エリアが設計されており、かけ外しの手間なく両方の距離をカバーできます。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">遠近両用コンタクトの仕組みと種類</h2>
      <p className="mb-4">
        遠近両用コンタクト（マルチフォーカルレンズ）には大きく2つの設計方式があります。どちらが自分に合うかは眼科で試してみることが重要です。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">同時視タイプ（マルチフォーカル）</h3>
          <p className="text-sm text-gray-700">レンズ中央に近距離用、周辺に遠距離用（または逆）の度数ゾーンを配置。脳が自動的に焦点を選択する仕組み。現在の主流設計。</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <h3 className="font-bold text-orange-800 mb-2">交互視タイプ（バイフォーカル）</h3>
          <p className="text-sm text-gray-700">上半分が遠用、下半分が近用に分かれた設計。目を動かすことで焦点を切り替える。ソフトコンタクトでは主流ではない。</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">同時視タイプと交互視タイプの違い</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">項目</th>
              <th className="text-left p-2">同時視タイプ</th>
              <th className="text-left p-2">交互視タイプ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">慣れやすさ</td><td className="p-2">慣れるまで時間がかかることも</td><td className="p-2">見え方が明確</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">対応商品数</td><td className="p-2">非常に多い</td><td className="p-2">少ない</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">使い捨て対応</td><td className="p-2">ワンデー・2week・マンスリーあり</td><td className="p-2">主にハードレンズ</td></tr>
            <tr><td className="p-2 font-medium">おすすめの人</td><td className="p-2">軽〜中度の老眼</td><td className="p-2">強度老眼・矯正力重視</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">人気遠近両用コンタクトランキング</h2>
      <div className="space-y-4 mb-6">
        {[
          { rank: 1, name: 'ワンデーアキュビュー モイスト マルチフォーカル', maker: 'ジョンソン&ジョンソン', type: 'ワンデー', feature: '滑らかなグラデーション設計で自然な見え方。乾きにくいLASHICON技術搭載。老眼初期の方に特におすすめ。' },
          { rank: 2, name: 'デイリーズ トータルワン マルチフォーカル', maker: 'アルコン', type: 'ワンデー', feature: '水分勾配技術で瞳との相性が抜群。シリコーンハイドロゲル素材で長時間装用でも快適。' },
          { rank: 3, name: 'バイオフィニティ マルチフォーカル', maker: 'クーパービジョン', type: 'マンスリー', feature: 'コスパ重視の遠近両用。高酸素透過性シリコーン素材で長時間装用OK。' },
        ].map(({ rank, name, maker, type, feature }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}`}>{rank}</div>
            <div>
              <p className="font-bold text-gray-800">{name}</p>
              <p className="text-xs text-gray-500 mb-1">{maker} / {type}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">遠近両用コンタクトを始める前に知っておくこと</h2>
      <p className="mb-4">
        遠近両用コンタクトは通常のコンタクトよりも慣れに時間がかかることがあります。眼科で必ずトライアルレンズを試してから処方してもらいましょう。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>装用初日から完璧に見えなくても数日で慣れることが多い</li>
        <li>夜間のハロー・グレアが出やすいため、夜間運転が多い方は要相談</li>
        <li>加入度数（ADD）は老眼の程度によって異なる（Low/Mid/Highなど）</li>
        <li>乱視が強い方はトーリックマルチフォーカルが必要な場合も</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">老眼鏡との使い分け方</h2>
      <p className="mb-4">
        遠近両用コンタクトだけでは手元が見えにくい場合、低度数（+1.0〜+1.5）の既製老眼鏡をコンタクトの上から使う「オーバーリーディンググラス」という方法も効果的です。精密な手作業が多い方、細かい文字を長時間読む方に向いています。
      </p>
      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">遠近両用コンタクトを最安値で購入する</h3>
        <p className="text-slate-300 mb-4">マルチフォーカルコンタクトレンズの価格を24ショップで比較。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          最安値ランキングを確認する →
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '遠近両用コンタクトは老眼が始まったばかりでも使えますか？', a: '老眼初期の方ほど遠近両用コンタクトへの適応が早いといわれています。老眼が進んでから始めるより、早めに試した方が慣れやすいです。まずは眼科でトライアルレンズを体験してみることをおすすめします。' },
            { q: '遠近両用コンタクトと老眼鏡はどちらが見えやすいですか？', a: '手元の細かい作業（読書・裁縫など）では老眼鏡の方が明確に見えます。ただし日常生活全般（買い物・会話・PC作業）ではコンタクトの方が便利です。どちらが優れているというより、使い分けが理想的です。' },
            { q: '遠近両用コンタクトの「加入度数（ADD）」とは何ですか？', a: 'ADDは近用部の追加度数を示す数値で、老眼の程度に応じてLow・Mid・Highなどがあります。+1.00（Low）〜+2.50（High）程度が一般的で、眼科でフィッティングして最適なADDを選んでもらう必要があります。' },
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

  'colorcl-doari-donashi-guide': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        カラコンを選ぶとき「度あり」と「度なし」のどちらを選べばいいか迷っていませんか？近視や乱視がある方は度ありカラコンが必要です。この記事では、度あり・度なしカラコンの違い、パラメータの見方、おすすめ商品、そして安全な使用ルールをすべて解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度あり・度なしカラコンとは</h2>
      <p className="mb-4">
        カラコン（カラーコンタクトレンズ）には、視力矯正機能がある「度あり」と、色のみのファッション目的の「度なし（プレノ）」があります。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">度ありカラコン</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・近視・遠視・乱視を矯正できる</li>
            <li>・裸眼でも視力が出る方には不要</li>
            <li>・眼科での処方が必要</li>
            <li>・PWR値がマイナス（近視）またはプラス（遠視）</li>
          </ul>
        </div>
        <div className="bg-pink-50 rounded-xl p-4">
          <h3 className="font-bold text-pink-800 mb-2">度なしカラコン</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・視力矯正なし（PWR 0.00）</li>
            <li>・裸眼視力が良い方向け</li>
            <li>・色だけを楽しめる</li>
            <li>・コンタクト未使用者も利用可能</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度ありカラコンが必要な人・不要な人</h2>
      <div className="space-y-3 mb-6">
        <div className="bg-green-50 border-l-4 border-green-400 pl-4 py-3">
          <p className="font-bold text-green-800 mb-1">度ありが必要な人</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・普段コンタクトや眼鏡で視力矯正している方</li>
            <li>・近視（裸眼視力0.5未満程度）の方</li>
            <li>・遠視や乱視のある方（乱視用カラコンも展開あり）</li>
          </ul>
        </div>
        <div className="bg-gray-50 border-l-4 border-gray-300 pl-4 py-3">
          <p className="font-bold text-gray-800 mb-1">度なしで良い人</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・裸眼視力が1.0以上ある方</li>
            <li>・眼鏡やコンタクトを普段使わない方</li>
            <li>・色だけ楽しみたい方</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度ありカラコンのパラメータ（PWR・BC・DIA）の見方</h2>
      <p className="mb-4">
        度ありカラコンを購入する際は、眼科で処方されたパラメータを正確に入力する必要があります。
      </p>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">パラメータ</th>
              <th className="text-left p-2">意味</th>
              <th className="text-left p-2">例</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">PWR / SPH</td><td className="p-2">度数（近視はマイナス）</td><td className="p-2">-3.00</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">BC</td><td className="p-2">ベースカーブ（レンズの曲率）</td><td className="p-2">8.6mm</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">DIA</td><td className="p-2">レンズ直径</td><td className="p-2">14.5mm</td></tr>
            <tr><td className="p-2 font-medium">着色直径</td><td className="p-2">色のついた部分の直径（デカ目度合い）</td><td className="p-2">13.8mm</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2 text-sm">
        <strong>注意：</strong>DIAはレンズ全体の直径、着色直径は色がついたゾーンの直径です。着色直径が大きいほどデカ目効果が出ます。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度ありカラコンおすすめ商品</h2>
      <div className="space-y-4 mb-6">
        {[
          { name: 'アキュビュー ディファイン モイスト', type: 'ワンデー・度あり', feature: 'ジョンソン&ジョンソン製の度ありカラコン。ナチュラルな黒目強調デザインで、医療機器認証取得済みの安心商品。乾きにくいレベテックス技術搭載。' },
          { name: 'フレッシュルック デイリーズ', type: 'ワンデー・度あり', feature: 'アルコン製の使い捨て度ありカラコン。3トーンデザインで自然な瞳に仕上がる。PWR -0.50〜-6.00に対応。' },
          { name: 'GEO ベラ（Bella）', type: 'マンスリー・度あり', feature: 'コスパに優れたマンスリーカラコン。ナチュラル系カラーが豊富で、度あり・度なし両展開。' },
        ].map(({ name, type, feature }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800">{name}</p>
            <p className="text-xs text-blue-600 mb-2">{type}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">度なしカラコンの注意点と適切な使い方</h2>
      <p className="mb-4">
        度なしカラコンは視力矯正機能はありませんが、コンタクトレンズとして目に直接触れる医療機器です。以下の点に注意して使用してください。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>眼科での装用指導と定期検査は度なしでも推奨</li>
        <li>1日の装用時間は8〜10時間以内が目安</li>
        <li>使い捨てタイプ（ワンデー）が最も衛生的</li>
        <li>就寝時は必ず外す（連続装用禁止）</li>
        <li>認証を受けていない雑貨扱いのカラコンは購入しない</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">安全に楽しむための使用ルール</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {[
          { rule: '薬機法認証品を購入する', detail: '「高度管理医療機器承認番号」がある商品のみ購入。雑貨店・輸入品は要注意。' },
          { rule: '手洗い後に装用する', detail: '清潔な手でレンズを扱い、水道水でのレンズ洗浄は厳禁。' },
          { rule: '装用期間を守る', detail: 'ワンデーは1日で廃棄、マンスリーは必ず30日以内に交換。' },
          { rule: '目のトラブルは即受診', detail: '充血・痛み・見え方の変化があればすぐにレンズを外して眼科へ。' },
        ].map(({ rule, detail }) => (
          <div key={rule} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1">{rule}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">度ありカラコンの最安値を比較する</h3>
        <p className="text-slate-300 mb-4">人気カラコンの価格を24ショップで一括比較。安心の正規品のみ掲載。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          カラコンの価格を比較する →
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '乱視がありますが度ありカラコンは使えますか？', a: '乱視（CYL）がある方向けの「トーリック（乱視用）カラコン」が存在します。ただし商品数は限られており、対応しているCYL・AXISの範囲が決まっています。眼科でご自身の乱視パラメータを確認した上で、対応商品を探してください。' },
            { q: '度なしカラコンは眼科に行かなくても買えますか？', a: '法律上は処方箋の提示義務はありませんが、コンタクトレンズは高度管理医療機器のため、初回は眼科でBC（ベースカーブ）を確認し、装用指導を受けることを強くおすすめします。目に合わないBCのレンズは角膜障害のリスクがあります。' },
            { q: 'カラコンの「着色直径」と「DIA（レンズ直径）」は何が違いますか？', a: 'DIAはレンズ全体の直径で、角膜への乗り方を決める重要なパラメータです。着色直径はレンズのうち実際に色がついている部分の直径で、値が大きいほどデカ目効果があります。DIAはBC同様に眼科で処方されたものを選び、着色直径は好みで選べます。' },
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

  'contact-dosu-mikata-erabikata': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        コンタクトレンズの処方箋を見ると「PWR」「BC」「DIA」「CYL」「AXIS」などさまざまな記号が並んでいます。これらの意味を正しく理解することで、通販でも間違いなくコンタクトを選べるようになります。眼鏡の度数との違いも含めて、わかりやすく完全解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コンタクトレンズの処方箋を読む前に</h2>
      <p className="mb-4">
        コンタクトレンズの処方箋は、眼科での検査を受けた後に発行されます。処方箋には右目（R/OD）と左目（L/OS）それぞれのパラメータが記載されています。通販購入の際は必ずこの情報を手元に用意しましょう。
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">処方箋がない方は眼科へ</p>
        <p className="text-sm mt-1">初めてコンタクトを作る方、または度数が変わった可能性がある方は必ず眼科を受診してください。古い処方箋をそのまま使い続けると視力悪化の原因になります。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">PWR（度数）の意味と近視・遠視の違い</h2>
      <p className="mb-4">
        <strong>PWR（Power）</strong>はコンタクトレンズの矯正力を表す最も重要なパラメータです。「SPH（Sphere）」と表記される場合もあります。
      </p>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">値の範囲</th>
              <th className="text-left p-2">意味</th>
              <th className="text-left p-2">目安</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2">-0.25〜-1.50</td><td className="p-2">軽度近視</td><td className="p-2">裸眼でも日常生活できる程度</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2">-1.75〜-4.00</td><td className="p-2">中度近視</td><td className="p-2">最も多いゾーン</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2">-4.25〜-6.00</td><td className="p-2">強度近視</td><td className="p-2">裸眼では生活困難</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2">+0.25以上</td><td className="p-2">遠視</td><td className="p-2">近くが見えにくい</td></tr>
            <tr><td className="p-2">0.00</td><td className="p-2">度なし</td><td className="p-2">カラコン専用</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">BC（ベースカーブ）とDIA（直径）の見方</h2>
      <p className="mb-4">
        <strong>BC（Base Curve）</strong>はレンズの曲率を示すmm単位の数値です。角膜のカーブに合わせて選ぶ必要があります。BCが合わないと装用感が悪くなるだけでなく、角膜への負担も増えます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">BC（ベースカーブ）</h3>
          <p className="text-sm text-gray-700">日本人の平均は8.3〜9.0mm。商品によって固定されていることが多く、処方された値の商品のみ選べます。</p>
          <p className="text-xs text-gray-500 mt-2">例：8.4、8.5、8.6、8.7、8.8mm など</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">DIA（直径）</h3>
          <p className="text-sm text-gray-700">透明コンタクトは13.8〜14.5mmが標準。商品ごとに固定されており、選べる場合は少ない。</p>
          <p className="text-xs text-gray-500 mt-2">例：14.0、14.2、14.5mm など</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乱視用CYL・AXISの読み方</h2>
      <p className="mb-4">
        乱視がある方のコンタクトには、通常のPWR・BC・DIAに加えて乱視用のパラメータが必要です。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">CYL（乱視度数）</h3>
          <p className="text-sm text-gray-700">乱視の強さ。マイナスで表記（-0.75〜-2.25が一般的）。値が大きいほど乱視が強い。</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2">AXIS（軸度）</h3>
          <p className="text-sm text-gray-700">乱視の向き（軸の角度）を1〜180度で表す。わずかなズレでも見え方が大きく変わるため正確に。</p>
        </div>
      </div>
      <p className="mb-4 bg-orange-50 border-l-4 border-orange-400 pl-4 py-2 text-sm">
        乱視用コンタクトはCYL・AXISが処方値に完全一致する商品を選ぶ必要があります。「だいたい合っている」では視力が出ません。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">眼鏡の度数とコンタクトの度数の違い</h2>
      <p className="mb-4">
        眼鏡とコンタクトでは、レンズが目から離れている距離（頂点間距離）が異なるため、同じ視力を矯正するのに必要な度数が変わります。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>眼鏡は目から約12mm離れた位置でレンズが光を屈折させる</li>
        <li>コンタクトは目に直接乗るため屈折距離が変わる</li>
        <li>近視の場合：眼鏡よりコンタクトの度数がやや弱くなることが多い</li>
        <li>-4.00D以上の強度近視では差が大きくなるため特に要注意</li>
      </ul>
      <p className="mb-6 bg-red-50 border-l-4 border-red-400 pl-4 py-2 text-sm">
        <strong>絶対にNG：</strong>眼鏡の度数をそのままコンタクトの注文に使わないでください。必ず眼科でコンタクト用の度数を処方してもらいましょう。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">通販で間違えないための確認ポイント</h2>
      <div className="space-y-3 mb-6">
        {[
          { step: '処方箋を手元に用意する', desc: '購入ページを開く前に処方箋を手元に置き、RとLを確認しながら入力する。' },
          { step: '右目と左目の入力順を確認', desc: '注文フォームが「右→左」か「左→右」の順か確認し、取り違えに注意。' },
          { step: '商品のBCと処方BCが一致しているか確認', desc: '商品詳細ページに記載のBC値が処方値と一致していることを確認。' },
          { step: '注文確認画面で全パラメータを再確認', desc: 'PWR・BC・DIA（+CYL・AXIS）が正しいか注文確定前にもう一度チェック。' },
        ].map(({ step, desc }) => (
          <div key={step} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{step}</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">処方されたコンタクトを最安値で購入する</h3>
        <p className="text-slate-300 mb-4">度数を確認したら、当サイトで24ショップの価格を一括比較。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            人気商品のランキングを見る
          </Link>
          <Link href="/category/1day" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            ワンデーを比較する
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'コンタクトの度数は自分で変更しても大丈夫ですか？', a: '自己判断での度数変更は絶対にNGです。度数が強すぎると眼精疲労・頭痛の原因になり、弱すぎると視力矯正ができません。「見えにくくなった」と感じたら眼科を受診して再処方を受けてください。' },
            { q: 'BC（ベースカーブ）が処方値と±0.1違う商品でも大丈夫ですか？', a: '原則としてNG。BCが合わないと装用感の悪化・角膜への負担増加・レンズのズレが生じます。希望商品のBCが処方と異なる場合は眼科でその商品のトライアルレンズを試してフィッティングを確認してもらいましょう。' },
            { q: '左右で度数が違う場合、どう注文すればいいですか？', a: '通販では右目（R）・左目（L）それぞれに度数を指定して注文できます。処方箋の「OD/R」が右目、「OS/L」が左目です。左右を入れ間違えると全く効果が出ないので、注文確認画面で必ず確認してください。' },
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

  'dryeye-contact-sentaku': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        ドライアイを抱えながらコンタクトを使うと、目の乾燥・充血・不快感が悪化しやすくなります。しかし、素材・含水率・装用時間を正しく選べば、ドライアイの方でも快適にコンタクトを使うことができます。この記事では、ドライアイの方が知っておくべきコンタクト選びのすべてを解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">ドライアイとコンタクトレンズの関係</h2>
      <p className="mb-4">
        ドライアイはまぶたの内側（結膜）や角膜の表面を覆う「涙液層」が不安定になる状態です。コンタクトレンズは涙液の上に浮かんで装用されるため、涙液が少ないドライアイの方は以下のような症状が出やすくなります。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>装用数時間後に目がゴロゴロ・ショボショボする</li>
        <li>充血や痛みが出やすい</li>
        <li>視力がぼやける（乾燥によるレンズのくもり）</li>
        <li>まばたきのたびに不快感がある</li>
      </ul>
      <div className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-3 mb-6">
        <p className="font-bold text-blue-800">ドライアイの方がコンタクトをあきらめないために</p>
        <p className="text-sm mt-1">素材・含水率・装用時間を適切に選ぶことで、ドライアイの方でも快適なコンタクトライフを送れます。眼科でドライアイの状態を診てもらいながら最適な商品を選びましょう。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">乾きにくいコンタクトを選ぶ3つのポイント</h2>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 bg-slate-50 rounded-xl p-4">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
          <div>
            <h3 className="font-bold text-gray-800">シリコーンハイドロゲル素材を選ぶ</h3>
            <p className="text-sm text-gray-600 mt-1">酸素透過率が高く、乾燥しにくい次世代素材。涙液蒸発を抑える設計のものが多い。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-slate-50 rounded-xl p-4">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
          <div>
            <h3 className="font-bold text-gray-800">含水率に注意する</h3>
            <p className="text-sm text-gray-600 mt-1">高含水素材は乾燥しやすい環境で逆に水分を奪うことがある。低〜中含水（38〜55%）のシリコーン素材が◎。</p>
          </div>
        </div>
        <div className="flex gap-4 bg-slate-50 rounded-xl p-4">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
          <div>
            <h3 className="font-bold text-gray-800">ワンデーを選ぶ</h3>
            <p className="text-sm text-gray-600 mt-1">毎日新しいレンズを使うことで汚れ・タンパク付着による乾燥感を防げる。ドライアイの方に特におすすめ。</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">シリコーンハイドロゲル vs 含水率高いハイドロゲル</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">特徴</th>
              <th className="text-left p-2">シリコーンHG</th>
              <th className="text-left p-2">高含水HG</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">酸素透過率</td><td className="p-2 text-green-700 font-semibold">高い（Dk/t 100以上）</td><td className="p-2">中程度</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">乾燥感</td><td className="p-2 text-green-700 font-semibold">少ない</td><td className="p-2">乾燥環境では出やすい</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">価格</td><td className="p-2">やや高め</td><td className="p-2">安め</td></tr>
            <tr><td className="p-2 font-medium">ドライアイへの適性</td><td className="p-2 text-green-700 font-semibold">高い</td><td className="p-2">低い（悪化させる場合も）</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">ドライアイ向けおすすめコンタクトレンズ</h2>
      <div className="space-y-4 mb-6">
        {[
          { name: 'デイリーズ トータルワン', maker: 'アルコン', feature: '業界最高水準の「水分勾配技術」で表面水分含有量80%超。ドライアイ向けNo.1候補。シリコーンHG素材でDk/t 156。', price: 'ワンデー（やや高め）' },
          { name: 'ワンデーアキュビュー オアシス', maker: 'J&J', feature: 'HYDRALUXE技術で涙液と一体化。PCや空調の多い環境でも快適。長時間装用でも乾きにくい。', price: 'ワンデー（高め）' },
          { name: 'バイオフィニティ', maker: 'クーパービジョン', feature: 'コメット素材による高い保水性と酸素透過率。2week・マンスリーでコスパ良好。', price: 'マンスリー（コスパ優秀）' },
        ].map(({ name, maker, feature, price }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-gray-800">{name}</p>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{price}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{maker}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">目薬・人工涙液との正しい組み合わせ方</h2>
      <p className="mb-4">
        コンタクト装用中に使える目薬は限られています。防腐剤が含まれる目薬はコンタクトに吸着して角膜に悪影響を与える可能性があるため、必ず「コンタクト装用中に使用可能」と明記された製品を選んでください。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>「ソフトコンタクト装用中OK」の記載がある人工涙液を選ぶ</li>
        <li>1回使い切りタイプは防腐剤フリーで安心</li>
        <li>点眼後はまばたきを数回して馴染ませる</li>
        <li>1日5〜6回以上の点眼は眼科に相談</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">ドライアイを悪化させないための装用習慣</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {[
          { habit: '装用時間を短くする', detail: '1日8時間以内を目安に。長時間PC使用の日はメガネに切り替えるのも有効。' },
          { habit: '意識的にまばたきをする', detail: 'PC作業中はまばたきが減りやすい。1分ごとに意識的にまばたきする。' },
          { habit: '湿度を保つ環境づくり', detail: 'エアコン・暖房使用時は加湿器を使用。乾燥した環境はドライアイを悪化させる。' },
          { habit: '定期的に眼科を受診', detail: 'ドライアイが悪化していないか年2回は眼科で確認。適切なレンズへの変更を相談。' },
        ].map(({ habit, detail }) => (
          <div key={habit} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1">{habit}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">乾きにくいコンタクトの最安値を比較する</h3>
        <p className="text-slate-300 mb-4">デイリーズトータルワン・アキュビューオアシスなどドライアイ向けレンズの価格を比較。</p>
        <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          ドライアイ向けレンズを探す →
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'ドライアイでもコンタクトは使えますか？', a: '使えます。ただし素材・含水率の選択が重要です。シリコーンハイドロゲル素材の乾きにくいコンタクトを選び、装用時間を短めに設定することで快適に使える方が多いです。眼科でドライアイの重症度を確認した上で相談してください。' },
            { q: '高含水タイプのコンタクトはドライアイに良いと聞きましたが？', a: '以前はそのように言われていましたが、現在の見解は異なります。高含水素材は環境の水分を吸収しやすく、乾燥した室内環境では目から水分を奪ってしまうことがあります。ドライアイには低〜中含水率のシリコーンハイドロゲル素材の方が適しています。' },
            { q: 'コンタクト中に目薬を使っても大丈夫ですか？', a: '「コンタクト装用中OK」と記載された目薬・人工涙液なら使用できます。防腐剤（ベンザルコニウム塩化物など）が入った目薬はコンタクトに吸着して角膜に悪影響を与える可能性があるため使用禁止。薬局でコンタクト対応の目薬かどうか必ず確認してください。' },
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

  'student-shufu-contact-setsuyaku': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「コンタクト代が毎月かかりすぎる」「少しでも節約したい」という学生・主婦の方は多いはず。コンタクトレンズは種類・購入場所・購入方法を変えるだけで年間数万円の節約も可能です。この記事では、目の健康を守りながら賢くコンタクト代を節約する方法を徹底解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">コンタクト代を節約するための基本戦略</h2>
      <p className="mb-4">
        コンタクトレンズの節約は「種類選び」「購入場所」「購入方法」の3つの軸で考えます。この3つを最適化するだけで、年間コストを大幅に削減できます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">種類選び</p>
          <p className="text-sm text-gray-700">使用頻度に合った種類を選ぶことが基本</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600 mb-1">通販活用</p>
          <p className="text-sm text-gray-700">眼科・薬局より最大50%安くなることも</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-600 mb-1">まとめ買い</p>
          <p className="text-sm text-gray-700">箱数が多いほど1枚あたりが安くなる</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">種類別コスト比較（1day・2week・マンスリー）</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">種類</th>
              <th className="text-left p-2">レンズ代（年）</th>
              <th className="text-left p-2">ケア用品（年）</th>
              <th className="text-left p-2">合計（年）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">ワンデー</td><td className="p-2">約30,000〜50,000円</td><td className="p-2">不要</td><td className="p-2 font-semibold">約30,000〜50,000円</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">2ウィーク</td><td className="p-2">約15,000〜25,000円</td><td className="p-2">約6,000〜8,000円</td><td className="p-2 font-semibold">約21,000〜33,000円</td></tr>
            <tr><td className="p-2 font-medium">マンスリー</td><td className="p-2">約10,000〜18,000円</td><td className="p-2">約6,000〜8,000円</td><td className="p-2 font-semibold">約16,000〜26,000円</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
        ※上記は両眼・通販購入時の目安。毎日装用の場合。週数日のみ装用する方はワンデーの方が割安になることも。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">通販vsドラッグストア・眼科での価格差</h2>
      <p className="mb-4">
        同じ商品でも購入場所によって価格が大きく異なります。一般的な価格差の目安は以下の通りです。
      </p>
      <div className="space-y-3 mb-6">
        {[
          { place: '眼科クリニック内の販売', price: '最も高い（定価の100〜120%程度）', note: '処方後すぐに購入できる便利さ' },
          { place: 'ドラッグストア・量販店', price: '中程度（定価の80〜100%程度）', note: 'セールや会員割引で安くなることも' },
          { place: 'コンタクト通販サイト', price: '最も安い（定価の50〜70%程度）', note: '24ショップ比較で最安値を探せる' },
        ].map(({ place, price, note }) => (
          <div key={place} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800 text-sm">{place}</p>
            </div>
            <p className="text-sm text-blue-700 font-medium mt-1">{price}</p>
            <p className="text-xs text-gray-500 mt-1">{note}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">まとめ買いと定期購入でさらに節約</h2>
      <p className="mb-4">
        多くの通販サイトでは、購入箱数が多いほど1枚あたりの単価が下がります。また、定期購入（サブスクリプション）サービスを提供しているショップも増えており、追加の割引が受けられます。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>6箱・8箱セットが単品購入より20〜30%安くなるケースが多い</li>
        <li>まとめ買いで送料無料条件を達成できる（条件は3,000〜5,000円程度が多い）</li>
        <li>定期購入は毎回5〜10%OFFになるサービスあり</li>
        <li>ポイントカード・クーポンの活用も忘れずに</li>
      </ul>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-3 mb-6">
        <p className="font-bold text-yellow-800">注意：保管期限を確認しよう</p>
        <p className="text-sm mt-1">まとめ買いは経済的ですが、コンタクトレンズには使用期限（外箱に記載）があります。まとめ買いしすぎて期限切れになった場合は使用禁止。ライフスタイルに合わせた量を購入しましょう。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">学生・主婦におすすめのコスパ重視商品</h2>
      <div className="space-y-4 mb-6">
        {[
          { name: 'ワンデーピュア うるおいプラス', type: 'ワンデー', maker: 'シード', feature: '国産ワンデーのコスパ最強クラス。通販価格は1枚50〜60円程度。乾燥しにくい保湿成分配合。' },
          { name: 'シード 2ウィークピュア', type: '2ウィーク', maker: 'シード', feature: '2weekコンタクトの中でも特にコスパが高い。1枚あたり100〜150円程度で両眼年間約20,000円以下に。' },
          { name: 'エア オプティクス プラス ハイドラグライド', type: 'マンスリー', maker: 'アルコン', feature: 'マンスリーながらシリコーンHG素材で快適。1枚500〜700円程度。ケア用品込みでも年間20,000円台に収まる。' },
        ].map(({ name, type, maker, feature }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 mb-2">{maker} / {type}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">節約しながら目の健康を守るポイント</h2>
      <p className="mb-4">
        節約を優先するあまり目の健康をおろそかにすると、後から高額な治療費がかかることがあります。以下の点は節約してはいけません。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {[
          { ng: '装用期間を超えて使い続ける', reason: '角膜感染症・角膜潰瘍のリスクが急増。ワンデーを2日使い回すのは絶対NG。' },
          { ng: '眼科の定期検査をサボる', reason: '自覚症状のない角膜異常が進行することがある。年1〜2回の検査は必須。' },
          { ng: '認証のない格安カラコンを買う', reason: '品質基準を満たさないカラコンは角膜を傷つける可能性がある。' },
          { ng: 'ケア用品を節約しすぎる', reason: '洗浄不十分のレンズは感染症の原因に。ケア用品は適切なものを使う。' },
        ].map(({ ng, reason }) => (
          <div key={ng} className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="font-semibold text-red-700 text-sm mb-1">✗ {ng}</p>
            <p className="text-xs text-gray-700 leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">今すぐ最安値を比較して節約する</h3>
        <p className="text-slate-300 mb-4">24ショップの価格を一括比較。送料込みの実質最安値がひとめでわかります。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ranking" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            人気商品ランキング
          </Link>
          <Link href="/category/1day" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            ワンデーを安く買う
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '週3〜4日しか装用しない場合、どの種類がお得ですか？', a: '週3〜4日の装用なら「ワンデー」が最もお得になります。2week・マンスリーは使用しない日でも開封後2週間（または1ヶ月）で交換が必要なため、使用日数が少ないとコスパが悪くなります。ワンデーなら使った日数分だけのコストで済みます。' },
            { q: '処方箋なしで通販購入すれば眼科代も節約できますか？', a: '初回は必ず眼科を受診してください。ただし2回目以降・同一商品の継続購入であれば通販で処方箋なし購入が可能です。眼科は処方箋取得の場だけでなく、目の定期検査の場でもあるため、年1〜2回は受診しましょう。' },
            { q: 'コンタクトと眼鏡を使い分けると節約になりますか？', a: 'なります。毎日コンタクトを使う代わりに、週2〜3日は眼鏡を使うことでコンタクトの消費量が減り、年間コストを大幅に削減できます。さらにコンタクトによる目の負担も減り、目の健康にも良い効果があります。' },
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

  'contact-care-guide-yohin-hikaku': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        2week・マンスリーコンタクトを使うなら、正しいケア（洗浄・保存）は目の健康を守る最重要ポイントです。ケアを怠ると角膜感染症や角膜潰瘍などの深刻なトラブルにつながります。この記事では、正しいケアの手順からMPS・過酸化水素系洗浄液の選び方、NG行為まで徹底的に解説します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">なぜコンタクトのケアが重要なのか</h2>
      <p className="mb-4">
        コンタクトレンズは使用中に涙液成分（タンパク質・脂質）や外気中のゴミ、細菌が付着します。適切にケアしないと以下のリスクが生じます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-2">ケア不足のリスク</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・角膜感染症（アカントアメーバ角膜炎など）</li>
            <li>・角膜潰瘍（最悪の場合、視力低下）</li>
            <li>・アレルギー反応・充血の悪化</li>
            <li>・レンズの寿命が短くなる</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-2">正しいケアのメリット</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・目のトラブルを未然に防げる</li>
            <li>・レンズのうるおい・透明感を維持</li>
            <li>・快適な装用感が続く</li>
            <li>・レンズの使用期限まで安全に使える</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">正しいケアの基本ステップ</h2>
      <div className="space-y-4 mb-6">
        {[
          { step: 'STEP 1', title: '手を洗う', detail: '石けんでよく手を洗い、清潔なタオルで水気を拭き取る。手に付いた細菌・ウイルスがレンズを通じて目に入るリスクを防ぐ。' },
          { step: 'STEP 2', title: 'レンズを外す', detail: '指先にレンズを乗せ、洗浄液を数滴垂らす。レンズを指の腹で約20秒こすり洗いする（擦り洗い）。' },
          { step: 'STEP 3', title: 'すすぎ洗い', detail: '洗浄液でこすり洗いした後、新しい洗浄液（またはすすぎ液）でレンズの両面をしっかりすすぐ。' },
          { step: 'STEP 4', title: 'ケース保存', detail: '清潔なレンズケースに新鮮な保存液を入れ、レンズを浸漬して蓋をする。最低4〜6時間の浸漬が必要。' },
          { step: 'STEP 5', title: 'ケース管理', detail: 'ケースは毎回洗浄液でゆすぎ、逆さにして乾燥させる。3ヶ月に1回は新しいケースに交換。' },
        ].map(({ step, title, detail }) => (
          <div key={step} className="flex gap-4 bg-slate-50 rounded-xl p-4">
            <div className="bg-blue-600 text-white text-xs font-bold rounded-lg px-2 py-1 flex-shrink-0 h-fit">{step}</div>
            <div>
              <p className="font-bold text-gray-800 mb-1">{title}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">MPS（マルチパーパスソリューション）の選び方</h2>
      <p className="mb-4">
        MPSは洗浄・すすぎ・消毒・保存を1本でできるオールインワン洗浄液です。最もポピュラーなタイプで、初心者にも扱いやすいのが特徴です。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li><strong>ボシュロム レニューフレッシュ</strong>：使い心地の良さとコスパのバランスが◎</li>
        <li><strong>アルコン オプティフリーピュアモイスト</strong>：乾燥対策成分配合、快適な装用をサポート</li>
        <li><strong>AMO コンプリートダブルモイスト</strong>：保湿成分が豊富でうるおい重視の方向け</li>
        <li><strong>シード オーツーケア</strong>：シード製レンズとの相性◎、コスパ重視の選択肢</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">過酸化水素系洗浄液とMPSの違い</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">比較項目</th>
              <th className="text-left p-2">MPS</th>
              <th className="text-left p-2">過酸化水素系</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">消毒力</td><td className="p-2">標準的</td><td className="p-2 text-green-700 font-semibold">非常に高い</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">扱いやすさ</td><td className="p-2 text-green-700 font-semibold">簡単</td><td className="p-2">中和時間が必要（要注意）</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">目への刺激</td><td className="p-2">少ない</td><td className="p-2">中和前は使用不可（失明リスク）</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">アレルギーの方</td><td className="p-2">防腐剤含有</td><td className="p-2 text-green-700 font-semibold">防腐剤フリーが多い</td></tr>
            <tr><td className="p-2 font-medium">コスト</td><td className="p-2 text-green-700 font-semibold">安め</td><td className="p-2">やや高め</td></tr>
          </tbody>
        </table>
      </div>
      <div className="bg-red-50 border-l-4 border-red-400 pl-4 py-3 mb-6">
        <p className="font-bold text-red-800">過酸化水素系の重要な注意</p>
        <p className="text-sm mt-1">過酸化水素系洗浄液は必ず6時間以上の中和時間を経てから装用してください。中和が完了していない状態のレンズを装用すると、激しい痛み・角膜損傷の危険があります。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">絶対にやってはいけないNG行為</h2>
      <div className="space-y-3 mb-6">
        {[
          { ng: '水道水でレンズを洗う', reason: '水道水にはアカントアメーバという原虫が含まれる場合があり、感染すると治療が困難な角膜炎を引き起こします。' },
          { ng: '唾液でレンズを湿らす', reason: '口腔内の細菌がレンズを通じて目に感染するリスクがあります。絶対にNGです。' },
          { ng: '保存液を継ぎ足しで使う', reason: '保存液は毎回全量交換が必要。継ぎ足しは細菌繁殖の温床になります。' },
          { ng: 'ケースを洗わずずっと使う', reason: '汚れたケースはバイオフィルムが形成され、細菌・アカントアメーバの繁殖地になります。' },
          { ng: '装用期限を超えて使い続ける', reason: 'レンズの素材劣化・汚れ蓄積が起こり、感染・角膜障害のリスクが大幅に上昇します。' },
        ].map(({ ng, reason }) => (
          <div key={ng} className="bg-white border border-red-200 rounded-xl p-4">
            <p className="font-semibold text-red-700 text-sm mb-1">✗ {ng}</p>
            <p className="text-xs text-gray-700 leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">ケア用品のコスト比較とおすすめ商品</h2>
      <p className="mb-4">
        ケア用品のコストはMPSで月500〜1,000円程度が目安です。通販での大容量購入でさらにコストを抑えられます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { type: 'コスパ重視', product: 'ボシュロム レニュー', cost: '月400〜600円', feature: '大容量タイプで1本500ml以上。通販なら特に安い。' },
          { type: '快適さ重視', product: 'オプティフリーピュアモイスト', cost: '月700〜1,000円', feature: 'TearGlyde技術でレンズのうるおいを維持。乾燥感対策に。' },
          { type: 'アレルギー体質向け', product: 'クリアケアプラス（過酸化水素系）', cost: '月800〜1,200円', feature: '防腐剤フリーで目への刺激が少ない。中和時間を厳守。' },
          { type: 'シンプル重視', product: 'エーオーセプト クリアケア', cost: '月700〜1,000円', feature: '過酸化水素系の定番品。消毒力が高く衛生的。' },
        ].map(({ type, product, cost, feature }) => (
          <div key={product} className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{type}</span>
            <p className="font-bold text-gray-800 mt-2">{product}</p>
            <p className="text-xs text-green-700 font-semibold mb-1">{cost}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">コンタクトレンズも最安値で購入する</h3>
        <p className="text-slate-300 mb-4">ケア用品と合わせてコンタクト本体も通販でまとめて購入してコストを削減。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/2week" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            2weekの最安値を見る
          </Link>
          <Link href="/ranking" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            人気商品ランキング
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: 'こすり洗いは本当に必要ですか？溶液につけるだけではダメですか？', a: '「こすり洗い」は必須です。浸けるだけの「ノーこすり」方式は現在は推奨されていません。こすり洗いによってレンズ表面のタンパク質・脂質・細菌を物理的に除去することが、感染予防の基本です。必ず毎回20秒以上のこすり洗いを行ってください。' },
            { q: 'コンタクトケースはいつ交換すれば良いですか？', a: '一般的に3ヶ月に1回の交換が推奨されています。ケースは毎回洗浄液でゆすいで乾燥させても、長期使用でバイオフィルムが形成されるため、定期的な交換が必要です。多くのMPSは新品のケースが付属しているため、MPS購入のタイミングで交換するのが便利です。' },
            { q: 'MPSと目薬を一緒に使っても大丈夫ですか？', a: 'MPSはレンズのケア用（保存液）であり、直接目に点眼するものではありません。装用中に目の乾燥を感じたら「コンタクト装用中OK」の目薬を使用してください。MPSを目薬代わりに使う行為は絶対にNGです。' },
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

  '1day-vs-2week-dotchiga-otoku': (
    <div className="prose prose-gray max-w-none">
      <p className="lead text-lg text-gray-700 mb-6">
        「1dayと2week、結局どっちがお得なの？」という疑問は、コンタクトレンズ選びで最もよく聞かれる質問のひとつです。答えは「使用頻度によって異なる」。この記事では年間コスト・利便性・手間を数字で徹底比較し、あなたのライフスタイルに合った選択肢を提案します。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">1dayと2weekの基本的な違い</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-3">1day（ワンデー）</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>・毎日新しいレンズを使う</li>
            <li>・ケア用品（洗浄液）が不要</li>
            <li>・清潔でアレルギー・感染リスクが低い</li>
            <li>・旅行・スポーツに便利</li>
            <li>・1日分のコストが高め</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-3">2week（2ウィーク）</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>・2週間ごとに1枚のレンズを使い続ける</li>
            <li>・毎日のケア（洗浄・保存）が必要</li>
            <li>・1枚のコストは安いがケア代が追加</li>
            <li>・毎日装用する人ほどコスパが良い</li>
            <li>・手間がかかるが経済的</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">年間コスト比較（ケア用品込み）</h2>
      <p className="mb-4">毎日両眼装用（365日）の場合の年間コスト試算（通販価格ベース）：</p>
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">項目</th>
              <th className="text-left p-2">1day（ワンデー）</th>
              <th className="text-left p-2">2week</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">レンズ代（年間）</td><td className="p-2">約32,000〜48,000円</td><td className="p-2">約15,000〜24,000円</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">ケア用品（年間）</td><td className="p-2">不要（0円）</td><td className="p-2">約6,000〜10,000円</td></tr>
            <tr className="border-b border-gray-100 bg-yellow-50"><td className="p-2 font-bold">合計（年間）</td><td className="p-2 font-bold">約32,000〜48,000円</td><td className="p-2 font-bold">約21,000〜34,000円</td></tr>
            <tr><td className="p-2 font-medium">1日あたりのコスト</td><td className="p-2">約88〜131円</td><td className="p-2 text-green-700 font-semibold">約58〜93円</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mb-6 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
        ※通販での一般的なコンタクト（アキュビューモイスト1dayと2weekオアシス）をベースにした試算。商品・ショップによって異なります。
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">使用頻度別・どちらがお得か</h2>
      <div className="space-y-4 mb-6">
        {[
          { freq: '週7日（毎日）装用', winner: '2week', reason: '毎日使うなら2weekのコスパが最大限発揮される。ケア用品コストを含めても年間1万円以上お得になることが多い。' },
          { freq: '週4〜5日装用', winner: 'どちらも近い', reason: '使用日数が減ると2weekでも未使用の期間ができる。1dayと2weekのコスト差が縮まるため、利便性で選ぶのも手。' },
          { freq: '週1〜3日（たまに）装用', winner: '1day', reason: '2weekは開封後14日で交換が必要のため、使用日が少ないと未使用分が無駄に。1dayの方が使った日数分だけのコストで済む。' },
        ].map(({ freq, winner, reason }) => (
          <div key={freq} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-gray-800">{freq}</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${winner === '2week' ? 'bg-green-100 text-green-700' : winner === '1day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {winner === 'どちらも近い' ? '甲乙つけがたい' : `${winner}がお得`}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">手間・利便性の比較</h2>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 rounded">シーン</th>
              <th className="text-left p-2">1day</th>
              <th className="text-left p-2">2week</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">日々のケア</td><td className="p-2 text-green-700">不要（楽）</td><td className="p-2">毎日こすり洗い必要</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">旅行・出張</td><td className="p-2 text-green-700">荷物が少ない</td><td className="p-2">ケア用品を持参必要</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">スポーツ時</td><td className="p-2 text-green-700">使い捨てで清潔</td><td className="p-2">汚れたら交換できない</td></tr>
            <tr className="border-b border-gray-100"><td className="p-2 font-medium">目のトラブル時</td><td className="p-2 text-green-700">新品に変えられる</td><td className="p-2">使いかけを継続使用</td></tr>
            <tr><td className="p-2 font-medium">在庫管理</td><td className="p-2">消費が早い</td><td className="p-2 text-green-700">在庫管理が楽</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">1dayがおすすめな人・2weekがおすすめな人</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-3">1dayがおすすめな人</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>・週3日以下のたまに装用する方</li>
            <li>・ケアの手間を省きたい方</li>
            <li>・アレルギー体質・ドライアイの方</li>
            <li>・旅行・スポーツで使う機会が多い方</li>
            <li>・コンタクト初心者の方</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-3">2weekがおすすめな人</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>・毎日装用する方</li>
            <li>・コスト削減を最優先する方</li>
            <li>・ケア習慣を継続できる方</li>
            <li>・シリコーンHG素材を求める方（高品質）</li>
            <li>・同じブランドを長く使いたい方</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-slate-200">最安値通販で賢く購入する方法</h2>
      <p className="mb-4">
        どちらの種類を選んでも、購入場所によって価格が大きく変わります。眼科やドラッグストアで購入するより、通販を活用することで年間5,000〜15,000円の節約が可能です。
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        <li>複数の通販ショップを比較して最安値を確認する</li>
        <li>送料無料条件を満たすまとめ買いでコストを最小化</li>
        <li>ポイント制度や定期購入割引を活用する</li>
        <li>商品によって最安値ショップが異なるため毎回比較が大切</li>
      </ul>

      <div className="bg-slate-800 text-white rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold mb-2">1day・2week両方の最安値を一括比較</h3>
        <p className="text-slate-300 mb-4">24ショップの価格を比較して、送料込みの実質最安値をチェック。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/category/1day" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            ワンデーを比較する
          </Link>
          <Link href="/category/2week" className="inline-block bg-white text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            2weekを比較する
          </Link>
          <Link href="/ranking" className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm">
            人気ランキングを見る
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: '2weekコンタクトは開封後、2週間使えますか？', a: '「開封後2週間」が使用期限です。たとえば月曜日に開封した場合、次の月曜日（14日後）には装用日数に関わらず新しいレンズに交換が必要です。週に2〜3日しか装用しなくても同じです。装用日数ではなく「開封からの日数」でカウントしてください。' },
            { q: '1dayを2日使い回すことはできますか？', a: '絶対にNGです。ワンデーは1日使い捨て前提で設計されており、薄くて汚れを除去しにくい構造です。再使用すると角膜感染症・角膜潰瘍のリスクが急上昇します。「もったいない」という気持ちは理解できますが、眼の健康のため絶対に守ってください。' },
            { q: '1dayと2weekで見え方や快適さに差はありますか？', a: '同じメーカー・グレードの商品であれば快適さはほぼ同等です。ただし2weekは使用日数が経つにつれてタンパク質・脂質が蓄積し、後半は装用感が落ちることがあります。1dayは毎日新品なので常に最良の状態を保てます。最高の快適さを求めるなら1dayに軍配が上がります。' },
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

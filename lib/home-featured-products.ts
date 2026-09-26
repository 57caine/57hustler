import { EYE_WARMER_PRODUCT, MARUGAO_MEGANE_PRODUCT } from '@/lib/eye-columns';
import { parseMoshimoEmbedCode } from '@/lib/moshimo';

// もしもアフィリエイト「かんたんリンク」の埋め込みコード（トップページ「人気のおすすめ商品」専用の4商品）
const ACUVUE_MOIST_PRODUCT = parseMoshimoEmbedCode(`msmaflink({"n":"【1箱でもポスト便 送料無料★2,528円(税込2,780円)】ワンデーアキュビューモイスト 近視・遠視用 30枚パック 1箱 (ジョンソン・エンド・ジョンソン/1DAY/1日使い捨てコンタクトレンズ)","b":"","t":"","d":"https://thumbnail.image.rakuten.co.jp","c_p":"/@0_mall/lensamigo/cabinet","p":["/johnson/1davms30-01p.jpg","/common/lenstype_1d_1.gif","/johnson/1davms30_redesign.gif"],"u":{"u":"https://item.rakuten.co.jp/lensamigo/1davms30-01p/","t":"rakuten","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://item.rakuten.co.jp/lensamigo/1davms30-01p/","a_id":5691842,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":1}],"eid":"kdhOW","s":"s"});`);

const EVERCOLOR_NATURAL_PRODUCT = parseMoshimoEmbedCode(`msmaflink({"n":"【20%OFFクーポン】 新色登場 カラコン ワンデー エバーカラーワンデーナチュラル モイストレーベルUV (1箱20枚入) エバーカラー 【送料無料】細フチ 度あり 度なし 水光カラコン 水光 ベージュ ブラウン ピンク グレー カラーコンタクト コンタクトレンズ ∀","b":"","t":"","d":"https://thumbnail.image.rakuten.co.jp","c_p":"/@0_mall/loook/cabinet","p":["/2609_evernatu_main.jpg","/camp2018/ccpp_cp_20n1.gif","/item/evercolor1daynatural/n_evernatu_eye.jpg"],"u":{"u":"https://item.rakuten.co.jp/loook/asc1dpever1n01lr0000/","t":"rakuten","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://item.rakuten.co.jp/loook/asc1dpever1n01lr0000/","a_id":5691842,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":1}],"eid":"ZPmoU","s":"s"});`);

const CLIP_ON_SUNGLASSES_PRODUCT = parseMoshimoEmbedCode(`msmaflink({"n":"クリップオンサングラス サングラス 跳ね上げ式 メンズ 偏光 uvカット 運転用 クリップオン レディース メガネの上から 偏光サングラス スポーツ ゴルフ 夜間運転用 オーバーサングラス 女性 男性 オシャレ おしゃれ UV クリップオン付き","b":"","t":"","d":"https://thumbnail.image.rakuten.co.jp","c_p":"/@0_mall/andmagic/cabinet/10929421/cliponsunglasses","p":["/r226-118_01.jpg","/r226-118_02.jpg","/r226-118_03.jpg"],"u":{"u":"https://item.rakuten.co.jp/andmagic/r226-118/","t":"rakuten","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://item.rakuten.co.jp/andmagic/r226-118/","a_id":5691842,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":1}],"eid":"381jj","s":"s"});`);

const IRIS_CL_NEO_PRODUCT = parseMoshimoEmbedCode(`msmaflink({"n":"【第3類医薬品】アイリスCL-Iネオ(30本入*2コセット)【アイリス】","b":"","t":"","d":"https://thumbnail.image.rakuten.co.jp","c_p":"/@0_mall/kenkocom/cabinet/543","p":["/14543.jpg","/14543-2.jpg","/14543-3.jpg"],"u":{"u":"https://item.rakuten.co.jp/kenkocom/14543/","t":"rakuten","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://item.rakuten.co.jp/kenkocom/14543/","a_id":5691842,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":1}],"eid":"JzVN1","s":"s"});`);

export type FeaturedProduct = {
  id: string;
  category: string;
  categoryColorClass: string;
  name: string;
  description: string;
  imageUrl: string | null;
  href: string;
  /** true = もしもアフィリエイトの実リンク未発行。ダミーの'#'リンクのため本番公開不可 */
  isDummy: boolean;
};

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'acuvue-moist-1day',
    category: 'コンタクトレンズ',
    categoryColorClass: 'bg-sky-50 text-sky-700',
    name: 'ワンデーアキュビューモイスト',
    description: 'うるおい続く、快適なつけ心地',
    imageUrl: ACUVUE_MOIST_PRODUCT?.imageUrl ?? null,
    href: ACUVUE_MOIST_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
  {
    id: 'evercolor-natural-1day',
    category: 'カラコン',
    categoryColorClass: 'bg-pink-50 text-pink-700',
    name: 'エバーカラー ワンデー ナチュラル',
    description: 'ナチュラルに盛れる人気カラコン',
    imageUrl: EVERCOLOR_NATURAL_PRODUCT?.imageUrl ?? null,
    href: EVERCOLOR_NATURAL_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
  {
    id: 'zoff-classic-wellington',
    category: '眼鏡',
    categoryColorClass: 'bg-indigo-50 text-indigo-700',
    name: 'Zoff CLASSIC ウェリントン',
    description: '定番かつ上品な、飽きのこないフレーム',
    imageUrl: MARUGAO_MEGANE_PRODUCT?.imageUrl ?? null,
    href: MARUGAO_MEGANE_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
  {
    id: 'clip-on-polarized-sunglasses',
    category: 'サングラス',
    categoryColorClass: 'bg-slate-100 text-slate-700',
    name: 'メガネの上から偏光サングラス クリップオン',
    description: '普段のメガネの上からサッと装着',
    imageUrl: CLIP_ON_SUNGLASSES_PRODUCT?.imageUrl ?? null,
    href: CLIP_ON_SUNGLASSES_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
  {
    id: 'iris-cl-neo',
    category: '目薬',
    categoryColorClass: 'bg-cyan-50 text-cyan-700',
    name: 'アイリスCL-I ネオ',
    description: 'コンタクト装用中の目の乾きに',
    imageUrl: IRIS_CL_NEO_PRODUCT?.imageUrl ?? null,
    href: IRIS_CL_NEO_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
  {
    id: 'release-eye-warmer',
    category: '目のグッズ',
    categoryColorClass: 'bg-amber-50 text-amber-700',
    name: 'リリースアイ アイウォーマー',
    description: '目元をじんわりあたためる充電式ホットアイマスク',
    imageUrl: EYE_WARMER_PRODUCT?.imageUrl ?? null,
    href: EYE_WARMER_PRODUCT?.affiliateUrl ?? '#',
    isDummy: false,
  },
];

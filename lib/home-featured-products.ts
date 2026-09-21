import { EYE_WARMER_PRODUCT, MARUGAO_MEGANE_PRODUCT } from '@/lib/eye-columns';

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

// TODO(DUMMY-LINK): 以下4商品は、もしもアフィリエイトの「かんたんリンク」コードが
// 未発行のため、リンク先を '#' ・画像なし（プレースホルダー表示）にした仮データ。
// レイアウト・デザイン確認専用。実リンク発行後、この配列の該当4件を
// EYE_WARMER_PRODUCT / MARUGAO_MEGANE_PRODUCT と同様の実データに差し替えてから
// mainマージ・本番公開すること。差し替えるまでは本番に出さない。
export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'acuvue-moist-1day',
    category: 'コンタクトレンズ',
    categoryColorClass: 'bg-sky-50 text-sky-700',
    name: 'ワンデーアキュビューモイスト',
    description: 'うるおい続く、快適なつけ心地',
    imageUrl: null, // TODO(DUMMY-LINK): もしもアフィリエイト実画像に差し替え
    href: '#', // TODO(DUMMY-LINK): もしもアフィリエイトのかんたんリンク発行後、実リンクに差し替え
    isDummy: true,
  },
  {
    id: 'evercolor-natural-1day',
    category: 'カラコン',
    categoryColorClass: 'bg-pink-50 text-pink-700',
    name: 'エバーカラー ワンデー ナチュラル',
    description: 'ナチュラルに盛れる人気カラコン',
    imageUrl: null, // TODO(DUMMY-LINK): もしもアフィリエイト実画像に差し替え
    href: '#', // TODO(DUMMY-LINK): もしもアフィリエイトのかんたんリンク発行後、実リンクに差し替え
    isDummy: true,
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
    imageUrl: null, // TODO(DUMMY-LINK): もしもアフィリエイト実画像に差し替え
    href: '#', // TODO(DUMMY-LINK): もしもアフィリエイトのかんたんリンク発行後、実リンクに差し替え
    isDummy: true,
  },
  {
    id: 'iris-cl-neo',
    category: '目薬',
    categoryColorClass: 'bg-cyan-50 text-cyan-700',
    name: 'アイリスCL-I ネオ',
    description: 'コンタクト装用中の目の乾きに',
    imageUrl: null, // TODO(DUMMY-LINK): もしもアフィリエイト実画像に差し替え
    href: '#', // TODO(DUMMY-LINK): もしもアフィリエイトのかんたんリンク発行後、実リンクに差し替え
    isDummy: true,
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

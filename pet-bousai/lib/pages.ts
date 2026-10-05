/**
 * 公開ページの一覧（sitemap・トップページ・ページ内の関連リンクで共用）。
 * updatedAt は本文を書き換えた日。商品データの再取得では変えない。
 */

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** トップページ・関連リンクでの短い名前 */
  short: string;
  animal: 'dog' | 'cat' | 'small' | 'all';
  updatedAt: string;
}

export const ARTICLES: PageMeta[] = [
  {
    path: '/dog',
    title: '犬の防災グッズ｜本当に必要なもの',
    short: '犬の防災グッズ',
    description:
      '犬の災害への備えを、環境省「人とペットの災害対策ガイドライン＜一般飼い主編＞」の優先順位にそって整理。迷子札・給水ボトル・マナーポーチなど普段から使える用品も紹介します。',
    animal: 'dog',
    updatedAt: '2026-10-05',
  },
  {
    path: '/cat',
    title: '猫の防災グッズ｜本当に必要なもの',
    short: '猫の防災グッズ',
    description:
      '猫の災害への備えを、環境省のガイドラインの記載にそって整理。キャリー・迷子札・ネットなど、普段から使える用品の考え方をまとめました。',
    animal: 'cat',
    updatedAt: '2026-10-05',
  },
  {
    path: '/rabbit-guinea-pig',
    title: 'うさぎ・モルモットの防災グッズ',
    short: 'うさぎ・モルモットの防災グッズ',
    description:
      'うさぎ・モルモットなど小動物の災害への備え。環境省のガイドラインで「小動物には避難時に欠かせない」とされるキャリーを中心にまとめました。',
    animal: 'small',
    updatedAt: '2026-10-05',
  },
  {
    path: '/dog/carrier',
    title: '犬の避難用キャリーの選び方',
    short: '犬の避難用キャリー',
    description:
      '犬の同行避難に使うキャリー・ケージの選び方。環境省のガイドラインにある同行避難の準備例と、購入前に確認したい点をまとめました。',
    animal: 'dog',
    updatedAt: '2026-10-05',
  },
  {
    path: '/cat/carrier',
    title: '猫の避難用キャリー・ケージの選び方',
    short: '猫の避難用キャリー・ケージ',
    description:
      '猫の同行避難に使うキャリー・ケージの選び方。キャリーから逃げ出さないようにする準備例など、環境省のガイドラインの記載と、購入前に確認したい点をまとめました。',
    animal: 'cat',
    updatedAt: '2026-10-05',
  },
  {
    path: '/cat/toilet',
    title: '猫の避難用ポータブルトイレ',
    short: '猫の避難用トイレ',
    description:
      '避難時の猫のトイレの備え。環境省のガイドラインにある「使い慣れた猫砂」などの記載と、折りたたみ式トイレを用意する場合の確認点をまとめました。',
    animal: 'cat',
    updatedAt: '2026-10-05',
  },
  {
    path: '/bousai-set',
    title: 'ペット防災セットは買うべき？足りない物比較',
    short: 'ペット防災セットは買うべき？',
    description:
      'ペット用の防災セットで用意できるものと、セットでは用意しにくい物を、環境省のガイドラインの持ち物リストと照らし合わせて比較しました。',
    animal: 'all',
    updatedAt: '2026-10-05',
  },
  {
    path: '/checklist',
    title: 'ペット同行避難｜持ち物チェックリスト',
    short: '同行避難の持ち物チェックリスト',
    description:
      '環境省「人とペットの災害対策ガイドライン＜一般飼い主編＞」の持ち物の優先順位と、同行避難の準備例をチェックリストにしました。',
    animal: 'all',
    updatedAt: '2026-10-05',
  },
];

export const INFO_PAGES: PageMeta[] = [
  { path: '/about', title: '運営者情報・広告について', short: '運営者情報・広告について', description: '当サイトの運営者情報と、広告（楽天アフィリエイト）の利用について。', animal: 'all', updatedAt: '2026-10-05' },
  { path: '/privacy', title: 'プライバシーポリシー', short: 'プライバシーポリシー', description: '当サイトのプライバシーポリシー。', animal: 'all', updatedAt: '2026-10-05' },
  { path: '/sources', title: '出典・参考資料', short: '出典・参考資料', description: '当サイトの公的情報の出典として用いている資料の一覧。', animal: 'all', updatedAt: '2026-10-05' },
];

export function getPage(p: string): PageMeta {
  const m = [...ARTICLES, ...INFO_PAGES].find((x) => x.path === p);
  if (!m) throw new Error(`unknown page: ${p}`);
  return m;
}

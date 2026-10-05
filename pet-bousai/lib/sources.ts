/**
 * 出典（一次資料）の定義。
 * 本文中の公的情報は、ここに挙げた資料の記載に基づく。記載ページは「一般飼い主編」PDF（a-1a.pdf）の
 * ページ番号（冊子の下部に印字された番号）。2026-10-05 に GitHub Actions 上で原文PDFを取得・テキスト化して照合した。
 */

export type SourceId = 'owner-guide' | 'main-guide' | 'moe-disaster' | 'revision';

export interface Source {
  id: SourceId;
  title: string;
  publisher: string;
  issued: string;
  url: string;
  note?: string;
}

export const SOURCES: Record<SourceId, Source> = {
  'owner-guide': {
    id: 'owner-guide',
    title: '災害、あなたとペットは大丈夫？ 人とペットの災害対策ガイドライン＜一般飼い主編＞',
    publisher: '環境省',
    issued: '平成30年3月発行',
    url: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/h3009a.html',
  },
  'main-guide': {
    id: 'main-guide',
    title: '人とペットの災害対策ガイドライン',
    publisher: '環境省',
    issued: '平成30年3月発行',
    url: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/h3002.html',
  },
  'moe-disaster': {
    id: 'moe-disaster',
    title: 'ペットの災害対策（動物の愛護と適切な管理）',
    publisher: '環境省',
    issued: 'ウェブページ',
    url: 'https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html',
  },
  revision: {
    id: 'revision',
    title: '「人とペットの災害対策ガイドライン」の改訂等に係る検討会',
    publisher: '環境省',
    issued: '令和7年10月〜',
    url: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/saigai_guide_pet.html',
    note: 'ガイドラインの改訂に向けた検討が行われています。改訂版が公表された場合は、そちらの内容が優先されます。',
  },
};

/** 出典を最後に原文と照合した日 */
export const SOURCES_CHECKED_AT = '2026年10月5日';

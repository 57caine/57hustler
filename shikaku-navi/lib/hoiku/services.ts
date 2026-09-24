// 保育士転職サービスの掲載データ
//
// 【骨格段階の注意】
// - affiliateUrl はすべてダミー（'#'）。A8.net等で提携後に実URLへ差し替える
// - 「要確認」と書かれた項目は、各社公式サイトで確認してから埋めること。
//   求人数・満足度・内定率などの数値は、出典（公式サイトの記載・調査日）なしで載せない
//   （景品表示法の優良誤認リスク。CLAUDE.md「コラム自動生成の公開前チェック」と同じ基準）

export const TBD = '要確認';

export type HoikuServiceType = '転職エージェント型' | '求人サイト型' | '派遣特化型';

export interface HoikuService {
  slug: string;
  rank: number;
  name: string;
  operator: string;
  type: HoikuServiceType;
  /** 一言キャッチ（比較表・ランキング見出し用） */
  catchCopy: string;
  /** 対応エリア */
  area: string;
  /** 主なサポート内容 */
  support: string;
  /** 求人数（出典つきで記載する） */
  jobCount: string;
  /** 向いている人 */
  goodFor: string[];
  /** 注意点 */
  caution: string[];
  affiliateUrl: string;
  officialUrl: string;
}

export const hoikuServices: HoikuService[] = [
  {
    slug: 'hoikushibank',
    rank: 1,
    name: '保育士バンク！',
    operator: '株式会社ネクストビート',
    type: '転職エージェント型',
    catchCopy: '保育業界に特化した転職支援。求人紹介から面接対策まで相談できる',
    area: '全国（地域別の求人状況は要確認）',
    support: '求人紹介・条件交渉・面接対策（詳細は要確認）',
    jobCount: TBD,
    goodFor: ['初めての転職で相談相手がほしい人', '条件交渉を任せたい人', '地方で求人を探している人（要確認）'],
    caution: ['担当者から連絡が来るため、自分のペースで探したい人には合わない場合がある'],
    affiliateUrl: '#',
    officialUrl: 'https://www.hoikushibank.com/',
  },
  {
    slug: 'jobmedley',
    rank: 2,
    name: 'ジョブメドレー',
    operator: '株式会社メドレー',
    type: '求人サイト型',
    catchCopy: '医療・介護・保育の求人サイト。自分で求人を検索して応募できる',
    area: '全国（要確認）',
    support: '求人検索・スカウト機能（詳細は要確認）',
    jobCount: TBD,
    goodFor: ['自分のペースで求人を比較したい人', '担当者とのやり取りを減らしたい人'],
    caution: ['条件交渉などは基本的に自分で行う必要がある（要確認）'],
    affiliateUrl: '#',
    officialUrl: 'https://job-medley.com/',
  },
  {
    slug: 'mynavi-hoikushi',
    rank: 3,
    name: 'マイナビ保育士',
    operator: '株式会社マイナビ',
    type: '転職エージェント型',
    catchCopy: '大手人材会社が運営する保育士専門の転職支援サービス',
    area: TBD,
    support: '求人紹介・書類添削・面接対策（詳細は要確認）',
    jobCount: TBD,
    goodFor: ['大手運営の安心感を重視する人', '都市部で求人を探している人（要確認）'],
    caution: ['対応エリアが限られる可能性がある（要確認）'],
    affiliateUrl: '#',
    officialUrl: 'https://hoiku.mynavi.jp/',
  },
  {
    slug: 'hoikubatake',
    rank: 4,
    name: 'ほいく畑',
    operator: TBD,
    type: '転職エージェント型',
    catchCopy: '正社員だけでなく派遣・パートなど多様な働き方の求人を扱う',
    area: TBD,
    support: TBD,
    jobCount: TBD,
    goodFor: ['派遣・パートも含めて検討したい人（要確認）'],
    caution: [TBD],
    affiliateUrl: '#',
    officialUrl: 'https://www.hoikubatake.jp/',
  },
];

export function getMainService(): HoikuService {
  return hoikuServices.find((s) => s.slug === 'hoikushibank')!;
}

export function getServiceBySlug(slug: string): HoikuService | undefined {
  return hoikuServices.find((s) => s.slug === slug);
}

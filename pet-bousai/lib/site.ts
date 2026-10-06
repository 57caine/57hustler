/**
 * サイト全体の設定と、検索エンジンへの公開（index）可否の判定。
 *
 * index を許可するのは、次の2つが両方そろったときだけ:
 *   1. PET_BOUSAI_SITE_URL に独自ドメインの URL が設定されている（*.vercel.app は不可）
 *   2. PET_BOUSAI_INDEXABLE=true が明示的に設定されている（オーナーの最終承認後に設定する）
 * どちらかが欠けていれば、全ページ noindex・canonical なし・sitemap 空のまま。
 * 1 を満たさずに 2 だけ設定した場合は、誤公開を防ぐためビルドを失敗させる。
 */

export const SITE_NAME = 'ペット防災ガイド（仮）';
export const SITE_DESCRIPTION =
  '犬・猫・うさぎ・モルモットの飼い主向けに、環境省の資料をもとにした災害への備えと、普段から使える防災用品の選び方をまとめています。';

function normalizeSiteUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return null;
    if (u.hostname.endsWith('.vercel.app')) return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

/** 独自ドメインの URL（未設定・不正・vercel.app のときは null） */
export const SITE_URL: string | null = normalizeSiteUrl(process.env.PET_BOUSAI_SITE_URL);

const indexRequested = process.env.PET_BOUSAI_INDEXABLE === 'true';
if (indexRequested && !SITE_URL) {
  throw new Error(
    'PET_BOUSAI_INDEXABLE=true ですが、PET_BOUSAI_SITE_URL に独自ドメイン（https、vercel.app 以外）が設定されていません。noindex 解除を中止します。',
  );
}

/** 検索エンジンに登録させてよいか */
export const INDEXABLE: boolean = indexRequested && SITE_URL !== null;

/** 楽天アフィリエイトID（lens-navi と共通の1アカウント。リンクURLに含まれる公開情報） */
export const RAKUTEN_AFFILIATE_ID = '5567171b.a80702dc.5567171c.a1d1b6fc';

/**
 * GA4 測定ID（2026-10-07 オーナー作成のデータストリーム、対象: https://pet-bousai-pi.vercel.app）。
 * 測定IDはページのHTMLに必ず含まれる公開情報のため、コードに直接記載する。
 */
export const GA_MEASUREMENT_ID = 'G-KPE1LBHFW7';

export const AD_NOTICE = '当サイトは楽天アフィリエイトを利用しており、商品の紹介には広告が含まれます。';

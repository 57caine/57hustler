import type { Metadata } from 'next';
import { INDEXABLE, SITE_NAME, SITE_URL } from './site';
import type { PageMeta } from './pages';

/**
 * ページの metadata。
 * - robots: INDEXABLE（独自ドメイン設定＋オーナー承認）のときだけ index。それ以外は noindex, nofollow
 * - canonical: 独自ドメイン（SITE_URL）が設定されているときだけ出す。vercel.app を指す canonical は出さない
 */
export function pageMetadata(meta: PageMeta): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: SITE_URL ? { canonical: `${SITE_URL}${meta.path === '/' ? '/' : meta.path}` } : undefined,
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      type: 'article',
      url: SITE_URL ? `${SITE_URL}${meta.path}` : undefined,
    },
  };
}

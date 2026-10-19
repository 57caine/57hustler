import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/site';

/**
 * robots.txt
 * クロールは常に許可する（ブロックすると、検索エンジンがページ内の noindex を読めなくなるため）。
 * sitemap の場所は、index を許可したとき（独自ドメイン＋オーナー承認）だけ記載する。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(INDEXABLE && SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}

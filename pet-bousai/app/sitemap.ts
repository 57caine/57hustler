import type { MetadataRoute } from 'next';
import { ARTICLES, INFO_PAGES } from '@/lib/pages';
import { SITE_URL } from '@/lib/site';

/**
 * sitemap.xml
 * 独自ドメイン（PET_BOUSAI_SITE_URL）が設定されているときだけ URL を載せる。
 * 未設定のとき（vercel.app での確認中）は空にして、vercel.app の URL を検索エンジンに知らせない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  const latest = [...ARTICLES].map((a) => a.updatedAt).sort().at(-1)!;
  return [
    { url: `${SITE_URL}/`, lastModified: latest },
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}${a.path}`, lastModified: a.updatedAt })),
    ...INFO_PAGES.map((a) => ({ url: `${SITE_URL}${a.path}`, lastModified: a.updatedAt })),
  ];
}

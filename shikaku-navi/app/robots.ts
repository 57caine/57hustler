import { MetadataRoute } from 'next';
import { HOIKU_INDEXABLE } from '@/lib/hoiku/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    // /hoiku は公開準備が整う（HOIKU_INDEXABLE=true）まで sitemap を案内しない
    sitemap: [
      'https://shikaku.lens-navi.jp/sitemap.xml',
      ...(HOIKU_INDEXABLE ? ['https://shikaku.lens-navi.jp/hoiku/sitemap.xml'] : []),
    ],
    host: 'https://shikaku.lens-navi.jp',
  };
}

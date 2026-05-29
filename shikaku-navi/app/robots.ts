import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: 'https://shikaku-navi.jp/sitemap.xml',
    host: 'https://shikaku-navi.jp',
  };
}

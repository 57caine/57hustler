import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: 'https://shop.lens-navi.jp/sitemap.xml',
    host: 'https://shop.lens-navi.jp',
  };
}

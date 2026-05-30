import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: 'https://school.lens-navi.jp/sitemap.xml',
    host: 'https://school.lens-navi.jp',
  };
}

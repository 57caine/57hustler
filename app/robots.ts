import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://57hustler-1vt8.vercel.app/sitemap.xml',
    host: 'https://57hustler-1vt8.vercel.app',
  };
}

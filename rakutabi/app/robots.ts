import type { MetadataRoute } from 'next';

// The validation-stage site remains noindex via app/layout.tsx metadata.
// Do not Disallow crawling here: crawlers must be able to read that noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
  };
}

import { MetadataRoute } from 'next';
import { schools, getAllCategories } from '@/lib/schools';
import { columns } from '@/lib/columns';

export const dynamic = 'force-static';

const BASE_URL = 'https://nsplot.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const schoolUrls: MetadataRoute.Sitemap = schools.map((s) => ({
    url: `${BASE_URL}/schools/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${BASE_URL}/category/${encodeURIComponent(c)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const columnUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/column`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...columns.map((c) => ({
      url: `${BASE_URL}/column/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/schools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...categoryUrls,
    ...schoolUrls,
    ...columnUrls,
  ];
}

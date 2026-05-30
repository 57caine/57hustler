import { MetadataRoute } from 'next';
import { courses, getAllCategories } from '@/lib/courses';
import { columns } from '@/lib/columns';

const BASE_URL = 'https://shikaku-navi.jp';

export default function sitemap(): MetadataRoute.Sitemap {
  const courseUrls: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categorySlugMap: Record<string, string> = {
    '国家資格': 'kokukaShikaku',
    '転職・就職向け': 'tensyoku',
    '副業・スキルアップ': 'fukugyou',
    'IT資格': 'it',
  };
  const categoryUrls: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${BASE_URL}/category/${categorySlugMap[c] ?? encodeURIComponent(c)}`,
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
    { url: `${BASE_URL}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...categoryUrls,
    ...courseUrls,
    ...columnUrls,
  ];
}

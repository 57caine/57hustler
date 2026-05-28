import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/products';
import { columns } from '@/lib/columns';

const BASE_URL = 'https://lens-navi.jp';

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const categories = getAllCategories();
  const brands = getAllBrands();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const brandUrls: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${BASE_URL}/brand/${b.slug}`,
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
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...categoryUrls,
    ...productUrls,
    ...brandUrls,
    ...columnUrls,
  ];
}

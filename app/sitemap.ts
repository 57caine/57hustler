import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/products';
import { columns } from '@/lib/columns';
import { eyeColumns } from '@/lib/eye-columns';
import { karakonColumns } from '@/lib/karakon-columns';

const BASE_URL = 'https://lens-navi.jp';

const VALID_BC = ['8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'];

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const categories = getAllCategories();
  const brands = getAllBrands();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/karakon`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/megane`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vr`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/lasik`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/eye-care`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/eye-goods`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/column`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/disclosure`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  const bcUrls: MetadataRoute.Sitemap = VALID_BC.map((v) => ({
    url: `${BASE_URL}/bc/${v}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const brandUrls: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${BASE_URL}/brand/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const allColumnMeta = [...karakonColumns, ...eyeColumns, ...columns];
  const columnUrls: MetadataRoute.Sitemap = allColumnMeta.map((c) => ({
    url: `${BASE_URL}/column/${c.slug}`,
    lastModified: new Date(c.updatedAt ?? c.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: c.category === 'カラコン' ? 0.8 : 0.7,
  }));

  return [
    ...staticUrls,
    ...bcUrls,
    ...categoryUrls,
    ...productUrls,
    ...brandUrls,
    ...columnUrls,
  ];
}

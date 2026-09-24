import { MetadataRoute } from 'next';
import { HOIKU_BASE_URL, HOIKU_INDEXABLE } from '@/lib/hoiku/config';

// /hoiku/sitemap.xml（資格ナビ本体の /sitemap.xml とは分離）
// noindex の間は空にしておく
export default function sitemap(): MetadataRoute.Sitemap {
  if (!HOIKU_INDEXABLE) return [];
  return [{ url: HOIKU_BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 }];
}

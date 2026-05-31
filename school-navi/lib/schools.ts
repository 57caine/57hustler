import schoolsData from '@/data/schools.json';

export type School = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  priceNote: string;
  period: string;
  format: string[];
  features: string[];
  languages: string[];
  targetAudience: string;
  rating: number;
  reviewCount: number;
  affiliate_url: string;
  official_url?: string;
  highlight: boolean;
  description: string;
  pros: string[];
  cons: string[];
};

export const schools: School[] = schoolsData as School[];

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find((s) => s.slug === slug);
}

export function getSchoolsByCategory(category: string): School[] {
  return schools.filter((s) => s.category === category);
}

export function getHighlightedSchools(): School[] {
  return schools.filter((s) => s.highlight);
}

export function getAllCategories(): string[] {
  return [...new Set(schools.map((s) => s.category))];
}

export function getTopSchoolsByRating(limit = 5): School[] {
  return [...schools].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

import coursesData from '@/data/courses.json';

export type Course = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  priceNote: string;
  targetExam: string[];
  format: string[];
  features: string[];
  passRate: string;
  affiliate_url: string;
  official_url?: string;
  highlight: boolean;
  description: string;
  pros: string[];
  cons: string[];
};

export const courses: Course[] = coursesData as Course[];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter((c) => c.category === category);
}

export function getHighlightedCourses(): Course[] {
  return courses.filter((c) => c.highlight);
}

export function getAllCategories(): string[] {
  return [...new Set(courses.map((c) => c.category))];
}

export function getSubsidyCourses(): Course[] {
  return courses.filter((c) => c.features.includes('給付金対象'));
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

import productsData from '@/data/products.json';

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  images: string[];
  status: 'draft' | 'published';
  stockNote?: string;
};

export const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

// NETSEA連携・在庫確定・決済導線の確認が完了するまでは購入不可として扱う。
export function isPurchasable(product: Product): boolean {
  return product.status === 'published';
}

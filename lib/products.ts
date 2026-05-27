import productsData from '@/data/products.json';
import pricesData from '@/data/prices.json';

export type Product = {
  id: string;
  name: string;
  brand: string;
  brandName: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  bc: string;
  dia: string;
  waterContent: string;
  image: string;
  slug: string;
  popularity: number;
};

export type Brand = {
  slug: string;
  name: string;
  nameEn: string;
  manufacturer: string;
  country: string;
};

export type Category = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
};

export type Store = {
  id: string;
  name: string;
  url: string;
  affiliateParam: string;
};

export type Price = {
  productId: string;
  storeId: string;
  price: number;
  pricePerBox: number;
  boxes: number;
  lensCount: number;
  url: string;
  inStock: boolean;
  lastUpdated: string;
};

export type ProductWithPrices = Product & {
  prices: (Price & { store: Store })[];
  lowestPrice: number | null;
  highestPrice: number | null;
};

export function getAllProducts(): Product[] {
  return productsData.products as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsData.products.find((p) => p.slug === slug) as Product | undefined;
}

export function getProductsByCategory(category: string): Product[] {
  return productsData.products.filter((p) => p.category === category) as Product[];
}

export function getProductsByBrand(brand: string): Product[] {
  return productsData.products.filter((p) => p.brand === brand) as Product[];
}

export function getAllBrands(): Brand[] {
  return productsData.brands as Brand[];
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return productsData.brands.find((b) => b.slug === slug) as Brand | undefined;
}

export function getAllCategories(): Category[] {
  return productsData.categories as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return productsData.categories.find((c) => c.slug === slug) as Category | undefined;
}

export function getAllStores(): Store[] {
  return productsData.stores as Store[];
}

export function getStoreById(id: string): Store | undefined {
  return productsData.stores.find((s) => s.id === id) as Store | undefined;
}

export function getPricesForProduct(productId: string): (Price & { store: Store })[] {
  const prices = pricesData.prices.filter((p) => p.productId === productId) as Price[];
  return prices
    .map((price) => {
      const store = getStoreById(price.storeId);
      return store ? { ...price, store } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.price - b!.price) as (Price & { store: Store })[];
}

export function getProductWithPrices(slug: string): ProductWithPrices | undefined {
  const product = getProductBySlug(slug);
  if (!product) return undefined;

  const prices = getPricesForProduct(product.id);
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : null;

  return { ...product, prices, lowestPrice, highestPrice };
}

export function getAllProductsWithPrices(): ProductWithPrices[] {
  return getAllProducts().map((product) => {
    const prices = getPricesForProduct(product.id);
    const lowestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;
    const highestPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : null;
    return { ...product, prices, lowestPrice, highestPrice };
  });
}

export function getPricesUpdatedAt(): string {
  return pricesData.updatedAt;
}

import fs from 'node:fs';
import path from 'node:path';

export interface Product {
  itemCode: string;
  /** 表示用の商品名（ショップの宣伝文の括弧書きを除いたもの） */
  name: string;
  shopName: string;
  /** 楽天アフィリエイトURL（APIの affiliateUrl をそのまま使う） */
  url: string;
  /** APIが提供する画像URL（加工しない） */
  imageUrl: string;
}

export interface ProductsFile {
  fetchedAt: string;
  attribution: string;
  groups: Record<string, Product[]>;
}

/**
 * ビルド時に data/products.json を読む（公開ワークフローが楽天APIから取得して生成する）。
 * 開発環境などでファイルが無い場合は商品なしとして扱い、ページ側は「商品情報は公開時に取得」と表示する。
 */
export function loadProducts(): ProductsFile | null {
  const file = path.join(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as ProductsFile;
}

export function formatFetchedDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

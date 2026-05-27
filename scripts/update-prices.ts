/**
 * 価格データ自動更新スクリプト
 *
 * 本番では各ショップのAPIや価格フィードを使用。
 * 現在はデモデータを生成して更新。
 */

import * as fs from 'fs';
import * as path from 'path';

interface Price {
  productId: string;
  storeId: string;
  price: number;
  pricePerBox: number;
  boxes: number;
  lensCount: number;
  url: string;
  inStock: boolean;
  lastUpdated: string;
}

interface PricesData {
  updatedAt: string;
  prices: Price[];
}

function simulatePriceUpdate(basePrice: number): number {
  const fluctuation = (Math.random() - 0.5) * 0.1;
  return Math.round((basePrice * (1 + fluctuation)) / 10) * 10;
}

async function updatePrices(): Promise<void> {
  const pricesPath = path.join(process.cwd(), 'data', 'prices.json');
  const currentData: PricesData = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));

  console.log(`価格更新開始: ${new Date().toISOString()}`);

  const updatedPrices: Price[] = currentData.prices.map((price) => ({
    ...price,
    price: simulatePriceUpdate(price.price),
    pricePerBox: simulatePriceUpdate(price.pricePerBox),
    lastUpdated: new Date().toISOString(),
    inStock: Math.random() > 0.1,
  }));

  const updatedData: PricesData = {
    updatedAt: new Date().toISOString(),
    prices: updatedPrices,
  };

  fs.writeFileSync(pricesPath, JSON.stringify(updatedData, null, 2), 'utf-8');
  console.log(`価格データ更新完了: ${updatedPrices.length}件`);
  console.log(`更新日時: ${updatedData.updatedAt}`);
}

updatePrices().catch(console.error);

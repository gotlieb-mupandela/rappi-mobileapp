import { getAssortment } from './assortment';
import type { Product, SizeStock } from './types';

export function buyableSizes(product: Product): SizeStock[] {
  return (product.sizes ?? []).filter((s) => s.stock > 0);
}

export function skuStock(product: Product) {
  return product.stockQty ?? product.sizes.reduce((sum, s) => sum + s.stock, 0);
}

export function isSoldOut(product: Product) {
  return buyableSizes(product).length === 0 || skuStock(product) <= 0;
}

export function pickerSizes(product: Product): SizeStock[] {
  return (product.sizes ?? []).filter((s) => !/^(SKU|PACK|ONE)$/i.test(s.size));
}

export function hasVisibleSizePicker(product: Product) {
  return pickerSizes(product).length > 0;
}

export function sizeDisplayLabel(size: string) {
  if (size === 'PACK') return 'Assortment pack';
  if (size === 'SKU') return 'SKU';
  if (size === 'ONE') return 'One size';
  const bib: Record<string, string> = { S01: '3XS', S02: 'XS', S03: 'M', S04: 'XL' };
  const mapped = bib[size.toUpperCase()];
  return mapped ? `${size} · ${mapped}` : size;
}

export function isLowStock(stock: number) {
  return stock > 0 && stock < 5;
}

export function stockLabel(product: Product) {
  if (isSoldOut(product)) return 'Sold out';
  const total = skuStock(product);
  if (total < 5) return `${total} left`;
  return `${total} in stock`;
}

export function colorCountLabel(product: Product) {
  const blob = `${product.displayName} ${product.name}`.toLowerCase();
  if (/\b(black|white|navy|green|red|blue|royal|orange|yellow|pink|grey|gray|lime)\b/.test(blob)) {
    return '1 Color';
  }
  return product.gender === 'unisex' ? 'Unisex' : product.gender[0].toUpperCase() + product.gender.slice(1);
}

export function unitLabel(product: Product, size: string) {
  const pack = getAssortment(product);
  if (pack?.isAssortment && !pack.preserveSizes) return pack.label;
  return sizeDisplayLabel(size);
}

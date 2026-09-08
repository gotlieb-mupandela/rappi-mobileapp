import { formatPrice } from './format';
import type { Product } from './types';

export const WHOLESALE_SHOE_ASSORTMENT_THRESHOLD_NAD = 4000;
export const BIB_PACK_PRICE_NAD = 900;

const NAMED_PACK = /\bpack(?:\s+of)?\s+(\d+)\b/i;
const BOX_OF = /\bbox of\s+(\d+)\b/i;
const FOOTWEAR_NAME =
  /\b(sneaker|sandal|barefoot|shoe|boot|cleat|spike|trainer|footwear)\b/i;
const NOT_FOOTWEAR =
  /\b(shoe bag|bag|backpack|shirt|t-shirt|short|bermuda|jacket|sweat|pant|tight|legging|bra|sock|dress|skirt|glove|cap|hat)\b/i;
const FOOTBALL_SURFACE =
  /\b(turf|firm ground|soft ground|artificial grass|futsal|indoor)\b/i;
const TRAINING_BIB_RE = /\b(training bibs?|petos(?:\s+de\s+entrenamiento|\s+entrenamiento)?)\b/i;
const NOT_BIB_PACK_RE = /\b(gps bib|crono bib|myskin)\b/i;
const BIB_CODE = /^101686\./i;

export type AssortmentInfo = {
  isAssortment: boolean;
  packSize: number | null;
  label: string;
  pairHint: string | null;
  preserveSizes?: boolean;
};

function blob(product: Product) {
  return [product.displayName, product.name].filter(Boolean).join(' ');
}

export function isFootwearSku(product: Product) {
  if (product.category === 'shoes') return true;
  if (product.subcategory === 'boots' || product.subcategory === 'kids-shoes') return true;
  const text = blob(product);
  if (NOT_FOOTWEAR.test(text) && !FOOTWEAR_NAME.test(text)) return false;
  if (FOOTWEAR_NAME.test(text)) return true;
  if (product.category === 'football' && FOOTBALL_SURFACE.test(text)) return true;
  return false;
}

export function isTrainingBibPack(product: Product) {
  if (BIB_CODE.test(product.code)) return true;
  const text = blob(product);
  if (!TRAINING_BIB_RE.test(text) || NOT_BIB_PACK_RE.test(text)) return false;
  return (product.sizeOptions ?? []).some((s) => /^S0\d$/i.test(s));
}

function namedPackSize(product: Product): number | null {
  const text = blob(product);
  const pack = text.match(NAMED_PACK);
  if (pack) return Number(pack[1]);
  const box = text.match(BOX_OF);
  if (box) return Number(box[1]);
  return null;
}

function pairHint(price: number, size: number | null) {
  if (!price || price <= 0) return null;
  if (size && size > 1) return `About ${formatPrice(price / size)} / pair`;
  return `About ${formatPrice(price / 8)} / pair (8) · ${formatPrice(price / 12)} / pair (12)`;
}

export function getAssortment(product: Product): AssortmentInfo | null {
  if (isTrainingBibPack(product)) {
    const price = product.price || BIB_PACK_PRICE_NAD;
    return {
      isAssortment: true,
      packSize: 10,
      label: 'Pack of 10',
      pairHint: `${formatPrice(price / 10)} each`,
      preserveSizes: true,
    };
  }
  const named = namedPackSize(product);
  if (named && named > 1) {
    const footwear = isFootwearSku(product);
    const unit = footwear ? 'pairs' : 'pcs';
    return {
      isAssortment: true,
      packSize: named,
      label: `Pack · ${named} ${unit}`,
      pairHint: footwear
        ? pairHint(product.price, named)
        : `About ${formatPrice(product.price / named)} each`,
    };
  }
  if (isFootwearSku(product) && product.price >= WHOLESALE_SHOE_ASSORTMENT_THRESHOLD_NAD) {
    return {
      isAssortment: true,
      packSize: null,
      label: 'Wholesale assortment (8–12 pairs)',
      pairHint: pairHint(product.price, null),
    };
  }
  return null;
}

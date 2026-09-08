import { AUDIENCES, CATEGORIES, LISTING_PAGE_SIZE, SUBCATEGORY_LABELS, type AudienceSlug } from './catalog';
import { getAssortment } from './assortment';
import type { CompactProduct, Gender, ListingQuery, ListingResult, Product } from './types';

const KIDS_NAME_RE = /\b(junior| jr\b|kids|child|baby|youth|teen)\b/;
const WOMEN_NAME_RE = /\b(lady|ladies|women|woman|female|womens)\b/;
const MEN_NAME_RE = /\b(men|man|male|mens)\b/;

export function expandProduct(row: CompactProduct): Product {
  const sizes = (row.sizes ?? []).map(([size, stock]) => ({ size, stock }));
  const images = [row.img, ...(row.imgs ?? [])].filter(Boolean);
  const uniq = [...new Set(images)];
  const gender = (['men', 'women', 'kids', 'unisex'] as Gender[]).includes(row.g as Gender)
    ? (row.g as Gender)
    : 'unisex';
  const product: Product = {
    id: row.id,
    code: row.code,
    name: row.name,
    displayName: row.name,
    category: row.cat,
    subcategory: row.sub,
    gender,
    price: row.price,
    currency: 'NAD',
    stockQty: row.stock,
    badge: row.badge ?? null,
    sizeOptions: sizes.map((s) => s.size),
    sizes,
    imageUrl: uniq[0] ?? '',
    images: uniq,
    description: '',
  };
  product.description = productDescription(product);
  return product;
}

export function expandRemoteProduct(raw: Record<string, unknown>): Product {
  const sizesRaw = (raw.sizes as Array<{ size: string; stock: number }> | undefined) ?? [];
  const compact: CompactProduct = {
    id: String(raw.id ?? raw.code ?? ''),
    code: String(raw.code ?? ''),
    name: String(raw.displayName ?? raw.name ?? raw.code ?? ''),
    cat: String(raw.category ?? 'sportswear'),
    sub: String(raw.subcategory ?? 'general'),
    g: String(raw.gender ?? 'unisex'),
    price: Math.round(Number(raw.price) || 0),
    stock: Number(raw.stockQty ?? raw.totalQty ?? 0) || 0,
    badge: (raw.badge as CompactProduct['badge']) ?? null,
    img: String(raw.imageUrl ?? ''),
    imgs: Array.isArray(raw.images) ? (raw.images as string[]) : [],
    sizes: sizesRaw.map((s) => [s.size, Number(s.stock) || 0]),
  };
  return expandProduct(compact);
}

export function isKidsProduct(product: Product) {
  if (product.gender === 'kids') return true;
  if (['tees-kids', 'jackets-kids', 'kids-shoes'].includes(product.subcategory)) return true;
  const blob = `${product.displayName} ${product.name}`.toLowerCase();
  if (KIDS_NAME_RE.test(blob)) return true;
  const nums = product.sizeOptions.map((s) => Number.parseFloat(s)).filter((n) => Number.isFinite(n));
  return product.category === 'shoes' && nums.length > 0 && Math.max(...nums) <= 35;
}

export function productAudience(product: Product): AudienceSlug | 'unisex' {
  if (isKidsProduct(product)) return 'kids';
  const blob = `${product.displayName} ${product.name}`.toLowerCase();
  if (product.gender === 'women' || WOMEN_NAME_RE.test(blob)) return 'women';
  if (product.gender === 'men' || MEN_NAME_RE.test(blob)) return 'men';
  return 'unisex';
}

export function matchesAudience(product: Product, audience?: string) {
  if (!audience || audience === 'all') return true;
  const resolved = productAudience(product);
  if (audience === 'kids') return resolved === 'kids';
  if (audience === 'women') return resolved === 'women';
  if (audience === 'men') return resolved === 'men';
  if (audience === 'adult') return resolved !== 'kids';
  return true;
}

export function productDescription(product: Product) {
  const hub = CATEGORIES.find((c) => c.slug === product.category)?.name ?? 'the catalog';
  const sub = SUBCATEGORY_LABELS[product.subcategory];
  const pack = getAssortment(product);
  const bits = [`${product.displayName} from the ${hub} drop.`];
  if (sub && sub !== 'More') bits.push(`${sub}.`);
  if (pack?.packSize === 10) {
    bits.push('Sold as a pack of 10. The N$ price is for the full pack.');
  } else if (pack?.isAssortment) {
    bits.push(`Sold as ${pack.label.toLowerCase()}. The N$ price is the pack price.`);
  }
  bits.push('Priced in Namibian dollars.');
  return bits.join(' ');
}

export function searchProducts(catalog: Product[], query: string, category?: string) {
  const q = query.trim().toLowerCase();
  let list = catalog;
  if (category && category !== 'all') list = list.filter((p) => p.category === category);
  if (!q) return list;
  return list.filter((p) => {
    const catName = CATEGORIES.find((c) => c.slug === p.category)?.name.toLowerCase() ?? '';
    const sub = (SUBCATEGORY_LABELS[p.subcategory] ?? p.subcategory).toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      catName.includes(q) ||
      sub.includes(q) ||
      p.category.includes(q)
    );
  });
}

export function filterListing(catalog: Product[], query: ListingQuery): Product[] {
  const q = (query.q ?? '').trim();
  let list = q ? searchProducts(catalog, q, query.cat) : catalog;
  if (!q && query.cat && query.cat !== 'all') {
    list = list.filter((p) => p.category === query.cat);
  }
  const sub = query.sub && query.sub !== 'all' ? query.sub : '';
  const size = query.size && query.size !== 'all' ? query.size : '';
  const audience = query.audience && query.audience !== 'all' ? query.audience : '';
  const max = query.max ? Number(query.max) : NaN;
  return list.filter((p) => {
    if (sub && p.subcategory !== sub) return false;
    if (audience && !matchesAudience(p, audience)) return false;
    if (size && !p.sizes.some((s) => s.size === size && s.stock > 0)) return false;
    if (Number.isFinite(max) && p.price > max) return false;
    return true;
  });
}

function facetCategories(list: Product[]) {
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: counts.get(c.slug) ?? 0,
  })).filter((c) => c.count > 0);
}

function facetAudiences(list: Product[]) {
  const counts = new Map<string, number>();
  for (const p of list) {
    const audience = productAudience(p);
    if (audience === 'unisex') continue;
    counts.set(audience, (counts.get(audience) ?? 0) + 1);
  }
  return AUDIENCES.map((a) => ({
    slug: a.slug,
    name: a.name,
    count: counts.get(a.slug) ?? 0,
  })).filter((a) => a.count > 0);
}

function facetSubs(list: Product[]) {
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.subcategory, (counts.get(p.subcategory) ?? 0) + 1);
  return [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      name: SUBCATEGORY_LABELS[slug] ?? slug,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function facetSizes(list: Product[]) {
  const set = new Set<string>();
  for (const p of list) {
    p.sizes.forEach((s) => {
      if (!/^(ONE|SKU|PACK)$/i.test(s.size) && s.stock > 0) set.add(s.size);
    });
  }
  const order = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'ONE'];
  return [...set].sort((a, b) => {
    const ia = order.indexOf(a.toUpperCase());
    const ib = order.indexOf(b.toUpperCase());
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

export function paginateListing(
  list: Product[],
  query: ListingQuery,
  pageSize = LISTING_PAGE_SIZE,
): ListingResult {
  const rawPage = Number(query.page ?? 1);
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(1, Math.floor(rawPage)), pageCount) : 1;
  const start = (page - 1) * pageSize;
  return {
    products: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
    pageCount,
    query: (query.q ?? '').trim(),
    facets: {
      categories: facetCategories(list),
      audiences: facetAudiences(list),
      subs: facetSubs(list),
      sizes: facetSizes(list),
    },
  };
}

export function buildListing(
  catalog: Product[],
  query: ListingQuery,
  pageSize = LISTING_PAGE_SIZE,
): ListingResult {
  const filtered = filterListing(catalog, query);
  return paginateListing(filtered, query, pageSize);
}

export function getProduct(catalog: Product[], code: string) {
  return catalog.find((p) => p.code === code || p.id === code);
}

export function productsByCategory(catalog: Product[], slug: string) {
  return catalog.filter((p) => p.category === slug);
}

export function categoryCounts(catalog: Product[]) {
  const counts = new Map<string, number>();
  for (const p of catalog) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return counts;
}

export function sampleForCategory(catalog: Product[], slug: string) {
  return catalog.find((p) => p.category === slug && p.stockQty > 0 && p.imageUrl) ??
    catalog.find((p) => p.category === slug && p.imageUrl);
}

export function newArrivals(catalog: Product[], limit = 8) {
  const inStock = catalog.filter((p) => p.stockQty > 0 && p.imageUrl);
  const branded = inStock.filter((p) => p.badge === 'new');
  const pool = branded.length >= limit ? branded : inStock;
  return pool.slice(0, limit);
}

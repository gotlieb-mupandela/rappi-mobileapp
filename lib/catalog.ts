import type { Product } from './types';

/** Nice display names for known category slugs (mirrors rappi-webapp catalog.ts). */
export const CATEGORY_LABELS: Record<string, string> = {
  sportswear: 'Sportswear',
  football: 'Football',
  basketball: 'Basketball',
  netball: 'Netball',
  swimming: 'Swimming',
  rugby: 'Rugby',
  cricket: 'Cricket',
  boxing: 'Boxing',
  hockey: 'Hockey',
  'running-fitness': 'Running & Fitness',
  brama: 'Brama',
  padel: 'Padel',
  hiking: 'Hiking',
  resort: 'Resort',
  lifestyle: 'Lifestyle',
  'teampro-2026': 'Team Pro 2026',
  shoes: 'Shoes',
  'balls-bags': 'Balls & Bags',
  accessories: 'Accessories',
};

/** Featured categories surfaced first (matches web nav priority). */
export const FEATURED_CATEGORIES = [
  'sportswear',
  'football',
  'running-fitness',
  'shoes',
  'basketball',
  'rugby',
];

export type AudienceSlug = 'men' | 'women' | 'kids';

export const AUDIENCES: { slug: AudienceSlug; name: string }[] = [
  { slug: 'men', name: 'Men' },
  { slug: 'women', name: 'Women' },
  { slug: 'kids', name: 'Kids' },
];

const KIDS_RE = /\b(junior| jr\b|kids|child|baby|youth|teen)\b/;
const WOMEN_RE = /\b(lady|ladies|women|woman|female|womens)\b/;
const MEN_RE = /\b(men|man|male|mens)\b/;

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isAvailable(p: Product): boolean {
  return p.available ?? p.stockQty > 0;
}

function isKids(p: Product): boolean {
  if (p.gender === 'kids') return true;
  if (p.subcategory?.includes('kids')) return true;
  const blob = `${p.displayName} ${p.name} ${p.item}`.toLowerCase();
  if (KIDS_RE.test(blob)) return true;
  const nums = p.sizeOptions.map((s) => Number.parseFloat(s)).filter((n) => Number.isFinite(n));
  return nums.length > 0 && Math.max(...nums) <= 35;
}

export function productAudience(p: Product): AudienceSlug | 'unisex' {
  if (isKids(p)) return 'kids';
  const blob = `${p.displayName} ${p.name} ${p.item} ${p.title}`.toLowerCase();
  if (p.gender === 'women' || WOMEN_RE.test(blob)) return 'women';
  if (p.gender === 'men' || MEN_RE.test(blob)) return 'men';
  return 'unisex';
}

export function matchesAudience(p: Product, audience?: string | null): boolean {
  if (!audience || audience === 'all') return true;
  const resolved = productAudience(p);
  if (audience === 'kids') return resolved === 'kids';
  if (audience === 'women') return resolved === 'women';
  if (audience === 'men') return resolved === 'men';
  if (audience === 'adult') return resolved !== 'kids';
  return true;
}

export type CategoryTile = {
  slug: string;
  name: string;
  count: number;
  sample?: Product;
};

/** Build category tiles from the live catalog, featured first, with a sample image. */
export function categoryTiles(catalog: Product[]): CategoryTile[] {
  const byCat = new Map<string, Product[]>();
  for (const p of catalog) {
    const list = byCat.get(p.category) ?? [];
    list.push(p);
    byCat.set(p.category, list);
  }
  const tiles: CategoryTile[] = [];
  for (const [slug, items] of byCat) {
    tiles.push({
      slug,
      name: categoryLabel(slug),
      count: items.length,
      sample: items.find((p) => p.imageUrl) ?? items[0],
    });
  }
  return tiles.sort((a, b) => {
    const fa = FEATURED_CATEGORIES.indexOf(a.slug);
    const fb = FEATURED_CATEGORIES.indexOf(b.slug);
    if (fa !== -1 || fb !== -1) {
      if (fa === -1) return 1;
      if (fb === -1) return -1;
      return fa - fb;
    }
    return b.count - a.count;
  });
}

export type ListingQuery = {
  q?: string;
  cat?: string;
  sub?: string;
  audience?: string;
  page?: number;
  pageSize?: number;
};

export type Listing = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export const PAGE_SIZE = 24;

function searchScore(p: Product, tokens: string[]): number {
  if (!tokens.length) return 1;
  const code = p.code.toLowerCase();
  const blob = `${p.displayName} ${p.name} ${p.category} ${p.subcategory} ${p.item} ${p.code}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!blob.includes(t)) return 0;
    if (code.includes(t)) score += 3;
    if (p.displayName.toLowerCase().includes(t)) score += 2;
    score += 1;
  }
  return score;
}

/** Filter + sort the full catalog client-side (no pagination). */
export function filterCatalog(catalog: Product[], query: ListingQuery): Product[] {
  const tokens = (query.q ?? '')
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const filtered = catalog.filter((p) => {
    if (query.cat && p.category !== query.cat) return false;
    if (query.sub && p.subcategory !== query.sub) return false;
    if (!matchesAudience(p, query.audience)) return false;
    if (tokens.length && searchScore(p, tokens) === 0) return false;
    return true;
  });

  return filtered.sort((a, b) => {
    if (tokens.length) {
      const diff = searchScore(b, tokens) - searchScore(a, tokens);
      if (diff !== 0) return diff;
    }
    const availDiff = Number(isAvailable(b)) - Number(isAvailable(a));
    if (availDiff !== 0) return availDiff;
    const badgeDiff = Number(b.badge === 'new') - Number(a.badge === 'new');
    if (badgeDiff !== 0) return badgeDiff;
    return a.code.localeCompare(b.code);
  });
}

/** Filter + sort + paginate the full catalog entirely client-side. */
export function buildListing(catalog: Product[], query: ListingQuery): Listing {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? PAGE_SIZE;
  const filtered = filterCatalog(catalog, query);
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, page, pageSize, pageCount };
}

/** Curated home sections computed from the catalog. */
export function newArrivals(catalog: Product[], limit = 12): Product[] {
  const withImages = catalog.filter((p) => p.imageUrl && isAvailable(p));
  const badged = withImages.filter((p) => p.badge === 'new');
  const pool = badged.length >= limit ? badged : withImages;
  return pool.slice(0, limit);
}

/** True when a product is sold as a multi-unit pack (e.g. pack of 10 bibs). */
export function packNote(p: Product): string | null {
  const blob = `${p.displayName} ${p.name} ${p.description ?? ''}`.toLowerCase();
  const m = blob.match(/pack of (\d+)/);
  if (m) return `Sold as a pack of ${m[1]}. The N$ price is for the full pack.`;
  return null;
}

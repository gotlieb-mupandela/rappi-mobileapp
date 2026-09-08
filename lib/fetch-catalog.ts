import type { Product } from './types';
import fallback from '../assets/catalog/fallback.json';

/**
 * Primary catalog source: the full production dataset (~11k Joma SKUs) served
 * from the rappi-webapp repo on GitHub raw — same products/images/prices/stock
 * /galleries/descriptions as https://rappi-two.vercel.app.
 */
const RAW_CATALOG_URL =
  process.env.EXPO_PUBLIC_CATALOG_URL ??
  'https://raw.githubusercontent.com/gotlieb-mupandela/rappi-webapp/main/data/products.json';

const isRemote = (u?: string | null) => Boolean(u && /^https?:\/\//i.test(u));

/** Prefer real remote CDN images; keep the array for the PDP gallery. */
function withImages(p: Product): Product {
  const remote = (p.images ?? []).filter(isRemote);
  const primary = isRemote(p.imageUrl) ? p.imageUrl : remote[0];
  const images = remote.length ? remote : primary ? [primary] : [];
  return { ...p, imageUrl: primary ?? p.imageUrl, images: [...new Set(images)] };
}

export type CatalogResult = {
  products: Product[];
  source: 'network' | 'fallback';
};

let cache: CatalogResult | null = null;
let inflight: Promise<CatalogResult> | null = null;

async function load(): Promise<CatalogResult> {
  try {
    const res = await fetch(RAW_CATALOG_URL, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Product[];
    if (!Array.isArray(data) || data.length < 100) throw new Error('unexpected payload');
    return { products: data.map(withImages), source: 'network' };
  } catch {
    return { products: (fallback as Product[]).map(withImages), source: 'fallback' };
  }
}

/** Fetch (and memoize) the full catalog. Falls back to a bundled real subset offline. */
export function fetchCatalog(): Promise<CatalogResult> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = load().then((r) => {
      cache = r;
      inflight = null;
      return r;
    });
  }
  return inflight;
}

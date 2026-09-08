import { CATALOG_REMOTE_URL } from './catalog';
import { expandProduct, expandRemoteProduct } from './products';
import type { CompactProduct, Product } from './types';
import featuredRaw from './data/featured.json';

let cached: Product[] | null = null;
let loading: Promise<Product[]> | null = null;

export function featuredCatalog(): Product[] {
  return (featuredRaw as CompactProduct[]).map(expandProduct);
}

export async function loadCatalog(): Promise<Product[]> {
  if (cached) return cached;
  if (loading) return loading;
  loading = (async () => {
    try {
      const mod = await import('./data/catalog.json');
      const rows = (mod.default ?? mod) as CompactProduct[];
      cached = rows.map(expandProduct);
      return cached;
    } catch {
      const res = await fetch(CATALOG_REMOTE_URL);
      if (!res.ok) throw new Error(`Catalog fetch failed (${res.status})`);
      const rows = (await res.json()) as Record<string, unknown>[];
      cached = rows.map(expandRemoteProduct);
      return cached;
    }
  })();
  try {
    return await loading;
  } catch (err) {
    loading = null;
    throw err;
  }
}

export function catalogSnapshot() {
  return cached;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../lib/types';
import { fetchCatalog } from '../lib/fetch-catalog';

type CatalogState = {
  products: Product[];
  byCode: Map<string, Product>;
  loading: boolean;
  error: string | null;
  source: 'network' | 'fallback' | null;
  getProduct: (code: string) => Product | undefined;
  reload: () => void;
};

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'network' | 'fallback' | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCatalog()
      .then((res) => {
        if (!active) return;
        setProducts(res.products);
        setSource(res.source);
        setError(null);
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to load catalog');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [nonce]);

  const byCode = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.code, p);
    return m;
  }, [products]);

  const value = useMemo<CatalogState>(
    () => ({
      products,
      byCode,
      loading,
      error,
      source,
      getProduct: (code: string) => byCode.get(code),
      reload: () => setNonce((n) => n + 1),
    }),
    [products, byCode, loading, error, source],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartLine } from '../lib/types';

const STORAGE_KEY = 'rsh.cart.v1';

type CartState = {
  lines: CartLine[];
  count: number;
  add: (code: string, size: string, qty?: number) => void;
  setQty: (code: string, size: string, qty: number) => void;
  remove: (code: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const sameLine = (l: CartLine, code: string, size: string) => l.code === code && l.size === size;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines)).catch(() => {});
  }, [lines, hydrated]);

  const value = useMemo<CartState>(() => {
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add: (code, size, qty = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => sameLine(l, code, size));
          if (existing) {
            return prev.map((l) => (sameLine(l, code, size) ? { ...l, qty: l.qty + qty } : l));
          }
          return [...prev, { code, size, qty }];
        }),
      setQty: (code, size, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !sameLine(l, code, size))
            : prev.map((l) => (sameLine(l, code, size) ? { ...l, qty } : l)),
        ),
      remove: (code, size) => setLines((prev) => prev.filter((l) => !sameLine(l, code, size))),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

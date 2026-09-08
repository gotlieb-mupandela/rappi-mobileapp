import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartLine, Order, Product } from '../lib/types';
import { getSupabase } from '../lib/supabase';
import { shippingCostById, shippingLabelById } from '../lib/shipping';

const STORAGE_KEY = 'rsh.orders.v1';

export type PlaceInput = {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  shippingMethod: string;
  notes?: string;
  lines: CartLine[];
};

type PlaceResult = { ok: true; order: Order } | { ok: false; message: string };

type OrdersState = {
  orders: Order[];
  place: (input: PlaceInput, getProduct: (code: string) => Product | undefined) => Promise<PlaceResult>;
};

const OrdersContext = createContext<OrdersState | null>(null);

function localPlace(
  input: PlaceInput,
  getProduct: (code: string) => Product | undefined,
): PlaceResult {
  const items: Order['items'] = [];
  for (const line of input.lines) {
    const product = getProduct(line.code);
    if (!product) return { ok: false, message: `Product ${line.code} not found.` };
    const sizeRow = product.sizes.find((s) => s.size === line.size);
    const stock = sizeRow?.stock ?? product.stockQty;
    if (stock < line.qty) {
      return { ok: false, message: `Only ${stock} in stock for ${line.code} size ${line.size}.` };
    }
    items.push({ code: line.code, name: product.name, size: line.size, qty: line.qty, price: product.price });
  }
  if (!items.length) return { ok: false, message: 'Cart is empty.' };
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = shippingCostById(input.shippingMethod);
  return {
    ok: true,
    order: {
      id: `RSH${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      email: input.email,
      name: input.name,
      address: input.address,
      city: input.city,
      country: input.country,
      shippingMethod: shippingLabelById(input.shippingMethod),
      shippingCost,
      items,
      subtotal,
      total: subtotal + shippingCost,
      status: 'reserved',
    },
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setOrders(JSON.parse(raw) as Order[]))
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders)).catch(() => {});
  }, [orders, hydrated]);

  const value = useMemo<OrdersState>(
    () => ({
      orders,
      place: async (input, getProduct) => {
        if (!input.lines.length) return { ok: false, message: 'Cart is empty.' };
        if (!input.name || !input.email || !input.address || !input.city || !input.country) {
          return { ok: false, message: 'Complete your shipping details.' };
        }
        const sb = getSupabase();
        if (sb) {
          try {
            const { data, error } = await sb.rpc('place_order', {
              p_email: input.email,
              p_name: input.name,
              p_address: input.address,
              p_city: input.city,
              p_country: input.country,
              p_shipping_method: input.shippingMethod,
              p_notes: input.notes ?? '',
              p_lines: input.lines.map((l) => ({ code: l.code, size: l.size, qty: l.qty })),
            });
            if (error) return { ok: false, message: error.message };
            const p = data as Record<string, unknown>;
            const order: Order = {
              id: String(p.id),
              createdAt: String(p.created_at),
              email: String(p.email),
              name: String(p.name),
              address: String(p.address),
              city: String(p.city),
              country: String(p.country),
              shippingMethod: String(p.shipping_method),
              shippingCost: Number(p.shipping_cost),
              items: (p.items as Order['items']) ?? [],
              subtotal: Number(p.subtotal),
              total: Number(p.total),
              status: (p.status as Order['status']) ?? 'reserved',
            };
            setOrders((prev) => [order, ...prev]);
            return { ok: true, order };
          } catch (err) {
            return { ok: false, message: err instanceof Error ? err.message : 'Checkout failed.' };
          }
        }
        const result = localPlace(input, getProduct);
        if (result.ok) setOrders((prev) => [result.order, ...prev]);
        return result;
      },
    }),
    [orders],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersState {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}

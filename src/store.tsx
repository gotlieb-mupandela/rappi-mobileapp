import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_EMAIL, DEMO_PASSWORD, SHIPPING_METHODS, shippingCostById } from './catalog';
import { featuredCatalog, loadCatalog } from './loadCatalog';
import { getProduct } from './products';
import { isSoldOut } from './sizes';
import { storage } from './storage';
import { darkTheme, lightTheme, type Theme, type ThemeName } from './theme';
import type { Address, CartLine, Order, OrderStatus, Product, User } from './types';

export type Tab = 'shop' | 'category' | 'cart' | 'me';

export type Screen =
  | { key: 'tabs' }
  | { key: 'search'; q?: string; cat?: string; audience?: string; sub?: string }
  | { key: 'categoryHub'; slug: string }
  | { key: 'product'; code: string }
  | { key: 'checkout' }
  | { key: 'confirmation'; orderId: string }
  | { key: 'auth' }
  | { key: 'settings' }
  | { key: 'orders' }
  | { key: 'order'; orderId: string }
  | { key: 'favorites' }
  | { key: 'addresses' }
  | { key: 'notifications' };

type Toast = { kind: 'ok' | 'err'; text: string } | null;

type StoreValue = {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  catalog: Product[];
  catalogReady: boolean;
  catalogError: string | null;
  tab: Tab;
  setTab: (tab: Tab) => void;
  stack: Screen[];
  current: Screen;
  push: (screen: Screen) => void;
  pop: () => void;
  resetToTabs: (tab?: Tab) => void;
  openProduct: (code: string) => void;
  openSearch: (q?: string, cat?: string) => void;
  lines: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (code: string, size: string, qty?: number) => { ok: boolean; message: string };
  setQty: (code: string, size: string, qty: number) => void;
  removeLine: (code: string, size: string) => void;
  clearCart: () => void;
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; message: string };
  continueGuest: () => void;
  logout: () => void;
  orders: Order[];
  placeOrder: (input: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    shippingMethod: string;
    notes: string;
  }) => { ok: true; order: Order } | { ok: false; message: string };
  favorites: string[];
  toggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
  addresses: Address[];
  addAddress: (row: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  notify: boolean;
  setNotify: (on: boolean) => void;
  toast: Toast;
  showToast: (kind: 'ok' | 'err', text: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>('light');
  const [catalog, setCatalog] = useState<Product[]>(() => featuredCatalog());
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('shop');
  const [stack, setStack] = useState<Screen[]>([{ key: 'tabs' }]);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notify, setNotifyState] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [savedTheme, savedCart, savedUser, savedOrders, savedFav, savedAddr, savedNotify] =
        await Promise.all([
          storage.loadTheme(),
          storage.loadCart(),
          storage.loadUser(),
          storage.loadOrders(),
          storage.loadFavorites(),
          storage.loadAddresses(),
          storage.loadNotify(),
        ]);
      if (cancelled) return;
      setThemeNameState(savedTheme);
      setLines(savedCart);
      setUser(savedUser);
      setOrders(savedOrders);
      setFavorites(savedFav);
      setAddresses(savedAddr);
      setNotifyState(savedNotify);
      try {
        const full = await loadCatalog();
        if (!cancelled) {
          setCatalog(full);
          setCatalogReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setCatalogError(err instanceof Error ? err.message : 'Catalog failed to load');
          setCatalogReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void storage.saveCart(lines);
  }, [lines]);
  useEffect(() => {
    void storage.saveUser(user);
  }, [user]);
  useEffect(() => {
    void storage.saveOrders(orders);
  }, [orders]);
  useEffect(() => {
    void storage.saveFavorites(favorites);
  }, [favorites]);
  useEffect(() => {
    void storage.saveAddresses(addresses);
  }, [addresses]);
  useEffect(() => {
    void storage.saveTheme(themeName);
  }, [themeName]);
  useEffect(() => {
    void storage.saveNotify(notify);
  }, [notify]);

  const showToast = useCallback((kind: 'ok' | 'err', text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 2400);
  }, []);

  const current = stack[stack.length - 1] ?? { key: 'tabs' as const };

  const push = useCallback((screen: Screen) => {
    setStack((prev) => [...prev, screen]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const resetToTabs = useCallback((next?: Tab) => {
    if (next) setTab(next);
    setStack([{ key: 'tabs' }]);
  }, []);

  const openProduct = useCallback(
    (code: string) => {
      push({ key: 'product', code });
    },
    [push],
  );

  const openSearch = useCallback(
    (q?: string, cat?: string) => {
      push({ key: 'search', q, cat });
    },
    [push],
  );

  const cartCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const cartSubtotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const product = getProduct(catalog, line.code);
      return product ? sum + product.price * line.qty : sum;
    }, 0);
  }, [lines, catalog]);

  const addToCart = useCallback(
    (code: string, size: string, qty = 1) => {
      const product = getProduct(catalog, code);
      if (!product) return { ok: false, message: 'Product not found.' };
      if (isSoldOut(product)) return { ok: false, message: 'This piece is sold out.' };
      const sizeRow = product.sizes.find((s) => s.size === size);
      if (!sizeRow || sizeRow.stock <= 0) return { ok: false, message: 'That size is sold out.' };
      const existing = lines.find((l) => l.code === code && l.size === size);
      const nextQty = (existing?.qty ?? 0) + qty;
      if (nextQty > sizeRow.stock) {
        return { ok: false, message: `Only ${sizeRow.stock} in stock.` };
      }
      setLines((prev) => {
        const current = prev.find((l) => l.code === code && l.size === size);
        if (current) {
          return prev.map((l) => (l.code === code && l.size === size ? { ...l, qty: nextQty } : l));
        }
        return [...prev, { code, size, qty }];
      });
      return { ok: true, message: 'Added to cart.' };
    },
    [catalog, lines],
  );

  const setQty = useCallback(
    (code: string, size: string, qty: number) => {
      const product = getProduct(catalog, code);
      const max = product?.sizes.find((s) => s.size === size)?.stock ?? 0;
      setLines((prev) => {
        if (qty <= 0) return prev.filter((l) => !(l.code === code && l.size === size));
        return prev.map((l) =>
          l.code === code && l.size === size ? { ...l, qty: Math.min(qty, max) } : l,
        );
      });
    },
    [catalog],
  );

  const removeLine = useCallback((code: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.code === code && l.size === size)));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser({ email: DEMO_EMAIL, name: 'RAPPI Shop' });
      return { ok: true, message: 'Welcome back.' };
    }
    if (email.includes('@') && password.length >= 4) {
      setUser({ email: email.trim(), name: email.split('@')[0] || 'Athlete' });
      return { ok: true, message: 'Welcome back.' };
    }
    return { ok: false, message: 'Check email and password. Demo: shop@rappi.com / rappi123' };
  }, []);

  const continueGuest = useCallback(() => {
    setUser({ email: 'guest@rappi.com', name: 'Guest', guest: true });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const placeOrder = useCallback(
    (input: {
      name: string;
      email: string;
      address: string;
      city: string;
      country: string;
      shippingMethod: string;
      notes: string;
    }): { ok: true; order: Order } | { ok: false; message: string } => {
      if (!lines.length) return { ok: false, message: 'Cart is empty.' };
      if (!input.name || !input.email || !input.address || !input.city || !input.country) {
        return { ok: false, message: 'Complete shipping details.' };
      }
      const items: Order['items'] = [];
      for (const line of lines) {
        const product = getProduct(catalog, line.code);
        if (!product) return { ok: false, message: `Product ${line.code} not found.` };
        const sizeRow = product.sizes.find((s) => s.size === line.size);
        if (!sizeRow || sizeRow.stock < line.qty) {
          return {
            ok: false,
            message: `Only ${sizeRow?.stock ?? 0} in stock for ${line.code} size ${line.size}.`,
          };
        }
        items.push({
          code: line.code,
          name: product.displayName,
          size: line.size,
          qty: line.qty,
          price: product.price,
          imageUrl: product.imageUrl,
        });
      }
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shippingCost = shippingCostById(input.shippingMethod);
      const method = SHIPPING_METHODS.find((m) => m.id === input.shippingMethod);
      const order: Order = {
        id: `RSH${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        email: input.email,
        name: input.name,
        address: input.address,
        city: input.city,
        country: input.country,
        shippingMethod: method?.name ?? input.shippingMethod,
        shippingCost,
        items,
        subtotal,
        total: subtotal + shippingCost,
        status: 'reserved',
        notes: input.notes,
      };
      setOrders((prev) => [order, ...prev]);
      setLines([]);
      return { ok: true, order };
    },
    [lines, catalog],
  );

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }, []);

  const isFavorite = useCallback((code: string) => favorites.includes(code), [favorites]);

  const addAddress = useCallback((row: Omit<Address, 'id'>) => {
    setAddresses((prev) => [...prev, { ...row, id: `addr-${Date.now()}` }]);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      theme: themeName === 'dark' ? darkTheme : lightTheme,
      themeName,
      setThemeName: setThemeNameState,
      catalog,
      catalogReady,
      catalogError,
      tab,
      setTab,
      stack,
      current,
      push,
      pop,
      resetToTabs,
      openProduct,
      openSearch,
      lines,
      cartCount,
      cartSubtotal,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      user,
      login,
      continueGuest,
      logout,
      orders,
      placeOrder,
      favorites,
      toggleFavorite,
      isFavorite,
      addresses,
      addAddress,
      removeAddress,
      notify,
      setNotify: setNotifyState,
      toast,
      showToast,
    }),
    [
      themeName,
      catalog,
      catalogReady,
      catalogError,
      tab,
      stack,
      current,
      push,
      pop,
      resetToTabs,
      openProduct,
      openSearch,
      lines,
      cartCount,
      cartSubtotal,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      user,
      login,
      continueGuest,
      logout,
      orders,
      placeOrder,
      favorites,
      toggleFavorite,
      isFavorite,
      addresses,
      addAddress,
      removeAddress,
      notify,
      toast,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function orderStatusGroup(status: OrderStatus): 'delivered' | 'paid' | 'shipped' {
  if (status === 'delivered') return 'delivered';
  if (status === 'shipped' || status === 'preparing') return 'shipped';
  return 'paid';
}

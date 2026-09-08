import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Address, CartLine, Order, User } from './types';
import type { ThemeName } from './theme';

const KEYS = {
  cart: 'rappi.cart',
  user: 'rappi.user',
  orders: 'rappi.orders',
  favorites: 'rappi.favorites',
  addresses: 'rappi.addresses',
  theme: 'rappi.theme',
  notify: 'rappi.notify',
} as const;

async function readJson<T>(key: string, fallback: T, guard?: (value: unknown) => boolean): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (guard && !guard(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private mode / missing native module — keep the in-memory copy.
  }
}

function isCart(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        row &&
        typeof row === 'object' &&
        typeof (row as CartLine).code === 'string' &&
        typeof (row as CartLine).size === 'string' &&
        typeof (row as CartLine).qty === 'number' &&
        Number.isFinite((row as CartLine).qty),
    )
  );
}

function isTheme(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isUser(value: unknown): value is User | null {
  if (value === null) return true;
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as User).email === 'string' &&
    typeof (value as User).name === 'string'
  );
}

function isOrders(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every((o) => o && typeof o === 'object' && typeof (o as Order).id === 'string');
}

function isAddresses(value: unknown): value is Address[] {
  return Array.isArray(value) && value.every((a) => a && typeof a === 'object' && typeof (a as Address).id === 'string');
}

export const storage = {
  loadCart: () => readJson<CartLine[]>(KEYS.cart, [], isCart),
  saveCart: (lines: CartLine[]) => writeJson(KEYS.cart, lines),
  loadUser: () => readJson<User | null>(KEYS.user, null, isUser),
  saveUser: (user: User | null) => writeJson(KEYS.user, user),
  loadOrders: () => readJson<Order[]>(KEYS.orders, [], isOrders),
  saveOrders: (orders: Order[]) => writeJson(KEYS.orders, orders),
  loadFavorites: () => readJson<string[]>(KEYS.favorites, [], isStringArray),
  saveFavorites: (codes: string[]) => writeJson(KEYS.favorites, codes),
  loadAddresses: () => readJson<Address[]>(KEYS.addresses, [], isAddresses),
  saveAddresses: (rows: Address[]) => writeJson(KEYS.addresses, rows),
  loadTheme: () => readJson<ThemeName>(KEYS.theme, 'dark', isTheme),
  saveTheme: (theme: ThemeName) => writeJson(KEYS.theme, theme),
  loadNotify: () => readJson<boolean>(KEYS.notify, true, (v) => typeof v === 'boolean'),
  saveNotify: (on: boolean) => writeJson(KEYS.notify, on),
};

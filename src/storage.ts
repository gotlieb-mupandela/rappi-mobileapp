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

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  loadCart: () => readJson<CartLine[]>(KEYS.cart, []),
  saveCart: (lines: CartLine[]) => writeJson(KEYS.cart, lines),
  loadUser: () => readJson<User | null>(KEYS.user, null),
  saveUser: (user: User | null) => writeJson(KEYS.user, user),
  loadOrders: () => readJson<Order[]>(KEYS.orders, []),
  saveOrders: (orders: Order[]) => writeJson(KEYS.orders, orders),
  loadFavorites: () => readJson<string[]>(KEYS.favorites, []),
  saveFavorites: (codes: string[]) => writeJson(KEYS.favorites, codes),
  loadAddresses: () => readJson<Address[]>(KEYS.addresses, []),
  saveAddresses: (rows: Address[]) => writeJson(KEYS.addresses, rows),
  loadTheme: () => readJson<ThemeName>(KEYS.theme, 'light'),
  saveTheme: (theme: ThemeName) => writeJson(KEYS.theme, theme),
  loadNotify: () => readJson<boolean>(KEYS.notify, true),
  saveNotify: (on: boolean) => writeJson(KEYS.notify, on),
};

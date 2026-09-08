export type ThemeName = 'light' | 'dark';

export type Theme = {
  name: ThemeName;
  bg: string;
  elevated: string;
  surface: string;
  surface2: string;
  text: string;
  textSecondary: string;
  muted: string;
  muted2: string;
  accent: string;
  accentBright: string;
  accentDim: string;
  accentMuted: string;
  onAccent: string;
  border: string;
  borderStrong: string;
  danger: string;
  warn: string;
  ok: string;
  shadow: string;
  chrome: string;
  headerBg: string;
  tabBar: string;
  searchBtn: string;
  heroOverlay: string;
};

export const lightTheme: Theme = {
  name: 'light',
  bg: '#F3F5EF',
  elevated: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#E8EBE3',
  text: '#121512',
  textSecondary: '#1C211C',
  muted: '#5C6458',
  muted2: '#7A8274',
  accent: '#1DB954',
  accentBright: '#22C55E',
  accentDim: '#15803D',
  accentMuted: 'rgba(29, 185, 84, 0.12)',
  onAccent: '#061006',
  border: 'rgba(18, 21, 18, 0.08)',
  borderStrong: 'rgba(18, 21, 18, 0.16)',
  danger: '#D1243A',
  warn: '#C4840C',
  ok: '#2F8F1C',
  shadow: 'rgba(16, 24, 12, 0.10)',
  chrome: '#FFFFFF',
  headerBg: '#F3F5EF',
  tabBar: '#FFFFFF',
  searchBtn: '#1DB954',
  heroOverlay: 'rgba(5, 5, 5, 0.45)',
};

export const darkTheme: Theme = {
  name: 'dark',
  bg: '#050505',
  elevated: '#0C0C0C',
  surface: '#121212',
  surface2: '#1A1A1A',
  text: '#F5F5F5',
  textSecondary: '#E4E4E4',
  muted: '#9A9A9A',
  muted2: '#6E6E6E',
  accent: '#5EFF38',
  accentBright: '#8DFF6A',
  accentDim: '#3CC922',
  accentMuted: 'rgba(94, 255, 56, 0.12)',
  onAccent: '#071007',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  danger: '#E23B4A',
  warn: '#E8A317',
  ok: '#8FD14F',
  shadow: 'rgba(0, 0, 0, 0.5)',
  chrome: '#080808',
  headerBg: '#080808',
  tabBar: '#0C0C0C',
  searchBtn: '#5EFF38',
  heroOverlay: 'rgba(0, 0, 0, 0.35)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const PHONE_WIDTH = 430;

export const brandAssets = {
  logo: require('../assets/brand/rappi-logo.png'),
  mark: require('../assets/brand/rappi-mark.png'),
  banner: require('../assets/brand/rappi-banner.png'),
  hero: require('../assets/brand/hero-athlete.png'),
};

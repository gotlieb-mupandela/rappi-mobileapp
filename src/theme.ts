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
  mediaBg: string;
};

export const lightTheme: Theme = {
  name: 'light',
  bg: '#F3F5EF',
  elevated: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#E8EBE3',
  text: '#121512',
  textSecondary: '#1C211C',
  muted: '#4F564C',
  muted2: '#6E7668',
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
  mediaBg: '#ECEFE8',
};

export const darkTheme: Theme = {
  name: 'dark',
  bg: '#0B0B0B',
  elevated: '#111111',
  surface: '#161616',
  surface2: '#1C1C1C',
  text: '#F7F7F7',
  textSecondary: '#E8E8E8',
  muted: '#B0B0B0',
  muted2: '#7A7A7A',
  accent: '#B6FF00',
  accentBright: '#D4FF4D',
  accentDim: '#8BCC00',
  accentMuted: 'rgba(182, 255, 0, 0.14)',
  onAccent: '#0B0B0B',
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  danger: '#FF4D5E',
  warn: '#F0B429',
  ok: '#B6FF00',
  shadow: 'rgba(0, 0, 0, 0.55)',
  chrome: '#0B0B0B',
  headerBg: '#0B0B0B',
  tabBar: '#0B0B0B',
  searchBtn: '#B6FF00',
  heroOverlay: 'rgba(0, 0, 0, 0.42)',
  mediaBg: '#141414',
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

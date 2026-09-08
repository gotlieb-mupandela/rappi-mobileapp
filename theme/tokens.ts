/**
 * RAPPI SPORTS HUB design tokens.
 * Ported from the web storefront (src/styles/tokens.css): neon lime on dark.
 */
export const colors = {
  bg: '#0B0B0B',
  bgElevated: '#121212',
  surface: '#1A1A1A',
  surface2: '#222222',
  surfaceHover: '#2A2A2A',
  accent: '#B6FF00',
  accentBright: '#C8FF00',
  accentDim: '#8FCC00',
  accentMuted: 'rgba(182, 255, 0, 0.14)',
  text: '#FFFFFF',
  textSecondary: '#E8E8E8',
  muted: '#A0A0A0',
  muted2: '#6B6B6B',
  onAccent: '#0B0B0B',
  border: '#2A2A2A',
  borderStrong: '#3A3A3A',
  borderAccent: 'rgba(182, 255, 0, 0.45)',
  danger: '#FF5A5A',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 9999,
} as const;

export const font = {
  black: '900' as const,
  bold: '700' as const,
  semibold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
};

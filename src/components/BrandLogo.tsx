import { Image, Platform, StyleSheet, Text, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { TAGLINE } from '../catalog';
import { brandAssets } from '../theme';
import { useStore } from '../store';

const LOCKUP = { w: 475, h: 385 };
const MARK = { w: 236, h: 236 };

/** Web header: h-[4.25rem] (68px) / sm:h-[4.75rem] (76px), w-auto */
export const LOGO_HEADER_H = 68;
export const LOGO_HEADER_H_SM = 76;
/** Web footer: h-24 (96px), w-auto */
export const LOGO_FOOTER_H = 96;

export type BrandLogoSize = 'header' | 'headerLg' | 'footer' | 'mark';

type Props = {
  variant?: 'lockup' | 'mark';
  /** Height-driven size matching the website lockup. */
  size?: BrandLogoSize;
  /** Explicit height in px; overrides `size`. Width is derived (w-auto). */
  height?: number;
  showTagline?: boolean;
  taglineColor?: string;
  style?: StyleProp<ViewStyle>;
};

function heightForSize(size: BrandLogoSize, variant: 'lockup' | 'mark') {
  if (variant === 'mark' || size === 'mark') return 56;
  if (size === 'footer') return LOGO_FOOTER_H;
  if (size === 'headerLg') return LOGO_HEADER_H_SM;
  return LOGO_HEADER_H;
}

function logoGlow(dark: boolean): ImageStyle {
  // Website `.brand-logo` uses CSS filter: drop-shadow — not mix-blend-mode.
  if (Platform.OS === 'web') {
    const filter = dark
      ? 'drop-shadow(0 0 12px rgba(94, 255, 56, 0.16))'
      : 'drop-shadow(0 8px 18px rgba(16, 24, 12, 0.08))';
    return { filter } as ImageStyle;
  }
  if (dark) {
    return {
      shadowColor: 'rgb(94, 255, 56)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
    };
  }
  return {
    shadowColor: 'rgb(16, 24, 12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  };
}

export function BrandLogo({
  variant = 'lockup',
  size = variant === 'mark' ? 'mark' : 'header',
  height,
  showTagline = false,
  taglineColor,
  style,
}: Props) {
  const { theme } = useStore();
  const dim = variant === 'mark' ? MARK : LOCKUP;
  const h = height ?? heightForSize(size, variant);
  const w = Math.round((h * dim.w) / dim.h);

  return (
    <View style={[styles.wrap, style]} accessibilityRole="image" accessibilityLabel="RAPPI Sports Hub">
      <Image
        source={variant === 'mark' ? brandAssets.mark : brandAssets.logo}
        style={[
          {
            width: w,
            height: h,
            backgroundColor: 'transparent',
          },
          logoGlow(theme.name === 'dark'),
        ]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      {showTagline ? (
        <Text style={[styles.tagline, { color: taglineColor ?? theme.accent }]}>{TAGLINE}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  tagline: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
});

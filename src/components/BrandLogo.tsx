import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { TAGLINE } from '../catalog';
import { brandAssets } from '../theme';

const LOCKUP = { w: 475, h: 385 };
const MARK = { w: 236, h: 236 };

type Props = {
  variant?: 'lockup' | 'mark';
  width?: number;
  showTagline?: boolean;
  taglineColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function BrandLogo({
  variant = 'lockup',
  width,
  showTagline = false,
  taglineColor,
  style,
}: Props) {
  const dim = variant === 'mark' ? MARK : LOCKUP;
  const w = width ?? (variant === 'mark' ? 72 : 228);
  const h = Math.round((w * dim.h) / dim.w);

  return (
    <View style={[styles.wrap, style]} accessibilityRole="image" accessibilityLabel="RAPPI Sports Hub">
      <Image
        source={variant === 'mark' ? brandAssets.mark : brandAssets.logo}
        style={{ width: w, height: h, backgroundColor: 'transparent' }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      {showTagline ? (
        <Text style={[styles.tagline, taglineColor ? { color: taglineColor } : null]}>{TAGLINE}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tagline: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
});

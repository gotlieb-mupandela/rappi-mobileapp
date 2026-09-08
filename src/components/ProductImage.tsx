import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';
import { radius } from '../theme';

type Props = {
  uri?: string;
  local?: number;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  radius?: number;
  resizeMode?: 'cover' | 'contain';
};

export function ProductImage({
  uri,
  local,
  width = '100%',
  height = '100%',
  radius: r = radius.md,
  resizeMode = 'contain',
}: Props) {
  const style: StyleProp<ImageStyle> = {
    width,
    height,
    borderRadius: r,
    backgroundColor: '#ECEFE8',
  };
  if (local) {
    return <Image source={local} style={style} resizeMode={resizeMode} />;
  }
  if (!uri) {
    return <View style={style} />;
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      accessibilityIgnoresInvertColors
    />
  );
}

export const imageStyles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
});

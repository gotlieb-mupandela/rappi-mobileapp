import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { radius } from '../theme';
import { useStore } from '../store';

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
  const { theme } = useStore();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri, local]);

  const style: StyleProp<ImageStyle> = {
    width,
    height,
    borderRadius: r,
    backgroundColor: theme.mediaBg,
  };

  if (local) {
    return <Image source={local} style={style} resizeMode={resizeMode} />;
  }

  if (!uri || failed) {
    return (
      <View style={[style, styles.fallback]}>
        <Text style={[styles.mark, { color: theme.accent }]}>R</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      accessibilityIgnoresInvertColors
      onError={() => setFailed(true)}
    />
  );
}

export const imageStyles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
});

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
  mark: { fontSize: 22, fontWeight: '900', opacity: 0.45 },
});

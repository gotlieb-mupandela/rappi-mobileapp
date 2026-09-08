import React from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../lib/types';
import { categoryLabel, isAvailable } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { colors, font, radius, spacing } from '../theme/tokens';
import { Badge } from './ui';

export function ProductCard({ product, style }: { product: Product; style?: object }) {
  const router = useRouter();
  const available = isAvailable(product);
  return (
    <Pressable
      testID={`product-${product.code}`}
      onPress={() => router.push(`/product/${encodeURIComponent(product.code)}`)}
      style={[styles.card, style]}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.thumb}
          contentFit="cover"
          transition={150}
          recyclingKey={product.code}
        />
        {product.badge === 'new' && (
          <View style={styles.badgeAbs}>
            <Badge label="New" />
          </View>
        )}
        {product.badge === 'offer' && (
          <View style={styles.badgeAbs}>
            <Badge label="Offer" tone="danger" />
          </View>
        )}
        {!available && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.cat}>{categoryLabel(product.category)}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.displayName}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  thumbWrap: { aspectRatio: 1, backgroundColor: '#FFFFFF' },
  thumb: { width: '100%', height: '100%' },
  badgeAbs: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  soldOut: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,11,11,0.55)',
  },
  soldOutText: { color: colors.text, fontWeight: font.black, letterSpacing: 1 },
  body: { padding: spacing.md, gap: 3 },
  cat: {
    color: colors.accentDim,
    fontSize: 10,
    fontWeight: font.black,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  name: { color: colors.text, fontSize: 13, fontWeight: font.semibold, minHeight: 34 },
  price: { color: colors.text, fontSize: 15, fontWeight: font.black, marginTop: 2 },
});

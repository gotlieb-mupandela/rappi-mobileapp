import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../format';
import { colorCountLabel, isSoldOut, stockLabel } from '../sizes';
import { useStore } from '../store';
import type { Product } from '../types';
import { radius } from '../theme';
import { ProductImage } from './ProductImage';

export function ProductCard({
  product,
  onPress,
  width,
}: {
  product: Product;
  onPress: () => void;
  width?: number | `${number}%`;
}) {
  const { theme, isFavorite, toggleFavorite } = useStore();
  const sold = isSoldOut(product);
  const fav = isFavorite(product.code);

  return (
    <Pressable
      onPress={onPress}
      testID={`product-${product.code}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
          width: width ?? '48%',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={product.displayName}
    >
      <View style={[styles.media, { backgroundColor: theme.surface2 }]}>
        <ProductImage uri={product.imageUrl} height={160} resizeMode="contain" />
        {sold ? (
          <View style={[styles.badge, { backgroundColor: theme.danger }]}>
            <Text style={styles.badgeText}>Sold out</Text>
          </View>
        ) : product.badge ? (
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={[styles.badgeText, { color: theme.onAccent }]}>
              {product.badge === 'new' ? 'New' : 'Offer'}
            </Text>
          </View>
        ) : null}
        <Pressable
          onPress={() => toggleFavorite(product.code)}
          hitSlop={8}
          style={[styles.heart, { backgroundColor: theme.surface }]}
          testID={`fav-${product.code}`}
          accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Text style={{ color: fav ? theme.danger : theme.muted, fontSize: 16 }}>{fav ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {product.displayName}
      </Text>
      <Text style={[styles.meta, { color: theme.muted }]} numberOfLines={1}>
        {colorCountLabel(product)} · {stockLabel(product)}
      </Text>
      <Text style={[styles.price, { color: theme.text }]}>{formatPrice(product.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  media: {
    borderRadius: radius.md,
    overflow: 'hidden',
    height: 160,
    marginBottom: 10,
  },
  badge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  heart: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 13, fontWeight: '700', lineHeight: 17 },
  meta: { fontSize: 12, marginTop: 4 },
  price: { fontSize: 15, fontWeight: '800', marginTop: 6 },
});

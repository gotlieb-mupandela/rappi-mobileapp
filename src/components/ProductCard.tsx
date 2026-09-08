import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../format';
import { hapticTap } from '../haptics';
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
      onPress={() => {
        hapticTap();
        onPress();
      }}
      testID={`product-${product.code}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
          borderColor: theme.border,
          width: width ?? '48%',
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${product.displayName}, ${formatPrice(product.price)}${sold ? ', sold out' : ''}`}
    >
      <View style={[styles.media, { backgroundColor: theme.mediaBg }]}>
        <View style={{ opacity: sold ? 0.5 : 1 }}>
          <ProductImage uri={product.imageUrl} height={160} resizeMode="contain" />
        </View>
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
          onPress={() => {
            hapticTap();
            toggleFavorite(product.code);
          }}
          hitSlop={10}
          style={[styles.heart, { backgroundColor: theme.surface, borderColor: theme.border }]}
          testID={`fav-${product.code}`}
          accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={fav ? theme.danger : theme.muted} />
        </Pressable>
      </View>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {product.displayName}
      </Text>
      <Text style={[styles.code, { color: theme.muted2 }]} numberOfLines={1}>
        {product.code}
      </Text>
      <Text style={[styles.meta, { color: sold ? theme.danger : theme.muted }]} numberOfLines={1}>
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
    borderWidth: StyleSheet.hairlineWidth,
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
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  heart: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  name: { fontSize: 13, fontWeight: '700', lineHeight: 17 },
  code: { fontSize: 11, marginTop: 4, letterSpacing: 0.3, fontVariant: ['tabular-nums'] },
  meta: { fontSize: 12, marginTop: 4 },
  price: { fontSize: 16, fontWeight: '800', marginTop: 6, fontVariant: ['tabular-nums'], letterSpacing: -0.3 },
});

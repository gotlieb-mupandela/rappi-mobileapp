import React, { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCatalog } from '../../context/CatalogProvider';
import { useCart } from '../../context/CartProvider';
import { categoryLabel, isAvailable, packNote } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import type { SizeStock } from '../../lib/types';
import { colors, font, radius, spacing } from '../../theme/tokens';
import { TopBar } from '../../components/TopBar';
import { Badge, Button } from '../../components/ui';

export default function ProductScreen() {
  const { code: rawCode } = useLocalSearchParams<{ code: string }>();
  const code = decodeURIComponent(String(rawCode ?? ''));
  const router = useRouter();
  const { getProduct, loading } = useCatalog();
  const { add, count } = useCart();

  const product = getProduct(code);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
    return [...new Set(imgs)];
  }, [product]);

  if (loading && !product) {
    return (
      <View style={styles.screen}>
        <TopBar title="Product" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.screen}>
        <TopBar title="Product" />
        <View style={styles.center}>
          <Text style={styles.muted}>Product {code} not found.</Text>
        </View>
      </View>
    );
  }

  const pack = packNote(product);
  const available = isAvailable(product);
  const selectedStock = size ? product.sizes.find((s) => s.size === size)?.stock ?? 0 : 0;

  const onAdd = () => {
    if (!size) return;
    add(product.code, size, 1);
    setAdded(true);
  };

  const sizeRows: SizeStock[] = product.sizes.length
    ? product.sizes
    : product.sizeOptions.map((s) => ({ size: s, stock: product.stockQty }));

  return (
    <View style={styles.screen}>
      <TopBar
        title={categoryLabel(product.category)}
        right={
          <Pressable onPress={() => router.push('/cart')} testID="pdp-cart">
            <Ionicons name="cart-outline" size={22} color={count > 0 ? colors.accent : colors.text} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={styles.mainImgWrap}>
          <Image
            source={{ uri: gallery[activeImg] ?? product.imageUrl }}
            style={styles.mainImg}
            contentFit="contain"
            transition={150}
          />
          {product.badge === 'new' && <View style={styles.badgeAbs}><Badge label="New" /></View>}
        </View>

        {gallery.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbs}
          >
            {gallery.map((uri, i) => (
              <Pressable
                key={uri + i}
                onPress={() => setActiveImg(i)}
                style={[styles.thumb, i === activeImg && styles.thumbActive]}
                testID={`thumb-${i}`}
              >
                <Image source={{ uri }} style={styles.thumbImg} contentFit="cover" />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.body}>
          <Text style={styles.cat}>{categoryLabel(product.category)}</Text>
          <Text style={styles.name}>{product.displayName}</Text>
          <Text style={styles.code}>Code {product.code}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          {pack && (
            <View style={styles.packNote}>
              <Ionicons name="cube-outline" size={16} color={colors.accent} />
              <Text style={styles.packText}>{pack}</Text>
            </View>
          )}

          <View style={styles.stockRow}>
            <View style={[styles.dot, { backgroundColor: available ? colors.accent : colors.danger }]} />
            <Text style={styles.stockText}>
              {available ? `In stock · ${product.stockQty} units` : 'Sold out'}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Select size</Text>
          <View style={styles.sizeWrap}>
            {sizeRows.map((s) => {
              const soldOut = s.stock <= 0;
              const low = s.stock > 0 && s.stock < 5;
              const active = size === s.size;
              return (
                <Pressable
                  key={s.size}
                  disabled={soldOut}
                  onPress={() => setSize(s.size)}
                  style={[styles.size, active && styles.sizeActive, soldOut && styles.sizeSoldOut]}
                  testID={`size-${s.size}`}
                >
                  <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{s.size}</Text>
                  {low && <Text style={styles.low}>Low</Text>}
                  {soldOut && <Text style={styles.low}>0</Text>}
                </Pressable>
              );
            })}
          </View>
          {size && selectedStock < 5 && selectedStock > 0 && (
            <Text style={styles.lowNote}>Only {selectedStock} left in size {size}.</Text>
          )}

          {!!product.description && (
            <>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.barPriceLabel}>Price</Text>
          <Text style={styles.barPrice}>{formatPrice(product.price)}</Text>
        </View>
        {added ? (
          <Button label="View cart" variant="outline" style={{ flex: 1, marginLeft: spacing.lg }} onPress={() => router.push('/cart')} testID="pdp-view-cart" />
        ) : (
          <Button
            label={!available ? 'Sold out' : size ? 'Add to cart' : 'Select a size'}
            disabled={!available || !size}
            style={{ flex: 1, marginLeft: spacing.lg }}
            onPress={onAdd}
            testID="pdp-add"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.muted, fontSize: 15 },
  mainImgWrap: { backgroundColor: '#FFFFFF', aspectRatio: 1, width: '100%' },
  mainImg: { width: '100%', height: '100%' },
  badgeAbs: { position: 'absolute', top: spacing.md, left: spacing.md },
  thumbs: { gap: spacing.sm, padding: spacing.md },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  thumbActive: { borderColor: colors.accent },
  thumbImg: { width: '100%', height: '100%' },
  body: { padding: spacing.lg, gap: 6 },
  cat: { color: colors.accentDim, fontSize: 11, fontWeight: font.black, letterSpacing: 1.5, textTransform: 'uppercase' },
  name: { color: colors.text, fontSize: 22, fontWeight: font.black, marginTop: 2 },
  code: { color: colors.muted2, fontSize: 12, fontWeight: font.semibold },
  price: { color: colors.text, fontSize: 26, fontWeight: font.black, marginTop: spacing.sm },
  packNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  packText: { color: colors.accent, fontSize: 12, fontWeight: font.semibold, flex: 1 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { color: colors.textSecondary, fontSize: 13, fontWeight: font.semibold },
  sectionLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sizeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  size: {
    minWidth: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  sizeActive: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  sizeSoldOut: { opacity: 0.35 },
  sizeText: { color: colors.text, fontWeight: font.bold, fontSize: 14 },
  sizeTextActive: { color: colors.accent },
  low: { color: colors.danger, fontSize: 9, fontWeight: font.black, marginTop: 2 },
  lowNote: { color: colors.danger, fontSize: 12, marginTop: spacing.sm, fontWeight: font.semibold },
  desc: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  barPriceLabel: { color: colors.muted, fontSize: 10, fontWeight: font.bold, textTransform: 'uppercase' },
  barPrice: { color: colors.text, fontSize: 20, fontWeight: font.black },
});

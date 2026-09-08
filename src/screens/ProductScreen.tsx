import { useEffect, useMemo, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryBySlug, subcategoryLabel } from '../catalog';
import { formatPrice } from '../format';
import { getAssortment } from '../assortment';
import { hapticSuccess, hapticTap } from '../haptics';
import { getProduct } from '../products';
import {
  buyableSizes,
  hasVisibleSizePicker,
  isLowStock,
  isSoldOut,
  pickerSizes,
  sizeDisplayLabel,
  stockLabel,
} from '../sizes';
import { ProductImage } from '../components/ProductImage';
import { QtyStepper } from '../components/QtyStepper';
import { ScreenHeader } from '../components/ScreenHeader';
import { StickyCta } from '../components/StickyCta';
import { useStore } from '../store';
import { PHONE_WIDTH, radius } from '../theme';

export function ProductScreen({ code }: { code: string }) {
  const { theme, catalog, addToCart, showToast, isFavorite, toggleFavorite, push } = useStore();
  const product = getProduct(catalog, code);
  const { width } = useWindowDimensions();
  const galleryWidth = Math.min(width, PHONE_WIDTH);

  const buyable = product ? buyableSizes(product) : [];
  const visible = product ? pickerSizes(product) : [];
  const [size, setSize] = useState(buyable[0]?.size ?? product?.sizes[0]?.size ?? 'SKU');
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!product) return;
    const next = buyableSizes(product)[0]?.size ?? product.sizes[0]?.size ?? 'SKU';
    setSize(next);
    setQty(1);
    setSlide(0);
  }, [code]);

  const selected = product?.sizes.find((s) => s.size === size);
  const stock = selected?.stock ?? 0;
  const sold = product ? isSoldOut(product) : true;
  const assortment = product ? getAssortment(product) : null;
  const images = useMemo(() => (product?.images?.length ? product.images : product ? [product.imageUrl] : []), [product]);

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScreenHeader title="Product" />
        <Text style={{ padding: 24, color: theme.muted }}>This SKU is not in the live catalog.</Text>
      </View>
    );
  }

  const cat = categoryBySlug(product.category);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const w = e.nativeEvent.layoutMeasurement.width;
    if (!w) return;
    setSlide(Math.round(e.nativeEvent.contentOffset.x / w));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader
        title="Details"
        right={
          <Pressable
            onPress={() => {
              hapticTap();
              toggleFavorite(product.code);
            }}
            hitSlop={10}
            accessibilityLabel="Favorite"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Ionicons name={isFavorite(product.code) ? 'heart' : 'heart-outline'} size={22} color={theme.danger} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 132 }} keyboardShouldPersistTaps="handled">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          testID="pdp-gallery"
        >
          {images.map((uri, i) => (
            <View key={`${uri}-${i}`} style={{ width: galleryWidth, height: 360, backgroundColor: theme.mediaBg }}>
              <ProductImage uri={uri} height={360} radius={0} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === slide ? theme.accent : theme.borderStrong }]}
            />
          ))}
        </View>

        <View style={{ padding: 16 }}>
          <Text style={[styles.kicker, { color: theme.accent }]}>
            {cat?.name} / {subcategoryLabel(product.subcategory)}
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>{product.displayName}</Text>
          <Text style={[styles.code, { color: theme.muted2 }]}>{product.code}</Text>
          <Text style={[styles.price, { color: theme.text }]}>{formatPrice(product.price)}</Text>
          {assortment ? (
            <Text style={{ color: theme.muted, marginTop: 6, fontSize: 13 }}>
              {assortment.label}
              {assortment.pairHint ? ` · ${assortment.pairHint}` : ''}
            </Text>
          ) : null}
          <Text style={{ color: sold ? theme.danger : theme.muted, marginTop: 6, fontWeight: '700' }}>
            {stockLabel(product)}
          </Text>

          {hasVisibleSizePicker(product) ? (
            <View style={{ marginTop: 18 }}>
              <Text style={[styles.label, { color: theme.muted }]}>Size</Text>
              <View style={styles.sizes}>
                {visible.map((row) => {
                  const active = row.size === size;
                  return (
                    <Pressable
                      key={row.size}
                      disabled={row.stock === 0}
                      onPress={() => {
                        hapticTap();
                        setSize(row.size);
                        setQty(1);
                      }}
                      style={({ pressed }) => [
                        styles.size,
                        {
                          borderColor: active ? theme.accent : theme.borderStrong,
                          backgroundColor: active ? theme.accent : theme.surface,
                          opacity: row.stock === 0 ? 0.35 : pressed ? 0.8 : 1,
                        },
                      ]}
                      testID={`size-${row.size}`}
                    >
                      <Text style={{ color: active ? theme.onAccent : theme.text, fontWeight: '700', fontSize: 12 }}>
                        {sizeDisplayLabel(row.size)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {selected ? (
                <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>
                  {stock === 0
                    ? 'Sold out in this size'
                    : isLowStock(stock)
                      ? `Limited — ${stock} left`
                      : `${stock} in this size`}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={{ color: theme.muted, marginTop: 12 }}>{sizeDisplayLabel(size)}</Text>
          )}

          <View style={{ marginTop: 18 }}>
            <Text style={[styles.label, { color: theme.muted }]}>Qty</Text>
            <QtyStepper value={qty} min={1} max={Math.max(1, stock)} onChange={setQty} />
          </View>

          <Text style={[styles.desc, { color: theme.textSecondary }]}>{product.description}</Text>

          <Pressable
            onPress={() => {
              hapticTap();
              push({ key: 'categoryHub', slug: product.category });
            }}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text style={{ color: theme.accent, fontWeight: '700', marginTop: 8 }}>
              More in {cat?.name} ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <StickyCta>
        <Pressable
          disabled={sold || stock <= 0}
          onPress={() => {
            const result = addToCart(product.code, size, qty);
            if (result.ok) hapticSuccess();
            else hapticTap();
            showToast(result.ok ? 'ok' : 'err', result.message);
          }}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: sold || stock <= 0 ? theme.muted2 : theme.accent,
              opacity: sold ? 0.6 : pressed ? 0.88 : 1,
            },
          ]}
          testID="add-to-cart"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900', fontSize: 16 }}>
            {sold ? 'Sold out' : `Add to cart · ${formatPrice(product.price * qty)}`}
          </Text>
        </Pressable>
      </StickyCta>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: '900', marginTop: 8, lineHeight: 28 },
  code: { marginTop: 6, fontSize: 12, letterSpacing: 1.2, fontVariant: ['tabular-nums'] },
  price: { fontSize: 24, fontWeight: '800', marginTop: 12, fontVariant: ['tabular-nums'], letterSpacing: -0.4 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  size: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: { marginTop: 20, fontSize: 14, lineHeight: 22 },
  cta: { borderRadius: radius.lg, paddingVertical: 15, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
});

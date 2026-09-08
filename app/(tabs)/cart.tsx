import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCatalog } from '../../context/CatalogProvider';
import { useCart } from '../../context/CartProvider';
import { formatPrice } from '../../lib/format';
import { colors, font, radius, spacing } from '../../theme/tokens';
import { QtyStepper } from '../../components/QtyStepper';
import { Button } from '../../components/ui';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getProduct } = useCatalog();
  const { lines, setQty, remove, count } = useCart();

  const rows = useMemo(
    () => lines.map((l) => ({ line: l, product: getProduct(l.code) })).filter((r) => r.product),
    [lines, getProduct],
  );
  const subtotal = useMemo(
    () => rows.reduce((s, r) => s + (r.product!.price * r.line.qty), 0),
    [rows],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.h1}>Your Cart</Text>

      {rows.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={56} color={colors.muted2} />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Button label="Start shopping" style={{ marginTop: spacing.lg, paddingHorizontal: spacing.xxl }} onPress={() => router.push('/')} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
            {rows.map(({ line, product }) => (
              <View key={`${line.code}-${line.size}`} style={styles.row} testID={`cart-${line.code}-${line.size}`}>
                <Image source={{ uri: product!.imageUrl }} style={styles.img} contentFit="cover" />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>{product!.displayName}</Text>
                  <Text style={styles.meta}>Size {line.size} · {product!.code}</Text>
                  <Text style={styles.price}>{formatPrice(product!.price)}</Text>
                  <View style={styles.rowBottom}>
                    <QtyStepper
                      qty={line.qty}
                      onDec={() => setQty(line.code, line.size, line.qty - 1)}
                      onInc={() => setQty(line.code, line.size, line.qty + 1)}
                    />
                    <Pressable onPress={() => remove(line.code, line.size)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={20} color={colors.muted} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({count} item{count === 1 ? '' : 's'})</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <Text style={styles.shipHint}>Shipping calculated at checkout</Text>
            <Button label="Checkout" onPress={() => router.push('/checkout')} testID="cart-checkout" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  h1: { color: colors.text, fontSize: 26, fontWeight: font.black, textTransform: 'uppercase', marginBottom: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingBottom: 80 },
  emptyText: { color: colors.muted, fontSize: 15 },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  img: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: '#fff' },
  info: { flex: 1, gap: 3 },
  name: { color: colors.text, fontSize: 14, fontWeight: font.bold },
  meta: { color: colors.muted, fontSize: 12 },
  price: { color: colors.text, fontSize: 15, fontWeight: font.black },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: font.semibold },
  summaryValue: { color: colors.text, fontSize: 20, fontWeight: font.black },
  shipHint: { color: colors.muted2, fontSize: 12, marginBottom: spacing.sm },
});

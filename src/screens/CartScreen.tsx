import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../format';
import { getProduct } from '../products';
import { sizeDisplayLabel } from '../sizes';
import { EmptyState, EmptyWrap } from '../components/EmptyState';
import { ProductImage } from '../components/ProductImage';
import { QtyStepper } from '../components/QtyStepper';
import { StickyCta } from '../components/StickyCta';
import { hapticTap } from '../haptics';
import { useStore } from '../store';
import { radius } from '../theme';
import { SHIPPING_METHODS } from '../catalog';

export function CartScreen() {
  const { theme, catalog, lines, cartSubtotal, setQty, removeLine, push, setTab } = useStore();

  if (!lines.length) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <EmptyWrap>
          <EmptyState
            icon="bag-handle-outline"
            title="Cart is empty"
            body="Delivery is Standard N$100, Express N$150, or free hub pickup."
            actionLabel="Shop now"
            onAction={() => setTab('shop')}
            actionTestID="cart-shop"
          />
        </EmptyWrap>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Text style={[styles.title, { color: theme.text }]}>Cart ({lines.length})</Text>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 168 }}
        keyboardShouldPersistTaps="handled"
      >
        {lines.map((line) => {
          const product = getProduct(catalog, line.code);
          if (!product) return null;
          const max = product.sizes.find((s) => s.size === line.size)?.stock ?? line.qty;
          return (
            <View key={`${line.code}-${line.size}`} style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Pressable
                onPress={() => {
                  hapticTap();
                  push({ key: 'product', code: line.code });
                }}
                style={styles.thumb}
              >
                <ProductImage uri={product.imageUrl} height={88} />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '700' }} numberOfLines={2}>
                  {product.displayName}
                </Text>
                <Text style={{ color: theme.muted, marginTop: 4, fontSize: 12 }}>
                  {sizeDisplayLabel(line.size)} · {formatPrice(product.price)}
                </Text>
                <Text style={{ color: theme.text, fontWeight: '800', marginTop: 4, fontVariant: ['tabular-nums'] }}>
                  {formatPrice(product.price * line.qty)}
                </Text>
                <View style={styles.lineActions}>
                  <QtyStepper value={line.qty} min={0} max={max} onChange={(n) => setQty(line.code, line.size, n)} />
                  <Pressable
                    onPress={() => {
                      hapticTap();
                      removeLine(line.code, line.size);
                    }}
                    hitSlop={10}
                    style={({ pressed }) => [{ minHeight: 44, justifyContent: 'center', opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text style={{ color: theme.danger, fontWeight: '700' }}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 4 }}>Shipping</Text>
          <Text style={{ color: theme.muted, fontSize: 12, marginBottom: 8 }}>
            Choose a method at checkout. Hub pickup is free.
          </Text>
          {SHIPPING_METHODS.map((m) => (
            <View key={m.id} style={styles.shipRow}>
              <Text style={{ color: theme.text }}>{m.name}</Text>
              <Text style={{ color: theme.text, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
                {m.cost ? formatPrice(m.cost) : 'Free'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <StickyCta>
        <View style={styles.shipRow}>
          <Text style={{ color: theme.muted }}>Subtotal</Text>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18, fontVariant: ['tabular-nums'] }}>
            {formatPrice(cartSubtotal)}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            hapticTap();
            push({ key: 'checkout' });
          }}
          style={({ pressed }) => [styles.cta, { backgroundColor: theme.accent, opacity: pressed ? 0.88 : 1 }]}
          testID="go-checkout"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900', fontSize: 16 }}>Checkout</Text>
        </Pressable>
      </StickyCta>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: { width: 88, height: 88, borderRadius: radius.md, overflow: 'hidden' },
  lineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  card: { borderRadius: radius.lg, padding: 14, marginTop: 8, borderWidth: StyleSheet.hairlineWidth },
  shipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, minHeight: 36, alignItems: 'center' },
  cta: { borderRadius: radius.lg, paddingVertical: 15, marginTop: 12, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
});

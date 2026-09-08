import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../format';
import { getProduct } from '../products';
import { sizeDisplayLabel } from '../sizes';
import { ProductImage } from '../components/ProductImage';
import { QtyStepper } from '../components/QtyStepper';
import { useStore } from '../store';
import { radius } from '../theme';
import { SHIPPING_METHODS } from '../catalog';

export function CartScreen() {
  const { theme, catalog, lines, cartSubtotal, setQty, removeLine, push, setTab } = useStore();

  if (!lines.length) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.bg }]}>
        <Text style={[styles.title, { color: theme.text }]}>Cart</Text>
        <Text style={{ color: theme.muted, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
          Your bag is empty. Delivery is Standard N$100, Express N$150, or free hub pickup.
        </Text>
        <Pressable
          onPress={() => setTab('shop')}
          style={[styles.cta, { backgroundColor: theme.accent }]}
          testID="cart-shop"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '800' }}>Shop now</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Text style={[styles.title, { color: theme.text, padding: 16 }]}>Cart ({lines.length})</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 160 }}>
        {lines.map((line) => {
          const product = getProduct(catalog, line.code);
          if (!product) return null;
          const max = product.sizes.find((s) => s.size === line.size)?.stock ?? line.qty;
          return (
            <View key={`${line.code}-${line.size}`} style={[styles.row, { backgroundColor: theme.surface }]}>
              <Pressable onPress={() => push({ key: 'product', code: line.code })} style={styles.thumb}>
                <ProductImage uri={product.imageUrl} height={88} />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '700' }} numberOfLines={2}>
                  {product.displayName}
                </Text>
                <Text style={{ color: theme.muted, marginTop: 4, fontSize: 12 }}>
                  {sizeDisplayLabel(line.size)} · {formatPrice(product.price)}
                </Text>
                <View style={styles.lineActions}>
                  <QtyStepper value={line.qty} min={0} max={max} onChange={(n) => setQty(line.code, line.size, n)} />
                  <Pressable onPress={() => removeLine(line.code, line.size)}>
                    <Text style={{ color: theme.danger, fontWeight: '700' }}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 8 }}>Shipping</Text>
          {SHIPPING_METHODS.map((m) => (
            <View key={m.id} style={styles.shipRow}>
              <Text style={{ color: theme.text }}>{m.name}</Text>
              <Text style={{ color: theme.text, fontWeight: '700' }}>
                {m.cost ? formatPrice(m.cost) : 'Free'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: theme.chrome, borderTopColor: theme.border }]}>
        <View style={styles.shipRow}>
          <Text style={{ color: theme.muted }}>Subtotal</Text>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{formatPrice(cartSubtotal)}</Text>
        </View>
        <Pressable
          onPress={() => push({ key: 'checkout' })}
          style={[styles.cta, { backgroundColor: theme.accent, marginTop: 12 }]}
          testID="go-checkout"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900', fontSize: 16 }}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 12, borderRadius: radius.lg, padding: 10, marginBottom: 12 },
  thumb: { width: 88, height: 88, borderRadius: radius.md, overflow: 'hidden' },
  lineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  card: { borderRadius: radius.lg, padding: 14, marginTop: 8 },
  shipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  cta: { borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
});

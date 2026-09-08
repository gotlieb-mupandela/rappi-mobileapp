import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersProvider';
import { formatPrice } from '../lib/format';
import { colors, font, radius, spacing } from '../theme/tokens';
import { Button } from '../components/ui';

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const order = useMemo(() => orders.find((o) => o.id === id), [orders, id]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.xxl, paddingBottom: 120 }}
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={40} color={colors.onAccent} />
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.sub}>Your gear is reserved at the hub.</Text>
        {id && <Text style={styles.orderId}>Order {id}</Text>}
      </View>

      {order && (
        <View style={styles.card}>
          {order.items.map((it) => (
            <View key={`${it.code}-${it.size}`} style={styles.line}>
              <Text style={styles.lineName} numberOfLines={1}>{it.name}</Text>
              <Text style={styles.lineMeta}>
                {it.qty} × {formatPrice(it.price)} · {it.size}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label={order.shippingMethod} value={order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)} />
          <Row label="Total" value={formatPrice(order.total)} strong />
          <Text style={styles.ship}>Shipping to {order.name}, {order.city}, {order.country}</Text>
        </View>
      )}

      <Button label="Continue shopping" style={{ marginTop: spacing.xl }} onPress={() => router.replace('/')} testID="confirm-continue" />
      <Button label="View my orders" variant="ghost" style={{ marginTop: spacing.sm }} onPress={() => router.replace('/me')} />
    </ScrollView>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  check: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { color: colors.text, fontSize: 26, fontWeight: font.black },
  sub: { color: colors.muted, fontSize: 14 },
  orderId: { color: colors.accent, fontSize: 14, fontWeight: font.black, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  line: { marginBottom: spacing.xs },
  lineName: { color: colors.text, fontSize: 14, fontWeight: font.bold },
  lineMeta: { color: colors.muted, fontSize: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.muted, fontSize: 14 },
  rowValue: { color: colors.textSecondary, fontSize: 14, fontWeight: font.semibold },
  strong: { color: colors.text, fontSize: 17, fontWeight: font.black },
  ship: { color: colors.muted2, fontSize: 12, marginTop: spacing.sm },
});

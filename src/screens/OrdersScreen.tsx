import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatDate, formatPrice } from '../format';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { useStore } from '../store';
import { radius } from '../theme';

export function OrdersScreen({ focusId }: { focusId?: string }) {
  const { theme, orders, push } = useStore();
  const list = focusId ? orders.filter((o) => o.id === focusId) : orders;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={focusId ? 'Order' : 'Orders'} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {!list.length ? (
          <EmptyState icon="receipt-outline" title="No orders yet" body="Guest checkout is enabled — add a piece and check out." />
        ) : (
          list.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => push({ key: 'order', orderId: o.id })}
              style={[styles.card, { backgroundColor: theme.surface }]}
              testID={`order-${o.id}`}
            >
              <View style={styles.split}>
                <Text style={{ color: theme.text, fontWeight: '800' }}>{o.id}</Text>
                <Text style={{ color: theme.accent, fontWeight: '700', textTransform: 'capitalize' }}>{o.status}</Text>
              </View>
              <Text style={{ color: theme.muted, marginTop: 4 }}>{formatDate(o.createdAt)}</Text>
              <Text style={{ color: theme.text, marginTop: 8 }}>
                {o.items.length} item{o.items.length === 1 ? '' : 's'} · {formatPrice(o.total)}
              </Text>
              <Text style={{ color: theme.muted, marginTop: 4 }}>
                {o.shippingMethod} · {o.city}, {o.country}
              </Text>
              {focusId
                ? o.items.map((i) => (
                    <View key={`${i.code}-${i.size}`} style={[styles.split, { marginTop: 8 }]}>
                      <Text style={{ color: theme.text, flex: 1 }} numberOfLines={1}>
                        {i.name} · {i.size} × {i.qty}
                      </Text>
                      <Text style={{ color: theme.text }}>{formatPrice(i.price * i.qty)}</Text>
                    </View>
                  ))
                : null}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 14, marginBottom: 12 },
  split: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
});

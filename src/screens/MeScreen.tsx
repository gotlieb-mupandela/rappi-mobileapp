import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../format';
import { BrandLogo } from '../components/BrandLogo';
import { hapticTap } from '../haptics';
import { orderStatusGroup, useStore } from '../store';
import { radius } from '../theme';

const TILES = [
  { key: 'favorites', label: 'Favorites', icon: 'heart-outline' as const, screen: 'favorites' as const },
  { key: 'addresses', label: 'Addresses', icon: 'location-outline' as const, screen: 'addresses' as const },
  { key: 'pricing', label: 'Pricing', icon: 'cash-outline' as const, screen: 'settings' as const },
  { key: 'stores', label: 'Stores', icon: 'bag-handle-outline' as const, screen: 'settings' as const },
];

export function MeScreen() {
  const { theme, user, orders, push, cartSubtotal } = useStore();
  const delivered = orders.filter((o) => orderStatusGroup(o.status) === 'delivered').length;
  const paid = orders.filter((o) => orderStatusGroup(o.status) === 'paid').length;
  const shipped = orders.filter((o) => orderStatusGroup(o.status) === 'shipped').length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <BrandLogo variant="lockup" width={168} style={{ marginBottom: 18 }} />

      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={[styles.name, { color: theme.text }]}>
            {user?.name ?? 'Guest athlete'}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 4 }}>{user?.email ?? 'Not signed in'}</Text>
        </View>
        <Pressable
          onPress={() => {
            hapticTap();
            push({ key: 'notifications' });
          }}
          style={({ pressed }) => [styles.bell, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.75 : 1 }]}
          testID="me-bell"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={22} color={theme.text} />
        </Pressable>
      </View>

      {!user ? (
        <Pressable
          onPress={() => {
            hapticTap();
            push({ key: 'auth' });
          }}
          style={({ pressed }) => [styles.cta, { backgroundColor: theme.accent, opacity: pressed ? 0.88 : 1 }]}
          testID="me-signin"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900' }}>Sign in</Text>
        </Pressable>
      ) : null}

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHead}>
          <Text style={{ color: theme.text, fontWeight: '800' }}>Orders</Text>
          <Pressable
            onPress={() => {
              hapticTap();
              push({ key: 'orders' });
            }}
            testID="view-all-orders"
            hitSlop={8}
          >
            <Text style={{ color: theme.accent, fontWeight: '700' }}>view all ›</Text>
          </Pressable>
        </View>
        <View style={styles.statusRow}>
          {[
            { label: 'Delivered', icon: 'cube-outline' as const, n: delivered },
            { label: 'Paid', icon: 'card-outline' as const, n: paid },
            { label: 'Shipped', icon: 'airplane-outline' as const, n: shipped },
          ].map((s) => (
            <Pressable
              key={s.label}
              onPress={() => {
                hapticTap();
                push({ key: 'orders' });
              }}
              style={({ pressed }) => [styles.status, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={[styles.statusIcon, { backgroundColor: theme.accentMuted }]}>
                <Ionicons name={s.icon} size={22} color={theme.accent} />
              </View>
              <Text style={{ color: theme.text, fontWeight: '700', marginTop: 8 }}>{s.label}</Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>{s.n}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.tiles}>
        {TILES.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => {
              hapticTap();
              push({ key: t.screen });
            }}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.shadow, opacity: pressed ? 0.86 : 1 },
            ]}
            testID={`me-${t.key}`}
          >
            <Ionicons name={t.icon} size={28} color={theme.accent} />
            <Text style={{ color: theme.text, fontWeight: '800', marginTop: 10 }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          hapticTap();
          push({ key: 'settings' });
        }}
        style={({ pressed }) => [styles.row, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.86 : 1 }]}
        testID="me-settings"
      >
        <Ionicons name="settings-outline" size={20} color={theme.text} />
        <Text style={{ color: theme.text, fontWeight: '700', flex: 1, marginLeft: 10 }}>Settings</Text>
        <Ionicons name="chevron-forward" size={18} color={theme.muted} />
      </Pressable>

      {cartSubtotal > 0 ? (
        <Text style={{ color: theme.muted, marginTop: 16, textAlign: 'center' }}>
          Bag subtotal {formatPrice(cartSubtotal)}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 26, fontWeight: '900' },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  cta: { marginTop: 16, borderRadius: radius.lg, paddingVertical: 14, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  card: { marginTop: 20, borderRadius: radius.xl, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusRow: { flexDirection: 'row', marginTop: 16 },
  status: { flex: 1, alignItems: 'center' },
  statusIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  tile: {
    width: '48%',
    height: 120,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
    borderRadius: radius.lg,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

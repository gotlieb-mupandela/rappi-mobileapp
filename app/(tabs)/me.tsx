import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthProvider';
import { useOrders } from '../../context/OrdersProvider';
import { formatPrice } from '../../lib/format';
import { colors, font, radius, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui';

const ORDER_STATES: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'reserved', label: 'Reserved', icon: 'time-outline' },
  { key: 'preparing', label: 'Preparing', icon: 'cube-outline' },
  { key: 'shipped', label: 'Shipped', icon: 'rocket-outline' },
  { key: 'delivered', label: 'Delivered', icon: 'checkmark-done-outline' },
];

const OPTIONS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; route?: string }[] = [
  { key: 'favorites', label: 'Favorites', icon: 'heart-outline' },
  { key: 'addresses', label: 'Addresses', icon: 'location-outline' },
  { key: 'hubs', label: 'Rappi Hubs', icon: 'business-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline', route: '/settings' },
];

export default function MeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { orders } = useOrders();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + spacing.md }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user ? user.name : 'Welcome'}</Text>
          <Text style={styles.email}>
            {user ? (user.guest ? 'Browsing as guest' : user.email) : 'Sign in to sync your orders'}
          </Text>
        </View>
        {user && !user.guest ? null : (
          <Pressable style={styles.signInBtn} onPress={() => router.push('/login')} testID="me-signin">
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.orderStates}>
        {ORDER_STATES.map((s) => (
          <View key={s.key} style={styles.stateItem}>
            <View>
              <Ionicons name={s.icon} size={24} color={colors.textSecondary} />
              {(counts[s.key] ?? 0) > 0 && (
                <View style={styles.stateBadge}>
                  <Text style={styles.stateBadgeText}>{counts[s.key]}</Text>
                </View>
              )}
            </View>
            <Text style={styles.stateLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.optionsGrid}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.key}
            style={styles.option}
            onPress={() => o.route && router.push(o.route)}
            testID={`me-${o.key}`}
          >
            <Ionicons name={o.icon} size={22} color={colors.accent} />
            <Text style={styles.optionText}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>My orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders yet. Your placed orders will appear here.</Text>
      ) : (
        orders.map((o) => (
          <View key={o.id} style={styles.orderCard} testID={`order-${o.id}`}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{o.id}</Text>
              <Text style={styles.orderStatus}>{o.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.orderMeta}>
              {o.items.reduce((n, i) => n + i.qty, 0)} items · {o.shippingMethod}
            </Text>
            <Text style={styles.orderTotal}>{formatPrice(o.total)}</Text>
          </View>
        ))
      )}

      {user && (
        <Button
          label={user.guest ? 'Sign in / create account' : 'Sign out'}
          variant="outline"
          style={{ marginTop: spacing.xl }}
          onPress={() => (user.guest ? router.push('/login') : router.push('/settings'))}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.text, fontSize: 18, fontWeight: font.black },
  email: { color: colors.muted, fontSize: 13 },
  signInBtn: {
    backgroundColor: colors.accent,
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  signInText: { color: colors.onAccent, fontWeight: font.black, fontSize: 13 },
  orderStates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  stateItem: { alignItems: 'center', gap: 6 },
  stateBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.accent,
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateBadgeText: { color: colors.onAccent, fontSize: 10, fontWeight: font.black },
  stateLabel: { color: colors.muted, fontSize: 11, fontWeight: font.semibold },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  option: {
    width: '47.8%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  optionText: { color: colors.text, fontWeight: font.bold, fontSize: 14 },
  section: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  noOrders: { color: colors.muted2, fontSize: 13 },
  orderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: colors.text, fontWeight: font.black, fontSize: 14 },
  orderStatus: { color: colors.accent, fontWeight: font.black, fontSize: 11 },
  orderMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  orderTotal: { color: colors.text, fontWeight: font.black, fontSize: 16, marginTop: 4 },
});

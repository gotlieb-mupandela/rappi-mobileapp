import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore, type Tab } from '../store';
import { radius } from '../theme';
import { hapticTap } from '../haptics';
import { useAppInsets } from '../useInsets';

const TABS: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'shop', label: 'Shop', icon: 'storefront-outline', active: 'storefront' },
  { id: 'category', label: 'Category', icon: 'grid-outline', active: 'grid' },
  { id: 'cart', label: 'Cart', icon: 'cart-outline', active: 'cart' },
  { id: 'me', label: 'Me', icon: 'person-outline', active: 'person' },
];

export function TabBar() {
  const { theme, tab, setTab, resetToTabs, cartCount } = useStore();
  const insets = useAppInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          paddingBottom: Math.max(10, insets.bottom),
        },
      ]}
    >
      {TABS.map((item) => {
        const active = tab === item.id;
        const color = active ? theme.accent : theme.muted;
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              hapticTap();
              setTab(item.id);
              resetToTabs(item.id);
            }}
            style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
            testID={`tab-${item.id}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.id === 'cart' && cartCount > 0 ? `${item.label}, ${cartCount} items` : item.label}
            hitSlop={4}
          >
            <View>
              <Ionicons name={active ? item.active : item.icon} size={22} color={color} />
              {item.id === 'cart' && cartCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: theme.accent, borderColor: theme.tabBar }]}>
                  <Text style={[styles.badgeText, { color: theme.onAccent }]}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 52, paddingVertical: 6 },
  label: { fontSize: 11, fontWeight: '700' },
  badge: {
    position: 'absolute',
    right: -11,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '800' },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore, type Tab } from '../store';
import { radius } from '../theme';

const TABS: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'shop', label: 'Shop', icon: 'storefront-outline', active: 'storefront' },
  { id: 'category', label: 'Category', icon: 'grid-outline', active: 'grid' },
  { id: 'cart', label: 'Cart', icon: 'cart-outline', active: 'cart' },
  { id: 'me', label: 'Me', icon: 'person-outline', active: 'person' },
];

export function TabBar() {
  const { theme, tab, setTab, resetToTabs, cartCount } = useStore();
  return (
    <View style={[styles.bar, { backgroundColor: theme.tabBar, borderTopColor: theme.border }]}>
      {TABS.map((item) => {
        const active = tab === item.id;
        const color = active ? theme.accent : theme.muted;
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              setTab(item.id);
              resetToTabs(item.id);
            }}
            style={styles.item}
            testID={`tab-${item.id}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
          >
            <View>
              <Ionicons name={active ? item.active : item.icon} size={22} color={color} />
              {item.id === 'cart' && cartCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
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
    paddingTop: 8,
    paddingBottom: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '700' },
  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '800' },
});

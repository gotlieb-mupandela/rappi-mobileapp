import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { DEMO_EMAIL, DEMO_PASSWORD, SHIPPING_METHODS, STORE_NAME, STOREFRONT_URL, TAGLINE } from '../catalog';
import { formatPrice } from '../format';
import { ScreenHeader } from '../components/ScreenHeader';
import { useStore } from '../store';
import { radius } from '../theme';

export function SettingsScreen() {
  const { theme, themeName, setThemeName, notify, setNotify, user, logout, resetToTabs, catalog } = useStore();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={[styles.h, { color: theme.text }]}>Appearance</Text>
        <View style={[styles.row, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text, fontWeight: '700', flex: 1 }}>Dark mode</Text>
          <Switch
            value={themeName === 'dark'}
            onValueChange={(v) => setThemeName(v ? 'dark' : 'light')}
            trackColor={{ true: theme.accent }}
            testID="toggle-dark"
          />
        </View>
        <View style={[styles.row, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text, fontWeight: '700', flex: 1 }}>Notifications</Text>
          <Switch value={notify} onValueChange={setNotify} trackColor={{ true: theme.accent }} testID="toggle-notify" />
        </View>

        <Text style={[styles.h, { color: theme.text }]}>Pricing & shipping</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.muted, marginBottom: 8 }}>
            All unit prices are retail Namibian dollars (N$). Checkout is a stub — no real payments.
          </Text>
          {SHIPPING_METHODS.map((m) => (
            <View key={m.id} style={styles.split}>
              <Text style={{ color: theme.text }}>{m.name}</Text>
              <Text style={{ color: theme.text, fontWeight: '800' }}>{m.cost ? formatPrice(m.cost) : 'Free'}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.h, { color: theme.text }]}>Stores</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text, fontWeight: '800' }}>{STORE_NAME}</Text>
          <Text style={{ color: theme.muted, marginTop: 6 }}>
            Windhoek hub pickup is free. Live storefront: {STOREFRONT_URL}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 6 }}>
            Catalog: {catalog.length.toLocaleString()} SKUs from the official RAPPI web catalog.
          </Text>
        </View>

        <Text style={[styles.h, { color: theme.text }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.text }}>{user ? `${user.name} · ${user.email}` : 'Browsing as guest'}</Text>
          <Text style={{ color: theme.muted2, marginTop: 8, fontSize: 12 }}>
            Demo login {DEMO_EMAIL} / {DEMO_PASSWORD}
          </Text>
          {user ? (
            <Pressable
              onPress={() => {
                logout();
                resetToTabs('me');
              }}
              style={[styles.cta, { backgroundColor: theme.danger }]}
              testID="logout"
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>Log out</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={{ color: theme.muted2, marginTop: 24, textAlign: 'center', fontSize: 12 }}>
          {STORE_NAME} · {TAGLINE}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 18, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.lg,
    marginBottom: 8,
  },
  card: { borderRadius: radius.lg, padding: 14 },
  split: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  cta: { marginTop: 14, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
});

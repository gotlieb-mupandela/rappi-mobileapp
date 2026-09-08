import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { getProduct } from '../products';
import { useStore } from '../store';
import { radius } from '../theme';

export function FavoritesScreen() {
  const { theme, favorites, catalog, openProduct } = useStore();
  const products = favorites.map((c) => getProduct(catalog, c)).filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Favorites" />
      <ScrollView contentContainerStyle={styles.grid}>
        {!products.length ? (
          <Text style={{ color: theme.muted, textAlign: 'center', width: '100%', marginTop: 40 }}>
            Heart a product to save it here.
          </Text>
        ) : (
          products.map((p) => (p ? <ProductCard key={p.code} product={p} onPress={() => openProduct(p.code)} /> : null))
        )}
      </ScrollView>
    </View>
  );
}

export function AddressesScreen() {
  const { theme, addresses, addAddress, removeAddress } = useStore();
  const [label, setLabel] = useState('Home');
  const [name, setName] = useState('');
  const [line, setLine] = useState('');
  const [city, setCity] = useState('Windhoek');
  const [country, setCountry] = useState('Namibia');

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Addresses" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses.map((a) => (
          <View key={a.id} style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={{ color: theme.accent, fontWeight: '800' }}>{a.label}</Text>
            <Text style={{ color: theme.text, marginTop: 4 }}>{a.name}</Text>
            <Text style={{ color: theme.muted }}>{a.line}</Text>
            <Text style={{ color: theme.muted }}>
              {a.city}, {a.country}
            </Text>
            <Pressable onPress={() => removeAddress(a.id)}>
              <Text style={{ color: theme.danger, marginTop: 8, fontWeight: '700' }}>Remove</Text>
            </Pressable>
          </View>
        ))}
        <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 8 }}>Add address</Text>
        {[
          ['Label', label, setLabel],
          ['Name', name, setName],
          ['Street', line, setLine],
          ['City', city, setCity],
          ['Country', country, setCountry],
        ].map(([l, v, s]) => (
          <TextInput
            key={String(l)}
            value={String(v)}
            onChangeText={s as (t: string) => void}
            placeholder={String(l)}
            placeholderTextColor={theme.muted2}
            style={[styles.input, { color: theme.text, borderColor: theme.borderStrong, backgroundColor: theme.surface }]}
          />
        ))}
        <Pressable
          onPress={() => {
            if (!name || !line) return;
            addAddress({ label, name, line, city, country });
            setName('');
            setLine('');
          }}
          style={[styles.cta, { backgroundColor: theme.accent }]}
          testID="add-address"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '800' }}>Save address</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export function NotificationsScreen() {
  const { theme, notify, orders } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Notifications" />
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.muted }}>
          {notify
            ? 'Order updates are on for this device.'
            : 'Notifications are muted in Settings.'}
        </Text>
        {orders.slice(0, 5).map((o) => (
          <View key={o.id} style={[styles.card, { backgroundColor: theme.surface, marginTop: 12 }]}>
            <Text style={{ color: theme.text, fontWeight: '700' }}>Order {o.id} {o.status}</Text>
            <Text style={{ color: theme.muted, marginTop: 4 }}>We’ll pack this at the RAPPI hub.</Text>
          </View>
        ))}
        {!orders.length ? (
          <Text style={{ color: theme.muted, marginTop: 24 }}>No order alerts yet.</Text>
        ) : null}
      </View>
    </View>
  );
}

export function ConfirmationScreen({ orderId }: { orderId: string }) {
  const { theme, orders, resetToTabs } = useStore();
  const order = orders.find((o) => o.id === orderId);
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 42 }}>✓</Text>
      <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', marginTop: 12 }}>Order reserved</Text>
      <Text style={{ color: theme.muted, marginTop: 8, textAlign: 'center' }}>
        {order ? `${order.id} · ${order.shippingMethod}` : orderId}
      </Text>
      <Text style={{ color: theme.muted, marginTop: 8, textAlign: 'center' }}>
        No real payment was taken. Stock is reserved locally for this demo shop.
      </Text>
      <Pressable
        onPress={() => resetToTabs('shop')}
        style={[styles.cta, { backgroundColor: theme.accent, alignSelf: 'stretch' }]}
        testID="confirm-done"
      >
        <Text style={{ color: theme.onAccent, fontWeight: '900', textAlign: 'center' }}>Back to shop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 12 },
  card: { borderRadius: radius.lg, padding: 14, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  cta: { marginTop: 8, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center' },
});

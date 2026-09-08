import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SHIPPING_METHODS } from '../catalog';
import { formatPrice } from '../format';
import { getProduct } from '../products';
import { ScreenHeader } from '../components/ScreenHeader';
import { useStore } from '../store';
import { radius } from '../theme';

export function CheckoutScreen() {
  const { theme, catalog, lines, cartSubtotal, user, placeOrder, push, showToast, addresses } = useStore();
  const [name, setName] = useState(user?.guest ? '' : user?.name ?? '');
  const [email, setEmail] = useState(user?.guest ? '' : user?.email ?? '');
  const [address, setAddress] = useState(addresses[0]?.line ?? '');
  const [city, setCity] = useState(addresses[0]?.city ?? '');
  const [country, setCountry] = useState(addresses[0]?.country ?? 'Namibia');
  const [method, setMethod] = useState<(typeof SHIPPING_METHODS)[number]['id']>('standard');
  const [notes, setNotes] = useState('');

  const shipping = SHIPPING_METHODS.find((m) => m.id === method) ?? SHIPPING_METHODS[0];
  const total = cartSubtotal + shipping.cost;

  const field = (label: string, value: string, onChange: (v: string) => void, extra?: object) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: theme.text, borderColor: theme.borderStrong, backgroundColor: theme.surface }]}
        placeholderTextColor={theme.muted2}
        {...extra}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Checkout" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: theme.muted, marginBottom: 16 }}>
          Guest checkout is enabled. Shipping: Standard N$100, Express N$150, Hub pickup free.
        </Text>
        {field('Full name', name, setName, { autoComplete: 'name', testID: 'co-name' })}
        {field('Email', email, setEmail, { autoComplete: 'email', keyboardType: 'email-address', autoCapitalize: 'none', testID: 'co-email' })}
        {field('Address', address, setAddress, { testID: 'co-address' })}
        {field('City', city, setCity, { testID: 'co-city' })}
        {field('Country', country, setCountry, { testID: 'co-country' })}

        <Text style={[styles.label, { color: theme.muted }]}>Shipping</Text>
        {SHIPPING_METHODS.map((m) => {
          const active = m.id === method;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[
                styles.ship,
                {
                  borderColor: active ? theme.accent : theme.border,
                  backgroundColor: theme.surface,
                },
              ]}
              testID={`ship-${m.id}`}
            >
              <Text style={{ color: theme.text, fontWeight: '700' }}>{m.name}</Text>
              <Text style={{ color: theme.text, fontWeight: '800' }}>{m.cost ? formatPrice(m.cost) : 'Free'}</Text>
            </Pressable>
          );
        })}

        {field('Notes (optional)', notes, setNotes)}

        <View style={[styles.summary, { backgroundColor: theme.surface }]}>
          {lines.map((l) => {
            const p = getProduct(catalog, l.code);
            if (!p) return null;
            return (
              <View key={`${l.code}-${l.size}`} style={styles.sumRow}>
                <Text style={{ color: theme.text, flex: 1 }} numberOfLines={1}>
                  {p.displayName} × {l.qty}
                </Text>
                <Text style={{ color: theme.text }}>{formatPrice(p.price * l.qty)}</Text>
              </View>
            );
          })}
          <View style={styles.sumRow}>
            <Text style={{ color: theme.muted }}>Subtotal</Text>
            <Text style={{ color: theme.text }}>{formatPrice(cartSubtotal)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={{ color: theme.muted }}>Shipping</Text>
            <Text style={{ color: theme.text }}>{shipping.cost ? formatPrice(shipping.cost) : 'Free'}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>Total</Text>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>{formatPrice(total)}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            const result = placeOrder({
              name,
              email,
              address,
              city,
              country,
              shippingMethod: method,
              notes,
            });
            if (!result.ok) {
              showToast('err', result.message);
              return;
            }
            showToast('ok', 'Order placed.');
            push({ key: 'confirmation', orderId: result.order.id });
          }}
          style={[styles.cta, { backgroundColor: theme.accent }]}
          testID="place-order"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900', fontSize: 16 }}>
            Place order · {formatPrice(total)}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
  ship: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  summary: { borderRadius: radius.lg, padding: 14, marginTop: 8 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 4 },
  cta: { marginTop: 18, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
});

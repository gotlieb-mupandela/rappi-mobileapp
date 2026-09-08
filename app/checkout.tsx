import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCatalog } from '../context/CatalogProvider';
import { useCart } from '../context/CartProvider';
import { useOrders } from '../context/OrdersProvider';
import { useAuth } from '../context/AuthProvider';
import { SHIPPING_METHODS, shippingCostById } from '../lib/shipping';
import { formatPrice } from '../lib/format';
import { colors, font, radius, spacing } from '../theme/tokens';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/ui';

export default function CheckoutScreen() {
  const router = useRouter();
  const { getProduct } = useCatalog();
  const { lines, clear } = useCart();
  const { place } = useOrders();
  const { user } = useAuth();

  const [name, setName] = useState(user && !user.guest ? user.name : '');
  const [email, setEmail] = useState(user && !user.guest ? user.email : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Namibia');
  const [method, setMethod] = useState('standard');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () => lines.map((l) => ({ line: l, product: getProduct(l.code) })).filter((r) => r.product),
    [lines, getProduct],
  );
  const subtotal = rows.reduce((s, r) => s + r.product!.price * r.line.qty, 0);
  const shipping = shippingCostById(method);
  const total = subtotal + shipping;

  const onPlace = async () => {
    setError(null);
    setBusy(true);
    const res = await place(
      { name, email, address, city, country, shippingMethod: method, lines },
      getProduct,
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    clear();
    router.replace(`/order-confirmation?id=${encodeURIComponent(res.order.id)}`);
  };

  return (
    <View style={styles.screen}>
      <TopBar title="Checkout" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.section}>Shipping details</Text>
          <Field label="Full name" value={name} onChangeText={setName} placeholder="Jane Runner" testID="co-name" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" testID="co-email" />
          <Field label="Address" value={address} onChangeText={setAddress} placeholder="12 Independence Ave" testID="co-address" />
          <View style={styles.two}>
            <View style={{ flex: 1 }}>
              <Field label="City" value={city} onChangeText={setCity} placeholder="Windhoek" testID="co-city" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Country" value={country} onChangeText={setCountry} placeholder="Namibia" testID="co-country" />
            </View>
          </View>

          <Text style={styles.section}>Shipping method</Text>
          {SHIPPING_METHODS.map((m) => {
            const active = method === m.id;
            return (
              <Pressable key={m.id} style={[styles.method, active && styles.methodActive]} onPress={() => setMethod(m.id)} testID={`ship-${m.id}`}>
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={active ? colors.accent : colors.muted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{m.name}</Text>
                  <Text style={styles.methodDetail}>{m.detail}</Text>
                </View>
                <Text style={styles.methodCost}>{m.cost === 0 ? 'Free' : formatPrice(m.cost)}</Text>
              </Pressable>
            );
          })}

          <Text style={styles.section}>Order summary</Text>
          <View style={styles.summary}>
            <SummaryRow label={`Subtotal (${lines.reduce((n, l) => n + l.qty, 0)} items)`} value={formatPrice(subtotal)} />
            <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
            <View style={styles.divider} />
            <SummaryRow label="Total" value={formatPrice(total)} strong />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <View style={styles.bar}>
          <View>
            <Text style={styles.barLabel}>Total</Text>
            <Text style={styles.barTotal}>{formatPrice(total)}</Text>
          </View>
          <Button
            label="Place order"
            loading={busy}
            disabled={rows.length === 0}
            style={{ flex: 1, marginLeft: spacing.lg }}
            onPress={onPlace}
            testID="place-order"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label,
  testID,
  ...props
}: {
  label: string;
  testID?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        testID={testID}
        placeholderTextColor={colors.muted2}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, strong && styles.sumStrong]}>{label}</Text>
      <Text style={[styles.sumValue, strong && styles.sumStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  section: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  field: { marginBottom: spacing.md },
  fieldLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: font.semibold, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    color: colors.text,
    fontSize: 15,
  },
  two: { flexDirection: 'row', gap: spacing.md },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  methodActive: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  methodName: { color: colors.text, fontWeight: font.bold, fontSize: 14 },
  methodDetail: { color: colors.muted, fontSize: 12 },
  methodCost: { color: colors.text, fontWeight: font.black, fontSize: 14 },
  summary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { color: colors.muted, fontSize: 14 },
  sumValue: { color: colors.textSecondary, fontSize: 14, fontWeight: font.semibold },
  sumStrong: { color: colors.text, fontSize: 17, fontWeight: font.black },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  error: { color: colors.danger, marginTop: spacing.md, fontWeight: font.semibold },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  barLabel: { color: colors.muted, fontSize: 10, fontWeight: font.bold, textTransform: 'uppercase' },
  barTotal: { color: colors.text, fontSize: 20, fontWeight: font.black },
});

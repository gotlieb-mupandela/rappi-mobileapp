import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthProvider';
import { useCatalog } from '../context/CatalogProvider';
import { useCart } from '../context/CartProvider';
import { colors, font, radius, spacing } from '../theme/tokens';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/ui';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, supabase, signOut } = useAuth();
  const { products, source } = useCatalog();
  const { clear } = useCart();

  return (
    <View style={styles.screen}>
      <TopBar title="Settings" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={styles.section}>Account</Text>
        <Row icon="person-outline" label="Name" value={user?.name ?? '—'} />
        <Row icon="mail-outline" label="Email" value={user && !user.guest ? user.email : 'Guest'} />
        <Row icon="key-outline" label="Auth" value={supabase ? 'Supabase' : 'Local / demo'} />

        <Text style={styles.section}>Catalog</Text>
        <Row icon="cube-outline" label="Products loaded" value={String(products.length)} />
        <Row
          icon="cloud-outline"
          label="Source"
          value={source === 'network' ? 'Live (GitHub raw)' : source === 'fallback' ? 'Offline sample' : '—'}
        />

        <Text style={styles.section}>Preferences</Text>
        <Pressable style={styles.action} onPress={clear} testID="settings-clear-cart">
          <Ionicons name="trash-outline" size={20} color={colors.text} />
          <Text style={styles.actionText}>Clear cart</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>

        <Text style={styles.about}>RAPPI SPORTS HUB · EQUIP · PERFORM · INSPIRE{'\n'}Mobile store v1.0.0 · Expo Router</Text>

        {user && !user.guest ? (
          <Button
            label="Sign out"
            variant="outline"
            style={{ marginTop: spacing.xl }}
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}
            testID="settings-signout"
          />
        ) : (
          <Button label="Sign in" style={{ marginTop: spacing.xl }} onPress={() => router.push('/login')} />
        )}
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.muted} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: font.semibold, flex: 1 },
  rowValue: { color: colors.text, fontSize: 14, fontWeight: font.bold },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  actionText: { color: colors.text, fontSize: 14, fontWeight: font.semibold, flex: 1 },
  about: { color: colors.muted2, fontSize: 12, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
});

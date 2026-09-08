import React, { useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import { colors, font, radius, spacing } from '../theme/tokens';
import { Button } from '../components/ui';

const mark = require('../assets/brand/rappi-mark.png');

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, continueAsGuest, supabase } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const submit = async () => {
    setError(null);
    setBusy(true);
    const res =
      mode === 'signin' ? await signIn(email, password) : await signUp(name, email, password);
    setBusy(false);
    if (res.ok) done();
    else setError(res.message);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.xxl }}>
      <Pressable onPress={done} style={styles.close} hitSlop={10} testID="login-close">
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <View style={styles.brand}>
        <Image source={mark} style={{ width: 64, height: 64 }} contentFit="contain" />
        <Text style={styles.title}>RAPPI SPORTS HUB</Text>
        <Text style={styles.tag}>GEAR UP. SHOW UP. LEVEL UP.</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, mode === 'signin' && styles.tabActive]} onPress={() => setMode('signin')} testID="tab-signin">
          <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>Sign in</Text>
        </Pressable>
        <Pressable style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => setMode('signup')} testID="tab-signup">
          <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Create account</Text>
        </Pressable>
      </View>

      {mode === 'signup' && (
        <Input label="Name" value={name} onChangeText={setName} placeholder="Jane Runner" testID="auth-name" />
      )}
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" testID="auth-email" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••" secureTextEntry testID="auth-password" />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button label={mode === 'signin' ? 'Sign in' : 'Create account'} loading={busy} style={{ marginTop: spacing.lg }} onPress={submit} testID="auth-submit" />
      <Button label="Continue as guest" variant="outline" style={{ marginTop: spacing.sm }} onPress={() => { continueAsGuest(); done(); }} testID="auth-guest" />

      <Text style={styles.hint}>
        {supabase ? 'Connected to Supabase Auth.' : 'Demo: shop@rappi.com / rappi123'}
      </Text>
    </ScrollView>
  );
}

function Input({ label, testID, ...props }: { label: string; testID?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...props} testID={testID} placeholderTextColor={colors.muted2} style={styles.input} autoCapitalize="none" autoCorrect={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  close: { alignSelf: 'flex-end' },
  closeText: { color: colors.muted, fontSize: 22 },
  brand: { alignItems: 'center', gap: 6, marginBottom: spacing.xl },
  title: { color: colors.text, fontSize: 20, fontWeight: font.black, letterSpacing: 1, marginTop: spacing.sm },
  tag: { color: colors.accent, fontSize: 11, fontWeight: font.black, letterSpacing: 2 },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.pill, padding: 4, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.muted, fontWeight: font.bold, fontSize: 14 },
  tabTextActive: { color: colors.onAccent, fontWeight: font.black },
  field: { marginBottom: spacing.md },
  fieldLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: font.semibold, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.text,
    fontSize: 15,
  },
  error: { color: colors.danger, marginTop: spacing.sm, fontWeight: font.semibold },
  hint: { color: colors.muted2, fontSize: 12, textAlign: 'center', marginTop: spacing.xl },
});

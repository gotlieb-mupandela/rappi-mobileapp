import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DEMO_EMAIL, DEMO_PASSWORD, TAGLINE } from '../catalog';
import { ScreenHeader } from '../components/ScreenHeader';
import { useStore } from '../store';
import { brandAssets, radius } from '../theme';

export function AuthScreen() {
  const { theme, login, continueGuest, pop, resetToTabs, showToast } = useStore();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Sign in" />
      <View style={styles.body}>
        <Image source={brandAssets.logo} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.tag, { color: theme.accent }]}>{TAGLINE}</Text>
        <Text style={[styles.h1, { color: theme.text }]}>Sign in</Text>
        <Text style={{ color: theme.muted, marginTop: 6, textAlign: 'center' }}>
          Demo shop login. Guests can browse and check out without an account.
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { color: theme.text, borderColor: theme.borderStrong, backgroundColor: theme.surface }]}
          testID="auth-email"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { color: theme.text, borderColor: theme.borderStrong, backgroundColor: theme.surface }]}
          testID="auth-password"
        />
        <Pressable
          onPress={() => {
            const result = login(email, password);
            showToast(result.ok ? 'ok' : 'err', result.message);
            if (result.ok) resetToTabs('me');
          }}
          style={[styles.cta, { backgroundColor: theme.accent }]}
          testID="auth-submit"
        >
          <Text style={{ color: theme.onAccent, fontWeight: '900' }}>Sign in</Text>
        </Pressable>
        <Text style={{ color: theme.muted2, marginTop: 10, fontSize: 12 }}>
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </Text>
        <Pressable
          onPress={() => {
            continueGuest();
            showToast('ok', 'Continuing as guest.');
            pop();
          }}
          style={[styles.ghost, { borderColor: theme.borderStrong }]}
          testID="auth-guest"
        >
          <Text style={{ color: theme.text, fontWeight: '800' }}>Continue as guest</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 24, alignItems: 'center' },
  logo: { width: 200, height: 80, backgroundColor: '#050505', borderRadius: radius.lg },
  tag: { marginTop: 10, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  h1: { fontSize: 32, fontWeight: '900', marginTop: 12 },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  cta: { alignSelf: 'stretch', marginTop: 16, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center' },
  ghost: {
    alignSelf: 'stretch',
    marginTop: 14,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../catalog';
import { BrandLogo } from '../components/BrandLogo';
import { ScreenHeader } from '../components/ScreenHeader';
import { hapticSuccess, hapticTap } from '../haptics';
import { useStore } from '../store';
import { radius } from '../theme';

export function AuthScreen() {
  const { theme, login, continueGuest, pop, resetToTabs, showToast } = useStore();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Sign in" />
      <View style={styles.body}>
        <BrandLogo variant="lockup" size="footer" />
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
            if (result.ok) hapticSuccess();
            else hapticTap();
            showToast(result.ok ? 'ok' : 'err', result.message);
            if (result.ok) resetToTabs('me');
          }}
          style={({ pressed }) => [styles.cta, { backgroundColor: theme.accent, opacity: pressed ? 0.88 : 1 }]}
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
            hapticTap();
            showToast('ok', 'Continuing as guest.');
            pop();
          }}
          style={({ pressed }) => [styles.ghost, { borderColor: theme.borderStrong, opacity: pressed ? 0.8 : 1 }]}
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
  h1: { fontSize: 32, fontWeight: '900', marginTop: 16 },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
    minHeight: 48,
  },
  cta: { alignSelf: 'stretch', marginTop: 16, borderRadius: radius.lg, paddingVertical: 14, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  ghost: {
    alignSelf: 'stretch',
    marginTop: 14,
    borderRadius: radius.lg,
    paddingVertical: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { radius } from '../theme';
import { hapticTap } from '../haptics';

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  testID,
  actionTestID,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
  actionTestID?: string;
}) {
  const { theme } = useStore();
  return (
    <View style={styles.wrap} testID={testID}>
      {icon ? (
        <View style={[styles.icon, { backgroundColor: theme.accentMuted }]}>
          <Ionicons name={icon} size={28} color={theme.accent} />
        </View>
      ) : null}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.muted }]}>{body}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={() => {
            hapticTap();
            onAction();
          }}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: theme.accent, opacity: pressed ? 0.86 : 1 },
          ]}
          testID={actionTestID}
        >
          <Text style={{ color: theme.onAccent, fontWeight: '800' }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyWrap({ children }: { children: ReactNode }) {
  return <View style={styles.page}>{children}</View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  wrap: { alignItems: 'center', paddingHorizontal: 28 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  body: { marginTop: 8, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  cta: {
    marginTop: 18,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

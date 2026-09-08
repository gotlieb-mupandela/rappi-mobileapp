import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, spacing } from '../theme/tokens';

export function TopBar({
  title,
  right,
  onBack,
}: {
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable
        testID="back-button"
        onPress={() => (onBack ? onBack() : router.canGoBack() ? router.back() : router.replace('/'))}
        style={styles.back}
        hitSlop={10}
      >
        <Text style={styles.chevron}>‹</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  chevron: { color: colors.accent, fontSize: 34, lineHeight: 36, fontWeight: font.black },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: font.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.sm,
  },
  right: { minWidth: 36, alignItems: 'flex-end' },
});

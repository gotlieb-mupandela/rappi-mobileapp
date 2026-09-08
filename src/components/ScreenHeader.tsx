import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { hapticTap } from '../haptics';

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const { theme, pop } = useStore();
  return (
    <View style={[styles.row, { borderBottomColor: theme.border, backgroundColor: theme.headerBg }]}>
      <Pressable
        onPress={() => {
          hapticTap();
          (onBack ?? pop)();
        }}
        hitSlop={12}
        style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
        accessibilityLabel="Back"
        accessibilityRole="button"
        testID="nav-back"
      >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </Pressable>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800' },
  right: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});

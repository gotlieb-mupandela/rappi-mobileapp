import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';

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
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Pressable
        onPress={onBack ?? pop}
        hitSlop={10}
        style={styles.back}
        accessibilityLabel="Back"
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
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  back: { width: 40, alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800' },
  right: { width: 40, alignItems: 'center' },
});

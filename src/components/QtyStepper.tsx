import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { radius } from '../theme';
import { hapticTap } from '../haptics';

export function QtyStepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  const { theme } = useStore();
  const decDisabled = value <= min;
  const incDisabled = value >= max;
  return (
    <View style={[styles.row, { borderColor: theme.borderStrong }]}>
      <Pressable
        onPress={() => {
          if (decDisabled) return;
          hapticTap();
          onChange(Math.max(min, value - 1));
        }}
        disabled={decDisabled}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: theme.surface2, opacity: decDisabled ? 0.4 : pressed ? 0.75 : 1 },
        ]}
        accessibilityLabel="Decrease quantity"
        hitSlop={4}
      >
        <Ionicons name="remove" size={16} color={theme.text} />
      </Pressable>
      <Text style={[styles.qty, { color: theme.text }]}>{value}</Text>
      <Pressable
        onPress={() => {
          if (incDisabled) return;
          hapticTap();
          onChange(Math.min(max, value + 1));
        }}
        disabled={incDisabled}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: theme.accent, opacity: incDisabled ? 0.4 : pressed ? 0.8 : 1 },
        ]}
        accessibilityLabel="Increase quantity"
        hitSlop={4}
      >
        <Ionicons name="add" size={16} color={theme.onAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: 32, textAlign: 'center', fontWeight: '800', fontVariant: ['tabular-nums'] },
});

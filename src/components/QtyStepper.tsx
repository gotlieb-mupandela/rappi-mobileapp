import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { radius } from '../theme';

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
  return (
    <View style={[styles.row, { borderColor: theme.borderStrong }]}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.btn, { backgroundColor: theme.surface2 }]}
        accessibilityLabel="Decrease quantity"
      >
        <Ionicons name="remove" size={16} color={theme.text} />
      </Pressable>
      <Text style={[styles.qty, { color: theme.text }]}>{value}</Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.btn, { backgroundColor: theme.accent }]}
        accessibilityLabel="Increase quantity"
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
  },
  btn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: 28, textAlign: 'center', fontWeight: '800' },
});

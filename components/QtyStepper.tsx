import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius } from '../theme/tokens';

export function QtyStepper({
  qty,
  onDec,
  onInc,
  max,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  max?: number;
}) {
  const atMax = typeof max === 'number' && qty >= max;
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.btn} onPress={onDec} testID="qty-dec">
        <Text style={styles.sign}>−</Text>
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable style={[styles.btn, atMax && styles.disabled]} onPress={atMax ? undefined : onInc} testID="qty-inc">
        <Text style={styles.sign}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
  sign: { color: colors.onAccent, fontSize: 18, fontWeight: font.black, lineHeight: 20 },
  qty: { color: colors.text, fontSize: 15, fontWeight: font.black, minWidth: 22, textAlign: 'center' },
});

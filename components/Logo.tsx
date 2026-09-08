import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../theme/tokens';

const mark = require('../assets/brand/rappi-mark.png');

/** Header lockup: Rappi mark + RAPPI SPORTS HUB wordmark. */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <View style={styles.row}>
      <Image source={mark} style={{ width: size, height: size }} contentFit="contain" />
      <View style={styles.words}>
        <Text style={styles.rappi}>RAPPI</Text>
        <Text style={styles.hub}>SPORTS HUB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  words: { justifyContent: 'center' },
  rappi: {
    color: colors.text,
    fontSize: 18,
    fontWeight: font.black,
    letterSpacing: 1.5,
    lineHeight: 20,
  },
  hub: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: font.black,
    letterSpacing: 3,
    lineHeight: 12,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme/tokens';

/**
 * Search + Search-button row (structure copied from the reference mock).
 * When `readOnly` is set it behaves as a button that routes to /search.
 */
export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onPress,
  placeholder = 'Search gear, code, or category',
  readOnly,
  autoFocus,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onPress?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <Text style={styles.icon}>⌕</Text>
        {readOnly ? (
          <Pressable style={styles.pressField} onPress={onPress} testID="search-launcher">
            <Text style={styles.placeholder}>{placeholder}</Text>
          </Pressable>
        ) : (
          <TextInput
            testID="search-input"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder={placeholder}
            placeholderTextColor={colors.muted2}
            style={styles.input}
            autoFocus={autoFocus}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      </View>
      <Pressable
        testID="search-button"
        style={styles.button}
        onPress={readOnly ? onPress : onSubmit}
      >
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 46,
  },
  icon: { color: colors.muted, fontSize: 20, marginRight: spacing.sm },
  input: { flex: 1, color: colors.text, fontSize: 15, height: '100%' },
  pressField: { flex: 1, justifyContent: 'center', height: '100%' },
  placeholder: { color: colors.muted2, fontSize: 15 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 46,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.onAccent, fontWeight: font.black, fontSize: 14 },
});

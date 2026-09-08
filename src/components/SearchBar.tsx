import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../theme';
import { useStore } from '../store';
import { hapticTap } from '../haptics';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search sportswear, codes…',
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { theme } = useStore();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.surface,
          borderColor: focused ? theme.accent : theme.borderStrong,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <Ionicons name="search" size={18} color={theme.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.muted2}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        blurOnSubmit
        enablesReturnKeyAutomatically
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        testID="search-input"
        accessibilityLabel="Search catalog"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => {
            hapticTap();
            onChange('');
          }}
          hitSlop={10}
          style={styles.clear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          testID="search-clear"
        >
          <Ionicons name="close-circle" size={18} color={theme.muted} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={() => {
          hapticTap();
          onSubmit();
        }}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: theme.searchBtn, opacity: pressed ? 0.86 : 1 },
        ]}
        testID="search-submit"
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Text style={[styles.btnText, { color: theme.onAccent }]}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingLeft: 14,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 10, paddingVertical: 10 },
  clear: { paddingHorizontal: 4, minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  btn: {
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
  },
  btnText: { fontWeight: '800', fontSize: 13 },
});

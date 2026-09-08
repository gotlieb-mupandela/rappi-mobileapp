import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../theme';
import { useStore } from '../store';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search sportswear, codes…',
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}) {
  const { theme } = useStore();
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surface, borderColor: theme.borderStrong, shadowColor: theme.shadow },
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
        testID="search-input"
      />
      <Pressable
        onPress={onSubmit}
        style={[styles.btn, { backgroundColor: theme.searchBtn }]}
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
  },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 10, paddingVertical: 8 },
  btn: {
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnText: { fontWeight: '800', fontSize: 13 },
});

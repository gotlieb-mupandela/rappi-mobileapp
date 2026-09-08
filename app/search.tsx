import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogProvider';
import { filterCatalog } from '../lib/catalog';
import { colors, font, spacing } from '../theme/tokens';
import { SearchBar } from '../components/SearchBar';
import { ProductGrid } from '../components/ProductGrid';

const SUGGESTIONS = ['Jersey', 'Boots', 'Socks', 'Bib', 'Running', 'Shoes', 'Gloves', 'Rugby'];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products } = useCatalog();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  const q = query.trim();
  const results = useMemo(() => (q.length >= 1 ? filterCatalog(products, { q }) : []), [products, q]);

  const submit = (value?: string) => {
    const v = (value ?? text).trim();
    setText(v);
    setQuery(v);
  };

  const header = q ? (
    <Text style={styles.count}>
      {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
    </Text>
  ) : (
    <View style={styles.suggestWrap}>
      <Text style={styles.suggestTitle}>Popular searches</Text>
      <View style={styles.suggestRow}>
        {SUGGESTIONS.map((s) => (
          <Pressable key={s} style={styles.suggest} onPress={() => submit(s)} testID={`suggest-${s}`}>
            <Text style={styles.suggestText}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>Search by product name, code, or category.</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back} testID="search-back">
          <Text style={styles.chevron}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={text}
            onChangeText={setText}
            onSubmit={() => submit()}
            autoFocus
            placeholder="Search gear, code, or category"
          />
        </View>
      </View>
      <ProductGrid data={results} ListHeaderComponent={header} emptyText={q ? 'No products match your search.' : ''} testID="search-grid" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.xs },
  back: { width: 30, height: 46, alignItems: 'center', justifyContent: 'center' },
  chevron: { color: colors.accent, fontSize: 32, fontWeight: font.black },
  count: { color: colors.muted, fontSize: 13, fontWeight: font.semibold, paddingVertical: spacing.md },
  suggestWrap: { paddingVertical: spacing.lg },
  suggestTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suggest: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  suggestText: { color: colors.textSecondary, fontWeight: font.semibold, fontSize: 13 },
  hint: { color: colors.muted2, fontSize: 12, marginTop: spacing.lg },
});

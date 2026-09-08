import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useCatalog } from '../context/CatalogProvider';
import { useCart } from '../context/CartProvider';
import { AUDIENCES, categoryLabel, filterCatalog } from '../lib/catalog';
import { colors, font, spacing } from '../theme/tokens';
import { TopBar } from '../components/TopBar';
import { ProductGrid } from '../components/ProductGrid';
import { Chip } from '../components/ui';

export default function ListingScreen() {
  const params = useLocalSearchParams<{ cat?: string; sub?: string; audience?: string; q?: string }>();
  const router = useRouter();
  const { products, loading } = useCatalog();
  const { count } = useCart();
  const [audience, setAudience] = useState<string>(params.audience ?? 'all');

  const cat = typeof params.cat === 'string' ? params.cat : undefined;
  const sub = typeof params.sub === 'string' ? params.sub : undefined;
  const q = typeof params.q === 'string' ? params.q : undefined;

  const title = cat ? categoryLabel(cat) : q ? `“${q}”` : 'All Products';

  const data = useMemo(
    () => filterCatalog(products, { cat, sub, q, audience }),
    [products, cat, sub, q, audience],
  );

  const header = (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label="All" active={audience === 'all'} onPress={() => setAudience('all')} />
        {AUDIENCES.map((a) => (
          <Chip
            key={a.slug}
            label={a.name}
            active={audience === a.slug}
            onPress={() => setAudience(a.slug)}
            testID={`aud-${a.slug}`}
          />
        ))}
      </ScrollView>
      <Text style={styles.count}>{data.length} results</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <TopBar
        title={title}
        right={
          <Pressable onPress={() => router.push('/cart')} testID="listing-cart">
            <Ionicons name="cart-outline" size={22} color={count > 0 ? colors.accent : colors.text} />
          </Pressable>
        }
      />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <ProductGrid data={data} ListHeaderComponent={header} testID="listing-grid" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: spacing.sm, paddingVertical: spacing.md },
  count: { color: colors.muted, fontSize: 12, fontWeight: font.semibold, marginBottom: spacing.sm },
});

import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LISTING_PAGE_SIZE } from '../catalog';
import { buildListing } from '../products';
import { ProductCard } from '../components/ProductCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { useStore } from '../store';

export function SearchScreen({
  initialQ = '',
  cat,
  audience,
  sub,
}: {
  initialQ?: string;
  cat?: string;
  audience?: string;
  sub?: string;
}) {
  const { theme, catalog, catalogReady, openProduct } = useStore();
  const [q, setQ] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ);
  const [activeCat, setActiveCat] = useState(cat);
  const [page, setPage] = useState(1);

  const listing = useMemo(
    () =>
      buildListing(catalog, {
        q: submitted,
        cat: activeCat,
        audience,
        sub,
        page,
      }),
    [catalog, submitted, activeCat, audience, sub, page],
  );

  const runSearch = () => {
    setSubmitted(q.trim());
    setPage(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Search" />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchBar value={q} onChange={setQ} onSubmit={runSearch} />
      </View>
      <FlatList
        data={listing.facets.categories}
        keyExtractor={(c) => c.slug}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => {
          const active = activeCat === item.slug;
          return (
            <Pressable
              onPress={() => {
                setActiveCat(active ? undefined : item.slug);
                setPage(1);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={{ color: active ? theme.onAccent : theme.text, fontWeight: '700', fontSize: 12 }}>
                {item.name} ({item.count})
              </Text>
            </Pressable>
          );
        }}
      />
      <Text style={[styles.meta, { color: theme.muted }]}>
        {catalogReady ? `${listing.total.toLocaleString()} results` : 'Loading catalog…'} · page {listing.page} of{' '}
        {listing.pageCount}
      </Text>
      <FlatList
        data={listing.products}
        keyExtractor={(p) => p.code}
        numColumns={2}
        columnWrapperStyle={styles.wrap}
        contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 12 }}
        renderItem={({ item }) => <ProductCard product={item} onPress={() => openProduct(item.code)} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.muted, marginTop: 40 }}>
            {submitted ? 'No matching pieces. Try a product code or sport.' : 'Search by name, code, or category.'}
          </Text>
        }
        ListFooterComponent={
          listing.pageCount > 1 ? (
            <View style={styles.pager}>
              <Pressable
                disabled={page <= 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                style={[styles.pageBtn, { opacity: page <= 1 ? 0.4 : 1, backgroundColor: theme.surface }]}
              >
                <Text style={{ color: theme.text, fontWeight: '700' }}>Prev</Text>
              </Pressable>
              <Text style={{ color: theme.muted }}>
                {listing.page}/{listing.pageCount} · {LISTING_PAGE_SIZE}/page
              </Text>
              <Pressable
                disabled={page >= listing.pageCount}
                onPress={() => setPage((p) => Math.min(listing.pageCount, p + 1))}
                style={[styles.pageBtn, { backgroundColor: theme.accent, opacity: page >= listing.pageCount ? 0.4 : 1 }]}
                testID="search-next"
              >
                <Text style={{ color: theme.onAccent, fontWeight: '800' }}>Next</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { paddingHorizontal: 16, gap: 8, paddingVertical: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  meta: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  wrap: { justifyContent: 'space-between' },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
});

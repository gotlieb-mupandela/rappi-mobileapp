import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LISTING_PAGE_SIZE } from '../catalog';
import { buildListing } from '../products';
import type { Product } from '../types';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { hapticTap } from '../haptics';
import { useDebounced } from '../useDebounced';
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
  const listRef = useRef<FlatList<Product>>(null);
  const debouncedQ = useDebounced(q, 350);

  useEffect(() => {
    const next = debouncedQ.trim();
    setSubmitted(next);
    setPage(1);
  }, [debouncedQ]);

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

  useEffect(() => {
    if (listing.page !== page) setPage(listing.page);
  }, [listing.page, page]);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [listing.page, submitted, activeCat]);

  const runSearch = () => {
    setSubmitted(q.trim());
    setPage(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title="Search" />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchBar value={q} onChange={setQ} onSubmit={runSearch} autoFocus={!initialQ} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        {listing.facets.categories.map((item) => {
          const active = activeCat === item.slug;
          return (
            <Pressable
              key={item.slug}
              onPress={() => {
                hapticTap();
                setActiveCat(active ? undefined : item.slug);
                setPage(1);
              }}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: active ? theme.accent : theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={{ color: active ? theme.onAccent : theme.text, fontWeight: '700', fontSize: 12 }}>
                {item.name} ({item.count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text style={[styles.meta, { color: theme.muted }]}>
        {catalogReady ? `${listing.total.toLocaleString()} results` : 'Loading catalog…'} · page {listing.page} of{' '}
        {listing.pageCount}
      </Text>
      <FlatList
        ref={listRef}
        data={listing.products}
        keyExtractor={(p) => p.code}
        numColumns={2}
        columnWrapperStyle={styles.wrap}
        contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 12, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => <ProductCard product={item} onPress={() => openProduct(item.code)} />}
        ListEmptyComponent={
          !catalogReady ? (
            <View style={styles.skelGrid}>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </View>
          ) : (
            <EmptyState
              icon="search-outline"
              title={submitted ? 'No matching pieces' : 'Search the catalog'}
              body={
                submitted
                  ? 'Try a product code, sport, or a shorter name.'
                  : 'Search by name, SKU code, or category. 24 results per page.'
              }
            />
          )
        }
        ListFooterComponent={
          listing.pageCount > 1 ? (
            <View style={styles.pager}>
              <Pressable
                disabled={page <= 1}
                onPress={() => {
                  hapticTap();
                  setPage((p) => Math.max(1, p - 1));
                }}
                style={[styles.pageBtn, { opacity: page <= 1 ? 0.4 : 1, backgroundColor: theme.surface }]}
              >
                <Text style={{ color: theme.text, fontWeight: '700' }}>Prev</Text>
              </Pressable>
              <Text style={{ color: theme.muted }}>
                {listing.page}/{listing.pageCount} · {LISTING_PAGE_SIZE}/page
              </Text>
              <Pressable
                disabled={page >= listing.pageCount}
                onPress={() => {
                  hapticTap();
                  setPage((p) => Math.min(listing.pageCount, p + 1));
                }}
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
  chips: { paddingHorizontal: 16, gap: 8, paddingVertical: 8, alignItems: 'center' },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, minHeight: 36, justifyContent: 'center' },
  meta: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  wrap: { justifyContent: 'space-between' },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, minHeight: 44, justifyContent: 'center' },
  skelGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: 8 },
});

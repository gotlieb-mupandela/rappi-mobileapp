import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LISTING_PAGE_SIZE, categoryBySlug, subcategoryLabel } from '../catalog';
import { buildListing, productsByCategory } from '../products';
import { ProductCard } from '../components/ProductCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { useStore } from '../store';

export function CategoryHubScreen({ slug }: { slug: string }) {
  const { theme, catalog, openProduct } = useStore();
  const cat = categoryBySlug(slug);
  const [sub, setSub] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const listing = useMemo(
    () => buildListing(catalog, { cat: slug, sub, page }),
    [catalog, slug, sub, page],
  );

  const subs = useMemo(() => {
    const items = productsByCategory(catalog, slug);
    const map = new Map<string, number>();
    for (const p of items) map.set(p.subcategory, (map.get(p.subcategory) ?? 0) + 1);
    return [...map.entries()]
      .map(([s, count]) => ({ slug: s, name: subcategoryLabel(s), count }))
      .sort((a, b) => b.count - a.count);
  }, [catalog, slug]);

  const header = (
    <View>
      <ScreenHeader title={cat?.name ?? slug} />
      <Text style={[styles.blurb, { color: theme.muted }]}>
        {cat?.blurb} · {listing.total.toLocaleString()} pieces
      </Text>
      <FlatList
        data={[{ slug: undefined, name: 'All', count: productsByCategory(catalog, slug).length }, ...subs]}
        keyExtractor={(s) => s.slug ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => {
          const active = (item.slug ?? undefined) === sub;
          return (
            <Pressable
              onPress={() => {
                setSub(item.slug);
                setPage(1);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: active ? theme.accent : theme.border,
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
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <FlatList
        data={listing.products}
        keyExtractor={(p) => p.code}
        numColumns={2}
        columnWrapperStyle={styles.wrap}
        contentContainerStyle={{ paddingBottom: 28 }}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => openProduct(item.code)} />
        )}
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
                {listing.page} / {listing.pageCount} · {LISTING_PAGE_SIZE}/page
              </Text>
              <Pressable
                disabled={page >= listing.pageCount}
                onPress={() => setPage((p) => p + 1)}
                style={[styles.pageBtn, { opacity: page >= listing.pageCount ? 0.4 : 1, backgroundColor: theme.accent }]}
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
  blurb: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 13, lineHeight: 18 },
  chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  wrap: { paddingHorizontal: 12, justifyContent: 'space-between' },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
});

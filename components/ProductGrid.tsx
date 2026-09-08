import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../lib/types';
import { PAGE_SIZE } from '../lib/catalog';
import { colors, font, spacing } from '../theme/tokens';
import { ProductCard } from './ProductCard';

/**
 * Renders a large product set as a paginated 2-column grid. Only `visibleCount`
 * items are ever mounted — we page in more on scroll, so an 11k catalog never
 * lands in a single FlatList render.
 */
export function ProductGrid({
  data,
  pageSize = PAGE_SIZE,
  ListHeaderComponent,
  emptyText = 'No products found.',
  testID,
}: {
  data: Product[];
  pageSize?: number;
  ListHeaderComponent?: React.ReactElement;
  emptyText?: string;
  testID?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [data, pageSize]);

  const visible = useMemo(() => data.slice(0, visibleCount), [data, visibleCount]);
  const hasMore = visibleCount < data.length;

  return (
    <FlatList
      testID={testID}
      data={visible}
      key="grid-2col"
      numColumns={2}
      keyExtractor={(p) => p.code}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={({ item }) => <ProductCard product={item} style={styles.card} />}
      onEndReachedThreshold={0.6}
      onEndReached={() => hasMore && setVisibleCount((c) => c + pageSize)}
      ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      ListFooterComponent={
        hasMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.footerText}>
              Showing {visible.length} of {data.length}
            </Text>
          </View>
        ) : data.length ? (
          <Text style={styles.footerText}>{data.length} products</Text>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 120 },
  row: { gap: spacing.md, marginBottom: spacing.md },
  card: { flex: 1 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: spacing.xxl, fontSize: 15 },
  footer: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm },
  footerText: {
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
    fontSize: 12,
    fontWeight: font.semibold,
  },
});

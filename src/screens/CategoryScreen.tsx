import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AUDIENCES, CATEGORIES } from '../catalog';
import { hapticTap } from '../haptics';
import { categoryCounts, sampleForCategory } from '../products';
import { ProductImage } from '../components/ProductImage';
import { useStore } from '../store';
import { radius } from '../theme';

export function CategoryScreen() {
  const { theme, catalog, push } = useStore();
  const counts = useMemo(() => categoryCounts(catalog), [catalog]);
  const live = CATEGORIES.filter((c) => (counts.get(c.slug) ?? 0) > 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>Category</Text>
      <Text style={[styles.sub, { color: theme.muted }]}>
        Shop by sport, collection, and audience. {catalog.length.toLocaleString()} pieces in N$.
      </Text>

      <Text style={[styles.section, { color: theme.text }]}>Men, Women & Kids</Text>
      <View style={styles.row3}>
        {AUDIENCES.map((a) => (
          <Pressable
            key={a.slug}
            onPress={() => {
              hapticTap();
              push({ key: 'search', audience: a.slug });
            }}
            style={({ pressed }) => [
              styles.aud,
              { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
            ]}
            testID={`audience-${a.slug}`}
          >
            <Text style={[styles.audName, { color: theme.text }]}>{a.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.grid}>
        {live.map((c) => {
          const sample = sampleForCategory(catalog, c.slug);
          return (
            <Pressable
              key={c.slug}
              onPress={() => {
                hapticTap();
                push({ key: 'categoryHub', slug: c.slug });
              }}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.shadow, opacity: pressed ? 0.88 : 1 },
              ]}
              testID={`category-${c.slug}`}
            >
              <View style={[styles.tileImg, { backgroundColor: theme.mediaBg }]}>
                <ProductImage uri={sample?.imageUrl} height={110} />
              </View>
              <Text style={[styles.tileName, { color: theme.text }]} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={[styles.tileCount, { color: theme.muted }]}>
                {counts.get(c.slug) ?? 0} pieces
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900' },
  sub: { marginTop: 6, fontSize: 14, lineHeight: 20 },
  section: { marginTop: 22, fontSize: 16, fontWeight: '800' },
  row3: { flexDirection: 'row', gap: 8, marginTop: 12 },
  aud: {
    flex: 1,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  audName: { fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 },
  tile: {
    width: '48%',
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  tileImg: { height: 110, borderRadius: radius.md, overflow: 'hidden' },
  tileName: { marginTop: 10, fontWeight: '800' },
  tileCount: { marginTop: 2, fontSize: 12 },
});

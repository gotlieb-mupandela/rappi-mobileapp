import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCatalog } from '../../context/CatalogProvider';
import { useCart } from '../../context/CartProvider';
import { categoryTiles, newArrivals } from '../../lib/catalog';
import { colors, font, radius, spacing } from '../../theme/tokens';
import { Logo } from '../../components/Logo';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { SectionTitle } from '../../components/ui';

const banner = require('../../assets/brand/rappi-banner.png');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products, loading, source } = useCatalog();
  const { count } = useCart();

  const arrivals = useMemo(() => newArrivals(products, 12), [products]);
  const tiles = useMemo(() => categoryTiles(products).slice(0, 10), [products]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Logo />
        <Pressable style={styles.cartBtn} onPress={() => router.push('/cart')} testID="home-cart">
          <Ionicons name="cart-outline" size={22} color={colors.text} />
          {count > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{count}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.pad}>
        <SearchBar readOnly onPress={() => router.push('/search')} />
      </View>

      <Pressable style={styles.hero} onPress={() => router.push('/listing')}>
        <Image source={banner} style={styles.heroImg} contentFit="cover" />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroKicker}>EQUIP · PERFORM · INSPIRE</Text>
          <Text style={styles.heroTitle}>GEAR UP FOR{'\n'}THE NEW SEASON</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Shop the drop</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.onAccent} />
          </View>
        </View>
      </Pressable>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.loadingText}>Loading the full catalog…</Text>
        </View>
      ) : (
        <View style={styles.pad}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {tiles.map((t) => (
              <Pressable
                key={t.slug}
                style={styles.catChip}
                onPress={() => router.push(`/listing?cat=${t.slug}`)}
                testID={`home-cat-${t.slug}`}
              >
                <Text style={styles.catChipText}>{t.name}</Text>
                <Text style={styles.catChipCount}>{t.count}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionTitle
            right={
              <Pressable onPress={() => router.push('/listing')}>
                <Text style={styles.viewAll}>View all ›</Text>
              </Pressable>
            }
          >
            New Arrivals
          </SectionTitle>

          <View style={styles.grid}>
            {arrivals.map((p) => (
              <View key={p.code} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>

          {source === 'fallback' && (
            <Text style={styles.offline}>Offline sample catalog (network unavailable)</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: colors.onAccent, fontSize: 11, fontWeight: font.black },
  pad: { paddingHorizontal: spacing.lg },
  hero: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImg: { width: '100%', height: 190 },
  heroOverlay: { position: 'absolute', left: 0, top: 0, bottom: 0, padding: spacing.lg, justifyContent: 'center' },
  heroKicker: { color: colors.accent, fontSize: 11, fontWeight: font.black, letterSpacing: 2 },
  heroTitle: { color: colors.text, fontSize: 24, fontWeight: font.black, marginTop: 6, lineHeight: 26 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  heroCtaText: { color: colors.onAccent, fontWeight: font.black, fontSize: 13 },
  loading: { paddingVertical: spacing.xxl * 2, alignItems: 'center', gap: spacing.md },
  loadingText: { color: colors.muted, fontSize: 14 },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg, paddingTop: spacing.lg },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  catChipText: { color: colors.textSecondary, fontWeight: font.bold, fontSize: 13 },
  catChipCount: { color: colors.accentDim, fontWeight: font.black, fontSize: 11 },
  viewAll: { color: colors.accent, fontWeight: font.bold, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '47.8%', flexGrow: 1 },
  offline: { color: colors.muted2, fontSize: 12, textAlign: 'center', marginTop: spacing.lg },
});

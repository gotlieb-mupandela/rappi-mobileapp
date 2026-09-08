import { useMemo, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CATEGORIES, HERO_SLIDES, SPOTLIGHT_CODES } from '../catalog';
import { newArrivals, sampleForCategory } from '../products';
import { BrandLogo } from '../components/BrandLogo';
import { HomeSkeleton } from '../components/Skeleton';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useStore } from '../store';
import { hapticTap } from '../haptics';
import { radius } from '../theme';

export function HomeScreen() {
  const { theme, catalog, catalogReady, catalogError, openProduct, openSearch, push } = useStore();
  const [q, setQ] = useState('');
  const [slide, setSlide] = useState(0);
  const [heroW, setHeroW] = useState(398);

  const arrivals = useMemo(() => {
    const spotlight = SPOTLIGHT_CODES.map((c) => catalog.find((p) => p.code === c)).filter(Boolean);
    const rest = newArrivals(catalog, 12).filter((p) => !SPOTLIGHT_CODES.includes(p.code));
    return [...spotlight, ...rest].slice(0, 8);
  }, [catalog]);

  const hubs = useMemo(
    () => CATEGORIES.filter((c) => sampleForCategory(catalog, c.slug)).slice(0, 6),
    [catalog],
  );

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const w = e.nativeEvent.layoutMeasurement.width;
    if (!w) return;
    setSlide(Math.round(e.nativeEvent.contentOffset.x / w));
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      testID="home-scroll"
    >
      <View style={styles.header} testID="home-header">
        <BrandLogo variant="lockup" size="header" />
      </View>

      <SearchBar value={q} onChange={setQ} onSubmit={() => openSearch(q.trim())} />

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onHeroScroll}
        onLayout={(e) => setHeroW(Math.round(e.nativeEvent.layout.width))}
        style={styles.heroPager}
        testID="home-hero"
      >
        {HERO_SLIDES.map((h) => (
          <Pressable
            key={h.id}
            style={({ pressed }) => [styles.hero, { width: heroW, backgroundColor: '#0B0B0B', opacity: pressed ? 0.92 : 1 }]}
            onPress={() => {
              hapticTap();
              push({ key: 'categoryHub', slug: h.cat });
            }}
            accessibilityRole="button"
            accessibilityLabel={h.title}
          >
            <Image source={h.image} style={styles.fill} resizeMode="cover" />
            <View style={[styles.heroShade, { backgroundColor: theme.heroOverlay }]} />
            <Text style={styles.heroTitle}>{h.title}</Text>
            <Text style={styles.heroSub}>{h.subtitle}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {HERO_SLIDES.map((h, i) => (
          <View
            key={h.id}
            style={[
              styles.dot,
              { backgroundColor: i === slide ? theme.accent : theme.borderStrong },
            ]}
          />
        ))}
      </View>

      {catalogError ? (
        <Text style={[styles.loading, { color: theme.danger }]}>{catalogError}</Text>
      ) : null}

      <View style={styles.sectionHead}>
        <Text style={[styles.section, { color: theme.text }]}>Shop</Text>
        <Pressable
          onPress={() => {
            hapticTap();
            openSearch('');
          }}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={{ color: theme.accent, fontWeight: '700' }}>Browse all ›</Text>
        </Pressable>
      </View>

      {!catalogReady ? (
        <HomeSkeleton />
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hubRow}>
            {hubs.map((h) => {
              const sample = sampleForCategory(catalog, h.slug);
              return (
                <Pressable
                  key={h.slug}
                  onPress={() => {
                    hapticTap();
                    push({ key: 'categoryHub', slug: h.slug });
                  }}
                  style={({ pressed }) => [
                    styles.hub,
                    { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.shadow, opacity: pressed ? 0.88 : 1 },
                  ]}
                  testID={`hub-${h.slug}`}
                >
                  <View style={styles.hubImg}>
                    <ProductImage uri={sample?.imageUrl} height={88} />
                  </View>
                  <Text style={[styles.hubName, { color: theme.text }]} numberOfLines={1}>
                    {h.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={[styles.section, { color: theme.text, marginTop: 8 }]}>New Arrivals</Text>
          <View style={styles.grid}>
            {arrivals.map((p) =>
              p ? (
                <ProductCard key={p.code} product={p} onPress={() => openProduct(p.code)} />
              ) : null,
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 36 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 76,
    marginBottom: 12,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  heroPager: { marginTop: 16, height: 168, borderRadius: radius.xl, overflow: 'hidden' },
  hero: {
    height: 168,
    borderRadius: radius.xl,
    padding: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  fill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900', zIndex: 1 },
  heroSub: { color: '#E8E8E8', marginTop: 4, zIndex: 1, fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  loading: { textAlign: 'center', marginTop: 12, fontSize: 13 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 },
  section: { fontSize: 20, fontWeight: '900' },
  hubRow: { gap: 10, paddingVertical: 12 },
  hub: {
    width: 120,
    borderRadius: radius.lg,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  hubImg: { height: 88, borderRadius: radius.md, overflow: 'hidden' },
  hubName: { marginTop: 8, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
});

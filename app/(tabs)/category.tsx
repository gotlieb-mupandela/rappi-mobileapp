import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCatalog } from '../../context/CatalogProvider';
import { AUDIENCES, categoryTiles } from '../../lib/catalog';
import { colors, font, radius, spacing } from '../../theme/tokens';

const AUD_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  men: 'man-outline',
  women: 'woman-outline',
  kids: 'happy-outline',
};

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products, loading } = useCatalog();
  const tiles = useMemo(() => categoryTiles(products), [products]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + spacing.md }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.h1}>Categories</Text>

      <Text style={styles.section}>Shop by</Text>
      <View style={styles.audRow}>
        {AUDIENCES.map((a) => (
          <Pressable
            key={a.slug}
            style={styles.audCard}
            onPress={() => router.push(`/listing?audience=${a.slug}`)}
            testID={`cat-aud-${a.slug}`}
          >
            <Ionicons name={AUD_ICON[a.slug]} size={26} color={colors.accent} />
            <Text style={styles.audText}>{a.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Sport hubs</Text>
      {loading ? (
        <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: spacing.xxl }} />
      ) : (
        <View style={styles.grid}>
          {tiles.map((t) => (
            <Pressable
              key={t.slug}
              style={styles.tile}
              onPress={() => router.push(`/listing?cat=${t.slug}`)}
              testID={`cat-tile-${t.slug}`}
            >
              <Image source={{ uri: t.sample?.imageUrl }} style={styles.tileImg} contentFit="cover" />
              <View style={styles.tileOverlay}>
                <Text style={styles.tileName}>{t.name}</Text>
                <Text style={styles.tileCount}>{t.count} items</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  h1: {
    color: colors.text,
    fontSize: 26,
    fontWeight: font.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  section: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  audRow: { flexDirection: 'row', gap: spacing.md },
  audCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  audText: { color: colors.text, fontWeight: font.black, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47.8%',
    flexGrow: 1,
    height: 120,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
  },
  tileImg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.55 },
  tileOverlay: { padding: spacing.md, backgroundColor: 'rgba(11,11,11,0.55)' },
  tileName: { color: colors.text, fontWeight: font.black, fontSize: 15, textTransform: 'uppercase' },
  tileCount: { color: colors.accent, fontWeight: font.bold, fontSize: 11 },
});

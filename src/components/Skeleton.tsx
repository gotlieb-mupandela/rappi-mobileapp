import { StyleSheet, View } from 'react-native';
import { useStore } from '../store';
import { radius } from '../theme';

export function SkeletonBox({
  height,
  width = '100%',
  r = radius.md,
}: {
  height: number;
  width?: number | `${number}%`;
  r?: number;
}) {
  const { theme } = useStore();
  return (
    <View
      style={{
        height,
        width,
        borderRadius: r,
        backgroundColor: theme.surface2,
        opacity: 0.7,
      }}
    />
  );
}

export function ProductCardSkeleton() {
  const { theme } = useStore();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <SkeletonBox height={160} />
      <View style={{ height: 10 }} />
      <SkeletonBox height={14} width="88%" />
      <View style={{ height: 8 }} />
      <SkeletonBox height={12} width="50%" />
      <View style={{ height: 10 }} />
      <SkeletonBox height={16} width="40%" />
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View>
      <View style={styles.hubs}>
        <SkeletonBox height={120} width={120} r={radius.lg} />
        <SkeletonBox height={120} width={120} r={radius.lg} />
        <SkeletonBox height={120} width={120} r={radius.lg} />
      </View>
      <View style={styles.grid}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
  },
  hubs: { flexDirection: 'row', gap: 10, paddingVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
});

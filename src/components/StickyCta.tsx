import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStore } from '../store';
import { useAppInsets } from '../useInsets';

export function StickyCta({ children }: { children: ReactNode }) {
  const { theme, current } = useStore();
  const insets = useAppInsets();
  const tabsVisible = current.key === 'tabs';
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.chrome,
          borderTopColor: theme.border,
          paddingBottom: 12 + (tabsVisible ? 0 : insets.bottom),
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

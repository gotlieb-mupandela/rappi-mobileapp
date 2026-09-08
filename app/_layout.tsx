import React from 'react';
import 'react-native-gesture-handler';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { colors } from '../theme/tokens';
import { CatalogProvider } from '../context/CatalogProvider';
import { CartProvider } from '../context/CartProvider';
import { OrdersProvider } from '../context/OrdersProvider';
import { AuthProvider } from '../context/AuthProvider';

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.bg,
    ...Platform.select({
      web: { maxWidth: 480, alignSelf: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
      default: {},
    }),
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CatalogProvider>
            <CartProvider>
              <OrdersProvider>
                <StatusBar style="light" />
                <View style={styles.frame}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: colors.bg },
                      animation: 'slide_from_right',
                    }}
                  >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="product/[code]" />
                    <Stack.Screen name="search" />
                    <Stack.Screen name="listing" />
                    <Stack.Screen name="checkout" />
                    <Stack.Screen name="order-confirmation" />
                    <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name="settings" />
                  </Stack>
                </View>
              </OrdersProvider>
            </CartProvider>
          </CatalogProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

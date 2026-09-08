import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { colors } from '../theme/tokens';
import { CatalogProvider } from '../context/CatalogProvider';
import { CartProvider } from '../context/CartProvider';
import { OrdersProvider } from '../context/OrdersProvider';
import { AuthProvider } from '../context/AuthProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CatalogProvider>
            <CartProvider>
              <OrdersProvider>
                <StatusBar style="light" />
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
              </OrdersProvider>
            </CartProvider>
          </CatalogProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

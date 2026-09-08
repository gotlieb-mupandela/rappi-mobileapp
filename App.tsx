import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { TabBar } from './src/components/TabBar';
import { StoreProvider, useStore } from './src/store';
import { PHONE_WIDTH } from './src/theme';
import { useAppInsets } from './src/useInsets';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { CategoryHubScreen } from './src/screens/CategoryHubScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { MeScreen } from './src/screens/MeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import {
  AddressesScreen,
  ConfirmationScreen,
  FavoritesScreen,
  NotificationsScreen,
} from './src/screens/AccountExtras';

function TabBody() {
  const { tab } = useStore();
  if (tab === 'category') return <CategoryScreen />;
  if (tab === 'cart') return <CartScreen />;
  if (tab === 'me') return <MeScreen />;
  return <HomeScreen />;
}

function StackBody() {
  const { current } = useStore();
  switch (current.key) {
    case 'search':
      return (
        <SearchScreen
          initialQ={current.q}
          cat={current.cat}
          audience={current.audience}
          sub={current.sub}
        />
      );
    case 'categoryHub':
      return <CategoryHubScreen slug={current.slug} />;
    case 'product':
      return <ProductScreen code={current.code} />;
    case 'checkout':
      return <CheckoutScreen />;
    case 'confirmation':
      return <ConfirmationScreen orderId={current.orderId} />;
    case 'auth':
      return <AuthScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'orders':
      return <OrdersScreen />;
    case 'order':
      return <OrdersScreen focusId={current.orderId} />;
    case 'favorites':
      return <FavoritesScreen />;
    case 'addresses':
      return <AddressesScreen />;
    case 'notifications':
      return <NotificationsScreen />;
    default:
      return <TabBody />;
  }
}

function ToastHost() {
  const { toast, theme } = useStore();
  if (!toast) return null;
  return (
    <View
      style={[
        styles.toast,
        {
          backgroundColor: toast.kind === 'err' ? theme.danger : theme.text,
          pointerEvents: 'none',
        },
      ]}
    >
      <Text style={{ color: toast.kind === 'err' ? '#fff' : theme.bg, fontWeight: '800' }}>{toast.text}</Text>
    </View>
  );
}

function Shell() {
  const { theme, themeName, current } = useStore();
  const insets = useAppInsets();
  const showTabs = current.key === 'tabs';
  return (
    <View
      style={[
        styles.safe,
        {
          backgroundColor: Platform.OS === 'web' ? '#111' : theme.bg,
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <View style={[styles.frame, { backgroundColor: theme.bg }]}>
          <View style={styles.body}>
            <StackBody />
          </View>
          {showTabs ? <TabBar /> : null}
          <ToastHost />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: PHONE_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  body: { flex: 1 },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 96,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});

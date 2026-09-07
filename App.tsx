import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { categories, restaurants, type MenuItem, type Restaurant } from './src/data';
import { colors, spacing } from './src/theme';

type CartLine = { item: MenuItem; qty: number };
type Cart = Record<string, CartLine>;

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, line) => sum + line.qty, 0),
    [cart],
  );
  const cartTotal = useMemo(
    () => Object.values(cart).reduce((sum, line) => sum + line.qty * line.item.price, 0),
    [cart],
  );

  const visibleRestaurants = useMemo(
    () =>
      activeCategory === 'All'
        ? restaurants
        : restaurants.filter((r) => r.category === activeCategory),
    [activeCategory],
  );

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return { ...prev, [item.id]: { item, qty: existing ? existing.qty + 1 : 1 } };
    });
  };

  const removeFromCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: { item, qty: existing.qty - 1 } };
    });
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart({});
  };

  const closeCart = () => {
    setShowCart(false);
    setOrderPlaced(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.frame}>

      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Deliver to</Text>
          <Text style={styles.headerLocation} accessibilityRole="header">
            📍 Home · Calle 93 #11-27
          </Text>
        </View>
        <Pressable
          style={styles.cartButton}
          onPress={() => setShowCart(true)}
          accessibilityRole="button"
          accessibilityLabel={`Open cart, ${cartCount} items`}
          testID="open-cart"
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {selectedRestaurant ? (
        <RestaurantScreen
          restaurant={selectedRestaurant}
          cart={cart}
          onBack={() => setSelectedRestaurant(null)}
          onAdd={addToCart}
          onRemove={removeFromCart}
        />
      ) : (
        <HomeScreen
          restaurants={visibleRestaurants}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onSelectRestaurant={setSelectedRestaurant}
        />
      )}

      {cartCount > 0 && !showCart && (
        <Pressable style={styles.floatingBar} onPress={() => setShowCart(true)} testID="view-cart-bar">
          <Text style={styles.floatingBarText}>
            {cartCount} item{cartCount > 1 ? 's' : ''}
          </Text>
          <Text style={styles.floatingBarText}>View cart · ${cartTotal.toFixed(2)}</Text>
        </Pressable>
      )}

      {showCart && (
        <CartScreen
          cart={cart}
          total={cartTotal}
          orderPlaced={orderPlaced}
          onClose={closeCart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onPlaceOrder={placeOrder}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({
  restaurants: list,
  activeCategory,
  onSelectCategory,
  onSelectRestaurant,
}: {
  restaurants: Restaurant[];
  activeCategory: string;
  onSelectCategory: (c: string) => void;
  onSelectRestaurant: (r: Restaurant) => void;
}) {
  return (
    <FlatList
      data={list}
      keyExtractor={(r) => r.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View>
          <Text style={styles.sectionTitle}>What are you craving?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {categories.map((c) => {
              const active = c === activeCategory;
              return (
                <Pressable
                  key={c}
                  onPress={() => onSelectCategory(c)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`chip-${c}`}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.sectionTitle}>Restaurants near you</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => onSelectRestaurant(item)}
          testID={`restaurant-${item.id}`}
        >
          <View style={[styles.cardThumb, { backgroundColor: item.color }]}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>{item.category}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardRating}>⭐ {item.rating.toFixed(1)}</Text>
              <Text style={styles.cardMeta}>· {item.deliveryMinutes} min</Text>
              <Text style={styles.cardMeta}>· ${item.deliveryFee.toFixed(2)} delivery</Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

function RestaurantScreen({
  restaurant,
  cart,
  onBack,
  onAdd,
  onRemove,
}: {
  restaurant: Restaurant;
  cart: Cart;
  onBack: () => void;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.listContent}>
      <Pressable onPress={onBack} style={styles.backButton} testID="back-button">
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>
      <View style={[styles.hero, { backgroundColor: restaurant.color }]}>
        <Text style={styles.heroEmoji}>{restaurant.emoji}</Text>
      </View>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardRating}>⭐ {restaurant.rating.toFixed(1)}</Text>
        <Text style={styles.cardMeta}>· {restaurant.deliveryMinutes} min</Text>
        <Text style={styles.cardMeta}>· ${restaurant.deliveryFee.toFixed(2)} delivery</Text>
      </View>

      <Text style={styles.sectionTitle}>Menu</Text>
      {restaurant.menu.map((item) => {
        const qty = cart[item.id]?.qty ?? 0;
        return (
          <View key={item.id} style={styles.menuItem} testID={`menu-item-${item.id}`}>
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDesc}>{item.description}</Text>
              <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
            </View>
            {qty === 0 ? (
              <Pressable
                style={styles.addButton}
                onPress={() => onAdd(item)}
                testID={`add-${item.id}`}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            ) : (
              <View style={styles.stepper}>
                <Pressable style={styles.stepBtn} onPress={() => onRemove(item)} testID={`minus-${item.id}`}>
                  <Text style={styles.stepBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepQty} testID={`qty-${item.id}`}>{qty}</Text>
                <Pressable style={styles.stepBtn} onPress={() => onAdd(item)} testID={`plus-${item.id}`}>
                  <Text style={styles.stepBtnText}>+</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function CartScreen({
  cart,
  total,
  orderPlaced,
  onClose,
  onAdd,
  onRemove,
  onPlaceOrder,
}: {
  cart: Cart;
  total: number;
  orderPlaced: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
  onPlaceOrder: () => void;
}) {
  const lines = Object.values(cart);
  const deliveryFee = lines.length > 0 ? 1.99 : 0;

  return (
    <View style={styles.cartOverlay}>
      <View style={styles.cartSheet}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Your cart</Text>
          <Pressable onPress={onClose} testID="close-cart">
            <Text style={styles.cartClose}>✕</Text>
          </Pressable>
        </View>

        {orderPlaced ? (
          <View style={styles.orderConfirm} testID="order-confirmation">
            <Text style={styles.orderEmoji}>🎉</Text>
            <Text style={styles.orderTitle}>Order placed!</Text>
            <Text style={styles.orderSub}>Your food is on the way.</Text>
            <Pressable style={styles.doneButton} onPress={onClose} testID="done-button">
              <Text style={styles.checkoutText}>Done</Text>
            </Pressable>
          </View>
        ) : lines.length === 0 ? (
          <View style={styles.orderConfirm}>
            <Text style={styles.orderEmoji}>🛒</Text>
            <Text style={styles.orderSub}>Your cart is empty.</Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.cartList}>
              {lines.map(({ item, qty }) => (
                <View key={item.id} style={styles.cartLine} testID={`cart-line-${item.id}`}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <Text style={styles.menuPrice}>${(item.price * qty).toFixed(2)}</Text>
                  </View>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepBtn} onPress={() => onRemove(item)}>
                      <Text style={styles.stepBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.stepQty}>{qty}</Text>
                    <Pressable style={styles.stepBtn} onPress={() => onAdd(item)}>
                      <Text style={styles.stepBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue} testID="cart-total">
                ${(total + deliveryFee).toFixed(2)}
              </Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={onPlaceOrder} testID="place-order">
              <Text style={styles.checkoutText}>Place order</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  frame: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: { color: '#FFD9CE', fontSize: 12, fontWeight: '600' },
  headerLocation: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2 },
  cartButton: { padding: spacing.sm },
  cartIcon: { fontSize: 26 },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  listContent: { padding: spacing.lg, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 36 },
  cardBody: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textMuted },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  cardRating: { fontSize: 13, color: colors.text, fontWeight: '700' },
  backButton: { paddingVertical: spacing.sm },
  backText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  hero: {
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  heroEmoji: { fontSize: 72 },
  restaurantName: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: spacing.md },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuEmoji: { fontSize: 32 },
  menuInfo: { flex: 1, marginLeft: spacing.md },
  menuName: { fontSize: 15, fontWeight: '700', color: colors.text },
  menuDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  menuPrice: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 4 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  addButtonText: { color: '#FFFFFF', fontWeight: '800' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', lineHeight: 20 },
  stepQty: { fontSize: 16, fontWeight: '800', minWidth: 20, textAlign: 'center' },
  floatingBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingBarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  cartOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  cartSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
  cartClose: { fontSize: 20, color: colors.textMuted, padding: spacing.xs },
  cartList: { marginTop: spacing.md },
  cartLine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 15 },
  summaryValue: { color: colors.text, fontSize: 15, fontWeight: '600' },
  summaryTotalLabel: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: spacing.xs },
  summaryTotalValue: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: spacing.xs },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  checkoutText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  orderConfirm: { alignItems: 'center', paddingVertical: spacing.xl * 2 },
  orderEmoji: { fontSize: 56 },
  orderTitle: { fontSize: 22, fontWeight: '900', color: colors.text, marginTop: spacing.md },
  orderSub: { fontSize: 15, color: colors.textMuted, marginTop: spacing.xs },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});

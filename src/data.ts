export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  emoji: string;
  color: string;
  rating: number;
  deliveryMinutes: number;
  deliveryFee: number;
  menu: MenuItem[];
};

export const categories = ['All', 'Fast Food', 'Sushi', 'Healthy', 'Coffee', 'Dessert'];

export const restaurants: Restaurant[] = [
  {
    id: 'burger-town',
    name: 'Burger Town',
    category: 'Fast Food',
    emoji: '🍔',
    color: '#FFE3D6',
    rating: 4.7,
    deliveryMinutes: 20,
    deliveryFee: 1.99,
    menu: [
      { id: 'bt-1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, pickles', price: 8.5, emoji: '🍔' },
      { id: 'bt-2', name: 'Crispy Fries', description: 'Golden, sea-salted', price: 3.5, emoji: '🍟' },
      { id: 'bt-3', name: 'Chocolate Shake', description: 'Thick and creamy', price: 4.0, emoji: '🥤' },
    ],
  },
  {
    id: 'sakura-sushi',
    name: 'Sakura Sushi',
    category: 'Sushi',
    emoji: '🍣',
    color: '#DCEBFF',
    rating: 4.9,
    deliveryMinutes: 30,
    deliveryFee: 2.99,
    menu: [
      { id: 'ss-1', name: 'Salmon Nigiri (4pc)', description: 'Fresh Atlantic salmon', price: 9.0, emoji: '🍣' },
      { id: 'ss-2', name: 'California Roll', description: 'Crab, avocado, cucumber', price: 7.5, emoji: '🍱' },
      { id: 'ss-3', name: 'Miso Soup', description: 'Tofu and seaweed', price: 3.0, emoji: '🍜' },
    ],
  },
  {
    id: 'green-bowl',
    name: 'Green Bowl',
    category: 'Healthy',
    emoji: '🥗',
    color: '#DDF5E4',
    rating: 4.6,
    deliveryMinutes: 25,
    deliveryFee: 2.49,
    menu: [
      { id: 'gb-1', name: 'Quinoa Power Bowl', description: 'Quinoa, chickpeas, avocado', price: 10.5, emoji: '🥗' },
      { id: 'gb-2', name: 'Green Smoothie', description: 'Spinach, banana, mango', price: 5.5, emoji: '🥤' },
      { id: 'gb-3', name: 'Avocado Toast', description: 'Sourdough, poached egg', price: 7.0, emoji: '🥑' },
    ],
  },
  {
    id: 'daily-grind',
    name: 'Daily Grind',
    category: 'Coffee',
    emoji: '☕',
    color: '#EFE3D6',
    rating: 4.8,
    deliveryMinutes: 15,
    deliveryFee: 1.49,
    menu: [
      { id: 'dg-1', name: 'Flat White', description: 'Double shot, silky milk', price: 4.2, emoji: '☕' },
      { id: 'dg-2', name: 'Blueberry Muffin', description: 'Baked fresh daily', price: 3.2, emoji: '🧁' },
      { id: 'dg-3', name: 'Cold Brew', description: 'Steeped 18 hours', price: 4.5, emoji: '🥤' },
    ],
  },
  {
    id: 'sweet-spot',
    name: 'Sweet Spot',
    category: 'Dessert',
    emoji: '🍰',
    color: '#FBDDEB',
    rating: 4.5,
    deliveryMinutes: 22,
    deliveryFee: 2.29,
    menu: [
      { id: 'sp-1', name: 'Red Velvet Slice', description: 'Cream cheese frosting', price: 6.0, emoji: '🍰' },
      { id: 'sp-2', name: 'Glazed Donut', description: 'Classic ring donut', price: 2.5, emoji: '🍩' },
      { id: 'sp-3', name: 'Ice Cream Cup', description: 'Vanilla bean', price: 4.0, emoji: '🍨' },
    ],
  },
];

export type CategoryDef = {
  slug: string;
  name: string;
  nav?: string;
  featured?: boolean;
  blurb: string;
};

export const CATEGORIES: CategoryDef[] = [
  { slug: 'sportswear', name: 'Sportswear', featured: true, blurb: 'Tees, shorts, tracksuits, hoodies, jackets, and training layers.' },
  { slug: 'football', name: 'Football', featured: true, blurb: 'Boots, sets, balls, socks, shin guards, and keeper gloves.' },
  { slug: 'basketball', name: 'Basketball', blurb: 'Shoes, jerseys, shorts, and match sets.' },
  { slug: 'netball', name: 'Netball', blurb: 'Dresses, skirts, and court shoes.' },
  { slug: 'swimming', name: 'Swimming', blurb: 'Swimwear, caps, and goggles.' },
  { slug: 'rugby', name: 'Rugby', blurb: 'Jerseys, shorts, balls, scrum caps, and protection.' },
  { slug: 'cricket', name: 'Cricket', blurb: 'Match whites and cricket clothing.' },
  { slug: 'boxing', name: 'Boxing', blurb: 'Combat training shorts for the gym and the ring.' },
  { slug: 'hockey', name: 'Hockey', blurb: 'Field hockey footwear from the current catalog.' },
  { slug: 'running-fitness', name: 'Running & Fitness', nav: 'Running', featured: true, blurb: 'Running layers, gym kit, and training accessories.' },
  { slug: 'brama', name: 'Brama', blurb: 'Brama skins, tights, and base layers.' },
  { slug: 'padel', name: 'Padel', blurb: 'Padel apparel, court shoes, and rackets.' },
  { slug: 'hiking', name: 'Hiking', blurb: 'Outdoor trousers, jackets, and trail footwear.' },
  { slug: 'resort', name: 'Resort', blurb: 'Resort polos, travel layers, and easy weekend kit.' },
  { slug: 'lifestyle', name: 'Lifestyle', blurb: 'Lifestyle sneakers and everyday court-to-street pairs.' },
  { slug: 'teampro-2026', name: 'Teampro 2026', nav: 'Teampro', blurb: '2026 team and Mundial collection shirts.' },
  { slug: 'shoes', name: 'Shoes', featured: true, blurb: 'Sneakers, running, court, kids, sandals, and barefoot.' },
  { slug: 'balls-bags', name: 'Balls & Bags', blurb: 'Match balls, kit bags, backpacks, and rackets.' },
];

export const SUBCATEGORY_LABELS: Record<string, string> = {
  'tees-men': 'T-Shirts Men',
  'tees-women': 'T-Shirts Women',
  'tees-kids': 'Kids tees',
  tees: 'T-Shirts',
  polos: 'Polos',
  shorts: 'Shorts',
  tracksuits: 'Tracksuits',
  leggings: 'Leggings',
  tights: 'Tights',
  sweatpants: 'Sweatpants',
  pants: 'Pants',
  bras: 'Sports Bras',
  hoodies: 'Hoodies',
  jackets: 'Jackets',
  'jackets-kids': 'Kids Jackets',
  socks: 'Socks',
  caps: 'Caps',
  balls: 'Balls',
  boots: 'Boots',
  'shin-guards': 'Shin Guards',
  'gk-gloves': 'Goalkeeper Gloves',
  sets: 'Sets',
  shoes: 'Shoes',
  sneakers: 'Sneakers',
  sandals: 'Sandals',
  barefoot: 'Barefoot',
  'running-shoes': 'Running shoes',
  'court-shoes': 'Court shoes',
  'kids-shoes': 'Kids shoes',
  jerseys: 'Jerseys',
  dresses: 'Dresses',
  skirts: 'Skirts',
  swimwear: 'Swimwear',
  goggles: 'Goggles',
  'scrum-caps': 'Scrum Caps',
  protection: 'Protection',
  clothing: 'Clothing',
  'training-shoes': 'Training Shoes',
  tops: 'Tops',
  mats: 'Mats',
  towels: 'Towels',
  'equipment-bags': 'Equipment Bags',
  bags: 'Bags',
  'ball-bags': 'Ball Bags',
  rackets: 'Rackets',
  skins: 'Skins',
  accessories: 'Accessories',
  general: 'More',
};

export const AUDIENCES = [
  { slug: 'men', name: 'Men', blurb: 'Men’s kit — tees, shorts, shoes, and match gear.' },
  { slug: 'women', name: 'Women', blurb: 'Women’s kit — training layers, shoes, and court wear.' },
  { slug: 'kids', name: 'Kids', blurb: 'Junior sizes for training, school, and match day.' },
] as const;

export type AudienceSlug = (typeof AUDIENCES)[number]['slug'];

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard (5–8 days)', cost: 100, sort_order: 1 },
  { id: 'express', name: 'Express (2–3 days)', cost: 150, sort_order: 2 },
  { id: 'pickup', name: 'Hub pickup', cost: 0, sort_order: 3 },
] as const;

export function shippingCostById(id: string): number {
  return SHIPPING_METHODS.find((m) => m.id === id)?.cost ?? 0;
}

export const DEMO_EMAIL = 'shop@rappi.com';
export const DEMO_PASSWORD = 'rappi123';
export const TAGLINE = 'GEAR UP. SHOW UP. LEVEL UP.';
export const STORE_NAME = 'RAPPI Sports Hub';

export const SPOTLIGHT_CODES = ['104409.484', 'TOJS2604TF', 'RR300W2680', 'C448S2715'];

export const HERO_SLIDES = [
  {
    id: 'sportswear',
    title: 'Shop sportswear',
    subtitle: 'New season layers for training and match day',
    cat: 'sportswear',
    image: require('../assets/brand/rappi-banner.png'),
  },
  {
    id: 'running',
    title: 'Running & Fitness',
    subtitle: 'Gear that keeps up when you do',
    cat: 'running-fitness',
    image: require('../assets/brand/hero-athlete.png'),
  },
  {
    id: 'football',
    title: 'Football drop',
    subtitle: 'Boots, kits, balls — live stock in N$',
    cat: 'football',
    image: require('../assets/brand/rappi-mark.png'),
  },
];

export const LISTING_PAGE_SIZE = 24;

export const CATALOG_REMOTE_URL =
  'https://raw.githubusercontent.com/gotlieb-mupandela/rappi-webapp/main/data/products.json';

export const STOREFRONT_URL = 'https://rappi-two.vercel.app';

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function subcategoryLabel(slug: string) {
  return SUBCATEGORY_LABELS[slug] ?? slug;
}

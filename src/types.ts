export type Gender = 'men' | 'women' | 'kids' | 'unisex';

export type SizeStock = {
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  displayName: string;
  category: string;
  subcategory: string;
  gender: Gender;
  price: number;
  currency: 'NAD';
  stockQty: number;
  badge: 'new' | 'offer' | null;
  sizeOptions: string[];
  sizes: SizeStock[];
  imageUrl: string;
  images: string[];
  description: string;
};

export type CompactProduct = {
  id: string;
  code: string;
  name: string;
  cat: string;
  sub: string;
  g: string;
  price: number;
  stock: number;
  badge?: 'new' | 'offer' | null;
  img: string;
  imgs: string[];
  sizes: Array<[string, number]>;
};

export type CartLine = {
  code: string;
  size: string;
  qty: number;
};

export type OrderItem = {
  code: string;
  name: string;
  size: string;
  qty: number;
  price: number;
  imageUrl?: string;
};

export type OrderStatus = 'reserved' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  shippingMethod: string;
  shippingCost: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes?: string;
};

export type User = {
  email: string;
  name: string;
  guest?: boolean;
};

export type Address = {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  country: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  cost: number;
  sort_order: number;
};

export type ListingFacet = { slug: string; name: string; count: number };

export type ListingQuery = {
  q?: string;
  cat?: string;
  sub?: string;
  size?: string;
  max?: string;
  audience?: string;
  page?: number;
};

export type ListingResult = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  query: string;
  facets: {
    categories: ListingFacet[];
    audiences: ListingFacet[];
    subs: ListingFacet[];
    sizes: string[];
  };
};

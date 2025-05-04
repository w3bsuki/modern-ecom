// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
  images: string[];
  categories: string[];
  colors: string[];
  sizes: string[];
  isNew: boolean;
  isFeatured: boolean;
  inStock: boolean;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  products: Product[];
  badge?: string;
}

// Order types
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'; 
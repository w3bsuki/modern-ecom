import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

// Define the simplified product type for recently viewed storage
export interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  images: string[]; // Use standard images array
  slug: string;
  category?: string;
  viewedAt: number; // timestamp
}

// Maximum number of products to store
const MAX_RECENT_PRODUCTS = 6;

// Create a store for recently viewed products
interface RecentlyViewedStore {
  products: RecentlyViewedProduct[];
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
  clearProducts: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        set((state) => {
          // Check if product already exists
          const exists = state.products.some((p) => p.id === product.id);
          
          // If it exists, remove it (to add it again at the front)
          const filteredProducts = exists
            ? state.products.filter((p) => p.id !== product.id)
            : state.products;
          
          // Add the product at the front with current timestamp
          const newProduct = { 
            ...product, 
            viewedAt: Date.now() 
          };
          
          // Limit to MAX_RECENT_PRODUCTS
          return {
            products: [newProduct, ...filteredProducts].slice(0, MAX_RECENT_PRODUCTS),
          };
        });
      },
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);

/**
 * Hook to track and manage recently viewed products
 */
export function useRecentlyViewed() {
  const [isMounted, setIsMounted] = useState(false);
  const store = useRecentlyViewedStore();
  
  // Safely access store data only after mount
  const products = isMounted ? store.products : [];
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return {
    products,
    addProduct: store.addProduct,
    clearProducts: store.clearProducts,
  };
}

/**
 * Hook to track a single product view
 * 
 * @param product Product data to track in recently viewed (or null if not available)
 */
export function useTrackProductView(product: Product | null) {
  const { addProduct } = useRecentlyViewed();
  
  useEffect(() => {
    if (product) {
      // Convert from standard Product to RecentlyViewedProduct format
      addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        slug: product.slug,
        category: product.category,
      });
    }
  }, [product, addProduct]);
} 
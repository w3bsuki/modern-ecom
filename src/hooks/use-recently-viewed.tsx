"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

// Define the maximum number of recently viewed products to store
const MAX_RECENTLY_VIEWED = 8;

// Define simplified product data structure to store only what's needed
interface ViewedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface RecentlyViewedState {
  items: ViewedProduct[];
}

interface RecentlyViewedActions {
  addItem: (product: Product) => void;
  clearItems: () => void;
}

type RecentlyViewedStore = RecentlyViewedState & RecentlyViewedActions;

// Create the store with Zustand
export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      
      // Add a product to recently viewed
      addItem: (product) => {
        // Validate input
        if (!product || !product.id) {
          console.error("Cannot add invalid product to recently viewed");
          return;
        }
        
        set((state) => {
          try {
            // Ensure we have a valid items array
            const currentItems = state.items || [];
            
            // Extract only the properties we need
            const viewedProduct: ViewedProduct = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: typeof product.price === 'number' ? product.price : 0,
              salePrice: typeof product.salePrice === 'number' ? product.salePrice : null,
              image: Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0] 
                : "/images/hats/placeholder1.jpg",
              isNew: product.isNew,
              isSale: product.isSale
            };
            
            // Remove the product if it already exists to avoid duplicates
            const filteredItems = currentItems.filter(item => item.id !== product.id);
            
            // Add the new product to the beginning of the array and limit to MAX_RECENTLY_VIEWED
            return { 
              items: [viewedProduct, ...filteredItems].slice(0, MAX_RECENTLY_VIEWED) 
            };
          } catch (err) {
            console.error("Error adding item to recently viewed:", err);
            return state; // Return unchanged state on error
          }
        });
      },
      
      // Clear all recently viewed products
      clearItems: () => {
        set({ items: [] });
      },
    }),
    {
      name: "recently-viewed-storage",
      version: 1,
      // Add extra safety for SSR
      skipHydration: typeof window === 'undefined',
    }
  )
);

// Create selector hooks for better performance
export const useRecentlyViewedItems = () => useRecentlyViewed(state => state.items);
export const useRecentlyViewedActions = () => {
  const { addItem, clearItems } = useRecentlyViewed();
  return { addItem, clearItems };
}; 
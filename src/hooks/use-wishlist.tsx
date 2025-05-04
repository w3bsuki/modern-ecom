"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  isInitialized: boolean;
}

interface WishlistActions {
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Product) => void;
  clearWishlist: () => void;
  setInitialized: (value: boolean) => void;
}

interface WishlistSelectors {
  itemCount: number;
  isItemInWishlist: (id: string) => boolean;
}

type WishlistStore = WishlistState & WishlistActions & WishlistSelectors;

// Custom event name for better tracking
const WISHLIST_UPDATED_EVENT = "wishlist-updated";

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => {
      // Helper to dispatch events to force re-renders across components
      const notifyUpdate = () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT, { 
            detail: { itemCount: get().itemCount } 
          }));
        }
      };
      
      return {
        items: [],
        isInitialized: false,
        
        setInitialized: (value: boolean) => set({ isInitialized: value }),
        
        addItem: (item) => {
          if (!item || !item.id) {
            console.error("Cannot add invalid item to wishlist");
            return;
          }
          
          set((state) => {
            try {
              // Ensure we have a valid items array
              const currentItems = state.items || [];
              
              if (currentItems.some((stateItem) => stateItem.id === item.id)) {
                return state; // Item already exists
              }
              
              // Create a wishlist item with only necessary properties
              const wishlistItem: WishlistItem = {
                id: item.id,
                name: item.name || "Unknown Product",
                price: typeof item.price === 'number' ? item.price : 0,
                salePrice: typeof item.salePrice === 'number' ? item.salePrice : null,
                image: Array.isArray(item.images) && item.images.length > 0 
                  ? item.images[0] 
                  : "/images/placeholder.jpg",
                slug: item.slug || ""
              };
              
              toast({
                title: "Added to wishlist",
                description: `${item.name} has been added to your wishlist`,
              });
              
              return { items: [...currentItems, wishlistItem] };
            } catch (err) {
              console.error("Error adding item to wishlist:", err);
              return state; // Return unchanged state on error
            }
          });
          
          // Notify components to update immediately
          setTimeout(notifyUpdate, 0);
        },
        
        removeItem: (id) => {
          if (!id) {
            console.error("Cannot remove item with invalid ID");
            return;
          }
          
          set((state) => {
            try {
              // Ensure we have a valid items array
              const currentItems = state.items || [];
              const itemToRemove = currentItems.find(item => item.id === id);
              
              if (itemToRemove) {
                toast({
                  title: "Removed from wishlist",
                  description: `${itemToRemove.name} has been removed from your wishlist`,
                });
              }
              
              return {
                items: currentItems.filter((item) => item.id !== id),
              };
            } catch (err) {
              console.error("Error removing item from wishlist:", err);
              return state; // Return unchanged state on error
            }
          });
          
          // Notify components to update immediately
          setTimeout(notifyUpdate, 0);
        },
        
        toggleItem: (item) => {
          if (!item || !item.id) {
            console.error("Cannot toggle invalid item in wishlist");
            return;
          }
          
          try {
            // Ensure we have a valid items array
            const currentItems = get()?.items || [];
            
            const exists = currentItems.some((stateItem) => stateItem.id === item.id);
            if (exists) {
              get().removeItem(item.id);
            } else {
              get().addItem(item);
            }
            
            // We don't need to notify here as addItem or removeItem will handle it
          } catch (err) {
            console.error("Error toggling wishlist item:", err);
          }
        },
        
        clearWishlist: () => {
          set({ items: [] });
          toast({
            title: "Wishlist cleared",
            description: "All items have been removed from your wishlist",
          });
          
          // Notify components to update immediately
          setTimeout(notifyUpdate, 0);
        },
        
        // Selectors for derived data
        get itemCount() {
          return get().items.length;
        },
        
        isItemInWishlist: (id) => {
          const items = get().items || [];
          return items.some(item => item.id === id);
        }
      };
    },
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setInitialized(true);
          }
        };
      }
    }
  )
);

// Create selector hooks for better performance
export const useWishlist = () => useWishlistStore();

export const useWishlistItems = () => useWishlistStore(state => state.items);

export const useWishlistItemCount = () => useWishlistStore(state => state.itemCount);

export const useWishlistActions = () => {
  const { addItem, removeItem, toggleItem, clearWishlist } = useWishlistStore();
  return { addItem, removeItem, toggleItem, clearWishlist };
};

export const useIsInWishlist = (id: string) => useWishlistStore(state => state.isItemInWishlist(id));

// Helper hook to force re-render when wishlist updates
export const useWishlistUpdates = () => {
  const [, setForceUpdate] = useState(0);
  
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setForceUpdate(v => v + 1);
    };
    
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdate);
    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdate);
    };
  }, []);
};

// Helper hook to safely access wishlist on client-side only
export const useSafeWishlist = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isInitialized = useWishlistStore(state => state.isInitialized);
  const wishlistData = useWishlistStore();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return {
    isReady: isMounted && isInitialized,
    ...wishlistData
  };
};

// Compatibility hook for the old API style
export const useWishlistCompat = () => {
  const { addItem, isItemInWishlist, removeItem } = useWishlistStore();
  
  return {
    addToWishlist: addItem,
    isInWishlist: isItemInWishlist,
    removeFromWishlist: removeItem,
  };
}; 
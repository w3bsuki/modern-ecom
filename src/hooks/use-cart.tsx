"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useWishlistStore } from "./use-wishlist";

// Define the cart item with proper type safety
export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  selectedSize: string | null;
  quantity: number;
  slug?: string;
}

// Define the cart store interface
interface CartState {
  items: CartItem[];
  isInitialized: boolean;
}

interface CartActions {
  addItem: (product: Product, size: string | null, quantity: number) => void;
  removeItem: (id: string, size?: string | null) => void;
  updateItemQuantity: (id: string, quantity: number, size?: string | null) => void;
  clearCart: () => void;
  setInitialized: (value: boolean) => void;
  moveToWishlist: (id: string, size?: string | null) => void;
}

interface CartSelectors {
  totalItems: number;
  subtotal: number;
  hasItem: (id: string, size?: string | null) => boolean;
}

type CartStore = CartState & CartActions & CartSelectors;

// Custom event name for better tracking
const CART_UPDATED_EVENT = "cart-updated";

// Create the cart store with zustand
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      // Helper to dispatch storage events to force re-renders across components
      const notifyUpdate = () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { 
            detail: { totalItems: get().totalItems } 
          }));
        }
      };
      
      return {
        items: [],
        isInitialized: false,
        
        setInitialized: (value: boolean) => set({ isInitialized: value }),
        
        // Add an item to the cart
        addItem: (product, selectedSize, quantity) => {
          // Validate input
          if (!product || !product.id) {
            console.error("Cannot add invalid product to cart");
            toast({
              title: "Error",
              description: "Could not add product to cart",
              variant: "destructive",
            });
            return;
          }
          
          // Ensure quantity is valid
          const safeQuantity = quantity > 0 ? quantity : 1;
          
          set((state) => {
            try {
              // Ensure we have a valid items array
              const currentItems = state.items || [];
              
              // Find if this product with the same size is already in the cart
              const existingItemIndex = currentItems.findIndex(
                (item) => item.id === product.id && item.selectedSize === selectedSize
              );

              // If it exists, update quantity
              if (existingItemIndex !== -1) {
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += safeQuantity;
                
                toast({
                  title: "Cart updated",
                  description: `${product.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
                  variant: "default",
                  duration: 3000,
                });
                
                return { items: updatedItems };
              }

              // Otherwise, add as new item with only the properties we need
              const cartItem: CartItem = {
                id: product.id,
                name: product.name || "Unknown Product",
                price: typeof product.price === 'number' ? product.price : 0,
                salePrice: typeof product.salePrice === 'number' ? product.salePrice : null,
                image: Array.isArray(product.images) && product.images.length > 0 
                  ? product.images[0] 
                  : "/images/placeholder.jpg",
                selectedSize,
                quantity: safeQuantity,
                slug: product.slug
              };
              
              toast({
                title: "Added to cart",
                description: `${product.name} has been added to your cart`,
                variant: "default",
                duration: 3000,
              });
              
              return { items: [...currentItems, cartItem] };
            } catch (err) {
              console.error("Error adding item to cart:", err);
              toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive",
              });
              return state; // Return unchanged state on error
            }
          });

          // Notify components to update immediately after state change
          setTimeout(notifyUpdate, 0);
        },
        
        // Remove an item from the cart
        removeItem: (id, size = null) => {
          set((state) => {
            try {
              const currentItems = state.items || [];
              
              // If size is provided, remove only that specific size
              const filteredItems = size
                ? currentItems.filter(item => !(item.id === id && item.selectedSize === size))
                : currentItems.filter(item => item.id !== id);
              
              const itemToRemove = currentItems.find(item => 
                item.id === id && (size === null || item.selectedSize === size)
              );
              
              if (itemToRemove) {
                toast({
                  title: "Removed from cart",
                  description: `${itemToRemove.name} has been removed from your cart`,
                });
              }
              
              return { items: filteredItems };
            } catch (err) {
              console.error("Error removing item from cart:", err);
              toast({
                title: "Error",
                description: "Failed to remove item from cart",
                variant: "destructive",
              });
              return state; // Return unchanged state on error
            }
          });
          
          // Notify components to update
          setTimeout(notifyUpdate, 0);
        },
        
        // Update the quantity of an item in the cart
        updateItemQuantity: (id, quantity, size = null) => {
          set((state) => {
            try {
              const currentItems = [...state.items];
              
              // Find the item to update
              const itemIndex = currentItems.findIndex(item => 
                item.id === id && (size === null || item.selectedSize === size)
              );
              
              if (itemIndex === -1) return state;
              
              // Exit early if trying to set invalid quantity
              if (quantity < 1) {
                return state;
              }
              
              // Update the quantity
              currentItems[itemIndex] = {
                ...currentItems[itemIndex],
                quantity
              };
              
              return { items: currentItems };
            } catch (err) {
              console.error("Error updating item quantity:", err);
              return state; // Return unchanged state on error
            }
          });
          
          // Notify components to update
          setTimeout(notifyUpdate, 0);
        },
        
        // Clear all items from the cart
        clearCart: () => {
          set({ items: [] });
          
          // Notify components to update
          setTimeout(notifyUpdate, 0);
        },
        
        // Move an item from cart to wishlist
        moveToWishlist: (id, size = null) => {
          try {
            const { items } = get();
            
            // Find the item in the cart
            const itemToMove = items.find(item => 
              item.id === id && (size === null || item.selectedSize === size)
            );
            
            if (!itemToMove) {
              console.error("Item not found in cart");
              return;
            }
            
            // Create a product-like object from the cart item
            const productToAdd = {
              id: itemToMove.id,
              name: itemToMove.name,
              price: itemToMove.price,
              salePrice: itemToMove.salePrice,
              images: [itemToMove.image],
              slug: itemToMove.slug || "",
            };
            
            // Access the wishlist store
            const wishlistStore = useWishlistStore.getState();
            
            // Add to wishlist if not already there
            if (!wishlistStore.isItemInWishlist(itemToMove.id)) {
              wishlistStore.addItem(productToAdd);
            } else {
              toast({
                title: "Already in wishlist",
                description: `${itemToMove.name} is already in your wishlist`,
              });
            }
            
            // Then remove from cart
            get().removeItem(id, size);
            
            toast({
              title: "Saved for later",
              description: `${itemToMove.name} moved to your wishlist`,
            });
          } catch (err) {
            console.error("Error moving item to wishlist:", err);
            toast({
              title: "Error",
              description: "Could not move item to wishlist",
              variant: "destructive",
            });
          }
          
          // Notify components to update
          setTimeout(notifyUpdate, 0);
        },
        
        // Check if an item is in the cart
        hasItem: (id, size = null) => {
          const { items } = get();
          return items.some(item => 
            item.id === id && (size === null || item.selectedSize === size)
          );
        },
        
        // Get the total number of items in the cart
        get totalItems() {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },
        
        // Get the subtotal price of the cart
        get subtotal() {
          return get().items.reduce((total, item) => {
            const price = item.salePrice !== null && item.salePrice !== undefined 
              ? item.salePrice 
              : item.price;
            return total + price * item.quantity;
          }, 0);
        },
      };
    },
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setInitialized(true);
          }
        };
      },
    }
  )
);

// Create selector hooks for better performance
export const useCart = () => useCartStore();

export const useCartItems = () => useCartStore(state => state.items);

export const useCartTotalItems = () => useCartStore(state => state.totalItems);

export const useCartSubtotal = () => useCartStore(state => state.subtotal);

export const useCartActions = () => {
  const { addItem, removeItem, updateItemQuantity, clearCart, moveToWishlist } = useCartStore();
  return { addItem, removeItem, updateItemQuantity, clearCart, moveToWishlist };
};

// Helper hook to check if an item is in the cart
export const useIsInCart = (id: string, size: string | null = null) => {
  return useCartStore(state => state.hasItem(id, size));
};

// Helper hook to force re-render when cart updates
export const useCartUpdates = () => {
  const [, setForceUpdate] = useState(0);
  
  useEffect(() => {
    const handleCartUpdate = () => {
      setForceUpdate(v => v + 1);
    };
    
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, []);
};

// Helper hook to safely access cart on client-side only
export const useSafeCart = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isInitialized = useCartStore(state => state.isInitialized);
  const items = useCartItems();
  const totalItems = useCartTotalItems();
  const subtotal = useCartSubtotal();
  const { 
    addItem, 
    removeItem, 
    updateItemQuantity, 
    clearCart,
    moveToWishlist 
  } = useCartActions();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return {
    isReady: isMounted && isInitialized,
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    moveToWishlist
  };
}; 
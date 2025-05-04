# Cart & Wishlist Implementation Plan

This document outlines the detailed implementation plan for the cart and wishlist functionality (Phase 2) of our e-commerce platform.

## Table of Contents
- [Overview](#overview)
- [Cart Implementation](#cart-implementation)
- [Wishlist Implementation](#wishlist-implementation)
- [User Interface Components](#user-interface-components)
- [State Management](#state-management)
- [Data Persistence](#data-persistence)
- [Testing Strategy](#testing-strategy)
- [Implementation Sequence](#implementation-sequence)

## Overview

Phase 2 focuses on implementing a complete cart and wishlist system with the following key objectives:
- Create a seamless add-to-cart experience
- Implement persistent cart and wishlist storage
- Design user-friendly cart and wishlist interfaces
- Support all essential cart operations (add, remove, update quantity)
- Provide clear visual feedback for all user actions

## Cart Implementation

### Core Cart Functionality

1. **Cart Data Structure**
   ```typescript
   interface CartItem {
     id: string;
     productId: string;
     name: string;
     price: number;
     image: string;
     quantity: number;
     variant?: {
       id: string;
       name: string;
       color?: string;
       size?: string;
     };
   }
   
   interface CartState {
     items: CartItem[];
     addItem: (item: CartItem) => void;
     removeItem: (id: string) => void;
     updateQuantity: (id: string, quantity: number) => void;
     clearCart: () => void;
     isOpen: boolean;
     setIsOpen: (isOpen: boolean) => void;
   }
   ```

2. **Cart Operations**
   - Add item to cart
   - Remove item from cart
   - Update item quantity
   - Clear cart
   - Calculate cart totals
   - Open/close cart drawer

3. **Cart Persistence**
   - Store cart data in localStorage
   - Load cart data on application startup
   - Future: Sync with server when user is authenticated

## Wishlist Implementation

### Core Wishlist Functionality

1. **Wishlist Data Structure**
   ```typescript
   interface WishlistItem {
     id: string;
     productId: string;
     name: string;
     price: number;
     image: string;
     variant?: {
       id: string;
       name: string;
       color?: string;
       size?: string;
     };
   }
   
   interface WishlistState {
     items: WishlistItem[];
     addItem: (item: WishlistItem) => void;
     removeItem: (id: string) => void;
     clearWishlist: () => void;
     isInWishlist: (id: string) => boolean;
   }
   ```

2. **Wishlist Operations**
   - Add item to wishlist
   - Remove item from wishlist
   - Check if item is in wishlist
   - Clear wishlist
   - Move item from wishlist to cart

3. **Wishlist Persistence**
   - Store wishlist data in localStorage
   - Load wishlist data on application startup
   - Future: Sync with server when user is authenticated

## User Interface Components

### Cart UI Components

1. **Cart Drawer**
   - Component: `src/components/shop/CartDrawer.tsx`
   - Features:
     - Slide-in drawer from right side
     - List of cart items with images
     - Quantity adjustments
     - Remove item buttons
     - Cart summary with subtotal
     - Checkout button
     - Close button

2. **Cart Item**
   - Component: `src/components/shop/CartItem.tsx`
   - Features:
     - Product image
     - Product name and details
     - Price and quantity
     - Quantity adjustment controls
     - Remove button

3. **Add to Cart Button**
   - Component: `src/components/shop/AddToCartButton.tsx`
   - Features:
     - Primary action button
     - Loading state during processing
     - Success animation after adding

4. **Cart Icon**
   - Component: `src/components/shop/CartIcon.tsx`
   - Features:
     - Cart icon in header
     - Item count badge
     - Opens cart drawer on click

### Wishlist UI Components

1. **Wishlist Page**
   - Component: `src/app/wishlist/page.tsx`
   - Features:
     - Grid of wishlist items
     - Add to cart buttons
     - Remove from wishlist buttons
     - Empty state message

2. **Wishlist Icon/Button**
   - Component: `src/components/shop/WishlistButton.tsx`
   - Features:
     - Heart icon with toggle state
     - Animation on click
     - Used on product cards and product detail pages

3. **Wishlist Item**
   - Component: `src/components/shop/WishlistItem.tsx`
   - Features:
     - Product image
     - Product name and details
     - Price
     - Add to cart button
     - Remove button

## State Management

We'll use Zustand for state management with the following structure:

1. **Cart Store**
   - File: `src/lib/stores/cart-store.ts`
   - Features:
     - Cart items array
     - CRUD operations
     - Persistence middleware
     - UI state (drawer open/closed)

2. **Wishlist Store**
   - File: `src/lib/stores/wishlist-store.ts`
   - Features:
     - Wishlist items array
     - CRUD operations
     - Persistence middleware
     - Helper functions (isInWishlist, etc.)

## Data Persistence

### Local Storage Strategy

1. **Cart Storage**
   - Key: `cart-storage`
   - Stored values: Cart items

2. **Wishlist Storage**
   - Key: `wishlist-storage`
   - Stored values: Wishlist items

3. **Implementation with Zustand Middleware**
   ```typescript
   import { create } from "zustand";
   import { persist } from "zustand/middleware";
   
   export const useCartStore = create<CartState>()(
     persist(
       (set, get) => ({
         items: [],
         // Implementation of methods
       }),
       {
         name: "cart-storage",
       }
     )
   );
   ```

## Testing Strategy

1. **Unit Tests**
   - Test cart and wishlist store operations
   - Test UI components in isolation

2. **Integration Tests**
   - Test add to cart flow from product to cart
   - Test wishlist toggle and functionality

3. **E2E Tests**
   - Test complete cart flow from product selection to checkout
   - Test persistence across page reloads

## Implementation Sequence

1. **Setup State Management**
   - Create cart store with Zustand
   - Create wishlist store with Zustand
   - Implement persistence middleware

2. **Implement Cart UI**
   - Create cart drawer component
   - Develop cart item component
   - Add quantity selector component
   - Implement cart summary

3. **Implement Add to Cart Functionality**
   - Create add to cart button
   - Add "added to cart" animation/toast
   - Implement quantity selection on product pages

4. **Develop Wishlist Functionality**
   - Create wishlist toggle button
   - Implement wishlist page
   - Add wishlist item components
   - Create "move to cart" functionality

5. **Finalize & Polish**
   - Add loading states
   - Implement error handling
   - Ensure responsive design
   - Add accessibility features
   - Optimize performance

## Key Design Considerations

1. **Mobile Experience**
   - Ensure cart drawer is usable on small screens
   - Simplify interactions for touch devices
   - Test all functionality on mobile viewports

2. **Performance**
   - Minimize re-renders with proper state management
   - Use proper keys for list rendering
   - Lazy load components when appropriate

3. **Accessibility**
   - Ensure focus management in drawer
   - Add proper ARIA attributes
   - Support keyboard navigation
   - Provide screen reader announcements for cart changes

4. **Error Handling**
   - Handle network errors gracefully
   - Provide feedback on action failures
   - Implement retry mechanisms where appropriate

---

**Note**: This implementation plan should be updated as development progresses to reflect current status and any changes in approach. 
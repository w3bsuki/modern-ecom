"use client";

import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";

// Declare the types for the window object extensions
declare global {
  interface Window {
    useCart: typeof useCart;
    useToast: typeof useToast;
  }
}

/**
 * Registers hooks on the window object for global access.
 * This is used for components that need to access hooks outside of the React tree.
 */
export function registerHooks() {
  if (typeof window !== "undefined") {
    // Attach hooks to window
    window.useCart = useCart;
    window.useToast = useToast;
    // Add any other hooks as needed
  }
} 
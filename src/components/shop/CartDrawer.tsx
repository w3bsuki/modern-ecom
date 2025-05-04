"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X, Trash2, Plus, Minus, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShopDrawer } from "@/components/shop/ShopDrawer";
import { EmptyState } from "@/components/shop/EmptyState";
import { useSafeCart, useCartUpdates } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsInWishlist } from "@/hooks/use-wishlist";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Force component to update when cart updates
  useCartUpdates();
  
  // Use the safe cart hook to handle hydration
  const { 
    isReady, 
    items, 
    totalItems, 
    removeItem, 
    updateItemQuantity, 
    clearCart, 
    moveToWishlist 
  } = useSafeCart();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate subtotal
  const subtotal = isMounted && isReady
    ? items.reduce((acc, item) => {
        const price = item.salePrice !== null && item.salePrice !== undefined 
          ? item.salePrice 
          : item.price;
        return acc + (price * item.quantity);
      }, 0)
    : 0;

  return (
    <ShopDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Your Cart"
      icon={<ShoppingBag className="h-5 w-5" />}
      badgeCount={isMounted && isReady ? totalItems : 0}
    >
      {/* Cart is empty */}
      {(!isMounted || !isReady || items.length === 0) && (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-zinc-400" />}
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          actionText="Continue Shopping"
          actionLink="/collections"
          onAction={onClose}
        />
      )}

      {/* Cart has items */}
      {isMounted && isReady && items.length > 0 && (
        <>
          <div className="px-4 py-2 divide-y divide-white/10">
            {items.map(item => (
              <CartItem 
                key={`${item.id}-${item.selectedSize}`} 
                item={item}
                onRemove={() => removeItem(item.id, item.selectedSize)}
                onUpdateQuantity={(quantity) => 
                  updateItemQuantity(item.id, quantity, item.selectedSize)
                }
                onMoveToWishlist={() => moveToWishlist(item.id, item.selectedSize)}
              />
            ))}
          </div>
          
          <div className="border-t border-white/20 bg-zinc-950 p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-white/10">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full justify-between"
                onClick={onClose}
                asChild
              >
                <Link href="/cart">
                  Proceed to Checkout
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 hover:bg-white/5"
                onClick={onClose}
                asChild
              >
                <Link href="/collections">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </ShopDrawer>
  );
}

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    image: string;
    selectedSize: string | null;
    quantity: number;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onMoveToWishlist: () => void;
}

function CartItem({ item, onRemove, onUpdateQuantity, onMoveToWishlist }: CartItemProps) {
  const isInWishlist = useIsInWishlist(item.id);
  
  return (
    <div className="py-4 first:pt-2 last:pb-2">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-zinc-900">
          <Image 
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <div className="pr-2">
              <h4 className="font-medium text-sm text-white truncate">{item.name}</h4>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {item.selectedSize && (
                  <span className="text-xs text-zinc-400">
                    Size: {item.selectedSize}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={onMoveToWishlist}
                      disabled={isInWishlist}
                      className={cn(
                        "text-zinc-400 hover:text-white transition p-1 -m-1 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white",
                        isInWishlist && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={isInWishlist ? "Already in wishlist" : "Save for later"}
                    >
                      <Heart className={cn(
                        "h-4 w-4",
                        isInWishlist && "fill-red-500 text-red-500"
                      )} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isInWishlist ? "Already in wishlist" : "Save for later"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <button 
                onClick={onRemove}
                className="text-zinc-400 hover:text-white transition p-1 -m-1 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                aria-label="Remove item"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center border border-zinc-700 rounded-md overflow-hidden">
              <button
                onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                className={cn(
                  "p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors active:bg-white/20",
                  item.quantity <= 1 && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-zinc-400"
                )}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="px-3 text-sm min-w-10 text-center font-medium">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors active:bg-white/20"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-sm font-medium">
              {item.salePrice 
                ? (
                  <div className="flex flex-col items-end">
                    <span className="text-white">{formatPrice(item.salePrice * item.quantity)}</span>
                    <span className="text-xs text-zinc-500 line-through">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ) 
                : formatPrice(item.price * item.quantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer; 
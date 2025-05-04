"use client";

import { useState, useEffect } from "react";
import { Heart, X, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShopDrawer } from "@/components/shop/ShopDrawer";
import { EmptyState } from "@/components/shop/EmptyState";
import { useSafeWishlist, useWishlistUpdates } from "@/hooks/use-wishlist";
import { useCartActions } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Force component to update when wishlist updates
  useWishlistUpdates();
  
  // Use the safe wishlist hook to handle hydration
  const { isReady, items, itemCount, removeItem, clearWishlist } = useSafeWishlist();
  const { addItem: addToCart } = useCartActions();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle adding to cart
  const handleAddToCart = (item: any) => {
    try {
      if (!item || !item.id) return;
      
      // For wishlist items, we default to the first size or null if no sizes
      const firstSize = "One Size"; // Default to one size as wishlist items don't store size info
      
      addToCart(item, firstSize, 1);
      onClose(); // Close the drawer after adding to cart
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast({
        title: "Error",
        description: "There was a problem adding this item to your cart",
        variant: "destructive",
      });
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <ShopDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Your Wishlist"
      icon={<Heart className="h-5 w-5" />}
      badgeCount={isMounted && isReady ? itemCount : 0}
    >
      {/* Wishlist is empty */}
      {(!isMounted || !isReady || items.length === 0) && (
        <EmptyState
          icon={<Heart className="h-8 w-8 text-zinc-400" />}
          title="Your wishlist is empty"
          description="Save your favorite products for later or share them with friends."
          actionText="Continue Shopping"
          actionLink="/collections"
          onAction={onClose}
        />
      )}

      {/* Wishlist has items */}
      {isMounted && isReady && items.length > 0 && (
        <>
          <div className="px-4 py-2 divide-y divide-white/10">
            {items.map(item => (
              <div key={item.id} className="py-4 first:pt-2 last:pb-2">
                <div className="flex gap-4">
                  <Link 
                    href={`/product/${item.slug}`} 
                    className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-zinc-900"
                    onClick={onClose}
                  >
                    <Image 
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link 
                        href={`/product/${item.slug}`}
                        className="pr-2"
                        onClick={onClose}
                      >
                        <h4 className="font-medium text-sm text-white hover:underline">{item.name}</h4>
                        
                        <div className="mt-1 text-sm text-zinc-400">
                          {item.salePrice 
                            ? (
                              <>
                                <span className="text-white">{formatPrice(item.salePrice)}</span>
                                <span className="text-xs text-zinc-500 line-through ml-2">
                                  {formatPrice(item.price)}
                                </span>
                              </>
                            ) 
                            : formatPrice(item.price)}
                        </div>
                      </Link>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-400 hover:text-white transition p-1 -m-1 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-white/20 hover:bg-white/10"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/20 bg-zinc-950 p-4">
            <div className="space-y-2">
              <Link href="/cart" onClick={onClose} className="block">
                <Button className="w-full">
                  View Cart
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 hover:bg-white/5"
                onClick={clearWishlist}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Wishlist
              </Button>
            </div>
          </div>
        </>
      )}
    </ShopDrawer>
  );
}

export default WishlistDrawer; 
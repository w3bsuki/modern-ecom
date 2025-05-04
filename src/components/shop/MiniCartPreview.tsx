"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartItems, useCartSubtotal } from "@/hooks/use-cart";
import { CartItem } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface MiniCartPreviewProps {
  isVisible: boolean;
}

export function MiniCartPreview({ isVisible }: MiniCartPreviewProps) {
  const cartItems = useCartItems();
  const subtotal = useCartSubtotal();
  
  // Only show up to 3 items in the preview
  const previewItems = cartItems.slice(0, 3);
  const hasMoreItems = cartItems.length > 3;
  const itemCount = cartItems.length;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { duration: 0.15 } 
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-card border border-border z-50 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">
                {itemCount === 0 ? "Your cart is empty" : `Your Cart (${itemCount})`}
              </h3>
              {itemCount > 0 && (
                <div className="text-sm font-medium text-muted-foreground">
                  Subtotal: <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
              )}
            </div>
            
            {/* Cart is empty state */}
            {itemCount === 0 && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No items in your cart yet</p>
                <Link href="/collections">
                  <Button size="sm" variant="outline" className="mt-2">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Cart items */}
            {itemCount > 0 && (
              <div className="space-y-3 max-h-80 overflow-auto pr-1">
                {previewItems.map((item) => (
                  <MiniCartItem key={`${item.id}-${item.selectedSize}`} item={item} />
                ))}
                
                {hasMoreItems && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    + {cartItems.length - 3} more item{cartItems.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer with actions */}
          {itemCount > 0 && (
            <div className="border-t border-border p-3 bg-muted/40">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout">
                  <Button size="sm" className="w-full">
                    Checkout <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MiniCartItemProps {
  item: CartItem;
}

function MiniCartItem({ item }: MiniCartItemProps) {
  const productUrl = item.slug ? `/product/${item.slug}` : "/";
  
  // Calculate the effective price (sale price or regular price)
  const effectivePrice = item.salePrice ?? item.price;
  
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border">
        <Link href={productUrl}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </Link>
      </div>
      
      <div className="flex-1 min-w-0">
        <Link href={productUrl} className="text-sm font-medium hover:text-primary line-clamp-1 transition-colors">
          {item.name}
        </Link>
        
        <div className="mt-1 flex text-xs text-muted-foreground">
          {item.selectedSize && (
            <span className="mr-2">Size: {item.selectedSize}</span>
          )}
          <span>Qty: {item.quantity}</span>
        </div>
        
        <div className="mt-1 text-sm font-medium">
          {formatPrice(effectivePrice)}
          {item.salePrice && (
            <span className="ml-2 text-xs line-through text-muted-foreground">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 
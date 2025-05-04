"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Minus, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/use-toast";
import { useCartActions } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductActionsProps {
  product: Product;
  selectedSize: string | null;
  onSizeChange?: (size: string) => void;
  className?: string;
}

export function ProductActions({ 
  product, 
  selectedSize,
  onSizeChange,
  className 
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get cart and wishlist actions
  const { addItem: addToCart } = useCartActions();
  const { toggleItem: toggleWishlistItem, isItemInWishlist } = useWishlist();
  
  // Check if product is in wishlist
  const isInWishlist = isMounted && isItemInWishlist(product.id);
  
  // Client-side only to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle quantity changes with validation
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > 10) return;
    setQuantity(value);
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product.inStock || !selectedSize) {
      toast({
        title: "Unable to add to cart",
        description: !selectedSize 
          ? "Please select a size" 
          : "This product is out of stock",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      addToCart(product, selectedSize, quantity);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "There was a problem adding this item to your cart",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!isMounted) return;
    
    try {
      toggleWishlistItem(product);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your wishlist",
        variant: "destructive",
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing",
      });
      return;
    }
    
    try {
      await navigator.share({
        title: product.name,
        text: product.description || `Check out this ${product.name}`,
        url: window.location.href,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Error sharing:", error);
        toast({
          title: "Error",
          description: "There was a problem sharing this product",
          variant: "destructive",
        });
      }
    }
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.4 } 
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={cn("space-y-6", className)}
    >
      {/* Quantity Selector */}
      <div className="space-y-2">
        <label htmlFor="quantity" className="block font-medium">
          Quantity
        </label>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-l-md"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || !product.inStock}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="h-10 w-12 flex items-center justify-center border-y border-input bg-background">
            {quantity}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-r-md"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10 || !product.inStock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          {product.stockCount && product.stockCount < 10 && (
            <span className="ml-3 text-sm text-amber-600">
              Only {product.stockCount} left
            </span>
          )}
        </div>
      </div>
      
      {/* Size Selection Error */}
      {product.sizes && product.sizes.length > 0 && !selectedSize && (
        <p className="text-sm text-red-500">
          Please select a size to add to cart
        </p>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          size="lg"
          className="w-full sm:flex-[3] bg-black hover:bg-black/90 text-white"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
        >
          {isAdding ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
        
        <div className="grid grid-cols-2 sm:flex-1 gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-full",
              isInWishlist && "text-red-500 border-red-200 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
            )}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn("h-5 w-5", isInWishlist && "fill-current")} 
            />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-full"
            onClick={handleShare}
            aria-label="Share product"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Out of Stock Notice */}
      {!product.inStock && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
          This product is currently out of stock. You can add it to your wishlist and we'll notify you when it becomes available.
        </div>
      )}
    </motion.div>
  );
} 
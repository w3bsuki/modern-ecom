"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useCartActions } from "@/hooks/use-cart";
import { toast } from "@/components/ui/use-toast";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface QuickAddButtonProps {
  product: Product;
  className?: string;
}

export function QuickAddButton({ product, className }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? null : null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const { addItem } = useCartActions();
  
  const hasSizes = product.sizes && product.sizes.length > 0;
  
  // Handle adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has sizes but none selected, show popover
    if (hasSizes && !selectedSize) {
      setIsOpen(true);
      return;
    }
    
    // Add to cart animation sequence
    setIsAdding(true);
    
    // Add the product to cart
    addItem(product, selectedSize, 1);
    
    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Show success state
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      
      // Reset after a delay
      setTimeout(() => {
        setIsAdded(false);
        setIsOpen(false);
      }, 1500);
    }, 600);
  };
  
  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  // Reset state when popover closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // If closing without selecting a size, reset selected size
      if (hasSizes && !selectedSize) {
        setSelectedSize(null);
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      {hasSizes ? (
        // Product with sizes needs a popover
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(true);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 text-sm",
                "bg-black dark:bg-white text-white dark:text-black",
                "rounded-full py-1.5 px-4 font-medium",
                "hover:bg-black/90 dark:hover:bg-white/90 shadow-sm",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                className
              )}
              aria-label="Quick add to cart"
            >
              {isAdding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                />
              ) : isAdded ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="addToCart"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {selectedSize ? `Add (${selectedSize})` : "Select Size"}
                </motion.div>
              )}
            </motion.button>
          </PopoverTrigger>
          
          <PopoverContent 
            side="top" 
            align="center" 
            className="w-64 p-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-medium text-sm">Select Size</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                  aria-label="Close size selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={cn(
                      "px-2 py-1.5 text-sm rounded-md border",
                      "transition-colors duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                      selectedSize === size 
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" 
                        : "border-gray-300 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-300"
                    )}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdding || isAdded}
                className="w-full"
              >
                {isAdding ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Adding...
                  </span>
                ) : isAdded ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Added!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </span>
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        // Simple button for products without sizes
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className={cn(
            "flex items-center justify-center gap-1.5 text-sm",
            "bg-black dark:bg-white text-white dark:text-black",
            "rounded-full py-1.5 px-4 font-medium",
            "hover:bg-black/90 dark:hover:bg-white/90 shadow-sm",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
            className
          )}
          aria-label="Quick add to cart"
        >
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
            />
          ) : isAdded ? (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="addToCart"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Cart</span>
            </motion.div>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
} 
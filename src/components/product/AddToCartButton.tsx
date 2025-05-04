"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartActions } from "@/hooks/use-cart";
import { toast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
  product: Product;
  size?: string | null;
  quantity?: number;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

export function AddToCartButton({
  product,
  size = "One Size",
  quantity = 1,
  variant = "default",
  className = "",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartActions();

  const handleAddToCart = async () => {
    if (!product || isAdding) return;
    
    setIsAdding(true);
    
    try {
      // Use selected size or default to first available size or "One Size"
      const selectedSize = size || product.sizes?.[0] || "One Size";
      
      // Add to cart
      addItem(product, selectedSize, quantity);
      
      // Show success state
      setIsAdded(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isAdding || !product.inStock}
      variant={variant}
      className={className}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : !product.inStock ? (
        "Out of Stock"
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
} 
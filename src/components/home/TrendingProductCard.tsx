"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TrendingProductCardProps {
  product: any; // Using any temporarily to handle both product types
  index: number;
  onQuickView: (productId: string) => void;
}

export function TrendingProductCard({ 
  product, 
  index,
  onQuickView 
}: TrendingProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle image change on hover
  React.useEffect(() => {
    if (isHovered && product.images?.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, product.images?.length]);

  // Calculate discount - handle both product types
  const getDiscount = () => {
    if (typeof product.discount === 'number') {
      return product.discount;
    }
    
    // Calculate discount from price and salePrice if available
    if (product.salePrice && product.price) {
      const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
      return discount > 0 ? discount : 0;
    }
    
    return 0;
  };

  const discount = getDiscount();
  
  // Format prices - calculate original price if there's a discount
  const price = product.price || 0;
  const formattedPrice = product.salePrice 
    ? `$${product.salePrice.toFixed(2)}`
    : `$${price.toFixed(2)}`;
    
  const hasDiscount = discount > 0;
  const originalPrice = hasDiscount
    ? (product.salePrice 
       ? `$${price.toFixed(2)}`
       : `$${((price * 100) / (100 - discount)).toFixed(2)}`)
    : null;

  // Is product new - handle both boolean and undefined
  const isNew = product.isNew === true;
  
  // Get product rating - fallback to 0 if not available
  const rating = product.rating || 0;
  
  console.log("Product data in card:", { 
    id: product.id,
    name: product.name,
    price,
    discount,
    hasDiscount, 
    formattedPrice, 
    originalPrice,
    isNew
  });

  return (
    <div className="h-full" data-testid="trending-product-card">
      <Card 
        className={cn(
          "relative h-full overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 transition-all duration-300",
          isHovered ? "border-white/20 shadow-xl shadow-purple-500/10" : "border-zinc-800 shadow-md"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image - smaller */}
        <div className="relative pt-[85%]">
          <div className="absolute inset-0">
            <Image
              src={product.images?.[currentImageIndex] || "/images/hats/placeholder1.jpg"}
              alt={product.name || "Product"}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 380px"
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered ? "scale-110" : "scale-100"
              )}
              priority={index < 4}
            />
            
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Product badge */}
            {hasDiscount ? (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                SALE
              </div>
            ) : isNew ? (
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                NEW
              </div>
            ) : null}
            
            {/* Quick view overlay - visible on hover */}
            {isHovered && (
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <button
                  className="bg-white text-black px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg hover:bg-gray-100 transition-colors"
                  onClick={() => onQuickView(product.id)}
                >
                  <Eye className="w-4 h-4" />
                  Quick View
                </button>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button
                className="bg-white/90 text-black p-2 rounded-full shadow-md hover:bg-white transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Info - Taller Area */}
        <div className="p-3 pb-4">
          {/* Product number and name row */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-zinc-400 text-base font-semibold">#{index + 1}</span>
            <h3 className="text-white font-medium text-base">
              {product.name || "Untitled Product"}
            </h3>
          </div>
          
          <Separator className="mb-2" />
          
          {/* Colors */}
          <div className="flex items-center mb-2">
            <span className="text-zinc-400 text-xs mr-2">Colors:</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full bg-black border border-zinc-700"></div>
              <div className="w-4 h-4 rounded-full bg-neutral-700 border border-zinc-600"></div>
              <div className="w-4 h-4 rounded-full bg-neutral-500 border border-zinc-500"></div>
            </div>
          </div>
          
          <Separator className="mb-2" />
          
          {/* Rating row */}
          <div className="flex items-center mb-2">
            <span className="text-zinc-400 text-xs mr-2">Rating:</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-600"}`} 
                />
              ))}
              <span className="text-xs text-white ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <Separator className="mb-2" />
          
          {/* Price row */}
          <div className="flex items-center mb-3">
            <span className="text-white text-sm font-bold">{formattedPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-gray-400 line-through text-xs ml-2">{originalPrice}</span>
                <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded ml-auto">-{discount}%</span>
              </>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <Button
            className="w-full rounded-lg bg-white text-black hover:bg-white/90 h-8"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default TrendingProductCard; 
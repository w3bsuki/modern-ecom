"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, EyeIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Skip if product is invalid
    if (!product || !product.id) {
      return;
    }
    
    // Use first size if available, or null if not
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    
    addItem(product, size, 1);
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Wishlist clicked for", product.id);
    // Add actual wishlist logic
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => {
        const price = product.price || 0;
        const salePrice = product.salePrice;
        const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : null;
        const images = product.images || [];
        const inStock = product.inStock !== false;
        const isNew = product.isNew === true;
        const rating = product.rating || 0;
        const reviewCount = product.reviewCount || 0;

        return (
          <motion.div 
            key={product.id} 
            variants={childVariants}
            className="group bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col h-full transition-all hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md"
          >
            <Link href={`/product/${product.slug}`} className="block relative">
              <AspectRatio ratio={1 / 1} className="bg-gray-100 dark:bg-gray-900">
                {images.length > 0 ? (
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                    No image
                  </div>
                )}
              </AspectRatio>
              
              {discount && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                  {discount}% OFF
                </Badge>
              )}
              
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-black text-white px-4 py-2 rounded-md font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white text-black border-none hover:bg-gray-100 shadow-sm w-8 h-8"
                  onClick={(e) => handleWishlist(e, product)}
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
            </Link>
            
            <div className="flex flex-col p-4 flex-1">
              <Link href={`/product/${product.slug}`} className="group-hover:underline font-medium mb-1 line-clamp-1">
                {product.name}
              </Link>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-xs text-gray-500">({reviewCount})</span>
                )}
              </div>
              
              <div className="text-sm mb-4">
                {salePrice ? (
                  <div className="flex items-center">
                    <span className="font-semibold">${salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-gray-500 line-through text-xs">${price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-semibold">${price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="mt-auto">
                <Button
                  size="sm"
                  className={cn(
                    "w-full h-9 text-xs rounded-md font-semibold transition-colors duration-300",
                    "bg-white text-black border border-white",
                    "hover:bg-black hover:text-white hover:border-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
                  )}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!inStock}
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 
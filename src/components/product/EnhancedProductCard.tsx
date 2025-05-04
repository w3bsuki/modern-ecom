"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnhancedProductCardProps {
  product: Product;
  index?: number;
}

export function EnhancedProductCard({ product, index = 0 }: EnhancedProductCardProps) {
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: (i: number) => ({ 
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Badge position based on index to create variety
  const getBadgePosition = (index: number) => {
    const positions = [
      "top-2 right-2",
      "top-2 left-2",
      "bottom-2 right-2",
      "bottom-2 left-2",
    ];
    return positions[index % positions.length];
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="group relative flex flex-col rounded-xl overflow-hidden"
    >
      {/* Card Glass Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/40 dark:from-gray-900/70 dark:to-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-800/20 rounded-xl shadow-md transition-all group-hover:shadow-xl group-hover:backdrop-blur-md group-hover:border-white/30 dark:group-hover:border-gray-800/30 z-0" />
      
      {/* Card Content */}
      <div className="flex flex-col h-full z-10">
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 group-hover:opacity-0 transition-opacity" />
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {product.isNew && (
              <Badge className="bg-blue-500 text-white border-none px-2.5 py-1 font-medium shadow-lg">
                NEW
              </Badge>
            )}
            {product.isSale && (
              <Badge className="bg-red-500 text-white border-none px-2.5 py-1 font-medium shadow-lg">
                SALE
              </Badge>
            )}
          </div>
          
          {/* Quick Actions - Appear on Hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Button 
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 hover:bg-white text-gray-900 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-black/80 hover:bg-black text-white backdrop-blur-sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col flex-grow p-4">
          {/* Category & Rating */}
          <div className="flex justify-between items-center mb-1">
            {product.collections && product.collections.length > 0 && (
              <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
                {product.collections[0]}
              </span>
            )}
            <div className="flex items-center text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-xs font-medium">
                {product.rating || 5.0}
              </span>
            </div>
          </div>
          
          {/* Product Name */}
          <Link href={`/product/${encodeURIComponent(product.slug)}`} className="outline-none">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-auto">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center mt-3">
            {product.salePrice ? (
              <>
                <span className="font-bold text-base sm:text-lg text-red-600 dark:text-red-500">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Neumorphic effect - subtle 3D shadow */}
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-transparent via-black/5 to-black/10 dark:from-transparent dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-sm z-[-1]" />
    </motion.div>
  );
} 
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Eye, Maximize } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCartActions } from '@/hooks/use-cart';
import { useWishlistActions, useIsInWishlist } from '@/hooks/use-wishlist';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { QuickAddButton } from '@/components/product/QuickAddButton';

interface ShopProductCardProps {
  product: Product;
  onQuickView: (productId: string, e: React.MouseEvent) => void;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export default function ShopProductCard({
  product,
  onQuickView,
  className,
  viewMode = 'grid'
}: ShopProductCardProps) {
  const { addItem } = useCartActions();
  const [isMounted, setIsMounted] = useState(false);
  // Always call hooks, but use their values conditionally when rendering
  const isInWishlist = useIsInWishlist(product.id);
  const { toggleItem } = useWishlistActions();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
    // Force re-render after mount
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Switch to second image on hover if available
  React.useEffect(() => {
    if (isHovered && product.images?.length > 1) {
      const timeoutId = setTimeout(() => {
        setCurrentImageIndex(1);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, product.images?.length]);

  // Memoize derived product values
  const productDetails = useMemo(() => {
    const price = product.price || 0;
    const salePrice = product.salePrice;
    const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : null;
    const images = product.images || [];
    const currentImage = images[currentImageIndex] || images[0] || "/images/hats/placeholder1.jpg";
    const collection = product.collection || '';
    const isNew = !!product.isNew;
    const isSale = !!product.isSale || !!salePrice;
    const rating = product.rating || 0;
    const reviewCount = product.reviewCount || 0;

    return {
      price,
      salePrice,
      discount,
      currentImage,
      collection,
      isNew,
      isSale,
      rating,
      reviewCount,
    };
  }, [product, currentImageIndex]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMounted) return;
    
    // Ensure product has all required fields
    if (!product || !product.id) {
      toast({
        title: "Error",
        description: "Could not add product to cart",
        variant: "destructive",
      });
      return;
    }
    
    // Use first size if available, or null if not
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    
    addItem(product, size, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMounted) return;
    
    toggleItem(product);
    
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product.id, e);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={cn(
          "flex flex-col md:flex-row border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product image */}
        <div className="relative md:w-48 lg:w-56">
          <Link href={`/product/${product.id}`} className="block relative aspect-square">
            <Image 
              src={productDetails.currentImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 ease-in-out"
            />
            
            {/* Product badges */}
            {productDetails.discount && (
              <Badge className="absolute top-2 left-2 bg-red-500" variant="destructive">
                {productDetails.discount}% OFF
              </Badge>
            )}
            
            {productDetails.isNew && !productDetails.discount && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                NEW
              </Badge>
            )}
          </Link>
        </div>
        
        {/* Product details */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {productDetails.collection}
              </span>
              
              <Link href={`/product/${product.id}`}>
                <h3 className="text-lg font-medium my-1 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{productDetails.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({productDetails.reviewCount} reviews)
                </span>
              </div>
              
              <div className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mb-4">
                {product.description}
              </div>
            </div>
            
            <div className="mt-2 md:mt-0 md:ml-4 md:text-right">
              <div className="flex flex-col items-start md:items-end">
                {productDetails.salePrice ? (
                  <div className="flex flex-col md:items-end">
                    <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                      ${productDetails.salePrice.toFixed(2)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                      ${productDetails.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg">
                    ${productDetails.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            <Button
              onClick={handleAddToCart}
              className="flex-1 md:flex-none"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              onClick={handleWishlist}
              className={cn(
                "flex-1 md:flex-none",
                isInWishlist && "text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
              )}
            >
              <Heart className={cn("mr-2 h-4 w-4", isInWishlist && "fill-current")} />
              {isInWishlist ? "Saved" : "Save"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleQuickViewClick}
              className="flex-1 md:flex-none"
            >
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={cn(
        "group relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black transition-all duration-300",
        "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square">
        <Image 
          src={productDetails.currentImage}
          alt={product.name}
          fill
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
        />
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {productDetails.discount && (
            <Badge className="bg-red-500" variant="destructive">
              {productDetails.discount}% OFF
            </Badge>
          )}
          
          {productDetails.isNew && !productDetails.discount && (
            <Badge variant="secondary">
              NEW
            </Badge>
          )}
        </div>
        
        {/* Quick action buttons */}
        <AnimatePresence>
          {isMounted && isHovered && (
            <motion.div 
              className="absolute top-2 right-2 flex flex-col space-y-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 opacity-90 hover:opacity-100"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-red-500 text-red-500")} />
              </Button>
              
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 opacity-90 hover:opacity-100"
                onClick={handleQuickViewClick}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Quick Add Button */}
        <AnimatePresence>
          {isMounted && isHovered && (
            <motion.div 
              className="absolute bottom-4 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.preventDefault()}
            >
              <QuickAddButton product={product} />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
      
      {/* Product details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {productDetails.collection}
            </span>
            
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium mt-1 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{productDetails.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({productDetails.reviewCount})
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">
            {productDetails.salePrice ? (
              <div className="flex items-baseline">
                <span className="text-red-600 dark:text-red-400 font-bold">
                  ${productDetails.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm ml-2">
                  ${productDetails.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold">
                ${productDetails.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {product.sizes?.length ? `${product.sizes.length} sizes` : ""}
          </div>
        </div>
      </div>
    </div>
  );
} 
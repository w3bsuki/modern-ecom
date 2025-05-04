"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ShoppingBag, Eye, Heart, Star, TruckIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCartActions } from "@/hooks/use-cart";
import { toast } from "@/components/ui/use-toast";
import { useIsInWishlist, useWishlistActions } from "@/hooks/use-wishlist";
import { Badge } from "@/components/ui/badge"; 
import { QuickAddButton } from "@/components/product/QuickAddButton";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  onQuickView?: (productId: string, e: React.MouseEvent) => void;
  priority?: boolean;
}

// ProductLabel component for reusability
const ProductLabel = ({ 
  text, 
  className, 
  delay = 0,
  isAnimated = true
}: { 
  text: string; 
  className: string; 
  delay?: number;
  isAnimated?: boolean;
}) => {
  if (!isAnimated) {
    return <div className={className}>{text}</div>;
  }

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

// QuickActionButton component for reusability
const QuickActionButton = ({ 
  onClick, 
  ariaLabel, 
  icon, 
  bgColor = "bg-white/80 backdrop-blur-sm hover:bg-white",
  active = false
}: { 
  onClick: (e: React.MouseEvent) => void; 
  ariaLabel: string;
  icon: React.ReactNode;
  bgColor?: string;
  active?: boolean;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-full p-2 flex items-center justify-center transition-all duration-300 shadow-sm",
        bgColor,
        active && "ring-2 ring-black dark:ring-white ring-offset-2"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </motion.button>
  );
};

// Price display component for consistent formatting
const PriceDisplay = ({ 
  price, 
  salePrice, 
  compact = false,
  showPercentage = true
}: { 
  price: number; 
  salePrice?: number | null;
  compact?: boolean;
  showPercentage?: boolean;
}) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const formattedSalePrice = salePrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salePrice)
    : null;
    
  const discountPercentage = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className={cn("flex items-center", compact && "text-sm")}>
      {salePrice ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-red-600 dark:text-red-500 font-semibold">
            {formattedSalePrice}
          </span>
          <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
            {formattedPrice}
          </span>
          {showPercentage && discountPercentage > 0 && (
            <span className="bg-red-600 text-white text-xs font-medium px-1.5 py-0.5 rounded ml-1">
              -{discountPercentage}%
            </span>
          )}
        </div>
      ) : (
        <span className="font-semibold">{formattedPrice}</span>
      )}
    </div>
  );
};

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5", 
            i < Math.floor(rating) 
              ? "text-yellow-400 fill-yellow-400" 
              : i < rating 
                ? "text-yellow-400 fill-yellow-400 opacity-50" 
                : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

export function ProductCard({ 
  product, 
  compact = false, 
  onQuickView,
  priority = false
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { name, price, images, slug, isNew, isSale, salePrice } = product;
  const { addItem } = useCartActions();
  const { toggleItem } = useWishlistActions();
  const isInWishlist = useIsInWishlist(product.id);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    
    // Force re-render when localStorage changes (for cart/wishlist updates)
    const onStorageChange = () => {
      setIsMounted(state => {
        if (state) { // Only trigger if already mounted
          setIsMounted(false);
          setTimeout(() => setIsMounted(true), 0);
        }
        return state;
      });
    };
    
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  // Image hover effects
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  // Wishlist toggle handler
  const handleWishlistToggle = (e: React.MouseEvent) => {
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

  // Quick view handler
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onQuickView) {
      onQuickView(product.id, e);
    }
  };

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMounted) return;
    
    // Skip if product is invalid
    if (!product || !product.id) {
      toast({
        title: "Error",
        description: "Could not add product to cart",
        variant: "destructive",
      });
      return;
    }

    addItem(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Card appearance variations based on compact mode
  const cardHeight = compact ? "h-[280px]" : "h-[360px]";
  const imageHeight = compact ? "h-[180px]" : "h-[250px]";

  if (!product || !images || images.length === 0) {
    return null;
  }

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    initial: {
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden bg-background rounded-lg transition-all",
        "border border-border hover:border-foreground/30",
        "w-full max-w-sm mx-auto",
        "shadow-sm hover:shadow-md"
      )}
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
    >
      <Link href={`/product/${slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
        {/* Product image container */}
        <div 
          className={cn(
            "relative overflow-hidden w-full", 
            imageHeight,
            "bg-gray-100 dark:bg-gray-900"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Product image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={images[currentImageIndex]}
                alt={name}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Product labels */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isNew && (
              <ProductLabel 
                text="NEW" 
                className="bg-black text-white text-xs font-medium py-1 px-2 rounded"
                delay={0.1}
                isAnimated={isMounted}
              />
            )}
            {isSale && salePrice && (
              <ProductLabel 
                text={`${Math.round(((price - salePrice) / price) * 100)}% OFF`} 
                className="bg-red-600 text-white text-xs font-medium py-1 px-2 rounded"
                delay={0.2}
                isAnimated={isMounted}
              />
            )}
            {product.variants && product.variants.length > 1 && (
              <ProductLabel 
                text={`${product.variants.length} Options`} 
                className="bg-violet-600 text-white text-xs font-medium py-1 px-2 rounded"
                delay={0.3}
                isAnimated={isMounted}
              />
            )}
          </div>

          {/* Quick action buttons */}
          <AnimatePresence>
            {isMounted && (
              <motion.div 
                className={cn(
                  "absolute bottom-2 right-2 z-10 flex flex-col gap-2",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {onQuickView && (
                  <QuickActionButton 
                    onClick={handleQuickView}
                    ariaLabel="Quick view product"
                    icon={<Eye className="h-4 w-4 text-gray-800 dark:text-gray-200" />}
                  />
                )}
                <QuickActionButton 
                  onClick={handleWishlistToggle}
                  ariaLabel={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  icon={<Heart className={cn("h-4 w-4", isInWishlist ? "fill-red-500 text-red-500" : "text-gray-800 dark:text-gray-200")} />}
                  active={isInWishlist}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quick Add button */}
          <AnimatePresence>
            {isMounted && (
              <motion.div 
                className={cn(
                  "absolute bottom-4 left-0 right-0 z-10 flex justify-center",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="px-2"
                >
                  <QuickAddButton product={product} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Product info */}
        <div className="p-3 flex flex-col space-y-1">
          {!compact && (
            <div className="mb-1 flex justify-between items-center">
              <Badge variant="outline" className="text-xs font-normal text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2">
                {product.category || "Accessories"}
              </Badge>
              <StarRating rating={product.rating || 4.5} />
            </div>
          )}
          
          <h3 className={cn(
            "font-medium line-clamp-1 transition-colors duration-200",
            "group-hover:text-foreground/80",
            compact ? "text-sm" : "text-base"
          )}>
            {name}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-1">
            <PriceDisplay 
              price={price} 
              salePrice={salePrice} 
              compact={compact}
              showPercentage={!compact}
            />
            
            {!compact && (
              <motion.button
                onClick={handleAddToCart}
                className={cn(
                  "flex items-center justify-center bg-black dark:bg-white",
                  "text-white dark:text-black py-1.5 px-3 rounded-full",
                  "transition-all duration-300 text-xs font-medium",
                  "hover:bg-black/80 dark:hover:bg-white/80",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                Add
              </motion.button>
            )}
          </div>
          
          {!compact && (
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <TruckIcon className="h-3 w-3 mr-1" />
              <span>Free shipping</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard; 
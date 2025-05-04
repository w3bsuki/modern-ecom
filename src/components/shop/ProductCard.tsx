"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { useWishlistCompat } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  product: Product;
  layout?: "vertical" | "horizontal";
  hoverEffect?: "zoom" | "alternate" | "slide" | "fade" | "none";
  showRating?: boolean;
  showQuickAdd?: boolean;
  showQuickView?: boolean;
  priority?: boolean;
}

export function ProductCard({
  product,
  layout = "vertical",
  hoverEffect = "zoom",
  showRating = true,
  showQuickAdd = true,
  showQuickView = true,
  priority = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistCompat();
  
  // Get current image
  const currentImage = product.images?.[currentImageIndex] || "/images/hats/placeholder.jpg";
  
  // Handle image changes on hover for "alternate" effect
  const handleHoverImageChange = () => {
    if (hoverEffect === "alternate" && product.images && product.images.length > 1) {
      setCurrentImageIndex(1); // Show the second image on hover
    }
  };
  
  const handleHoverEnd = () => {
    if (hoverEffect === "alternate" && product.images && product.images.length > 1) {
      setCurrentImageIndex(0); // Revert to the first image when hover ends
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Calculate discount percentage
  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
    
  // Quick add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, product.sizes?.[0] || null, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  // Toggle wishlist
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0] || "/images/hats/placeholder.jpg",
        slug: product.slug,
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };
  
  // Get product URL
  const productUrl = `/product/${product.slug}`;
  
  // Determine if the card is horizontal
  const isHorizontal = layout === "horizontal";
  
  // Quick view modal
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a production app, this would open a modal
    window.location.href = productUrl;
  };
  
  // Determine product badge
  const getBadge = () => {
    if (product.isNew) {
      return { text: "New", className: "bg-blue-500" };
    }
    if (product.salePrice) {
      return { text: `${discountPercentage}% Off`, className: "bg-red-500" };
    }
    if (product.isFeatured) {
      return { text: "Featured", className: "bg-purple-500" };
    }
    if (product.isLimitedEdition) {
      return { text: "Limited", className: "bg-amber-500" };
    }
    return null;
  };
  
  const badge = getBadge();
  
  return (
    <motion.div
      className={cn(
        "group relative rounded-lg overflow-hidden border border-gray-200 bg-white transition-all duration-300 ease-out hover:shadow-lg",
        isHorizontal ? "grid grid-cols-12 gap-4" : "flex flex-col"
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        handleHoverImageChange();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleHoverEnd();
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image section */}
      <div 
        className={cn(
          "relative overflow-hidden",
          isHorizontal ? "col-span-5" : "aspect-square w-full"
        )}
      >
        <Link href={productUrl} className="block h-full">
          <div className="relative h-full">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              sizes={isHorizontal ? "30vw" : "(max-width: 768px) 50vw, 33vw"}
              priority={priority}
              className={cn(
                "object-cover transition-all duration-500 ease-out",
                !isImageLoaded && "opacity-0 blur-xl",
                hoverEffect === "zoom" && isHovered && "scale-110",
                hoverEffect === "fade" && !isHovered && "opacity-90"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* Overlay for hover effects */}
            {hoverEffect === "slide" && (
              <div 
                className={cn(
                  "absolute inset-0 bg-black/5 transition-transform duration-300",
                  isHovered ? "translate-y-0" : "translate-y-full"
                )}
              />
            )}
            
            {/* Badge (Sale, New, etc.) */}
            {badge && (
              <Badge 
                className={cn(
                  "absolute top-2 left-2 z-10 px-2 py-1",
                  badge.className
                )}
              >
                {badge.text}
              </Badge>
            )}
            
            {/* Sold out badge */}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <span className="text-white font-semibold px-4 py-2 bg-black/80 rounded-md uppercase tracking-wider text-sm">
                  Sold Out
                </span>
              </div>
            )}

            {/* Quick action buttons */}
            {(showQuickAdd || showQuickView) && (
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 flex justify-center p-2 gap-2 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
              >
                {showQuickAdd && product.inStock && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                          onClick={handleQuickAdd}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Add to cart</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quick add</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className={cn(
                          "h-9 w-9 rounded-full bg-white hover:bg-white/90",
                          isInWishlist(product.id) ? "text-red-500" : "text-black"
                        )}
                        onClick={toggleWishlist}
                      >
                        <Heart className={cn(
                          "h-4 w-4",
                          isInWishlist(product.id) && "fill-current"
                        )} />
                        <span className="sr-only">Wishlist</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {showQuickView && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                          onClick={handleQuickView}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Quick view</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quick view</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
        </Link>
      </div>
      
      {/* Product details */}
      <div 
        className={cn(
          "flex flex-col p-3",
          isHorizontal ? "col-span-7 justify-between" : ""
        )}
      >
        {/* Top section: Category and rating */}
        <div className="flex items-center justify-between mb-1">
          {product.category && (
            <span className="text-xs text-gray-500 capitalize">
              {product.category}
            </span>
          )}
          
          {showRating && product.rating && (
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-xs font-medium">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Middle section: Title and price */}
        <div>
          <Link href={productUrl} className="block">
            <h3 
              className={cn(
                "font-medium line-clamp-2 group-hover:text-blue-600 transition-colors",
                isHorizontal ? "text-lg mb-2" : "text-sm sm:text-base mb-1"
              )}
            >
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
            {product.salePrice ? (
              <>
                <span className="font-medium text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-gray-500 text-sm line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-medium">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
        
        {/* Bottom section: CTA button */}
        {isHorizontal && product.inStock && (
          <Button
            className="mt-2"
            onClick={handleQuickAdd}
          >
            Add to Cart
          </Button>
        )}
        
        {/* Features/attributes list for horizontal layout */}
        {isHorizontal && product.features && (
          <div className="mt-2">
            <ul className="text-xs text-gray-500 space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1.5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
} 
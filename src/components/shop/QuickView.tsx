"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Star, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  // State for gallery images
  const [selectedImage, setSelectedImage] = useState<string>("/images/hats/placeholder1.jpg");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const placeholderImages = ["/images/hats/placeholder1.jpg", "/images/hats/placeholder1.jpg"];
  
  // State for product configuration
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Get cart functionality from Zustand store
  const { addItem } = useCart();
  const wishlist = useWishlist();

  // Reset state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || placeholderImages[0]);
      setSelectedImageIndex(0);
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
      setIsAdding(false);
    }
  }, [product, placeholderImages, isOpen]);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if the product is in the wishlist
  useEffect(() => {
    if (isMounted && product) {
      const itemInWishlist = wishlist.items.some(item => item.id === product.id);
      setIsInWishlist(itemInWishlist);
    }
  }, [isMounted, wishlist.items, product]);

  // Safeguard against null product
  if (!product) {
    return null;
  }

  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
    
    if (discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      const formattedDiscountedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(discountedPrice);
      
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{formattedDiscountedPrice}</span>
          <span className="text-sm line-through text-gray-500">{formattedPrice}</span>
          <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded text-white">
            {discount}% OFF
          </span>
        </div>
      );
    }
    
    return <span className="text-xl font-bold text-white">{formattedPrice}</span>;
  };

  // Generate star rating component
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star key={`full-star-${i}`} size={16} fill="currentColor" />
          ))}
          {hasHalfStar && (
            <span className="relative">
              <Star size={16} className="text-gray-400" fill="currentColor" />
              <span className="absolute inset-0 overflow-hidden w-1/2">
                <Star size={16} className="text-yellow-400" fill="currentColor" />
              </span>
            </span>
          )}
          {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
            <Star key={`empty-star-${i}`} size={16} className="text-gray-400" />
          ))}
        </div>
        <span className="ml-1 text-xs text-gray-400">
          ({product.reviews} reviews)
        </span>
      </div>
    );
  };

  // Handle image navigation
  const handlePrevImage = () => {
    const newIndex = selectedImageIndex === 0 ? placeholderImages.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);
    setSelectedImage(placeholderImages[newIndex]);
  };
  
  const handleNextImage = () => {
    const newIndex = selectedImageIndex === placeholderImages.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);
    setSelectedImage(placeholderImages[newIndex]);
  };

  // Add to cart animation and functionality
  const handleAddToCart = () => {
    if (!product) return;
    
    // Add to cart using Zustand store
    addItem(product, selectedSize, quantity);
    
    // Show success animation
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      // Optionally close the QuickView after adding to cart
      // onClose();
    }, 1500);
  };

  const handleWishlistToggle = () => {
    if (!isMounted || !product) return;
    
    wishlist.toggleItem(product);
    
    // Update local state for immediate UI feedback
    setIsInWishlist(!isInWishlist);
    
    // Show toast notification
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-2xl max-h-[80vh] z-[9999]">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-30 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-full p-1.5 transition-all"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Left side - Image - Takes 2 columns out of 5 */}
          <div className="relative md:col-span-2 overflow-hidden bg-zinc-950 group">
            <AspectRatio ratio={4/3} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image 
                  src={selectedImage}
                  alt={product?.name || "Product image"} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Subtle gradient overlay for better control visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </AspectRatio>
           
            {/* Image navigation arrows */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePrevImage}
                className="bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextImage}
                className="bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="flex gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-lg">
                {placeholderImages.map((img, idx) => (
                  <button
                    key={`thumbnail-${product.id}-${idx}`}
                    onClick={() => {
                      setSelectedImage(img);
                      setSelectedImageIndex(idx);
                    }}
                    className={`w-10 h-10 relative rounded-md overflow-hidden transition-all border ${
                      selectedImageIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={`View ${product.name} - image ${idx + 1}`}
                    aria-label={`View ${product.name} - image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - view ${idx + 1}`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-lg">
                  -{product.discount}%
                </span>
              )}
              
              {product.isNew && (
                <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-lg backdrop-blur-sm">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          {/* Right side - Product details - Takes 3 columns out of 5 */}
          <div className="p-4 md:p-5 flex flex-col h-full overflow-y-auto hide-scrollbar md:col-span-3">
            <DialogHeader className="mb-3 text-left">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                {product.categories?.[0] || "Premium Hat"}
              </div>
              
              <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                {product.name}
              </DialogTitle>
              
              <div className="mt-2">
                {renderRating(product.rating)}
              </div>
              
              <div className="mt-3">
                {formatPrice(product.price, product.discount)}
              </div>
            </DialogHeader>
            
            <DialogDescription className="text-gray-300 text-sm mt-4 mb-6">
              {product.description}
            </DialogDescription>
            
            {/* Product options - Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <h3 className="text-white text-sm font-medium mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={`color-${color?.value || color?.name || index}`}
                      onClick={() => setSelectedColor(color?.value || '')}
                      className={`w-8 h-8 rounded-full border transition-all ${
                        selectedColor === color?.value 
                          ? 'border-white ring-2 ring-white/30 scale-110' 
                          : 'border-gray-600 hover:border-white/70'
                      }`}
                      style={{ backgroundColor: color?.hex || '#333' }}
                      aria-label={`Select ${color?.name || 'color'}`}
                      title={color?.name || 'Color option'}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Product options - Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white text-sm font-medium">Size</h3>
                  <button className="text-gray-400 hover:text-white text-xs underline focus:outline-none transition">
                    Size Guide
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={`size-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-9 px-2.5 rounded border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white border-gray-600 hover:border-white/70'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="mb-5">
              <h3 className="text-white text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-9 h-9 border border-gray-600 flex items-center justify-center text-white hover:border-white transition rounded-l-md"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="h-9 w-12 border-t border-b border-gray-600 flex items-center justify-center text-white">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 border border-gray-600 flex items-center justify-center text-white hover:border-white transition rounded-r-md"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col space-y-3 mt-auto pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isAdding ? 'adding' : 'add'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {isAdding ? (
                    <div className="w-full h-12 bg-emerald-600 text-white rounded-md flex items-center justify-center">
                      <Check size={18} className="mr-2" />
                      <span className="font-medium">Added to Cart!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-12 bg-white hover:bg-white/90 text-black font-medium rounded-md flex items-center justify-center space-x-2 transition-all"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
              
              <button 
                onClick={handleWishlistToggle}
                className={cn(
                  "w-full h-12 bg-transparent text-white border rounded-md flex items-center justify-center space-x-2 transition-all",
                  isInWishlist 
                    ? "border-red-500 text-red-500 hover:bg-red-500/10" 
                    : "border-white/20 hover:bg-white/10"
                )}
              >
                <Heart size={18} className={cn(isInWishlist ? "fill-current" : "")} />
                <span>{isInWishlist ? "Saved in Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>
            
            {/* Product details accordion - This would be expanded in the full version */}
            <div className="mt-6 border-t border-gray-800 pt-6 space-y-4">
              {/* Shipping information */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect width="16" height="13" x="4" y="6" rx="2" />
                    <path d="M16 6V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1" />
                    <path d="M12 11v4" />
                    <path d="M12 3v3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Free Shipping</h4>
                  <p className="text-xs text-gray-400 mt-1">Orders over $50 qualify for free shipping.</p>
                </div>
              </div>
              
              {/* Returns information */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M20.42 4.58A5.4 5.4 0 0 0 16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3a5.4 5.4 0 0 0-3.92 1.58"/>
                    <path d="m22 8-5 5-5-5"/>
                    <path d="M8 16H2"/>
                    <path d="m3 13-1 3 3-1"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Easy Returns</h4>
                  <p className="text-xs text-gray-400 mt-1">Return within 30 days for a full refund.</p>
                </div>
              </div>
            </div>
            
            {/* View full details link */}
            <div className="mt-6 text-center">
              <Link 
                href={`/product/${product.slug}`}
                className="text-gray-400 hover:text-white text-sm underline transition"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Dialog>
  );
}

export default QuickView; 
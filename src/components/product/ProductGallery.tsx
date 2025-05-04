"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, Maximize, Minimize, Maximize2, RefreshCw, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { SizeGuideDialog } from "@/components/product/SizeGuideDialog";

interface ProductGalleryProps {
  product: Product;
  initialImage?: number;
  className?: string;
}

export function ProductGallery({ 
  product, 
  initialImage = 0, 
  className 
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') {
          navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
          navigateImage(1);
        } else if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage]);

  // Navigate through images with proper boundary checks
  const navigateImage = (direction: number) => {
    setSelectedImage((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return product.images.length - 1;
      if (newIndex >= product.images.length) return 0;
      return newIndex;
    });
    
    // Reset loading state for the new image
    setIsImageLoading(true);
  };

  const handleThumbnailClick = (index: number) => {
    if (index !== selectedImage) {
      setSelectedImage(index);
      setIsImageLoading(true);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  // Determine product type for size guide
  const getProductType = () => {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('beanie')) return 'beanie';
    if (category.includes('cap')) return 'cap';
    if (category.includes('snapback')) return 'snapback';
    return 'hat';
  };

  return (
    <div className={cn("space-y-4", className)} ref={galleryRef}>
      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {/* Image Navigation Buttons */}
        <div className="absolute inset-0 z-10 flex justify-between items-center px-4 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/80 text-black shadow-md"
            onClick={() => navigateImage(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/80 text-black shadow-md"
            onClick={() => navigateImage(1)}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Action Buttons (Fullscreen + Size Guide) */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
          {/* Size Guide Button */}
          <SizeGuideDialog
            productType={getProductType()}
            productImage={product.images[0]}
            trigger={
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/80 text-black shadow-md"
                aria-label="View size guide"
              >
                <Ruler className="h-4 w-4" />
              </Button>
            }
          />
          
          {/* Fullscreen Button */}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 text-black shadow-md"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Main Product Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={product.images[selectedImage]}
              alt={`${product.name} - Image ${selectedImage + 1}`}
              fill
              priority={selectedImage === 0}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className={cn(
                "object-cover transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Loading Indicator */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Thumbnails Row */}
      {product.images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {product.images.map((image, index) => (
            <button
              key={`thumb-${index}`}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all hover:opacity-90",
                selectedImage === index ? "border-black" : "border-transparent"
              )}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedImage === index}
            >
              <Image
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div 
              className="relative w-full h-full max-w-4xl max-h-4xl p-8 md:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Navigation */}
              <div className="absolute inset-0 z-10 flex justify-between items-center px-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/50 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage(-1);
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/50 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage(1);
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white"
                onClick={() => setIsFullscreen(false)}
                aria-label="Close fullscreen view"
              >
                <ChevronLeft className="h-6 w-6 rotate-90" />
              </Button>
              
              {/* Fullscreen Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} - Fullscreen Image ${selectedImage + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              
              {/* Thumbnail Indicators */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={`fullscreen-indicator-${index}`}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-colors",
                      selectedImage === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={selectedImage === index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
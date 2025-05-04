"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TouchCarousel from "@/components/ui/touch-carousel";
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TouchProductGalleryProps {
  images: string[];
  productName: string;
  aspectRatio?: string;
  className?: string;
}

const TouchableImage = memo(({ 
  src, 
  alt, 
  isZoomed, 
  zoomPosition,
  priority,
  sizes,
  onClick 
}: { 
  src: string;
  alt: string;
  isZoomed: boolean;
  zoomPosition: { x: number; y: number };
  priority?: boolean;
  sizes: string;
  onClick?: () => void;
}) => (
  <Image 
    src={src}
    alt={alt}
    fill
    priority={priority}
    sizes={sizes}
    className={cn(
      "object-cover transition-all duration-300",
      isZoomed && "scale-150"
    )}
    style={
      isZoomed 
        ? { 
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
          } 
        : undefined
    }
    onClick={onClick}
  />
));

TouchableImage.displayName = "TouchableImage";

const Thumbnail = memo(({ 
  image, 
  index, 
  productName, 
  isSelected, 
  onClick 
}: {
  image: string;
  index: number;
  productName: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden",
      "transition-all duration-200",
      isSelected ? "ring-2 ring-black" : "ring-1 ring-gray-200",
      "hover:ring-gray-400"
    )}
    aria-label={`View ${productName} - image ${index + 1}`}
    aria-current={isSelected ? "true" : "false"}
  >
    <Image
      src={image}
      alt={`${productName} thumbnail ${index + 1}`}
      fill
      sizes="80px"
      className="object-cover"
    />
  </button>
));

Thumbnail.displayName = "Thumbnail";

export function TouchProductGallery({
  images,
  productName,
  aspectRatio = "square",
  className,
}: TouchProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Define aspect ratio value
  const aspectRatioValue = aspectRatio === "square" ? "1/1" : 
                          aspectRatio === "portrait" ? "3/4" : 
                          aspectRatio === "landscape" ? "4/3" : 
                          aspectRatio;
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Hide swipe hint after 3 seconds or after first interaction
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);
  
  // Reset zoom when selected image changes
  useEffect(() => {
    if (isZoomed) setIsZoomed(false);
  }, [selectedImageIndex, isZoomed]);
  
  // Close zoom when lightbox opens
  useEffect(() => {
    if (isLightboxOpen && isZoomed) setIsZoomed(false);
  }, [isLightboxOpen, isZoomed]);
  
  // Handle image zoom
  const handleZoomToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
    
    if (!isZoomed) {
      // Set initial zoom position to center if zooming in
      const container = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - container.left) / container.width) * 100;
      const y = ((e.clientY - container.top) / container.height) * 100;
      setZoomPosition({ x, y });
    }
  }, [isZoomed]);
  
  // Handle mouse move for zoom effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed) return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    setZoomPosition({ x, y });
  }, [isZoomed]);
  
  // Handle thumbnail click
  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setShowSwipeHint(false);
  }, []);
  
  // Handle carousel change
  const handleCarouselChange = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setShowSwipeHint(false);
  }, []);
  
  // Handle lightbox toggle
  const handleLightboxToggle = useCallback(() => {
    setIsLightboxOpen(!isLightboxOpen);
    setShowSwipeHint(false);
  }, [isLightboxOpen]);
  
  // Gallery items for the main carousel
  const carouselItems = images.map((image, index) => (
    <div 
      key={index} 
      className="relative w-full h-full"
      onClick={() => !isZoomed && handleLightboxToggle()}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isZoomed ? "zoom-out" : "zoom-in"
      }}
    >
      <TouchableImage 
        src={image}
        alt={`${productName} - view ${index + 1}`}
        isZoomed={isZoomed && selectedImageIndex === index}
        zoomPosition={zoomPosition}
        priority={index === 0}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  ));
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image carousel */}
      <div 
        className="relative" 
        aria-label={`Product gallery for ${productName}`}
        role="region"
      >
        <TouchCarousel
          items={carouselItems}
          initialIndex={selectedImageIndex}
          aspectRatio={aspectRatioValue}
          className="bg-gray-100 rounded-md overflow-hidden"
          slideClassName={isZoomed ? "pointer-events-none" : ""}
          showDots={false}
          autoplay={false}
          loop={false}
          onChange={handleCarouselChange}
        />
        
        {/* Swipe hint for mobile - shown only initially */}
        {showSwipeHint && isMobile && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Swipe to view more</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        )}
        
        {/* Zoom button */}
        <button
          type="button"
          onClick={handleZoomToggle}
          className={cn(
            "absolute bottom-4 right-4 z-20",
            "p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md",
            "text-gray-800 hover:text-black hover:bg-white",
            "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          )}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          {isZoomed ? (
            <ZoomOut className="h-5 w-5" />
          ) : (
            <ZoomIn className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Thumbnails */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar"
        aria-label="Product thumbnails"
      >
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            index={index}
            productName={productName}
            isSelected={selectedImageIndex === index}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={handleLightboxToggle}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} fullscreen gallery`}
          >
            <div 
              className="relative w-full max-w-4xl h-full max-h-[80vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <TouchCarousel
                items={images.map((image, index) => (
                  <div key={index} className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${productName} - view ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-contain"
                    />
                  </div>
                ))}
                initialIndex={selectedImageIndex}
                className="bg-transparent h-full"
                aspectRatio="auto"
                showArrows={true}
                showDots={true}
                loop={true}
              />
              
              <button
                type="button"
                onClick={handleLightboxToggle}
                className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="Close lightbox"
                style={{ minWidth: "44px", minHeight: "44px" }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default memo(TouchProductGallery); 
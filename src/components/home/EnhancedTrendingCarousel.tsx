"use client";

import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import QuickView from '@/components/shop/QuickView';
import { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TrendingProductCard from './TrendingProductCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ProductCarouselSkeleton } from '@/components/shop/ProductCardSkeleton';

interface EnhancedTrendingCarouselProps {
  products: Product[];
  title?: string;
  showShopAll?: boolean;
  autoplaySpeed?: number;
  isLoading?: boolean;
}

export function EnhancedTrendingCarousel({ 
  products, 
  title = "Trending Now", 
  showShopAll = true,
  autoplaySpeed = 60,
  isLoading = false
}: EnhancedTrendingCarouselProps) {
  // State for interactions
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Responsive layout detection
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');

  // Adjust card width based on screen size
  const cardWidth = isSmallScreen ? 240 : isMediumScreen ? 280 : 320;
  const cardGap = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;
  
  // Create a duplicated array for proper infinite scroll
  const duplicatedProducts = [...products, ...products];

  console.log("Trending products in carousel:", products.map(p => ({
    id: p.id, 
    name: p.name, 
    price: p.price, 
    discount: p.discount
  })));

  // Handle opening the quick view dialog
  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
    setHasInteracted(true);
    setIsAutoScrolling(false);
  };

  // Get current product for quick view
  const getCurrentQuickViewProduct = () => {
    if (!quickViewProductId) return null;
    
    const product = products.find(p => p.id === quickViewProductId);
    return product || null;
  };

  // Reset auto-scrolling when user interaction ends
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        setIsAutoScrolling(true);
        setHasInteracted(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  // Touch and drag handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    
    setIsPaused(true);
    setIsAutoScrolling(false);
    setHasInteracted(true);
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !trackRef.current) return;
    
    setIsDragging(false);
    
    // If swiped far enough, scroll to the next/prev items
    if (Math.abs(translateX) > cardWidth / 3) {
      const direction = translateX > 0 ? 1 : -1;
      scrollCarousel(direction);
    }
    
    setTranslateX(0);
    
    // Re-enable auto-scrolling after a delay
    setTimeout(() => {
      setIsPaused(false);
      setHasInteracted(false);
      setIsAutoScrolling(true);
    }, 5000);
  };

  // Manual scroll functionality
  const scrollCarousel = (direction: number) => {
    if (!carouselRef.current || !trackRef.current) return;
    
    const scrollAmount = direction * (cardWidth + cardGap);
    const currentScroll = carouselRef.current.scrollLeft;
    
    carouselRef.current.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-8 sm:py-10 lg:py-16 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-wide">
            {title}
          </h2>
          <div className="h-[2px] w-full max-w-[80px] bg-gray-200 dark:bg-zinc-800 mt-3 relative">
            <motion.div 
              className="absolute h-[2px] bg-gray-900 dark:bg-white inset-0"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <motion.p 
            className="text-gray-600 dark:text-zinc-400 mt-3 text-center max-w-md mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover our most popular styles that everyone is wearing right now
          </motion.p>
        </motion.div>
      </div>

      {/* Show skeleton during loading */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ProductCarouselSkeleton />
        </div>
      ) : (
        <div 
          className="relative group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Left and Right Arrow Controls - appear on hover */}
          <AnimatePresence>
            {showControls && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/90 border border-white/10 hidden sm:flex"
                  onClick={() => scrollCarousel(1)}
                  aria-label="Previous products"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/90 border border-white/10 hidden sm:flex"
                  onClick={() => scrollCarousel(-1)}
                  aria-label="Next products"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Inner carousel container with scrolling track */}
          <div 
            className="carousel-container w-full overflow-hidden py-4 sm:py-6 mb-2.5 relative"
            onMouseEnter={() => {
              setIsPaused(true);
              setHasInteracted(true);
              setIsAutoScrolling(false);
            }}
            onMouseLeave={() => {
              setIsPaused(false);
              setHasInteracted(true);
              // Auto-scrolling will resume after timeout
            }}
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              ref={trackRef}
              className={cn(
                "carousel-track flex gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-10 will-change-transform",
                (isPaused || !isAutoScrolling) ? 'paused' : '',
                isDragging ? 'touch-none' : ''
              )}
              style={{
                animationDuration: `${autoplaySpeed}s`,
                transform: isDragging ? `translateX(${translateX}px)` : undefined
              }}
            >
              {duplicatedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className={cn(
                    "product-card-wrapper flex-shrink-0 relative z-[1] p-1",
                    isSmallScreen 
                      ? "w-[240px] h-[400px]" 
                      : isMediumScreen 
                        ? "w-[280px] h-[430px]" 
                        : "w-[320px] h-[460px]"
                  )}
                  style={{ 
                    width: `${cardWidth}px`,
                    height: isSmallScreen ? '400px' : isMediumScreen ? '430px' : '460px'
                  }}
                >
                  <TrendingProductCard 
                    product={product} 
                    index={index % products.length} 
                    onQuickView={handleQuickView}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shop All button - Refactored Styling */}
      {showShopAll && (
        <div className="w-full mt-4 sm:mt-6 lg:mt-8 flex justify-center">
          <Link href="/products" className="inline-block" passHref>
            <Button 
              variant="outline" 
              className="group border border-white/20 bg-transparent hover:bg-white/5 text-white min-w-[180px] relative overflow-hidden"
              size={isSmallScreen ? "default" : "lg"}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Shop All Products 
                <ArrowRight className="w-4 h-4 inline-block transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </Link>
        </div>
      )}

      {/* Quick View Dialog */}
      <AnimatePresence>
        {quickViewProductId && (
          <QuickView 
            product={getCurrentQuickViewProduct()} 
            isOpen={!!quickViewProductId}
            onClose={() => setQuickViewProductId(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        
        /* Carousel Styling */
        .carousel-track {
          animation: infiniteScroll 60s linear infinite;
          transition: transform 0.3s ease-out;
        }

        .carousel-track.paused {
          animation-play-state: paused;
        }
        
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .carousel-track {
            animation-duration: 40s;
          }
        }
        
        /* Improve touch interaction feedback */
        .carousel-track.touch-none {
          animation-play-state: paused;
          transition: transform 0.1s linear;
        }
      `}</style>
    </section>
  );
}

export default EnhancedTrendingCarousel; 
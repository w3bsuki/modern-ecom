"use client";

import React, { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TouchCarouselProps {
  items: ReactNode[] | JSX.Element[];
  initialIndex?: number;
  className?: string;
  slideClassName?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  onChange?: (index: number) => void;
}

const TouchCarousel = ({
  items,
  initialIndex = 0,
  className,
  slideClassName,
  aspectRatio = "1/1",
  autoplay = false,
  autoplayInterval = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
  onChange,
}: TouchCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  
  const itemCount = items.length;
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Go to a specific slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0) {
      index = loop ? itemCount - 1 : 0;
    } else if (index >= itemCount) {
      index = loop ? 0 : itemCount - 1;
    }
    
    setCurrentIndex(index);
    controls.start({ 
      x: `${-index * 100}%`,
      transition: { type: "spring", damping: 30, stiffness: 300 }
    });
    onChange?.(index);
  }, [controls, itemCount, loop, onChange]);
  
  // Reset autoplay timer when the index changes
  const resetAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    if (autoplay && itemCount > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        goToSlide((currentIndex + 1) % itemCount);
      }, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, currentIndex, itemCount, goToSlide]);
  
  // Set up autoplay on mount and cleanup on unmount
  useEffect(() => {
    resetAutoplayTimer();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [resetAutoplayTimer]);
  
  // Pause autoplay on interaction
  const pauseAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);
  
  // Resume autoplay after interaction
  const resumeAutoplay = useCallback(() => {
    if (autoplay) {
      resetAutoplayTimer();
    }
  }, [autoplay, resetAutoplayTimer]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === carouselRef.current) {
        if (e.key === "ArrowLeft") {
          goToSlide(currentIndex - 1);
          e.preventDefault();
        } else if (e.key === "ArrowRight") {
          goToSlide(currentIndex + 1);
          e.preventDefault();
        } else if (e.key === "Home") {
          goToSlide(0);
          e.preventDefault();
        } else if (e.key === "End") {
          goToSlide(itemCount - 1);
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goToSlide, itemCount]);
  
  // Enhanced swipe gesture handling with better threshold calculation
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Calculate dynamic threshold based on screen size (percentage of screen width)
    const screenWidth = window.innerWidth;
    const percentThreshold = 0.15; // 15% of screen width
    const threshold = Math.max(40, screenWidth * percentThreshold);
    
    // Velocity threshold adjusted for different devices
    const velocityThreshold = isMobile ? 0.3 : 0.5;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      // Strong enough swipe
      if (info.offset.x > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    } else {
      // If the swipe wasn't strong enough, snap back
      controls.start({ 
        x: `${-currentIndex * 100}%`,
        transition: { type: "spring", damping: 30, stiffness: 400 }
      });
    }
    
    // Resume autoplay if enabled
    resumeAutoplay();
  };
  
  // Fallback touch handling for devices where drag might not work well
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const element = carouselRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      pauseAutoplay();
      touchStartXRef.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartXRef.current;
      
      // Calculate dynamic threshold based on screen size
      const screenWidth = window.innerWidth;
      const threshold = Math.max(50, screenWidth * 0.1); // 10% of screen width or minimum 50px
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          goToSlide(currentIndex - 1);
        } else {
          goToSlide(currentIndex + 1);
        }
      }
      
      touchStartXRef.current = null;
      resumeAutoplay();
    };
    
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, goToSlide, pauseAutoplay, resumeAutoplay]);
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden touch-pan-y", 
        className
      )}
      style={{ aspectRatio }}
      ref={carouselRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocus={pauseAutoplay}
      onBlur={resumeAutoplay}
    >
      <motion.div
        className="flex h-full w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        animate={controls}
        initial={{ x: `${-initialIndex * 100}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onDragEnd={handleDragEnd}
        onDragStart={pauseAutoplay}
        style={{ x: `${-currentIndex * 100}%` }}
      >
        {items.map((item, index) => {
          const isCurrentSlide = currentIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 w-full h-full", 
                slideClassName
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${itemCount}`}
              aria-hidden={isCurrentSlide ? "false" : "true"}
            >
              {item}
            </div>
          );
        })}
      </motion.div>
      
      {/* Navigation arrows */}
      {showArrows && itemCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => { pauseAutoplay(); goToSlide(currentIndex - 1); resumeAutoplay(); }}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-10",
              "p-2 md:p-3 rounded-full bg-white/80 shadow-md backdrop-blur-sm",
              "text-gray-800 hover:text-black hover:bg-white",
              "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
              "transition-opacity duration-300",
              (!loop && currentIndex === 0) ? "opacity-50 cursor-not-allowed" : "opacity-80"
            )}
            disabled={!loop && currentIndex === 0}
            aria-label="Previous slide"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => { pauseAutoplay(); goToSlide(currentIndex + 1); resumeAutoplay(); }}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-10",
              "p-2 md:p-3 rounded-full bg-white/80 shadow-md backdrop-blur-sm",
              "text-gray-800 hover:text-black hover:bg-white",
              "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
              "transition-opacity duration-300",
              (!loop && currentIndex === itemCount - 1) ? "opacity-50 cursor-not-allowed" : "opacity-80"
            )}
            disabled={!loop && currentIndex === itemCount - 1}
            aria-label="Next slide"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      
      {/* Dots navigation */}
      {showDots && itemCount > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {Array.from({ length: itemCount }).map((_, index) => {
            const isSelected = currentIndex === index;
            return (
              <button
                key={index}
                onClick={() => { pauseAutoplay(); goToSlide(index); resumeAutoplay(); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 focus:outline-none",
                  "focus:ring-2 focus:ring-black focus:ring-offset-2",
                  isSelected 
                    ? "bg-black w-6" 
                    : "bg-gray-400 hover:bg-gray-700"
                )}
                style={{ minWidth: "8px", minHeight: "8px" }}
                role="tab"
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isSelected ? "true" : "false"}
                aria-controls={`carousel-slide-${index}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TouchCarousel; 
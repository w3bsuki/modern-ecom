"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/types/product';

interface RecentlyViewedProductsProps {
  className?: string;
  currentProductId?: string; // Optional, to exclude current product
}

export function RecentlyViewedProducts({ 
  className, 
  currentProductId 
}: RecentlyViewedProductsProps) {
  const { products = [] } = useRecentlyViewed();
  const [isMounted, setIsMounted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Filter out current product if provided
  const filteredProducts = isMounted && currentProductId 
    ? products.filter(product => product.id !== currentProductId)
    : isMounted ? products : [];
  
  // Don't show if no products or only one product that is the current product
  const hasProducts = filteredProducts.length > 0;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Scroll handlers
  const scrollLeft = () => {
    if (!isMounted) return;
    const container = document.getElementById('recently-viewed-container');
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 250);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (!isMounted) return;
    const container = document.getElementById('recently-viewed-container');
    if (container) {
      const newPosition = Math.min(
        container.scrollWidth - container.clientWidth,
        scrollPosition + 250
      );
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  // Handle scroll event to update position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };
  
  // Don't render anything if no products to show
  if (!isMounted || !hasProducts) return null;
  
  return (
    <div className={cn("py-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recently Viewed</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div
        id="recently-viewed-container"
        className="flex space-x-4 overflow-x-auto hide-scrollbar pb-1"
        onScroll={handleScroll}
      >
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="flex-shrink-0 w-[180px] group"
          >
            <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="180px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <h3 className="text-sm font-medium line-clamp-1 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
              {product.name}
            </h3>
            
            <div className="mt-1 text-sm">
              {product.salePrice ? (
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{formatPrice(product.salePrice)}</span>
                  <span className="text-gray-500 line-through text-xs">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="font-medium">{formatPrice(product.price)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewedProducts; 
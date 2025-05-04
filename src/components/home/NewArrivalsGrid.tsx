"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../home/ProductGrid";

interface NewArrivalsGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function NewArrivalsGrid({ title, subtitle, products }: NewArrivalsGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Need at least 8 products for smooth infinite scrolling
  const extendedProducts = products.length < 8 
    ? [...products, ...products].slice(0, Math.max(8, products.length * 2)) 
    : products;
  
  // Calculate how many products to display at once
  const visibleProducts = 4;
  const maxIndex = extendedProducts.length - visibleProducts;
  
  // Auto scroll function
  useEffect(() => {
    const startAutoScroll = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setActiveIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            // If we reach the end, loop back to the beginning
            return nextIndex > maxIndex ? 0 : nextIndex;
          });
        }
      }, 3000); // Scroll every 3 seconds
    };
    
    startAutoScroll();
    
    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, maxIndex]);
  
  // Handle navigation
  const handlePrev = () => {
    setIsPaused(true); // Pause auto-scrolling when user interacts
    setActiveIndex(prev => {
      const newIndex = prev - 1;
      return newIndex < 0 ? maxIndex : newIndex;
    });
    
    // Resume auto-scrolling after delay
    setTimeout(() => setIsPaused(false), 5000);
  };
  
  const handleNext = () => {
    setIsPaused(true); // Pause auto-scrolling when user interacts
    setActiveIndex(prev => {
      const newIndex = prev + 1;
      return newIndex > maxIndex ? 0 : newIndex;
    });
    
    // Resume auto-scrolling after delay
    setTimeout(() => setIsPaused(false), 5000);
  };
  
  const displayProducts = extendedProducts.slice(activeIndex, activeIndex + visibleProducts);
  
  return (
    <section className="py-16 w-full bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrev} 
              className="p-2 border border-white/20 hover:bg-white/10"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext} 
              className="p-2 border border-white/20 hover:bg-white/10"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex transition-all duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * (100 / visibleProducts)}%)` }}>
        {extendedProducts.map((product, idx) => (
          <Link 
            href={`/product/${product.slug}`} 
            key={`${product.id}-${idx}`}
            className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 group relative px-0.5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="aspect-square bg-zinc-800 overflow-hidden relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 grayscale"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="text-lg font-bold">{product.name}</div>
              <div className="flex items-center gap-2 mt-1">
                {product.sizes && (
                  <div className="text-xs text-gray-400">{product.sizes.join(", ")}</div>
                )}
                <div className="ml-auto font-medium">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-0 p-2">
              {product.isNew && (
                <div className="bg-white text-black px-2 py-1 text-xs font-bold">
                  NEW
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <Link 
          href="/products"
          className="inline-block border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors duration-200"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}

export default NewArrivalsGrid; 
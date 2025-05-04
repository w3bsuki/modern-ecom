"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
  products: Product[];
  title?: string;
}

export function RelatedProducts({
  currentProductId,
  category,
  products,
  title = "You Might Also Like"
}: RelatedProductsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter related products - either by category or show any products that aren't the current one
  const relatedProducts = products
    .filter(product => 
      product.id !== currentProductId && 
      (category ? product.collections?.includes(category) : true)
    )
    .slice(0, 8);

  // Handle carousel scroll
  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollTo = direction === "left" 
      ? scrollLeft - clientWidth * 0.8 
      : scrollLeft + clientWidth * 0.8;
    
    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: "smooth"
    });
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If no related products or not mounted yet, don't render
  if (!isMounted || relatedProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => scroll("left")}
            variant="outline"
            size="icon"
            className="hidden md:flex h-9 w-9 rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => scroll("right")}
            variant="outline"
            size="icon"
            className="hidden md:flex h-9 w-9 rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4 -mx-4 px-4"
      >
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 * (index > 5 ? 5 : index) }}
            className="min-w-[260px] max-w-[260px] snap-start"
          >
            <Link 
              href={`/product/${product.slug}`} 
              className="group block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 80vw, 260px"
                />
                
                {product.isNew && (
                  <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                )}
                
                {product.isSale && product.salePrice && (
                  <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% Off
                  </div>
                )}
                
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 z-10 flex items-center bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular Choice
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                  {product.name}
                </h3>
                
                <div className="flex items-baseline mt-1">
                  {product.salePrice ? (
                    <>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 line-through text-sm ml-2">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={cn(
                            "h-3 w-3",
                            star <= Math.round(product.rating || 4)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center md:hidden">
        <Button
          variant="outline"
          onClick={() => scroll("right")}
          className="w-full"
        >
          View More
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default RelatedProducts; 
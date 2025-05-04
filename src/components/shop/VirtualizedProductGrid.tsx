"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Product } from '@/lib/types';
import ShopProductCard from './ShopProductCard';
import QuickView from './QuickView';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCardSkeleton from './ProductCardSkeleton';

interface VirtualizedProductGridProps {
  products: Product[];
  title?: string;
  gridClassName?: string;
  viewMode?: "grid" | "compact" | "list";
}

export function VirtualizedProductGrid({
  products,
  title,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  viewMode = "grid"
}: VirtualizedProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [columns, setColumns] = useState(4);
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Determine column count based on viewport width
  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) return 1; // mobile
      if (width < 768) return 2; // tablet
      if (width < 1024) return 3; // small desktop
      return 4; // large desktop
    };

    setColumns(calculateColumns());
    const handleResize = () => setColumns(calculateColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save scroll position when unmounting and restore when mounting
  useEffect(() => {
    if (parentRef.current && scrollPosition > 0) {
      parentRef.current.scrollTop = scrollPosition;
    }
    
    return () => {
      if (parentRef.current) {
        setScrollPosition(parentRef.current.scrollTop);
      }
    };
  }, [scrollPosition]);

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  // If in list view mode, use list virtualizer
  if (viewMode === "list") {
    // Calculate estimated row heights for list view
    const estimatedSize = 150; // Average height of a list item
    
    const rowVirtualizer = useVirtualizer({
      count: products.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => estimatedSize,
      overscan: 5, // Pre-render additional items for smoother scrolling
    });
    
    return (
      <div className="w-full">
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
          </div>
        )}
        
        <div 
          ref={parentRef} 
          className="overflow-auto w-full"
          style={{ height: '800px' }} // Adjust height as needed
          tabIndex={0} // Ensure focusable for keyboard navigation
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ShopProductCard
                  product={products[virtualRow.index]}
                  onQuickView={handleQuickView}
                  viewMode="list"
                />
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {quickViewProduct && (
            <QuickView 
              product={quickViewProduct} 
              isOpen={!!quickViewProduct} 
              onClose={() => setQuickViewProduct(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  // For grid view, use grid virtualizer
  // Calculate items per row based on columns
  const itemsPerRow = columns;
  const rows = Math.ceil(products.length / itemsPerRow);
  const estimatedRowHeight = viewMode === "compact" ? 300 : 400; // Adjust based on your card height
  
  const gridVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 3, // Pre-render additional rows for smoother scrolling
  });
  
  // Function to get grid items for a specific row
  const getItemsForRow = (rowIndex: number) => {
    const startIndex = rowIndex * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, products.length);
    return Array.from({ length: endIndex - startIndex }, (_, i) => products[startIndex + i]);
  };
  
  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
        </div>
      )}
      
      <div 
        ref={parentRef} 
        className="overflow-auto w-full"
        style={{ height: '800px' }} // Adjust height as needed
        tabIndex={0} // Ensure focusable for keyboard navigation
      >
        <div
          style={{
            height: `${gridVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {gridVirtualizer.getVirtualItems().map(virtualRow => {
            const rowItems = getItemsForRow(virtualRow.index);
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className={gridClassName}>
                  {rowItems.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: idx * 0.05 
                      }}
                    >
                      <ShopProductCard
                        product={product}
                        onQuickView={handleQuickView}
                        viewMode={viewMode === 'compact' ? 'compact' : 'grid'}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickView 
            product={quickViewProduct} 
            isOpen={!!quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
} 
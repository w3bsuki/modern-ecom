"use client";

import React, { useState, useRef, useEffect } from 'react';
import ShopProductCard from './ShopProductCard';
import QuickView from './QuickView';
import { Product } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';

interface ShopProductGridProps {
  products: Product[];
  title?: string;
  gridClassName?: string;
  viewMode?: "grid" | "compact" | "list";
}

export function ShopProductGrid({ 
  products, 
  title,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  viewMode = "grid"
}: ShopProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);
  const [useVirtualization, setUseVirtualization] = useState(products.length > 16);

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  // Determine column count based on viewport width
  useEffect(() => {
    const calculateColumns = () => {
      // These breakpoint values should match your Tailwind config
      const width = window.innerWidth;
      if (width < 640) return 1; // mobile
      if (width < 1024) return 2; // sm
      if (width < 1280) return 3; // lg
      return 4; // xl
    };

    setColumns(calculateColumns());
    const handleResize = () => setColumns(calculateColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If in list view mode, or if we have a small number of products, use the regular grid
  if (viewMode === "list" || !useVirtualization) {
    return (
      <div className="w-full">
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
          </div>
        )}
        
        <div className={gridClassName}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShopProductCard
                product={product}
                onQuickView={handleQuickView}
                viewMode={viewMode === 'list' ? 'list' : 'grid'}
              />
            </motion.div>
          ))}
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

  // For the virtualized grid view
  const getItemSizeEstimate = () => {
    return viewMode === "compact" ? 300 : 380; // Approximate height of product cards
  };

  // Custom overscan to prefetch more items
  const overscan = 5;

  // Get class names for each item based on the view mode
  const getItemClassName = () => {
    switch (viewMode) {
      case "compact":
        return "pb-4";
      case "grid":
      default:
        return "pb-6";
    }
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
        </div>
      )}
      
      {viewMode === "list" ? (
        // Virtualized List View
        <Virtuoso
          style={{ height: '800px' }} // You might want to adjust or make this dynamic
          totalCount={products.length}
          overscan={overscan}
          itemContent={index => (
            <div className="py-2">
              <ShopProductCard
                product={products[index]}
                onQuickView={handleQuickView}
                viewMode="list"
              />
            </div>
          )}
        />
      ) : (
        // Virtualized Grid View
        <div ref={gridRef}>
          <VirtuosoGrid
            style={{ height: '800px' }} // Adjust height as needed
            totalCount={products.length}
            overscan={overscan}
            listClassName={gridClassName}
            itemClassName={getItemClassName()}
            itemContent={index => (
              <ShopProductCard
                product={products[index]}
                onQuickView={handleQuickView}
                viewMode={viewMode === 'compact' ? 'compact' : 'grid'}
              />
            )}
          />
        </div>
      )}

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

export default ShopProductGrid; 
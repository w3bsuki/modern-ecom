"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import ShopProductCard from './ShopProductCard';
import QuickView from './QuickView';
import ProductPagination from './ProductPagination';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface PaginatedProductGridProps {
  products: Product[];
  title?: string;
  gridClassName?: string;
  viewMode?: "grid" | "compact" | "list";
  productsPerPage?: number;
  preserveScroll?: boolean;
}

export function PaginatedProductGrid({
  products,
  title,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  viewMode = "grid",
  productsPerPage = 12,
  preserveScroll = true
}: PaginatedProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageProducts, setPageProducts] = useState<Product[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  // Handle page initialization and URL updates
  useEffect(() => {
    // Get page from URL if available
    const pageParam = searchParams.get('page');
    const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
    
    // Validate page number
    const validPage = Math.max(1, Math.min(initialPage, totalPages));
    setCurrentPage(validPage);
    
    // Update URL if page is invalid
    if (pageParam && initialPage !== validPage) {
      updatePageParam(validPage);
    }
  }, [searchParams, totalPages]);
  
  // Save scroll position when component unmounts
  useEffect(() => {
    if (preserveScroll) {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [preserveScroll]);
  
  // Restore scroll position after page change
  useEffect(() => {
    if (preserveScroll && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [pageProducts, preserveScroll, scrollPosition]);
  
  // Update products for current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, products.length);
    setPageProducts(products.slice(startIndex, endIndex));
    
    // Scroll to top on page change if not preserving scroll
    if (!preserveScroll) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, products, productsPerPage, preserveScroll]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    // Only update if page is valid
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updatePageParam(page);
    }
  };
  
  // Update URL with page parameter
  const updatePageParam = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1) {
      params.delete('page'); // Remove page param for first page
    } else {
      params.set('page', page.toString());
    }
    
    // Build new URL with updated params
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };
  
  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };
  
  // Calculate visibility text
  const startCount = (currentPage - 1) * productsPerPage + 1;
  const endCount = Math.min(startCount + pageProducts.length - 1, products.length);
  
  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
        </div>
      )}
      
      {products.length > 0 ? (
        <>
          {/* Product visibility counter */}
          <div className="text-sm text-gray-500 mb-6">
            Showing {startCount}-{endCount} of {products.length} products
          </div>
          
          {/* Products grid */}
          <div className={gridClassName}>
            {pageProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05 
                }}
              >
                <ShopProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  viewMode={viewMode === 'list' ? 'list' : 'grid'}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No products found.</p>
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

export default PaginatedProductGrid; 
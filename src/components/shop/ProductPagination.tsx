"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: ProductPaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis for better UX
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Handle edge cases for first or last pages
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }
    
    // Add ellipsis before range if needed
    if (startPage > 2) {
      pages.push('ellipsis1');
    }
    
    // Add range pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after range if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis2');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center space-x-1 mt-8 ${className}`} aria-label="Pagination">
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis1' || page === 'ellipsis2') {
          return (
            <span 
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-8 w-8"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
            className="h-8 w-8 font-medium text-sm"
          >
            {page}
          </Button>
        );
      })}
      
      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export default ProductPagination; 
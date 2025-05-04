"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductGridWithQuickView } from "../product/ProductGridWithQuickView";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import { Grid3X3, Grid2X2, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterableProductGridProps {
  products: Product[];
  filters: FilterGroup[];
  initialFilters?: Record<string, string[]>;
  initialPriceRange?: PriceRange;
  className?: string;
}

export function FilterableProductGrid({
  products: initialProducts,
  filters,
  initialFilters = {},
  initialPriceRange,
  className,
}: FilterableProductGridProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(initialFilters);
  const [priceRange, setPriceRange] = useState<PriceRange>(
    initialPriceRange || { min: 0, max: 500 }
  );
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [gridColumns, setGridColumns] = useState({ sm: 2, md: 3, lg: 3 });
  
  const activeFiltersCount = Object.values(activeFilters).reduce(
    (count, options) => count + options.length, 
    0
  );
  
  // Handle filter changes
  const handleFilterChange = (groupId: string, optionId: string) => {
    setLoading(true);
    
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      // Initialize the group if it doesn't exist
      if (!newFilters[groupId]) {
        newFilters[groupId] = [];
      }
      
      // Toggle the option's presence in the group
      if (newFilters[groupId].includes(optionId)) {
        newFilters[groupId] = newFilters[groupId].filter(id => id !== optionId);
        // Clean up empty groups
        if (newFilters[groupId].length === 0) {
          delete newFilters[groupId];
        }
      } else {
        newFilters[groupId].push(optionId);
      }
      
      return newFilters;
    });
  };
  
  // Handle price range changes
  const handlePriceChange = (range: PriceRange) => {
    setLoading(true);
    setPriceRange(range);
  };
  
  // Clear all filters
  const handleClearAll = () => {
    setLoading(true);
    setActiveFilters({});
    setPriceRange(initialPriceRange || { min: 0, max: 500 });
  };
  
  // Apply filters to products
  useEffect(() => {
    const applyFilters = () => {
      let result = [...initialProducts];
      
      // Apply category/attribute filters
      if (Object.keys(activeFilters).length > 0) {
        Object.entries(activeFilters).forEach(([groupId, selectedOptions]) => {
          if (selectedOptions.length === 0) return;
          
          switch (groupId) {
            case "categories":
              result = result.filter(product => 
                product.categories?.some(cat => selectedOptions.includes(cat))
              );
              break;
            case "colors":
              result = result.filter(product => 
                product.colors?.some(color => selectedOptions.includes(color))
              );
              break;
            case "sizes":
              result = result.filter(product => 
                product.sizes?.some(size => selectedOptions.includes(size))
              );
              break;
            // Add more filter types as needed
          }
        });
      }
      
      // Apply price filter
      result = result.filter(product => {
        const price = product.salePrice ?? product.price;
        return price >= priceRange.min && price <= priceRange.max;
      });
      
      // Apply sorting
      switch (sortOption) {
        case "price-asc":
          result.sort((a, b) => {
            const priceA = a.salePrice ?? a.price;
            const priceB = b.salePrice ?? b.price;
            return priceA - priceB;
          });
          break;
        case "price-desc":
          result.sort((a, b) => {
            const priceA = a.salePrice ?? a.price;
            const priceB = b.salePrice ?? b.price;
            return priceB - priceA;
          });
          break;
        case "newest":
          // If products have creation dates, sort by those
          if (result[0]?.createdAt) {
            result.sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
          }
          break;
        case "featured":
        default:
          // Featured products first, then normal sorting
          result.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          });
          break;
      }
      
      setFilteredProducts(result);
      setLoading(false);
    };
    
    // Delay filtering slightly to show loading state
    const timer = setTimeout(() => {
      applyFilters();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [initialProducts, activeFilters, priceRange, sortOption]);
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8", className)}>
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          priceRange={priceRange}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onClearAll={handleClearAll}
        />
      </div>
      
      {/* Product grid and controls */}
      <div className="flex flex-col">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
          {/* Filter button for mobile */}
          <div className="md:hidden">
            <MobileFilterDrawer
              filters={filters}
              activeFilters={activeFilters}
              priceRange={priceRange}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onClearAll={handleClearAll}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
          
          {/* Product count */}
          <div className="text-sm text-gray-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-gray-300">
                  <ArrowUpDown size={14} />
                  <span className="hidden sm:inline-block">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  className={cn(sortOption === "featured" && "font-medium")}
                  onClick={() => setSortOption("featured")}
                >
                  Featured
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(sortOption === "price-asc" && "font-medium")}
                  onClick={() => setSortOption("price-asc")}
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(sortOption === "price-desc" && "font-medium")}
                  onClick={() => setSortOption("price-desc")}
                >
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(sortOption === "newest" && "font-medium")}
                  onClick={() => setSortOption("newest")}
                >
                  Newest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Grid view controls */}
            <div className="hidden md:flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => setGridColumns({ sm: 2, md: 2, lg: 3 })}
                className={cn(
                  "p-1.5 flex items-center justify-center",
                  gridColumns.md === 2 ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                )}
                aria-label="Larger grid view"
                title="Larger grid view"
              >
                <Grid2X2 size={16} />
              </button>
              <button
                onClick={() => setGridColumns({ sm: 2, md: 3, lg: 4 })}
                className={cn(
                  "p-1.5 flex items-center justify-center",
                  gridColumns.md === 3 ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                )}
                aria-label="Compact grid view"
                title="Compact grid view"
              >
                <Grid3X3 size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {Object.entries(activeFilters).map(([groupId, options]) => 
              options.map(optionId => {
                // Find the option and group display names
                const group = filters.find(g => g.id === groupId);
                const option = group?.options.find(o => o.id === optionId);
                
                if (!group || !option) return null;
                
                return (
                  <div 
                    key={`${groupId}-${optionId}`} 
                    className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1.5"
                  >
                    <span className="text-xs">{group.name}: {option.label}</span>
                    <button
                      onClick={() => handleFilterChange(groupId, optionId)}
                      className="ml-1 text-gray-500 hover:text-black"
                      aria-label={`Remove ${option.label} filter`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-600 hover:text-black underline"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Product grid */}
        <div className="pt-6">
          <ProductGridWithQuickView
            products={filteredProducts}
            loading={loading}
            columns={gridColumns}
          />
        </div>
        
        {/* No results message */}
        {filteredProducts.length === 0 && !loading && (
          <div className="py-16 text-center">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or browse our categories below.</p>
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterableProductGrid; 
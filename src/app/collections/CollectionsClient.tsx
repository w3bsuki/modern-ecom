"use client";

import React, { useState, useEffect } from "react";
import { FilterOptions } from "@/components/shop/ProductFilter";
import ProductFilter from "@/components/shop/ProductFilter";
import { Product } from "@/types/product";
import { Grid, Grid3X3, List, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PaginatedProductGrid } from "@/components/shop/PaginatedProductGrid";
import { VirtualizedProductGrid } from "@/components/shop/VirtualizedProductGrid";

interface CollectionsClientProps {
  initialProducts: Product[];
  availableCollections: string[];
  availableSizes: string[];
  priceRanges: string[];
  viewModeClassNames: {
    grid: string;
    compact: string;
    list: string;
  };
  initialFilters: {
    collections: string[];
    sizes: string[];
    priceRanges: string[];
    inStock: boolean;
    onSale: boolean;
    newArrivals: boolean;
  };
  initialViewMode: "grid" | "compact" | "list";
  initialSortOrder: string;
}

export default function CollectionsClient({
  initialProducts,
  availableCollections,
  availableSizes,
  priceRanges,
  viewModeClassNames,
  initialFilters,
  initialViewMode,
  initialSortOrder,
}: CollectionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State for active filters
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    collections: initialFilters.collections,
    priceRanges: initialFilters.priceRanges,
    sizes: initialFilters.sizes,
    inStock: initialFilters.inStock,
    onSale: initialFilters.onSale,
    newArrivals: initialFilters.newArrivals,
  });

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  
  // State for sorted products
  const [sortedProducts, setSortedProducts] = useState<Product[]>(initialProducts);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">(initialViewMode);
  
  // State for sort order
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);

  // State for mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = 
    activeFilters.collections.length +
    activeFilters.priceRanges.length +
    activeFilters.sizes.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.newArrivals ? 1 : 0);

  // Determine the grid class based on the current view mode
  const currentGridClassName = viewModeClassNames[viewMode];
  
  // Function to update URL with current filters
  const updateURL = () => {
    const params = new URLSearchParams();
    
    // Add collection filters
    activeFilters.collections.forEach(col => {
      params.append('collection', col);
    });
    
    // Add size filters
    activeFilters.sizes.forEach(size => {
      params.append('size', size);
    });
    
    // Add price range filters
    activeFilters.priceRanges.forEach(price => {
      params.append('price', price);
    });
    
    // Add boolean filters
    if (activeFilters.inStock) params.set('inStock', 'true');
    if (activeFilters.onSale) params.set('onSale', 'true');
    if (activeFilters.newArrivals) params.set('newArrivals', 'true');
    
    // Add sort order
    if (sortOrder !== 'default') params.set('sort', sortOrder);
    
    // Add view mode
    if (viewMode !== 'grid') params.set('view', viewMode);
    
    // Update URL
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Updated filter handler matching the ProductFilter prop signature
  const handleFilterChange = (
    filterType: keyof FilterOptions,
    value: string | boolean,
    remove?: boolean
  ) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "collections" || filterType === "priceRanges" || filterType === "sizes") {
        const valueStr = value as string;
        const currentValues = [...newFilters[filterType]];
        
        if (remove) { // If remove flag is true, filter out the value
          newFilters[filterType] = currentValues.filter((item) => item !== valueStr);
        } else { // Otherwise, add the value if it doesn't exist
          if (!currentValues.includes(valueStr)) {
            newFilters[filterType] = [...currentValues, valueStr];
          }
        }
      } else {
        // Handle boolean filters (inStock, onSale, newArrivals)
        newFilters[filterType] = value as boolean;
      }
      return newFilters;
    });
  };

  // Reset filters function
  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      collections: [], priceRanges: [], sizes: [], 
      inStock: false, onSale: false, newArrivals: false
    };
    setActiveFilters(emptyFilters);
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "compact" | "list") => {
    setViewMode(mode);
  };

  // Update filtered products whenever activeFilters change
  useEffect(() => {
    const newFilteredProducts = initialProducts.filter((product) => {
      // Collection filter
      if (
        activeFilters.collections.length > 0 &&
        !activeFilters.collections.some((selectedCollectionName) => {
          if (!product.collections) return false;
          return product.collections.some(productCollectionRef => 
            productCollectionRef.toLowerCase() === selectedCollectionName.toLowerCase()
          );
        })
      ) {
        return false;
      }
  
      // Size filter
      if (
        activeFilters.sizes.length > 0 &&
        !activeFilters.sizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }
  
      // Price range filter
      if (activeFilters.priceRanges.length > 0) {
        let matchesPrice = false;
        for (const range of activeFilters.priceRanges) {
          if (
            (range === "Under $25" && product.price < 25) ||
            (range === "$25-$35" && product.price >= 25 && product.price <= 35) ||
            (range === "$35-$50" && product.price > 35 && product.price <= 50) ||
            (range === "Over $50" && product.price > 50)
          ) {
            matchesPrice = true;
            break;
          }
        }
        if (!matchesPrice) return false;
      }
  
      // In stock filter
      if (activeFilters.inStock && !product.inStock) {
        return false;
      }
  
      // On sale filter
      if (activeFilters.onSale && !product.isSale) {
        return false;
      }
  
      // New arrivals filter
      if (activeFilters.newArrivals && !product.isNew) {
        return false;
      }
  
      return true;
    });
    setFilteredProducts(newFilteredProducts);
  }, [activeFilters, initialProducts]);

  // Sort products whenever filteredProducts or sortOrder changes
  useEffect(() => {
    const newSortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setSortedProducts(newSortedProducts);
  }, [filteredProducts, sortOrder]);
  
  // Update URL whenever filters, sort order, or view mode changes
  useEffect(() => {
    updateURL();
  }, [activeFilters, sortOrder, viewMode]);

  // Should we use virtualization?
  const useVirtualization = sortedProducts.length > 50;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar - Moved above grid */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            className="flex items-center gap-1.5 bg-black border-white/30 hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filters"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 bg-white text-black text-xs font-bold py-0.5 px-1.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Desktop Filter Summary & Sort/View Controls */}
        <div className="flex items-center gap-4 flex-grow justify-end">
          {/* Item Count (Desktop) */}
          <div className="hidden lg:block text-sm text-gray-400">
            {sortedProducts.length} item{sortedProducts.length !== 1 ? 's' : ''}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-order" className="sr-only">Sort products</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={handleSortChange}
              className="appearance-none bg-black border border-white/30 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:border-white"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* View Mode Toggle (Desktop) */}
          <div className="hidden lg:flex items-center border border-white/30 rounded-md p-0.5" role="group" aria-label="Product view mode">
            {(["grid", "compact", "list"] as const).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="icon"
                onClick={() => handleViewModeChange(mode)}
                className={cn(
                  "h-7 w-7 rounded focus-visible:ring-offset-black",
                  viewMode === mode 
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/10 hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                )}
                aria-label={`Switch to ${mode} view`}
              >
                {mode === 'grid' && <Grid3X3 className="h-4 w-4" />}
                {mode === 'compact' && <Grid className="h-4 w-4" />}
                {mode === 'list' && <List className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <ProductFilter
            availableFilters={{ collections: availableCollections, sizes: availableSizes, priceRanges }}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
          {/* Reset button for desktop filters */}
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters} 
              className="mt-4 w-full text-xs h-auto py-1 px-2 text-gray-400 hover:text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-black"
            >
              Reset All Filters
            </Button>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Active Filters Display & Reset */}
          {activeFilterCount > 0 && (
            <div className="mb-4 flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium mr-2">Active Filters:</span>
              {Object.entries(activeFilters).flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                  return value.map(v => ({ key, value: v }));
                } else if (typeof value === 'boolean' && value) {
                  return [{ key, value }];
                }
                return [];
              }).map(({ key, value }) => (
                <Badge key={`${key}-${value}`} variant="outline" className="bg-white/10 border-white/30 text-white text-xs font-normal pl-2.5 pr-1.5 py-0.5">
                  {typeof value === 'boolean' ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : value}
                  <button 
                    onClick={() => handleFilterChange(key as keyof FilterOptions, value as string | boolean, true)} 
                    className="ml-1.5 text-white/70 hover:text-white rounded-full p-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white" 
                    aria-label={`Remove filter ${typeof value === 'boolean' ? key : value}`}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-xs h-auto py-1 px-2 text-gray-400 hover:text-white hover:bg-transparent focus-visible:ring-white focus-visible:ring-offset-black"
              >
                Reset All
              </Button>
            </div>
          )}

          {/* No Products Message */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>No products match your current filters.</p>
              <Button 
                variant="link" 
                onClick={resetFilters} 
                className="mt-2 text-white focus-visible:ring-white"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            /* Product Grid - Choose between virtualized or paginated based on product count */
            useVirtualization ? (
              <VirtualizedProductGrid
                products={sortedProducts}
                gridClassName={currentGridClassName}
                viewMode={viewMode}
              />
            ) : (
              <PaginatedProductGrid
                products={sortedProducts}
                gridClassName={currentGridClassName}
                viewMode={viewMode}
                productsPerPage={12}
              />
            )
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-black border-t border-white/20 rounded-t-2xl shadow-2xl z-50 lg:hidden overflow-y-auto pb-20 flex flex-col"
          >
            <div className="p-4 sticky top-0 bg-black z-10 border-b border-white/10 flex-shrink-0">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileFilterOpen(false)} 
                  className="text-white hover:bg-white/10 focus-visible:ring-white" 
                  aria-label="Close filters"
                >
                  <X size={20} />
                </Button>
              </div>
              {/* Product Count for Mobile */}
              <div className="text-sm text-gray-400">
                {sortedProducts.length} item{sortedProducts.length !== 1 ? 's' : ''} found
              </div>
            </div>
            <div className="p-4 flex-grow overflow-y-auto">
              <ProductFilter
                availableFilters={{ collections: availableCollections, sizes: availableSizes, priceRanges }}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                isMobile={true}
              />
            </div>
            {/* Sticky Footer for Apply/Reset */}
            <div className="sticky bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 flex gap-4 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={resetFilters} 
                className="flex-1 bg-black border-white/40 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                Reset Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              <Button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="flex-1 bg-white text-black hover:bg-gray-200 focus-visible:ring-black"
              >
                Show Results
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
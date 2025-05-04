import { collections } from "@/data/collections";
import { products } from "@/data/products";
import ShopProductGrid from "@/components/shop/ShopProductGrid";
import { Suspense } from "react";

// Define edge runtime for optimized global performance
export const runtime = 'edge';

export default async function CollectionsEdgePage() {
  // Pre-render all products on the server for the initial render
  // This simplifies the edge implementation while maintaining functionality

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden bg-black border-b border-white/20">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-grid-pattern"></div> 
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-center max-w-3xl">
            Shop Our Collection (Edge)
          </h1>
          <p className="max-w-md text-center text-base md:text-lg text-gray-300">
            Find the perfect hat for any style or occasion - served from the edge!
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
          <ClientSideCollections products={products} collections={collections} />
        </Suspense>
      </div>
    </div>
  );
}

// Client-side component that handles filtering functionality
"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Collection } from "@/lib/types";
import ProductFilter, { FilterOptions } from "@/components/shop/ProductFilter";
import { Grid, List, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define the available price ranges
const priceRanges = ["Under $25", "$25-$35", "$35-$50", "Over $50"];

// Define grid class names for different view modes
const viewModeClassNames = {
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  compact: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", // More compact grid
  list: "flex flex-col gap-4", // Vertical list layout
};

function ClientSideCollections({ 
  products,
  collections
}: { 
  products: Product[], 
  collections: Collection[] 
}) {
  // Get collections from the collections data
  const availableCollections = collections.map(collection => collection.name);

  // Get unique sizes for filter options
  const availableSizes = Array.from(
    new Set(products.flatMap((product) => product.sizes))
  );

  // State for active filters
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    collections: [],
    priceRanges: [],
    sizes: [],
    inStock: false,
    onSale: false,
    newArrivals: false,
  });

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // State for sorted products
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");
  
  // State for sort order
  const [sortOrder, setSortOrder] = useState<"default" | "price-asc" | "price-desc">("default");

  // State for mobile filter visibility
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  // State for mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Updated filter handler matching the new ProductFilter prop signature
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
    setSortOrder(e.target.value as "default" | "price-asc" | "price-desc");
  };

  // Update filtered products whenever activeFilters change
  useEffect(() => {
    const newFilteredProducts = products.filter((product) => {
      // Collection filter
      if (
        activeFilters.collections.length > 0 &&
        !activeFilters.collections.some((selectedCollectionName) => {
          if (!product.collections) return false;
          const collection = collections.find(c => c.name === selectedCollectionName);
          if (!collection) return false;
          return product.collections.some(productCollectionRef => 
            productCollectionRef === collection.id || 
            productCollectionRef.toLowerCase() === collection.slug.toLowerCase() ||
            productCollectionRef.toLowerCase() === collection.name.toLowerCase()
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
  }, [activeFilters, collections, products]);

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

  return (
    <>
      {/* Toolbar */}
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
          {/* Item Count */}
          <div className="hidden lg:block text-sm text-gray-400">
            {sortedProducts.length} item{sortedProducts.length !== 1 ? 's' : ''}
          </div>

          {/* Sort Options */}
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm hidden sm:inline">Sort by:</label>
            <div className="relative">
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className="appearance-none bg-black border border-white/30 rounded py-1.5 pl-3 pr-10 text-sm cursor-pointer hover:border-white focus:outline-none focus:ring-1 focus:ring-white"
              >
                <option value="default">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center border border-white/30 rounded">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-none h-8 w-8",
                viewMode === "grid" ? "bg-white text-black" : "text-white hover:bg-white/10"
              )}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("compact")}
              className={cn(
                "rounded-none h-8 w-8",
                viewMode === "compact" ? "bg-white text-black" : "text-white hover:bg-white/10"
              )}
              aria-label="Compact grid view"
            >
              <Grid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-none h-8 w-8",
                viewMode === "list" ? "bg-white text-black" : "text-white hover:bg-white/10"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content grid with filters */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-5">Filters</h2>
            <ProductFilter
              collections={availableCollections}
              sizes={availableSizes}
              priceRanges={priceRanges}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              resetFilters={resetFilters}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Active Filters - Desktop */}
          {activeFilterCount > 0 && (
            <div className="hidden lg:flex flex-wrap gap-2 mb-6">
              {activeFilters.collections.map((collection) => (
                <Badge 
                  key={`collection-${collection}`}
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  {collection}
                  <button 
                    onClick={() => handleFilterChange('collections', collection, true)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {activeFilters.priceRanges.map((range) => (
                <Badge 
                  key={`price-${range}`}
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  {range}
                  <button 
                    onClick={() => handleFilterChange('priceRanges', range, true)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {activeFilters.sizes.map((size) => (
                <Badge 
                  key={`size-${size}`}
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  {size}
                  <button 
                    onClick={() => handleFilterChange('sizes', size, true)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {activeFilters.inStock && (
                <Badge 
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  In Stock
                  <button 
                    onClick={() => handleFilterChange('inStock', false)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {activeFilters.onSale && (
                <Badge 
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  On Sale
                  <button 
                    onClick={() => handleFilterChange('onSale', false)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {activeFilters.newArrivals && (
                <Badge 
                  variant="outline"
                  className="pl-3 group border-white/30"
                >
                  New Arrivals
                  <button 
                    onClick={() => handleFilterChange('newArrivals', false)}
                    className="ml-1 px-1.5 rounded-full inline-flex items-center justify-center text-sm group-hover:bg-white group-hover:text-black"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              <Button 
                variant="link" 
                className="text-sm text-gray-400 hover:text-white p-0 h-auto"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </div>
          )}
          
          {/* Empty State */}
          {sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
              <Button 
                variant="outline" 
                className="border-white/30 hover:bg-white hover:text-black"
                onClick={resetFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            /* Products Grid */
            <ShopProductGrid 
              products={sortedProducts} 
              className={currentGridClassName}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Dialog (only rendered when open) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden">
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-full sm:w-96 bg-black border-l border-white/20 h-full overflow-y-auto">
              {/* Filter Header */}
              <div className="px-4 py-5 border-b border-white/20 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="hover:bg-white/10 rounded-full"
                >
                  <span className="sr-only">Close filters</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              
              {/* Filter Content */}
              <div className="px-4 py-6">
                <ProductFilter
                  collections={availableCollections}
                  sizes={availableSizes}
                  priceRanges={priceRanges}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  resetFilters={resetFilters}
                  isMobile={true}
                />
              </div>
              
              {/* Apply Filters Button */}
              <div className="px-4 py-4 border-t border-white/20 sticky bottom-0 bg-black">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-400 hover:text-white"
                    onClick={resetFilters}
                  >
                    Clear all
                  </Button>
                  <Button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    View results ({sortedProducts.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
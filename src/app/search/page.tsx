"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { ChevronLeft, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import ProductFilter from '@/components/shop/ProductFilter';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [activeFilters, setActiveFilters] = useState({
    collections: categoryParam ? [categoryParam] : [],
    priceRanges: [],
    sizes: [],
    inStock: false,
    onSale: false,
    newArrivals: false
  });
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  
  // Get unique categories and sizes for filters
  const availableCollections = Array.from(new Set(products.map(p => p.category))).filter(Boolean) as string[];
  const availableSizes = Array.from(new Set(products.flatMap(p => p.sizes)));
  const priceRanges = ["Under $25", "$25-$35", "$35-$50", "Over $50"];
  
  // Search logic
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (!query) {
        setSearchResults([]);
        setFilteredResults([]);
        setIsLoading(false);
        return;
      }
      
      const results = products.filter(product => {
        return product.name.toLowerCase().includes(query.toLowerCase()) ||
               product.description?.toLowerCase().includes(query.toLowerCase()) ||
               product.category?.toLowerCase().includes(query.toLowerCase());
      });
      
      setSearchResults(results);
      setFilteredResults(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Handle filtering
  useEffect(() => {
    const filtered = searchResults.filter(product => {
      // Collection filter
      if (
        activeFilters.collections.length > 0 && 
        !activeFilters.collections.includes(product.category ?? '')
      ) {
        return false;
      }
      
      // Size filter
      if (
        activeFilters.sizes.length > 0 &&
        !activeFilters.sizes.some(size => product.sizes.includes(size))
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
    
    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      switch(sortOrder) {
        case 'price-asc':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-desc':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'relevance':
        default:
          // By default, sort by how closely the name matches the query
          const aNameMatch = a.name.toLowerCase().indexOf(query.toLowerCase());
          const bNameMatch = b.name.toLowerCase().indexOf(query.toLowerCase());
          
          if (aNameMatch === -1 && bNameMatch === -1) return 0;
          if (aNameMatch === -1) return 1;
          if (bNameMatch === -1) return -1;
          return aNameMatch - bNameMatch;
      }
    });
    
    setFilteredResults(sorted);
  }, [searchResults, activeFilters, sortOrder, query]);
  
  // Filter change handler
  const handleFilterChange = (
    filterType: 'collections' | 'priceRanges' | 'sizes' | 'inStock' | 'onSale' | 'newArrivals',
    value: string | boolean,
    remove?: boolean
  ) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'collections' || filterType === 'priceRanges' || filterType === 'sizes') {
        const valueStr = value as string;
        const currentValues = [...newFilters[filterType]];
        
        if (remove) {
          newFilters[filterType] = currentValues.filter(item => item !== valueStr);
        } else {
          if (!currentValues.includes(valueStr)) {
            newFilters[filterType] = [...currentValues, valueStr];
          }
        }
      } else {
        newFilters[filterType] = value as boolean;
      }
      
      return newFilters;
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      collections: [],
      priceRanges: [],
      sizes: [],
      inStock: false,
      onSale: false,
      newArrivals: false
    });
    setSortOrder('relevance');
  };
  
  // Count active filters for badge
  const activeFilterCount = 
    activeFilters.collections.length +
    activeFilters.priceRanges.length +
    activeFilters.sizes.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.newArrivals ? 1 : 0);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search Results'}
          </h1>
          <p className="text-muted-foreground">
            {isLoading 
              ? 'Searching our collection...' 
              : filteredResults.length === 0 
                ? 'No products found. Try a different search term or browse our collections.' 
                : `Found ${filteredResults.length} product${filteredResults.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
        
        {/* Mobile Filters and Sort */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <ProductFilter
                  availableFilters={{ 
                    collections: availableCollections, 
                    sizes: availableSizes, 
                    priceRanges 
                  }}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  isMobile={true}
                />
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                  <Button className="flex-1">Apply Filters</Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Sort By</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <div className="grid gap-2">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'newest', label: 'Newest First' },
                    { value: 'rating', label: 'Highest Rated' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={sortOrder === option.value ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => setSortOrder(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-lg flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-8 text-xs"
                  >
                    Reset All
                  </Button>
                )}
              </div>
              
              <ProductFilter
                availableFilters={{ 
                  collections: availableCollections, 
                  sizes: availableSizes, 
                  priceRanges 
                }}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
              
              {/* Desktop Sort Options */}
              <div className="mt-8">
                <h3 className="font-medium mb-3">Sort By</h3>
                <div className="grid gap-2">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'newest', label: 'Newest First' },
                    { value: 'rating', label: 'Highest Rated' }
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`text-left px-2 py-1 rounded-md text-sm ${
                        sortOrder === option.value 
                          ? 'bg-accent text-accent-foreground font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                      onClick={() => setSortOrder(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          
          {/* Search Results */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-square rounded-lg mb-3"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                <Button asChild>
                  <Link href="/collections">Browse All Products</Link>
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ShopProductGrid 
                  products={filteredResults} 
                  gridClassName="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
} 
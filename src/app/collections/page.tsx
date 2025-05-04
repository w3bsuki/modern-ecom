"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, collections } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductSorting, MobileProductSorting } from "@/components/shop/ProductSorting";
import { Layout, Grid, ListFilter, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CollectionsPage() {
  // State for filtering and sorting
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [sortOption, setSortOption] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [isMounted, setIsMounted] = useState(false);
  
  // Get all available categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply filters and sorting to products
  useEffect(() => {
    if (!isMounted) return;
    
    setIsLoading(true);
    
    // Start with all products or category filtered products
    let result = [...products];
    
    // Apply category filter if active
    if (activeCategory) {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply price filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((product) => {
        const price = product.salePrice ?? product.price;
        return price >= min && price <= max;
      });
    }
    
    // Apply size filter
    if (filters.sizes?.length) {
      result = result.filter((product) => {
        // If product has no sizes or empty sizes array, skip this filter
        if (!product.sizes || product.sizes.length === 0) return true;
        // Check if any of the product sizes match the selected sizes
        return product.sizes.some((size) => filters.sizes.includes(size));
      });
    }
    
    // Apply collection filter
    if (filters.collections?.length) {
      result = result.filter((product) => 
        filters.collections.includes(product.collection)
      );
    }
    
    // Apply rating filter
    if (filters.rating) {
      result = result.filter(
        (product) => (product.rating || 0) >= filters.rating
      );
    }
    
    // Apply availability filters
    if (filters.availability?.length) {
      result = result.filter((product) => {
        if (filters.availability.includes("in_stock") && !product.inStock) {
          return false;
        }
        if (filters.availability.includes("on_sale") && !product.salePrice) {
          return false;
        }
        if (filters.availability.includes("new_arrival") && !product.isNew) {
          return false;
        }
        return true;
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case "popular":
        // Sort by popularity (based on a hypothetical field, or rating as fallback)
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        // Assuming we have a createdAt timestamp
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case "price_asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price_desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "discount":
        // Sort by discount percentage
        result.sort((a, b) => {
          const discountA = a.salePrice ? (a.price - a.salePrice) / a.price : 0;
          const discountB = b.salePrice ? (b.price - b.salePrice) / b.price : 0;
          return discountB - discountA;
        });
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (recommended or featured)
        break;
    }
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      setFilteredProducts(result);
      setIsLoading(false);
    }, 300);
  }, [activeCategory, filters, sortOption, isMounted]);
  
  if (!isMounted) {
    return null; // Prevent hydration issues
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/collections">Collections</BreadcrumbLink>
          </BreadcrumbItem>
          {activeCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{activeCategory}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {activeCategory ? `${activeCategory} Collection` : "All Collections"}
        </h1>
        <p className="text-gray-500">
          Discover our exclusive collection of premium products.
        </p>
      </div>
      
      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto pb-2">
        <Tabs
          defaultValue={activeCategory || "all"}
          onValueChange={(value) => setActiveCategory(value === "all" ? null : value)}
          className="w-full"
        >
          <TabsList className="flex flex-nowrap overflow-x-auto h-auto p-1 bg-muted/60">
            <TabsTrigger 
              value="all" 
              className="rounded-md flex-shrink-0"
            >
              All Products
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-md flex-shrink-0"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main content with filters and products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filters - Left Sidebar */}
        <div className="hidden md:block">
          <ProductFilters
            onFiltersChange={setFilters}
            totalProducts={filteredProducts.length}
          />
        </div>
        
        {/* Products section */}
        <div className="md:col-span-3">
          {/* Mobile filters and sorting */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[360px] p-0">
                <ProductFilters
                  onFiltersChange={setFilters}
                  totalProducts={filteredProducts.length}
                  isMobileView
                  onCloseMobile={() => {
                    // Access the close sheet method
                    document.querySelector('[data-sheet-close]')?.click();
                  }}
                />
              </SheetContent>
            </Sheet>
            
            <div className="flex-1">
              <MobileProductSorting 
                defaultSortOption={sortOption}
                onChange={setSortOption}
              />
            </div>
          </div>
          
          {/* Sorting, view toggle, and results info */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </div>
            
            <div className="flex items-center gap-4">
              {/* View toggle */}
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setGridView("grid")}
                  className={cn(
                    "p-1.5",
                    gridView === "grid" ? "bg-primary text-white" : "bg-white"
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={cn(
                    "p-1.5",
                    gridView === "list" ? "bg-primary text-white" : "bg-white"
                  )}
                  aria-label="List view"
                >
                  <Layout className="h-4 w-4" />
                </button>
              </div>
              
              {/* Desktop sorting */}
              <ProductSorting
                defaultSortOption={sortOption}
                onChange={setSortOption}
              />
            </div>
          </div>
          
          {/* No results message */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <ListFilter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search criteria.
              </p>
              <Button onClick={handleClearAll}>
                Clear All Filters
              </Button>
            </div>
          )}
          
          {/* Products grid */}
          <div className={cn(
            "grid gap-4",
            gridView === "grid" 
              ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              // Actual products
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  layout={gridView === "list" ? "horizontal" : "vertical"}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Helper function to clear all filters
  function handleClearAll() {
    setActiveCategory(null);
    setFilters({});
    setSortOption("popular");
  }
} 
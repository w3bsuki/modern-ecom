"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchAutocomplete({ isOpen, onClose }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Load recent searches from localStorage
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Extract all unique categories from products
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(product => product.category))
    ).filter(Boolean) as string[];
    
    setCategories(uniqueCategories);
  }, []);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay (would be a real API call in production)
    const timer = setTimeout(() => {
      const filtered = products.filter(product => {
        const matchesQuery = 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase());
          
        const matchesCategory = 
          !selectedCategory || 
          product.category === selectedCategory;
          
        return matchesQuery && matchesCategory;
      });
      
      setResults(filtered.slice(0, 5)); // Limit to top 5 results for better UX
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Save to recent searches
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
    
    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(query)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`);
    onClose();
  };

  const handleClearRecents = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 bg-background border-b border-border shadow-lg z-50 max-h-[80vh] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for hats, caps, beanies..."
                  className="pl-10 pr-10 py-6 text-base bg-background focus-visible:ring-primary"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </form>
              
              {/* Category Filters */}
              {categories.length > 0 && (
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by:</span>
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="rounded-full whitespace-nowrap"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Search Results */}
              <div className="mt-4 max-h-[50vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {query && results.length > 0 ? (
                      <div className="grid gap-4">
                        {results.map(product => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                              <div className="flex items-center mt-1">
                                <span className="font-semibold">
                                  ${product.salePrice?.toFixed(2) || product.price.toFixed(2)}
                                </span>
                                {product.salePrice && (
                                  <span className="ml-2 text-sm text-muted-foreground line-through">
                                    ${product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {product.isNew && (
                              <Badge variant="secondary" className="ml-auto">New</Badge>
                            )}
                            {product.isSale && (
                              <Badge variant="destructive" className="ml-auto">Sale</Badge>
                            )}
                          </Link>
                        ))}
                        
                        <Button
                          onClick={handleSearch}
                          variant="outline"
                          className="mt-2"
                        >
                          See all results <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : query ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">No results found for "{query}"</p>
                        <p className="text-sm text-muted-foreground">Try a different search term or browse our collections</p>
                      </div>
                    ) : recentSearches.length > 0 ? (
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Recent Searches</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-muted-foreground"
                            onClick={handleClearRecents}
                          >
                            Clear
                          </Button>
                        </div>
                        <div className="grid gap-2">
                          {recentSearches.map((term, index) => (
                            <button
                              key={`${term}-${index}`}
                              onClick={() => setQuery(term)}
                              className="flex items-center p-2 text-left rounded-lg hover:bg-accent transition-colors"
                            >
                              <Search className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Start typing to search our collection</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
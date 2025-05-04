"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Check, Filter, Sliders } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProductFilterProps {
  availableFilters: {
    collections: string[];
    sizes: string[];
    priceRanges: string[];
  };
  activeFilters: {
    collections: string[];
    sizes: string[];
    priceRanges: string[];
    inStock: boolean;
    onSale: boolean;
    newArrivals: boolean;
  };
  onFilterChange: (
    filterType: 'collections' | 'sizes' | 'priceRanges' | 'inStock' | 'onSale' | 'newArrivals',
    value: string | boolean,
    remove?: boolean
  ) => void;
  isMobile?: boolean;
}

export interface FilterOptions {
  collections: string[];
  sizes: string[];
  priceRanges: string[];
  inStock: boolean;
  onSale: boolean;
  newArrivals: boolean;
}

export default function ProductFilter({
  availableFilters,
  activeFilters,
  onFilterChange,
  isMobile = false
}: ProductFilterProps) {
  // Toggle states for collapsible sections
  const [expanded, setExpanded] = useState({
    collections: !isMobile,
    sizes: !isMobile,
    priceRange: !isMobile,
    other: !isMobile
  });

  const toggleSection = (section: 'collections' | 'sizes' | 'priceRange' | 'other') => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Count active filters
  const activeFilterCount = 
    activeFilters.collections.length + 
    activeFilters.sizes.length + 
    activeFilters.priceRanges.length + 
    (activeFilters.inStock ? 1 : 0) + 
    (activeFilters.onSale ? 1 : 0) + 
    (activeFilters.newArrivals ? 1 : 0);

  // Filter section component
  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: 'collections' | 'sizes' | 'priceRange' | 'other'; 
    children: React.ReactNode 
  }) => (
    <div className="space-y-3">
      <button 
        className="w-full flex items-center justify-between group"
        onClick={() => toggleSection(section)}
      >
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <span className="text-white/60 group-hover:text-white transition-colors">
          {expanded[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      
      {expanded[section] && (
        <div className="py-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-black rounded-lg p-4 space-y-5 border border-white/10 shadow-lg">
      {/* Header with active filters count */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-white/70" />
          <h2 className="text-white font-semibold">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <Badge variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Collections filter */}
      <FilterSection title="Collection" section="collections">
        <div className="space-y-2.5 pl-1">
          {availableFilters.collections.map(category => (
            <div key={category} className="flex items-center gap-2.5 group">
              <Checkbox 
                id={`collection-${category}`}
                checked={activeFilters.collections.includes(category)}
                onCheckedChange={(checked) => {
                  onFilterChange('collections', category, checked === false);
                }}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label 
                htmlFor={`collection-${category}`}
                className="text-sm text-white/80 group-hover:text-white cursor-pointer transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>
      
      <Separator className="bg-white/10" />
      
      {/* Size filter */}
      <FilterSection title="Size" section="sizes">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1">
          {availableFilters.sizes.map(size => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => onFilterChange('sizes', size, activeFilters.sizes.includes(size))}
              className={cn(
                "h-8 w-full py-0 px-2 text-xs font-normal",
                activeFilters.sizes.includes(size)
                  ? "bg-white text-black hover:bg-white/90 hover:text-black border-white"
                  : "bg-black text-white border-white/20 hover:border-white/60"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </FilterSection>
      
      <Separator className="bg-white/10" />
      
      {/* Price Range filter */}
      <FilterSection title="Price Range" section="priceRange">
        <div className="space-y-2.5 pl-1">
          {availableFilters.priceRanges.map(range => (
            <div key={range} className="flex items-center gap-2.5 group">
              <Checkbox 
                id={`price-${range}`}
                checked={activeFilters.priceRanges.includes(range)}
                onCheckedChange={(checked) => {
                  onFilterChange('priceRanges', range, checked === false);
                }}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label 
                htmlFor={`price-${range}`}
                className="text-sm text-white/80 group-hover:text-white cursor-pointer transition-colors"
              >
                {range}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>
      
      <Separator className="bg-white/10" />
      
      {/* Other filters (in stock, on sale, new arrivals) */}
      <FilterSection title="Other Filters" section="other">
        <div className="space-y-2.5 pl-1">
          <div className="flex items-center gap-2.5 group">
            <Checkbox 
              id="in-stock"
              checked={activeFilters.inStock}
              onCheckedChange={(checked) => {
                onFilterChange('inStock', !!checked);
              }}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label 
              htmlFor="in-stock"
              className="text-sm text-white/80 group-hover:text-white cursor-pointer transition-colors"
            >
              In Stock Only
            </label>
          </div>
          
          <div className="flex items-center gap-2.5 group">
            <Checkbox 
              id="on-sale"
              checked={activeFilters.onSale}
              onCheckedChange={(checked) => {
                onFilterChange('onSale', !!checked);
              }}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label 
              htmlFor="on-sale"
              className="text-sm text-white/80 group-hover:text-white cursor-pointer transition-colors"
            >
              On Sale
            </label>
          </div>
          
          <div className="flex items-center gap-2.5 group">
            <Checkbox 
              id="new-arrivals"
              checked={activeFilters.newArrivals}
              onCheckedChange={(checked) => {
                onFilterChange('newArrivals', !!checked);
              }}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label 
              htmlFor="new-arrivals"
              className="text-sm text-white/80 group-hover:text-white cursor-pointer transition-colors"
            >
              New Arrivals
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Clear all filters button (only shows when filters are active) */}
      {activeFilterCount > 0 && (
        <>
          <Separator className="bg-white/10" />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/20 text-white hover:bg-white hover:text-black transition-colors"
            onClick={() => {
              // Clear all filters
              availableFilters.collections.forEach(c => activeFilters.collections.includes(c) && onFilterChange('collections', c, true));
              availableFilters.sizes.forEach(s => activeFilters.sizes.includes(s) && onFilterChange('sizes', s, true));
              availableFilters.priceRanges.forEach(p => activeFilters.priceRanges.includes(p) && onFilterChange('priceRanges', p, true));
              activeFilters.inStock && onFilterChange('inStock', false);
              activeFilters.onSale && onFilterChange('onSale', false);
              activeFilters.newArrivals && onFilterChange('newArrivals', false);
            }}
          >
            <X size={14} className="mr-1.5" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
} 
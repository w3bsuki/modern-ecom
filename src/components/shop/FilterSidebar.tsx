"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Filter, X, ChevronDown, ChevronUp, 
  Check, MinusCircle, PlusCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface FilterSidebarProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string[]>;
  priceRange?: PriceRange;
  onFilterChange: (groupId: string, optionId: string) => void;
  onPriceChange?: (range: PriceRange) => void;
  onClearAll: () => void;
  className?: string;
  mobileView?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  filters,
  activeFilters,
  priceRange,
  onFilterChange,
  onPriceChange,
  onClearAll,
  className,
  mobileView = false,
  onCloseMobile,
}: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    // Initially expand all filter groups
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  );
  
  const [localPriceRange, setLocalPriceRange] = useState<PriceRange>(
    priceRange || { min: 0, max: 500 }
  );
  
  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (count, options) => count + options.length, 
    0
  );
  
  // Toggle filter group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: !expandedGroups[groupId],
    });
  };
  
  // Handle price range change
  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange = { ...localPriceRange, [type]: value };
    setLocalPriceRange(newRange);
    onPriceChange?.(newRange);
  };
  
  // Check if a filter option is active
  const isFilterActive = (groupId: string, optionId: string) => {
    return activeFilters[groupId]?.includes(optionId);
  };
  
  return (
    <div className={cn(
      "w-full bg-white border-r border-gray-200 h-full flex flex-col",
      mobileView ? "fixed inset-0 z-50" : "max-w-[280px]",
      className
    )}>
      {/* Header - only shown in mobile view */}
      {mobileView && (
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <h2 className="font-medium text-lg">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button 
            onClick={onCloseMobile} 
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Filters header - desktop view */}
      {!mobileView && (
        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <h2 className="font-medium">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-black underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
      
      {/* Filter groups */}
      <div className="flex-1 overflow-y-auto">
        {filters.map((group) => (
          <div key={group.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex w-full items-center justify-between py-4 px-3 hover:bg-gray-50"
            >
              <span className="font-medium text-sm">{group.name}</span>
              <div>
                {expandedGroups[group.id] ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
            </button>
            
            {expandedGroups[group.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pb-2"
              >
                <div className="px-3 space-y-1">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onFilterChange(group.id, option.id)}
                      className={cn(
                        "flex w-full items-center justify-between py-2 px-2 rounded-sm text-sm",
                        isFilterActive(group.id, option.id)
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="w-5 h-5 flex items-center justify-center mr-2">
                          {isFilterActive(group.id, option.id) ? (
                            <Check size={14} />
                          ) : null}
                        </span>
                        <span>{option.label}</span>
                      </div>
                      {option.count !== undefined && (
                        <span className={cn(
                          "text-xs",
                          isFilterActive(group.id, option.id)
                            ? "text-gray-200"
                            : "text-gray-500"
                        )}>
                          ({option.count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ))}
        
        {/* Price range filter */}
        {onPriceChange && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleGroup("price")}
              className="flex w-full items-center justify-between py-4 px-3 hover:bg-gray-50"
            >
              <span className="font-medium text-sm">Price Range</span>
              <div>
                {expandedGroups["price"] ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
            </button>
            
            {expandedGroups["price"] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 pb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-[45%]">
                    <label htmlFor="min-price" className="text-xs text-gray-500 mb-1 block">Min Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        id="min-price"
                        type="number"
                        value={localPriceRange.min}
                        onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                        min={0}
                        aria-label="Minimum price"
                        title="Minimum price"
                        className="w-full border border-gray-300 rounded-sm py-1.5 pl-6 pr-2 text-sm focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                  
                  <div className="text-gray-400">—</div>
                  
                  <div className="w-[45%]">
                    <label htmlFor="max-price" className="text-xs text-gray-500 mb-1 block">Max Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        id="max-price"
                        type="number"
                        value={localPriceRange.max}
                        onChange={(e) => handlePriceChange("max", Number(e.target.value))}
                        min={localPriceRange.min}
                        aria-label="Maximum price"
                        title="Maximum price"
                        className="w-full border border-gray-300 rounded-sm py-1.5 pl-6 pr-2 text-sm focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Price slider would go here for a more advanced implementation */}
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer actions - only shown in mobile view */}
      {mobileView && (
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={onClearAll}
            className="text-sm font-medium underline"
          >
            Clear all filters
          </button>
          <button
            onClick={onCloseMobile}
            className="bg-black text-white px-5 py-2 text-sm font-medium rounded-sm"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterSidebar; 
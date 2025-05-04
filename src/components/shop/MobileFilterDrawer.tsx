"use client";

import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "./FilterSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterGroup {
  id: string;
  name: string;
  options: {
    id: string;
    label: string;
    count?: number;
  }[];
}

interface PriceRange {
  min: number;
  max: number;
}

interface MobileFilterDrawerProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string[]>;
  priceRange?: PriceRange;
  onFilterChange: (groupId: string, optionId: string) => void;
  onPriceChange?: (range: PriceRange) => void;
  onClearAll: () => void;
  activeFiltersCount: number;
}

export function MobileFilterDrawer({
  filters,
  activeFilters,
  priceRange,
  onFilterChange,
  onPriceChange,
  onClearAll,
  activeFiltersCount,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle opening the drawer
  const openDrawer = () => {
    // Lock scrolling on the body when drawer is open
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  };

  // Handle closing the drawer
  const closeDrawer = () => {
    document.body.style.overflow = "";
    setIsOpen(false);
  };

  return (
    <>
      {/* Filter button */}
      <Button
        onClick={openDrawer}
        variant="outline"
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:text-black"
      >
        <Filter size={16} />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeDrawer}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-50 shadow-lg"
            >
              <FilterSidebar
                filters={filters}
                activeFilters={activeFilters}
                priceRange={priceRange}
                onFilterChange={onFilterChange}
                onPriceChange={onPriceChange}
                onClearAll={onClearAll}
                mobileView={true}
                onCloseMobile={closeDrawer}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileFilterDrawer; 
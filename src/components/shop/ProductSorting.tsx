"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  BadgePercent,
  Clock,
  ListFilter,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SortOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const sortOptions: SortOption[] = [
  {
    id: "popular",
    label: "Most Popular",
    icon: <TrendingUp className="h-4 w-4 mr-2" />,
  },
  {
    id: "newest",
    label: "Newest First",
    icon: <Clock className="h-4 w-4 mr-2" />,
  },
  {
    id: "price_asc",
    label: "Price: Low to High",
    icon: <ArrowUp01 className="h-4 w-4 mr-2" />,
  },
  {
    id: "price_desc",
    label: "Price: High to Low",
    icon: <ArrowDown01 className="h-4 w-4 mr-2" />,
  },
  {
    id: "discount",
    label: "Biggest Discount",
    icon: <BadgePercent className="h-4 w-4 mr-2" />,
  },
  {
    id: "rating",
    label: "Highest Rated",
    icon: <Star className="h-4 w-4 mr-2" />,
  },
  {
    id: "name_asc",
    label: "Name: A to Z",
    icon: <ArrowDownAZ className="h-4 w-4 mr-2" />,
  },
  {
    id: "name_desc",
    label: "Name: Z to A",
    icon: <ArrowUpAZ className="h-4 w-4 mr-2" />,
  },
  {
    id: "recommended",
    label: "Recommended",
    icon: <Sparkles className="h-4 w-4 mr-2" />,
  },
];

interface ProductSortingProps {
  defaultSortOption?: string;
  onChange: (sortId: string) => void;
  className?: string;
  showLabel?: boolean;
}

export function ProductSorting({
  defaultSortOption = "popular",
  onChange,
  className,
  showLabel = true,
}: ProductSortingProps) {
  const [selectedSort, setSelectedSort] = useState(defaultSortOption);

  // Find the selected sort option details
  const selectedSortOption = sortOptions.find(
    (option) => option.id === selectedSort
  ) || sortOptions[0];

  // Update the parent component when sort changes
  useEffect(() => {
    onChange(selectedSort);
  }, [selectedSort, onChange]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-500 hidden sm:inline-block">
          Sort by:
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-9"
          >
            <span className="flex items-center">
              {selectedSortOption.icon}
              <span className="max-w-[120px] truncate">
                {selectedSortOption.label}
              </span>
            </span>
            <ListFilter className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              className={cn(
                "flex items-center cursor-pointer",
                selectedSort === option.id && "bg-accent font-medium"
              )}
              onClick={() => setSelectedSort(option.id)}
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Mobile-optimized version with a full-width button
export function MobileProductSorting({
  defaultSortOption = "popular",
  onChange,
}: Omit<ProductSortingProps, "className" | "showLabel">) {
  const [selectedSort, setSelectedSort] = useState(defaultSortOption);
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected sort option details
  const selectedSortOption = sortOptions.find(
    (option) => option.id === selectedSort
  ) || sortOptions[0];

  // Handle sort option selection
  const handleSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setIsOpen(false);
  };

  // Update the parent component when sort changes
  useEffect(() => {
    onChange(selectedSort);
  }, [selectedSort, onChange]);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-between"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center">
          {selectedSortOption.icon}
          <span>{selectedSortOption.label}</span>
        </span>
        <ListFilter className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sort By</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            className={cn(
              "w-full py-3 px-4 flex items-center text-left border-b",
              selectedSort === option.id && "bg-accent/20"
            )}
            onClick={() => handleSelect(option.id)}
          >
            <div 
              className={cn(
                "w-6 h-6 rounded-full border mr-3 flex items-center justify-center",
                selectedSort === option.id && "border-primary bg-primary text-white"
              )}
            >
              {selectedSort === option.id && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="flex items-center">
              {option.icon}
              <span>{option.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={() => setIsOpen(false)}>
          Apply
        </Button>
      </div>
    </div>
  );
} 
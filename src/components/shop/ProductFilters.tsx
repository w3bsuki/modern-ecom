"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  SlidersHorizontal, ChevronDown, ChevronUp, X, 
  FilterX, Check, ArrowDownUp, Star, CircleDollarSign 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterHeading, FilterLabel, FilterValue } from "@/components/ui/typography";

// Price range slider component
const PriceRangeSlider = ({ 
  min, max, value, onChange 
}: { 
  min: number; 
  max: number; 
  value: [number, number]; 
  onChange: (value: [number, number]) => void;
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <FilterValue>{formatCurrency(value[0])}</FilterValue>
        <FilterValue>{formatCurrency(value[1])}</FilterValue>
      </div>
      <Slider
        min={min}
        max={max}
        step={5}
        value={value}
        onValueChange={(vals) => onChange(vals as [number, number])}
        className="my-4"
      />
    </div>
  );
};

// Filter accordion component
const FilterAccordion = ({
  title,
  children,
  defaultOpen = false,
  icon
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const filterId = `filter-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="border-b pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3"
        aria-expanded={String(isOpen)}
        aria-controls={filterId}
        type="button"
      >
        <div className="flex items-center gap-2">
          {icon}
          <FilterHeading>{title}</FilterHeading>
        </div>
        <span className="sr-only">{isOpen ? "Collapse" : "Expand"} {title} filter</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <div 
        id={filterId}
        className={cn("overflow-hidden transition-all", isOpen ? "max-h-96" : "max-h-0")}
      >
        <div className="pt-2 pb-3">{children}</div>
      </div>
    </div>
  );
};

// Checkbox list component
const CheckboxGroup = ({
  options,
  selectedValues,
  onChange,
}: {
  options: { id: string; label: string; count?: number }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) => {
  const handleChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, id]);
    } else {
      onChange(selectedValues.filter((v) => v !== id));
    }
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) => handleChange(option.id, checked === true)}
          />
          <label
            htmlFor={option.id}
            className="flex justify-between w-full"
          >
            <FilterLabel>{option.label}</FilterLabel>
            {option.count !== undefined && (
              <FilterValue>({option.count})</FilterValue>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

// Star rating filter
const RatingFilter = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const isSelected = value === rating;
        return (
          <div key={rating} className="flex items-center">
            <button
              type="button"
              onClick={() => onChange(rating)}
              className={cn(
                "flex items-center space-x-2 rounded-md p-1.5 hover:bg-gray-100 w-full",
                isSelected && "bg-gray-100"
              )}
              aria-label={`${rating} stars and up`}
              aria-pressed={String(isSelected)}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <FilterLabel>&amp; Up</FilterLabel>
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Color selector
const ColorSelector = ({ 
  colors, 
  selectedColors, 
  onChange 
}: { 
  colors: { id: string; label: string; hex: string }[];
  selectedColors: string[];
  onChange: (colors: string[]) => void; 
}) => {
  const toggleColor = (id: string) => {
    if (selectedColors.includes(id)) {
      onChange(selectedColors.filter(c => c !== id));
    } else {
      onChange([...selectedColors, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const isSelected = selectedColors.includes(color.id);
        return (
          <button
            type="button"
            key={color.id}
            onClick={() => toggleColor(color.id)}
            className={cn(
              "w-8 h-8 rounded-full relative",
              isSelected && "ring-2 ring-offset-2 ring-black"
            )}
            aria-label={`${color.label} color`}
            aria-pressed={String(isSelected)}
            style={{ backgroundColor: color.hex }}
          >
            {isSelected && (
              <Check className="h-4 w-4 absolute inset-0 m-auto text-white" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Main filter component
export const ProductFilters = ({
  onFiltersChange,
  totalProducts,
  isMobileView = false,
  onCloseMobile
}: {
  onFiltersChange: (filters: any) => void;
  totalProducts: number;
  isMobileView?: boolean;
  onCloseMobile?: () => void;
}) => {
  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [availability, setAvailability] = useState<string[]>([]);

  // Mock data
  const sizeOptions = [
    { id: "xs", label: "XS", count: 12 },
    { id: "s", label: "S", count: 42 },
    { id: "m", label: "M", count: 56 },
    { id: "l", label: "L", count: 34 },
    { id: "xl", label: "XL", count: 28 },
    { id: "xxl", label: "XXL", count: 10 },
  ];

  const colorOptions = [
    { id: "black", label: "Black", hex: "#000000" },
    { id: "white", label: "White", hex: "#FFFFFF" },
    { id: "red", label: "Red", hex: "#FF0000" },
    { id: "blue", label: "Blue", hex: "#0000FF" },
    { id: "green", label: "Green", hex: "#00FF00" },
    { id: "yellow", label: "Yellow", hex: "#FFFF00" },
    { id: "purple", label: "Purple", hex: "#800080" },
    { id: "pink", label: "Pink", hex: "#FFC0CB" },
    { id: "brown", label: "Brown", hex: "#A52A2A" },
    { id: "gray", label: "Gray", hex: "#808080" },
  ];

  const categoryOptions = [
    { id: "hats", label: "Hats", count: 45 },
    { id: "caps", label: "Caps", count: 32 },
    { id: "beanies", label: "Beanies", count: 18 },
    { id: "fedoras", label: "Fedoras", count: 12 },
    { id: "visors", label: "Visors", count: 8 },
  ];

  const collectionOptions = [
    { id: "summer", label: "Summer", count: 28 },
    { id: "winter", label: "Winter", count: 24 },
    { id: "premium", label: "Premium", count: 16 },
    { id: "sport", label: "Sport", count: 22 },
    { id: "casual", label: "Casual", count: 30 },
  ];

  const availabilityOptions = [
    { id: "in_stock", label: "In Stock", count: 120 },
    { id: "on_sale", label: "On Sale", count: 35 },
    { id: "new_arrival", label: "New Arrival", count: 48 },
  ];

  // Update parent component with current filters
  useEffect(() => {
    onFiltersChange({
      priceRange,
      sizes,
      colors,
      categories,
      collections,
      rating,
      availability,
    });
  }, [priceRange, sizes, colors, categories, collections, rating, availability, onFiltersChange]);

  // Clear all filters
  const handleClearAll = () => {
    setPriceRange([0, 500]);
    setSizes([]);
    setColors([]);
    setCategories([]);
    setCollections([]);
    setRating(0);
    setAvailability([]);
  };

  // Get active filter count
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < 500) count++;
    if (sizes.length) count += sizes.length;
    if (colors.length) count += colors.length;
    if (categories.length) count += categories.length;
    if (collections.length) count += collections.length;
    if (rating > 0) count++;
    if (availability.length) count += availability.length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      priceRange[0] > 0 ||
      priceRange[1] < 500 ||
      sizes.length > 0 ||
      colors.length > 0 ||
      categories.length > 0 ||
      collections.length > 0 ||
      rating > 0 ||
      availability.length > 0
    );
  };

  // Filter header
  const renderHeader = () => (
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        <FilterHeading className="text-lg">Filters</FilterHeading>
      </div>
      <div className="flex items-center">
        <FilterValue>{totalProducts} products</FilterValue>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="ml-2 h-8 px-2 text-xs"
            aria-label="Clear all filters"
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn(
      "bg-white",
      isMobileView ? "fixed inset-0 z-50 flex flex-col h-full" : ""
    )}>
      {/* Mobile header */}
      {isMobileView && (
        <div className="border-b p-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={onCloseMobile} 
            className="p-1.5"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters content */}
      <div className={cn(
        "space-y-4", 
        isMobileView ? "flex-1 overflow-auto p-4 pb-24" : ""
      )}>
        {renderHeader()}

        {/* Price Range */}
        <FilterAccordion title="Price Range" defaultOpen icon={<CircleDollarSign className="h-4 w-4" />}>
          <PriceRangeSlider
            min={0}
            max={500}
            value={priceRange}
            onChange={setPriceRange}
          />
        </FilterAccordion>

        {/* Categories */}
        <FilterAccordion title="Categories">
          <CheckboxGroup
            options={categoryOptions}
            selectedValues={categories}
            onChange={setCategories}
          />
        </FilterAccordion>

        {/* Sizes */}
        <FilterAccordion title="Sizes">
          <CheckboxGroup
            options={sizeOptions}
            selectedValues={sizes}
            onChange={setSizes}
          />
        </FilterAccordion>

        {/* Colors */}
        <FilterAccordion title="Colors">
          <ColorSelector
            colors={colorOptions}
            selectedColors={colors}
            onChange={setColors}
          />
        </FilterAccordion>

        {/* Collections */}
        <FilterAccordion title="Collections">
          <CheckboxGroup
            options={collectionOptions}
            selectedValues={collections}
            onChange={setCollections}
          />
        </FilterAccordion>

        {/* Ratings */}
        <FilterAccordion title="Rating" icon={<Star className="h-4 w-4" />}>
          <RatingFilter value={rating} onChange={setRating} />
        </FilterAccordion>

        {/* Availability */}
        <FilterAccordion title="Availability">
          <CheckboxGroup
            options={availabilityOptions}
            selectedValues={availability}
            onChange={setAvailability}
          />
        </FilterAccordion>
      </div>

      {/* Mobile Actions */}
      {isMobileView && (
        <div className="border-t p-4 flex gap-3 sticky bottom-0 bg-white">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          <Button className="flex-1" onClick={onCloseMobile}>
            Show {totalProducts} Results
          </Button>
        </div>
      )}
    </div>
  );
}; 
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  itemCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  category: 'Womens' | 'Mens' | 'Accessories' | 'Children';
  season: 'Spring/Summer' | 'Fall/Winter' | 'All Year';
}

interface FilterOption {
  id: string;
  name: string;
}

interface CollectionShowcaseProps {
  title?: string;
  description?: string;
  collections: Collection[];
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
  maxCollections?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
  highlightNew?: boolean;
}

// Mock data - in a real app, this would come from an API
const demoCollections: Collection[] = [
  {
    id: "col1",
    name: "Summer Essentials",
    slug: "summer-essentials",
    description: "Lightweight fabrics and breathable styles for the warmest days",
    image: "/images/collections/summer-essentials.jpg",
    imageAlt: "Model wearing summer clothing",
    itemCount: 42,
    isNew: true,
    isFeatured: true,
    category: "Womens",
    season: "Spring/Summer"
  },
  {
    id: "col2",
    name: "Office Wear",
    slug: "office-wear",
    description: "Professional attire that combines comfort and style",
    image: "/images/collections/office-wear.jpg",
    imageAlt: "Professional office attire",
    itemCount: 36,
    isFeatured: true,
    category: "Mens",
    season: "All Year"
  },
  {
    id: "col3",
    name: "Casual Weekend",
    slug: "casual-weekend",
    description: "Relaxed styles for your days off",
    image: "/images/collections/casual-weekend.jpg",
    imageAlt: "Casual weekend outfits",
    itemCount: 28,
    category: "Womens",
    season: "All Year"
  },
  {
    id: "col4",
    name: "Evening Elegance",
    slug: "evening-elegance",
    description: "Sophisticated looks for special occasions",
    image: "/images/collections/evening-elegance.jpg",
    imageAlt: "Evening wear collection",
    itemCount: 24,
    category: "Womens",
    season: "Fall/Winter"
  },
  {
    id: "col5",
    name: "Athleisure",
    slug: "athleisure",
    description: "Athletic-inspired styles for everyday wear",
    image: "/images/collections/athleisure.jpg",
    imageAlt: "Athleisure collection",
    itemCount: 32,
    isNew: true,
    category: "Mens",
    season: "All Year"
  },
  {
    id: "col6",
    name: "Fall Favorites",
    slug: "fall-favorites",
    description: "Cozy and stylish pieces for the cooler months",
    image: "/images/collections/fall-favorites.jpg",
    imageAlt: "Fall fashion collection",
    itemCount: 30,
    category: "Womens",
    season: "Fall/Winter"
  },
  {
    id: "col7",
    name: "Statement Accessories",
    slug: "statement-accessories",
    description: "Bold accessories to elevate any outfit",
    image: "/images/collections/accessories.jpg",
    imageAlt: "Accessories collection",
    itemCount: 45,
    isFeatured: true,
    category: "Accessories",
    season: "All Year"
  },
  {
    id: "col8",
    name: "Kids Essentials",
    slug: "kids-essentials",
    description: "Stylish and practical clothing for children",
    image: "/images/collections/kids.jpg",
    imageAlt: "Children's clothing collection",
    itemCount: 38,
    category: "Children",
    season: "All Year"
  }
];

// Filter options
const categoryFilters: FilterOption[] = [
  { id: "all-categories", name: "All Categories" },
  { id: "womens", name: "Women's" },
  { id: "mens", name: "Men's" },
  { id: "accessories", name: "Accessories" },
  { id: "children", name: "Children" }
];

const seasonFilters: FilterOption[] = [
  { id: "all-seasons", name: "All Seasons" },
  { id: "spring-summer", name: "Spring/Summer" },
  { id: "fall-winter", name: "Fall/Winter" }
];

const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({
  title = "Our Collections",
  description = "Explore our carefully curated collections for every style and occasion",
  collections = demoCollections,
  showFilters = false,
  columns = 3,
  maxCollections,
  showViewAll = true,
  viewAllLink = "/collections",
  highlightNew = true
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all-categories");
  const [activeSeason, setActiveSeason] = useState<string>("all-seasons");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(collections);
  
  // Apply filters
  useEffect(() => {
    let result = [...collections];
    
    // Filter by category
    if (activeCategory !== "all-categories") {
      const categoryName = categoryFilters.find(f => f.id === activeCategory)?.name;
      if (categoryName) {
        const category = categoryName.endsWith("'s") 
          ? categoryName.replace("'s", "s") as 'Womens' | 'Mens' 
          : categoryName as 'Accessories' | 'Children';
        
        result = result.filter(col => col.category === category);
      }
    }
    
    // Filter by season
    if (activeSeason !== "all-seasons") {
      const seasonName = seasonFilters.find(f => f.id === activeSeason)?.name;
      if (seasonName) {
        result = result.filter(col => col.season === seasonName);
      }
    }
    
    // Apply maxCollections limit if specified
    if (maxCollections) {
      result = result.slice(0, maxCollections);
    }
    
    setFilteredCollections(result);
  }, [activeCategory, activeSeason, collections, maxCollections]);
  
  // Mobile filter toggle
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };
  
  // Collection card variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <>
            {/* Desktop Filters */}
            <div className="hidden md:block mb-8">
              <div className="flex justify-center flex-wrap gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveCategory(filter.id)}
                        className={cn(
                          "px-4 py-2 text-sm rounded-full transition-colors",
                          activeCategory === filter.id
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Season</h3>
                  <div className="flex flex-wrap gap-2">
                    {seasonFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveSeason(filter.id)}
                        className={cn(
                          "px-4 py-2 text-sm rounded-full transition-colors",
                          activeSeason === filter.id
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Filters */}
            <div className="md:hidden mb-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={toggleMobileFilters}
              >
                <span className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  Filter Collections
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    mobileFiltersOpen ? "transform rotate-180" : ""
                  )}
                />
              </Button>
              
              {mobileFiltersOpen && (
                <div className="mt-3 p-4 border rounded-lg bg-white">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveCategory(filter.id)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-full transition-colors",
                            activeCategory === filter.id
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Season</h3>
                    <div className="flex flex-wrap gap-2">
                      {seasonFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveSeason(filter.id)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-full transition-colors",
                            activeSeason === filter.id
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-xs"
                    onClick={() => {
                      setActiveCategory("all-categories");
                      setActiveSeason("all-seasons");
                    }}
                  >
                    <X size={12} className="mr-1" /> Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Applied filters summary */}
        {showFilters && (activeCategory !== "all-categories" || activeSeason !== "all-seasons") && (
          <div className="mb-6 flex items-center justify-center">
            <div className="text-sm text-gray-600">
              Showing:
              {activeCategory !== "all-categories" && (
                <span className="ml-1 font-medium">
                  {categoryFilters.find(f => f.id === activeCategory)?.name}
                </span>
              )}
              {activeCategory !== "all-categories" && activeSeason !== "all-seasons" && (
                <span className="mx-1">•</span>
              )}
              {activeSeason !== "all-seasons" && (
                <span className="font-medium">
                  {seasonFilters.find(f => f.id === activeSeason)?.name}
                </span>
              )}
              <button
                className="ml-2 text-black hover:underline flex items-center"
                onClick={() => {
                  setActiveCategory("all-categories");
                  setActiveSeason("all-seasons");
                }}
              >
                <X size={14} className="mr-1" /> Clear
              </button>
            </div>
          </div>
        )}
        
        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <motion.div 
            className={cn(
              "grid gap-6",
              columns === 2 ? "grid-cols-1 md:grid-cols-2" : 
              columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCollections.map((collection) => (
              <motion.div
                key={collection.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
              >
                <Link href={`/collection/${collection.slug}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  
                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h3 className="text-xl font-bold mb-1 group-hover:underline">{collection.name}</h3>
                    <p className="text-sm text-white/80 mb-3 line-clamp-2">{collection.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{collection.itemCount} items</span>
                      <span className="text-sm flex items-center group-hover:translate-x-1 transition-transform">
                        View Collection <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </div>
                  
                  {/* "New" Badge */}
                  {highlightNew && collection.isNew && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded z-10">
                      NEW
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {collection.isFeatured && (
                    <div className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 rounded z-10">
                      FEATURED
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No collections found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
            <Button
              onClick={() => {
                setActiveCategory("all-categories");
                setActiveSeason("all-seasons");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
        
        {/* View All Button */}
        {showViewAll && filteredCollections.length > 0 && (
          <div className="mt-10 text-center">
            <Link href={viewAllLink}>
              <Button variant="outline" className="group">
                View All Collections
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionShowcase; 
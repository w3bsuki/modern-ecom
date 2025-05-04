"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus, ArrowRight, ShoppingBag, Heart, Eye, Star, Flame, BadgePercent, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Product } from "@/lib/types";
import QuickView from "@/components/shop/QuickView";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  emoji: string;
  badge1: string;
  badge2: string;
  bgColor?: string;
  textColor?: string;
  image?: string;
}

interface FeaturedCollectionsClientProps {
  data: CategoryItem[];
  collections: Collection[];
}

export function FeaturedCollectionsClient({
  data,
  collections,
}: FeaturedCollectionsClientProps) {
  // Local state
  const [selection, setSelection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Handle responsive layout and set initial selection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    // Set initial selection to hot only on desktop
    if (window.innerWidth >= 1024) {
      setSelection("hot");
    }
    setIsLoaded(true);
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Item animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Handle quick view
  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(productId);
  };

  // Format price with currency
  const formatPrice = (price: number, discount: number = 0): JSX.Element => {
    const formattedPrice = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
    
    const formattedDiscount = discount ? new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price - (price * discount / 100)) : null;
    
    return (
      <div className="flex flex-col">
        <span className={cn("font-medium", discount ? "text-red-500 line-through text-xs" : "")}>
          {formattedPrice}
        </span>
        {discount > 0 && (
          <span className="font-semibold text-sm">{formattedDiscount}</span>
        )}
      </div>
    );
  };

  // Render star rating
  const renderRating = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={cn(
              i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
              "mr-0.5"
            )}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Helper function to determine icon based on category
  const getCategoryIcon = (id: string) => {
    switch(id) {
      case 'sale':
        return <BadgePercent className="size-6" />;
      case 'hot':
        return <Flame className="size-6" />;
      case 'new':
        return <Sparkles className="size-6" />;
      default:
        return null;
    }
  };

  // Mobile layout - Updated Styling
  if (isMobile) {
    return (
      <section ref={sectionRef} className="w-full bg-black py-6">
        <motion.div 
          className="grid grid-cols-1 gap-4 px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative block w-full h-48 overflow-hidden rounded-lg",
                  item.bgColor || "bg-black",
                  item.textColor || "text-white",
                  "border border-white/30 transition-all duration-300 hover:border-white/60 hover:brightness-110"
                )}
              >
                {/* Background Image - Now smaller with AspectRatio */}
                {item.image && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 relative">
                      <AspectRatio ratio={1/1}>
                        <Image 
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300 group-hover:scale-105"
                        />
                      </AspectRatio>
                    </div>
                    {/* Gradient overlay */}
                    <div className={cn(
                      "absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-300",
                      item.id === "hot" ? "bg-gradient-to-t from-black via-black/70 to-transparent" : 
                      "bg-gradient-to-t from-white/90 via-white/60 to-transparent"
                    )}></div>
                  </div>
                )}
                
                {/* Removed emoji watermark */}
                  
                <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                  {/* Updated Badge Styling */}
                  <div className='flex items-center gap-2'>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "backdrop-blur-sm text-xs",
                        item.textColor === "text-black" 
                          ? "bg-black/50 text-white border-white/40" 
                          : "bg-white/50 text-black border-black/40"
                      )}
                    >
                      {item.badge1}
                    </Badge>
                  </div>
                  
                  <div className="z-10">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(item.id)}
                      <h3 className={cn(
                        "text-3xl font-bold tracking-wider",
                        item.textColor || "text-white"
                      )}>
                        {item.title}
                      </h3>
                    </div>
                    
                    <p className={cn(
                      "text-sm mb-3",
                      item.textColor === "text-black" ? "text-black/70" : "text-gray-300"
                    )}>
                      {item.description}
                    </p>
                    
                    {/* Updated Button Styling */}
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "text-base font-medium",
                        item.textColor || "text-white"
                      )}>
                        Shop Collection
                      </div>
                      <motion.div 
                        className={cn(
                          "flex size-8 items-center justify-center transition-colors duration-300",
                          item.textColor === "text-black" 
                            ? "bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-black" 
                            : "bg-white text-black group-hover:bg-black group-hover:text-white group-hover:border-white",
                          "group-hover:border"
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpRight className="size-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {quickViewProductId && (
          <QuickView productId={quickViewProductId} onClose={() => setQuickViewProductId(null)} />
        )}
      </section>
    );
  }

  // Desktop layout - Updated Styling
  return (
    <section ref={sectionRef} className="w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full lg:aspect-[1336/460] relative border border-gray-200">
        <AnimatePresence>
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              data-state={selection === item.id ? "open" : "closed"}
              className={cn(
                'group relative overflow-hidden border-r border-gray-200 last:border-r-0 cursor-pointer',
                item.bgColor || "bg-black"
              )}
              onMouseEnter={() => {
                setSelection(item.id);
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                flex: selection === item.id ? 3 : 1
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                flex: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 }
              }}
            >
              <Link href={item.href} className="block w-full h-full">
                {/* Background */}
                <div className={cn(
                  "absolute inset-0 z-0",
                  item.bgColor || "bg-black"
                )}></div>
                
                {/* Background Image - Now smaller with AspectRatio */}
                {item.image && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="w-3/5 h-3/5 relative">
                      <AspectRatio ratio={1/1}>
                        <Image 
                          src={item.image}
                          alt={item.title}
                          fill
                          className={cn(
                            "object-cover transition-transform duration-700",
                            selection === item.id ? "opacity-50 scale-110" : "opacity-30",
                          )}
                        />
                      </AspectRatio>
                    </div>
                    {/* Gradient overlay */}
                    <div className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      item.id === "hot" ? "bg-gradient-to-t from-black via-black/70 to-transparent" : 
                      "bg-gradient-to-t from-white/90 via-white/60 to-transparent",
                      selection === item.id ? "opacity-80" : "opacity-60"
                    )}></div>
                  </div>
                )}
                
                {/* Removed emoji watermark */}
                
                {/* Content Area */}
                <div className="relative flex flex-col justify-between h-full p-8 z-10">
                  {/* Top section - Badges */}
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: selection === item.id ? 1 : 0.7 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "backdrop-blur-sm text-xs",
                        item.textColor === "text-black" 
                          ? "bg-black/50 text-white border-white/40" 
                          : "bg-white/50 text-black border-black/40"
                      )}
                    >
                      {item.badge1}
                    </Badge>
                    <AnimatePresence>
                      {selection === item.id && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "backdrop-blur-sm text-xs",
                              item.textColor === "text-black" 
                                ? "bg-black/50 text-white border-white/40" 
                                : "bg-white/50 text-black border-black/40"
                            )}
                          >
                            {item.badge2}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Bottom section - Title, Desc, CTA */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: selection === item.id ? 1 : 0.8, 
                          opacity: selection === item.id ? 1 : 0.7
                        }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          item.textColor || "text-white"
                        )}
                      >
                        {getCategoryIcon(item.id)}
                      </motion.div>
                      <motion.h3 
                        className={cn(
                          "text-3xl lg:text-4xl font-bold tracking-wider",
                          item.textColor || "text-white"
                        )}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1
                        }}
                        transition={{ duration: 0.3, delay: selection === item.id ? 0.2 : 0 }}
                      >
                        {item.title}
                      </motion.h3>
                    </div>

                    <AnimatePresence>
                      {selection === item.id && (
                        <motion.p
                          className={cn(
                            "mb-4 text-sm lg:text-base",
                            item.textColor === "text-black" ? "text-black/70" : "text-gray-300"
                          )}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    
                    {/* Updated CTA Button */}
                    <motion.div 
                      className="flex items-center justify-between gap-2"
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: selection === item.id ? 1 : 0.7 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={cn(
                        "text-base font-medium lg:text-lg",
                        item.textColor || "text-white"
                      )}>
                        Shop Collection
                      </div>
                      <motion.div 
                        className={cn(
                          "flex size-10 items-center justify-center transition-colors duration-300",
                          item.textColor === "text-black" 
                            ? "bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-black" 
                            : "bg-white text-black group-hover:bg-black group-hover:text-white group-hover:border-white",
                          "group-hover:border"
                        )}
                        whileHover={{ 
                          scale: 1.1,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpRight className="size-5" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {quickViewProductId && (
        <QuickView productId={quickViewProductId} onClose={() => setQuickViewProductId(null)} />
      )}
    </section>
  );
} 
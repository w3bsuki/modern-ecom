"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, Search, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWishlistItemCount } from "@/hooks/use-wishlist";
import { useCartTotalItems } from "@/hooks/use-cart";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

// Badge component with consistent styling
const Badge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  
  return (
    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
      {count > 9 ? "9+" : count}
    </span>
  );
};

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Get item counts from hooks
  const wishlistItemCount = useWishlistItemCount();
  const cartItemCount = useCartTotalItems();

  const toggleItem = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideDown = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <motion.div
        initial="closed"
        animate="open"
        exit="closed"
        variants={menuVariants}
        className="relative w-full max-w-xs sm:max-w-sm ml-auto h-full bg-background overflow-y-auto flex flex-col text-foreground shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-border bg-background flex-shrink-0">
          <h2 className="text-lg font-semibold uppercase tracking-wider">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="divide-y divide-border">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleItem(item.label)}
                        className={cn(
                          "flex items-center justify-between w-full py-3 px-4 text-left font-medium transition-colors duration-150",
                          isActive ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <span className="text-base uppercase tracking-wide">{item.label}</span>
                        <ChevronDown 
                          size={18} 
                          className={cn(
                            "transition-transform duration-300 text-muted-foreground", 
                            expandedItem === item.label ? "rotate-180" : ""
                          )} 
                        />
                      </button>
                      <AnimatePresence>
                        {expandedItem === item.label && (
                          <motion.ul
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={slideDown}
                            className="overflow-hidden bg-accent/50"
                          >
                            <div className="pl-8 pr-4 pb-2 pt-1 space-y-1">
                              {item.children.map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <li key={child.label}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "block py-1.5 text-sm transition-colors duration-150",
                                        isChildActive ? "text-black dark:text-white font-semibold" : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
                                      )}
                                      onClick={onClose}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                               })}
                            </div>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-3 px-4 text-base font-medium uppercase tracking-wide transition-colors duration-150",
                        isActive ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
             })}
          </ul>
        </nav>
        
        <div className="sticky bottom-0 p-4 border-t border-border bg-background mt-auto flex-shrink-0 space-y-3">
          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/cart" 
              onClick={onClose}
              className="flex items-center justify-center py-2 px-3 text-sm font-medium text-foreground bg-accent/50 rounded-md hover:bg-accent transition-colors duration-150"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Cart
              <Badge count={cartItemCount} />
            </Link>
            
            <Link 
              href="/wishlist" 
              onClick={onClose}
              className="flex items-center justify-center py-2 px-3 text-sm font-medium text-foreground bg-accent/50 rounded-md hover:bg-accent transition-colors duration-150"
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
              <Badge count={wishlistItemCount} />
            </Link>
          </div>
          
          {/* Shop button */}
          <Link href="/collections" onClick={onClose}>
            <Button 
              variant="default" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground uppercase font-semibold tracking-wide text-sm relative overflow-hidden group"
            >
              Shop Now
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-foreground/70 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
            </Button>
          </Link>
          
          {/* Search */}
          <Link
            href="/search"
            onClick={onClose}
            className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-foreground bg-transparent border border-border rounded-md hover:bg-accent/50 transition-colors duration-150"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Link>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
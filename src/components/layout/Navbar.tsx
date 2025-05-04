"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, ChevronDown, Instagram, ArrowRight, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { useCartTotalItems, useCartUpdates } from "@/hooks/use-cart";
import { useWishlistItemCount, useWishlistUpdates } from "@/hooks/use-wishlist";
import SearchAutocomplete from "@/components/shop/SearchAutocomplete";
import { MiniCartPreview } from "@/components/shop/MiniCartPreview";

// Dynamic imports for heavy components
const MobileMenu = lazy(() => import("./MobileMenu"));
const CartDrawer = lazy(() => import("../shop/CartDrawer"));
const WishlistDrawer = lazy(() => import("../shop/WishlistDrawer"));

// Loading fallbacks
const DrawerFallback = () => (
  <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background/60 backdrop-blur-lg">
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-foreground"></div>
    </div>
  </div>
);

interface NavChildItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChildItem[];
}

const navItems: NavItem[] = [
  {
    label: "New",
    href: "/new",
    children: [
      { label: "New Arrivals", href: "/new/arrivals" },
      { label: "Best Sellers", href: "/new/best-sellers" },
    ],
  },
  {
    label: "Products",
    href: "/product",
    children: [
      { label: "All Products", href: "/product" },
      { label: "Caps", href: "/product?category=caps" },
      { label: "Beanies", href: "/product?category=beanies" },
      { label: "Snapbacks", href: "/product?category=snapbacks" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Summer Collection", href: "/collections/summer" },
      { label: "Winter Collection", href: "/collections/winter" },
      { label: "Limited Edition", href: "/collections/limited-edition" },
    ],
  },
  {
    label: "Styles",
    href: "/styles",
    children: [
      { label: "Snapback", href: "/styles/snapback" },
      { label: "Fitted", href: "/styles/fitted" },
      { label: "Dad Hats", href: "/styles/dad-hats" },
      { label: "Beanies", href: "/styles/beanies" },
    ],
  },
  { label: "Sale", href: "/sale" },
];

// Social media icon component for consistency
const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-sm hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
    aria-label={label}
  >
    {children}
  </a>
);

// Navigation dropdown component
const NavDropdown = ({ 
  item, 
  isActive, 
  isDropdownActive, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  item: NavItem; 
  isActive: boolean; 
  isDropdownActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div
      className="relative flex items-center group h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="inline-flex items-center">
        <Link
          href={item.href}
          className={cn(
            "inline-flex items-center font-medium uppercase tracking-wide text-sm transition-colors duration-200 py-1",
            isActive ? "text-foreground font-semibold" : "text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white"
          )}
        >
          {item.label}
          {item.children && (
            <ChevronDown 
              className={cn(
                "ml-1 h-4 w-4 transition-transform duration-200",
                isDropdownActive ? "rotate-180" : "",
                isActive ? "text-foreground" : "text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-white"
              )} 
            />
          )}
        </Link>
        
        <div 
          className={cn(
            "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
            isActive || isDropdownActive ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </div>
      
      <AnimatePresence>
        {item.children && isDropdownActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-[7px] w-56 bg-background shadow-lg overflow-hidden border border-border rounded-b-md"
          >
            <div className="py-2">
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 font-medium transition-colors duration-150"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Badge component with optimized rendering
const Badge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold animate-fadeIn">
      {count > 9 ? "9+" : count}
    </span>
  );
};

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  
  const pathname = usePathname();
  const cartItemCount = useCartTotalItems();
  const wishlistItemCount = useWishlistItemCount();
  
  // Initialize cart and wishlist updates
  useCartUpdates();
  useWishlistUpdates();
  
  // Subscribe to scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };
  
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other drawers when mobile menu is opened
    if (!isMobileMenuOpen) {
      setCartOpen(false);
      setWishlistOpen(false);
    }
  };
  
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    // Close other drawers when search is opened
    setIsMobileMenuOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
  };
  
  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search logic here
      handleSearchClose();
    }
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
    // Close other drawers when cart is opened
    if (!cartOpen) {
      setIsMobileMenuOpen(false);
      setWishlistOpen(false);
    }
  };
  
  const toggleWishlist = () => {
    setWishlistOpen(!wishlistOpen);
    // Close other drawers when wishlist is opened
    if (!wishlistOpen) {
      setIsMobileMenuOpen(false);
      setCartOpen(false);
    }
  };

  // Handle hovering the cart button
  const handleCartMouseEnter = () => {
    // Only show the mini cart preview if the cart drawer is not open
    if (!cartOpen) {
      setIsCartHovered(true);
    }
  };
  
  const handleCartMouseLeave = () => {
    setIsCartHovered(false);
  };

  return (
    <div
      className={cn(
        "py-3 transition-all duration-300 bg-background",
        isScrolled ? "shadow-sm" : ""
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">
            HAT STORE
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 h-10">
            {navItems.map((item) => (
              <NavDropdown
                key={item.label}
                item={item}
                isActive={
                  pathname === item.href ||
                  (item.children?.some(child => pathname === child.href) ?? false)
                }
                isDropdownActive={activeDropdown === item.label}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/collections">
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase font-semibold tracking-wide text-sm relative overflow-hidden group"
              >
                Shop
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-foreground/70 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
              </Button>
            </Link>
            
            <button
              onClick={handleSearchOpen}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <ThemeToggle />
            
            <button
              onClick={toggleWishlist}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 relative focus:outline-none focus:ring-1 focus:ring-foreground"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <Badge count={wishlistItemCount} />
            </button>
            
            <div 
              className="relative" 
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <button
                ref={cartButtonRef}
                onClick={toggleCart}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 relative focus:outline-none focus:ring-1 focus:ring-foreground"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge count={cartItemCount} />
              </button>
              
              {/* Mini Cart Preview */}
              <MiniCartPreview isVisible={isCartHovered} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional: Add debug navigation as a separate banner only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="hidden md:block bg-gray-100 dark:bg-gray-800 py-1 mt-1">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="flex items-center space-x-4 text-xs">
              <span className="font-semibold">Debug:</span>
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/collections" className="hover:underline">Collections</Link>
              <Link href="/product" className="hover:underline">Products</Link>
              <Link href="/cart" className="hover:underline">Cart</Link>
              <Link href="/debug-products" className="hover:underline text-red-500">Debug Products</Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced search with autocomplete */}
      <SearchAutocomplete
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
      />
      
      {/* Dynamically loaded components with suspense */}
      {isMobileMenuOpen && (
        <Suspense fallback={<DrawerFallback />}>
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navItems={navItems} />
        </Suspense>
      )}
      
      {cartOpen && (
        <Suspense fallback={<DrawerFallback />}>
          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </Suspense>
      )}
      
      {wishlistOpen && (
        <Suspense fallback={<DrawerFallback />}>
          <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default Navbar; 
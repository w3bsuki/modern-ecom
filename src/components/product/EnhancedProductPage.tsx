"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, Heart, ShoppingBag, Share2, AlertTriangle } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicProductGallery } from "./DynamicProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductSpecs } from "./ProductSpecs";
import { DynamicProductReviews } from "./DynamicProductReviews";
import { RelatedProducts } from "./RelatedProducts";
import { products } from "@/data/products";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart, useCartActions } from "@/hooks/use-cart";
import { useWishlist, useWishlistActions, useIsInWishlist } from "@/hooks/use-wishlist";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useRecentlyViewedActions } from "@/hooks/use-recently-viewed";
import RecentlyViewedProducts from "./RecentlyViewedProducts";
import { Suspense } from "react";

interface EnhancedProductPageProps {
  product: Product;
}

// Break out ProductBreadcrumbs as a separate component
const ProductBreadcrumbs = ({ product }: { product: Product }) => {
  // Find the category/collection of the product
  const mainCategory = product.collections && product.collections.length > 0
    ? product.collections[0]
    : undefined;

  return (
    <motion.nav 
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4 } },
      }}
      className="flex items-center py-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      <Link href="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
      <Link href="/collections" className="text-gray-500 hover:text-primary transition-colors">
        Collections
      </Link>
      
      {mainCategory && (
        <>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link 
            href={`/collection/${mainCategory}`} 
            className="text-gray-500 hover:text-primary transition-colors"
          >
            {mainCategory}
          </Link>
        </>
      )}
      
      <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
      <span className="text-gray-900 dark:text-white font-medium truncate">
        {product.name}
      </span>
    </motion.nav>
  );
};

// Break out product details tabs as a separate component
const ProductDetailTabs = ({ product }: { product: Product }) => {
  return (
    <motion.div 
      className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b mb-8 pb-0 bg-transparent h-auto">
          <TabsTrigger 
            value="description"
            className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
          >
            Product Details
          </TabsTrigger>
          <TabsTrigger 
            value="shipping"
            className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
          >
            Shipping & Returns
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
          >
            Reviews
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="description" 
          className="mt-4 focus-visible:outline-none focus-visible:ring-0"
        >
          <Suspense fallback={<div className="h-60 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>}>
            <ProductSpecs product={product} />
          </Suspense>
        </TabsContent>
        
        <TabsContent 
          value="shipping" 
          className="mt-4 focus-visible:outline-none focus-visible:ring-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="grid md:grid-cols-2 gap-10">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 to-primary/20 rounded-full"></div>
                <h3 className="text-xl font-semibold mb-5 flex items-center">
                  Delivery Options
                </h3>
                
                {/* Shipping content would go here */}
                <p className="text-gray-600 dark:text-gray-400">
                  We offer various shipping options to ensure your hat arrives safely and on time.
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent 
          value="reviews" 
          className="mt-4 focus-visible:outline-none focus-visible:ring-0"
        >
          <Suspense fallback={<div className="h-80 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>}>
            <DynamicProductReviews product={product} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

// Break out mobile sticky add to cart as a separate component
const MobileStickyAddToCart = ({ 
  product, 
  isInWishlist, 
  isInCart, 
  handleAddToWishlist, 
  handleAddToCart 
}: { 
  product: Product;
  isInWishlist: boolean;
  isInCart: boolean;
  handleAddToWishlist: () => void;
  handleAddToCart: (quantity: number, size: string) => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-950 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] p-4 md:hidden border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {product.salePrice ? (
              <>
                <span className="text-red-600 dark:text-red-500">${product.salePrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <>${product.price.toFixed(2)}</>
            )}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddToWishlist}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Heart className={cn("h-5 w-5", isInWishlist ? "fill-red-500 text-red-500" : "")} />
          </Button>
          <Button
            onClick={() => handleAddToCart(1, product.sizes[0] || "One Size")}
            disabled={!product.inStock || isInCart}
            size="lg"
            className="h-12 gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            {isInCart ? "Added" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export function EnhancedProductPage({ product }: EnhancedProductPageProps) {
  const [isClient, setIsClient] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false);
  
  // Get cart functionality with selector hooks
  const { addItem } = useCartActions();
  const cartItems = useCart(state => state.items);
  const isInCart = cartItems.some((item) => item.id === product.id);
  
  // Get wishlist functionality with selector hooks
  const { toggleItem } = useWishlistActions();
  const isInWishlist = useIsInWishlist(product.id);
  
  // Get recently viewed actions
  const { addItem: addToRecentlyViewed } = useRecentlyViewedActions();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Add product to recently viewed
  useEffect(() => {
    // Only add to recently viewed on client-side
    if (typeof window !== 'undefined') {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);
  
  // Handle add to cart
  const handleAddToCart = (quantity: number, size: string) => {
    if (!product.inStock) {
      setShowStockAlert(true);
      return;
    }
    
    addItem(product, size, quantity);
    
    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    toggleItem(product);
  };
  
  // Find the category/collection of the product
  const mainCategory = product.collections && product.collections.length > 0
    ? product.collections[0]
    : undefined;

  return (
    <div className="bg-white dark:bg-black">
      <div className="container max-w-screen-xl mx-auto">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs product={product} />
        
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-8">
          {/* Product Gallery */}
          <div className="relative">
            <Suspense fallback={<div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
              <DynamicProductGallery 
                images={product.images} 
                alt={product.name}
                badges={{ 
                  isNew: product.isNew,
                  isSale: product.isSale
                }}
              />
            </Suspense>
            
            {/* Social Sharing */}
            <div className="hidden md:flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Share:
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:text-blue-600"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    }).catch(console.error);
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <Suspense fallback={<div className="h-full min-h-[400px] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
            <ProductInfo 
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              isInWishlist={isInWishlist}
              isInCart={isInCart}
            />
          </Suspense>
        </div>
        
        {/* Product Details Tabs */}
        <Suspense fallback={<div className="h-60 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"></div>}>
          <ProductDetailTabs product={product} />
        </Suspense>
        
        {/* Related Products */}
        <Suspense fallback={<div className="h-80 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg mt-12"></div>}>
          <RelatedProducts 
            currentProductId={product.id}
            category={mainCategory}
            products={products}
            title="You Might Also Like"
          />
        </Suspense>
        
        {/* Recently Viewed Products */}
        {isClient && (
          <Suspense fallback={<div className="h-80 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg mt-8"></div>}>
            <RecentlyViewedProducts 
              currentProductId={product.id}
            />
          </Suspense>
        )}
      </div>
      
      {/* Out of Stock Alert */}
      <AlertDialog open={showStockAlert} onOpenChange={setShowStockAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Out of Stock
            </AlertDialogTitle>
            <AlertDialogDescription>
              We're sorry, but {product.name} is currently out of stock. Would you like us to notify you when it's back in stock?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, thanks</AlertDialogCancel>
            <AlertDialogAction>Notify Me</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Mobile Sticky Add to Cart */}
      <MobileStickyAddToCart 
        product={product}
        isInWishlist={isInWishlist}
        isInCart={isInCart}
        handleAddToWishlist={handleAddToWishlist}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
} 
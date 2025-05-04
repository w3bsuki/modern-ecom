"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistItems, useWishlistActions } from "@/hooks/use-wishlist";
import { useCartActions } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function WishlistPage() {
  // Get data from wishlist store
  const [isMounted, setIsMounted] = useState(false);
  // Always call hooks, but use their values conditionally when rendering
  const wishlistItems = useWishlistItems();
  const { removeItem, clearWishlist } = useWishlistActions();
  const { addItem: addToCart } = useCartActions();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Force re-render when localStorage changes
    const onStorageChange = () => {
      setIsMounted(false);
      setTimeout(() => setIsMounted(true), 0);
    };
    
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle adding to cart
  const handleAddToCart = (item: any) => {
    if (!isMounted) return;
    
    // Skip if item is invalid
    if (!item || !item.id) {
      toast({
        title: "Error",
        description: "Could not add product to cart",
        variant: "destructive",
      });
      return;
    }
    
    // Use first size if available, or null if not
    const size = item.sizes && item.sizes.length > 0 ? item.sizes[0] : null;
    
    addToCart(item, size, 1);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Early return for non-client rendering
  if (!isMounted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // No items case
  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your wishlist yet. Explore our products to find something you'll love!
          </p>
          <Link 
            href="/collections"
            className="inline-flex items-center bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved to your wishlist
      </p>
      
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
        <div className="grid divide-y divide-gray-200 dark:divide-gray-800">
          {wishlistItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Link href={`/product/${item.id}`} className="block h-32 w-32 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    <Image
                      src={item.images?.[0] || "/images/hats/placeholder1.jpg"}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </div>
                
                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h2 className="text-lg font-medium">
                        <Link href={`/product/${item.id}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </h2>
                      {item.collection && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Collection: {item.collection}
                        </p>
                      )}
                      <p className="mt-2 font-medium">
                        {item.salePrice ? (
                          <>
                            <span className="text-red-600 dark:text-red-400">{formatPrice(item.salePrice)}</span>
                            <span className="ml-2 text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span>{formatPrice(item.price)}</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        size="sm"
                        className="w-full md:w-auto flex items-center justify-center"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto flex items-center justify-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  {/* Additional product details can go here */}
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <Link 
              href="/collections"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="text-sm"
              >
                Clear Wishlist
              </Button>
              
              <Button 
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-sm"
                onClick={() => {
                  wishlistItems.forEach(item => handleAddToCart(item));
                  toast({
                    title: "Added all to cart",
                    description: "All wishlist items have been added to your cart.",
                  });
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add All to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Truck, Shield, Star, ChevronRight, Heart, Share, Minus, Plus, Check, Ruler, Home, RotateCcw, Info, RefreshCw, Share2, X, Package, ThumbsUp, MessageSquare, MoreHorizontal, TruckIcon } from "lucide-react";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Rating } from "@/components/ui/rating";
import RelatedProducts from "./RelatedProducts";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "@/components/ui/use-toast";
import { usePathname } from 'next/navigation';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { RecentlyViewedProducts } from '@/components/product/RecentlyViewedProducts';
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductActions } from "@/components/product/ProductActions";
import { H3, H4, Paragraph, Muted, Lead, Large, Small } from "@/components/ui/typography";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const pathname = usePathname();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const [isMounted, setIsMounted] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track product view for recently viewed list
  useEffect(() => {
    if (product && isMounted) {
      addToRecentlyViewed(product);
    }
  }, [product, isMounted, addToRecentlyViewed]);

  // Find related products (same collection + not this product)
  const relatedProducts = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    
    addItem(product, selectedSize, quantity);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    if (!isMounted) return;
    
    toggleWishlist();
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > 10) return;
    setQuantity(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formattedPrice = formatPrice(product.price);
  const formattedSalePrice = product.salePrice ? formatPrice(product.salePrice) : null;
  
  // Calculate savings percentage
  const savingsPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  const toggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images[0],
        slug: product.slug,
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  // Handle size selection
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <motion.div 
      className="container max-w-7xl px-4 py-8 mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Breadcrumbs */}
      <motion.nav variants={fadeIn} className="flex items-center mb-6 text-sm">
        <Link href="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link href="/collections" className="text-gray-500 hover:text-primary transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link 
          href={`/collections?category=${product.category}`} 
          className="text-gray-500 hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </motion.nav>

      {/* Product Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Gallery */}
        <div className="md:sticky md:top-24 self-start">
          <ProductGallery product={product} />
        </div>
        
        {/* Product Information and Actions */}
        <div className="space-y-8">
          <ProductInfo 
            product={product} 
            onSizeSelect={handleSizeChange}
            selectedSize={selectedSize}
          />
          
          <ProductActions 
            product={product} 
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange}
          />
        </div>
      </div>

      {/* Product Details Accordion */}
      <motion.div 
        className="mt-16 border-t border-gray-200 pt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <H3 className="mb-6 text-2xl">Product Information</H3>
        
        <Accordion type="multiple" className="w-full space-y-5">
          <AccordionItem value="description" className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Product Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-6 bg-gradient-to-b from-muted/30 to-transparent">
              <div className="space-y-6">
                <Paragraph>
                  {product.longDescription || product.description}
                </Paragraph>
                
                {product.features && (
                  <div className="mt-6">
                    <H4 className="mb-3">Key Features</H4>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Shipping & Returns</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-6 bg-gradient-to-b from-muted/30 to-transparent">
              <div className="space-y-6">
                <div>
                  <H4 className="mb-4">Shipping Information</H4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <Paragraph className="font-medium">Free Standard Shipping</Paragraph>
                        <Muted className="mt-1">For orders over $50. Delivery in 5-7 business days.</Muted>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <TruckIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <Paragraph className="font-medium">Express Shipping</Paragraph>
                        <Muted className="mt-1">$12.99 - Delivery in 2-3 business days.</Muted>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border/50">
                  <H4 className="mb-4">Return Policy</H4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <RotateCcw className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <Paragraph className="font-medium">30-Day Returns</Paragraph>
                        <Muted className="mt-1">Return this item within 30 days of delivery for a full refund.</Muted>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <Paragraph className="font-medium">Free Return Shipping</Paragraph>
                        <Muted className="mt-1">Free return shipping for all orders.</Muted>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reviews" className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Reviews ({product.reviews || 24})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-6 bg-gradient-to-b from-muted/30 to-transparent">
              <ProductReviews productId={product.id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 border-t border-gray-200 pt-12"
        >
          <div className="flex items-center justify-between mb-8">
            <H3 className="text-2xl font-bold">You May Also Like</H3>
            <Link href="/collections" className="text-sm font-medium flex items-center hover:underline">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <Link
                key={`related-product-${relatedProduct.id}`}
                href={`/product/${relatedProduct.slug}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  
                  {relatedProduct.isSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                      Sale
                    </span>
                  )}
                  
                  {relatedProduct.isNew && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                      New
                    </span>
                  )}
                </div>
                
                <H3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                  {relatedProduct.name}
                </H3>
                
                <div className="flex items-center">
                  {relatedProduct.salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-600">
                        {formatPrice(relatedProduct.salePrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(relatedProduct.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">
                      {formatPrice(relatedProduct.price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Viewed Products */}
      {isMounted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <RecentlyViewedProducts 
            currentProductId={product.id} 
            className="pt-8 border-t"
          />
        </motion.div>
      )}
    </motion.div>
  );
} 
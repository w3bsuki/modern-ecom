"use client";

import { useState } from "react";
import { Truck, Shield, Star, Info, MessageSquare } from "lucide-react";
import { Product } from "@/types/product";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import { SizeGuideDialog } from "@/components/product/SizeGuideDialog";

interface ProductInfoProps {
  product: Product;
  onSizeSelect?: (size: string) => void;
  selectedSize?: string | null;
  className?: string;
}

export function ProductInfo({ 
  product, 
  onSizeSelect,
  selectedSize: externalSelectedSize,
  className 
}: ProductInfoProps) {
  const [internalSelectedSize, setInternalSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  
  // Use external state if provided, otherwise use internal state
  const selectedSize = externalSelectedSize !== undefined ? externalSelectedSize : internalSelectedSize;

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate savings percentage
  const savingsPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  // Handle size selection
  const handleSizeChange = (size: string) => {
    setInternalSelectedSize(size);
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };
  
  // Determine product type for size guide
  const getProductType = () => {
    const category = product.category?.toLowerCase() || '';
    if (category.includes('beanie')) return 'beanie';
    if (category.includes('cap')) return 'cap';
    if (category.includes('snapback')) return 'snapback';
    return 'hat';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Product Title and Ratings */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        
        <div className="flex items-center mt-2 space-x-2">
          <Rating value={product.rating || 4.5} readOnly />
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 24} reviews)
          </span>
        </div>
      </div>
      
      {/* Price */}
      <div className="flex items-center">
        {product.salePrice ? (
          <>
            <span className="text-2xl font-bold">{formatPrice(product.salePrice)}</span>
            <span className="ml-2 text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
            <Badge variant="destructive" className="ml-3">
              Save {savingsPercentage}%
            </Badge>
          </>
        ) : (
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>
      
      {/* Product Color (if applicable) */}
      {product.color && (
        <div className="space-y-2">
          <div className="font-medium">Color: {product.color}</div>
        </div>
      )}
      
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Size</span>
            <SizeGuideDialog 
              productType={getProductType()}
              productImage={product.images[0]} 
              className="text-blue-600 hover:text-blue-800 hover:underline"
              trigger={
                <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" type="button">
                  Size Guide
                </button>
              }
            />
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size)}
                className={cn(
                  "border rounded-md py-2 px-3 text-sm font-medium transition-all",
                  selectedSize === size
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-gray-300 hover:border-gray-800 dark:border-gray-700 dark:hover:border-gray-300"
                )}
                aria-label={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Stock Status */}
      <div className="flex items-center text-sm">
        <span className={cn(
          "h-2.5 w-2.5 rounded-full mr-2",
          product.inStock ? "bg-green-500" : "bg-red-500"
        )}></span>
        <span>
          {product.inStock ? "In stock" : "Out of stock"}
          {product.inStock && product.stockCount && ` (${product.stockCount} available)`}
        </span>
      </div>
      
      {/* Shipping Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
        <div className="flex items-start">
          <Truck className="h-5 w-5 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Free standard shipping on orders over $50
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm font-medium">Secure Checkout</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              100% protected and secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
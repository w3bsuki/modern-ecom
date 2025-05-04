"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
  compact?: boolean;
}

export function ProductCardSkeleton({ 
  className, 
  compact = false 
}: ProductCardSkeletonProps) {
  return (
    <Card className={cn(
      "h-full w-full overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800", 
      className
    )}>
      {/* Product Image Skeleton */}
      <div className="relative pt-[100%]">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-zinc-800" />
      </div>
      
      <CardContent className="p-3 pb-2 space-y-3">
        {/* Badge placeholder */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-14 bg-zinc-800" />
        </div>
        
        {/* Title placeholder */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800" />
        </div>
        
        {compact ? null : (
          <div className="flex items-center space-x-2 pt-1">
            {/* Rating stars */}
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-3 bg-zinc-800 mr-0.5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-8 bg-zinc-800" />
          </div>
        )}
        
        {/* Price placeholder */}
        <div className="pt-1 flex justify-between items-center">
          <Skeleton className="h-6 w-20 bg-zinc-800" />
          {compact ? null : <Skeleton className="h-6 w-12 bg-zinc-800" />}
        </div>
      </CardContent>
      
      <CardFooter className="px-3 pb-3 pt-0">
        {/* Add to cart button */}
        <Skeleton className="h-10 w-full bg-zinc-800 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function FeaturedProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductCarouselSkeleton() {
  return (
    <div className="flex overflow-hidden space-x-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-[240px] sm:w-[280px] lg:w-[320px] flex-shrink-0">
          <ProductCardSkeleton compact />
        </div>
      ))}
    </div>
  );
}

export default ProductCardSkeleton; 
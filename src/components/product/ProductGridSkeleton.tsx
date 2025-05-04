"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  columns = { sm: 2, md: 3, lg: 4 },
  className,
}: ProductGridSkeletonProps) {
  // Create an array of skeleton items
  const skeletonItems = Array.from({ length: count }, (_, i) => i);

  // Determine grid columns based on props
  const gridCols = `grid-cols-1 sm:grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className={cn(`grid ${gridCols} gap-4 md:gap-6`, className)}>
      {skeletonItems.map((item) => (
        <div key={item} className="group relative flex flex-col space-y-2">
          {/* Image skeleton */}
          <div className="relative w-full overflow-hidden rounded-md aspect-square bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-full w-full" />
            
            {/* Label skeleton */}
            <div className="absolute top-2 left-2 z-10">
              <Skeleton className="h-5 w-12 rounded-sm" />
            </div>
          </div>
          
          {/* Product info skeletons */}
          <div className="space-y-1 py-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-1/4 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
} 
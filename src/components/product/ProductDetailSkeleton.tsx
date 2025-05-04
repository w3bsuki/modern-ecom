import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Product details skeleton */}
        <div className="space-y-6">
          {/* Product title */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Price */}
          <Skeleton className="h-8 w-32" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Size selection */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Skeleton className="h-12 w-full sm:w-1/2" />
            <Skeleton className="h-12 w-full sm:w-1/2" />
          </div>
          
          {/* Features */}
          <div className="space-y-3 mt-6">
            <Skeleton className="h-5 w-28" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
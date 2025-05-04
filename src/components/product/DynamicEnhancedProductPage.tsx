"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

// Define props interface to match the original component
interface EnhancedProductPageProps {
  product: Product;
}

// Create a loading placeholder that matches the original component's structure
function EnhancedProductPageLoading() {
  return (
    <div className="bg-white dark:bg-black">
      <div className="container max-w-screen-xl mx-auto">
        {/* Breadcrumbs skeleton */}
        <div className="flex items-center py-4">
          <Skeleton className="h-4 w-16 mr-4" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-24 mx-2" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Product detail skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-8">
          {/* Product gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="w-16 h-16 rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Product info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Tabs skeleton */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex space-x-4 border-b mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        
        {/* Related products skeleton */}
        <div className="mt-12 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the actual component with loading state
const DynamicEnhancedProductPage = dynamic<EnhancedProductPageProps>(
  () => import('./EnhancedProductPage').then(mod => mod.EnhancedProductPage),
  {
    loading: () => <EnhancedProductPageLoading />,
  }
);

export { DynamicEnhancedProductPage }; 
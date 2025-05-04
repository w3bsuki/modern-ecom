"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

// Define props interface to match the original component
interface ProductReviewsProps {
  product: Product;
}

// Create a loading placeholder that matches the original component's structure
function ProductReviewsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <Skeleton className="lg:w-1/3 h-80 rounded-xl" />
        <div className="lg:w-2/3 space-y-6">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Dynamically import the actual component with loading state
const DynamicProductReviews = dynamic<ProductReviewsProps>(
  () => import('./ProductReviews').then(mod => mod.ProductReviews),
  {
    loading: () => <ProductReviewsLoading />,
    ssr: false, // Prevent server-side rendering of the reviews tab
  }
);

export { DynamicProductReviews }; 
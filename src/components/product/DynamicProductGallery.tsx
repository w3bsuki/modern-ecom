"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Define props interface to match the original component
interface ProductGalleryProps {
  images: string[];
  alt: string;
  badges?: {
    isNew?: boolean;
    isSale?: boolean;
  };
}

// Create a loading placeholder that matches the original component's structure
function ProductGalleryLoading() {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((_, index) => (
          <Skeleton key={index} className="min-w-16 h-16 rounded-md" />
        ))}
      </div>
    </div>
  );
}

// Dynamically import the actual component with loading state
const DynamicProductGallery = dynamic<ProductGalleryProps>(
  () => import('./ProductGallery').then(mod => mod.ProductGallery),
  {
    loading: () => <ProductGalleryLoading />,
    ssr: false, // Disable server-side rendering to further reduce initial bundle size
  }
);

export { DynamicProductGallery }; 
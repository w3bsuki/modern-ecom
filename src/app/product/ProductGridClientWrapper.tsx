"use client";

import { lazy } from 'react';
import dynamic from 'next/dynamic';
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Product } from "@/lib/types";

// Dynamically import the VirtualizedProductGrid component with ssr: false in this client component
const VirtualizedProductGrid = dynamic(
  () => import('@/components/shop/VirtualizedProductGrid').then(mod => ({ default: mod.VirtualizedProductGrid })),
  { ssr: false, loading: () => <ProductGridSkeleton /> }
);

interface ProductGridClientWrapperProps {
  products: Product[];
  gridClassName?: string;
  initialBatchSize?: number;
  batchSize?: number;
}

export default function ProductGridClientWrapper({
  products,
  gridClassName,
  initialBatchSize,
  batchSize
}: ProductGridClientWrapperProps) {
  return (
    <VirtualizedProductGrid
      products={products}
      gridClassName={gridClassName}
      initialBatchSize={initialBatchSize}
      batchSize={batchSize}
    />
  );
} 
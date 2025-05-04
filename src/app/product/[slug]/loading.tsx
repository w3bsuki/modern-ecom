import React from 'react';
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen">
      <ProductDetailSkeleton />
    </div>
  );
} 
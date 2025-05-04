"use client";

import React, { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import QuickView from "../shop/QuickView";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

interface ProductGridWithQuickViewProps {
  products: Product[];
  loading?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

export function ProductGridWithQuickView({
  products,
  loading = false,
  columns = { sm: 2, md: 3, lg: 4 },
  className = "",
}: ProductGridWithQuickViewProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Handle quick view open
  const handleQuickView = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  // Handle close
  const handleClose = () => {
    setQuickViewProduct(null);
  };

  // Determine grid columns based on props
  const gridCols = `grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  if (loading) {
    return <ProductGridSkeleton columns={columns} />;
  }

  return (
    <>
      <div className={`grid ${gridCols} gap-4 md:gap-6 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(productId, e) => {
              e.preventDefault();
              handleQuickView(productId);
            }}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default ProductGridWithQuickView; 
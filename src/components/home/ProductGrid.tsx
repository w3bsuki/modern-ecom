"use client";

import React from "react";
import ProductCard from "../product/ProductCard";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  collection?: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid; 
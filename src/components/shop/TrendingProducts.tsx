import React from 'react';
import { TrendingProductCard } from './TrendingProductCard';
import { getTrendingProducts } from '@/lib/api';

export const TrendingProducts = async () => {
  const trendingProducts = await getTrendingProducts();
  
  return (
    <section className="py-12 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Trending Hats</h2>
          <p className="mt-2 text-lg text-gray-600">
            Our most popular styles that everyone&apos;s wearing right now
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <TrendingProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}; 
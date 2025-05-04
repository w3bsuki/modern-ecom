import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import ResponsiveImage from '@/components/ui/responsive-image';

interface TrendingProductCardProps {
  product: Product;
}

export const TrendingProductCard: React.FC<TrendingProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative h-60 overflow-hidden">
        <Link href={`/shop/product/${product.id}`}>
          <ResponsiveImage
            src={product.images[0] || '/images/hats/placeholder1.jpg'}
            alt={product.name}
            size="card"
            aspectRatio="4:3"
            containerClassName="h-full"
            className="transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </Link>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
          )}
          {product.onSale && (
            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/shop/product/${product.id}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            {product.onSale && product.salePrice ? (
              <>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(product.salePrice)}</span>
                <span className="ml-2 text-xs text-gray-500 line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</span>
            )}
          </div>
          
          <div className="flex space-x-1">
            {product.colors && product.colors.slice(0, 3).map((color) => (
              <div 
                key={color}
                className="h-3 w-3 rounded-full border border-gray-200"
                style={{ 
                  backgroundColor: 
                    color === 'black' ? '#000' : 
                    color === 'white' ? '#fff' : 
                    color === 'red' ? '#f44336' : 
                    color === 'blue' ? '#2196f3' : 
                    color === 'green' ? '#4caf50' : 
                    color === 'yellow' ? '#ffeb3b' : 
                    color === 'purple' ? '#9c27b0' : 
                    color === 'gray' ? '#9e9e9e' : 
                    color === 'navy' ? '#001f3f' :
                    color === 'brown' ? '#795548' :
                    color === 'natural' ? '#e8d8c3' :
                    color === 'khaki' ? '#f0e68c' :
                    '#ddd'
                }}
                title={color}
              />
            ))}
            {product.colors && product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock brand data - in a real app, this would come from a database or API
const brands = [
  {
    id: 1,
    name: 'Brandname',
    logo: '/images/products/brand-1.png',
    href: '/collections?brand=brandname',
  },
  {
    id: 2,
    name: 'Fashion Co',
    logo: '/images/products/brand-2.png',
    href: '/collections?brand=fashionco',
  },
  {
    id: 3,
    name: 'Urban Style',
    logo: '/images/products/brand-3.png',
    href: '/collections?brand=urbanstyle',
  },
  {
    id: 4,
    name: 'Luxury Brand',
    logo: '/images/products/brand-4.png',
    href: '/collections?brand=luxurybrand',
  },
  {
    id: 5,
    name: 'Outdoor Gear',
    logo: '/images/products/brand-5.png',
    href: '/collections?brand=outdoorgear',
  },
  {
    id: 6,
    name: 'Sports Elite',
    logo: '/images/products/brand-6.png',
    href: '/collections?brand=sportselite',
  },
];

export function BrandsShowcase() {
  return (
    <section className="pt-10 pb-16 bg-white dark:bg-gray-900 text-gray-900 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-2 bg-white text-gray-900 border border-gray-200 uppercase text-xs tracking-wider">
              Featured Partners
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Our Featured Brands
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Discover quality products from our trusted brand partners
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Button 
              variant="outline" 
              className="text-gray-900 border-gray-300 hover:bg-transparent hover:border-gray-900 hover:text-gray-900"
              asChild
            >
              <Link href="/collections" className="flex items-center">
                View All Brands
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pb-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={brand.href}
                className="flex flex-col items-center group"
              >
                <div 
                  className={cn(
                    "bg-gray-50 rounded-lg p-6 w-full h-32 flex items-center justify-center",
                    "border border-gray-200 hover:border-gray-400 transition-colors duration-300"
                  )}
                >
                  <div className="relative w-full h-16">
                    {/* Fallback to a placeholder if image is not available */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
                        {brand.name}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="mt-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ruler, Info, Check } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  
  const staggerContainer = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Mock data - in a real app, these would come from the product data
  const dimensions = [
    { label: "Height", value: "4 inches" },
    { label: "Brim Width", value: "2.75 inches" },
    { label: "Weight", value: "3.2 oz" },
    { label: "Adjustable", value: product.sizes.includes("One Size") ? "Yes" : "No" }
  ];

  const features = [
    "Premium quality materials for exceptional durability",
    "Adjustable fit system for maximum comfort",
    "Stylish, versatile design for everyday wear",
    "Water-resistant finish to protect in light rain",
    "Breathable fabric for all-day comfort"
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-8"
    >
      <motion.div variants={fadeIn}>
        <h3 className="text-xl font-semibold mb-4">Product Description</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {product.description || `Experience premium quality and style with our ${product.name}. 
          Crafted with attention to detail, this hat combines comfort, durability, and fashion.`}
        </p>
        
        <div>
          <h4 className="font-medium text-lg mb-3">Key Features</h4>
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.li 
                key={`feature-${index}`}
                variants={{
                  initial: { opacity: 0, x: -10 },
                  animate: { 
                    opacity: 1, 
                    x: 0, 
                    transition: { duration: 0.3, delay: 0.1 * (index + 1) } 
                  }
                }}
                className="flex items-start group"
              >
                <div className="rounded-full p-1 bg-primary/10 text-primary dark:bg-primary/20 mr-3 mt-0.5 transform group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4" />
                </div>
                <span className="group-hover:text-primary transition-colors">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      <motion.div 
        variants={fadeIn}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <h4 className="font-medium text-lg mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-primary" />
          Materials & Care
        </h4>
        <div className="space-y-5 mb-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm dark:shadow-gray-800/20">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              Materials
            </h5>
            <p className="text-gray-700 dark:text-gray-300">
              {product.material || "Made from 100% premium cotton with high-quality stitching and hardware."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm dark:shadow-gray-800/20">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              Care Instructions
            </h5>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Hand wash with cold water</li>
              <li>Do not bleach</li>
              <li>Do not tumble dry</li>
              <li>Reshape while damp</li>
              <li>Air dry away from direct sunlight</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Ruler className="w-4 h-4 mr-2 text-primary" />
            Dimensions
          </h5>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {dimensions.map((dimension, index) => (
              <motion.div 
                key={`dimension-${index}`}
                variants={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.1 * (index + 1) }
                  }
                }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-900 p-3 rounded-md shadow-sm transition-all hover:shadow hover:border-primary/20"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm">{dimension.label}</p>
                <p className="font-medium dark:text-white">{dimension.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 
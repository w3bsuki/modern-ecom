'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, StarHalf, Eye, ShoppingCart, ChevronLeft, ChevronRight, Badge, Filter } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BestSellersProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

// Category filter types
type FilterCategory = 'all' | 'men' | 'women' | 'accessories';

const BestSellers = ({
  products = [],
  title = 'Trending Now',
  subtitle = 'Our most popular products based on sales'
}: BestSellersProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    
    // Check if the product belongs to the selected category
    if (product.categories) {
      return product.categories.some(cat => 
        cat.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return false;
  });

  // Generate star rating component based on rating value
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    return stars;
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Return available colors based on product
  const getAvailableColors = (product: Product) => {
    return product.colors || ["Black", "Navy", "Gray"];
  };

  // Return available sizes based on product
  const getAvailableSizes = (product: Product) => {
    return product.sizes || ["S", "M", "L", "XL"];
  };

  // Handle quantity changes
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "w-full py-24 px-4 md:px-8 relative overflow-hidden",
        "bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black transition-colors duration-500"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute bottom-10 -left-10 w-80 h-80 rounded-full bg-indigo-50/50 dark:bg-indigo-900/10 blur-3xl" 
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 mb-4">
              <Badge className="w-3.5 h-3.5 mr-1 inline-block" /> Top Picks
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">{subtitle}</p>
          </motion.div>
        </motion.div>

        {/* Category filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === 'all' 
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            )}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveFilter('men')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === 'men' 
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Men&apos;s Hats
          </button>
          <button
            onClick={() => setActiveFilter('women')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === 'women' 
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Women&apos;s Hats
          </button>
          <button
            onClick={() => setActiveFilter('accessories')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === 'accessories' 
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Accessories
          </button>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.05 * (index % 4) }}
                  className="group"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-100 dark:bg-gray-800 aspect-[3/4] shadow-sm hover:shadow-md transition-all duration-300">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className={cn(
                            "object-cover object-center transition-all duration-700",
                            hoveredProduct === product.id && product.images.length > 1 
                              ? "opacity-0 scale-105" 
                              : "opacity-100 group-hover:scale-105"
                          )}
                        />
                      )}
                      
                      {/* Secondary image on hover */}
                      {product.images.length > 1 && (
                        <Image
                          src={product.images[1]}
                          alt={`${product.name} - alternate view`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className={cn(
                            "object-cover object-center transition-all duration-700",
                            hoveredProduct === product.id ? "opacity-100 scale-105" : "opacity-0"
                          )}
                        />
                      )}
                      
                      {/* Badge container - fixed position for consistent layout */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.discount > 0 && (
                          <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={isInView ? { x: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + 0.1 * index }}
                            className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md"
                          >
                            {product.discount}% OFF
                          </motion.div>
                        )}
                        
                        {product.isNew && (
                          <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={isInView ? { x: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.4 + 0.1 * index }}
                            className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md"
                          >
                            NEW
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                      
                      {/* Quick actions buttons */}
                      <div className={cn(
                        "absolute left-0 right-0 bottom-0 p-3 flex justify-center space-x-3 transition-all duration-300 transform",
                        hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                      )}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleQuickView(e, product)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          aria-label="Quick view"
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Added to cart!'); }}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg truncate dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                        {product.name}
                        {product.inventory && product.inventory < 5 && (
                          <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-normal">
                            Only {product.inventory} left
                          </span>
                        )}
                      </h3>
                      
                      <div className="flex items-center space-x-1">
                        {renderRating(product.rating)}
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {product.discount > 0 ? (
                          <>
                            <span className="font-semibold dark:text-white">
                              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold dark:text-white">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {/* Color variants preview */}
                      <div className="flex items-center space-x-1 pt-1">
                        {getAvailableColors(product).slice(0, 3).map((color, i) => (
                          <div 
                            key={`${product.id}-color-${i}`} 
                            className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ 
                              backgroundColor: color.toLowerCase(),
                              borderColor: color.toLowerCase() === "black" ? "#333" : ""
                            }}
                          />
                        ))}
                        {getAvailableColors(product).length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{getAvailableColors(product).length - 3}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link 
            href="/collections/all" 
            className={cn(
              "inline-block px-8 py-3 border-2 border-black dark:border-white",
              "text-black dark:text-white font-medium rounded-full", 
              "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black", 
              "transition-all duration-300 shadow-sm hover:shadow-md"
            )}
          >
            View All Products
          </Link>
        </motion.div>
      </div>

      {/* Quick view modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold dark:text-white">{quickViewProduct.name}</h3>
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={closeQuickView}
                  title="Close quick view"
                  aria-label="Close quick view"
                >
                  <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                    {quickViewProduct.images[0] && (
                      <Image
                        src={quickViewProduct.images[0]}
                        alt={quickViewProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    )}
                  </div>
                  
                  {/* Thumbnail gallery */}
                  {quickViewProduct.images.length > 1 && (
                    <div className="flex space-x-2 mt-4">
                      {quickViewProduct.images.slice(0, 4).map((img, i) => (
                        <div 
                          key={`thumb-${i}`} 
                          className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                        >
                          <Image
                            src={img}
                            alt={`${quickViewProduct.name} - view ${i+1}`}
                            fill
                            sizes="64px"
                            className="object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderRating(quickViewProduct.rating)}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({quickViewProduct.reviews} reviews)
                    </span>
                  </div>
                  
                  <div>
                    {quickViewProduct.discount > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold dark:text-white">
                          ${(quickViewProduct.price * (1 - quickViewProduct.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 line-through">
                          ${quickViewProduct.price.toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs font-semibold px-2 py-1 rounded">
                          Save {quickViewProduct.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold dark:text-white">
                        ${quickViewProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    {quickViewProduct.description || "This premium hat is crafted with high-quality materials, ensuring both style and durability. Perfect for everyday wear or special occasions."}
                  </p>
                  
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-medium text-sm mb-3 dark:text-gray-300">Color</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableColors(quickViewProduct).map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "w-9 h-9 rounded-full border-2 transition-all duration-200",
                              selectedColor === color 
                                ? "border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20 ring-offset-2" 
                                : "border-gray-300 dark:border-gray-700"
                            )}
                            style={{ 
                              backgroundColor: color.toLowerCase(),
                              borderColor: color.toLowerCase() === "black" ? "#333" : ""
                            }}
                            aria-label={`Color: ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3 dark:text-gray-300">Size</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableSizes(quickViewProduct).map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "w-11 h-11 border rounded-md flex items-center justify-center transition-all duration-200",
                              selectedSize === size 
                                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium" 
                                : "border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                            )}
                            aria-label={`Size: ${size}`}
                          >
                            <span className="text-sm font-medium">{size}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3 dark:text-gray-300">Quantity</h4>
                      <div className="flex items-center max-w-[140px] h-11">
                        <button 
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="w-11 h-full border border-gray-300 dark:border-gray-700 rounded-l-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex-1 h-full border-t border-b border-gray-300 dark:border-gray-700 flex items-center justify-center font-medium">
                          {quantity}
                        </div>
                        <button 
                          onClick={incrementQuantity}
                          disabled={quantity >= 10}
                          className="w-11 h-full border border-gray-300 dark:border-gray-700 rounded-r-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Link
                      href={`/products/${quickViewProduct.slug}`}
                      className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-center rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      className={cn(
                        "px-6 py-3 border-2 border-black dark:border-white rounded-md transition-all duration-200 flex items-center justify-center",
                        (!selectedSize || !selectedColor) 
                          ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed border-gray-300 dark:border-gray-700" 
                          : "text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                      )}
                      disabled={!selectedSize || !selectedColor}
                      onClick={() => {
                        if (selectedSize && selectedColor) {
                          alert(`Added ${quantity} ${quickViewProduct.name} (${selectedColor}, ${selectedSize}) to cart!`);
                          closeQuickView();
                        }
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                  
                  {(!selectedSize || !selectedColor) && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Please select {!selectedColor ? 'a color' : ''}{(!selectedColor && !selectedSize) ? ' and ' : ''}{!selectedSize ? 'a size' : ''} to add to cart
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BestSellers; 
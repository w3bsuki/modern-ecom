'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import QuickView from '@/components/shop/QuickView';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingCarouselProps {
  products: Product[];
}

export function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(productId);
  };

  // Function to format price with discount
  const formatPrice = (price: number, discount: number = 0): JSX.Element => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <div className="flex items-end gap-2">
          <span className="text-white font-bold text-lg">${discountedPrice.toFixed(2)}</span>
          <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
          <span className="text-red-500 text-sm font-medium ml-1">({discount}% OFF)</span>
        </div>
      );
    }
    return <span className="text-white font-bold text-lg">${price.toFixed(2)}</span>;
  };

  // Function to render star rating
  const renderRating = (rating: number): JSX.Element => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />;
            } else if (i === fullStars && hasHalfStar) {
              return (
                <div key={i} className="relative">
                  <Star className="w-3.5 h-3.5 text-gray-600" />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              );
            } else {
              return <Star key={i} className="w-3.5 h-3.5 text-gray-600" />;
            }
          })}
        </div>
        <span className="text-xs text-white font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Create a duplicated array for proper infinite scroll
  // We only need to duplicate once to create the infinite effect
  const duplicatedProducts = [...products, ...products];

  return (
    <section className="w-full bg-black py-12 lg:py-16 border-t border-zinc-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-white/5"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
            Trending Now
          </h2>
          <div className="h-[2px] w-full max-w-[80px] bg-zinc-800 mt-3 relative">
            <motion.div 
              className="absolute h-[2px] bg-white inset-0"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <motion.p 
            className="text-zinc-400 mt-3 text-center max-w-md mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover our most popular styles that everyone is wearing right now
          </motion.p>
        </motion.div>
      </div>

      {/* Infinite Carousel */}
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`carousel-track ${isPaused ? 'paused' : ''}`}>
          {duplicatedProducts.map((product, index) => {
            const isHovered = hoveredId === product.id + '-' + index;
            // Get the ranking number for this product (1-based, mod by original products length)
            const rankingNumber = (index % products.length) + 1;
            
            return (
              <div 
                key={`${product.id}-${index}`} 
                className="product-card-wrapper"
                onMouseEnter={() => setHoveredId(product.id + '-' + index)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`product-card ${isHovered ? 'hovered' : ''}`}>
                  <div className="image-container">
                    <Image
                      src={product.images[0] || "/images/hats/placeholder.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 380px"
                      className="object-cover transition-transform duration-500"
                      priority={index < 4}
                    />
                    
                    {/* Secondary image */}
                    {isHovered && product.images.length > 1 && (
                      <div className="secondary-image">
                        <Image
                          src={product.images[1] || "/images/hats/placeholder.jpg"}
                          alt={`${product.name} - alternate view`}
                          fill
                          sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 380px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Centered Quick View Button */}
                    <div className="quick-view-overlay">
                      <button 
                        className="quick-view-button"
                        onClick={(e) => handleQuickView(product.id, e)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <button
                        className="action-button wishlist-button"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Product Labels */}
                    {product.discount > 0 ? (
                      <div className="discount-badge">
                        {product.discount}% OFF
                      </div>
                    ) : product.isNew ? (
                      <div className="new-badge">
                        NEW
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="info-container">
                    {/* Ranking number instead of category */}
                    <div className="ranking">
                      #{rankingNumber}
                    </div>
                    
                    <h3 className="title">
                      {product.name}
                    </h3>
                    
                    {/* PRICE DISPLAY - Prominently shown */}
                    <div className="price-action">
                      <div className="price">
                        {formatPrice(product.price, product.discount)}
                      </div>
                    </div>
                    
                    <div className="rating-container">
                      {renderRating(product.rating)}
                      {product.reviews > 0 && (
                        <span className="reviews">({product.reviews})</span>
                      )}
                    </div>
                    
                    {/* Centered Add Button */}
                    <div className="add-button-container">
                      <button 
                        className="add-button"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop All button */}
      <div className="flex justify-center mt-10">
        <Link 
          href="/collections" 
          className="shop-all-button"
        >
          <span className="relative z-10 flex items-center gap-1">
            Shop All Trending
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="button-bg"></div>
        </Link>
      </div>
      
      {/* QuickView dialog */}
      <AnimatePresence>
        {quickViewProductId && (
          <QuickView 
            product={products.find(p => p.id === quickViewProductId) || null} 
            isOpen={!!quickViewProductId} 
            onClose={() => setQuickViewProductId(null)} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-grid-white\/5 {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        
        /* Carousel Styling */
        .carousel-container {
          width: 100%;
          overflow: hidden;
          padding: 24px 0;
          margin-bottom: 10px;
        }

        .carousel-track {
          display: flex;
          gap: 30px;
          padding: 0 40px;
          animation: infiniteScroll 60s linear infinite;
          will-change: transform;
        }

        .carousel-track.paused {
          animation-play-state: paused;
        }
        
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* Product Card Wrapper */
        .product-card-wrapper {
          flex: 0 0 380px;
          width: 380px;
          height: 540px;
          position: relative;
          z-index: 1;
          padding: 4px;
        }
        
        /* Product Card */
        .product-card {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, rgba(28, 28, 28, 0.7), rgba(18, 18, 18, 0.95));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform: translateY(0);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          z-index: 1;
        }
        
        .product-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 80% 0%,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 60%
          );
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }
        
        /* Glowing effect on hover */
        .product-card-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: 22px;
          opacity: 0;
          transition: opacity 0.3s ease, box-shadow 0.3s ease;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 20%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 80%
          );
          border: 2px solid transparent;
        }
        
        .product-card-wrapper:hover::before {
          opacity: 1;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }
        
        .product-card.hovered {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 255, 255, 0.05);
        }
        
        /* Image Container */
        .image-container {
          position: relative;
          width: 100%;
          height: 360px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .image-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 75%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 3;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        
        .product-card.hovered .image-container::after {
          opacity: 0.5;
        }
        
        .product-card.hovered .image-container img {
          transform: scale(1.1);
          filter: brightness(1.1) contrast(1.05);
        }
        
        .image-container img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
          filter: saturate(1.05);
        }
        
        .secondary-image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 2;
        }
        
        .product-card.hovered .secondary-image {
          opacity: 1;
        }
        
        /* Quick View Overlay */
        .quick-view-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
          pointer-events: none;
        }
        
        .product-card:hover .quick-view-overlay {
          opacity: 1;
          pointer-events: auto;
        }
        
        .quick-view-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: white;
          color: black;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        
        .product-card:hover .quick-view-button {
          transform: translateY(0);
          opacity: 1;
        }
        
        .quick-view-button:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        /* Product Badges */
        .discount-badge, .new-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        
        .discount-badge {
          background: #e53e3e;
          color: white;
        }
        
        .new-badge {
          background: #38a169;
          color: white;
        }
        
        /* Action Buttons */
        .action-buttons {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 15;
        }
        
        .action-button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transform: translateX(50px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        
        .product-card:hover .action-button {
          transform: translateX(0);
          opacity: 1;
        }
        
        .action-button:hover {
          background: white;
        }
        
        .wishlist-button {
          transition-delay: 0.1s;
        }
        
        /* Ranking Style */
        .ranking {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 5px;
        }
        
        /* Info Container */
        .info-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          z-index: 5;
        }
        
        .title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
          transition: color 0.3s ease;
          line-height: 1.3;
          max-height: 42px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        /* Price & Action Styling */
        .price-action {
          margin: 6px 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .price {
          font-size: 18px;
          font-weight: 700;
          color: white;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 8px;
          width: 100%;
        }
        
        .rating-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        
        .reviews {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        /* Add Button */
        .add-button-container {
          margin-top: auto;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: white;
          color: black;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 10px;
          width: 100%;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          transform: translateY(0);
        }
        
        .add-button:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        /* Shop All Button */
        .shop-all-button {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .shop-all-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .button-bg {
          position: absolute;
          inset: 0;
          background: white;
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .shop-all-button:hover .button-bg {
          transform: scaleX(1);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .carousel-track {
            gap: 20px;
            padding: 0 20px;
          }
          
          .product-card-wrapper {
            flex: 0 0 340px;
            width: 340px;
            height: 500px;
          }
          
          .image-container {
            height: 320px;
          }
          
          .add-button {
            width: 90%;
            padding: 10px 18px;
            font-size: 0.875rem;
          }
          
          .quick-view-button {
            padding: 10px 22px;
            font-size: 0.875rem;
          }
          
          .info-container {
            padding: 16px;
          }
        }
        
        @media (max-width: 639px) {
          .carousel-track {
            gap: 16px;
            padding: 0 16px;
          }
          
          .product-card-wrapper {
            flex: 0 0 300px;
            width: 300px;
            height: 460px;
          }
          
          .image-container {
            height: 280px;
          }
          
          .info-container {
            padding: 14px;
          }
          
          .title {
            font-size: 1.1rem;
            height: 44px;
          }
          
          .add-button {
            width: 100%;
            padding: 8px 14px;
            font-size: 0.75rem;
          }
          
          .quick-view-button {
            padding: 8px 16px;
            font-size: 0.75rem;
          }
          
          .action-button {
            width: 36px;
            height: 36px;
          }
          
          .product-card.hovered {
            transform: translateY(-4px) scale(1.01);
          }
        }
      `}</style>
    </section>
  );
}

export default TrendingCarousel; 
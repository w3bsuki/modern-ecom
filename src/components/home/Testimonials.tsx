"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  productImage?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Fashion Enthusiast",
    avatar: "/images/testimonials/avatar-1.jpg",
    rating: 5,
    text: "I've purchased several products from this store and I'm always impressed with the quality. The customer service is outstanding too!",
    product: "Premium Fedora",
    productImage: "/images/testimonials/product-1.jpg"
  },
  {
    id: 2,
    name: "Samantha Lee",
    title: "Style Blogger",
    avatar: "/images/testimonials/avatar-2.jpg",
    rating: 4.5,
    text: "As a style blogger, I'm very particular about where I shop. This store consistently delivers trendy, high-quality items that my followers love!",
    product: "Classic Beanie",
    productImage: "/images/testimonials/product-2.jpg"
  },
  {
    id: 3,
    name: "Michael Torres",
    title: "Regular Customer",
    avatar: "/images/testimonials/avatar-3.jpg",
    rating: 5,
    text: "The shipping is always fast and the packaging is eco-friendly. I appreciate businesses that care about sustainability.",
    product: "Vintage Snapback",
    productImage: "/images/testimonials/product-3.jpg"
  },
  {
    id: 4,
    name: "Emily Chen",
    title: "Fashion Designer",
    avatar: "/images/testimonials/avatar-4.jpg",
    rating: 4.5,
    text: "The quality of materials used in these products is exceptional. As a designer myself, I can truly appreciate the craftsmanship.",
    product: "Summer Straw Hat",
    productImage: "/images/testimonials/product-4.jpg"
  }
];

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoPlay, handleNext]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  // Render star ratings
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }

    return stars;
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section 
      className={cn("bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We pride ourselves on quality products and exceptional customer service.
            Here&apos;s what some of our happy customers have to say.
          </p>
        </div>

        <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
          <div className="relative h-full">
            <div className="overflow-hidden">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Product image for desktop */}
                    {testimonials[currentIndex].productImage && (
                      <div className="hidden lg:block lg:w-1/3 relative">
                        <Image 
                          src={testimonials[currentIndex].productImage}
                          alt={testimonials[currentIndex].product || "Product"}
                          width={400}
                          height={500}
                          className="object-cover h-full w-full"
                        />
                        {testimonials[currentIndex].product && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
                            <p className="font-medium">{testimonials[currentIndex].product}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Testimonial content */}
                    <div className={`p-8 lg:p-12 ${testimonials[currentIndex].productImage ? 'lg:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center mb-6">
                        <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
                          <Image 
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            width={56}
                            height={56}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{testimonials[currentIndex].name}</h3>
                          <p className="text-gray-600">{testimonials[currentIndex].title}</p>
                        </div>
                        <div className="ml-auto flex">
                          {renderRating(testimonials[currentIndex].rating)}
                        </div>
                      </div>

                      {/* Product image for mobile */}
                      {testimonials[currentIndex].productImage && (
                        <div className="block lg:hidden w-full h-48 relative mb-6 rounded-lg overflow-hidden">
                          <Image 
                            src={testimonials[currentIndex].productImage}
                            alt={testimonials[currentIndex].product || "Product"}
                            width={400}
                            height={200}
                            className="object-cover h-full w-full"
                          />
                          {testimonials[currentIndex].product && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                              <p className="font-medium">{testimonials[currentIndex].product}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <blockquote className="text-xl text-gray-800 italic leading-relaxed mb-8">
                        &quot;{testimonials[currentIndex].text}&quot;
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-4">
              <button 
                onClick={handlePrevious}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNext}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </MotionConfig>

        {/* Dots navigation */}
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full mx-1 focus:outline-none ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

// Testimonial data - in a real app, this would come from an API or database
const testimonials = [
  {
    id: "t1",
    name: "Jessica Thompson",
    role: "Fashion Blogger",
    image: "/images/testimonials/person-1.jpg",
    productImage: "/images/hats/fedora-1.jpg",
    productName: "Classic Fedora",
    productSlug: "classic-fedora",
    quote: "This is by far the most comfortable and stylish piece I've purchased this year. The quality is outstanding and it goes with everything in my wardrobe!",
    rating: 5,
    location: "New York, US",
    verified: true
  },
  {
    id: "t2",
    name: "Mark Reynolds",
    role: "Creative Director",
    image: "/images/testimonials/person-2.jpg",
    productImage: "/images/hats/snapback-1.jpg",
    productName: "Modern Snapback",
    productSlug: "modern-snapback",
    quote: "I've received so many compliments wearing this. The attention to detail and craftsmanship makes it stand out from other brands I've tried.",
    rating: 5,
    location: "London, UK",
    verified: true
  },
  {
    id: "t3",
    name: "Sophia Chen",
    role: "Photographer",
    image: "/images/testimonials/person-3.jpg",
    productImage: "/images/hats/straw-hat-1.jpg",
    productName: "Summer Straw Hat",
    productSlug: "summer-straw-hat",
    quote: "Perfect for my summer photoshoots and personal style. The material feels premium and it's holding up beautifully even with daily wear.",
    rating: 4,
    location: "Los Angeles, US",
    verified: true
  }
];

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            "fill-current",
            i < rating ? "text-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
};

// Single testimonial card component
const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Testimonial header with person info */}
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image 
              src={testimonial.image} 
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <span>{testimonial.role}</span>
              <span>•</span>
              <span>{testimonial.location}</span>
            </div>
          </div>
        </div>
        
        {/* Product image and info */}
        <div className="mb-4 bg-gray-50 p-3 rounded-md flex items-center">
          <div className="relative w-16 h-16 rounded overflow-hidden mr-3">
            <Image 
              src={testimonial.productImage} 
              alt={testimonial.productName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Purchased</p>
            <Link 
              href={`/product/${testimonial.productSlug}`}
              className="font-medium text-black hover:underline"
            >
              {testimonial.productName}
            </Link>
          </div>
        </div>
        
        {/* Quote */}
        <div className="flex-grow mb-4 relative">
          <Quote className="absolute text-gray-200 w-8 h-8 -left-1 -top-2 opacity-50" />
          <p className="text-gray-700 italic pl-6 relative z-10">"{testimonial.quote}"</p>
        </div>
        
        {/* Footer with rating and verified badge */}
        <div className="flex items-center justify-between mt-auto">
          <StarRating rating={testimonial.rating} />
          {testimonial.verified && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Verified Purchase
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function CustomerTestimonials() {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-pattern"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <div className="h-1 w-20 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of fashion enthusiasts worldwide. Here's what they have to say about their experience with our products.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href="/reviews" 
            className="inline-flex items-center text-black font-medium hover:underline"
          >
            See all customer reviews
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default CustomerTestimonials; 
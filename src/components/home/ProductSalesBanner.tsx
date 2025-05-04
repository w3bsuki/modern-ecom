"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductSalesBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  discount?: string;
  endDate?: Date;
}

export function ProductSalesBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  discount,
  endDate,
}: ProductSalesBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate time remaining for countdown
  useEffect(() => {
    if (!endDate) return;
    
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return null; // Sale has ended
      }
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      if (!timeLeft) {
        clearInterval(timer);
      }
      setTimeLeft(timeLeft);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endDate]);
  
  // Format countdown values to two digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <motion.div 
      className="relative w-full bg-black text-white my-16 overflow-hidden"
      initial={{ opacity: 0.8 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImage} 
          alt={title} 
          fill 
          priority 
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-xl">
          {/* Discount badge */}
          {discount && (
            <motion.div 
              className="inline-block bg-red-600 text-white px-4 py-2 text-lg font-bold mb-6 rounded-md"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {discount} OFF
            </motion.div>
          )}
          
          {/* Title and subtitle */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-6 text-gray-200"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
          
          {/* Countdown timer */}
          {timeLeft && (
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm uppercase tracking-wider mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Limited Time Offer Ends In:
              </div>
              <div className="flex gap-4">
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md text-center min-w-16">
                  <div className="text-3xl font-bold">{formatNumber(timeLeft.days)}</div>
                  <div className="text-xs uppercase text-gray-300">Days</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md text-center min-w-16">
                  <div className="text-3xl font-bold">{formatNumber(timeLeft.hours)}</div>
                  <div className="text-xs uppercase text-gray-300">Hours</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md text-center min-w-16">
                  <div className="text-3xl font-bold">{formatNumber(timeLeft.minutes)}</div>
                  <div className="text-xs uppercase text-gray-300">Mins</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md text-center min-w-16">
                  <div className="text-3xl font-bold">{formatNumber(timeLeft.seconds)}</div>
                  <div className="text-xs uppercase text-gray-300">Secs</div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="relative z-10"
          >
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button 
                className={cn(
                  "relative overflow-hidden text-lg font-medium py-6 px-8",
                  "bg-white text-black hover:text-white"
                )}
                asChild
              >
                <Link href={ctaLink}>
                  <span className="relative z-10 flex items-center">
                    {ctaText}
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-black"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                  />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 
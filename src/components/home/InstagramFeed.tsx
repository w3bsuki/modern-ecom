"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Instagram post data
const instagramPosts = [
  {
    id: 1,
    image: '/images/hats/hat-1.jpg',
    caption: 'Perfect for summer days! #fashion #hats',
    likes: 124,
    comments: 12,
    url: 'https://instagram.com/',
  },
  {
    id: 2,
    image: '/images/hats/hat-2.jpg',
    caption: 'New collection just dropped 🔥 #style',
    likes: 231,
    comments: 18,
    url: 'https://instagram.com/',
  },
  {
    id: 3,
    image: '/images/hats/hat-3.jpg',
    caption: 'Weekend vibes with our classic hat #weekend',
    likes: 189,
    comments: 7,
    url: 'https://instagram.com/',
  },
  {
    id: 4,
    image: '/images/hats/hat-4.jpg',
    caption: 'Elegant and timeless design #classy',
    likes: 347,
    comments: 24,
    url: 'https://instagram.com/',
  },
  {
    id: 5,
    image: '/images/hats/hat-5.jpg',
    caption: 'Find your perfect fit #accessories',
    likes: 270,
    comments: 15,
    url: 'https://instagram.com/',
  },
  {
    id: 6,
    image: '/images/hats/hat-6.jpg',
    caption: 'Handcrafted with premium materials #quality',
    likes: 193,
    comments: 9,
    url: 'https://instagram.com/',
  },
];

export function InstagramFeed() {
  return (
    <section className="py-12 my-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-3"
          >
            <Instagram className="h-5 w-5 text-pink-500" />
            <span className="text-sm uppercase tracking-wider font-medium text-pink-500">
              @yourshopname
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Follow Us on Instagram
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-gray-600 dark:text-gray-400"
          >
            Share your style with us! Tag @yourshopname in your photos for a chance to be featured.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <InstagramPost key={post.id} post={post} index={index} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Button asChild>
            <Link 
              href="https://instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

interface InstagramPostProps {
  post: {
    id: number;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    url: string;
  };
  index: number;
}

function InstagramPost({ post, index }: InstagramPostProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="aspect-square relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={post.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="relative h-full w-full bg-gray-100 dark:bg-gray-800">
          <Image 
            src={post.image} 
            alt={post.caption}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4 text-white transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-center">
              <p className="text-sm line-clamp-2 mb-3">{post.caption}</p>
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments}</span>
                </div>
              </div>
            </div>
            <ExternalLink className="absolute bottom-3 right-3 h-4 w-4 opacity-70" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 
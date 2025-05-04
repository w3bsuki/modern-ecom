"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface BannerProps {
  message: string;
  link?: {
    text: string;
    url: string;
  };
}

export function Banner({ message, link }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2 px-4 text-center text-sm relative dark:bg-[#0a0a0a]">
      <div className="container mx-auto flex items-center justify-center">
        <p className="mr-3 font-medium tracking-wide">{message}</p>
        {link && (
          <a 
            href={link.url} 
            className="font-semibold hover:text-gray-300 transition-colors border-b border-white/30 hover:border-white pb-0.5 dark:hover:text-gray-200"
          >
            {link.text}
          </a>
        )}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 dark:hover:text-gray-200"
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Banner; 